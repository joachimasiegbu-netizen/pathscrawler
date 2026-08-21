import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import demoCareers, { type Career } from '../data/demoCareers'
import BackButton from '../components/BackButton'
import EmptyState from '../components/EmptyState'
import PathwaysAuthWall from '../components/PathwaysAuthWall'
import SavePathwayButton from '../components/SavePathwayButton'
import ShowFullPathwayButton from '../components/ShowFullPathwayButton'
import { useAuthStore } from '../store/useAuthStore'
import { useMySavedPathways } from '../store/useSavedPathwaysStore'

// Sourced from useSavedPathwaysStore now - every career bookmarked with the
// "Save pathway" button anywhere in the app (Results, Search, Career
// Changer, Easiest Jobs, Highest Paying Jobs) shows up here, for whichever
// account saved it. This replaced the older CareerPathwayStepperPage ->
// pathwayStorage.ts flow (a heavier "role + subjects + career" journey
// record, not account-scoped) - that page and its saved-pathway detail
// view (/my-pathways/:pathwayId, PathwayFlowPage) are now unreachable from
// here, since "Save pathway" never had subjects/role data to show in the
// first place. Not deleted, just orphaned - same call made for
// CareerPathwayStepperPage itself earlier.
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MyPathwaysPage() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)
  const savedPathways = useMySavedPathways()

  const cards = useMemo(
    () =>
      savedPathways
        .map((entry) => ({ entry, career: demoCareers.find((item) => item.id === entry.careerId) ?? null }))
        .filter((row): row is { entry: (typeof savedPathways)[number]; career: Career } => Boolean(row.career)),
    [savedPathways],
  )

  if (!currentUser) {
    return <PathwaysAuthWall />
  }

  return (
    <div className="space-y-6 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/job-market" />
        <div>
          <h2 className="text-3xl font-bold text-slate-950 dark:text-slate-50">My saved pathways</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Saved to your account - {cards.length} {cards.length === 1 ? 'pathway' : 'pathways'} saved.
          </p>
        </div>
      </div>

      {cards.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No saved pathways yet"
          message="Explore careers and hit 'Save pathway' to keep track of your favourites!"
          actionLabel="Explore careers"
          onAction={() => navigate('/search')}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(({ entry, career }) => (
            <div
              key={career.id}
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/career/${career.id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  navigate(`/career/${career.id}`)
                }
              }}
              aria-label={`${career.title}, view career details`}
              className="flex cursor-pointer flex-col rounded-2xl bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-800"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-dark dark:text-primary-light">{career.category}</p>
              <h3 className="mt-1 text-xl font-bold text-slate-950 dark:text-slate-50">{career.title}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{career.salary}</p>
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Saved on {formatDate(entry.savedAt)}</p>

              {/* Same pair used on every other job card in the app - "See
                  full pathway" navigates to the Backtrack flow exactly like
                  it does from Results/Search/Career Changer, and "Save
                  pathway" doubles as the way to remove a card from this
                  page (toggling it back off). */}
              <div className="mt-3 flex gap-2">
                <ShowFullPathwayButton career={career} className="flex-1" />
                <SavePathwayButton careerId={career.id} className="flex-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
