import demoCareers from '../data/demoCareers'
import type { Career } from '../data/demoCareers'
import subjectsData from '../data/subjects.json'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Card from '../components/Card'
import CompareButton from '../components/CompareButton'
import CompareFloatingButton from '../components/CompareFloatingButton'
import PageHeader from '../components/PageHeader'
import RevealSection from '../components/RevealSection'
import SavePathwayButton from '../components/SavePathwayButton'
import SelectableCareerCard from '../components/SelectableCareerCard'
import ShowFullPathwayButton from '../components/ShowFullPathwayButton'
import StaggerGrid from '../components/StaggerGrid'
import { Star } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'

interface MatchedCareer extends Career {
  matchedSubjectIds: string[]
  supportMatchCount: number
  relevance: number
}

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

// Almost every career lists these three as a baseline requirement (you
// need GCSE Maths/English/Science for nearly any job, CAD Technician
// included) - they're prerequisites, not signals of fit. Before this,
// selecting ONLY these was enough to "match" literally any career that
// happened to list one of them, which is most of them. Now a career only
// counts as matched if at least one SPECIFIC subject (a real elective,
// vocational course, T-Level, degree, ...) overlaps too - these three
// still count toward relevance for ranking once a career has qualified,
// just not enough to qualify it on their own.
const GENERIC_BASELINE_SUBJECT_IDS = new Set(['gcse-maths', 'gcse-english', 'gcse-science-combined'])

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
  const highlightedCareerId = usePathStore((state) => state.highlightedCareerId)

  const isDisabledLearner = selectedRole === 'disabled-learner'

  const subjectMap = useMemo(
    () => Object.fromEntries(subjectsData.map((subject) => [subject.id, subject.label])),
    [],
  )

  const supportTags = useMemo(() => {
    if (!isDisabledLearner || supportNeeds.length === 0) return []
    return supportNeeds.flatMap((need) => supportNeedTagMap[need] || [])
  }, [isDisabledLearner, supportNeeds])

  const matches = useMemo<MatchedCareer[]>(() => {
    return demoCareers
      .filter((career) => {
        if (!isDisabledLearner || supportTags.length === 0) {
          return true
        }

        const tags = career.supportTags || []
        return tags.some((tag) => supportTags.includes(tag))
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
      .filter((career) => {
        if (career.relevance === 0) return false
        // A real support-need tag match is its own valid signal, independent
        // of subjects - don't require a specific subject on top of it too.
        if (career.supportMatchCount > 0) return true
        return career.matchedSubjectIds.some((subjectId) => !GENERIC_BASELINE_SUBJECT_IDS.has(subjectId))
      })
      .sort((a, b) => {
        if (highlightedCareerId != null) {
          if (a.id === highlightedCareerId) return -1
          if (b.id === highlightedCareerId) return 1
        }
        if (b.relevance === a.relevance) {
          return b.supportMatchCount - a.supportMatchCount
        }
        return b.relevance - a.relevance
      })
  }, [selectedSubjects, isDisabledLearner, supportTags, highlightedCareerId])

  const finalCareers = matches

  return (
    <div className="space-y-8 pt-12">
      <RevealSection className="bg-white px-8 py-8 rounded-3xl shadow-soft dark:bg-slate-800">
        <div className="mb-6">
          <BackButton to="/subjects" />
        </div>
        <PageHeader
          eyebrow="Pathway results"
          title="Careers and skills that fit your selections."
          subtitle="Explore matching career areas and take the next step with confidence."
        />
        {finalCareers.length > 0 ? (
          <div className="mt-4">
            <CompareButton disabled={finalCareers.length < 2} />
          </div>
        ) : null}
      </RevealSection>

      <RevealSection className="bg-white px-8 py-8 rounded-3xl shadow-soft dark:bg-slate-800">
        <StaggerGrid className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {finalCareers.map((career) => {
            const isHighlighted = career.id === highlightedCareerId
            return (
              <SelectableCareerCard
                key={career.id}
                careerId={career.id}
                className={isHighlighted ? 'rounded-xl ring-2 ring-orange ring-offset-2' : ''}
              >
                <Card
                  title={career.title}
                  description={career.description}
                  badge={career.salary}
                  animateBadge={false}
                  onClick={() => navigate(`/career/${career.id}`)}
                  ariaLabel={`${career.title}, view career details`}
                >
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {isHighlighted ? (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-orange/10 px-3 py-1 text-xs font-semibold text-orange">
                        <Star className="h-3.5 w-3.5 fill-orange" />
                        Your dream career
                      </div>
                    ) : null}
                    {isDisabledLearner && career.supportTags?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {career.supportTags.map((tag: string) => (
                          <span key={tag} className="rounded-full bg-primary-soft/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-dark dark:bg-primary/15 dark:text-primary-light">
                            {badgeLabelMap[tag] || tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Matched because you selected:</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {career.matchedSubjectIds.map((subjectId) => (
                          <span key={subjectId} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                            {subjectMap[subjectId] || subjectId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Requirements</p>
                      <ul className="mt-2 space-y-1 list-disc pl-5 dark:text-slate-300">
                        {career.requirements.map((req) => (
                          <li key={req}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Card action row - Show full pathway + Save pathway.
                        The card itself is already a whole-card link to
                        /career/:id (Card's own onClick above), and Compare
                        is now handled at the page level (header
                        CompareButton -> selection circles via
                        SelectableCareerCard) rather than a per-card toggle. */}
                    <div className="!mt-4 flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
                      <ShowFullPathwayButton career={career} className="flex-1" />
                      <SavePathwayButton careerId={career.id} className="flex-1" />
                    </div>
                  </div>
                </Card>
              </SelectableCareerCard>
            )
          })}
        </StaggerGrid>

        {finalCareers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-700 mt-6 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <p className="font-semibold">No careers match your current support needs and subject choices.</p>
            {isDisabledLearner ? (
              <p className="mt-2 text-sm">Try adjusting your support options so we can find the best matches for you.</p>
            ) : (
              <p className="mt-2 text-sm">
                Maths, English and combined Science are a baseline for almost every career, so they're not enough
                on their own - try adding a more specific subject to see matches.
              </p>
            )}
          </div>
        ) : null}
      </RevealSection>

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

      <CompareFloatingButton />
    </div>
  )
}
