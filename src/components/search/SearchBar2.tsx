import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import demoCareers2 from '../../data/demoCareers2'
import type { Career2 } from '../../data/demoCareers2'
import subjectsData from '../../data/subjects.json'
import { usePathStore } from '../../store/usePathStore'
import HighlightMatch from '../HighlightMatch'

// The search bar the app actually uses now. Same UI and matching logic as
// SearchBar1, but searches demoCareers2.js (which carries hardSkills/
// softSkills) and, on picking a result, sets currentJob - the exact same
// Zustand field and value shape the "what do you do now" job-button grid
// uses - instead of jumping straight to a /career/:id page. A search pick
// is stored as the career's numeric id, stringified (e.g. "94"); a button
// pick is a currentRoles slug (e.g. "retail-manager"). The two can never
// collide - slugs are always kebab-case words, never pure digits - so
// CareerChangerResultsPage.tsx can tell them apart and fall back to
// demoCareers2's own hardSkills/softSkills when the id doesn't resolve
// against the curated 21-role currentJobSkills map. This makes a search
// pick behave identically downstream to a button pick: same matching
// pipeline, same exclusion of the picked career from its own results.
// No "view all results" here (unlike SearchBar1) - there's no demoCareers2
// equivalent of the full /search results page.

const subjectLabelById: Record<string, string> = Object.fromEntries(
  subjectsData.map((subject) => [subject.id, subject.label]),
)

const MAX_DROPDOWN_RESULTS = 8
const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 200

// Small decorative dot per category - not a legend (the title text is always
// the primary, sufficient identifier), so this is a secondary cue rather
// than a chart needing full CVD validation. The first 8 come from the
// dataviz skill's validated categorical palette in its fixed order; the
// remaining 4 categories (demoCareers2.js has 12) extend it with additional
// visually-distinct hues since there's no legend-driven requirement to hold
// them to the same all-pairs bar.
const CATEGORY_DOT_CLASS: Record<string, string> = {
  'Technology & Digital': 'bg-[#2a78d6] dark:bg-[#3987e5]',
  'Business & Finance': 'bg-[#eb6834] dark:bg-[#d95926]',
  'Healthcare & Medicine': 'bg-[#1baf7a] dark:bg-[#199e70]',
  'Engineering & Manufacturing': 'bg-[#eda100] dark:bg-[#c98500]',
  'Creative & Media': 'bg-[#e87ba4] dark:bg-[#d55181]',
  'Education & Training': 'bg-[#008300] dark:bg-[#008300]',
  'Science & Research': 'bg-[#4a3aa7] dark:bg-[#9085e9]',
  'Service & Hospitality': 'bg-[#e34948] dark:bg-[#e66767]',
  'Agriculture & Animal Care': 'bg-[#0d9488] dark:bg-[#2dd4bf]',
  'Construction & Trades': 'bg-[#78716c] dark:bg-[#a8a29e]',
  'Public Services': 'bg-[#4f46e5] dark:bg-[#818cf8]',
  'Sport & Leisure': 'bg-[#ec4899] dark:bg-[#f472b6]',
}
const DEFAULT_CATEGORY_DOT_CLASS = 'bg-slate-400 dark:bg-slate-500'

function careerMatchesQuery(career: Career2, query: string): boolean {
  if (career.title.toLowerCase().includes(query)) return true
  if (career.category.toLowerCase().includes(query)) return true
  if (career.description.toLowerCase().includes(query)) return true
  if (career.dayToDay.some((task) => task.toLowerCase().includes(query))) return true
  if (career.requirements.some((req) => req.toLowerCase().includes(query))) return true
  if (career.matchedSubjects.some((id) => (subjectLabelById[id] ?? id).toLowerCase().includes(query))) return true
  return false
}

export default function SearchBar2() {
  const navigate = useNavigate()
  const setCurrentJob = usePathStore((state) => state.setCurrentJob)
  const [inputValue, setInputValue] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
    return demoCareers2.filter((career) => careerMatchesQuery(career, normalizedQuery))
  }, [normalizedQuery])

  const visibleMatches = allMatches.slice(0, MAX_DROPDOWN_RESULTS)
  // Gate on the live inputValue too, not just the debounced query - so the
  // dropdown disappears the instant the field empties, without waiting on
  // the debounce timer to catch up.
  const showDropdown = isOpen && inputValue.trim().length >= MIN_QUERY_LENGTH && normalizedQuery.length >= MIN_QUERY_LENGTH

  const chooseCareer = (id: number) => {
    setCurrentJob(String(id))
    navigate('/career-changer/preferences')
    setInputValue('')
    setIsOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && visibleMatches[0]) {
      event.preventDefault()
      chooseCareer(visibleMatches[0].id)
    }
    if (event.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative">
      {/* z-50 keeps the input clickable above the dropdown's z-40
          click-outside overlay below - both siblings in the same local
          stacking context, so DOM order alone wouldn't decide paint order. */}
      <div className="relative z-50">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
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

      {showDropdown ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            {visibleMatches.length > 0 ? (
              <div className="flex max-h-[60vh] flex-wrap gap-2 overflow-y-auto">
                {visibleMatches.map((career) => (
                  <button
                    key={career.id}
                    type="button"
                    onClick={() => chooseCareer(career.id)}
                    className="inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full ${CATEGORY_DOT_CLASS[career.category] ?? DEFAULT_CATEGORY_DOT_CLASS}`} aria-hidden="true" />
                    <span className="truncate">
                      <HighlightMatch text={career.title} query={debouncedQuery} />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="px-3 py-4 text-center text-sm text-slate-500 dark:text-slate-400">No careers found. Try a different search.</p>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}
