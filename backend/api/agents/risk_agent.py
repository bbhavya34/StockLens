from typing import Any

from api.services.risk import get_stock_risk


class RiskAgent:
    def analyze(self, symbol: str) -> dict[str, Any]:
        return get_stock_risk(symbol)
