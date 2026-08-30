import os
from datetime import UTC, datetime
from math import isfinite
from typing import Any

from . import DataProviderNotConfigured

YAHOO_SYMBOL_ALIASES = {
    "RELIANCE": "RELIANCE.NS",
    "TCS": "TCS.NS",
    "INFY": "INFY.NS",
    "HDFCBANK": "HDFCBANK.NS",
    "NIFTY 50": "^NSEI",
    "NIFTY50": "^NSEI",
}


def normalize_yahoo_symbol(symbol: str) -> str:
    normalized = symbol.strip().upper()
    return YAHOO_SYMBOL_ALIASES.get(normalized, normalized)


def get_yfinance_ticker(symbol: str):
    if os.environ.get("MARKET_DATA_PROVIDER", "").lower() != "yfinance":
        raise DataProviderNotConfigured("market_data")
    try:
        import yfinance as yf
    except ImportError as exc:
        raise DataProviderNotConfigured("market_data_package") from exc
    return yf.Ticker(normalize_yahoo_symbol(symbol))


def _number(value: Any) -> float | None:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if isfinite(number) else None


def _fast_value(fast_info: Any, *names: str) -> Any:
    for name in names:
        try:
            value = fast_info.get(name)
        except (AttributeError, KeyError, TypeError):
            try:
                value = getattr(fast_info, name)
            except (AttributeError, KeyError):
                continue
        if value is not None:
            return value
    return None


def get_current_quote(symbol: str) -> dict[str, Any]:
    """Return the latest provider-backed quote available from Yahoo Finance."""
    ticker = get_yfinance_ticker(symbol)
    try:
        fast_info = ticker.fast_info
        price = _number(_fast_value(fast_info, "last_price", "lastPrice"))
        previous_close = _number(
            _fast_value(fast_info, "previous_close", "previousClose")
        )
        market_open = _number(_fast_value(fast_info, "open", "regularMarketOpen"))
        day_high = _number(_fast_value(fast_info, "day_high", "dayHigh"))
        day_low = _number(_fast_value(fast_info, "day_low", "dayLow"))
        volume = _number(_fast_value(fast_info, "last_volume", "lastVolume"))
        market_cap = _number(_fast_value(fast_info, "market_cap", "marketCap"))

        # Some exchanges do not populate fast_info consistently. Recent daily
        # bars provide a provider-backed fallback without using fabricated data.
        if price is None or previous_close is None:
            history = ticker.history(period="5d", interval="1d", auto_adjust=False)
            if history.empty:
                raise ValueError("Yahoo Finance returned no quote data.")
            closes = history["Close"].dropna()
            if closes.empty:
                raise ValueError("Yahoo Finance returned no closing prices.")
            price = price if price is not None else _number(closes.iloc[-1])
            if previous_close is None:
                previous_close = _number(closes.iloc[-2] if len(closes) > 1 else closes.iloc[-1])
            latest = history.iloc[-1]
            market_open = market_open if market_open is not None else _number(latest.get("Open"))
            day_high = day_high if day_high is not None else _number(latest.get("High"))
            day_low = day_low if day_low is not None else _number(latest.get("Low"))
            volume = volume if volume is not None else _number(latest.get("Volume"))
    except DataProviderNotConfigured:
        raise
    except Exception as exc:
        raise DataProviderNotConfigured("market_data_unavailable") from exc

    if price is None:
        raise DataProviderNotConfigured("market_data_unavailable")

    change = price - previous_close if previous_close is not None else None
    change_percent = (
        change / previous_close * 100
        if change is not None and previous_close not in (None, 0)
        else None
    )
    return {
        "symbol": symbol.strip().upper(),
        "price": price,
        "previous_close": previous_close,
        "change": change,
        "change_percent": change_percent,
        "open": market_open,
        "day_high": day_high,
        "day_low": day_low,
        "volume": int(volume) if volume is not None else None,
        "market_cap": int(market_cap) if market_cap is not None else None,
        "currency": _fast_value(fast_info, "currency") or None,
        "exchange": _fast_value(fast_info, "exchange") or None,
        "timezone": _fast_value(fast_info, "timezone") or None,
        "source": "Yahoo Finance",
        "retrieved_at": datetime.now(UTC).isoformat(),
    }


def get_historical_data(symbol: str) -> list[dict[str, Any]]:
    """Fetch real OHLCV bars. yfinance is opt-in to avoid silently calling providers."""
    try:
        ticker = get_yfinance_ticker(symbol)
        history = ticker.history(period="1y", interval="1d", auto_adjust=True)
    except DataProviderNotConfigured:
        raise
    except Exception as exc:
        raise DataProviderNotConfigured("market_data_unavailable") from exc
    if history.empty or len(history) < 60:
        raise DataProviderNotConfigured("market_data_insufficient")
    records: list[dict[str, Any]] = []
    for timestamp, row in history.iterrows():
        records.append({"timestamp": timestamp.isoformat(), "open": float(row["Open"]), "high": float(row["High"]), "low": float(row["Low"]), "close": float(row["Close"]), "volume": float(row["Volume"]), "source": "Yahoo Finance", "retrieved_at": datetime.now(UTC).isoformat()})
    return records
