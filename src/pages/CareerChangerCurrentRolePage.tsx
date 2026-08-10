import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'
import { currentRoles } from '../data/careerChangerData'
import BackButton from '../components/BackButton'
import SearchBar2 from '../components/search/SearchBar2'
import PageHeader from '../components/PageHeader'
import StaggerGrid from '../components/StaggerGrid'

export default function CareerChangerCurrentRolePage() {
  const navigate = useNavigate()
  const currentJob = usePathStore((state) => state.currentJob)
  const setCurrentJob = usePathStore((state) => state.setCurrentJob)

  const chooseRole = (roleId: string) => {
    setCurrentJob(roleId)
    navigate('/career-changer/preferences')
  }

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/role" />
        <PageHeader
          title="What do you do now?"
          subtitle="Tell us what you do — we'll show you where your skills can take you."
        />
      </div>

      {/* Searches the full demoCareers2.js library and jumps straight into
          the questionnaire for that career - separate from the job cards
          below, which set currentJob and drive the normal matched-results
          flow instead. */}
      <div className="max-w-md">
        <SearchBar2 />
      </div>

      <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentRoles.map((role) => {
          const selected = currentJob === role.id
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => chooseRole(role.id)}
              className={`group h-full w-full rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-md ${
                selected
                  ? 'border-accent bg-accent/5 ring-2 ring-accent'
                  : 'border-gray-200 bg-white hover:border-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
              }`}
            >
              <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">{role.title}</h3>
            </button>
          )
        })}
      </StaggerGrid>
    </div>
  )
}
