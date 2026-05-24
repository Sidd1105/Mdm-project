from fastapi import APIRouter, HTTPException
import logging

from app.schemas.classification import ClassifyRequest, ClassifyResponse
from app.services.classification_service import classify_emission

router = APIRouter()
logger = logging.getLogger("carbon_api.endpoint.classify")


@router.post("/classify", response_model=ClassifyResponse, tags=["Classification"])
def classify(request: ClassifyRequest):
    """
    **Classify emission severity** based on CO₂ value in Million Metric Tons.

    | Level    | Range (MMT)  |
    |----------|-------------|
    | Low      | < 5         |
    | Moderate | 5 – 25      |
    | High     | 25 – 75     |
    | Critical | ≥ 75        |

    **Example request body:**
    ```json
    { "co2_mmt": 42.5 }
    ```
    """
    try:
        return classify_emission(request)
    except Exception as e:
        logger.error(f"Classification error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")
