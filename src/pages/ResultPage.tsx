import demoCareers from '../data/demoCareers'
import type { Career } from '../data/demoCareers'
import subjectsData from '../data/subjects.json'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Card from '../components/Card'
import { Check, Compass, FolderClock, Link2, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'
import { savePathway } from '../utils/pathwayStorage'

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
  'Service & Hospitality',
  'Agriculture & Animal Care',
  'Sport & Leisure',
  'Construction & Trades',
  'Public Services',
  'Science & Research',
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
  const highlightedCareerId = usePathStore((state) => state.highlightedCareerId)
  const [activeCategory, setActiveCategory] = useState('All')
  const [visibleCount, setVisibleCount] = useState(8)
  const [disabilityConfidentOnly, setDisabilityConfidentOnly] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

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
        if (highlightedCareerId != null) {
          if (a.id === highlightedCareerId) return -1
          if (b.id === highlightedCareerId) return 1
        }
        if (b.relevance === a.relevance) {
          return b.supportMatchCount - a.supportMatchCount
        }
        return b.relevance - a.relevance
      })
  }, [filteredCareers, selectedSubjects, isDisabledLearner, supportTags, disabilityConfidentOnly, highlightedCareerId])

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
    <div className="space-y-6 pt-12">
      <div className="bg-white px-8 py-8 rounded-3xl shadow-soft dark:bg-slate-800">
        <div className="mb-6">
          <BackButton to="/subjects" />
        </div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-soft/70 px-4 py-2 text-xs font-semibold text-primary-dark">
          Pathway results
        </div>
        <h2 className="text-3xl font-bold text-slate-950">Careers and skills that fit your selections.</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Explore matching career areas and take the next step with confidence.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate('/backtrack')}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft/40 px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary-soft/70"
          >
            <Compass className="h-4 w-4" />
            How do I get there?
          </button>
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
            onClick={() => navigate('/my-pathways')}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <FolderClock className="h-4 w-4" />
            My saved pathways
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
      </div>

      <div className="bg-white px-8 py-8 rounded-3xl shadow-soft dark:bg-slate-800">
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

      <div className="bg-white px-8 py-8 rounded-3xl shadow-soft dark:bg-slate-800">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleCareers.map((career) => {
            const isHighlighted = career.id === highlightedCareerId
            return (
              <div key={career.id} className={isHighlighted ? 'rounded-xl ring-2 ring-orange ring-offset-2' : ''}>
                <Card title={career.title} description={career.description} badge={career.salary}>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {isHighlighted ? (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-orange/10 px-3 py-1 text-xs font-semibold text-orange">
                        <Star className="h-3.5 w-3.5 fill-orange" />
                        Your dream career
                      </div>
                    ) : null}
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
              </div>
            )
          })}
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
