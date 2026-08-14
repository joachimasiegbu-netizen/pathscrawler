import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Hammer, RotateCcw } from 'lucide-react'
import BackButton from '../components/BackButton'
import CareerSmasherTree from '../components/CareerSmasherTree'
import demoCareers from '../data/demoCareers'

// Chunk 1: the tree structure, layout, and expand/collapse interactions
// (CareerSmasherTree.tsx). The actual hammer-strike ANIMATION when a job
// node's smash badge is clicked is Chunk 2 - clicking it here already
// expands the node (that part of "click Smash -> skills appear" works),
// it just doesn't have the impact effect layered on top yet.
export default function CareerSmasherTreePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const career = demoCareers.find((item) => String(item.id) === id)
  // Bumped by "Reset tree" - CareerSmasherTree.tsx watches for this
  // changing (not its value) to collapse itself back to just the root,
  // without this page needing to reach into that component's own
  // expandedPaths state directly.
  const [resetToken, setResetToken] = useState(0)

  if (!career) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8 sm:px-6">
        <BackButton to="/career-smasher" label="Career Smasher" />
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <Hammer className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-bold text-slate-950 dark:text-slate-50">Career not found</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            That career doesn't exist - pick one from the Career Smasher entry screen.
          </p>
          <button
            type="button"
            onClick={() => navigate('/career-smasher')}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Back to Career Smasher
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <BackButton to="/career-smasher" label="Career Smasher" />
          <h1 className="mt-3 text-2xl font-bold text-slate-950 dark:text-slate-50 sm:text-3xl">{career.title}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Tap the hammer to smash a job into its core skills, tap a skill to see who else needs it.
          </p>
        </div>
      </div>

      <CareerSmasherTree rootCareer={career} resetToken={resetToken} />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setResetToken((token) => token + 1)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <RotateCcw className="h-4 w-4 shrink-0" />
          Reset tree
        </button>
      </div>
    </div>
  )
}
