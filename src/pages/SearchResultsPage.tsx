import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, SearchX } from 'lucide-react'
import demoCareers from '../data/demoCareers'
import subjectsData from '../data/subjects.json'
import BackButton from '../components/BackButton'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import HighlightMatch from '../components/HighlightMatch'
import PageHeader from '../components/PageHeader'
import StaggerGrid from '../components/StaggerGrid'
import { useCompareStore, MAX_COMPARE_CAREERS } from '../store/useCompareStore'

const subjectLabelById: Record<string, string> = Object.fromEntries(
  subjectsData.map((subject) => [subject.id, subject.label]),
)

function careerMatchesQuery(career: (typeof demoCareers)[number], query: string): boolean {
  if (career.title.toLowerCase().includes(query)) return true
  if (career.category.toLowerCase().includes(query)) return true
  if (career.description.toLowerCase().includes(query)) return true
  if (career.dayToDay.some((task) => task.toLowerCase().includes(query))) return true
  if (career.requirements.some((req) => req.toLowerCase().includes(query))) return true
  if (career.matchedSubjects.some((id) => (subjectLabelById[id] ?? id).toLowerCase().includes(query))) return true
  return false
}

export default function SearchResultsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const normalizedQuery = query.trim().toLowerCase()
  const compareIds = useCompareStore((state) => state.careerIds)
  const toggleCompare = useCompareStore((state) => state.toggle)

  const hasQuery = normalizedQuery.length >= 2

  const matches = useMemo(() => {
    if (!hasQuery) return []
    return demoCareers.filter((career) => careerMatchesQuery(career, normalizedQuery))
  }, [hasQuery, normalizedQuery])

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton />
        <PageHeader
          eyebrow="Career search"
          title={hasQuery ? `Results for "${query}"` : 'Search results'}
          subtitle={
            hasQuery
              ? `${matches.length} ${matches.length === 1 ? 'career matches' : 'careers match'} "${query}".`
              : 'Use the search bar above to find a career by name, category or skill.'
          }
        />
      </div>

      {matches.length === 0 ? (
        hasQuery ? (
          <EmptyState
            icon={SearchX}
            title="No careers found"
            message={`No careers matched "${query}". Try a different search term or check the spelling.`}
          />
        ) : (
          <EmptyState icon={Search} title="Search for a career" message="Type a career name, category or skill to get started." />
        )
      ) : (
        <StaggerGrid className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {matches.map((career) => (
            <Card
              key={career.id}
              title={<HighlightMatch text={career.title} query={query} />}
              description={career.description}
              badge={career.salary}
              animateBadge={false}
            >
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p className="inline-block w-fit rounded-full bg-primary-soft/70 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-dark dark:bg-primary/15 dark:text-primary-light">
                  {career.category}
                </p>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Requirements</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 dark:text-slate-300">
                    {career.requirements.slice(0, 3).map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/career/${career.id}`)}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Explore more
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCompare(career.id)}
                    disabled={!compareIds.includes(career.id) && compareIds.length >= MAX_COMPARE_CAREERS}
                    title={
                      !compareIds.includes(career.id) && compareIds.length >= MAX_COMPARE_CAREERS
                        ? `You can compare up to ${MAX_COMPARE_CAREERS} careers at once`
                        : undefined
                    }
                    className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                      compareIds.includes(career.id)
                        ? 'border-primary bg-primary-soft/70 text-primary-dark dark:border-primary/60 dark:bg-primary/15 dark:text-primary-light'
                        : 'border-gray-200 bg-slate-50 text-slate-700 hover:-translate-y-0.5 hover:shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {compareIds.includes(career.id) ? 'Added' : 'Compare'}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </StaggerGrid>
      )}
    </div>
  )
}
