from fastapi import APIRouter, HTTPException
import logging

from app.schemas.prediction import PredictRequest, PredictResponse
from app.services.prediction_service import predict_emission

router = APIRouter()
logger = logging.getLogger("carbon_api.endpoint.predict")


@router.post("/predict", response_model=PredictResponse, tags=["Prediction"])
def predict(request: PredictRequest):
    """
    **Predict CO₂ emissions** using the trained ANN model.

    Provide a US state, emission sector, fuel type, and year.
    Returns the predicted CO₂ value in Million Metric Tons (MMT).

    **Example request body:**
    ```json
    {
      "year": 2020,
      "state-name": "Texas",
      "sector-name": "Electric Power carbon dioxide emissions",
      "fuel-name": "Coal"
    }
    ```
    """
    try:
        return predict_emission(request)
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
