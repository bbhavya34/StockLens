from typing import Any

from . import DataProviderNotConfigured


def get_current_quote(symbol: str) -> dict[str, Any]:
    """Return a live quote once a real market-data provider is configured."""
    raise DataProviderNotConfigured("market_data")


def get_historical_data(symbol: str) -> list[dict[str, Any]]:
    """Return historical OHLCV data from a configured market-data provider."""
    raise DataProviderNotConfigured("market_data")
