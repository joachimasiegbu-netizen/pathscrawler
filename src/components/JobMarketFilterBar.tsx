import type { FilterKey } from '../utils/easyEntryCareers'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'no-quals', label: 'No qualifications needed' },
  { key: 'quick-cert', label: 'Quick certificate' },
  { key: 'apprenticeship', label: 'Apprenticeship' },
  { key: 'part-time', label: 'Part-time friendly' },
]

interface JobMarketFilterBarProps {
  active: FilterKey
  onChange: (filter: FilterKey) => void
}

export default function JobMarketFilterBar({ active, onChange }: JobMarketFilterBarProps) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter by entry route">
      {FILTERS.map((filter) => {
        const isActive = active === filter.key
        return (
          <button
            key={filter.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.key)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-150 ${
              isActive
                ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:text-emerald-400'
            }`}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}
