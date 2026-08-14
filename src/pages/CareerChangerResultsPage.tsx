import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, BookmarkCheck, Compass } from 'lucide-react'
import { usePathStore } from '../store/usePathStore'
import { useCareerBoardStore } from '../store/useCareerBoardStore'
import { currentRoles, currentJobSkills } from '../data/careerChangerData'
import demoCareers2 from '../data/demoCareers2'
import type { Career2 } from '../data/demoCareers2'
import BackButton from '../components/BackButton'
import CompareButton from '../components/CompareButton'
import CompareFloatingButton from '../components/CompareFloatingButton'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import SelectableCareerCard from '../components/SelectableCareerCard'
import SkeletonCard from '../components/SkeletonCard'
import StaggerGrid from '../components/StaggerGrid'

// How long the skeleton grid shows before the real (already-computed)
// results reveal. The matching itself is synchronous/instant - this is
// purely so the transition from "last quiz question" to "here are your N
// matches" reads as "crunching the numbers" rather than a jarring instant
// swap. Skipped entirely under reduce-motion.
const RESULTS_SKELETON_MS = 500
const SKELETON_CARD_COUNT = 6

// The Step 2 preference quiz asks this many questions - Results shouldn't
// be reachable until all of them are answered, same as it isn't reachable
// without a current job.
const PREFERENCE_QUESTION_COUNT = 5

// Matching is computed against every career in demoCareers2.js (all 83) -
// no curated subset. Primary sort is shared-skill count; preference answers
// only re-rank within that (never exclude), so the pool this draws from is
// always "every career minus the user's exact current job", which is also
// what makes the empty state below effectively unreachable in practice -
// it's kept only as a defensive fallback.
const MAX_RESULTS = 30
const MAX_SHOWN_SHARED_SKILLS = 6

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase()
}

// "£35k - £80k" -> 80, "£18k+" -> 18, no digits -> 0. Used as the final
// tie-break and as the 'earning' preference signal.
function parseSalaryUpperBound(salary: string): number {
  const matches = salary.match(/\d+(?:\.\d+)?/g)
  if (!matches) return 0
  return Math.max(...matches.map((value) => Number.parseFloat(value)))
}

function formatSkillList(skills: string[]): string {
  if (skills.length === 0) return ''
  if (skills.length === 1) return skills[0]
  return `${skills.slice(0, -1).join(', ')} and ${skills[skills.length - 1]}`
}

// Soft preference -> category boost. Deliberately approximate: preferences
// re-rank, they never exclude, so a rough-but-directionally-right signal is
// enough. 'all' / 'not-sure' (or a question left unanswered) contribute no
// boost - if every answer is 'not-sure', every career gets 0 and the sort
// falls through to pure skill overlap, then salary.
const PEOPLE_FACING = new Set(['Healthcare & Medicine', 'Education & Training', 'Public Services', 'Service & Hospitality'])
const DATA_FOCUSED = new Set(['Technology & Digital', 'Business & Finance', 'Science & Research'])
const HANDS_ON = new Set(['Construction & Trades', 'Engineering & Manufacturing', 'Agriculture & Animal Care', 'Service & Hospitality', 'Sport & Leisure'])
const SCREEN_BASED = new Set(['Technology & Digital', 'Business & Finance', 'Creative & Media'])
const FAST_PACED = new Set(['Technology & Digital', 'Creative & Media', 'Business & Finance'])
const STEADY = new Set(['Public Services', 'Education & Training', 'Healthcare & Medicine'])
const PROJECT_BASED = new Set(['Engineering & Manufacturing', 'Construction & Trades'])
const BUILDS_THINGS = new Set(['Engineering & Manufacturing', 'Construction & Trades', 'Creative & Media', 'Technology & Digital'])

