from fastapi import APIRouter, HTTPException
import logging

from app.schemas.rag import (
    RAGQueryRequest, RAGQueryResponse,
    AnalyzeRequest, AnalyzeResponse,
)
from app.schemas.prediction import PredictRequest
from app.schemas.classification import ClassifyRequest
from app.schemas.offset import OffsetRequest
from app.services.rag_service import rag_chatbot_query, get_policy_advice
from app.services.prediction_service import predict_emission
from app.services.classification_service import classify_emission_raw
from app.services.offset_service import calculate_offset_raw

router = APIRouter()
logger = logging.getLogger("carbon_api.endpoint.rag")


@router.post("/rag/query", response_model=RAGQueryResponse, tags=["RAG"])
def rag_query(request: RAGQueryRequest):
    """
    **RAG-powered policy chatbot.**

    Ask any natural-language question about carbon emissions, regulations,
    or sustainability policies. The system retrieves relevant policy documents
    from the FAISS vector store and generates a grounded answer via an LLM.

    Optionally mention a CO₂ value (e.g. "10 MMT") in your query to get
    offset and classification context automatically included.

    **Example:**
    ```json
    {
      "query": "What does the Clean Air Act say about industrial emissions above 25,000 metric tons?",
      "top_k": 3,
      "model": "phi3"
    }
    ```
    """
    try:
        return rag_chatbot_query(request)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"RAG query error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"RAG query failed: {str(e)}")


@router.post("/analyze", response_model=AnalyzeResponse, tags=["Full Pipeline"])
def analyze(request: AnalyzeRequest):
    """
    **Full end-to-end pipeline** — one request, complete sustainability report.

    Steps executed:
    1. **Predict** CO₂ emissions via ANN model
    2. **Classify** emission severity (Low / Moderate / High / Critical)
    3. **Calculate** carbon offset (trees, turbines, solar, forest area)
    4. **Generate** policy-based recommendations via RAG

    **Example request body:**
    ```json
    {
      "year": 2021,
      "state-name": "California",
      "sector-name": "Transportation carbon dioxide emissions",
      "fuel-name": "Petroleum",
      "model": "phi3"
    }
    ```
    """
    try:
        # Step 1: Predict
        predict_req = PredictRequest(
            year=request.year,
            **{"state-name": request.state_name,
               "sector-name": request.sector_name,
               "fuel-name": request.fuel_name},
        )
        prediction = predict_emission(predict_req)
        co2_mmt = prediction.predicted_co2_mmt
        co2_tons = co2_mmt * 1_000_000

        # Step 2: Classify
        level, color, _ = classify_emission_raw(co2_mmt)

        # Step 3: Offset
        offset = calculate_offset_raw(co2_tons)

        # Step 4: RAG
        advice, chunks = get_policy_advice(
            state=request.state_name,
            sector=request.sector_name,
            fuel=request.fuel_name,
            year=request.year,
            co2_tons=co2_tons,
            emission_level=level,
            model=request.model,
        )

        return AnalyzeResponse(
            year=request.year,
            state_name=request.state_name,
            sector_name=request.sector_name,
            fuel_name=request.fuel_name,
            predicted_co2_mmt=co2_mmt,
            emission_level=level,
            emission_color=color,
            offset=offset,
            recommendations=advice,
            retrieved_sources=chunks,
        )

    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Full pipeline error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analysis pipeline failed: {str(e)}")
