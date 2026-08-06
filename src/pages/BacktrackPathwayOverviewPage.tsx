import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import demoCareers from '../data/demoCareers'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import CountUpStat from '../components/CountUpStat'
import RevealSection from '../components/RevealSection'

export default function BacktrackPathwayOverviewPage() {
  const navigate = useNavigate()
  const { careerId } = useParams<{ careerId: string }>()
  const career = useMemo(() => demoCareers.find((item) => String(item.id) === careerId), [careerId])

  if (!career) {
    return (
      <div className="space-y-6 pt-8 px-6 pb-8 sm:px-8">
        <BackButton to="/backtrack/categories" />
        <p className="text-sm text-slate-600 dark:text-slate-300">We couldn't find that career.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-dark dark:text-primary-light">{career.category}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-slate-50 sm:text-4xl">You picked: {career.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Here's how to get there.</p>
        </div>
      </div>

      <RevealSection className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-50">Overview</h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
            <CountUpStat value={career.salary} duration={800} />
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{career.description}</p>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Typical requirements</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
            {career.requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </div>
      </RevealSection>

      <Button onClick={() => navigate(`/backtrack/options/${career.id}`)} className="w-full justify-center">
        Show me the pathways
      </Button>
    </div>
  )
}
