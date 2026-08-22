from django.db.models import QuerySet
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
from .services.fundamentals import get_fundamental_analysis
from .services.news import get_stock_news
from .services.technicals import get_technical_analysis
from .services import DataProviderNotConfigured
from .ml_registry import ModelRegistry


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
    permission_classes = [IsAuthenticated]

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


class ModelInferenceView(APIView):
    """Authenticated model interface; it never manufactures feature inputs."""
    permission_classes = [IsAuthenticated]
    model_name = ""

    def post(self, request: Request) -> Response:
        model = ModelRegistry.get(self.model_name)
        try:
            prediction = model.predict(dict(request.data))
        except ValueError as exc:
            return Response({"status": "unavailable", "error": "incomplete_input", "detail": str(exc), "model": model.descriptor.name, "model_version": model.get_model_version(), "required_features": model.get_features()}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except NotImplementedError as exc:
            return Response({"status": "unavailable", "error": "model_not_configured", "detail": str(exc), "model": model.descriptor.name, "model_version": model.get_model_version(), "required_features": model.get_features()}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response(prediction)


class TechnicalPredictView(ModelInferenceView): model_name = "technical"
class FundamentalPredictView(ModelInferenceView): model_name = "fundamental"
class NewsPredictView(ModelInferenceView): model_name = "news"
class RiskPredictView(ModelInferenceView): model_name = "risk"
class PortfolioPredictView(ModelInferenceView): model_name = "portfolio"


class ResearchRunView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        symbol = str(request.data.get("symbol", "")).strip().upper()
        if not symbol:
            return Response({"error": "symbol_required", "detail": "Provide a market symbol."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            technical = get_technical_analysis(symbol)
        except DataProviderNotConfigured as exc:
            return Response({"status": "unavailable", "symbol": symbol, "detail": str(exc), "pipeline": ["technical", "fundamental", "news", "risk", "portfolio", "evidence_validation", "conflict_detection", "synthesis"]}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response({"status": "partial", "symbol": symbol, "generated_at": technical["data_timestamp"], "agents": {"technical": {"status": "complete", **technical}, "fundamental": {"status": "unavailable", "reason": "Fundamental provider not configured."}, "news": {"status": "unavailable", "reason": "News provider not configured."}, "risk": {"status": "unavailable", "reason": "Portfolio and returns provider not configured."}}, "synthesis": {"status": "unavailable", "reason": "Synthesis is withheld until cross-domain evidence is available."}})


class AnalysisReportDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, pk: int) -> Response:
        report = get_object_or_404(
            AnalysisReport.objects.select_related("stock", "user").filter(user=request.user),
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
