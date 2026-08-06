import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GraduationCap, Hammer } from 'lucide-react'
import demoCareers from '../data/demoCareers'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import StaggerGrid from '../components/StaggerGrid'

const pathwayIcon = { vocational: Hammer, university: GraduationCap } as const

export default function BacktrackPathwayOptionsPage() {
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
        <BackButton to={`/backtrack/pathway/${career.id}`} />
        <PageHeader
          title="You can get here through..."
          subtitle={`Pick a route to ${career.title} and we'll show you the subjects that matter most.`}
        />
      </div>

      <StaggerGrid className="grid gap-4 sm:grid-cols-2">
        {career.backtrackPathways.map((pathway) => {
          const Icon = pathwayIcon[pathway.type]
          return (
            <button
              key={pathway.type}
              type="button"
              onClick={() => navigate(`/backtrack/subjects/${career.id}/${pathway.type}`)}
              className="group h-full w-full rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-primary/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-slate-50">{pathway.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{pathway.description}</p>

              <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm dark:border-slate-700">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Time to complete</p>
                  <p className="text-slate-600 dark:text-slate-300">{pathway.duration}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Cost</p>
                  <p className="text-slate-600 dark:text-slate-300">{pathway.cost}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Entry requirements</p>
                  <p className="text-slate-600 dark:text-slate-300">{pathway.entryRequirements}</p>
                </div>
              </div>
            </button>
          )
        })}
      </StaggerGrid>

      {career.backtrackPathways.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <p className="font-semibold">We don't have pathway details for this career yet.</p>
        </div>
      ) : null}
    </div>
  )
}
