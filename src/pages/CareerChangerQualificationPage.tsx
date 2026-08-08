import { BadgeCheck, GraduationCap, Layers, Microscope, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import StaggerGrid from '../components/StaggerGrid'

const qualificationOptions: { id: string; label: string; description?: string; icon: LucideIcon }[] = [
  { id: 'masters', label: "Master's Degree", icon: GraduationCap },
  { id: 'phd', label: 'PhD / Doctoral Research', icon: Microscope },
  { id: 'professional', label: 'Professional Qualification', description: 'Cert, diploma, conversion', icon: BadgeCheck },
  { id: 'apprenticeship', label: 'Apprenticeship / Vocational', icon: Layers },
]

export default function CareerChangerQualificationPage() {
  const navigate = useNavigate()
  const currentQualification = usePathStore((state) => state.currentQualification)
  const setCurrentQualification = usePathStore((state) => state.setCurrentQualification)

  const chooseQualification = (id: string) => {
    setCurrentQualification(id)
    navigate('/career-changer/current-role')
  }

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/role" />
        <PageHeader
          title="What qualification do you hold?"
          subtitle="This helps us show realistic career switches for your background."
        />
      </div>

      <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {qualificationOptions.map((option) => {
          const Icon = option.icon
          const selected = currentQualification === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => chooseQualification(option.id)}
              className={`group h-full w-full rounded-2xl border p-5 text-left transition-all duration-200 min-h-[150px] flex flex-col justify-between ${
                selected
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:scale-[1.02] hover:border-primary/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4">
                <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">{option.label}</h3>
                {option.description ? (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{option.description}</p>
                ) : null}
              </div>
            </button>
          )
        })}
      </StaggerGrid>
    </div>
  )
}
