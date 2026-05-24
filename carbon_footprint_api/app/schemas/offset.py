from pydantic import BaseModel, Field


class OffsetRequest(BaseModel):
    co2_mmt: float = Field(..., gt=0, description="CO2 emissions in Million Metric Tons")


class OffsetResponse(BaseModel):
    co2_mmt: float
    co2_tons: float
    trees_needed: int = Field(..., description="Trees needed to offset (22 kg CO2/tree/year)")
    wind_turbines: int = Field(..., description="Equivalent wind turbines (4,600 t/year each)")
    solar_capacity_mw: float = Field(..., description="Equivalent solar capacity in MW")
    forest_hectares: int = Field(..., description="Equivalent forest area in hectares")
    interpretation: str
