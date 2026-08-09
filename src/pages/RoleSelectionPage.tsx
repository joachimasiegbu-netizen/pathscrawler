import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import RevealSection from '../components/RevealSection'
import StaggerGrid from '../components/StaggerGrid'
import {
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  ShieldCheck,
  Briefcase,
  Globe2,
  Accessibility,
  Flag,
  Lightbulb,
  Target,
  Wand2,
} from 'lucide-react'

const categories = [
  {
    id: 'early-career',
    title: 'Early career learners',
    description: 'For school, college, vocational training, and first career planning.',
    roles: [
      { id: 'student', label: 'Student', description: 'Planning school or college choices.', icon: BookOpen },
      { id: 'apprentice', label: 'Apprentice', description: 'Seeking vocational training or entry-level roles.', icon: ClipboardCheck },
      { id: 'graduate', label: 'Undergraduate', description: 'Exploring university and early career pathways.', icon: ShieldCheck },
    ],
  },
  {
    id: 'career-transition',
    title: 'Career changers & returners',
    description: 'For adults switching fields, returning to learning, or starting a new venture.',
    roles: [
      { id: 'career-changer', label: 'Career Changer', description: 'Adults switching into a new field or industry.', icon: Briefcase },
      { id: 'mature-learner', label: 'Mature Learner', description: 'Aged 25+ and returning to study or training.', icon: Lightbulb },
      { id: 'armed-forces-leaver', label: 'Armed Forces Leaver', description: 'Transitioning from military service to civilian careers.', icon: Flag },
    ],
  },
  {
    id: 'support-access',
    title: 'Supporters & access-focused',
    description: 'For new arrivals and learners with additional support needs.',
    roles: [
      { id: 'refugee-asylum-seeker', label: 'Immigrant / Asylum Seeker', description: 'New to the UK? Get support with English, qualifications, and finding your career path.', icon: Globe2 },
      { id: 'disabled-learner', label: 'Disabled Learner', description: 'Learners with accessibility needs or additional support requirements.', icon: Accessibility },
    ],
  },
]

const defaultCategoryState = categories.reduce((state, category) => ({
  ...state,
  [category.id]: true,
}), {} as Record<string, boolean>)

export default function RoleSelectionPage() {
  const navigate = useNavigate()
  const setCurrentPath = usePathStore((state) => state.setCurrentPath)
  const setSelectedRole = usePathStore((state) => state.setSelectedRole)
  const setSelectedSubjects = usePathStore((state) => state.setSelectedSubjects)
  const setSelectedLevel = usePathStore((state) => state.setSelectedLevel)
  const setProgress = usePathStore((state) => state.setProgress)
  const setMatchedRoles = usePathStore((state) => state.setMatchedRoles)
  const setRecommendedRole = usePathStore((state) => state.setRecommendedRole)
  const setAssessmentCompleted = usePathStore((state) => state.setAssessmentCompleted)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(defaultCategoryState)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767.98px)')
    const updateCategoryState = () => {
      const isMobile = mediaQuery.matches
      setOpenCategories(
        categories.reduce((state, category) => ({
          ...state,
          [category.id]: !isMobile,
        }), {} as Record<string, boolean>),
      )
    }

    updateCategoryState()
    mediaQuery.addEventListener('change', updateCategoryState)

    setSelectedSubjects([])
    setSelectedLevel(null)
    setProgress(0)
    setMatchedRoles([])
    setRecommendedRole(null)
    setAssessmentCompleted(false)

    return () => mediaQuery.removeEventListener('change', updateCategoryState)
  }, [setMatchedRoles, setProgress, setRecommendedRole, setSelectedLevel, setSelectedSubjects])

  const chooseRole = (id: string) => {
    console.log('[RoleSelectionPage] choose role:', id)
    setSelectedRole(id)
    setCurrentPath('education')

    if (id === 'apprentice') {
      console.log('[RoleSelectionPage] navigating apprentice directly to /subjects/vocational')
      navigate('/subjects/vocational', { replace: true })
      return
    }

    if (id === 'graduate') {
      console.log('[RoleSelectionPage] navigating graduate directly to /subjects/university')
      navigate('/subjects/university', { replace: true })
      return
    }

    if (id === 'refugee-asylum-seeker') {
      console.log('[RoleSelectionPage] navigating refugee-asylum-seeker to /subjects/refugee-asylum-seeker')
      navigate('/subjects/refugee-asylum-seeker', { replace: true })
      return
    }

    if (id === 'disabled-learner') {
      console.log('[RoleSelectionPage] navigating disabled-learner to /subjects/disabled-learner')
      navigate('/subjects/disabled-learner', { replace: true })
      return
    }

    if (id === 'career-changer') {
      console.log('[RoleSelectionPage] navigating career-changer to /career-changer/current-role')
      navigate('/career-changer/current-role', { replace: true })
      return
    }

    console.log('[RoleSelectionPage] navigating to /subjects')
    navigate('/subjects')
  }

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  return (
    <div className="relative min-h-screen space-y-8 pt-12 bg-[#E0E7FF] dark:bg-transparent">
      <div className="rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between gap-4">
          <BackButton to="/" />
        </div>

        <div className="mt-6">
          <PageHeader
            title="What best describes you?"
            subtitle="Choose a role that fits your current journey and we'll tailor the next subjects and pathways for you."
          />
        </div>
      </div>

      <div className="space-y-6">
        {categories.map((category, categoryIndex) => (
          <RevealSection key={category.id} delay={categoryIndex * 0.06}>
            <Card title={category.title} description={category.description}>
              <div className="md:hidden">
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="flex w-full items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                >
                  <span>{openCategories[category.id] ? 'Hide options' : 'Show options'}</span>
                  <span className="text-xl">{openCategories[category.id] ? '−' : '+'}</span>
                </button>
              </div>

              <div className={`${openCategories[category.id] ? 'block' : 'hidden'} md:block`}>
                <StaggerGrid className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {category.roles.map((role) => {
                    const Icon = role.icon
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => chooseRole(role.id)}
                        className="group h-full w-full rounded-2xl border border-gray-200 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-primary/40 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                      >
                        <div className="flex items-start gap-4">
                          <span className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-primary transition group-hover:bg-slate-50 group-hover:text-primary-dark dark:bg-[#1e3a5f] dark:text-primary-light dark:group-hover:bg-slate-700">
                            <Icon className="h-6 w-6" />
                          </span>
                          <div>
                            <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">{role.label}</h3>
                            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-300">{role.description}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </StaggerGrid>
              </div>
            </Card>
          </RevealSection>
        ))}
      </div>

      <RevealSection className="grid gap-4 sm:grid-cols-2">
        <div className="group rounded-2xl border border-gray-200 bg-white p-6 text-slate-950 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark dark:text-primary-light">
            <Wand2 className="h-4 w-4" />
            Not sure where to start?
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-950 dark:text-slate-50">Take a quick assessment</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-200">
            Answer a few quick questions and we'll match you to a starting path.
          </p>
          <Button onClick={() => navigate('/assessment')} className="mt-4 w-full justify-center py-3">
            Start assessment
          </Button>
        </div>

        <div className="group rounded-2xl border border-gray-200 bg-white p-6 text-slate-950 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark dark:text-primary-light">
            <Target className="h-4 w-4" />
            Have a career in mind?
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-950 dark:text-slate-50">I know my goal</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-200">
            Start with your dream career and we'll show you how to get there.
          </p>
          <Button variant="secondary" onClick={() => navigate('/backtrack/categories')} className="mt-4 w-full justify-center py-3">
            Find my pathway →
          </Button>
        </div>
      </RevealSection>
    </div>
  )
}
