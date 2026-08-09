from django.contrib import admin

from .models import (
    Alert,
    AnalysisReport,
    NewsArticle,
    Portfolio,
    PortfolioHolding,
    Stock,
    UserProfile,
    Watchlist,
    WatchlistItem,
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "display_name",
        "user",
        "auth_provider",
        "experience_level",
        "risk_tolerance",
        "investment_horizon",
        "onboarding_completed",
        "updated_at",
    )
    search_fields = ("display_name", "user__username", "user__email", "phone_number")
    list_filter = (
        "auth_provider",
        "experience_level",
        "risk_tolerance",
        "onboarding_completed",
    )


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ("symbol", "name", "exchange", "sector", "updated_at")
    search_fields = ("symbol", "name", "sector", "industry")
    list_filter = ("exchange", "sector")


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "created_at", "updated_at")
    search_fields = ("name", "user__username", "user__email")
    list_filter = ("created_at",)


@admin.register(PortfolioHolding)
class PortfolioHoldingAdmin(admin.ModelAdmin):
    list_display = ("portfolio", "stock", "quantity", "average_buy_price", "updated_at")
    search_fields = ("portfolio__name", "stock__symbol", "portfolio__user__username")
    list_filter = ("stock__exchange",)


@admin.register(Watchlist)
class WatchlistAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "created_at", "updated_at")
    search_fields = ("name", "user__username", "user__email")
    list_filter = ("created_at",)


@admin.register(WatchlistItem)
class WatchlistItemAdmin(admin.ModelAdmin):
    list_display = ("watchlist", "stock", "added_at")
    search_fields = ("watchlist__name", "stock__symbol", "watchlist__user__username")
    list_filter = ("added_at",)


@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ("user", "stock", "alert_type", "threshold", "is_active", "created_at")
    search_fields = ("user__username", "stock__symbol")
    list_filter = ("alert_type", "is_active", "created_at")


@admin.register(AnalysisReport)
class AnalysisReportAdmin(admin.ModelAdmin):
    list_display = ("stock", "user", "overall_signal", "created_at")
    search_fields = ("stock__symbol", "user__username", "summary")
    list_filter = ("overall_signal", "created_at")


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "stock", "source", "sentiment", "published_at")
    search_fields = ("title", "stock__symbol", "source", "summary")
    list_filter = ("source", "sentiment", "published_at")
