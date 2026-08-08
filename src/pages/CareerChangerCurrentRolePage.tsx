import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { usePathStore } from '../store/usePathStore'
import { currentRoles } from '../data/careerChangerData'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import StaggerGrid from '../components/StaggerGrid'

export default function CareerChangerCurrentRolePage() {
  const navigate = useNavigate()
  const currentJob = usePathStore((state) => state.currentJob)
  const setCurrentJob = usePathStore((state) => state.setCurrentJob)

  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const hasQuery = normalizedQuery.length >= 2

  const filteredRoles = useMemo(() => {
    if (!hasQuery) return []
    return currentRoles.filter((role) => role.title.toLowerCase().includes(normalizedQuery))
  }, [hasQuery, normalizedQuery])

  const chooseRole = (roleId: string) => {
    setCurrentJob(roleId)
    navigate('/career-changer/preferences')
  }

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/career-changer/qualification" />
        <PageHeader
          title="What do you do now?"
          subtitle="We'll match your current skills to alternate careers."
        />
      </div>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs"
          className="w-full rounded-3xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </label>

      {!hasQuery ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
          Type at least 2 characters to search for your job.
        </div>
      ) : (
        <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role) => {
              const selected = currentJob === role.id
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => chooseRole(role.id)}
                  className={`group h-full w-full rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-md ${
                    selected
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 bg-white hover:border-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
                  }`}
                >
                  <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">{role.title}</h3>
                </button>
              )
            })
          ) : (
            <div className="col-span-full rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
              No jobs found for "{query}".
            </div>
          )}
        </StaggerGrid>
      )}
    </div>
  )
}
