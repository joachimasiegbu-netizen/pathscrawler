import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Bookmark, GraduationCap, Sparkles } from 'lucide-react'
import demoCareers from '../data/demoCareers'
import BackButton from '../components/BackButton'
import Toast from '../components/Toast'
import { buildPathwaySteps, type PathwayRoute, type PathwayStep } from '../utils/fullPathway'
import { savePathway } from '../utils/pathwayStorage'
import { usePathStore } from '../store/usePathStore'

// Rough per-step year counts, parsed from each step's own timeEstimate
// string (e.g. "3-4 years" -> [3, 4]) - just for the Step 4 summary's
// "time to qualify" figure. Not a precise calculation (the underlying data
// only has a typical range per level, not per-course), just a sum of the
// same ranges already shown per-step in the mini timeline. Only reads the
// number(s) before the first "(" - GCSE's own estimate is "2 years (Years
// 10-11)", and the 10-11 in that parenthetical is a school-year label, not
// a second duration figure; matching digits anywhere in the string would
// wrongly pull those in too (confirmed via a real rendered summary
// showing "~7-17 years" instead of the correct ~7-8, not eyeballed).
function parseYearRange(estimate: string): [number, number] {
  const leading = estimate.split('(')[0]
  const numbers = leading.match(/\d+/g)?.map(Number) ?? [0]
  return [numbers[0], numbers[numbers.length - 1]]
}

function stepSubtitle(step: PathwayStep, careerTitle: string): string {
  switch (step.key) {
    case 'gcse':
      return `Build your foundation for ${careerTitle}.`
    case 'post16':
      return 'Based on your GCSE choices, here are the correlated Post-16 options.'
    case 'a-level':
    case 'tlevel':
    case 'vocational':
      return `The route that carries straight into ${careerTitle}.`
    case 'university':
      return 'Degree and entry routes that build on your Post-16 choices.'
    case 'masters':
      return `A step further, if you want to deepen or convert toward ${careerTitle}.`
    default:
      return ''
  }
}

