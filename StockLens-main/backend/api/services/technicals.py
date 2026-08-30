from typing import Any

from .market_data import get_historical_data
from api.ml_engine import technical_inference


def get_technical_analysis(symbol: str) -> dict[str, Any]:
    """Calculate RSI, MACD, averages, and Bollinger Bands from real price data.

    Runs an inspectable regression/indicator model on provider-backed OHLCV only.
    """
    return technical_inference(get_historical_data(symbol))
