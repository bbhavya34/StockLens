from typing import Any


class ResearchAgent:
    """Combines evidence into an explainable report without inventing conclusions."""

    def synthesize(
        self,
        symbol: str,
        technical: dict[str, Any],
        fundamental: dict[str, Any],
        news: dict[str, Any],
        risk: dict[str, Any],
    ) -> dict[str, Any]:
        signals = {
            "technical": {"bullish": 1, "neutral": 0, "bearish": -1}.get(technical.get("signal"), 0),
            "fundamental": {"positive": 1, "neutral": 0, "negative": -1}.get(fundamental.get("signal"), 0),
        }
        articles = news.get("articles", [])
        news_score = sum(float(item.get("sentiment_score", 0)) for item in articles) / max(len(articles), 1)
        signals["news"] = 1 if news_score > 0.1 else -1 if news_score < -0.1 else 0
        weighted_score = signals["technical"] * 0.45 + signals["fundamental"] * 0.4 + signals["news"] * 0.15
        overall_signal = "bullish" if weighted_score >= 0.3 else "bearish" if weighted_score <= -0.3 else "neutral"
        nonzero = [value for value in signals.values() if value]
        conflict = bool(nonzero) and min(nonzero) < 0 < max(nonzero)
        agreement = 1.0 if not nonzero else max(nonzero.count(-1), nonzero.count(1)) / len(nonzero)
        confidence = min(0.95, 0.45 + abs(weighted_score) * 0.35 + agreement * 0.2)
        summary = (
            f"{symbol} has a {overall_signal} evidence-weighted view. "
            f"Technical evidence is {technical.get('signal', 'neutral')}, fundamentals are "
            f"{fundamental.get('signal', 'neutral')}, news tone is "
            f"{'positive' if news_score > 0.1 else 'negative' if news_score < -0.1 else 'neutral'}, "
            f"and measured risk is {risk.get('risk_level', 'unknown')}."
        )
        return {
            "status": "complete",
            "overall_signal": overall_signal,
            "confidence": round(confidence, 2),
            "agent_agreement": round(agreement, 2),
            "signal_conflict": conflict,
            "evidence_coverage": round((3 + int(bool(articles))) / 4, 2),
            "summary": summary,
        }
