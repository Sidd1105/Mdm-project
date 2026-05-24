# CarbonIQ – AI-Based Industrial Carbon Footprint Prediction & Offset Recommendation System

## Overview

CarbonIQ is an AI-powered industrial sustainability platform designed to predict carbon emissions, classify industrial facilities using satellite imagery, and generate policy-aware sustainability recommendations.

The system combines:
- Deep Learning (CNN + ANN)
- Machine Learning
- Retrieval-Augmented Generation (RAG)
- Clustering & Classification
- Environmental Policy Intelligence

The project predicts industrial CO₂ emissions using structured industrial datasets and satellite imagery while providing actionable carbon-offset and compliance recommendations aligned with:
- CPCB Standards
- NAPCC
- IPCC AR6
- Paris Agreement

---

## Key Features

### Carbon Emission Prediction
- ANN-based CO₂ regression model
- Predicts emissions in MMT (Million Metric Tons)
- Handles nonlinear industrial emission relationships

### Satellite Image Classification
- MobileNetV2 CNN classifies industrial facility types
- Uses NWPU-RESISC45 satellite imagery dataset
- Maps facility classes to sector and fuel context

### Emission Severity Classification
Severity levels:
- Low
- Moderate
- High
- Critical

### Carbon Offset Recommendation
Calculates:
- Trees required for carbon sequestration
- Renewable energy equivalents
- Forest area estimates

### RAG-Based Policy Recommendation Engine
Uses:
- FAISS vector database
- Sentence-transformer embeddings
- Phi-3 Local LLM

Provides:
- Compliance guidance
- Sustainability recommendations
- Regulatory insights

---

## System Architecture

The system follows a 3-tier architecture:

### Input Layer
- Year
- State Name
- Sector Name
- Fuel Type
- Satellite Images

### Processing Layer
- Data preprocessing
- CNN classification
- ANN prediction
- K-Medoids clustering
- Severity classification
- RAG recommendation engine

### Output Layer
- Carbon footprint prediction
- Severity level
- Trees required
- Sustainability recommendations

---

## Tech Stack

### Backend
- Python
- FastAPI
- TensorFlow
- Scikit-learn
- LangChain
- FAISS

### Frontend
- React
- Vite

### AI/ML Models
- MobileNetV2
- ANN Regression Model
- K-Medoids Clustering
- Phi-3 LLM

### Database & Retrieval
- FAISS Vector Store
- Sentence Transformers

---

## Dataset

### Structured Dataset
U.S. CO₂ Emissions Dataset (1970–2021)

Features:
- Year
- State
- Sector
- Fuel Type
- CO₂ Emissions (MMT)

### Image Dataset
NWPU-RESISC45 Satellite Imagery Dataset

Selected carbon-relevant facility classes:
- Thermal Power Station
- Industrial Area
- Harbour
- Freeway
- Storage Tank
- Residential Area
- Commercial Area

---

## Model Performance

| Model | MSE | R² Score |
|------|------|------|
| KNN | 50.62 | 0.99 |
| CART | 39.48 | 1.00 |
| ANN | 100.99 | 0.99 |
| SVM | 7082.76 | 0.10 |

ANN achieved high predictive performance while maintaining better generalization than CART.

---

## CNN Performance

- High classification accuracy on most facility classes
- Strong performance on:
  - Harbour
  - Forest
  - Freeway
- Main confusion:
  - Industrial Area vs Commercial Area

The model uses transfer learning with MobileNetV2 and a two-stage fine-tuning strategy.

---

## Installation

### Backend Setup

```bash
cd carbon_footprint_api
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd carbon_frontend
npm install
npm run dev
```

---

## RAG Knowledge Base

The recommendation engine uses:
- CPCB Standards
- NAPCC
- IPCC AR6
- Paris Agreement
- EPA Clean Air Act
- DOE Decarbonization Policies

Documents are chunked and indexed using FAISS for semantic retrieval.

---

## Future Scope

- Real-time IoT sensor integration
- Vision Transformers (ViT)
- Live carbon credit pricing
- SHAP/LIME explainability
- Global climate policy integration
- Real-time industrial monitoring

---

## Authors

- Sumit Kumar
- Aditya Kumbhar
- Siddhartha Konge
- Devesh Patil
- Yash Malsure

Department of Electronics and Telecommunication Engineering  
MIT Academy of Engineering, Pune

---

## Research Paper

**AI-Based Industrial Carbon Footprint Prediction & Offset Recommendation System**
