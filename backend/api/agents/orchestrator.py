from typing import Any

from .fundamental_agent import FundamentalAgent
from .news_agent import NewsAgent
from .research_agent import ResearchAgent
from .risk_agent import RiskAgent
from .technical_agent import TechnicalAgent


class AnalysisOrchestrator:
    """Coordinates evidence collection before explainable report synthesis."""

    def __init__(self) -> None:
        self.technical_agent = TechnicalAgent()
        self.fundamental_agent = FundamentalAgent()
        self.news_agent = NewsAgent()
        self.risk_agent = RiskAgent()
        self.research_agent = ResearchAgent()

    def analyze(self, symbol: str) -> dict[str, Any]:
        technical = self.technical_agent.analyze(symbol)
        fundamental = self.fundamental_agent.analyze(symbol)
        news = self.news_agent.analyze(symbol)
        risk = self.risk_agent.analyze(symbol)
        return self.research_agent.synthesize(
            symbol=symbol,
            technical=technical,
            fundamental=fundamental,
            news=news,
            risk=risk,
        )