function preferenceScore(career: Career2, qualityPreferences: Record<string, string>): number {
  let score = 0
  const isRemoteFriendly = career.supportTags?.some((tag) => tag === 'Remote friendly' || tag === 'Work from home') ?? false

  if (qualityPreferences.workLocation === 'remote' && isRemoteFriendly) score += 2
  if (qualityPreferences.workStyle === 'hands-on' && HANDS_ON.has(career.category)) score += 2
  if (qualityPreferences.workStyle === 'digital' && SCREEN_BASED.has(career.category)) score += 2
  if (qualityPreferences.problemSolving === 'people' && PEOPLE_FACING.has(career.category)) score += 2
  if (qualityPreferences.problemSolving === 'data' && DATA_FOCUSED.has(career.category)) score += 2
  if (qualityPreferences.problemSolving === 'things' && HANDS_ON.has(career.category)) score += 2
  if (qualityPreferences.pace === 'fast-paced' && FAST_PACED.has(career.category)) score += 2
  if (qualityPreferences.pace === 'steady' && STEADY.has(career.category)) score += 2
  if (qualityPreferences.pace === 'project-based' && PROJECT_BASED.has(career.category)) score += 2
  if (qualityPreferences.motivation === 'helping' && PEOPLE_FACING.has(career.category)) score += 2
  if (qualityPreferences.motivation === 'building' && BUILDS_THINGS.has(career.category)) score += 2
  if (qualityPreferences.motivation === 'earning') score += parseSalaryUpperBound(career.salary) / 10000

  return score
}

// A few currentRoles map to a demoCareers2 title that's a near-duplicate of
// the same job under a more formal name - not an exact string match, so it
// slips past the exact-title exclusion below (e.g. currentJob 'it-support'
// is titled "IT Support", but the career library's closest entry is "IT
// Support Technician" - recommending that as a "career change" is really
// just handing someone their own job back). Hand-picked rather than a
// generic "similar title" rule: a rule broad enough to catch these would
// also wrongly exclude genuinely good, different suggestions - e.g. a
// prefix rule would flag "Sales Manager" for currentJob 'sales' (a real
// step up, the same kind of move as Retail Manager -> Marketing Manager)
// and "Cyber Security Analyst" for 'security' (a different, desirable
// field, not a synonym for the same job).
const NEAR_DUPLICATE_TITLES_BY_ROLE: Record<string, string[]> = {
  'it-support': ['IT Support Technician'],
  teacher: ['Primary School Teacher', 'Secondary School Teacher'],
  construction: ['Construction Trades Worker'],
}

function buildWhyThisFits(currentJobTitle: string, careerTitle: string, sharedSkills: string[]): string {
  if (sharedSkills.length === 0) {
    return `A fresh direction to explore from your background as a ${currentJobTitle}.`
  }
  return `Your experience in ${currentJobTitle} gives you ${formatSkillList(sharedSkills.slice(0, MAX_SHOWN_SHARED_SKILLS))} that transfer well to ${careerTitle}.`
}

