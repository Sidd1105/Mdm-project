"""
Tests for /api/v1/rag/query endpoint.
Ollama LLM calls are mocked so tests run without a running server.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

from app.schemas.rag import PolicyChunk

MOCK_CHUNKS = [
    PolicyChunk(source="US-EPA-Clean-Air-Act", content="Industrial facilities...", score=0.91),
    PolicyChunk(source="Paris-Agreement-US-NDC-2021", content="US NDC commits...", score=0.85),
]


@pytest.fixture
def client():
    with patch("app.models.loader.ann_model", MagicMock()), \
         patch("app.models.loader.preprocessor", MagicMock()), \
         patch("app.models.loader.vector_db", MagicMock()), \
         patch("app.models.loader.embeddings_model", MagicMock()):
        from app.main import app
        yield TestClient(app)


def test_rag_query_returns_200(client):
    with patch("app.services.rag_service.retrieve_chunks", return_value=MOCK_CHUNKS), \
         patch("app.services.rag_service._call_ollama", return_value="Mocked LLM response."):
        response = client.post("/api/v1/rag/query", json={
            "query": "What are the EPA regulations for industrial CO2 emissions?",
            "top_k": 3,
            "model": "phi3",
        })
    assert response.status_code == 200


def test_rag_query_response_schema(client):
    with patch("app.services.rag_service.retrieve_chunks", return_value=MOCK_CHUNKS), \
         patch("app.services.rag_service._call_ollama", return_value="Mocked LLM response."):
        response = client.post("/api/v1/rag/query", json={
            "query": "How many trees offset 10 MMT of CO2?",
            "top_k": 2,
        })
    data = response.json()
    assert "answer" in data
    assert "sources" in data
    assert isinstance(data["sources"], list)


def test_rag_detects_co2_in_query(client):
    with patch("app.services.rag_service.retrieve_chunks", return_value=MOCK_CHUNKS), \
         patch("app.services.rag_service._call_ollama", return_value="Response."):
        response = client.post("/api/v1/rag/query", json={
            "query": "What should I do about 5 MMT emissions from my plant?",
        })
    data = response.json()
    assert data.get("co2_mmt_detected") == pytest.approx(5.0)


def test_rag_query_too_short(client):
    response = client.post("/api/v1/rag/query", json={"query": "hi"})
    assert response.status_code == 422


def test_health_endpoint(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
