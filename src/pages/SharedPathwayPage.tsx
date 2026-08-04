import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'
import { getPathwayById } from '../utils/pathwayStorage'
import Button from '../components/Button'

export default function SharedPathwayPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [notFound, setNotFound] = useState(false)
  const setSelectedRole = usePathStore((state) => state.setSelectedRole)
  const setSelectedSubjects = usePathStore((state) => state.setSelectedSubjects)
  const setSelectedLevel = usePathStore((state) => state.setSelectedLevel)
  const setHighlightedCareerId = usePathStore((state) => state.setHighlightedCareerId)

  useEffect(() => {
    const pathway = id ? getPathwayById(id) : null
    if (!pathway) {
      setNotFound(true)
      return
    }

    // setSelectedRole clears selectedSubjects/selectedLevel as a side effect,
    // so it must run before we restore those from the saved data, not after.
    if (pathway.role) {
      setSelectedRole(pathway.role)
    }
    setSelectedSubjects(pathway.subjects)
    setSelectedLevel(pathway.level)
    setHighlightedCareerId(pathway.highlightedCareerId)
    navigate('/results', { replace: true })
  }, [id, navigate, setSelectedRole, setSelectedSubjects, setSelectedLevel, setHighlightedCareerId])

  if (notFound) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">We can't find this pathway here</h1>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Saved pathways only live in the browser that created them - this link either hasn't been saved here, was
          opened on a different device or browser, or has been removed.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate('/my-pathways')}>View my saved pathways</Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Start a new pathway
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-slate-600 dark:text-slate-300">Loading your saved pathway…</p>
    </div>
  )
}
