import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Search } from 'lucide-react'
import { searchCourses, type CoursePreset } from '../data/courseCosts'
import HighlightMatch from './HighlightMatch'

// Same search-and-pick pattern as the app's career SearchBar2, but wired to
// the undergraduate subject list (courseCosts.ts) and returning the chosen
// course to a parent instead of navigating. Used by the Student Debt
// Calculator to pick a course by name; the picked course fills the tuition,
// length and salary fields below it.

const DEBOUNCE_MS = 180
const MIN_QUERY_LENGTH = 2

export default function CourseSearch({ onSelect }: { onSelect: (course: CoursePreset) => void }) {
  const [inputValue, setInputValue] = useState('')
  const [debounced, setDebounced] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!inputValue.trim()) {
      setDebounced('')
      return
    }
    const t = setTimeout(() => setDebounced(inputValue), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [inputValue])

  const query = debounced.trim().toLowerCase()
  const matches = useMemo(() => searchCourses(query), [query])
  const showDropdown = isOpen && inputValue.trim().length >= MIN_QUERY_LENGTH && query.length >= MIN_QUERY_LENGTH

  const pick = (course: CoursePreset) => {
    onSelect(course)
    setInputValue('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && matches[0]) {
      event.preventDefault()
      pick(matches[0])
    }
    if (event.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative">
      <div>
        <div className="relative z-30">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search for your course, e.g. Nursing, Law, Computer Science"
            aria-label="Search for a course"
            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        {showDropdown ? (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
            <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              {matches.length > 0 ? (
                <div className="flex max-h-[52vh] flex-col gap-1 overflow-y-auto">
                  {matches.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => pick(course)}
                      className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                    >
                      <span className="font-semibold text-slate-900 dark:text-white">
                        <HighlightMatch text={course.label} query={debounced} />
                      </span>
                      <span className="shrink-0 text-xs text-slate-400">{course.years} yr</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-3 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  No course found. Type the tuition and length in yourself below.
                </p>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
