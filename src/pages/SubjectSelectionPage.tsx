import { BookOpen, GraduationCap, Layers, Award, Microscope, BadgeCheck } from 'lucide-react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import RevealSection from '../components/RevealSection'
import StaggerGrid from '../components/StaggerGrid'

const levelCards = [
  { key: 'gcse', label: 'GCSE', description: 'Build strong foundations with core school qualifications.', category: 'GCSE', icon: BookOpen },
  { key: 'a-level', label: 'A-Levels & BTECs', description: 'Focus on advanced academic A-Levels or practical BTEC qualifications for university and career progression.', category: 'A-Level', icon: GraduationCap },
  { key: 'tlevel', label: 'T-Levels', description: 'Technical qualifications combining classroom learning with industry placements. Equivalent to 3 A-Levels.', category: 'T-Level', icon: GraduationCap },
  { key: 'vocational', label: 'Vocational', description: 'Gain practical skills for apprenticeships and work-based learning.', category: 'Vocational', icon: Layers },
  { key: 'university', label: 'Undergraduate', description: 'Prepare for higher education and degree-level study.', category: 'University', icon: Award },
  { key: 'masters', label: "Master's Degree", description: 'Postgraduate study for a career pivot or specialisation (MSc, MA, MBA, MEng and more).', category: 'Masters', icon: GraduationCap },
  { key: 'phd', label: 'PhD / Doctoral Research', description: 'Research degrees for academia and specialist research careers.', category: 'PhD', icon: Microscope },
  { key: 'professional', label: 'Professional Qualifications', description: 'Industry certifications, conversion courses and professional diplomas (GDL, PGCE, CIM, ACCA, CFA and more).', category: 'Professional', icon: BadgeCheck },
]

export default function SubjectSelectionPage() {
  const navigate = useNavigate()
  const selectedRole = usePathStore((state) => state.selectedRole)
  const selectedLevel = usePathStore((state) => state.selectedLevel)
  const setSelectedLevel = usePathStore((state) => state.setSelectedLevel)

  // Redirect apprentice/graduate roles immediately without rendering
  useEffect(() => {
    if (selectedRole === 'apprentice') {
      console.log('[SubjectSelectionPage] redirecting apprentice to /subjects/vocational')
      navigate('/subjects/vocational', { replace: true })
      return
    }
    if (selectedRole === 'graduate') {
      console.log('[SubjectSelectionPage] redirecting graduate to /subjects/university')
      navigate('/subjects/university', { replace: true })
    }
  }, [selectedRole, navigate])

  // If apprentice/graduate, don't render (will redirect)
  if (selectedRole === 'apprentice' || selectedRole === 'graduate') {
    return null
  }

  const roleCardMap: Record<string, string[]> = {
    student: ['gcse', 'a-level', 'tlevel'],
    apprentice: [],
    graduate: [],
    'career-changer': ['masters', 'phd', 'professional'],
    'mature-learner': ['tlevel', 'vocational', 'university'],
    'armed-forces-leaver': ['tlevel', 'vocational', 'university'],
    'refugee-asylum-seeker': ['university'],
    'disabled-learner': ['gcse', 'a-level', 'tlevel', 'vocational', 'university'],
  }

  const visibleCardKeys = selectedRole ? roleCardMap[selectedRole] ?? ['gcse', 'a-level', 'tlevel'] : ['gcse', 'a-level', 'tlevel']
  const visibleCards = levelCards.filter((card) => visibleCardKeys.includes(card.key))
  const topCards = visibleCards.filter((card) => card.key !== 'university')
  const universityCard = visibleCards.find((card) => card.key === 'university')
  // Evenly space an exact trio (e.g. Career Changer's Master's/PhD/
  // Professional cards) across 3 columns instead of leaving an orphan card
  // on its own row in a 2-column grid.
  const topGridCols = topCards.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'

  const location = useLocation()
  const skipLevelRedirect = (location.state as { skipLevelRedirect?: boolean })?.skipLevelRedirect

  useEffect(() => {
    if (location.pathname !== '/subjects') return
    if (skipLevelRedirect) {
      console.log('[SubjectSelectionPage] skip level redirect for selectedRole', selectedRole)
      return
    }

    if (!selectedRole) return

    if (selectedRole === 'apprentice') {
      navigate('/subjects/vocational', { replace: true })
      return
    }

    if (selectedRole === 'graduate') {
      navigate('/subjects/university', { replace: true })
      return
    }

    if (selectedRole === 'refugee-asylum-seeker') {
      navigate('/subjects/refugee-asylum-seeker', { replace: true })
      return
    }

    if (selectedRole === 'career-changer') {
      navigate('/career-changer/current-role', { replace: true })
      return
    }

    if (selectedRole === 'disabled-learner') {
      const supportNeeds = usePathStore.getState().supportNeeds
      if (!supportNeeds.length) {
        navigate('/subjects/disabled-learner', { replace: true })
        return
      }
    }
  }, [location.pathname, navigate, selectedRole, skipLevelRedirect])

  const roleSubheadline = selectedRole === 'student'
    ? 'Pick GCSE, A-Level & BTEC or T-Level options based on your current study plans.'
    : selectedRole === 'career-changer'
    ? 'For experienced professionals looking to pivot or advance through further study.'
    : ['mature-learner', 'armed-forces-leaver'].includes(selectedRole ?? '')
    ? 'Explore retraining options through T-Levels and university qualifications.'
    : selectedRole === 'disabled-learner'
    ? 'Choose the qualification level that works best with your access support and future goals.'
    : selectedRole === 'refugee-asylum-seeker'
    ? 'Choose university subjects that fit your accessibility or support pathway.'
    : 'Pick the qualification type that best fits your studies and goals.'

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/role" />
        <PageHeader title="Choose your qualification level" subtitle={roleSubheadline} />
      </div>

      <StaggerGrid className={`grid grid-cols-1 gap-4 ${topGridCols} md:gap-4`}>
        {topCards.map((level) => {
          const Icon = level.icon
          const selected = selectedLevel === level.key

          return (
            <button
              key={level.key}
              type="button"
              onClick={() => { setSelectedLevel(level.key); navigate(`/subjects/${level.key}`) }}
              className={`group h-full w-full rounded-2xl border p-5 text-left transition-all duration-200 min-h-[220px] flex flex-col justify-between ${
                selected
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:scale-[1.02] hover:border-primary/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"><Icon className="h-6 w-6" /></div>
                </div>
                <div className="mt-5 space-y-3">
                  <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-50">{level.label}</h3>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{level.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </StaggerGrid>

      {universityCard ? (
        <RevealSection className="grid gap-4 md:grid-cols-2 md:gap-4">
          <button
            type="button"
            onClick={() => { setSelectedLevel(universityCard.key); navigate(`/subjects/${universityCard.key}`) }}
            className={`group col-span-1 md:col-span-2 rounded-2xl border p-5 text-left shadow-sm transition-all duration-200 min-h-[220px] flex flex-col justify-between ${
              selectedLevel === universityCard.key
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:scale-[1.01] hover:border-primary/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  {(() => {
                    const UniversityIcon = universityCard.icon
                    return <UniversityIcon className="h-6 w-6" />
                  })()}
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-50">{universityCard.label}</h3>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{universityCard.description}</p>
              </div>
            </div>
          </button>
        </RevealSection>
      ) : null}
    </div>
  )
}
