import { useLocation } from 'react-router-dom'
import { GitCompare, X } from 'lucide-react'
import { useCompareStore } from '../store/useCompareStore'

interface CompareButtonProps {
  /** Disable entering selection mode when this page doesn't have enough cards to compare (e.g. fewer than 2 results). */
  disabled?: boolean
}

// The one "Compare" trigger used on every results page (see
// SelectableCareerCard / CompareFloatingButton for the rest of the flow).
// Self-contained: reads/writes useCompareStore directly and gets "which
// page am I on" from the router itself, so a page only needs to drop this
// in near its sort/filter controls - no wiring, no per-page compare state.
export default function CompareButton({ disabled = false }: CompareButtonProps) {
  const location = useLocation()
  const compareSelectionMode = useCompareStore((state) => state.compareSelectionMode)
  const selectedCount = useCompareStore((state) => state.selectedCompareCards.length)
  const enterCompareSelectionMode = useCompareStore((state) => state.enterCompareSelectionMode)
  const exitCompareSelectionMode = useCompareStore((state) => state.exitCompareSelectionMode)

  if (compareSelectionMode) {
    return (
      <div className="inline-flex items-center gap-3">
        <button
          type="button"
          onClick={exitCompareSelectionMode}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <X className="h-4 w-4 shrink-0" />
          Cancel
        </button>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{selectedCount}/3 selected</span>
      </div>
    )
  }

  return (
    <button
      type="button"
      // pathname alone would lose e.g. /search's `?q=...` - "back to where
      // you were" needs the query string too, or Back returns to an empty
      // search instead of the actual results the selection was made from.
      onClick={() => enterCompareSelectionMode(location.pathname + location.search)}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      <GitCompare className="h-4 w-4 shrink-0" />
      Compare
    </button>
  )
}
