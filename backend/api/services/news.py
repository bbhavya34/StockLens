from typing import Any

from . import DataProviderNotConfigured


def get_stock_news(symbol: str) -> list[dict[str, Any]]:
    """Fetch real stock news and provider-backed sentiment results."""
    raise DataProviderNotConfigured("news")
