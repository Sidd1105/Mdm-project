from fastapi import APIRouter, HTTPException
import logging

from app.schemas.offset import OffsetRequest, OffsetResponse
from app.services.offset_service import calculate_offset

router = APIRouter()
logger = logging.getLogger("carbon_api.endpoint.offset")


@router.post("/offset", response_model=OffsetResponse, tags=["Offset"])
def offset(request: OffsetRequest):
    """
    **Calculate the carbon offset** required to neutralize given CO₂ emissions.

    Returns the equivalent number of trees, wind turbines, solar MW,
    and forest hectares needed to absorb the specified CO₂ amount.

    Formula: `trees = (co2_mmt × 1,000,000) / 0.022`
    (1 tree absorbs ~22 kg CO₂ per year)

    **Example request body:**
    ```json
    { "co2_mmt": 10.5 }
    ```
    """
    try:
        return calculate_offset(request)
    except Exception as e:
        logger.error(f"Offset calculation error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Offset calculation failed: {str(e)}")
