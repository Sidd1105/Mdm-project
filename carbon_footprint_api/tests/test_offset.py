"""
Tests for /api/v1/classify and /api/v1/offset endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock


@pytest.fixture
def client():
    with patch("app.models.loader.ann_model", MagicMock()), \
         patch("app.models.loader.preprocessor", MagicMock()), \
         patch("app.models.loader.vector_db", MagicMock()), \
         patch("app.models.loader.embeddings_model", MagicMock()):
        from app.main import app
        yield TestClient(app)


# ── Classification Tests ──────────────────────────────────────────────────────

@pytest.mark.parametrize("co2,expected_level", [
    (1.0,   "Low"),
    (10.0,  "Moderate"),
    (50.0,  "High"),
    (100.0, "Critical"),
])
def test_classify_levels(client, co2, expected_level):
    response = client.post("/api/v1/classify", json={"co2_mmt": co2})
    assert response.status_code == 200
    assert response.json()["level"] == expected_level


def test_classify_response_has_description(client):
    response = client.post("/api/v1/classify", json={"co2_mmt": 30.0})
    data = response.json()
    assert "description" in data
    assert "color" in data
    assert "threshold_info" in data


def test_classify_invalid_negative(client):
    response = client.post("/api/v1/classify", json={"co2_mmt": -5.0})
    assert response.status_code == 422


# ── Offset Tests ──────────────────────────────────────────────────────────────

def test_offset_returns_200(client):
    response = client.post("/api/v1/offset", json={"co2_mmt": 1.0})
    assert response.status_code == 200


def test_offset_trees_formula(client):
    """1 MMT = 1,000,000 t; 1 tree absorbs 0.022 t/yr → ~45,454,545 trees"""
    response = client.post("/api/v1/offset", json={"co2_mmt": 1.0})
    data = response.json()
    # Allow ±1% tolerance
    expected = int(1_000_000 / 0.022)
    assert abs(data["trees_needed"] - expected) / expected < 0.01


def test_offset_all_fields_present(client):
    response = client.post("/api/v1/offset", json={"co2_mmt": 5.0})
    data = response.json()
    for field in ["trees_needed", "wind_turbines", "solar_capacity_mw",
                  "forest_hectares", "interpretation", "co2_metric_tons"]:
        assert field in data


def test_offset_interpretation_is_string(client):
    response = client.post("/api/v1/offset", json={"co2_mmt": 20.0})
    assert isinstance(response.json()["interpretation"], str)
