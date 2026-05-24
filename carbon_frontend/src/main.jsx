import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(57,255,20,0.2)',
            fontFamily: 'DM Mono, monospace',
            fontSize: '13px',
          },
          success: {
            iconTheme: { primary: '#39ff14', secondary: '#080d18' },
          },
          error: {
            iconTheme: { primary: '#ff4d1c', secondary: '#080d18' },
          },
          duration: 4000,
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
