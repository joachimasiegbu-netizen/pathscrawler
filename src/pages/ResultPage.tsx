import demoCareers from '../data/demoCareers'
import type { Career } from '../data/demoCareers'
import subjectsData from '../data/subjects.json'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import RevealSection from '../components/RevealSection'
import StaggerGrid from '../components/StaggerGrid'
import { Check, GitCompare, Link2, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'
import { useCompareStore, MAX_COMPARE_CAREERS } from '../store/useCompareStore'
import { savePathway } from '../utils/pathwayStorage'
import ShareResultsPanel from '../components/ShareResultsPanel'

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
  const [visibleCount, setVisibleCount] = useState(8)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const compareIds = useCompareStore((state) => state.careerIds)
  const toggleCompare = useCompareStore((state) => state.toggle)

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
      .filter((career) => career.relevance > 0)
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
  const visibleCareers = finalCareers.slice(0, visibleCount)
  const canShowMore = finalCareers.length > visibleCount

  const handleSavePathway = () => {
    const saved = savePathway({
      role: selectedRole,
      subjects: selectedSubjects,
      level: selectedLevel,
      careers: finalCareers.map((career) => career.id),
      highlightedCareerId,
    })
    setShareUrl(`${window.location.origin}/pathway/${saved.id}`)
    setCopied(false)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2500)
  }

  const handleCopyLink = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable - the link is still visible to select/copy manually
    }
  }

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
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSavePathway}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Link2 className="h-4 w-4" />
            Save my pathway
          </button>
          <button
            type="button"
            onClick={() => navigate('/compare')}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <GitCompare className="h-4 w-4" />
            Compare ({compareIds.length}/{MAX_COMPARE_CAREERS} selected)
          </button>
        </div>

        {justSaved ? (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            Pathway saved!
          </p>
        ) : null}

        {shareUrl ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Your pathway link is ready</p>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Saved in this browser only - this link opens instantly here, but won't work on a different device or
              browser since nothing is stored on a server.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                readOnly
                value={shareUrl}
                onFocus={(event) => event.target.select()}
                className="w-full min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          </div>
        ) : null}
      </RevealSection>

      <RevealSection className="bg-white px-8 py-8 rounded-3xl shadow-soft dark:bg-slate-800">
        <StaggerGrid className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleCareers.map((career) => {
            const isHighlighted = career.id === highlightedCareerId
            return (
              <div key={career.id} className={isHighlighted ? 'rounded-xl ring-2 ring-orange ring-offset-2' : ''}>
                <Card title={career.title} description={career.description} badge={career.salary} animateBadge={false}>
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
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/career/${career.id}`)}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        Explore more
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCompare(career.id)}
                        disabled={!compareIds.includes(career.id) && compareIds.length >= MAX_COMPARE_CAREERS}
                        title={
                          !compareIds.includes(career.id) && compareIds.length >= MAX_COMPARE_CAREERS
                            ? `You can compare up to ${MAX_COMPARE_CAREERS} careers at once`
                            : undefined
                        }
                        className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                          compareIds.includes(career.id)
                            ? 'border-primary bg-primary-soft/70 text-primary-dark dark:border-primary/60 dark:bg-primary/15 dark:text-primary-light'
                            : 'border-gray-200 bg-slate-50 text-slate-700 hover:-translate-y-0.5 hover:shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <GitCompare className="h-4 w-4" />
                        {compareIds.includes(career.id) ? 'Added' : 'Compare'}
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            )
          })}
        </StaggerGrid>

        {finalCareers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-700 mt-6 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <p className="font-semibold">No careers match your current support needs and subject choices.</p>
            {isDisabledLearner ? (
              <p className="mt-2 text-sm">Try adjusting your support options so we can find the best matches for you.</p>
            ) : (
              <p className="mt-2 text-sm">Try selecting more subjects to see more matches.</p>
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
      </RevealSection>

      <RevealSection>
        <ShareResultsPanel careerTitle={finalCareers[0]?.title ?? null} />
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
    </div>
  )
}
