import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { usePathStore } from '../store/usePathStore'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import FloatingScrollButton from '../components/FloatingScrollButton'
import subjectsData from '../data/subjects.json'

const refugeeCategories: Record<string, { title: string; description: string; category: string }> = {
  esol: {
    title: 'ESOL & English Language',
    description: 'Improve your English first — foundation for all other pathways.',
    category: 'Refugee ESOL',
  },
  'gcse-equivalent': {
    title: 'GCSE Equivalent / Functional Skills',
    description: 'Catch up on core Maths and English qualifications.',
    category: 'Refugee GCSE',
  },
  vocational: {
    title: 'Vocational / Apprenticeship',
    description: 'Practical training with work experience. No prior qualifications needed.',
    category: 'Refugee Vocational',
  },
  foundation: {
    title: 'University Access / Foundation Year',
    description: 'Alternative routes into university for international students.',
    category: 'Refugee Foundation',
  },
}

export default function RefugeeSubjectPage() {
  const navigate = useNavigate()
  const params = useParams()
  const selectedRole = usePathStore((state) => state.selectedRole)
  const setSelectedRole = usePathStore((state) => state.setSelectedRole)
  const setSelectedLevel = usePathStore((state) => state.setSelectedLevel)
  const [query, setQuery] = useState('')
  const [showLevel, setShowLevel] = useState(false)

  const routeKey = params.subpage
  const info = routeKey ? refugeeCategories[routeKey] : null

  useEffect(() => {
    if (selectedRole !== 'refugee-asylum-seeker') {
      setSelectedRole('refugee-asylum-seeker')
    }
    if (selectedRole !== 'refugee-asylum-seeker') {
      setSelectedLevel('refugee-asylum-seeker')
    }
    if (!routeKey) {
      setShowLevel(true)
    }
  }, [routeKey, selectedRole, setSelectedLevel, setSelectedRole])

  const levelSubjects = useMemo(() => {
    if (!info) return []
    return subjectsData.filter((item) => item.category === info.category)
  }, [info])

  const filteredSubjects = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return levelSubjects
    return levelSubjects.filter((subject) => subject.label.toLowerCase().includes(normalized) || subject.description.toLowerCase().includes(normalized))
  }, [levelSubjects, query])

  if (!info) {
    return null
  }

  return (
    <div>
      <div className="w-full min-h-screen bg-white rounded-none flex flex-col">
        <div className="pt-8 pl-8 pr-8">
          <BackButton to="/subjects/refugee-asylum-seeker/levels" />
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-950">{info.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{info.description}</p>
            </div>

            <div>
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search subjects"
                  className="w-full rounded-3xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    className="h-full rounded-lg border p-4 text-left transition duration-150 border-slate-200 bg-white hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-slate-950">{subject.label}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">{subject.description}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">No subjects found for this pathway.</div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t px-8 py-4">
          <div className="flex justify-end">
            <Button onClick={() => navigate('/results')} disabled={filteredSubjects.length === 0} className="w-full sm:w-auto">
              Continue
            </Button>
          </div>
        </div>
      </div>

      <FloatingScrollButton />
    </div>
  )
}
