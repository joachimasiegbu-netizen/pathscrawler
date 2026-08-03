import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import { usePathStore } from '../store/usePathStore'

export default function DisabledWelcomePage() {
  const navigate = useNavigate()
  const selectedRole = usePathStore((state) => state.selectedRole)
  const supportNeeds = usePathStore((state) => state.supportNeeds)

  useEffect(() => {
    if (selectedRole !== 'disabled-learner') {
      navigate('/role', { replace: true })
    }
  }, [navigate, selectedRole])

  if (selectedRole !== 'disabled-learner') {
    return null
  }

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-6 rounded-[32px] bg-white p-8 shadow-soft">
        <BackButton to="/role" />

        <div>
          <h1 className="text-3xl font-bold text-slate-950">Accessible Pathways</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Explore careers and qualifications with the right support for you.
          </p>
        </div>

        <Button onClick={() => navigate(supportNeeds.length ? '/subjects' : '/subjects/disabled-learner/support')} className="w-full">
          Continue to support options →
        </Button>
      </div>
    </div>
  )
}
