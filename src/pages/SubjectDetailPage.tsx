import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Award, BadgeCheck, BookOpen, Clock, GraduationCap, Layers, ListChecks, Microscope, Search } from 'lucide-react'
import { usePathStore } from '../store/usePathStore'
import subjectsData from '../data/subjects.json'
import postgraduateSubjects from '../data/postgraduateSubjects'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import FloatingScrollButton from '../components/FloatingScrollButton'

// The Career Changer levels (Master's/PhD/Professional) pull from the
// richer postgraduateSubjects.js instead of the flat subjects.json list -
// same ids either way, but this source also carries `duration` and
// `entryRequirements`, which the cards below show for these three levels
// only.
const POSTGRAD_LEVEL_KEYS = ['masters', 'phd', 'professional']

const subjectLevels = [
  { key: 'gcse', label: 'GCSE', category: 'GCSE', description: 'Build strong foundations with core school qualifications.', icon: BookOpen },
  { key: 'a-level', label: 'A-Levels & BTECs', category: 'A-Level', description: 'Focus on advanced academic subjects or practical BTEC qualifications for university and career progression.', icon: GraduationCap },
  { key: 'vocational', label: 'Vocational', category: 'Vocational', description: 'Get practical skills for apprenticeships and work-based learning.', icon: Layers },
  { key: 'university', label: 'Undergraduate', category: 'University', description: 'Prepare for degree-level programmes and higher education.', icon: Award },
  { key: 'masters', label: "Master's Degree", category: 'Masters', description: 'Postgraduate study for a career pivot or specialisation.', icon: GraduationCap },
  { key: 'phd', label: 'PhD / Doctoral Research', category: 'PhD', description: 'Research degrees for academia and specialist research careers.', icon: Microscope },
  { key: 'professional', label: 'Professional Qualifications', category: 'Professional', description: 'Industry certifications, conversion courses and professional diplomas.', icon: BadgeCheck },
]

export default function SubjectDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const selectedLevel = usePathStore((state) => state.selectedLevel)
  const setSelectedLevel = usePathStore((state) => state.setSelectedLevel)
  const selectedSubjects = usePathStore((state) => state.selectedSubjects)
  const toggleSubject = usePathStore((state) => state.toggleSubject)

  const [query, setQuery] = useState('')

  const level = useMemo(() => subjectLevels.find((item) => item.key === params.level), [params.level])

  useEffect(() => {
    console.log('[SubjectDetailPage] load', location.pathname, 'level', params.level, 'selectedLevel', selectedLevel)

    if (!level) {
      navigate('/subjects', { replace: true })
      return
    }

    if (selectedLevel !== level.key) {
      setSelectedLevel(level.key)
    }
  }, [location.pathname, level, params.level, selectedLevel, setSelectedLevel, navigate])

  const isPostgradLevel = level ? POSTGRAD_LEVEL_KEYS.includes(level.key) : false

  const levelSubjects = useMemo(() => {
    if (!level) return []
    if (POSTGRAD_LEVEL_KEYS.includes(level.key)) {
      return postgraduateSubjects[level.key as 'masters' | 'phd' | 'professional'].map((item) => ({
        id: item.id,
        label: item.name,
        description: item.description,
        domain: item.category, // sub-field, e.g. "Technology & Digital" - shown as a badge
        duration: item.duration,
        entryRequirements: item.entryRequirements,
      }))
    }
    return subjectsData.filter((subject) => subject.category === level.category)
  }, [level])

  const filteredSubjects = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return levelSubjects

    return levelSubjects.filter((subject) =>
      subject.label.toLowerCase().includes(normalized) ||
      subject.description.toLowerCase().includes(normalized) ||
      ('domain' in subject && subject.domain.toLowerCase().includes(normalized)),
    )
  }, [levelSubjects, query])

  const selectedCount = selectedSubjects.filter((subjectId) => levelSubjects.some((subject) => subject.id === subjectId)).length

  if (!level) return null

  const detailHeading = level.key === 'a-level'
    ? 'A-Level & BTEC'
    : level.key === 'masters'
    ? "Master's"
    : level.key === 'phd'
    ? 'PhD'
    : level.key === 'professional'
    ? 'professional qualification'
    : level.label
  const detailSubheadline = level.key === 'a-level'
    ? 'Select the A-Level or BTEC subjects you’ve studied or plan to study. This helps us match the best career pathways.'
    : level.key === 'professional'
    ? 'Select the certifications, conversion courses or diplomas you’ve completed or plan to pursue. This helps us match the best career pathways.'
    : 'Select the subjects you’ve studied or plan to study. This helps us match the best career pathways.'

  return (
    <div>
      <div className="w-full min-h-screen bg-white rounded-none flex flex-col">
        <div className="pt-8 pl-8 pr-8">
          <BackButton to="/role" />
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-950">Choose your {detailHeading} subjects.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{detailSubheadline}</p>
            </div>

            <div>
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search subjects" className="w-full rounded-3xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </label>
            </div>

            <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${isPostgradLevel ? 'lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'}`}>
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => {
                  const active = selectedSubjects.includes(subject.id)
                  const hasPostgradDetail = 'duration' in subject
                  return (
                    <button key={subject.id} type="button" onClick={() => toggleSubject(subject.id)} className={`h-full rounded-lg border p-4 text-left transition duration-150 ${active ? 'border-primary bg-primary/10' : 'border-slate-200 bg-white hover:border-primary/50'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold text-slate-950">{subject.label}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-500">{subject.description}</p>
                          {hasPostgradDetail ? (
                            <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">
                              <p className="flex items-start gap-1.5">
                                <Clock size={13} className="mt-0.5 shrink-0" />
                                <span><span className="font-semibold text-slate-700">Duration:</span> {subject.duration}</span>
                              </p>
                              <p className="flex items-start gap-1.5">
                                <ListChecks size={13} className="mt-0.5 shrink-0" />
                                <span><span className="font-semibold text-slate-700">Entry requirements:</span> {subject.entryRequirements}</span>
                              </p>
                            </div>
                          ) : null}
                        </div>
                        <span className={`inline-flex h-10 min-w-[40px] shrink-0 items-center justify-center rounded-full text-lg font-semibold ${active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>{active ? '✓' : '+'}</span>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">No subjects found for this level.</div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t px-8 py-4">
          <div className="flex justify-end">
            <Button onClick={() => navigate('/results')} disabled={selectedCount === 0} className="w-full sm:w-auto">Continue</Button>
          </div>
        </div>
      </div>

      <FloatingScrollButton />
    </div>
  )
}
