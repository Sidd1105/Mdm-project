import { useState, useCallback } from 'react'
import { Layers, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { carbonApi } from '@/api/client'
import { useApi } from '@/hooks/useApi'
import { LEVEL_CONFIG } from '@/utils/constants'
import { SectionHeader, Spinner, EmptyState, ProgressBar } from '@/components/ui'
import { clsx } from 'clsx'

const THRESHOLDS = [
  { label: 'Low',      range: '< 5 MMT',    pct: 25 },
  { label: 'Moderate', range: '5–25 MMT',   pct: 50 },
  { label: 'High',     range: '25–75 MMT',  pct: 75 },
  { label: 'Critical', range: '≥ 75 MMT',   pct: 100 },
]

export default function ClassifyPage() {
  const [co2, setCo2] = useState('')
  const { data, loading, execute } = useApi(useCallback(
    (v) => carbonApi.classify(v), []
  ))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const val = parseFloat(co2)
    if (isNaN(val) || val <= 0) return toast.error('Enter a positive CO₂ value in MMT')
    const result = await execute(val)
    if (result) toast.success(`Classified as ${result.level}`)
  }

  const cfg = data ? LEVEL_CONFIG[data.level] : null

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      <SectionHeader
        title="Emission Classification"
        subtitle="Classify CO₂ emission severity into Low, Moderate, High, or Critical levels."
        icon={Layers}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input + Threshold Reference */}
        <div className="space-y-5">
          <div className="card">
            <h2 className="font-display font-semibold text-lg text-white mb-6">Enter CO₂ Value</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">CO₂ Emissions (Million Metric Tons)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={co2}
                    onChange={(e) => setCo2(e.target.value)}
                    placeholder="e.g. 42.5"
                    className="input-field pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-500">MMT</span>
                </div>
              </div>
              {/* Quick fill buttons */}
              <div className="flex gap-2 flex-wrap">
                {[2, 15, 50, 120].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setCo2(String(v))}
                    className="px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors border border-slate-700"
                  >
                    {v} MMT
                  </button>
                ))}
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
                {loading ? <><Spinner size={16} /> Classifying...</> : <><Layers size={16} /> Classify Level</>}
              </button>
            </form>
          </div>

          {/* Threshold reference card */}
          <div className="card">
            <h3 className="font-display font-semibold text-sm text-slate-300 mb-4 uppercase tracking-widest">Threshold Reference</h3>
            <div className="space-y-3">
              {THRESHOLDS.map(({ label, range, pct }) => {
                const c = LEVEL_CONFIG[label]
                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-slate-500 w-16">{label}</span>
                    <ProgressBar value={pct} max={100} color={c.color} className="flex-1" />
                    <span className="font-mono text-[10px] text-slate-400 w-20 text-right">{range}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Result */}
        <div>
          {data && cfg ? (
            <div className={clsx('card border h-full flex flex-col', cfg.border, cfg.bg)}>
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">{cfg.icon}</div>
                <div>
                  <div className="font-mono text-xs text-slate-500 uppercase tracking-widest">Emission Level</div>
                  <div className="font-display font-extrabold text-3xl" style={{ color: cfg.color }}>
                    {data.level}
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <div className="label">CO₂ Input</div>
                  <div className="font-mono text-2xl text-white">{data.co2_mmt} <span className="text-sm text-slate-400">MMT</span></div>
                </div>
                <div className="divider" />
                <div>
                  <div className="label">Threshold</div>
                  <div className="font-mono text-sm text-slate-300">{data.threshold_info}</div>
                </div>
                <div>
                  <div className="label">Assessment</div>
                  <p className="text-sm text-slate-300 font-body leading-relaxed">{data.description}</p>
                </div>
              </div>

              {/* Gauge bar */}
              <div className="mt-6">
                <div className="label mb-2">Severity Gauge</div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: data.level === 'Low' ? '25%' : data.level === 'Moderate' ? '50%' : data.level === 'High' ? '75%' : '100%',
                      backgroundColor: cfg.color,
                      boxShadow: `0 0 12px ${cfg.color}60`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1 font-mono text-[9px] text-slate-600">
                  <span>LOW</span><span>MODERATE</span><span>HIGH</span><span>CRITICAL</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-[400px]">
              <EmptyState
                icon={AlertTriangle}
                title="No classification yet"
                description="Enter a CO₂ value in MMT and click Classify Level."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
