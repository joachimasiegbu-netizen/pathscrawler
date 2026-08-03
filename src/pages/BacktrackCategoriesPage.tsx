import { useNavigate } from 'react-router-dom'
import {
  FlaskConical,
  Scale,
  Fingerprint,
  Laptop,
  Brain,
  HeartPulse,
  Cog,
  Briefcase,
  Palette,
  GraduationCap,
  HardHat,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'
import BackButton from '../components/BackButton'
import { backtrackCategories } from '../data/backtrackCategories'

const iconMap: Record<string, LucideIcon> = {
  'science-research': FlaskConical,
  'law-justice': Scale,
  forensics: Fingerprint,
  'it-technology': Laptop,
  'ai-data': Brain,
  'healthcare-medicine': HeartPulse,
  engineering: Cog,
  'business-finance': Briefcase,
  'creative-media': Palette,
  'education-training': GraduationCap,
  'construction-trades': HardHat,
  'hospitality-tourism': UtensilsCrossed,
}

export default function BacktrackCategoriesPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/backtrack" />
        <div>
          <h2 className="text-3xl font-bold text-slate-950">Choose a career area</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Pick the field your dream career belongs to and we'll show you what's inside.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {backtrackCategories.map((category) => {
          const Icon = iconMap[category.key]
          return (
            <button
              key={category.key}
              type="button"
              onClick={() => navigate(`/backtrack/careers/${category.key}`)}
              className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary-soft text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950">{category.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
