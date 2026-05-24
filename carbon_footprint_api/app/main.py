"""
Carbon Footprint API — FastAPI application entry point.
"""

from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import logger
from app.models.loader import load_all
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup: load all ML models and FAISS index into memory.
    Shutdown: nothing special needed (models are in-process).
    """
    logger.info("=" * 60)
    logger.info(f"  Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info("=" * 60)
    load_all()
    logger.info("Application ready.")
    yield
    logger.info("Application shutting down.")


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="""
## 🌿 Industrial Carbon Footprint Prediction & Sustainability Recommendation API

An AI-powered backend combining **ANN prediction**, **emission classification**,
**carbon offset calculation**, and a **RAG-based policy chatbot**.

### Key Endpoints
| Endpoint | Description |
|----------|-------------|
| `POST /api/v1/predict` | Predict CO₂ emissions using ANN |
| `POST /api/v1/classify` | Classify emission severity level |
| `POST /api/v1/offset` | Calculate carbon offset (trees / turbines / solar) |
| `POST /api/v1/rag/query` | Ask policy questions via RAG chatbot |
| `POST /api/v1/analyze` | Full pipeline: predict → classify → offset → recommend |

### Models Used
- **ANN** (TensorFlow/Keras) for CO₂ emission prediction
- **FAISS** vector store for semantic policy retrieval
- **Ollama / phi3** for LLM-based recommendation generation
        """,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register routes
    app.include_router(api_router, prefix="/api/v1")

    return app


app = create_app()
