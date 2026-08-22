from datetime import UTC, datetime
from math import isfinite
from typing import Any

from . import DataProviderNotConfigured
from .market_data import get_yfinance_ticker


def _number(value: Any) -> float | None:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if isfinite(number) else None


def get_fundamental_analysis(symbol: str) -> dict[str, Any]:
    """Fetch valuation, earnings, growth, returns, and leverage fundamentals."""
    try:
        info = get_yfinance_ticker(symbol).get_info()
    except DataProviderNotConfigured:
        raise
    except Exception as exc:
        raise DataProviderNotConfigured("fundamentals_unavailable") from exc
    if not isinstance(info, dict):
        raise DataProviderNotConfigured("fundamentals_unavailable")

    metrics = {
        "market_cap": _number(info.get("marketCap")),
        "trailing_pe": _number(info.get("trailingPE")),
        "forward_pe": _number(info.get("forwardPE")),
        "price_to_book": _number(info.get("priceToBook")),
        "revenue_growth": _number(info.get("revenueGrowth")),
        "earnings_growth": _number(info.get("earningsGrowth")),
        "profit_margin": _number(info.get("profitMargins")),
        "return_on_equity": _number(info.get("returnOnEquity")),
        "debt_to_equity": _number(info.get("debtToEquity")),
        "dividend_yield": _number(info.get("dividendYield")),
    }
    available = {key: value for key, value in metrics.items() if value is not None}
    if len(available) < 3:
        raise DataProviderNotConfigured("fundamentals_insufficient")

    score = 0
    score += 1 if (metrics["revenue_growth"] or 0) > 0.05 else -1
    score += 1 if (metrics["earnings_growth"] or 0) > 0.05 else -1
    score += 1 if (metrics["return_on_equity"] or 0) > 0.12 else 0
    score += 1 if 0 < (metrics["forward_pe"] or 0) < 30 else 0
    score -= 1 if (metrics["debt_to_equity"] or 0) > 150 else 0
    signal = "positive" if score >= 2 else "negative" if score <= -2 else "neutral"
    retrieved_at = datetime.now(UTC).isoformat()
    return {
        "symbol": symbol.upper(),
        "company_name": info.get("longName") or info.get("shortName") or symbol.upper(),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "signal": signal,
        "score": score,
        "confidence": round(len(available) / len(metrics), 2),
        "metrics": metrics,
        "source": "Yahoo Finance",
        "data_timestamp": retrieved_at,
        "evidence": [
            {"source": "Yahoo Finance", "timestamp": retrieved_at, "metric": key, "value": value}
            for key, value in available.items()
        ],
    }
