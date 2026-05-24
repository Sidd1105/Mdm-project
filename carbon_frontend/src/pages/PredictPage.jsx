import { useState, useCallback } from 'react'
import { Cpu, TrendingUp, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { carbonApi } from '@/api/client'
import { useApi } from '@/hooks/useApi'
import { US_STATES, SECTORS, FUELS, YEARS, SECTOR_SHORT } from '@/utils/constants'
import { SectionHeader, StatCard, Select, Spinner, EmptyState } from '@/components/ui'

const FIELD = ({ label, children }) => (
  <div>
    <label className="label">{label}</label>
    {children}
  </div>
)

export default function PredictPage() {
  const [form, setForm] = useState({
    year: 2020,
    stateName: '',
    sectorName: '',
    fuelName: '',
  })

  const { data, loading, execute } = useApi(useCallback(
    (f) => carbonApi.predict(f), []
  ))

  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }))

  const isValid = form.stateName && form.sectorName && form.fuelName && form.year

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return toast.error('Please fill all fields')
    const result = await execute(form)
    if (result) toast.success('Prediction complete!')
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      <SectionHeader
        title="CO₂ Emission Prediction"
        subtitle="Run the ANN model with industrial parameters to predict annual CO₂ output."
        icon={Cpu}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 card">
          <h2 className="font-display font-semibold text-lg text-white mb-6">Input Parameters</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Year"
                value={form.year}
                onChange={set('year')}
                options={YEARS.map((y) => ({ value: y, label: y }))}
              />
              <Select
                label="Fuel Type"
                value={form.fuelName}
                onChange={set('fuelName')}
                options={FUELS}
                placeholder="Select fuel..."
              />
            </div>

            <Select
              label="US State"
              value={form.stateName}
              onChange={set('stateName')}
              options={US_STATES}
              placeholder="Select state..."
            />

            <Select
              label="Emission Sector"
              value={form.sectorName}
              onChange={set('sectorName')}
              options={SECTORS.map((s) => ({ value: s, label: SECTOR_SHORT[s] || s }))}
              placeholder="Select sector..."
            />

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
              {loading ? <><Spinner size={16} /> Predicting...</> : <><Cpu size={16} /> Predict Emissions</>}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="lg:col-span-2 space-y-4">
          {data ? (
            <>
              <div className="card border-acid/20 bg-acid/5">
                <div className="text-xs font-mono text-acid uppercase tracking-widest mb-2">Predicted Output</div>
                <div className="font-display font-extrabold text-5xl text-acid leading-none">
                  {data.predicted_co2_mmt.toFixed(3)}
                </div>
                <div className="font-mono text-sm text-slate-400 mt-1">Million Metric Tons CO₂</div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <StatCard label="State" value={data.state_name} icon={Info} />
                <StatCard label="Sector" value={SECTOR_SHORT[data.sector_name] || data.sector_name} />
                <StatCard label="Fuel" value={data.fuel_name} />
                <StatCard label="Year" value={data.year} />
                <StatCard label="Model" value={data.model_used} accent />
              </div>
            </>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-[320px]">
              <EmptyState
                icon={TrendingUp}
                title="No prediction yet"
                description="Fill in the parameters and click Predict Emissions to run the ANN model."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
