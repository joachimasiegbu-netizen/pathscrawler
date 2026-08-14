import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import subjectsData from '../data/subjects.json'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import { deletePathway, getSavedPathways, type SavedPathway } from '../utils/pathwayStorage'

function formatLabel(value: string | null): string {
  if (!value) return 'Not set'
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function MyPathwaysPage() {
  const navigate = useNavigate()
  const [pathways, setPathways] = useState<SavedPathway[]>(() => getSavedPathways())

  const subjectMap = useMemo(
    () => Object.fromEntries(subjectsData.map((subject) => [subject.id, subject.label])),
    [],
  )

  const handleDelete = (id: string) => {
    deletePathway(id)
    setPathways(getSavedPathways())
  }

  return (
    <div className="space-y-6 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/results" />
        <div>
          <h2 className="text-3xl font-bold text-slate-950 dark:text-slate-50">My saved pathways</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Saved in this browser only - {pathways.length} {pathways.length === 1 ? 'pathway' : 'pathways'} stored here.
          </p>
        </div>
      </div>

      {pathways.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-semibold">You haven't saved a pathway yet.</p>
          <p className="mt-2 text-sm">Pathways you save will show up here.</p>
          <Button onClick={() => navigate('/role')} className="mt-4">
            Start a pathway
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pathways.map((pathway) => (
            <div
              key={pathway.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark dark:text-primary-light">
                    {formatLabel(pathway.role)} - {formatLabel(pathway.level)}
                  </span>
                  <span className="text-xs text-slate-400">{pathway.date}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {pathway.subjects.slice(0, 4).map((subjectId) => (
                    <span
                      key={subjectId}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      {subjectMap[subjectId] || subjectId}
                    </span>
                  ))}
                  {pathway.subjects.length > 4 ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                      +{pathway.subjects.length - 4} more
                    </span>
                  ) : null}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {pathway.careers.length} matched {pathway.careers.length === 1 ? 'career' : 'careers'}
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => navigate(`/pathway/${pathway.id}`)} className="flex-1 justify-center">
                  View
                </Button>
                <button
                  type="button"
                  onClick={() => handleDelete(pathway.id)}
                  aria-label="Remove saved pathway"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
