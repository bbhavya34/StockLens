from math import sqrt
from statistics import mean, pstdev
from typing import Any

from .market_data import get_current_quote, get_historical_data


def get_stock_risk(symbol: str) -> dict[str, Any]:
    """Calculate volatility and drawdown from real historical observations."""
    bars = get_historical_data(symbol)
    closes = [float(bar["close"]) for bar in bars]
    returns = [closes[index] / closes[index - 1] - 1 for index in range(1, len(closes))]
    annualized_volatility = pstdev(returns) * sqrt(252) * 100
    downside = [value for value in returns if value < 0]
    downside_volatility = (pstdev(downside) * sqrt(252) * 100) if len(downside) > 1 else 0.0
    peak = closes[0]
    max_drawdown = 0.0
    for close in closes:
        peak = max(peak, close)
        max_drawdown = min(max_drawdown, close / peak - 1)
    ordered_returns = sorted(returns)
    var_index = max(0, int(len(ordered_returns) * 0.05) - 1)
    value_at_risk_95 = -ordered_returns[var_index] * 100
    risk_level = "high" if annualized_volatility >= 35 or max_drawdown <= -0.30 else "moderate" if annualized_volatility >= 20 or max_drawdown <= -0.15 else "low"
    return {
        "symbol": symbol.upper(),
        "risk_level": risk_level,
        "annualized_volatility": round(annualized_volatility, 2),
        "downside_volatility": round(downside_volatility, 2),
        "max_drawdown": round(max_drawdown * 100, 2),
        "value_at_risk_95": round(value_at_risk_95, 2),
        "average_daily_return": round(mean(returns) * 100, 4),
        "observations": len(returns),
        "confidence": 1.0,
        "data_timestamp": bars[-1]["timestamp"],
        "evidence": [{"source": bars[-1].get("source", "provider"), "timestamp": bars[-1]["timestamp"], "metric": "daily_returns", "observations": len(returns)}],
    }


def get_portfolio_risk(holdings: list[dict[str, Any]]) -> dict[str, Any]:
    """Calculate diversification and portfolio risk once provider data is available."""
    if not holdings:
        return {"status": "unavailable", "reason": "No saved portfolio holdings."}
    positions = []
    for holding in holdings:
        quote = get_current_quote(str(holding["symbol"]))
        quantity = float(holding["quantity"])
        average_buy_price = float(holding["average_buy_price"])
        market_value = quantity * float(quote["price"])
        positions.append({
            "symbol": holding["symbol"],
            "quantity": quantity,
            "price": quote["price"],
            "market_value": market_value,
            "cost_basis": quantity * average_buy_price,
        })
    total_value = sum(position["market_value"] for position in positions)
    total_cost = sum(position["cost_basis"] for position in positions)
    for position in positions:
        position["weight"] = position["market_value"] / total_value if total_value else 0
    concentration = sum(position["weight"] ** 2 for position in positions)
    return {
        "status": "complete",
        "market_value": round(total_value, 2),
        "cost_basis": round(total_cost, 2),
        "unrealized_return_percent": round((total_value / total_cost - 1) * 100, 2) if total_cost else None,
        "concentration_score": round(concentration, 3),
        "concentration_level": "high" if concentration >= 0.5 else "moderate" if concentration >= 0.3 else "low",
        "positions": positions,
    }
