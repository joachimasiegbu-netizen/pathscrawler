import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe2, BookOpen, Layers, GraduationCap, Search } from 'lucide-react'
import BackButton from '../components/BackButton'
import Button from '../components/Button'

const refugeeLevels = [
  {
    key: 'esol',
    label: 'ESOL & English Language',
    description: 'Improve your English first — foundation for all other pathways.',
    icon: BookOpen,
  },
  {
    key: 'gcse-equivalent',
    label: 'GCSE Equivalent / Functional Skills',
    description: 'Catch up on core Maths and English qualifications.',
    icon: Globe2,
  },
  {
    key: 'vocational',
    label: 'Vocational / Apprenticeship',
    description: 'Practical training with work experience. No prior qualifications needed.',
    icon: Layers,
  },
  {
    key: 'foundation',
    label: 'University Access / Foundation Year',
    description: 'Alternative routes into university for international students.',
    icon: GraduationCap,
  },
]

export default function RefugeeSubjectLevelsPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4 rounded-[28px] bg-white p-8 shadow-soft">
        <BackButton to="/subjects/refugee-asylum-seeker" />
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Choose your next qualification step</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Start with the pathway that fits your language level, experience and goals.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {refugeeLevels.map((level) => {
            const Icon = level.icon
            return (
              <button
                key={level.key}
                type="button"
                onClick={() => navigate(`/subjects/refugee-asylum-seeker/${level.key}`)}
                className="group rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-left transition hover:border-primary hover:bg-white"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{level.label}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{level.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
