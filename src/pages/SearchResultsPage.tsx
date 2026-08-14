import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, SearchX } from 'lucide-react'
import demoCareers from '../data/demoCareers'
import subjectsData from '../data/subjects.json'
import BackButton from '../components/BackButton'
import Card from '../components/Card'
import CompareButton from '../components/CompareButton'
import CompareFloatingButton from '../components/CompareFloatingButton'
import EmptyState from '../components/EmptyState'
import HighlightMatch from '../components/HighlightMatch'
import PageHeader from '../components/PageHeader'
import SelectableCareerCard from '../components/SelectableCareerCard'
import StaggerGrid from '../components/StaggerGrid'

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
        {matches.length > 0 ? <CompareButton disabled={matches.length < 2} /> : null}
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
            <SelectableCareerCard key={career.id} careerId={career.id}>
              <Card
                title={<HighlightMatch text={career.title} query={query} />}
                description={career.description}
                badge={career.salary}
                animateBadge={false}
                onClick={() => navigate(`/career/${career.id}`)}
                ariaLabel={`${career.title}, view career details`}
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
                </div>
              </Card>
            </SelectableCareerCard>
          ))}
        </StaggerGrid>
      )}

      <CompareFloatingButton />
    </div>
  )
}