export default function CareerPathwayStepperPage() {
  const navigate = useNavigate()
  const { careerId } = useParams<{ careerId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const setHighlightedCareerId = usePathStore((state) => state.setHighlightedCareerId)
  const selectedRole = usePathStore((state) => state.selectedRole)

  const career = useMemo(() => demoCareers.find((item) => String(item.id) === careerId), [careerId])
  const route = (searchParams.get('route') as PathwayRoute) === 'vocational' ? 'vocational' : 'university'

  // Always starts from GCSE - a results card (where every entry point into
  // this page lives) has no "level" of its own to start from, unlike the
  // qualification cards this feature originally lived on.
  const steps = useMemo(() => (career ? buildPathwaySteps(career, 'gcse', route) : []), [career, route])
  const totalSteps = steps.length + 1 // +1 for the final Career summary step
  const requestedStep = Number(searchParams.get('step')) || 1
  const stepIndex = Math.min(Math.max(requestedStep, 1), totalSteps)
  const isFinalStep = stepIndex === totalSteps
  const currentStep = !isFinalStep ? steps[stepIndex - 1] : null

  const [lockedSubjects, setLockedSubjects] = useState<Set<string>>(new Set())
  const [showSavedToast, setShowSavedToast] = useState(false)

  // Clamp a step number left dangling in the URL (e.g. switched from the
  // 4-step university route to the 3-step vocational one while on step 4).
  useEffect(() => {
    if (requestedStep !== stepIndex) {
      setSearchParams((prev) => {
        prev.set('step', String(stepIndex))
        return prev
      }, { replace: true })
    }
  }, [requestedStep, stepIndex, setSearchParams])

  if (!career) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8 sm:px-6">
        <BackButton to="/search" label="Back" />
        <p className="text-sm text-slate-600 dark:text-slate-300">We couldn't find that career.</p>
      </div>
    )
  }

  const goToStep = (n: number) => {
    setSearchParams((prev) => {
      prev.set('step', String(n))
      return prev
    })
  }

  const handleBack = () => {
    if (stepIndex <= 1) {
      navigate(-1)
      return
    }
    goToStep(stepIndex - 1)
  }

  const toggleSubject = (id: string) => {
    setLockedSubjects((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const autoSelectStep = () => {
    if (!currentStep) return
    const ids = currentStep.groups.flatMap((g) => g.subjects.map((s) => s.id))
    setLockedSubjects((prev) => new Set([...prev, ...ids]))
  }

  const handleSave = () => {
    savePathway({
      role: selectedRole,
      subjects: Array.from(lockedSubjects),
      level: 'gcse',
      careers: [career.id],
      highlightedCareerId: career.id,
    })
    setShowSavedToast(true)
    window.setTimeout(() => setShowSavedToast(false), 2000)
  }

  const [totalMinYears, totalMaxYears] = steps.reduce(
    ([min, max], step) => {
      const [stepMin, stepMax] = parseYearRange(step.timeEstimate)
      return [min + stepMin, max + stepMax]
    },
    [0, 0],
  )

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-dark dark:text-primary-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Step {stepIndex} of {totalSteps}
        </p>
      </div>

      {/* Progress bar - N segments, filled up to the current step. */}
      <div className="flex gap-1.5" role="progressbar" aria-valuenow={stepIndex} aria-valuemin={1} aria-valuemax={totalSteps}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              index < stepIndex ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800 sm:p-8">
        {!isFinalStep && currentStep ? (
          <>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary dark:bg-primary/15 dark:text-primary-light">
              <GraduationCap className="h-5.5 w-5.5" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-950 dark:text-slate-50">
              Step {stepIndex} — {currentStep.levelLabel}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stepSubtitle(currentStep, career.title)}</p>

            {/* Alternate entry route toggle - only when this career actually
                has more than one (backtrackPathways). Changing it resets to
                step 1, since it changes the total step count. */}
            {career.backtrackPathways.length > 1 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {career.backtrackPathways.map((pathway) => (
                  <button
                    key={pathway.type}
                    type="button"
                    onClick={() => {
                      setSearchParams({ route: pathway.type, step: '1' })
                    }}
                    aria-pressed={route === pathway.type}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                      route === pathway.type
                        ? 'border-primary bg-primary text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    {pathway.name}
                  </button>
                ))}
              </div>
            ) : null}

            <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{currentStep.whyThisStep}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{currentStep.timeEstimate}</p>

            {currentStep.groups.some((g) => g.subjects.length > 0) ? (
              <div className="mt-5 space-y-4">
                {currentStep.groups
                  .filter((g) => g.subjects.length > 0)
                  .map((g) => (
                    <div key={g.label}>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{g.label}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {g.subjects.map((subject) => {
                          const locked = lockedSubjects.has(subject.id)
                          return (
                            <button
                              key={subject.id}
                              type="button"
                              onClick={() => toggleSubject(subject.id)}
                              aria-pressed={locked}
                              title={subject.description}
                              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                locked
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/40 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300'
                              }`}
                            >
                              {subject.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-slate-200 px-3 py-2.5 text-xs text-slate-400 dark:border-slate-600 dark:text-slate-500">
                No specific recommendations for this step yet.
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-700">
              <button
                type="button"
                onClick={autoSelectStep}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Sparkles className="h-4 w-4 shrink-0" />
                Auto-select recommended
              </button>
              <button
                type="button"
                onClick={() => goToStep(stepIndex + 1)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                Next step
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <GraduationCap className="h-5.5 w-5.5" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-950 dark:text-slate-50">
              Step {stepIndex} — {career.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your complete pathway.</p>

            {/* Mini timeline summarising every step just walked through. */}
            <div className="relative mt-6 space-y-4 pl-6">
              <div className="absolute bottom-1 left-[5px] top-1 w-0.5 bg-slate-200 dark:bg-slate-600" aria-hidden="true" />
              {steps.map((step, index) => {
                const selectedCount = step.groups.flatMap((g) => g.subjects).filter((s) => lockedSubjects.has(s.id)).length
                return (
                  <div key={step.key} className="relative">
                    <span className="absolute -left-6 top-0.5 h-3 w-3 rounded-full border-2 border-primary bg-white dark:bg-slate-800" aria-hidden="true" />
                    <button
                      type="button"
                      onClick={() => goToStep(index + 1)}
                      className="text-left text-sm font-semibold text-slate-800 hover:text-primary dark:text-slate-100 dark:hover:text-primary-light"
                    >
                      Step {index + 1} — {step.levelLabel}
                    </button>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {step.timeEstimate}
                      {selectedCount > 0 ? ` · ${selectedCount} selected` : ''}
                    </p>
                  </div>
                )
              })}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 h-3 w-3 rounded-full border-2 border-emerald-500 bg-white dark:bg-slate-800" aria-hidden="true" />
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{career.title}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 dark:border-slate-700 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Salary</p>
                <p className="mt-0.5 text-sm font-bold text-slate-950 dark:text-slate-50">{career.salary}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Time to qualify</p>
                <p className="mt-0.5 text-sm font-bold text-slate-950 dark:text-slate-50">
                  {totalMinYears === totalMaxYears ? `~${totalMinYears} years` : `~${totalMinYears}-${totalMaxYears} years`}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Entry requirements</p>
                <p className="mt-0.5 text-sm font-bold text-slate-950 dark:text-slate-50">{career.requirements[0]}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-5 dark:border-slate-700 sm:flex-row">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Bookmark className="h-4 w-4 shrink-0" />
                Save this pathway
              </button>
              <button
                type="button"
                onClick={() => {
                  setHighlightedCareerId(career.id)
                  navigate(`/career/${career.id}`)
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark sm:ml-auto"
              >
                View full career
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </>
        )}
      </div>

      {showSavedToast ? <Toast message="Pathway saved!" type="success" /> : null}
    </div>
  )
}
