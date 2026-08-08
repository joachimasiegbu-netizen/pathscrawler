import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import demoCareers from '../data/demoCareers'
import type { Career } from '../data/demoCareers'
import subjectsData from '../data/subjects.json'
import HighlightMatch from './HighlightMatch'

const subjectLabelById: Record<string, string> = Object.fromEntries(
  subjectsData.map((subject) => [subject.id, subject.label]),
)

const MAX_DROPDOWN_RESULTS = 8
const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 200

function careerMatchesQuery(career: Career, query: string): boolean {
  if (career.title.toLowerCase().includes(query)) return true
  if (career.category.toLowerCase().includes(query)) return true
  if (career.description.toLowerCase().includes(query)) return true
  if (career.dayToDay.some((task) => task.toLowerCase().includes(query))) return true
  if (career.requirements.some((req) => req.toLowerCase().includes(query))) return true
  if (career.matchedSubjects.some((id) => (subjectLabelById[id] ?? id).toLowerCase().includes(query))) return true
  return false
}

export default function GlobalSearchBar() {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const desktopInputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Clearing the input skips the debounce - otherwise the last query's
    // (now-stale) results stay on screen for up to DEBOUNCE_MS after the
    // user deletes everything, which reads as "random cards" lingering.
    if (!inputValue.trim()) {
      setDebouncedQuery('')
      return
    }
    const timer = setTimeout(() => setDebouncedQuery(inputValue), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [inputValue])

  const normalizedQuery = debouncedQuery.trim().toLowerCase()

  const allMatches = useMemo(() => {
    if (normalizedQuery.length < MIN_QUERY_LENGTH) return []
    return demoCareers.filter((career) => careerMatchesQuery(career, normalizedQuery))
  }, [normalizedQuery])

  const visibleMatches = allMatches.slice(0, MAX_DROPDOWN_RESULTS)
  const hasMore = allMatches.length > MAX_DROPDOWN_RESULTS
  // Gate on the live inputValue too, not just the debounced query - so the
  // dropdown disappears the instant the field empties, without waiting on
  // the debounce timer to catch up.
  const showDropdown = isOpen && inputValue.trim().length >= MIN_QUERY_LENGTH && normalizedQuery.length >= MIN_QUERY_LENGTH

  const closeAll = () => {
    setIsOpen(false)
    setMobileExpanded(false)
  }

  const goToCareer = (id: number) => {
    navigate(`/career/${id}`)
    setInputValue('')
    closeAll()
  }

  const goToFullResults = () => {
    if (!inputValue.trim()) return
    navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`)
    setIsOpen(false)
    setMobileExpanded(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      goToFullResults()
    }
    if (event.key === 'Escape') {
      closeAll()
      desktopInputRef.current?.blur()
      mobileInputRef.current?.blur()
    }
  }

  const dropdown = (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
        {visibleMatches.length > 0 ? (
          <>
            {visibleMatches.map((career) => (
              <button
                key={career.id}
                type="button"
                onClick={() => goToCareer(career.id)}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <HighlightMatch text={career.title} query={debouncedQuery} />
                  </p>
                  <span className="mt-0.5 inline-block rounded-full bg-primary-soft/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-dark dark:bg-primary/15 dark:text-primary-light">
                    {career.category}
                  </span>
                </div>
                <span className="shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400">{career.salary}</span>
              </button>
            ))}
            {hasMore ? (
              <button
                type="button"
                onClick={goToFullResults}
                className="mt-1 flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary-soft/40 dark:text-primary-light dark:hover:bg-primary/10"
              >
                View all {allMatches.length} results →
              </button>
            ) : null}
          </>
        ) : (
          <p className="px-3 py-4 text-center text-sm text-slate-500 dark:text-slate-400">No careers found.</p>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Desktop / tablet: compact inline search bar */}
      <div className="relative hidden sm:block sm:w-56 md:w-72">
        {/* z-50 here keeps the input clickable above the dropdown's z-40
            click-outside overlay below - both siblings in the same local
            stacking context, so DOM order alone wouldn't decide paint order. */}
        <div className="relative z-50">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={desktopInputRef}
            type="search"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search careers..."
            aria-label="Search careers"
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
        {showDropdown ? dropdown : null}
      </div>

      {/* Mobile: icon button that expands into a full-width search bar */}
      <button
        type="button"
        onClick={() => {
          setMobileExpanded(true)
          setTimeout(() => mobileInputRef.current?.focus(), 0)
        }}
        aria-label="Search careers"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-primary-light dark:ring-slate-700 sm:hidden"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Mobile: expanded panel - positioned relative to the header row
          (which needs `relative` for this `top-full` anchor to work). */}
      {mobileExpanded ? (
        <div className="absolute inset-x-4 top-full z-50 mt-2 sm:hidden">
          <div className="relative">
            {/* z-50 wrapper for the same reason as the desktop variant above -
                keeps the input and close button clickable above the dropdown's
                z-40 click-outside overlay. */}
            <div className="relative z-50">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                ref={mobileInputRef}
                type="search"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search careers..."
                aria-label="Search careers"
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 shadow-lg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => {
                  setInputValue('')
                  closeAll()
                }}
                aria-label="Close search"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {showDropdown ? dropdown : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
