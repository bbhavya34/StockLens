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
        raise NotImplementedError(
            "Research synthesis requires a configured, evidence-grounded AI provider."
        )
