from typing import Any

from .market_data import get_historical_data


def get_stock_risk(symbol: str) -> dict[str, Any]:
    """Calculate volatility and drawdown from real historical observations."""
    get_historical_data(symbol)
    raise NotImplementedError("Risk calculations require historical market data.")


def get_portfolio_risk(holdings: list[dict[str, Any]]) -> dict[str, Any]:
    """Calculate diversification and portfolio risk once provider data is available."""
    get_historical_data(holdings[0]["symbol"] if holdings else "")
    raise NotImplementedError("Portfolio risk requires historical market data.")
