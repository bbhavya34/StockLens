from unittest.mock import patch
from uuid import uuid4

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import AnalysisReport, Portfolio, Stock, UserProfile


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
                "preferred_market": "India",
                "interests": ["Technology", "Long-term investing"],
                "onboarding_completed": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["experience_level"], "INTERMEDIATE")
        self.assertTrue(response.json()["onboarding_completed"])
