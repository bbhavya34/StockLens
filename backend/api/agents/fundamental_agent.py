from typing import Any

from api.services.fundamentals import get_fundamental_analysis


class FundamentalAgent:
    def analyze(self, symbol: str) -> dict[str, Any]:
        return get_fundamental_analysis(symbol)
