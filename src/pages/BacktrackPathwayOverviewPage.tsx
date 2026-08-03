import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import demoCareers from '../data/demoCareers'
import BackButton from '../components/BackButton'
import Button from '../components/Button'

export default function BacktrackPathwayOverviewPage() {
  const navigate = useNavigate()
  const { careerId } = useParams<{ careerId: string }>()
  const career = useMemo(() => demoCareers.find((item) => String(item.id) === careerId), [careerId])

  if (!career) {
    return (
      <div className="space-y-6 pt-8 px-6 pb-8 sm:px-8">
        <BackButton to="/backtrack/categories" />
        <p className="text-sm text-slate-600">We couldn't find that career.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-dark">{career.category}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">You picked: {career.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Here's how to get there.</p>
        </div>
      </div>

      <div className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-950">Overview</h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{career.salary}</span>
        </div>
        <p className="text-sm leading-6 text-slate-600">{career.description}</p>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Typical requirements</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {career.requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </div>
      </div>

      <Button onClick={() => navigate(`/backtrack/options/${career.id}`)} className="w-full justify-center">
        Show me the pathways
      </Button>
    </div>
  )
}
