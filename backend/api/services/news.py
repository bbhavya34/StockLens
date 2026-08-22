from datetime import UTC, datetime
from typing import Any

from . import DataProviderNotConfigured
from .market_data import get_yfinance_ticker


POSITIVE_WORDS = {"beat", "beats", "gain", "gains", "growth", "record", "rise", "rises", "strong", "surge", "upgrade", "upside"}
NEGATIVE_WORDS = {"cut", "decline", "declines", "downgrade", "drop", "falls", "fraud", "loss", "miss", "risk", "slump", "weak"}


def _sentiment(text: str) -> tuple[str, float]:
    words = {word.strip(".,:;!?()[]{}\"'").lower() for word in text.split()}
    raw = len(words & POSITIVE_WORDS) - len(words & NEGATIVE_WORDS)
    score = max(-1.0, min(1.0, raw / 3))
    return ("positive" if score > 0 else "negative" if score < 0 else "neutral", score)


def get_stock_news(symbol: str) -> list[dict[str, Any]]:
    """Fetch real stock news and provider-backed sentiment results."""
    try:
        items = get_yfinance_ticker(symbol).news or []
    except DataProviderNotConfigured:
        raise
    except Exception as exc:
        raise DataProviderNotConfigured("news_unavailable") from exc

    articles: list[dict[str, Any]] = []
    for item in items[:10]:
        content = item.get("content") if isinstance(item, dict) else None
        content = content if isinstance(content, dict) else item
        title = str(content.get("title") or "").strip()
        if not title:
            continue
        provider = content.get("provider") or {}
        canonical_url = content.get("canonicalUrl") or {}
        summary = str(content.get("summary") or content.get("description") or "").strip()
        label, score = _sentiment(f"{title} {summary}")
        published_at = content.get("pubDate")
        if not published_at and content.get("providerPublishTime"):
            published_at = datetime.fromtimestamp(content["providerPublishTime"], UTC).isoformat()
        articles.append({
            "title": title,
            "source": provider.get("displayName") if isinstance(provider, dict) else content.get("publisher"),
            "url": canonical_url.get("url") if isinstance(canonical_url, dict) else content.get("link"),
            "published_at": published_at,
            "summary": summary,
            "sentiment": label,
            "sentiment_score": score,
        })
    return articles
