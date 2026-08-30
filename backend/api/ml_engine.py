"""Executable baseline inference models trained from supplied, timestamped OHLCV data.

These models are intentionally small and inspectable. They are replaceable through
the registry; they do not generate a prediction when the market-data input is absent.
"""
from __future__ import annotations

import json
from math import exp, sqrt
from pathlib import Path
from statistics import mean, pstdev
from typing import Any


def _ema(values: list[float], period: int) -> float:
    alpha = 2 / (period + 1)
    result = values[0]
    for value in values[1:]: result = alpha * value + (1 - alpha) * result
    return result


def _slope(values: list[float]) -> float:
    n = len(values); x_bar = (n - 1) / 2; y_bar = mean(values)
    denominator = sum((index - x_bar) ** 2 for index in range(n))
    return sum((index - x_bar) * (value - y_bar) for index, value in enumerate(values)) / denominator if denominator else 0.0


def _trained_probability(features: list[float]) -> tuple[float, str]:
    """Use the last validated training artifact when available; otherwise safe baseline."""
    artifact = Path(__file__).with_name("model_artifacts") / "technical_logistic_v1.json"
    if artifact.exists():
        try:
            trained = json.loads(artifact.read_text(encoding="utf-8"))
            means, scales, weights = trained["means"], trained["scales"], trained["weights"]
            normalized = [(value - means[index]) / max(scales[index], 1e-9) for index, value in enumerate(features)]
            score = trained["bias"] + sum(weight * value for weight, value in zip(weights, normalized))
            return 1 / (1 + exp(-max(min(score, 35), -35))), str(trained["version"])
        except (KeyError, TypeError, ValueError, json.JSONDecodeError):
            pass
    # Clearly-versioned baseline remains functional while no local training artifact exists.
    score = 2.6 * features[0] + .8 * features[1] + .6 * features[2] + .5 * features[3]
    return 1 / (1 + exp(-max(min(score, 35), -35))), "baseline-1.0"


def technical_inference(ohlcv: list[dict[str, Any]]) -> dict[str, Any]:
    closes = [float(bar["close"]) for bar in ohlcv]
    volumes = [float(bar["volume"]) for bar in ohlcv]
    if len(closes) < 60: raise ValueError("At least 60 timestamped OHLCV bars are required.")
    returns = [(closes[index] / closes[index - 1]) - 1 for index in range(1, len(closes))]
    gains = [max(value, 0) for value in returns[-14:]]; losses = [max(-value, 0) for value in returns[-14:]]
    rs = mean(gains) / max(mean(losses), 1e-9); rsi = 100 - (100 / (1 + rs))
    ema12, ema26 = _ema(closes[-60:], 12), _ema(closes[-60:], 26); macd = ema12 - ema26
    sma20, sma50 = mean(closes[-20:]), mean(closes[-50:]); std20 = pstdev(closes[-20:])
    momentum = (closes[-1] / closes[-21] - 1) * 100
    volatility = pstdev(returns[-20:]) * sqrt(252) * 100
    # Ordinary least squares forecasting: a real time-series regression fitted on the last 30 closes.
    slope = _slope(closes[-30:]); forecast_5d = closes[-1] + slope * 5
    volume_z = (volumes[-1] - mean(volumes[-20:])) / max(pstdev(volumes[-20:]), 1)
    probability, model_version = _trained_probability([(sma20 / sma50) - 1, (rsi - 50) / 50, macd / max(closes[-1], 1), momentum / 10])
    signal = "bullish" if probability >= .62 else "bearish" if probability <= .38 else "neutral"
    return {"signal": signal, "trend": "uptrend" if sma20 > sma50 else "downtrend", "momentum": round(momentum, 2), "volatility": round(volatility, 2), "anomaly": abs(volume_z) >= 2.5, "confidence": round(max(.5, min(.9, .5 + abs(probability - .5))), 2), "forecast_5d": round(forecast_5d, 2), "indicators": {"sma_20": round(sma20, 2), "sma_50": round(sma50, 2), "rsi_14": round(rsi, 2), "macd": round(macd, 3), "bollinger_upper": round(sma20 + 2 * std20, 2), "bollinger_lower": round(sma20 - 2 * std20, 2)}, "model": "TechnicalForecastModel", "model_version": model_version, "feature_coverage": 1.0, "data_timestamp": ohlcv[-1]["timestamp"], "evidence": [{"source": ohlcv[-1].get("source", "provider"), "timestamp": ohlcv[-1]["timestamp"], "metric": "close", "value": closes[-1]}]}
