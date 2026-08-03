import demoCareers from '../data/demoCareers'
import type { Career } from '../data/demoCareers'
import subjectsData from '../data/subjects.json'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Card from '../components/Card'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'

interface MatchedCareer extends Career {
  matchedSubjectIds: string[]
  supportMatchCount: number
  relevance: number
}

const categories = [
  'All',
  'Technology & Digital',
  'Business & Finance',
  'Healthcare & Medicine',
  'Engineering & Manufacturing',
  'Creative & Media',
  'Education & Training',
]

const supportNeedTagMap: Record<string, string[]> = {
  'Flexible hours': ['Flexible hours'],
  'Remote/work from home': ['Remote friendly', 'Work from home'],
  'Physical accessibility': ['Accessible', 'Disability Confident employer'],
  'Assistive technology': ['Access to Work eligible'],
  'Extra time for tasks': ['Disability Confident employer'],
  'Mentorship/buddy system': ['Disability Confident employer'],
  'Quiet workspace': ['Accessible'],
  'Modified duties': ['Disability Confident employer'],
}

const badgeLabelMap: Record<string, string> = {
  'Remote friendly': 'Remote friendly',
  'Flexible hours': 'Flexible hours',
  'Disability Confident employer': 'Disability Confident employer',
  'Access to Work eligible': 'Access to Work eligible',
  Accessible: 'Accessible',
  'Work from home': 'Work from home',
}

export default function ResultPage() {
  const navigate = useNavigate()
  const selectedSubjects = usePathStore((state) => state.selectedSubjects)
  const selectedLevel = usePathStore((state) => state.selectedLevel)
  const selectedRole = usePathStore((state) => state.selectedRole)
  const supportNeeds = usePathStore((state) => state.supportNeeds)
  const [activeCategory, setActiveCategory] = useState('All')
  const [visibleCount, setVisibleCount] = useState(8)
  const [disabilityConfidentOnly, setDisabilityConfidentOnly] = useState(false)

  const isDisabledLearner = selectedRole === 'disabled-learner'

  const subjectMap = useMemo(
    () => Object.fromEntries(subjectsData.map((subject) => [subject.id, subject.label])),
    [],
  )

  const supportTags = useMemo(() => {
    if (!isDisabledLearner || supportNeeds.length === 0) return []
    return supportNeeds.flatMap((need) => supportNeedTagMap[need] || [])
  }, [isDisabledLearner, supportNeeds])

  const filteredCareers = useMemo<Career[]>(() => {
    return activeCategory === 'All'
      ? demoCareers
      : demoCareers.filter((career) => career.category === activeCategory)
  }, [activeCategory])

  const matches = useMemo<MatchedCareer[]>(() => {
    return filteredCareers
      .filter((career) => {
        if (!isDisabledLearner || supportTags.length === 0) {
          return true
        }

        const tags = career.supportTags || []
        const matchesNeed = tags.some((tag) => supportTags.includes(tag))
        if (!matchesNeed) {
          return false
        }

        if (disabilityConfidentOnly) {
          return tags.includes('Disability Confident employer')
        }

        return true
      })
      .map((career): MatchedCareer => {
        const matchedSubjectIds = (career.matchedSubjects || []).filter((subjectId) =>
          selectedSubjects.includes(subjectId),
        )
        const matchedTagCount = isDisabledLearner && supportTags.length > 0
          ? (career.supportTags || []).filter((tag) => supportTags.includes(tag)).length
          : 0

        return {
          ...career,
          matchedSubjectIds,
          supportMatchCount: matchedTagCount,
          relevance: matchedSubjectIds.length + matchedTagCount,
        }
      })
      .filter((career) => career.relevance > 0)
      .sort((a, b) => {
        if (b.relevance === a.relevance) {
          return b.supportMatchCount - a.supportMatchCount
        }
        return b.relevance - a.relevance
      })
  }, [filteredCareers, selectedSubjects, isDisabledLearner, supportTags, disabilityConfidentOnly])

  const finalCareers = matches
  const visibleCareers = finalCareers.slice(0, visibleCount)
  const canShowMore = finalCareers.length > visibleCount

  return (
    <div className="space-y-6 pt-12">
      <div className="bg-white px-8 py-8 rounded-none shadow-soft">
        <div className="mb-6">
          <BackButton to="/subjects" />
        </div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-soft/70 px-4 py-2 text-xs font-semibold text-primary-dark">
          Pathway results
        </div>
        <h2 className="text-3xl font-bold text-slate-950">Careers and skills that fit your selections.</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Explore matching career areas and take the next step with confidence.</p>
      </div>

      <div className="bg-white px-8 py-8 rounded-none shadow-soft">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => { setActiveCategory(category); setVisibleCount(8) }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category
                  ? 'bg-primary text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {isDisabledLearner ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => { setDisabilityConfidentOnly((value) => !value); setVisibleCount(8) }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                disabilityConfidentOnly
                  ? 'bg-primary text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              Disability Confident employer
            </button>
            <span className="text-sm text-slate-500">Filter your results for employers with dedicated disabled-friendly practice.</span>
          </div>
        ) : null}
      </div>

      <div className="bg-white px-8 py-8 rounded-none shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleCareers.map((career) => (
            <Card key={career.id} title={career.title} description={career.description} badge={career.salary}>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                {career.supportTags?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {career.supportTags.map((tag: string) => (
                      <span key={tag} className="rounded-full bg-primary-soft/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-dark">
                        {badgeLabelMap[tag] || tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div>
                  <p className="font-semibold text-slate-900">Matched because you selected:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {career.matchedSubjectIds.map((subjectId) => (
                      <span key={subjectId} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {subjectMap[subjectId] || subjectId}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Requirements</p>
                  <ul className="mt-2 space-y-1 list-disc pl-5">
                    {career.requirements.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/career/${career.id}`)}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Explore more
                </button>
              </div>
            </Card>
          ))}
        </div>

        {finalCareers.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-700 mt-6">
            <p className="font-semibold">No careers match your current support needs and subject choices.</p>
            {isDisabledLearner ? (
              <p className="mt-2 text-sm">Try adjusting your support options or checking another category so we can find the best matches for you.</p>
            ) : (
              <p className="mt-2 text-sm">Try selecting more subjects or changing your category to see more matches.</p>
            )}
          </div>
        ) : null}

        {canShowMore ? (
          <div className="mt-6 flex justify-center">
            <Button onClick={() => setVisibleCount((count) => count + 8)} className="w-full max-w-[220px]">
              Show more
            </Button>
          </div>
        ) : null}
      </div>

      <Button
        variant="secondary"
        onClick={() => {
          if (selectedLevel) {
            navigate(`/subjects/${selectedLevel}`)
            return
          }

          if (selectedRole === 'apprentice') {
            navigate('/subjects/vocational')
            return
          }

          if (selectedRole === 'graduate') {
            navigate('/subjects/university')
            return
          }

          navigate('/subjects')
        }}
        className="w-full"
      >
        Back to subject selection
      </Button>
    </div>
  )
}
