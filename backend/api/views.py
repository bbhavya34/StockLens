from django.db.models import Q, QuerySet
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .agents.orchestrator import AnalysisOrchestrator
from .models import Alert, AnalysisReport, Portfolio, Stock, UserProfile, Watchlist
from .serializers import (
    AlertSerializer,
    AnalysisReportSerializer,
    PortfolioSerializer,
    StockSerializer,
    UserProfileSerializer,
    WatchlistSerializer,
)
from .services import DataProviderNotConfigured
from .services.fundamentals import get_fundamental_analysis
from .services.news import get_stock_news
from .services.technicals import get_technical_analysis


def _provider_error(exc: DataProviderNotConfigured) -> Response:
    return Response(
        {"error": exc.error_code, "detail": str(exc)},
        status=status.HTTP_503_SERVICE_UNAVAILABLE,
    )


def _stock(symbol: str) -> Stock:
    return get_object_or_404(Stock, symbol__iexact=symbol)


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request: Request) -> Response:
    return Response({"status": "ok", "service": "stocklens-backend"})


class StockViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [AllowAny]
    lookup_field = "symbol"

    def get_object(self) -> Stock:
        queryset = self.filter_queryset(self.get_queryset())
        obj = get_object_or_404(queryset, symbol__iexact=self.kwargs["symbol"])
        self.check_object_permissions(self.request, obj)
        return obj


class TechnicalsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request, symbol: str) -> Response:
        stock = _stock(symbol)
        try:
            result = get_technical_analysis(stock.symbol)
        except DataProviderNotConfigured as exc:
            return _provider_error(exc)
        return Response(result)


class FundamentalsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request, symbol: str) -> Response:
        stock = _stock(symbol)
        try:
            result = get_fundamental_analysis(stock.symbol)
        except DataProviderNotConfigured as exc:
            return _provider_error(exc)
        return Response(result)


class NewsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request, symbol: str) -> Response:
        stock = _stock(symbol)
        try:
            articles = get_stock_news(stock.symbol)
        except DataProviderNotConfigured as exc:
            return _provider_error(exc)
        return Response({"symbol": stock.symbol, "articles": articles})


class AnalyzeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request, symbol: str) -> Response:
        stock = _stock(symbol)
        try:
            result = AnalysisOrchestrator().analyze(stock.symbol)
        except DataProviderNotConfigured as exc:
            return _provider_error(exc)
        except NotImplementedError as exc:
            return Response(
                {"error": "analysis_integration_not_configured", "detail": str(exc)},
                status=status.HTTP_501_NOT_IMPLEMENTED,
            )

        report = AnalysisReport.objects.create(
            stock=stock,
            user=request.user if request.user.is_authenticated else None,
            technical_analysis=result["technical_analysis"],
            fundamental_analysis=result["fundamental_analysis"],
            news_analysis=result["news_analysis"],
            risk_analysis=result["risk_analysis"],
            overall_signal=result.get("overall_signal", ""),
            summary=result["summary"],
        )
        return Response(AnalysisReportSerializer(report).data, status=status.HTTP_201_CREATED)


class AnalysisReportDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request, pk: int) -> Response:
        visible = Q(user__isnull=True)
        if request.user.is_authenticated:
            visible |= Q(user=request.user)
        report = get_object_or_404(
            AnalysisReport.objects.select_related("stock", "user").filter(visible),
            pk=pk,
        )
        return Response(AnalysisReportSerializer(report).data)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def _profile(self, request: Request) -> UserProfile:
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return profile

    def get(self, request: Request) -> Response:
        return Response(UserProfileSerializer(self._profile(request)).data)

    def patch(self, request: Request) -> Response:
        profile = self._profile(request)
        serializer = UserProfileSerializer(
            profile,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class PortfolioViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> QuerySet[Portfolio]:
        return Portfolio.objects.filter(user=self.request.user).prefetch_related(
            "holdings__stock"
        )


class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> QuerySet[Watchlist]:
        return Watchlist.objects.filter(user=self.request.user).prefetch_related("items__stock")


class AlertViewSet(viewsets.ModelViewSet):
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> QuerySet[Alert]:
        return Alert.objects.filter(user=self.request.user).select_related("stock")
