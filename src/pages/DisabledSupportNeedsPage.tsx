import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import PageStepHeader from '../components/PageStepHeader'
import { usePathStore } from '../store/usePathStore'

const supportOptions = [
  'Flexible hours',
  'Remote/work from home',
  'Physical accessibility',
  'Assistive technology',
  'Extra time for tasks',
  'Mentorship/buddy system',
  'Quiet workspace',
  'Modified duties',
]

export default function DisabledSupportNeedsPage() {
  const navigate = useNavigate()
  const selectedRole = usePathStore((state) => state.selectedRole)
  const supportNeeds = usePathStore((state) => state.supportNeeds)
  const setSupportNeeds = usePathStore((state) => state.setSupportNeeds)

  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(supportNeeds)

  useEffect(() => {
    if (selectedRole !== 'disabled-learner') {
      navigate('/role', { replace: true })
    }
  }, [navigate, selectedRole])

  if (selectedRole !== 'disabled-learner') {
    return null
  }

  const toggleNeed = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((item) => item !== need) : [...prev, need],
    )
  }

  const handleContinue = () => {
    setSupportNeeds(selectedNeeds)
    navigate('/subjects')
  }

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <PageStepHeader
        step={2}
        totalSteps={4}
        title="What support would help you at work?"
        description="Choose the support options that matter most so we can match the right careers and pathways."
      >
        <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
          Choose the options that would make work and study feel more accessible for you.
        </div>
      </PageStepHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {supportOptions.map((option) => {
          const active = selectedNeeds.includes(option)
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleNeed(option)}
              aria-pressed={active}
              className={`rounded-[24px] border p-5 text-left transition ${
                active ? 'border-primary bg-primary/10 shadow-soft' : 'border-slate-200 bg-white hover:border-primary/50 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-950">{option}</span>
                {active ? <span className="text-sm font-semibold text-primary">✓</span> : null}
              </div>
            </button>
          )
        })}
      </div>

      <div className="pt-4">
        <Button onClick={handleContinue} disabled={selectedNeeds.length === 0} className="w-full">
          Continue to pathways →
        </Button>
      </div>
    </div>
  )
}
