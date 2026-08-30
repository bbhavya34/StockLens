import os
from types import SimpleNamespace
from unittest.mock import patch
from uuid import uuid4

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import AnalysisReport, Portfolio, PortfolioHolding, Stock, UserProfile
from .agents.research_agent import ResearchAgent
from .services import DataProviderNotConfigured
from .services.fundamentals import get_fundamental_analysis
from .services.market_data import get_current_quote, normalize_yahoo_symbol
from .services.news import get_stock_news
from .services.risk import get_stock_risk


class PublicApiTests(APITestCase):
    def test_health(self) -> None:
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.json(),
            {"status": "ok", "service": "stocklens-backend"},
        )

    def test_empty_stock_list(self) -> None:
        response = self.client.get("/api/stocks/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), [])

    def test_unconfigured_market_data_is_structured(self) -> None:
        Stock.objects.create(symbol="TEST", name="Test Stock", exchange="TEST")
        response = self.client.get("/api/stocks/TEST/technicals/")
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertEqual(response.json()["error"], "market_data_provider_not_configured")

    def test_unconfigured_quote_is_structured(self) -> None:
        response = self.client.get("/api/stocks/AAPL/quote/")
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertEqual(response.json()["error"], "market_data_provider_not_configured")

    @patch("api.views.get_current_quote")
    def test_quote_returns_provider_data(self, get_quote) -> None:
        get_quote.return_value = {
            "symbol": "AAPL",
            "price": 225.5,
            "previous_close": 223.0,
            "change": 2.5,
            "change_percent": 1.121,
            "source": "Yahoo Finance",
        }
        response = self.client.get("/api/stocks/AAPL/quote/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["price"], 225.5)
        self.assertEqual(response.json()["source"], "Yahoo Finance")

    @patch("api.views.get_historical_data")
    def test_history_returns_provider_bars(self, get_history) -> None:
        get_history.return_value = [
            {
                "timestamp": "2026-08-21T00:00:00+00:00",
                "open": 220.0,
                "high": 226.0,
                "low": 219.0,
                "close": 225.5,
                "volume": 1000.0,
                "source": "Yahoo Finance",
            }
        ]
        response = self.client.get("/api/stocks/AAPL/history/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["symbol"], "AAPL")
        self.assertEqual(len(response.json()["bars"]), 1)


class MarketDataServiceTests(APITestCase):
    def test_common_nse_symbols_are_normalized(self) -> None:
        self.assertEqual(normalize_yahoo_symbol("RELIANCE"), "RELIANCE.NS")
        self.assertEqual(normalize_yahoo_symbol("tcs"), "TCS.NS")
        self.assertEqual(normalize_yahoo_symbol("AAPL"), "AAPL")

    @patch.dict(os.environ, {"MARKET_DATA_PROVIDER": "yfinance"})
    def test_quote_maps_yfinance_fast_info(self) -> None:
        fake_ticker = SimpleNamespace(
            fast_info={
                "last_price": 225.5,
                "previous_close": 223.0,
                "open": 224.0,
                "day_high": 227.0,
                "day_low": 222.5,
                "last_volume": 123456,
                "market_cap": 3_400_000_000_000,
                "currency": "USD",
                "exchange": "NMS",
                "timezone": "America/New_York",
            }
        )
        fake_yfinance = SimpleNamespace(Ticker=lambda symbol: fake_ticker)

        with patch.dict("sys.modules", {"yfinance": fake_yfinance}):
            quote = get_current_quote("aapl")

        self.assertEqual(quote["symbol"], "AAPL")
        self.assertEqual(quote["price"], 225.5)
        self.assertEqual(quote["change"], 2.5)
        self.assertAlmostEqual(quote["change_percent"], 1.121076, places=5)
        self.assertEqual(quote["source"], "Yahoo Finance")

    @patch("api.services.fundamentals.get_yfinance_ticker")
    def test_fundamentals_use_provider_metrics(self, get_ticker) -> None:
        get_ticker.return_value.get_info.return_value = {
            "longName": "Example Inc",
            "marketCap": 1_000_000,
            "forwardPE": 20,
            "priceToBook": 3,
            "revenueGrowth": 0.12,
            "earningsGrowth": 0.15,
            "profitMargins": 0.2,
            "returnOnEquity": 0.18,
            "debtToEquity": 40,
        }
        result = get_fundamental_analysis("TEST")
        self.assertEqual(result["signal"], "positive")
        self.assertEqual(result["source"], "Yahoo Finance")
        self.assertGreater(result["confidence"], 0.5)

    @patch("api.services.news.get_yfinance_ticker")
    def test_news_has_traceable_rule_based_sentiment(self, get_ticker) -> None:
        get_ticker.return_value.news = [{
            "content": {
                "title": "Company beats estimates with strong growth",
                "summary": "Record annual gain",
                "provider": {"displayName": "Example News"},
                "canonicalUrl": {"url": "https://example.com/story"},
                "pubDate": "2026-08-22T00:00:00Z",
            }
        }]
        articles = get_stock_news("TEST")
        self.assertEqual(len(articles), 1)
        self.assertEqual(articles[0]["sentiment"], "positive")
        self.assertGreater(articles[0]["sentiment_score"], 0)

    @patch("api.services.risk.get_historical_data")
    def test_risk_is_calculated_from_historical_closes(self, get_history) -> None:
        get_history.return_value = [
            {"timestamp": f"2026-01-{index + 1:02d}T00:00:00Z", "close": 100 + index + (-4 if index == 5 else 0), "source": "Yahoo Finance"}
            for index in range(20)
        ]
        result = get_stock_risk("TEST")
        self.assertEqual(result["observations"], 19)
        self.assertIn(result["risk_level"], {"low", "moderate", "high"})
        self.assertGreaterEqual(result["annualized_volatility"], 0)

    def test_synthesis_combines_agent_evidence(self) -> None:
        result = ResearchAgent().synthesize(
            symbol="TEST",
            technical={"signal": "bullish"},
            fundamental={"signal": "positive"},
            news={"articles": [{"sentiment_score": 0.5}]},
            risk={"risk_level": "moderate"},
        )
        self.assertEqual(result["status"], "complete")
        self.assertEqual(result["overall_signal"], "bullish")
        self.assertFalse(result["signal_conflict"])


class OwnershipTests(APITestCase):
    def setUp(self) -> None:
        user_model = get_user_model()
        self.owner = user_model.objects.create_user(username="owner", password="pass")
        self.other = user_model.objects.create_user(username="other", password="pass")
        self.owner_portfolio = Portfolio.objects.create(user=self.owner, name="Owner portfolio")
        self.other_portfolio = Portfolio.objects.create(user=self.other, name="Other portfolio")

    def test_private_lists_require_authentication(self) -> None:
        response = self.client.get("/api/portfolios/")
        self.assertIn(
            response.status_code,
            {status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN},
        )

    def test_portfolios_are_owner_scoped(self) -> None:
        self.client.force_authenticate(self.owner)
        response = self.client.get("/api/portfolios/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([item["id"] for item in response.json()], [self.owner_portfolio.id])

    def test_demo_portfolio_creates_all_supported_firms_idempotently(self) -> None:
        self.client.force_authenticate(self.owner)

        first = self.client.post("/api/portfolios/demo/", format="json")
        second = self.client.post("/api/portfolios/demo/", format="json")

        self.assertEqual(first.status_code, status.HTTP_201_CREATED)
        self.assertEqual(second.status_code, status.HTTP_200_OK)
        self.assertEqual(
            {holding["stock_detail"]["symbol"] for holding in second.json()["holdings"]},
            {"TCS", "RELIANCE", "INFY", "HDFCBANK"},
        )
        self.assertEqual(
            Portfolio.objects.filter(user=self.owner, name="StockLens Demo Portfolio").count(),
            1,
        )
        self.assertEqual(
            PortfolioHolding.objects.filter(portfolio__user=self.owner, portfolio__name="StockLens Demo Portfolio").count(),
            4,
        )
        self.assertFalse(Portfolio.objects.filter(user=self.other, name="StockLens Demo Portfolio").exists())

    def test_private_analysis_is_not_visible_to_another_user(self) -> None:
        stock = Stock.objects.create(symbol="TEST", name="Test Stock", exchange="TEST")
        report = AnalysisReport.objects.create(
            stock=stock,
            user=self.other,
            summary="Evidence-backed summary",
        )
        self.client.force_authenticate(self.owner)
        response = self.client.get(f"/api/analysis/{report.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch("api.views.get_stock_risk")
    @patch("api.views.get_stock_news")
    @patch("api.views.get_fundamental_analysis")
    @patch("api.views.get_technical_analysis")
    @patch("api.views.get_current_quote")
    def test_research_returns_partial_result_when_one_provider_call_fails(
        self, get_quote, get_technical, get_fundamental, get_news, get_risk
    ) -> None:
        get_quote.return_value = {"price": 100.0, "retrieved_at": "2026-08-22T00:00:00Z"}
        get_technical.return_value = {"signal": "bullish", "confidence": 0.7, "data_timestamp": "2026-08-22T00:00:00Z"}
        get_fundamental.side_effect = DataProviderNotConfigured("fundamentals_unavailable")
        get_news.return_value = []
        get_risk.return_value = {"risk_level": "moderate", "confidence": 1.0, "data_timestamp": "2026-08-22T00:00:00Z"}
        self.client.force_authenticate(self.owner)

        response = self.client.post("/api/research/run/", {"symbol": "RELIANCE"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "partial")
        self.assertEqual(response.json()["agents"]["fundamental"]["status"], "unavailable")
        self.assertEqual(response.json()["agents"]["technical"]["status"], "complete")


class SupabaseAuthenticationTests(APITestCase):
    @patch("api.authentication._fetch_supabase_user")
    def test_bearer_token_provisions_and_returns_profile(self, fetch_user) -> None:
        supabase_id = uuid4()
        fetch_user.return_value = {
            "id": str(supabase_id),
            "email": "investor@example.com",
            "phone": "+919876543210",
            "user_metadata": {
                "full_name": "StockLens Investor",
                "avatar_url": "https://example.com/avatar.png",
            },
            "app_metadata": {"provider": "google"},
        }
        self.client.credentials(HTTP_AUTHORIZATION="Bearer valid-test-token")

        response = self.client.get("/api/profile/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["display_name"], "StockLens Investor")
        self.assertEqual(response.json()["email"], "investor@example.com")
        profile = UserProfile.objects.get(supabase_user_id=supabase_id)
        self.assertFalse(profile.user.has_usable_password())

    @patch("api.authentication._fetch_supabase_user")
    def test_profile_patch_is_limited_to_authenticated_user(self, fetch_user) -> None:
        supabase_id = uuid4()
        fetch_user.return_value = {
            "id": str(supabase_id),
            "email": "investor@example.com",
            "user_metadata": {},
            "app_metadata": {"provider": "phone"},
        }
        self.client.credentials(HTTP_AUTHORIZATION="Bearer valid-test-token")

        response = self.client.patch(
            "/api/profile/",
            {
                "display_name": "Bhavya",
                "experience_level": "INTERMEDIATE",
                "risk_tolerance": "MODERATE",
                "investment_horizon": "LONG_TERM",
                "investment_amount": "500000.00",
                "monthly_contribution": "25000.00",
                "investment_goal": "Build a long-term retirement portfolio",
                "existing_investments": "Index funds and Indian equities",
                "preferred_market": "India",
                "interests": ["Technology", "Long-term investing"],
                "onboarding_completed": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["experience_level"], "INTERMEDIATE")
        self.assertEqual(response.json()["investment_amount"], "500000.00")
        self.assertEqual(response.json()["monthly_contribution"], "25000.00")
        self.assertEqual(
            response.json()["investment_goal"],
            "Build a long-term retirement portfolio",
        )
        self.assertTrue(response.json()["onboarding_completed"])

    @patch("api.authentication._fetch_supabase_user")
    def test_profile_rejects_negative_investment_values(self, fetch_user) -> None:
        fetch_user.return_value = {
            "id": str(uuid4()),
            "email": "investor@example.com",
            "user_metadata": {},
            "app_metadata": {"provider": "google"},
        }
        self.client.credentials(HTTP_AUTHORIZATION="Bearer valid-test-token")

        response = self.client.patch(
            "/api/profile/",
            {"investment_amount": "-1.00"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("investment_amount", response.json())
