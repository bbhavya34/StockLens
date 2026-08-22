import os
from datetime import UTC, datetime
from typing import Any

from . import DataProviderNotConfigured


def get_current_quote(symbol: str) -> dict[str, Any]:
    """Return a live quote once a real market-data provider is configured."""
    raise DataProviderNotConfigured("market_data")


def get_historical_data(symbol: str) -> list[dict[str, Any]]:
    """Fetch real OHLCV bars. yfinance is opt-in to avoid silently calling providers."""
    if os.environ.get("MARKET_DATA_PROVIDER", "").lower() != "yfinance":
        raise DataProviderNotConfigured("market_data")
    try:
        import yfinance as yf
    except ImportError as exc:
        raise DataProviderNotConfigured("market_data_package") from exc
    ticker = yf.Ticker(symbol)
    history = ticker.history(period="1y", interval="1d", auto_adjust=True)
    if history.empty or len(history) < 60:
        raise DataProviderNotConfigured("market_data_insufficient")
    records: list[dict[str, Any]] = []
    for timestamp, row in history.iterrows():
        records.append({"timestamp": timestamp.isoformat(), "open": float(row["Open"]), "high": float(row["High"]), "low": float(row["Low"]), "close": float(row["Close"]), "volume": float(row["Volume"]), "source": "Yahoo Finance", "retrieved_at": datetime.now(UTC).isoformat()})
    return records
