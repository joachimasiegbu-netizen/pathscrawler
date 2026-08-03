import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Card from '../components/Card'
import AccessibilitySettingsPanel from '../components/AccessibilitySettingsPanel'
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
  Settings2,
  X,
} from 'lucide-react'

const categories = [
  {
    id: 'early-career',
    title: 'Early career learners',
    description: 'For school, college, vocational training, and first career planning.',
    roles: [
      { id: 'student', label: 'Student', description: 'Planning school or college choices.', icon: BookOpen },
      { id: 'apprentice', label: 'Apprentice', description: 'Seeking vocational training or entry-level roles.', icon: ClipboardCheck },
      { id: 'graduate', label: 'Graduate', description: 'Exploring university and early career pathways.', icon: ShieldCheck },
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
      { id: 'refugee-asylum-seeker', label: 'Refugee/Asylum Seeker', description: 'New arrivals seeking stable study and work pathways.', icon: Globe2 },
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
  const [showAccessibility, setShowAccessibility] = useState(false)

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
      <div className="relative min-h-screen space-y-6 pt-12 bg-[#E0E7FF] dark:bg-transparent">
        <div className="mx-4 rounded-3xl bg-white border border-slate-200 px-8 py-8 shadow-soft dark:bg-slate-800 dark:border-slate-700 md:mx-6 lg:mx-8">
          <div className="flex items-center justify-between gap-4">
            <BackButton to="/" />
            <button
              type="button"
              onClick={() => setShowAccessibility(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-sky-200 dark:ring-slate-700 dark:hover:bg-slate-700"
              aria-label="Open accessibility settings"
            >
              <Settings2 className="h-6 w-6 text-primary" />
            </button>
          </div>

          <h2 className="mt-6 text-3xl font-bold text-slate-950 dark:text-slate-50">What best describes you?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-200">
            Choose a role that fits your current journey and we’ll tailor the next subjects and pathways for you.
          </p>
        </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <Card key={category.id} title={category.title} description={category.description}>
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="flex w-full items-center justify-between rounded-3xl bg-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
              >
                <span>{openCategories[category.id] ? 'Hide options' : 'Show options'}</span>
                <span className="text-xl">{openCategories[category.id] ? '−' : '+'}</span>
              </button>
            </div>

            <div className={`${openCategories[category.id] ? 'block' : 'hidden'} md:block`}>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {category.roles.map((role) => {
                  const Icon = role.icon
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => chooseRole(role.id)}
                      className="group rounded-[24px] bg-white border border-slate-200 p-5 text-left transition hover:-translate-y-0.5 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
                    >
                      <div className="flex items-start gap-4">
                        <span className="mt-1 flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-primary transition group-hover:bg-slate-50 group-hover:text-primary-dark dark:bg-[#1e3a5f] dark:text-primary-light dark:group-hover:bg-slate-700">
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
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mx-4 rounded-3xl bg-white border border-slate-200 p-6 text-slate-950 shadow-soft dark:mx-6 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 md:mx-6 lg:mx-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">Not sure? Take a quick assessment</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-200">
              Answer a few quick questions and we’ll recommend the best pathway for your goals.
            </p>
          </div>
          <Button onClick={() => navigate('/assessment')} className="w-full justify-center py-3 sm:w-auto">
            Start assessment
          </Button>
        </div>
      </div>

      {showAccessibility ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 sm:px-6">
          <div className="relative w-full max-w-2xl">
            <button
              type="button"
              onClick={() => setShowAccessibility(false)}
              className="absolute right-5 top-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-200 transition hover:bg-slate-700"
              aria-label="Close accessibility settings"
            >
              <X className="h-5 w-5" />
            </button>
            <AccessibilitySettingsPanel />
          </div>
        </div>
      ) : null}
    </div>
  )
}
