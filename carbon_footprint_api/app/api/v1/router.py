from fastapi import APIRouter

from app.api.v1.endpoints import health, predict, classify, offset, rag

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(predict.router)
api_router.include_router(classify.router)
api_router.include_router(offset.router)
api_router.include_router(rag.router)
