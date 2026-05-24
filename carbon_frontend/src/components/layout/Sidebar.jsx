import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  LayoutDashboard, Cpu, Layers, Trees, MessageSquare,
  Activity, Zap, Github, ExternalLink
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/',          label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/predict',   label: 'Predict',      icon: Cpu },
  { to: '/classify',  label: 'Classify',     icon: Layers },
  { to: '/offset',    label: 'Carbon Offset',icon: Trees },
  { to: '/chatbot',   label: 'Policy RAG',   icon: MessageSquare },
  { to: '/analyze',   label: 'Full Pipeline',icon: Zap },
]

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-950 border-r border-slate-800/80 flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-acid flex items-center justify-center flex-shrink-0">
            <Activity size={18} className="text-slate-950" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-bold text-lg text-white leading-none">CarbonIQ</div>
            <div className="font-mono text-[10px] text-slate-500 mt-0.5 tracking-widest uppercase">Emission Intelligence</div>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="px-6 py-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse-slow" />
          API Connected · localhost:8000
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest px-3 mb-3">
          Modules
        </div>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-all duration-200 group',
                    isActive
                      ? 'bg-acid/10 text-acid border border-acid/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={17}
                      className={clsx(
                        'flex-shrink-0 transition-colors',
                        isActive ? 'text-acid' : 'text-slate-500 group-hover:text-slate-300'
                      )}
                    />
                    <span>{label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-acid" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-800/80">
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-[10px] font-mono text-slate-500 mb-1">Powered by</div>
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-acid">ANN</span>
            <span className="text-slate-700">·</span>
            <span>FAISS</span>
            <span className="text-slate-700">·</span>
            <span>Ollama</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
