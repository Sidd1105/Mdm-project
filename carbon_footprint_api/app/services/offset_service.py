"""
Business logic for carbon offset calculation.
Mirrors calculate_offset() from the original notebook.
"""

import logging
from app.schemas.offset import OffsetRequest, OffsetResponse
from app.utils.constants import (
    KG_CO2_PER_TREE_PER_YEAR,
    TONS_CO2_PER_WIND_TURBINE_PER_YEAR,
    TONS_CO2_PER_MW_SOLAR_PER_YEAR,
    TREES_PER_HECTARE,
)

logger = logging.getLogger("carbon_api.offset_service")


def calculate_offset_raw(co2_mmt: float) -> dict:
    """
    Pure calculation — returns a dict usable by both the endpoint
    and the full-pipeline analyze endpoint.
    """
    co2_tons = co2_mmt * 1_000_000  # MMT → tons
    trees_needed = int(co2_tons / (KG_CO2_PER_TREE_PER_YEAR / 1000))
    wind_turbines = int(co2_tons / TONS_CO2_PER_WIND_TURBINE_PER_YEAR)
    solar_mw = round(co2_tons / TONS_CO2_PER_MW_SOLAR_PER_YEAR, 1)
    forest_ha = int(co2_tons / (KG_CO2_PER_TREE_PER_YEAR / 1000 * TREES_PER_HECTARE))

    return {
        "co2_mmt":           round(co2_mmt, 4),
        "co2_tons":          round(co2_tons, 2),
        "trees_needed":      trees_needed,
        "wind_turbines":     wind_turbines,
        "solar_capacity_mw": solar_mw,
        "forest_hectares":   forest_ha,
    }


def calculate_offset(request: OffsetRequest) -> OffsetResponse:
    co2_mmt = request.co2_mmt
    result = calculate_offset_raw(co2_mmt)

    interpretation = (
        f"To offset {result['co2_mmt']:.2f} MMT ({result['co2_tons']:.0f} Tons) of CO2 annually, you would need approximately "
        f"{result['trees_needed']:,} trees, {result['wind_turbines']:,} wind turbines, "
        f"or {result['solar_capacity_mw']:,} MW of solar capacity "
        f"(equivalent to ~{result['forest_hectares']:,} hectares of forest)."
    )

    logger.info(
        f"Offset calculated for {co2_mmt:.4f} MMT: "
        f"{result['trees_needed']:,} trees | {result['wind_turbines']:,} turbines"
    )

    return OffsetResponse(
        **result,
        interpretation=interpretation,
    )
