from pydantic import BaseModel, Field
from typing import Literal


EmissionLevel = Literal["Low", "Moderate", "High", "Critical"]


class ClassifyRequest(BaseModel):
    co2_mmt: float = Field(..., gt=0, description="CO2 emissions in Million Metric Tons")


class ClassifyResponse(BaseModel):
    co2_mmt: float
    level: EmissionLevel
    color: str
    description: str
    threshold_info: str
    description: str
    threshold_info: str
