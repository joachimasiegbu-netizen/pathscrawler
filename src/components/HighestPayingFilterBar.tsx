import { RotateCcw } from 'lucide-react'
import { FILTER_OPTIONS, SORT_OPTIONS, type FilterOption, type SortOption } from '../utils/highestPayingCareers'

interface HighestPayingFilterBarProps {
  sort: SortOption
  filter: FilterOption
  onSortChange: (sort: SortOption) => void
  onFilterChange: (filter: FilterOption) => void
}

export default function HighestPayingFilterBar({
  sort,
  filter,
  onSortChange,
  onFilterChange,
}: HighestPayingFilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="highest-paying-sort" className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Sort by
        </label>
        <select
          id="highest-paying-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>

        {filter !== 'all' ? (
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 transition hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Back to all categories
          </button>
        ) : null}
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter highest paying careers">
        {FILTER_OPTIONS.map((option) => {
          const isActive = filter === option.key
          return (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(option.key)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-150 ${
                isActive
                  ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-amber-700 dark:hover:text-amber-400'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
