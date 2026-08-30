"""Train a compact, inspectable logistic model from real historical market bars.

Usage: MARKET_DATA_PROVIDER=yfinance python -m api.training.train_technical AAPL MSFT RELIANCE.NS
"""
from __future__ import annotations
import json
import sys
from math import exp
from pathlib import Path
from statistics import mean, pstdev
from api.services.market_data import get_historical_data


def features(closes: list[float], end: int) -> list[float]:
    recent = closes[end - 20:end]
    return [(mean(recent) / mean(closes[end - 50:end])) - 1, (closes[end - 1] / closes[end - 15]) - 1, (closes[end - 1] / closes[end - 5]) - 1, pstdev([(closes[i] / closes[i - 1]) - 1 for i in range(end - 20, end)])]


def main(symbols: list[str]) -> None:
    rows: list[tuple[list[float], int]] = []
    for symbol in symbols:
        closes = [float(row["close"]) for row in get_historical_data(symbol)]
        for end in range(55, len(closes) - 6): rows.append((features(closes, end), int(closes[end + 5] > closes[end])))
    if len(rows) < 100: raise RuntimeError("Need at least 100 labelled historical examples to train.")
    means = [mean(row[0][index] for row in rows) for index in range(4)]
    scales = [max(pstdev(row[0][index] for row in rows), 1e-9) for index in range(4)]
    normalized = [([(value - means[index]) / scales[index] for index, value in enumerate(values)], label) for values, label in rows]
    weights, bias, learning_rate = [0.0] * 4, 0.0, .04
    for _ in range(450):
        grad, bias_grad = [0.0] * 4, 0.0
        for values, label in normalized:
            probability = 1 / (1 + exp(-max(min(bias + sum(weight * value for weight, value in zip(weights, values)), 35), -35)))
            error = probability - label; bias_grad += error
            for index, value in enumerate(values): grad[index] += error * value
        size = len(normalized); bias -= learning_rate * bias_grad / size
        weights = [weight - learning_rate * gradient / size for weight, gradient in zip(weights, grad)]
    artifact = {"version": "trained-1.0", "symbols": symbols, "samples": len(rows), "means": means, "scales": scales, "weights": weights, "bias": bias}
    path = Path(__file__).parents[1] / "model_artifacts" / "technical_logistic_v1.json"; path.parent.mkdir(exist_ok=True); path.write_text(json.dumps(artifact, indent=2), encoding="utf-8")
    print(f"Trained technical model with {len(rows)} examples → {path}")


if __name__ == "__main__": main(sys.argv[1:] or ["AAPL", "MSFT", "NVDA"])
