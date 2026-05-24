from pydantic import BaseModel, Field
from typing import Optional
from app.schemas.classification import EmissionLevel


class PolicyChunk(BaseModel):
    source: str
    content: str
    score: float


class RAGQueryRequest(BaseModel):
    query: str = Field(..., min_length=5, description="Natural language query")
    top_k: int = Field(default=3, ge=1, le=10, description="Number of chunks to retrieve")
    model: str = Field(default="phi3", description="Ollama model to use for generation")


class RAGQueryResponse(BaseModel):
    query: str
    answer: str
    sources: list[PolicyChunk]
    co2_mmt_detected: Optional[float] = None


class AnalyzeRequest(BaseModel):
    """Full pipeline: predict → classify → offset → RAG recommendation."""
    year: int = Field(..., ge=1970, le=2030)
    state_name: str = Field(..., alias="state-name")
    sector_name: str = Field(..., alias="sector-name")
    fuel_name: str = Field(..., alias="fuel-name")
    model: str = Field(default="phi3", description="Ollama model for RAG")

    model_config = {"populate_by_name": True}


class AnalyzeResponse(BaseModel):
    year: int
    state_name: str
    sector_name: str
    fuel_name: str
    predicted_co2_mmt: float
    emission_level: EmissionLevel
    emission_color: str
    offset: dict
    recommendations: str
    retrieved_sources: list[PolicyChunk]
