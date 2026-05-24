import { useState, useCallback } from 'react'
import { Zap, CheckCircle, Trees, Layers, Cpu, MessageSquare, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { carbonApi } from '@/api/client'
import { useApi } from '@/hooks/useApi'
import { US_STATES, SECTORS, FUELS, YEARS, SECTOR_SHORT, LEVEL_CONFIG, OLLAMA_MODELS } from '@/utils/constants'
import { SectionHeader, StatCard, Select, Spinner, EmptyState } from '@/components/ui'
import { clsx } from 'clsx'

function Step({ num, label, active, done }) {
  return (
    <div className="flex items-center gap-3">
      <div className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all',
        done ? 'bg-acid text-slate-950' : active ? 'bg-acid/20 text-acid border border-acid' : 'bg-slate-800 text-slate-500 border border-slate-700'
      )}>
        {done ? <CheckCircle size={16} /> : num}
      </div>
      <span className={clsx('text-sm font-body', done || active ? 'text-slate-200' : 'text-slate-500')}>{label}</span>
    </div>
  )
}

function SourceItem({ source }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/60 hover:bg-slate-700/60 transition-colors">
        <div className="flex items-center gap-2">
          <FileText size={12} className="text-acid" />
          <span className="font-mono text-xs text-slate-300">{source.source}</span>
          <span className="badge bg-slate-700 text-slate-400 border-0 text-[10px]">{(source.score * 100).toFixed(0)}%</span>
        </div>
        {open ? <ChevronUp size={12} className="text-slate-500" /> : <ChevronDown size={12} className="text-slate-500" />}
      </button>
      {open && <div className="px-3 py-2 text-xs font-mono text-slate-400 border-t border-slate-700/50 leading-relaxed">{source.content}</div>}
    </div>
  )
}

export default function AnalyzePage() {
  const [form, setForm] = useState({ year: 2020, stateName: '', sectorName: '', fuelName: '', model: 'phi3' })
  const { data, loading, execute } = useApi(useCallback((f) => carbonApi.analyze(f), []))

  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }))
  const isValid = form.stateName && form.sectorName && form.fuelName

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return toast.error('Please fill all required fields')
    const result = await execute(form)
    if (result) toast.success('Full pipeline analysis complete!')
  }

  const cfg = data ? LEVEL_CONFIG[data.emission_level] : null

  const STEPS = [
    { label: 'Predict CO₂ via ANN', icon: Cpu },
    { label: 'Classify Emission Level', icon: Layers },
    { label: 'Calculate Carbon Offset', icon: Trees },
    { label: 'Generate Policy Advice', icon: MessageSquare },
  ]

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">
      <SectionHeader
        title="Full Analysis Pipeline"
        subtitle="One click: predict → classify → offset → policy recommendation. Complete sustainability report."
        icon={Zap}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Form */}
        <div className="lg:col-span-2 card">
          <h2 className="font-display font-semibold text-lg text-white mb-6">Analysis Parameters</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Select label="Year" value={form.year} onChange={set('year')} options={YEARS.map((y) => ({ value: y, label: y }))} />
              <Select label="Fuel Type" value={form.fuelName} onChange={set('fuelName')} options={FUELS} placeholder="Select fuel..." />
            </div>
            <Select label="US State" value={form.stateName} onChange={set('stateName')} options={US_STATES} placeholder="Select state..." />
            <Select label="Emission Sector" value={form.sectorName} onChange={set('sectorName')} options={SECTORS.map((s) => ({ value: s, label: SECTOR_SHORT[s] || s }))} placeholder="Select sector..." />
            <Select label="LLM Model (for RAG)" value={form.model} onChange={set('model')} options={OLLAMA_MODELS} />
            <button type="submit" disabled={loading || !isValid} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Spinner size={16} /> Running Pipeline...</> : <><Zap size={16} /> Run Full Analysis</>}
            </button>
          </form>
        </div>

        {/* Pipeline steps */}
        <div className="card">
          <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-6">Pipeline Steps</h3>
          <div className="space-y-4">
            {STEPS.map(({ label, icon: Icon }, i) => (
              <Step key={i} num={i + 1} label={label}
                active={loading}
                done={!loading && data}
              />
            ))}
          </div>
          {loading && (
            <div className="mt-6 text-center">
              <Spinner size={24} />
              <div className="font-mono text-xs text-slate-500 mt-2">Processing all steps...</div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {data && cfg ? (
        <div className="space-y-5 animate-fade-up">
          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card border-acid/20 bg-acid/5 flex flex-col">
              <div className="font-mono text-xs text-acid uppercase tracking-widest mb-1">Predicted CO₂</div>
              <div className="font-display font-extrabold text-4xl text-acid">{data.predicted_co2_mmt.toFixed(3)}</div>
              <div className="font-mono text-xs text-slate-400 mt-1">Million Metric Tons</div>
            </div>

            <div className={clsx('card border flex flex-col', cfg.border, cfg.bg)}>
              <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: cfg.color }}>Emission Level</div>
              <div className="font-display font-extrabold text-4xl" style={{ color: cfg.color }}>
                {cfg.icon} {data.emission_level}
              </div>
              <div className="font-mono text-xs text-slate-400 mt-1">{data.state_name} · {SECTOR_SHORT[data.sector_name]}</div>
            </div>

            <div className="card border-green-700/30 bg-green-950/20 flex flex-col">
              <div className="font-mono text-xs text-green-400 uppercase tracking-widest mb-1">Trees Required</div>
              <div className="font-display font-extrabold text-4xl text-green-400">
                {data.offset.trees_needed >= 1_000_000
                  ? (data.offset.trees_needed / 1_000_000).toFixed(1) + 'M'
                  : data.offset.trees_needed.toLocaleString()}
              </div>
              <div className="font-mono text-xs text-slate-400 mt-1">@ 22 kg CO₂/tree/year</div>
            </div>
          </div>

          {/* Offset breakdown */}
          <div className="card">
            <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-4">Offset Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Trees" value={data.offset.trees_needed.toLocaleString()} icon={Trees} accent />
              <StatCard label="Wind Turbines" value={data.offset.wind_turbines.toLocaleString()} />
              <StatCard label="Solar (MW)" value={data.offset.solar_capacity_mw.toLocaleString()} />
              <StatCard label="Forest (ha)" value={data.offset.forest_hectares.toLocaleString()} />
            </div>
          </div>

          {/* RAG Recommendations */}
          <div className="card">
            <div className="flex items-center gap-3 mb-5">
              <MessageSquare size={18} className="text-acid" />
              <h3 className="font-display font-semibold text-lg text-white">Policy-Based Recommendations</h3>
              <span className="badge bg-acid/10 text-acid border border-acid/20 ml-auto">RAG · {form.model}</span>
            </div>
            <div className="glass rounded-xl p-5 text-sm font-body text-slate-300 leading-relaxed whitespace-pre-wrap mb-5">
              {data.recommendations}
            </div>
            <div>
              <div className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-3">Retrieved Policy Sources</div>
              <div className="space-y-2">
                {data.retrieved_sources.map((s, i) => <SourceItem key={i} source={s} />)}
              </div>
            </div>
          </div>
        </div>
      ) : !loading && (
        <div className="card flex items-center justify-center min-h-[240px]">
          <EmptyState icon={Zap} title="No analysis yet" description="Fill in the form and run the full analysis pipeline to get a complete sustainability report." />
        </div>
      )}
    </div>
  )
}
