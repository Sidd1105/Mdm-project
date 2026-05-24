export const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming','United States',
]

export const SECTORS = [
  'Industrial carbon dioxide emissions',
  'Total carbon dioxide emissions from all sectors',
  'Commercial carbon dioxide emissions',
  'Residential carbon dioxide emissions',
  'Transportation carbon dioxide emissions',
  'Electric Power carbon dioxide emissions',
  'Coal Mining carbon dioxide emissions',
  'Natural Gas Systems carbon dioxide emissions',
  'Petroleum Systems carbon dioxide emissions',
  'Agriculture carbon dioxide emissions',
  'Waste carbon dioxide emissions',
]

export const FUELS = [
  'Coal','Natural Gas','Petroleum','Geothermal','Hydroelectric',
  'Nuclear','Solar','Wind','Biomass','Other Gases',
]

export const SECTOR_SHORT = {
  'Industrial carbon dioxide emissions': 'Industrial',
  'Total carbon dioxide emissions from all sectors': 'All Sectors',
  'Commercial carbon dioxide emissions': 'Commercial',
  'Residential carbon dioxide emissions': 'Residential',
  'Transportation carbon dioxide emissions': 'Transportation',
  'Electric Power carbon dioxide emissions': 'Electric Power',
  'Coal Mining carbon dioxide emissions': 'Coal Mining',
  'Natural Gas Systems carbon dioxide emissions': 'Natural Gas',
  'Petroleum Systems carbon dioxide emissions': 'Petroleum',
  'Agriculture carbon dioxide emissions': 'Agriculture',
  'Waste carbon dioxide emissions': 'Waste Management',
}

export const LEVEL_CONFIG = {
  Low:      { color: '#39ff14', bg: 'bg-green-950/60',  border: 'border-green-700/50', text: 'text-green-400', label: 'Low',      icon: '🟢' },
  Moderate: { color: '#f59e0b', bg: 'bg-amber-950/60',  border: 'border-amber-700/50', text: 'text-amber-400', label: 'Moderate', icon: '🟡' },
  High:     { color: '#f97316', bg: 'bg-orange-950/60', border: 'border-orange-700/50',text: 'text-orange-400',label: 'High',     icon: '🟠' },
  Critical: { color: '#ff4d1c', bg: 'bg-red-950/60',    border: 'border-red-700/50',   text: 'text-red-400',   label: 'Critical', icon: '🔴' },
}

export const OLLAMA_MODELS = ['phi3', 'mistral', 'tinyllama', 'llama3', 'gemma']

export const YEARS = Array.from({ length: 55 }, (_, i) => 2024 - i) // 2024 → 1970
