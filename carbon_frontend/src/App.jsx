import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import PredictPage from '@/pages/PredictPage'
import ClassifyPage from '@/pages/ClassifyPage'
import OffsetPage from '@/pages/OffsetPage'
import ChatbotPage from '@/pages/ChatbotPage'
import AnalyzePage from '@/pages/AnalyzePage'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"         element={<Dashboard />} />
        <Route path="/predict"  element={<PredictPage />} />
        <Route path="/classify" element={<ClassifyPage />} />
        <Route path="/offset"   element={<OffsetPage />} />
        <Route path="/chatbot"  element={<ChatbotPage />} />
        <Route path="/analyze"  element={<AnalyzePage />} />
        <Route path="/*"         element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
