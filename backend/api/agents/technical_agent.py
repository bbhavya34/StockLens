from typing import Any

from api.services.technicals import get_technical_analysis


class TechnicalAgent:
    def analyze(self, symbol: str) -> dict[str, Any]:
        return get_technical_analysis(symbol)
