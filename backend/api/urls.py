from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AlertViewSet,
    AnalysisReportDetailView,
    AnalyzeView,
    FundamentalsView,
    NewsView,
    PortfolioViewSet,
    ProfileView,
    StockViewSet,
    TechnicalsView,
    WatchlistViewSet,
    health,
)


router = DefaultRouter()
router.register("stocks", StockViewSet, basename="stock")
router.register("portfolios", PortfolioViewSet, basename="portfolio")
router.register("watchlists", WatchlistViewSet, basename="watchlist")
router.register("alerts", AlertViewSet, basename="alert")

urlpatterns = [
    path("health/", health, name="health"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("stocks/<str:symbol>/technicals/", TechnicalsView.as_view(), name="technicals"),
    path(
        "stocks/<str:symbol>/fundamentals/",
        FundamentalsView.as_view(),
        name="fundamentals",
    ),
    path("stocks/<str:symbol>/news/", NewsView.as_view(), name="stock-news"),
    path("stocks/<str:symbol>/analyze/", AnalyzeView.as_view(), name="stock-analyze"),
    path("analysis/<int:pk>/", AnalysisReportDetailView.as_view(), name="analysis-detail"),
    path("", include(router.urls)),
]