export default function CareerChangerResultsPage() {
  const navigate = useNavigate()
  const currentJob = usePathStore((state) => state.currentJob)
  const qualityPreferences = usePathStore((state) => state.qualityPreferences)
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const savedCareerIds = useCareerBoardStore((state) => state.careerIds)
  const toggleSavedCareer = useCareerBoardStore((state) => state.toggle)
  const [isCalculating, setIsCalculating] = useState(true)

  // Enforce Step 1 -> Step 2 -> Results: jumping straight to this URL sends
  // you back to whichever step hasn't been completed yet.
  useEffect(() => {
    if (!currentJob) {
      navigate('/career-changer/current-role', { replace: true })
      return
    }
    if (Object.keys(qualityPreferences).length < PREFERENCE_QUESTION_COUNT) {
      navigate('/career-changer/preferences', { replace: true })
    }
  }, [currentJob, qualityPreferences, navigate])

  useEffect(() => {
    if (reduceMotion) {
      setIsCalculating(false)
      return
    }
    const timer = setTimeout(() => setIsCalculating(false), RESULTS_SKELETON_MS)
    return () => clearTimeout(timer)
  }, [reduceMotion])

  // currentJob is either a currentRoles slug (job-button grid) or a
  // stringified demoCareers2 id (SearchBar2) - see usePathStore.ts. Try the
  // curated role first, then fall back to looking the id up directly, so
  // both origins resolve to the same title/skills the matching below needs.
  const currentRole = useMemo(() => currentRoles.find((role) => role.id === currentJob) ?? null, [currentJob])
  const currentCareerFromSearch = useMemo(
    () => (currentRole ? null : demoCareers2.find((career) => String(career.id) === currentJob) ?? null),
    [currentRole, currentJob],
  )
  const displayTitle = currentRole?.title ?? currentCareerFromSearch?.title

  const currentSkillsNormalized = useMemo(() => {
    const curated = currentJobSkills[currentJob ?? '']
    if (curated) return new Set([...curated.hardSkills, ...curated.softSkills].map(normalizeSkill))
    if (currentCareerFromSearch) {
      return new Set([...currentCareerFromSearch.hardSkills, ...currentCareerFromSearch.softSkills].map(normalizeSkill))
    }
    return new Set<string>()
  }, [currentJob, currentCareerFromSearch])

  const matchedAlternates = useMemo(() => {
    if (!currentJob || !displayTitle) return []
    const normalizedCurrentTitle = displayTitle.toLowerCase().trim()
    const nearDuplicateTitles = new Set(
      (NEAR_DUPLICATE_TITLES_BY_ROLE[currentJob] ?? []).map((title) => title.toLowerCase()),
    )

    return demoCareers2
      // Never recommend the exact job they already have, or its near-duplicate.
      .filter((career) => {
        const normalizedTitle = career.title.toLowerCase().trim()
        return normalizedTitle !== normalizedCurrentTitle && !nearDuplicateTitles.has(normalizedTitle)
      })
      .map((career) => {
        const careerSkillsList = [...career.hardSkills, ...career.softSkills]
        const sharedSkills: string[] = []
        const seen = new Set<string>()
        for (const skill of careerSkillsList) {
          const normalized = normalizeSkill(skill)
          if (currentSkillsNormalized.has(normalized) && !seen.has(normalized)) {
            sharedSkills.push(skill)
            seen.add(normalized)
          }
        }

        return {
          career,
          sharedSkills,
          overlapCount: sharedSkills.length,
          preferenceScore: preferenceScore(career, qualityPreferences),
        }
      })
      .sort((a, b) => {
        if (b.overlapCount !== a.overlapCount) return b.overlapCount - a.overlapCount
        if (b.preferenceScore !== a.preferenceScore) return b.preferenceScore - a.preferenceScore
        return parseSalaryUpperBound(b.career.salary) - parseSalaryUpperBound(a.career.salary)
      })
      .slice(0, MAX_RESULTS)
  }, [currentJob, displayTitle, currentSkillsNormalized, qualityPreferences])

  if (!currentJob || Object.keys(qualityPreferences).length < PREFERENCE_QUESTION_COUNT) return null

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/career-changer/preferences" />
        <PageHeader
          title="Alternate careers for you"
          subtitle={`${matchedAlternates.length} careers matched to your background as a ${displayTitle ?? 'career changer'}.`}
        />
        {!isCalculating && matchedAlternates.length > 0 ? <CompareButton disabled={matchedAlternates.length < 2} /> : null}
      </div>

      {isCalculating ? (
        <StaggerGrid revealOnMount className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </StaggerGrid>
      ) : matchedAlternates.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No careers match yet"
          message="We don't have tailored career matches for this yet. Try adjusting your preferences or picking a different job."
          actionLabel="Choose a different job"
          onAction={() => navigate('/career-changer/current-role')}
        />
      ) : (
        <StaggerGrid revealOnMount className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matchedAlternates.map(({ career, sharedSkills }) => {
            const saved = savedCareerIds.includes(career.id)
            return (
              <SelectableCareerCard
                key={career.id}
                careerId={career.id}
                onClick={() => navigate(`/career/${career.id}`)}
                ariaLabel={`${career.title}, view career details`}
                className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:hover:border-primary-light/40"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary-dark dark:text-primary-light">{career.category}</p>
                      <h3 className="mt-1 text-xl font-bold text-slate-950 dark:text-slate-50">{career.title}</h3>
                    </div>
                    {career.salary ? (
                      <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-slate-700 dark:text-slate-200">{career.salary}</span>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Why this fits</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {buildWhyThisFits(displayTitle ?? 'your current role', career.title, sharedSkills)}
                    </p>
                  </div>

                  {sharedSkills.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Skills you already have</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {sharedSkills.map((skill) => (
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
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleSavedCareer(career.id)
                    }}
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
              </SelectableCareerCard>
            )
          })}
        </StaggerGrid>
      )}

      <CompareFloatingButton />
    </div>
  )
}
