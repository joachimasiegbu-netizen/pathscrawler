import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Bookmark, BookmarkCheck, Clock } from 'lucide-react'
import { usePathStore } from '../store/usePathStore'
import { useCareerBoardStore } from '../store/useCareerBoardStore'
import { currentRoles, currentJobSkills, careerSkillRequirements, careerSwitchMap, type RetrainingRoute } from '../data/careerChangerData'
import demoCareers from '../data/demoCareers'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import StaggerGrid from '../components/StaggerGrid'

// The Step 3 preference quiz asks this many questions - Results shouldn't
// be reachable until all of them are answered, same as it isn't reachable
// without a qualification or a current job.
const PREFERENCE_QUESTION_COUNT = 5

const routeTypeLabels = {
  viaMasters: "Master's",
  viaProfessional: 'Professional cert',
  viaApprenticeship: 'Apprenticeship',
} as const
type RouteTypeKey = keyof typeof routeTypeLabels

const difficultyStyles: Record<RetrainingRoute['difficulty'], string> = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
}

// Easy first, then Medium, then Hard; within the same difficulty, shortest
// timeToSwitch first. Used both to pick the single best route to show per
// career (some careers have more than one real route) and to order the
// overall results grid.
const difficultyOrder: Record<RetrainingRoute['difficulty'], number> = { Easy: 0, Medium: 1, Hard: 2 }

function monthsFromTimeToSwitch(timeToSwitch: string): number {
  const match = timeToSwitch.match(/\d+/)
  const value = match ? Number(match[0]) : 0
  return /year/i.test(timeToSwitch) ? value * 12 : value
}

function compareRoutes(a: RetrainingRoute, b: RetrainingRoute): number {
  const difficultyDelta = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
  if (difficultyDelta !== 0) return difficultyDelta
  return monthsFromTimeToSwitch(a.timeToSwitch) - monthsFromTimeToSwitch(b.timeToSwitch)
}

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase()
}

export default function CareerChangerResultsPage() {
  const navigate = useNavigate()
  const currentQualification = usePathStore((state) => state.currentQualification)
  const currentJob = usePathStore((state) => state.currentJob)
  const qualityPreferences = usePathStore((state) => state.qualityPreferences)
  const savedCareerIds = useCareerBoardStore((state) => state.careerIds)
  const toggleSavedCareer = useCareerBoardStore((state) => state.toggle)

  // Enforce Step 1 -> Step 2 -> Step 3 -> Results: jumping straight to this
  // URL sends you back to whichever step hasn't been completed yet.
  useEffect(() => {
    if (!currentQualification) {
      navigate('/career-changer/qualification', { replace: true })
      return
    }
    if (!currentJob) {
      navigate('/career-changer/current-role', { replace: true })
      return
    }
    if (Object.keys(qualityPreferences).length < PREFERENCE_QUESTION_COUNT) {
      navigate('/career-changer/preferences', { replace: true })
    }
  }, [currentQualification, currentJob, qualityPreferences, navigate])

  const currentRole = useMemo(() => currentRoles.find((role) => role.id === currentJob) ?? null, [currentJob])
  const displayTitle = currentRole?.title

  const currentSkills = useMemo(() => {
    const skills = currentJobSkills[currentJob ?? '']
    if (!skills) return new Set<string>()
    return new Set([...skills.hardSkills, ...skills.softSkills].map(normalizeSkill))
  }, [currentJob])

  const matchedAlternates = useMemo(() => {
    if (!currentJob) return []
    const entry = careerSwitchMap[currentJob]
    if (!entry) return []

    return Object.entries(entry.alternateCareers)
      .map(([slug, alternate]) => {
        const routeEntries = (['viaMasters', 'viaProfessional', 'viaApprenticeship'] as RouteTypeKey[])
          .map((key) => (alternate[key] ? { key, route: alternate[key] as RetrainingRoute } : null))
          .filter((item): item is { key: RouteTypeKey; route: RetrainingRoute } => item !== null)
        const best = routeEntries.sort((a, b) => compareRoutes(a.route, b.route))[0]
        if (!best) return null

        const required = careerSkillRequirements[slug]
        const requiredSkills = required ? [...required.hardSkills, ...required.softSkills].map(normalizeSkill) : []
        const overlap = requiredSkills.filter((skill) => currentSkills.has(skill))
        // Fall back to the person's own top skills when there's no exact
        // keyword overlap, so the card still shows something relevant
        // rather than an empty section.
        const transferableSkills = overlap.length > 0 ? overlap : [...currentSkills].slice(0, 3)

        return {
          slug,
          careerId: alternate.careerId,
          careerTitle: alternate.careerTitle,
          routeType: best.key,
          route: best.route,
          transferableSkills: transferableSkills.slice(0, 5),
          career: demoCareers.find((item) => item.id === alternate.careerId) ?? null,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => compareRoutes(a.route, b.route))
  }, [currentJob, currentSkills])

  if (!currentQualification || !currentJob || Object.keys(qualityPreferences).length < PREFERENCE_QUESTION_COUNT) return null

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/career-changer/preferences" />
        <PageHeader
          title="Alternate careers for you"
          subtitle={`Based on your background as a ${displayTitle ?? 'career changer'}.`}
        />
      </div>

      {matchedAlternates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            We don't have tailored career matches for this yet. Try selecting a different job.
          </p>
          <Button onClick={() => navigate('/career-changer/current-role')} className="mt-4">
            Choose a different job
          </Button>
        </div>
      ) : (
        <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matchedAlternates.map(({ slug, careerId, careerTitle, routeType, route, transferableSkills, career }) => {
            const saved = savedCareerIds.includes(careerId)
            return (
              <div
                key={slug}
                className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {career ? (
                        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary-dark dark:text-primary-light">{career.category}</p>
                      ) : null}
                      <h3 className="mt-1 text-xl font-bold text-slate-950 dark:text-slate-50">{careerTitle}</h3>
                    </div>
                    {career?.salary ? (
                      <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-slate-700 dark:text-slate-200">{career.salary}</span>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${difficultyStyles[route.difficulty]}`}>
                      {route.difficulty}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{routeTypeLabels[routeType]}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Clock size={13} />
                      {route.timeToSwitch}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Why this fits</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{route.whyItFits}</p>
                  </div>

                  {transferableSkills.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Your skills that transfer</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {transferableSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/career/${careerId}`)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700 sm:text-sm"
                  >
                    Explore career <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSavedCareer(careerId)}
                    aria-pressed={saved}
                    className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                      saved
                        ? 'border-primary bg-primary-soft/70 text-primary-dark dark:border-primary/60 dark:bg-primary/15 dark:text-primary-light'
                        : 'border-gray-200 bg-slate-50 text-slate-700 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                    {saved ? 'Saved' : 'Save to binder'}
                  </button>
                </div>
              </div>
            )
          })}
        </StaggerGrid>
      )}
    </div>
  )
}
