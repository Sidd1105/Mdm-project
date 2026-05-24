import { clsx } from 'clsx'

/** Merge class names conditionally */
export function cn(...inputs) {
  return clsx(inputs)
}

/** Format large numbers: 1500000 → "1.5M", 45000 → "45K" */
export function formatNumber(n) {
  if (n == null) return '—'
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M'
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return Number(n).toLocaleString()
}

/** Round to N decimal places */
export function round(n, decimals = 3) {
  return Number(Math.round(n + 'e' + decimals) + 'e-' + decimals)
}

/** Clamp value between min and max */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

/** Convert MMT → tons */
export function mmtToTons(mmt) {
  return mmt * 1_000_000
}

/** Truncate string with ellipsis */
export function truncate(str, len = 60) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '…' : str
}

/** Delay in ms (for loading simulation / testing) */
export function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms))
}
