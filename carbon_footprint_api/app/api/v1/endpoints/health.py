from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

from app.core.config import settings

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    timestamp: str


@router.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """Returns API liveness status."""
    return HealthResponse(
        status="ok",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        timestamp=datetime.utcnow().isoformat() + "Z",
    )
