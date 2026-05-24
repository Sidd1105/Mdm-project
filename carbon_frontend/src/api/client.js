import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 0, // no timeout for chatbot/RAG responses
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — log in dev
api.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data)
  }
  return config
})

// Response interceptor — normalize errors
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

// ── Endpoints ─────────────────────────────────────────────────────────────────

export const carbonApi = {
  /** Health check */
  health: () => api.get('/health'),

  /** Predict CO₂ from ANN */
  predict: (data) =>
    api.post('/predict', {
      year: data.year,
      'state-name': data.stateName,
      'sector-name': data.sectorName,
      'fuel-name': data.fuelName,
    }),

  /** Classify emission level */
  classify: (co2Mmt) => api.post('/classify', { co2_mmt: co2Mmt }),

  /** Calculate offset */
  offset: (co2Mmt) => api.post('/offset', { co2_mmt: co2Mmt }),

  /** RAG chatbot query */
  ragQuery: (query, topK = 3, model = 'phi3') =>
    api.post('/rag/query', { query, top_k: topK, model }),

  /** Full pipeline: predict → classify → offset → RAG */
  analyze: (data) =>
    api.post('/analyze', {
      year: data.year,
      'state-name': data.stateName,
      'sector-name': data.sectorName,
      'fuel-name': data.fuelName,
      model: data.model || 'phi3',
    }),
}

export default api
