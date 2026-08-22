import os
from types import SimpleNamespace
from unittest.mock import patch
from uuid import uuid4

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import AnalysisReport, Portfolio, Stock, UserProfile
from .services.market_data import get_current_quote


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
