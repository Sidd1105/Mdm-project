"""
Tests for /api/v1/predict endpoint.
Run: pytest tests/ -v
"""

import pytest
from unittest.mock import patch, MagicMock
import numpy as np
from fastapi.testclient import TestClient


# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest.fixture
def client():
    """Create test client with mocked model loader."""
    mock_model = MagicMock()
    mock_model.predict.return_value = np.array([[15.234]])

    mock_preprocessor = MagicMock()
    mock_preprocessor.transform.return_value = np.zeros((1, 50))

    with patch("app.models.loader.ann_model", mock_model), \
         patch("app.models.loader.preprocessor", mock_preprocessor), \
         patch("app.models.loader.vector_db", MagicMock()), \
         patch("app.models.loader.embeddings_model", MagicMock()):
        from app.main import app
        yield TestClient(app)


# ── Predict Tests ─────────────────────────────────────────────────────────────

VALID_PAYLOAD = {
    "year": 2020,
    "state-name": "Texas",
    "sector-name": "Electric Power carbon dioxide emissions",
    "fuel-name": "Coal",
}


def test_predict_returns_200(client):
    response = client.post("/api/v1/predict", json=VALID_PAYLOAD)
    assert response.status_code == 200


def test_predict_response_schema(client):
    response = client.post("/api/v1/predict", json=VALID_PAYLOAD)
    data = response.json()
    assert "predicted_co2_mmt" in data
    assert "state_name" in data
    assert "year" in data
    assert data["model_used"] == "ANN"


def test_predict_co2_is_non_negative(client):
    response = client.post("/api/v1/predict", json=VALID_PAYLOAD)
    assert response.json()["predicted_co2_mmt"] >= 0


def test_predict_invalid_year(client):
    payload = {**VALID_PAYLOAD, "year": 1800}
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422


def test_predict_missing_field(client):
    payload = {"year": 2020, "state-name": "Texas"}
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422
