import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 20, className = '' }) {
  return <Loader2 size={size} className={clsx('animate-spin text-acid', className)} />
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    acid:    'bg-green-950/60 text-green-400 border border-green-700/50',
    ember:   'bg-red-950/60 text-red-400 border border-red-700/50',
    amber:   'bg-amber-950/60 text-amber-400 border border-amber-700/50',
    orange:  'bg-orange-950/60 text-orange-400 border border-orange-700/50',
  }
  return (
    <span className={clsx('badge', variants[variant], className)}>
      {children}
    </span>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon: Icon, accent = false, className = '' }) {
  return (
    <div className={clsx('stat-card', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{label}</span>
        {Icon && (
          <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center',
            accent ? 'bg-acid/10 text-acid' : 'bg-slate-800 text-slate-400')}>
            <Icon size={15} />
          </div>
        )}
      </div>
      <div className={clsx('font-display font-bold text-2xl', accent ? 'text-acid' : 'text-white')}>
        {value}
      </div>
      {sub && <p className="text-xs text-slate-500 font-mono">{sub}</p>}
    </div>
  )
}

// ── Section Header ────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="flex items-start gap-4 mb-8">
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-acid/10 border border-acid/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon size={22} className="text-acid" />
        </div>
      )}
      <div>
        <h1 className="font-display font-bold text-3xl text-white">{title}</h1>
        {subtitle && <p className="text-slate-400 mt-1 font-body text-sm">{subtitle}</p>}
      </div>
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4">
        <Icon size={28} className="text-slate-500" />
      </div>
      <h3 className="font-display font-semibold text-slate-300 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 font-body max-w-xs">{description}</p>
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = '#39ff14', className = '' }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className={clsx('w-full h-1.5 bg-slate-800 rounded-full overflow-hidden', className)}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

// ── Copy Button ───────────────────────────────────────────────────────────────
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
export function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-colors">
      {copied ? <Check size={14} className="text-acid" /> : <Copy size={14} />}
    </button>
  )
}

// ── Select ────────────────────────────────────────────────────────────────────
import { ChevronDown } from 'lucide-react'
export function Select({ label, value, onChange, options, placeholder = 'Select...', className = '' }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="select-field pr-10"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={typeof opt === 'object' ? opt.value : opt} value={typeof opt === 'object' ? opt.value : opt}>
              {typeof opt === 'object' ? opt.label : opt}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      </div>
    </div>
  )
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
export function Tooltip({ children, text }) {
  return (
    <div className="relative group inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-xs text-slate-200 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 font-mono">
        {text}
      </div>
    </div>
  )
}
