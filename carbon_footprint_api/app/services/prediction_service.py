"""
Business logic for ANN-based CO2 emission prediction.
"""

import logging
import numpy as np
import pandas as pd

from app.models.loader import get_ann_model, get_preprocessor
from app.schemas.prediction import PredictRequest, PredictResponse

logger = logging.getLogger("carbon_api.prediction_service")


def predict_emission(request: PredictRequest) -> PredictResponse:
    """
    Transforms input features using the saved preprocessor,
    then runs inference through the ANN model.
    """
    model = get_ann_model()
    preprocessor = get_preprocessor()

    # Build a single-row DataFrame matching the training feature schema
    input_df = pd.DataFrame([{
        "year":        request.year,
        "state-name":  request.state_name,
        "sector-name": request.sector_name,
        "fuel-name":   request.fuel_name,
    }])

    logger.debug(f"Input for prediction: {input_df.to_dict(orient='records')}")

    # Preprocess
    X_processed = preprocessor.transform(input_df)

    # Predict
    y_pred = model.predict(X_processed, verbose=0).flatten()
    co2_mmt = float(np.maximum(y_pred[0], 0))  # clamp negatives to 0

    logger.info(
        f"Predicted CO2 for {request.state_name}/{request.sector_name}/{request.fuel_name}"
        f" ({request.year}): {co2_mmt:.4f} MMT"
    )

    return PredictResponse(
        year=request.year,
        state_name=request.state_name,
        sector_name=request.sector_name,
        fuel_name=request.fuel_name,
        predicted_co2_mmt=round(co2_mmt, 4),
    )