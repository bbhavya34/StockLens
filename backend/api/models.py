from django.conf import settings
from django.db import models


class Stock(models.Model):
    symbol = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    exchange = models.CharField(max_length=50)
    sector = models.CharField(max_length=120, blank=True)
    industry = models.CharField(max_length=120, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["symbol"]

    def __str__(self) -> str:
        return f"{self.symbol} - {self.name}"


class UserProfile(models.Model):
    class ExperienceLevel(models.TextChoices):
        BEGINNER = "BEGINNER", "Beginner"
        INTERMEDIATE = "INTERMEDIATE", "Intermediate"
        ADVANCED = "ADVANCED", "Advanced"

    class RiskTolerance(models.TextChoices):
        CONSERVATIVE = "CONSERVATIVE", "Conservative"
        MODERATE = "MODERATE", "Moderate"
        AGGRESSIVE = "AGGRESSIVE", "Aggressive"

    class InvestmentHorizon(models.TextChoices):
        SHORT_TERM = "SHORT_TERM", "Short term"
        MEDIUM_TERM = "MEDIUM_TERM", "Medium term"
        LONG_TERM = "LONG_TERM", "Long term"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    supabase_user_id = models.UUIDField(unique=True, null=True, blank=True)
    display_name = models.CharField(max_length=120, blank=True)
    phone_number = models.CharField(max_length=32, blank=True)
    avatar_url = models.URLField(max_length=1000, blank=True)
    bio = models.TextField(blank=True, max_length=500)
    experience_level = models.CharField(
        max_length=20,
        choices=ExperienceLevel.choices,
        default=ExperienceLevel.BEGINNER,
    )
    risk_tolerance = models.CharField(
        max_length=20,
        choices=RiskTolerance.choices,
        default=RiskTolerance.MODERATE,
    )
    investment_horizon = models.CharField(
        max_length=20,
        choices=InvestmentHorizon.choices,
        default=InvestmentHorizon.LONG_TERM,
    )
    preferred_market = models.CharField(max_length=80, blank=True)
    interests = models.JSONField(default=list, blank=True)
    auth_provider = models.CharField(max_length=40, blank=True)
    onboarding_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.display_name or self.user.get_username()


class Portfolio(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="portfolios",
    )
    name = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name", "id"]

    def __str__(self) -> str:
        return self.name


class PortfolioHolding(models.Model):
    portfolio = models.ForeignKey(
        Portfolio,
        on_delete=models.CASCADE,
        related_name="holdings",
    )
    stock = models.ForeignKey(
        Stock,
        on_delete=models.CASCADE,
        related_name="portfolio_holdings",
    )
    quantity = models.DecimalField(max_digits=20, decimal_places=6)
    average_buy_price = models.DecimalField(max_digits=20, decimal_places=4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["portfolio", "stock"],
                name="unique_stock_per_portfolio",
            ),
            models.CheckConstraint(
                condition=models.Q(quantity__gt=0),
                name="holding_quantity_positive",
            ),
            models.CheckConstraint(
                condition=models.Q(average_buy_price__gte=0),
                name="holding_price_nonnegative",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.portfolio}: {self.stock.symbol}"


class Watchlist(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="watchlists",
    )
    name = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name", "id"]

    def __str__(self) -> str:
        return self.name


class WatchlistItem(models.Model):
    watchlist = models.ForeignKey(
        Watchlist,
        on_delete=models.CASCADE,
        related_name="items",
    )
    stock = models.ForeignKey(
        Stock,
        on_delete=models.CASCADE,
        related_name="watchlist_items",
    )
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["watchlist", "stock"],
                name="unique_stock_per_watchlist",
            )
        ]

    def __str__(self) -> str:
        return f"{self.watchlist}: {self.stock.symbol}"


class Alert(models.Model):
    class AlertType(models.TextChoices):
        PRICE_ABOVE = "PRICE_ABOVE", "Price above"
        PRICE_BELOW = "PRICE_BELOW", "Price below"
        RSI_ABOVE = "RSI_ABOVE", "RSI above"
        RSI_BELOW = "RSI_BELOW", "RSI below"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="alerts",
    )
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name="alerts")
    alert_type = models.CharField(max_length=20, choices=AlertType.choices)
    threshold = models.DecimalField(max_digits=20, decimal_places=4)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    triggered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.stock.symbol}: {self.get_alert_type_display()} {self.threshold}"


class AnalysisReport(models.Model):
    stock = models.ForeignKey(
        Stock,
        on_delete=models.CASCADE,
        related_name="analysis_reports",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="analysis_reports",
        null=True,
        blank=True,
    )
    technical_analysis = models.JSONField(default=dict)
    fundamental_analysis = models.JSONField(default=dict)
    news_analysis = models.JSONField(default=dict)
    risk_analysis = models.JSONField(default=dict)
    overall_signal = models.CharField(max_length=50, blank=True)
    summary = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.stock.symbol} analysis at {self.created_at:%Y-%m-%d %H:%M}"


class NewsArticle(models.Model):
    stock = models.ForeignKey(
        Stock,
        on_delete=models.CASCADE,
        related_name="news_articles",
    )
    title = models.CharField(max_length=500)
    source = models.CharField(max_length=150)
    url = models.URLField(max_length=1000, unique=True)
    published_at = models.DateTimeField()
    sentiment = models.CharField(max_length=50, blank=True)
    sentiment_score = models.DecimalField(
        max_digits=6,
        decimal_places=5,
        null=True,
        blank=True,
    )
    summary = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-published_at"]

    def __str__(self) -> str:
        return self.title
