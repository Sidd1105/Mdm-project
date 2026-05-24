from pydantic import BaseModel, Field, field_validator
from typing import Optional


class PredictRequest(BaseModel):
    year: int = Field(..., ge=1970, le=2030, description="Year of emission data")
    state_name: str = Field(..., description="US state name", alias="state-name")
    sector_name: str = Field(..., description="Emission sector", alias="sector-name")
    fuel_name: str = Field(..., description="Fuel type", alias="fuel-name")

    model_config = {"populate_by_name": True}

    @field_validator("year")
    @classmethod
    def year_must_be_valid(cls, v: int) -> int:
        if not (1970 <= v <= 2030):
            raise ValueError("Year must be between 1970 and 2030")
        return v


class PredictResponse(BaseModel):
    year: int
    state_name: str
    sector_name: str
    fuel_name: str
    predicted_co2_mmt: float = Field(
        ..., description="Predicted CO2 emissions in Million Metric Tons"
    )
    model_used: str = "ANN"
