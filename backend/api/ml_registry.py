"""Backend ML contracts. Implementations deliberately reject missing provider data."""
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class ModelDescriptor:
    name: str
    version: str
    required_features: tuple[str, ...]


class BaseModel:
    descriptor: ModelDescriptor

    def validate_input(self, payload: dict[str, Any]) -> None:
        missing = [key for key in self.descriptor.required_features if key not in payload]
        if missing:
            raise ValueError(f"Missing required provider-backed features: {', '.join(missing)}")

    def get_model_version(self) -> str:
        return self.descriptor.version

    def get_features(self) -> tuple[str, ...]:
        return self.descriptor.required_features

    def predict(self, payload: dict[str, Any]) -> dict[str, Any]:
        self.validate_input(payload)
        raise NotImplementedError("Model artifact is not configured for inference.")


class TechnicalModel(BaseModel):
    descriptor = ModelDescriptor("Technical-v2", "2.0.0", ("ohlcv", "indicators", "as_of"))


class FundamentalModel(BaseModel):
    descriptor = ModelDescriptor("Fundamental-v1", "1.0.0", ("financials", "as_of"))


class SentimentModel(BaseModel):
    descriptor = ModelDescriptor("FinSent-v3", "3.0.0", ("articles", "as_of"))


class RiskModel(BaseModel):
    descriptor = ModelDescriptor("Risk-v2", "2.0.0", ("returns", "portfolio", "as_of"))


class PortfolioModel(BaseModel):
    descriptor = ModelDescriptor("Portfolio-v1", "1.0.0", ("holdings", "prices", "as_of"))


class ModelRegistry:
    _models = {"technical": TechnicalModel(), "fundamental": FundamentalModel(), "news": SentimentModel(), "risk": RiskModel(), "portfolio": PortfolioModel()}

    @classmethod
    def get(cls, name: str) -> BaseModel:
        return cls._models[name]
