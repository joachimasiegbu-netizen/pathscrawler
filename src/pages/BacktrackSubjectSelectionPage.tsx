import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import demoCareers from '../data/demoCareers'
import subjectsData from '../data/subjects.json'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import StaggerGrid from '../components/StaggerGrid'
import { usePathStore } from '../store/usePathStore'

export default function BacktrackSubjectSelectionPage() {
  const navigate = useNavigate()
  const { careerId, pathway: pathwayType } = useParams<{ careerId: string; pathway: string }>()
  const selectedSubjects = usePathStore((state) => state.selectedSubjects)
  const setSelectedSubjects = usePathStore((state) => state.setSelectedSubjects)
  const toggleSubject = usePathStore((state) => state.toggleSubject)
  const setHighlightedCareerId = usePathStore((state) => state.setHighlightedCareerId)

  const career = useMemo(() => demoCareers.find((item) => String(item.id) === careerId), [careerId])
  const pathway = useMemo(() => career?.backtrackPathways.find((item) => item.type === pathwayType), [career, pathwayType])

  const subjectMap = useMemo(() => Object.fromEntries(subjectsData.map((subject) => [subject.id, subject])), [])
  const pathwaySubjects = useMemo(
    () =>
      (pathway?.subjects || [])
        .map((id) => subjectMap[id])
        .filter((subject): subject is NonNullable<typeof subject> => Boolean(subject)),
    [pathway, subjectMap],
  )

  useEffect(() => {
    if (pathway) {
      setSelectedSubjects(pathway.subjects)
    }
  }, [pathway, setSelectedSubjects])

  if (!career || !pathway) {
    return (
      <div className="space-y-6 pt-8 px-6 pb-8 sm:px-8">
        <BackButton to="/backtrack/categories" />
        <p className="text-sm text-slate-600 dark:text-slate-300">We couldn't find that pathway.</p>
      </div>
    )
  }

  const selectedCount = selectedSubjects.filter((id) => pathwaySubjects.some((subject) => subject.id === id)).length

  const handleContinue = () => {
    setHighlightedCareerId(career.id)
    navigate('/results')
  }

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to={`/backtrack/options/${career.id}`} />
        <PageHeader
          title={`Subjects for the ${pathway.name.toLowerCase()}`}
          subtitle={`These are the subjects that lead to ${career.title}. Deselect any that don't apply to you.`}
        />
      </div>

      <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {pathwaySubjects.map((subject) => {
          const active = selectedSubjects.includes(subject.id)
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => toggleSubject(subject.id)}
              className={`h-full w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                active
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:scale-[1.01] hover:border-primary/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">{subject.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">{subject.description}</p>
                </div>
                <span className={`inline-flex h-10 min-w-[40px] items-center justify-center rounded-full text-lg font-semibold ${active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'}`}>
                  {active ? '✓' : '+'}
                </span>
              </div>
            </button>
          )
        })}
      </StaggerGrid>

      {pathwaySubjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <p className="font-semibold">No specific subjects listed for this route yet.</p>
        </div>
      ) : null}

      <Button onClick={handleContinue} disabled={selectedCount === 0} className="w-full justify-center">
        Continue
      </Button>
    </div>
  )
}
