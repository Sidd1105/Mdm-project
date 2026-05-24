import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cpu, Layers, Trees, MessageSquare, Zap, Activity, TrendingUp, Shield, ArrowRight, CheckCircle, XCircle } from 'lucide-react'
import { carbonApi } from '@/api/client'
import { StatCard, Spinner } from '@/components/ui'

const FEATURES = [
  {
    to: '/predict',
    icon: Cpu,
    title: 'CO₂ Prediction',
    desc: 'ANN model predicts emission output from industrial parameters with state, sector, and fuel type.',
    badge: 'ANN Model',
    color: 'from-green-950/40 to-transparent',
    border: 'border-green-800/30 hover:border-acid/40',
  },
  {
    to: '/classify',
    icon: Layers,
    title: 'Severity Classification',
    desc: 'Classify emission levels as Low / Moderate / High / Critical based on MMT thresholds.',
    badge: 'Rule Engine',
    color: 'from-amber-950/40 to-transparent',
    border: 'border-amber-800/30 hover:border-amber-500/40',
  },
  {
    to: '/offset',
    icon: Trees,
    title: 'Carbon Offset',
    desc: 'Calculate trees, turbines, and solar capacity required to neutralize your carbon footprint.',
    badge: 'Offset Engine',
    color: 'from-teal-950/40 to-transparent',
    border: 'border-teal-800/30 hover:border-teal-500/40',
  },
  {
    to: '/chatbot',
    icon: MessageSquare,
    title: 'Policy RAG Chatbot',
    desc: 'Ask questions about EPA, NAPCC, Paris Agreement policies. Answers grounded in real documents.',
    badge: 'FAISS + LLM',
    color: 'from-violet-950/40 to-transparent',
    border: 'border-violet-800/30 hover:border-violet-500/40',
  },
  {
    to: '/analyze',
    icon: Zap,
    title: 'Full Pipeline',
    desc: 'One request triggers predict → classify → offset → policy recommendation end-to-end.',
    badge: 'All-in-One',
    color: 'from-blue-950/40 to-transparent',
    border: 'border-blue-800/30 hover:border-blue-500/40',
  },
]

export default function Dashboard() {
  const [health, setHealth] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    carbonApi.health()
      .then(setHealth)
      .catch(() => setHealth(null))
      .finally(() => setChecking(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto animate-fade-up">
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="badge bg-acid/10 text-acid border border-acid/20 font-mono text-xs">
            v1.0.0
          </span>
          {checking ? (
            <span className="badge bg-slate-800 text-slate-400 border border-slate-700">
              <Spinner size={10} /> Checking API...
            </span>
          ) : health ? (
            <span className="badge bg-green-950/60 text-green-400 border border-green-700/50">
              <CheckCircle size={11} /> API Online
            </span>
          ) : (
            <span className="badge bg-red-950/60 text-red-400 border border-red-700/50">
              <XCircle size={11} /> API Offline
            </span>
          )}
        </div>
        <h1 className="font-display font-extrabold text-5xl text-white leading-tight mb-3">
          Industrial Carbon<br />
          <span className="text-acid">Footprint Intelligence</span>
        </h1>
        <p className="text-slate-400 font-body text-lg max-w-2xl leading-relaxed">
          AI-powered system combining <span className="text-slate-200">ANN prediction</span>,{' '}
          <span className="text-slate-200">emission classification</span>,{' '}
          <span className="text-slate-200">carbon offset calculation</span>, and{' '}
          <span className="text-slate-200">RAG-based policy recommendations</span> for sustainable industrial operations.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <StatCard label="Model" value="ANN" sub="TensorFlow/Keras" icon={Activity} accent />
        <StatCard label="Vector DB" value="FAISS" sub="Semantic retrieval" icon={Shield} />
        <StatCard label="LLM" value="Ollama" sub="Local inference" icon={TrendingUp} />
        <StatCard label="Policies" value="6+" sub="US EPA, NAPCC, Paris" icon={Layers} />
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {FEATURES.map(({ to, icon: Icon, title, desc, badge, color, border }) => (
          <Link
            key={to}
            to={to}
            className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${color} ${border} p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center group-hover:border-current transition-colors">
                <Icon size={20} className="text-slate-300" />
              </div>
              <span className="badge bg-slate-800/80 text-slate-400 border border-slate-700 text-[10px]">
                {badge}
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-acid transition-colors">
              {title}
            </h3>
            <p className="text-sm text-slate-400 font-body leading-relaxed mb-4">{desc}</p>
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 group-hover:text-acid transition-colors">
              Open module <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* API info footer */}
      <div className="mt-8 glass rounded-2xl p-5 flex items-center justify-between">
        <div>
          <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Backend API</div>
          <div className="font-mono text-sm text-slate-300">
            http://localhost:8000 · <span className="text-acid">/api/v1</span>
          </div>
        </div>
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-sm flex items-center gap-2"
        >
          Swagger Docs <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}
