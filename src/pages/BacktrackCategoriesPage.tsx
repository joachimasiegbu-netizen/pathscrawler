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
import PageHeader from '../components/PageHeader'
import StaggerGrid from '../components/StaggerGrid'
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
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/role" />
        <PageHeader
          title="Choose a career area"
          subtitle="Pick the field your dream career belongs to and we'll show you what's inside."
        />
      </div>

      <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {backtrackCategories.map((category) => {
          const Icon = iconMap[category.key]
          return (
            <button
              key={category.key}
              type="button"
              onClick={() => navigate(`/backtrack/careers/${category.key}`)}
              className="group h-full w-full rounded-2xl border border-gray-200 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-primary/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-slate-50">{category.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{category.description}</p>
            </button>
          )
        })}
      </StaggerGrid>
    </div>
  )
}
