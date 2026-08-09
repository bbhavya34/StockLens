from typing import Any

from . import DataProviderNotConfigured


def get_fundamental_analysis(symbol: str) -> dict[str, Any]:
    """Fetch valuation, earnings, growth, returns, and leverage fundamentals."""
    raise DataProviderNotConfigured("fundamentals")
