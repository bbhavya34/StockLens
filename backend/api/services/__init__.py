class DataProviderNotConfigured(RuntimeError):
    """Raised when an operation requires an external provider that is not configured."""

    def __init__(self, provider: str) -> None:
        self.provider = provider
        super().__init__(f"The {provider} provider is not configured.")

    @property
    def error_code(self) -> str:
        return f"{self.provider}_provider_not_configured"
