import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, X } from 'lucide-react'
import demoCareers from '../data/demoCareers'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import { useCompareStore } from '../store/useCompareStore'
import { usePathStore } from '../store/usePathStore'

// Salary strings look like "£25k - £70k" or "£35k - £100k+" - pull out the
// highest £Xk figure so careers can be ranked for the "higher salary in
// green" highlight. Not a real currency parser, just enough to compare the
// upper bound across a handful of careers.
function parseSalaryCeiling(salary: string): number {
  const matches = salary.match(/£(\d+(?:\.\d+)?)k/gi) || []
  const values = matches.map((match) => parseFloat(match.replace(/[£k]/gi, '')))
  return values.length ? Math.max(...values) : 0
}

export default function ComparePage() {
  const navigate = useNavigate()
  const careerIds = useCompareStore((state) => state.careerIds)
  const remove = useCompareStore((state) => state.remove)
  const clear = useCompareStore((state) => state.clear)
  const selectedRole = usePathStore((state) => state.selectedRole)
  const isDisabledLearner = selectedRole === 'disabled-learner'

  const careers = useMemo(
    () => careerIds.map((id) => demoCareers.find((career) => career.id === id)).filter(Boolean) as typeof demoCareers,
    [careerIds],
  )

  const highestSalary = useMemo(() => {
    if (careers.length < 2) return null
    const ceilings = careers.map((career) => parseSalaryCeiling(career.salary))
    const max = Math.max(...ceilings)
    const min = Math.min(...ceilings)
    return max > min ? max : null
  }, [careers])

  return (
    <div className="space-y-6 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/results" />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-slate-950 dark:text-slate-50">Compare Careers</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Saved in this browser only - {careers.length} of 3 careers added. Come back any time to update your comparison.
            </p>
          </div>
          {careers.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Clear all
            </button>
          ) : null}
        </div>
      </div>

      {careers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-semibold">No careers selected. Go to results to add careers to compare.</p>
          <Button onClick={() => navigate('/results')} className="mt-4">
            Browse careers →
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div
            className="grid min-w-[560px] gap-4"
            style={{ gridTemplateColumns: `repeat(${careers.length}, minmax(0, 1fr))` }}
          >
            {careers.map((career) => {
              const isHighestSalary = highestSalary !== null && parseSalaryCeiling(career.salary) === highestSalary
              const courseSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${career.title} courses UK`)}`

              return (
                <div
                  key={career.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark dark:text-primary-light">
                        {career.category}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-slate-950 dark:text-slate-50">{career.title}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(career.id)}
                      aria-label={`Remove ${career.title} from comparison`}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {isDisabledLearner && career.supportTags?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {career.supportTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary-soft/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary-dark dark:bg-primary/10 dark:text-primary-light"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Salary</p>
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        isHighestSalary ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {career.salary}
                      {isHighestSalary ? ' · Highest' : ''}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Description</p>
                    <p className="mt-1 text-sm leading-5 text-slate-700 dark:text-slate-300">{career.description}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Requirements</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {career.requirements.map((req) => (
                        <li key={req} className="list-disc pl-5">{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Day-to-day</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {career.dayToDay.map((item) => (
                        <li key={item} className="list-disc pl-5">{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Progression</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {career.progression.map((step) => (
                        <li key={step} className="list-disc pl-5">{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto space-y-2">
                    <Button variant="secondary" onClick={() => navigate(`/career/${career.id}`)} className="w-full">
                      View full details
                    </Button>
                    <a
                      href={courseSearchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      Find courses for this career
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
