from typing import Any

from api.services.news import get_stock_news


class NewsAgent:
    def analyze(self, symbol: str) -> dict[str, Any]:
        return {"articles": get_stock_news(symbol)}
