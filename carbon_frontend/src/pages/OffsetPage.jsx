import { useState, useCallback } from 'react'
import { Trees, Wind, Sun, Leaf, BarChart2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { carbonApi } from '@/api/client'
import { useApi } from '@/hooks/useApi'
import { SectionHeader, StatCard, Spinner, EmptyState } from '@/components/ui'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

export default function OffsetPage() {
  const [co2, setCo2] = useState('')
  const { data, loading, execute } = useApi(useCallback(
    (v) => carbonApi.offset(v), []
  ))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const val = parseFloat(co2)
    if (isNaN(val) || val <= 0) return toast.error('Enter a positive CO₂ value')
    const result = await execute(val)
    if (result) toast.success('Offset calculated!')
  }

  const chartData = data ? [
    { name: 'Trees',    value: Math.min(data.trees_needed / 1000000, 100),   fill: '#39ff14' },
    { name: 'Turbines', value: Math.min(data.wind_turbines / 10000, 80),      fill: '#06b6d4' },
    { name: 'Solar',    value: Math.min(data.solar_capacity_mw / 100000, 60), fill: '#f59e0b' },
  ] : []

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">
      <SectionHeader
        title="Carbon Offset Calculator"
        subtitle="Calculate how many trees, turbines, or MW of solar are needed to neutralize CO₂ emissions."
        icon={Trees}
      />

      {/* Input */}
      <div className="card mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="label">CO₂ Emissions (MMT)</label>
            <div className="relative">
              <input
                type="number" step="0.001" min="0"
                value={co2}
                onChange={(e) => setCo2(e.target.value)}
                placeholder="e.g. 10.5"
                className="input-field pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-500">MMT</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[1, 5, 25, 100].map((v) => (
              <button key={v} type="button" onClick={() => setCo2(String(v))}
                className="px-3 py-3 text-xs font-mono rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700 transition-colors">
                {v} MMT
              </button>
            ))}
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2 whitespace-nowrap" disabled={loading}>
            {loading ? <><Spinner size={16} /> Calculating...</> : <><Trees size={16} /> Calculate Offset</>}
          </button>
        </form>
      </div>

      {data ? (
        <div className="space-y-5">
          {/* Interpretation banner */}
          <div className="glass rounded-2xl p-5 border border-acid/20 bg-acid/5">
            <div className="flex items-start gap-3">
              <Leaf size={18} className="text-acid mt-0.5 flex-shrink-0" />
              <p className="text-sm font-body text-slate-300 leading-relaxed">{data.interpretation}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Big stats */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <div className="card border-green-700/30 bg-green-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <Trees size={18} className="text-green-400" />
                  <span className="label text-green-500 mb-0">Trees Needed</span>
                </div>
                <div className="font-display font-extrabold text-3xl text-green-400">{fmt(data.trees_needed)}</div>
                <div className="font-mono text-xs text-slate-500 mt-1">@ 22 kg CO₂/tree/year</div>
              </div>

              <div className="card border-cyan-700/30 bg-cyan-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <Wind size={18} className="text-cyan-400" />
                  <span className="label text-cyan-500 mb-0">Wind Turbines</span>
                </div>
                <div className="font-display font-extrabold text-3xl text-cyan-400">{fmt(data.wind_turbines)}</div>
                <div className="font-mono text-xs text-slate-500 mt-1">@ 4,600 t CO₂/turbine/year</div>
              </div>

              <div className="card border-amber-700/30 bg-amber-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sun size={18} className="text-amber-400" />
                  <span className="label text-amber-500 mb-0">Solar Capacity</span>
                </div>
                <div className="font-display font-extrabold text-3xl text-amber-400">{fmt(data.solar_capacity_mw)}</div>
                <div className="font-mono text-xs text-slate-500 mt-1">MW solar required</div>
              </div>

              <div className="card border-teal-700/30 bg-teal-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf size={18} className="text-teal-400" />
                  <span className="label text-teal-500 mb-0">Forest Area</span>
                </div>
                <div className="font-display font-extrabold text-3xl text-teal-400">{fmt(data.forest_hectares)}</div>
                <div className="font-mono text-xs text-slate-500 mt-1">hectares of forest</div>
              </div>
            </div>

            {/* Radial chart */}
            <div className="card flex flex-col items-center justify-center">
              <div className="label mb-3 text-center">Offset Comparison</div>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={chartData} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={4} />
                  <Tooltip
                    formatter={(val, name) => [val.toFixed(1) + '%', name]}
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontFamily: 'DM Mono' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 w-full mt-2">
                {[{ label: 'Trees', color: '#39ff14' }, { label: 'Turbines', color: '#06b6d4' }, { label: 'Solar MW', color: '#f59e0b' }].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Raw numbers */}
          <div className="card">
            <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-4">Raw Data</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Input CO₂" value={`${data.co2_tons} Tons`} />
              <StatCard label="Tons" value={data.co2_tons.toLocaleString()} />
              <StatCard label="Trees" value={data.trees_needed.toLocaleString()} accent />
              <StatCard label="Forest (ha)" value={data.forest_hectares.toLocaleString()} />
            </div>
          </div>
        </div>
      ) : (
        <div className="card flex items-center justify-center min-h-[300px]">
          <EmptyState icon={BarChart2} title="No offset calculated" description="Enter a CO₂ value above and click Calculate Offset." />
        </div>
      )}
    </div>
  )
}
