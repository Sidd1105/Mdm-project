import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-up">
      <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6">
        <AlertTriangle size={36} className="text-amber-400" />
      </div>
      <div className="font-display font-extrabold text-8xl text-acid mb-2">404</div>
      <h1 className="font-display font-bold text-2xl text-white mb-3">Page Not Found</h1>
      <p className="text-slate-400 font-body mb-8 max-w-sm">
        The module you're looking for doesn't exist. Check the sidebar for available sections.
      </p>
      <Link to="/" className="btn-primary flex items-center gap-2">
        <Home size={16} /> Back to Dashboard
      </Link>
    </div>
  )
}
