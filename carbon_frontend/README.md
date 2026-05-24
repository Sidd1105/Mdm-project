# 🌿 CarbonIQ — Frontend

React + Vite + Tailwind CSS frontend for the **Industrial Carbon Footprint Prediction & Policy Recommendation System**.

---

## 📁 Folder Structure

```
carbon_frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   └── client.js          ← Axios API client (all endpoints)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx     ← Page wrapper with grid bg + glow
│   │   │   └── Sidebar.jsx    ← Fixed nav sidebar
│   │   └── ui/
│   │       └── index.jsx      ← Badge, StatCard, Select, Spinner, etc.
│   ├── hooks/
│   │   └── useApi.js          ← Generic API hook (loading/error/data)
│   ├── pages/
│   │   ├── Dashboard.jsx      ← Home with feature cards + API status
│   │   ├── PredictPage.jsx    ← ANN prediction form + result
│   │   ├── ClassifyPage.jsx   ← Emission severity classifier + gauge
│   │   ├── OffsetPage.jsx     ← Carbon offset calc + radial chart
│   │   ├── ChatbotPage.jsx    ← RAG policy chatbot with sources
│   │   ├── AnalyzePage.jsx    ← Full pipeline end-to-end
│   │   └── NotFound.jsx       ← 404 page
│   ├── utils/
│   │   ├── constants.js       ← States, sectors, fuels, level config
│   │   └── helpers.js         ← formatNumber, round, truncate, etc.
│   ├── App.jsx                ← Route definitions
│   ├── main.jsx               ← React entry point + Toaster
│   └── index.css              ← Tailwind + custom design system
├── .env                       ← VITE_API_URL=/api/v1
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js             ← Proxy /api → localhost:8000
└── postcss.config.js
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- FastAPI backend running on `http://localhost:8000`

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server (auto-proxies API calls to :8000)
npm run dev

# Open in browser
http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#080d18` (slate-950) |
| Surface | `#0f172a` (slate-900) |
| Accent | `#39ff14` (acid green) |
| Danger | `#ff4d1c` (ember) |
| Display font | Syne (700/800) |
| Body font | Instrument Sans |
| Mono font | DM Mono |

### CSS Component Classes
| Class | Description |
|-------|-------------|
| `.card` | Glass morphism card |
| `.btn-primary` | Acid green CTA button |
| `.btn-ghost` | Outlined ghost button |
| `.input-field` | Dark styled input |
| `.select-field` | Styled select dropdown |
| `.label` | Uppercase mono label |
| `.glass` | Backdrop blur surface |
| `.badge` | Pill badge |

---

## 📡 API Endpoints Used

| Page | Method | Endpoint |
|------|--------|----------|
| Dashboard | GET | `/api/v1/health` |
| Predict | POST | `/api/v1/predict` |
| Classify | POST | `/api/v1/classify` |
| Offset | POST | `/api/v1/offset` |
| Chatbot | POST | `/api/v1/rag/query` |
| Analyze | POST | `/api/v1/analyze` |

---

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api/v1` | Backend API base URL |

For production deployment, change to:
```env
VITE_API_URL=https://your-api.example.com/api/v1
```

---

## 🪟 Windows Setup

```powershell
# Install Node.js from https://nodejs.org (LTS version)
# Then in PowerShell:
cd carbon_frontend
npm install
npm run dev
```

## 🍎 macOS Setup

```bash
# Install Node.js via Homebrew
brew install node

cd carbon_frontend
npm install
npm run dev
```
