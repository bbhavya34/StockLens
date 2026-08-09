from rest_framework import serializers

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


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "username",
            "email",
            "phone_number",
            "display_name",
            "avatar_url",
            "bio",
            "experience_level",
            "risk_tolerance",
            "investment_horizon",
            "preferred_market",
            "interests",
            "auth_provider",
            "onboarding_completed",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "phone_number",
            "avatar_url",
            "auth_provider",
            "created_at",
            "updated_at",
        ]

    def validate_interests(self, value: object) -> list[str]:
        if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
            raise serializers.ValidationError("Interests must be a list of strings.")
        normalized = [item.strip() for item in value if item.strip()]
        if len(normalized) > 12 or any(len(item) > 50 for item in normalized):
            raise serializers.ValidationError("Use at most 12 interests of 50 characters each.")
        return list(dict.fromkeys(normalized))


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = [
            "id",
            "symbol",
            "name",
            "exchange",
            "sector",
            "industry",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class PortfolioHoldingSerializer(serializers.ModelSerializer):
    stock_detail = StockSerializer(source="stock", read_only=True)

    class Meta:
        model = PortfolioHolding
        fields = [
            "id",
            "portfolio",
            "stock",
            "stock_detail",
            "quantity",
            "average_buy_price",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def validate_portfolio(self, portfolio: Portfolio) -> Portfolio:
        request = self.context.get("request")
        if not request or not request.user.is_authenticated or portfolio.user_id != request.user.id:
            raise serializers.ValidationError("You may only use your own portfolio.")
        return portfolio


class PortfolioSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    holdings = PortfolioHoldingSerializer(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = ["id", "user", "name", "holdings", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]

    def create(self, validated_data: dict) -> Portfolio:
        return Portfolio.objects.create(user=self.context["request"].user, **validated_data)


class WatchlistItemSerializer(serializers.ModelSerializer):
    stock_detail = StockSerializer(source="stock", read_only=True)

    class Meta:
        model = WatchlistItem
        fields = ["id", "watchlist", "stock", "stock_detail", "added_at"]
        read_only_fields = ["added_at"]

    def validate_watchlist(self, watchlist: Watchlist) -> Watchlist:
        request = self.context.get("request")
        if not request or not request.user.is_authenticated or watchlist.user_id != request.user.id:
            raise serializers.ValidationError("You may only use your own watchlist.")
        return watchlist


class WatchlistSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    items = WatchlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Watchlist
        fields = ["id", "user", "name", "items", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]

    def create(self, validated_data: dict) -> Watchlist:
        return Watchlist.objects.create(user=self.context["request"].user, **validated_data)


class AlertSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    stock_detail = StockSerializer(source="stock", read_only=True)

    class Meta:
        model = Alert
        fields = [
            "id",
            "user",
            "stock",
            "stock_detail",
            "alert_type",
            "threshold",
            "is_active",
            "created_at",
            "triggered_at",
        ]
        read_only_fields = ["created_at", "triggered_at"]

    def create(self, validated_data: dict) -> Alert:
        return Alert.objects.create(user=self.context["request"].user, **validated_data)


class AnalysisReportSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    stock_detail = StockSerializer(source="stock", read_only=True)

    class Meta:
        model = AnalysisReport
        fields = [
            "id",
            "stock",
            "stock_detail",
            "user",
            "technical_analysis",
            "fundamental_analysis",
            "news_analysis",
            "risk_analysis",
            "overall_signal",
            "summary",
            "created_at",
        ]
        read_only_fields = fields


class NewsArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = [
            "id",
            "stock",
            "title",
            "source",
            "url",
            "published_at",
            "sentiment",
            "sentiment_score",
            "summary",
            "created_at",
        ]
        read_only_fields = ["created_at"]
