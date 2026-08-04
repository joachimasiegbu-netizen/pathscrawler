import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'
import { decodePathway } from '../utils/pathwaySharing'
import Button from '../components/Button'

export default function SharedPathwayPage() {
  const navigate = useNavigate()
  const { encoded } = useParams<{ encoded: string }>()
  const [invalid, setInvalid] = useState(false)
  const setSelectedRole = usePathStore((state) => state.setSelectedRole)
  const setSelectedSubjects = usePathStore((state) => state.setSelectedSubjects)
  const setSelectedLevel = usePathStore((state) => state.setSelectedLevel)
  const setHighlightedCareerId = usePathStore((state) => state.setHighlightedCareerId)

  useEffect(() => {
    const data = encoded ? decodePathway(encoded) : null
    if (!data) {
      setInvalid(true)
      return
    }

    // setSelectedRole clears selectedSubjects/selectedLevel as a side effect,
    // so it must run before we restore those from the shared data, not after.
    if (data.selectedRole) {
      setSelectedRole(data.selectedRole)
    }
    setSelectedSubjects(data.selectedSubjects)
    setSelectedLevel(data.selectedLevel)
    setHighlightedCareerId(data.highlightedCareerId)
    navigate('/results', { replace: true })
  }, [encoded, navigate, setSelectedRole, setSelectedSubjects, setSelectedLevel, setHighlightedCareerId])

  if (invalid) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">This link doesn't look right</h1>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          The saved pathway link is invalid, corrupted, or was cut off when it was shared.
        </p>
        <Button onClick={() => navigate('/')} className="mt-2">
          Start a new pathway
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-slate-600 dark:text-slate-300">Loading your saved pathway…</p>
    </div>
  )
}
