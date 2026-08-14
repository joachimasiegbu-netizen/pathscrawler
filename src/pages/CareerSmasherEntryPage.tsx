import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Hammer, Search } from 'lucide-react'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import demoCareers from '../data/demoCareers'
import { useAuthStore } from '../store/useAuthStore'
import { useMyBinderCards } from '../store/useBinderStore'
import { groupBinderCards } from '../utils/binderGrouping'

// A curated, varied-category sample rather than "first 8 in the array" -
// deliberately spans tech/healthcare/education/creative/finance/hospitality/
// public-services/business so the entry screen doesn't read as tech-biased
// just because demoCareers.js happens to list Technology & Digital first.
const POPULAR_CAREER_IDS = [1, 22, 46, 39, 12, 86, 90, 15]

// Chunk 1: entry screen only (search + popular careers + Binder shortcuts).
// Picking a career here just navigates to /career-smasher/:id - the actual
// skill-smash tree is Chunk 3, a placeholder page for now (see
// CareerSmasherTreePage.tsx). No loading-skeleton state: demoCareers.js is
// a static bundled import, never actually async, same reasoning already
// established elsewhere in this app (JobMarketRollPage.tsx) - there's
// nothing that would ever be "still loading" here to show a skeleton for.
export default function CareerSmasherEntryPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const currentUser = useAuthStore((state) => state.currentUser)
  // Resolves to an empty array while signed out (Binder is account-gated) -
  // the "From your Binder" section below just naturally disappears then,
  // no extra currentUser branching needed for that part.
  const binderCards = useMyBinderCards()

  const popularCareers = useMemo(
    () => POPULAR_CAREER_IDS.map((id) => demoCareers.find((career) => career.id === id)).filter((career): career is NonNullable<typeof career> => Boolean(career)),
    [],
  )

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return null
    return demoCareers.filter((career) => career.title.toLowerCase().includes(query)).slice(0, 24)
  }, [search])

  const binderShortcuts = useMemo(() => groupBinderCards(binderCards).slice(0, 4), [binderCards])

  const goToSmash = (careerId: number) => navigate(`/career-smasher/${careerId}`)

  const isSearching = searchResults !== null
  const displayedCareers = searchResults ?? popularCareers

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8 sm:px-6">
      <BackButton to="/job-market" label="Job Market" />
      <PageHeader icon={Hammer} title="Career Smasher" subtitle="Pick a career to break into its core skills" />

      <div className="relative mx-auto w-full max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search careers..."
          aria-label="Search careers"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      {!isSearching && currentUser && binderShortcuts.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">From your Binder</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {binderShortcuts.map((entry) => (
              <button
                key={entry.latest.careerId}
                type="button"
                onClick={() => goToSmash(entry.latest.careerId)}
                className="inline-flex items-center gap-1.5 rounded-full border border-orange/30 bg-orange/10 px-3.5 py-1.5 text-sm font-semibold text-orange transition hover:bg-orange/20 dark:border-orange/40 dark:bg-orange/15 dark:hover:bg-orange/25"
              >
                {entry.latest.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {isSearching ? 'Search results' : 'Popular careers'}
        </p>

        {displayedCareers.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No careers match your search. Try a different term.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {displayedCareers.map((career) => (
              <button
                key={career.id}
                type="button"
                onClick={() => goToSmash(career.id)}
                aria-label={`${career.title}, smash into skills`}
                className="flex flex-col rounded-2xl border-l-4 border-orange bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] dark:bg-slate-800"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-orange/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange dark:bg-orange/15">
                  {career.category}
                </span>
                <span className="mt-2 line-clamp-2 text-sm font-bold text-slate-950 dark:text-slate-50">{career.title}</span>
                <span className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{career.salary}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
