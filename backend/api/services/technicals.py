from typing import Any

from .market_data import get_historical_data


def get_technical_analysis(symbol: str) -> dict[str, Any]:
    """Calculate RSI, MACD, averages, and Bollinger Bands from real price data.

    Indicator calculations intentionally remain unimplemented until the market-data
    provider supplies historical observations.
    """
    get_historical_data(symbol)
    raise NotImplementedError("Technical calculations require historical market data.")
