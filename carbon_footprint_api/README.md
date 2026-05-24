# 🌿 Industrial Carbon Footprint Prediction API

A FastAPI backend for the **Multimodal AI System for Industrial Carbon Footprint Prediction and Policy-Based Sustainability Recommendation using RAG**.

---

## 📁 Project Structure

```
carbon_footprint_api/
├── app/
│   ├── main.py                   # FastAPI app entry point
│   ├── api/
│   │   └── v1/
│   │       ├── router.py         # Aggregates all routers
│   │       └── endpoints/
│   │           ├── predict.py    # ANN prediction endpoint
│   │           ├── classify.py   # Emission classification endpoint
│   │           ├── offset.py     # Carbon offset calculation endpoint
│   │           ├── rag.py        # RAG chatbot endpoint
│   │           └── health.py     # Health check endpoint
│   ├── core/
│   │   ├── config.py             # App settings (env vars)
│   │   └── logging.py            # Logging configuration
│   ├── models/
│   │   └── loader.py             # Load ANN + preprocessor on startup
│   ├── schemas/
│   │   ├── prediction.py         # Request/Response schemas for prediction
│   │   ├── classification.py     # Schemas for classification
│   │   ├── offset.py             # Schemas for offset calculation
│   │   └── rag.py                # Schemas for RAG chatbot
│   ├── services/
│   │   ├── prediction_service.py # Business logic for ANN prediction
│   │   ├── classification_service.py
│   │   ├── offset_service.py
│   │   └── rag_service.py        # FAISS retrieval + LLM generation
│   └── utils/
│       ├── sector_map.py         # Sector name → clean label mapping
│       └── constants.py          # Shared constants (SYSTEM_CONTEXT etc.)
├── models_artifacts/             # Place your .keras, .joblib, .faiss files here
│   ├── ann_model.keras
│   ├── preprocessor.joblib
│   ├── index.faiss
│   └── index.pkl
├── tests/
│   ├── test_predict.py
│   ├── test_offset.py
│   └── test_rag.py
├── .env.example
├── requirements.txt
└── README.md
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Copy your model artifacts
```bash
cp ann_model.keras models_artifacts/
cp preprocessor.joblib models_artifacts/
cp index.faiss models_artifacts/
cp index.pkl models_artifacts/
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 4. Run the server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Open API docs
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/predict` | Predict CO₂ emissions (ANN) |
| POST | `/api/v1/classify` | Classify emission severity |
| POST | `/api/v1/offset` | Calculate carbon offset |
| POST | `/api/v1/rag/query` | RAG chatbot query |
| POST | `/api/v1/analyze` | Full pipeline (predict → classify → offset → RAG) |

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | Carbon Footprint API | Application name |
| `APP_VERSION` | 1.0.0 | API version |
| `DEBUG` | False | Debug mode |
| `OLLAMA_BASE_URL` | http://localhost:11434 | Ollama server URL |
| `OLLAMA_MODEL` | phi3 | LLM model name |
| `FAISS_INDEX_PATH` | models_artifacts/ | Path to FAISS index |
| `ANN_MODEL_PATH` | models_artifacts/ann_model.keras | ANN model path |
| `PREPROCESSOR_PATH` | models_artifacts/preprocessor.joblib | Preprocessor path |
