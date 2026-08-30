from decimal import Decimal

from django.db import transaction
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .agents.orchestrator import AnalysisOrchestrator
from .agents.research_agent import ResearchAgent
from .models import Alert, AnalysisReport, Portfolio, PortfolioHolding, Stock, UserProfile, Watchlist
from .serializers import (
    AlertSerializer,
    AnalysisReportSerializer,
    PortfolioSerializer,
    StockSerializer,
    UserProfileSerializer,
    WatchlistSerializer,
)
from .services.fundamentals import get_fundamental_analysis
from .services.market_data import get_current_quote, get_historical_data
from .services.news import get_stock_news
from .services.risk import get_portfolio_risk, get_stock_risk
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


class StockQuoteView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request, symbol: str) -> Response:
        try:
            return Response(get_current_quote(symbol))
        except DataProviderNotConfigured as exc:
            return _provider_error(exc)


class StockHistoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request, symbol: str) -> Response:
        try:
            bars = get_historical_data(symbol)
        except DataProviderNotConfigured as exc:
            return _provider_error(exc)
        return Response({"symbol": symbol.upper(), "bars": bars})


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
        def run_agent(callback) -> dict:
            try:
                return {"status": "complete", **callback()}
            except DataProviderNotConfigured as exc:
                return {"status": "unavailable", "reason": str(exc), "error": exc.error_code}

        try:
            quote = get_current_quote(symbol)
        except DataProviderNotConfigured:
            quote = None
        technical = run_agent(lambda: get_technical_analysis(symbol))
        fundamental = run_agent(lambda: get_fundamental_analysis(symbol))
        news = run_agent(lambda: {"articles": get_stock_news(symbol)})
        risk = run_agent(lambda: get_stock_risk(symbol))
        holdings = PortfolioHolding.objects.filter(portfolio__user=request.user).select_related("stock")
        try:
            portfolio = get_portfolio_risk([
                {"symbol": holding.stock.symbol, "quantity": holding.quantity, "average_buy_price": holding.average_buy_price}
                for holding in holdings
            ])
        except DataProviderNotConfigured as exc:
            portfolio = {"status": "unavailable", "reason": str(exc)}
        research_agents = {"technical": technical, "fundamental": fundamental, "news": news, "risk": risk, "portfolio": portfolio}
        completed = sum(agent.get("status") == "complete" for agent in research_agents.values())
        if completed >= 2:
            synthesis = ResearchAgent().synthesize(
                symbol=symbol,
                technical=technical if technical["status"] == "complete" else {},
                fundamental=fundamental if fundamental["status"] == "complete" else {},
                news=news if news["status"] == "complete" else {"articles": []},
                risk=risk if risk["status"] == "complete" else {},
            )
        else:
            synthesis = {"status": "unavailable", "summary": "Not enough provider-backed evidence was available to synthesize a research view."}
        generated_at = technical.get("data_timestamp") or (quote or {}).get("retrieved_at")
        return Response({"status": "complete" if completed == len(research_agents) else "partial", "symbol": symbol, "generated_at": generated_at, "quote": quote, "agents": research_agents, "synthesis": synthesis})


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

    @action(detail=False, methods=["post"], url_path="demo")
    @transaction.atomic
    def create_demo(self, request: Request) -> Response:
        """Create or restore the four-firm demo portfolio for this user."""
        portfolio, created = Portfolio.objects.get_or_create(
            user=request.user,
            name="StockLens Demo Portfolio",
        )
        demo_holdings = [
            ("TCS", "Tata Consultancy Services", "Information Technology", Decimal("10"), Decimal("3500")),
            ("RELIANCE", "Reliance Industries", "Energy", Decimal("20"), Decimal("1250")),
            ("INFY", "Infosys", "Information Technology", Decimal("15.625"), Decimal("1600")),
            ("HDFCBANK", "HDFC Bank", "Financial Services", Decimal("10"), Decimal("1500")),
        ]

        for symbol, name, sector, quantity, average_buy_price in demo_holdings:
            stock, _ = Stock.objects.update_or_create(
                symbol=symbol,
                defaults={"name": name, "exchange": "NSE", "sector": sector, "industry": sector},
            )
            PortfolioHolding.objects.update_or_create(
                portfolio=portfolio,
                stock=stock,
                defaults={"quantity": quantity, "average_buy_price": average_buy_price},
            )

        portfolio = self.get_queryset().get(pk=portfolio.pk)
        return Response(
            self.get_serializer(portfolio).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
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
