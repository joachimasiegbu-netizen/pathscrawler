import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Pencil, Share2, Trash2 } from 'lucide-react'
import demoCareers, { type Career } from '../data/demoCareers'
import BackButton from '../components/BackButton'
import Toast from '../components/Toast'
import { buildPathwaySteps, type PathwayStartLevel, type Subject } from '../utils/fullPathway'
import { deletePathway, getPathwayById } from '../utils/pathwayStorage'

// One accent per category, reused for the Job/Career nodes - same 12
// categories and colors as the (since-removed) Career Smasher tree used,
// kept here as its own small local map rather than a shared util since
// this is the only page that needs it now. 'orange' is a bare token, not a
// shade-suffixed class - tailwind.config.js defines it as a single flat
// hex value that shadows/replaces the built-in orange-50..950 scale, so
// e.g. orange-600 silently renders nothing (confirmed missing from the
// built CSS the first time this bit the Career Smasher door button).
const CATEGORY_COLOR: Record<string, { solid: string; border: string; text: string }> = {
  'Technology & Digital': { solid: 'bg-indigo-600', border: 'border-indigo-500', text: 'text-indigo-700 dark:text-indigo-400' },
  'Business & Finance': { solid: 'bg-emerald-600', border: 'border-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
  'Healthcare & Medicine': { solid: 'bg-rose-600', border: 'border-rose-500', text: 'text-rose-700 dark:text-rose-400' },
  'Engineering & Manufacturing': { solid: 'bg-amber-600', border: 'border-amber-500', text: 'text-amber-700 dark:text-amber-400' },
  'Creative & Media': { solid: 'bg-purple-600', border: 'border-purple-500', text: 'text-purple-700 dark:text-purple-400' },
  'Education & Training': { solid: 'bg-sky-600', border: 'border-sky-500', text: 'text-sky-700 dark:text-sky-400' },
  'Service & Hospitality': { solid: 'bg-pink-600', border: 'border-pink-500', text: 'text-pink-700 dark:text-pink-400' },
  'Agriculture & Animal Care': { solid: 'bg-lime-600', border: 'border-lime-500', text: 'text-lime-700 dark:text-lime-400' },
  'Sport & Leisure': { solid: 'bg-orange', border: 'border-orange', text: 'text-orange' },
  'Construction & Trades': { solid: 'bg-stone-600', border: 'border-stone-500', text: 'text-stone-700 dark:text-stone-400' },
  'Public Services': { solid: 'bg-blue-600', border: 'border-blue-500', text: 'text-blue-700 dark:text-blue-400' },
  'Science & Research': { solid: 'bg-teal-600', border: 'border-teal-500', text: 'text-teal-700 dark:text-teal-400' },
}
const FALLBACK_COLOR = { solid: 'bg-slate-600', border: 'border-slate-500', text: 'text-slate-700 dark:text-slate-400' }

// "Head Veterinary Nurse / Practice Manager (£32k-£35k)" -> "Head
// Veterinary Nurse" - career.progression entries carry a salary
// parenthetical and sometimes an alt-title after a "/", neither of which
// belong on a single circle's label.
function parseProgressionLabel(entry: string): string {
  return entry.split('(')[0].split('/')[0].trim()
}

type FlowNode =
  | { id: string; type: 'subject'; label: string; isDefault: boolean; levelLabel: string; subject: Subject; alternatives: Subject[] }
  | { id: string; type: 'job'; label: string; career: Career }
  | { id: string; type: 'career'; label: string; career: Career }

function buildFlowNodes(career: Career, startLevel: PathwayStartLevel, lockedSubjectIds: string[]): FlowNode[] {
  const steps = buildPathwaySteps(career, startLevel)
  const locked = new Set(lockedSubjectIds)
  const nodes: FlowNode[] = []

  for (const step of steps) {
    const allSubjects = step.groups.flatMap((g) => g.subjects)
    const selected = allSubjects.filter((s) => locked.has(s.id)).slice(0, 3)
    if (selected.length > 0) {
      for (const subject of selected) {
        nodes.push({
          id: `subject-${subject.id}`,
          type: 'subject',
          label: subject.label,
          isDefault: false,
          levelLabel: step.levelLabel,
          subject,
          alternatives: allSubjects.filter((s) => s.id !== subject.id).slice(0, 3),
        })
      }
    } else if (allSubjects.length > 0) {
      // Nothing was locked in at this step - fall back to its top
      // recommendation rather than leaving a gap in the chain.
      const [fallback, ...rest] = allSubjects
      nodes.push({
        id: `subject-${fallback.id}`,
        type: 'subject',
        label: fallback.label,
        isDefault: true,
        levelLabel: step.levelLabel,
        subject: fallback,
        alternatives: rest.slice(0, 3),
      })
    }
  }

  nodes.push({ id: 'job', type: 'job', label: career.title, career })

  const topProgression = career.progression[career.progression.length - 1]
  if (topProgression) {
    nodes.push({ id: 'career-peak', type: 'career', label: parseProgressionLabel(topProgression), career })
  }

  return nodes
}

export default function PathwayFlowPage() {
  const navigate = useNavigate()
  const { pathwayId } = useParams<{ pathwayId: string }>()
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)
  const [showCopiedToast, setShowCopiedToast] = useState(false)

  const pathway = useMemo(() => (pathwayId ? getPathwayById(pathwayId) : null), [pathwayId])
  const career = useMemo(
    () => (pathway ? demoCareers.find((item) => item.id === pathway.highlightedCareerId) ?? null : null),
    [pathway],
  )
  const startLevel: PathwayStartLevel = (pathway?.level as PathwayStartLevel) ?? 'gcse'
  const nodes = useMemo(
    () => (career && pathway ? buildFlowNodes(career, startLevel, pathway.subjects) : []),
    [career, pathway, startLevel],
  )
  const activeNode = nodes.find((node) => node.id === activeNodeId) ?? null

  if (!pathway || !career) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8 sm:px-6">
        <BackButton to="/my-pathways" label="My saved pathways" />
        <p className="text-sm text-slate-600 dark:text-slate-300">We couldn't find that saved pathway.</p>
      </div>
    )
  }

  const theme = CATEGORY_COLOR[career.category] ?? FALLBACK_COLOR

  const handleDelete = () => {
    deletePathway(pathway.id)
    navigate('/my-pathways')
  }

  const handleShare = async () => {
    const link = `${window.location.origin}/pathway/${pathway.id}`
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      // Clipboard API can be unavailable (permissions, insecure context) -
      // the toast still confirms an attempt either way is misleading, so
      // only show it once the copy actually succeeded.
      return
    }
    setShowCopiedToast(true)
    window.setTimeout(() => setShowCopiedToast(false), 2000)
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <div className="space-y-4">
        <BackButton to="/my-pathways" label="My saved pathways" />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide ${theme.text}`}>{career.category}</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950 dark:text-slate-50 sm:text-3xl">{career.title}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{career.salary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate(`/career-pathway/${career.id}`)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Pencil className="h-4 w-4 shrink-0" />
              Edit pathway
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Share2 className="h-4 w-4 shrink-0" />
              Share pathway
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-red-900 dark:hover:bg-red-950/40"
            >
              <Trash2 className="h-4 w-4 shrink-0" />
              Delete pathway
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal connected-circle flow - scrolls on narrow screens
          rather than wrapping, so the left-to-right "this leads to that"
          reading order never breaks across a line. */}
      <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800 sm:p-8">
        <div className="flex w-max items-center gap-2">
          {nodes.map((node, index) => (
            <div key={node.id} className="flex items-center gap-2">
              {index > 0 ? <ArrowRight className="h-6 w-6 shrink-0 text-slate-400" strokeWidth={2.5} aria-hidden="true" /> : null}
              <button
                type="button"
                onClick={() => setActiveNodeId((current) => (current === node.id ? null : node.id))}
                aria-pressed={activeNodeId === node.id}
                className="flex shrink-0 flex-col items-center gap-1.5"
              >
                {node.type === 'subject' ? (
                  <span
                    className={`flex h-20 w-20 items-center justify-center rounded-full border-2 p-2 text-center text-xs font-semibold leading-tight text-slate-700 transition dark:text-slate-200 ${
                      activeNodeId === node.id ? 'ring-4 ring-primary/30' : ''
                    } ${
                      node.isDefault
                        ? 'border-dashed border-slate-300 bg-slate-50 opacity-70 dark:border-slate-600 dark:bg-slate-900'
                        : 'border-solid border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-700'
                    }`}
                  >
                    {node.label}
                  </span>
                ) : node.type === 'job' ? (
                  <span
                    className={`flex h-24 w-24 items-center justify-center rounded-full border-2 p-2 text-center text-xs font-bold leading-tight text-white transition ${theme.solid} ${theme.border} ${
                      activeNodeId === node.id ? 'ring-4 ring-primary/30' : ''
                    }`}
                  >
                    {node.label}
                  </span>
                ) : (
                  <span
                    className={`flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full border-2 p-2 text-center text-xs font-bold leading-tight text-white transition ${theme.solid} ${theme.border} ${
                      activeNodeId === node.id ? 'ring-4 ring-primary/30' : ''
                    }`}
                  >
                    {node.label}
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">{career.salary}</span>
                  </span>
                )}
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {node.type === 'subject' ? node.levelLabel : node.type === 'job' ? 'Career' : 'Peak'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel for whichever node is active - shown below the whole
          row rather than a per-node anchored tooltip, since an absolutely-
          positioned popover anchored to one node would get clipped by this
          row's own overflow-x-auto (or worse, escape it - the SAME class of
          containing-block bug already hit once on this feature, see
          CareerPathwayStepperPage/the removed FullPathwayModal). */}
      {activeNode ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {activeNode.type === 'subject' ? (
            <>
              <h2 className="text-base font-bold text-slate-950 dark:text-slate-50">{activeNode.label}</h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {activeNode.levelLabel}
                {activeNode.isDefault ? ' · Suggested (nothing selected here)' : ' · Your selection'}
              </p>
              <div className="mt-3">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Why this matters</p>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {activeNode.subject.description} A common building block toward {career.title}.
                </p>
              </div>
              {activeNode.alternatives.length > 0 ? (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Alternative options</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {activeNode.alternatives.map((alt) => (
                      <span
                        key={alt.id}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      >
                        {alt.label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <h2 className="text-base font-bold text-slate-950 dark:text-slate-50">{activeNode.career.title}</h2>
              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Salary</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{activeNode.career.salary}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Entry requirements</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{activeNode.career.requirements[0]}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/career/${activeNode.career.id}`)}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline dark:text-primary-light"
              >
                View career
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      ) : null}

      {showCopiedToast ? <Toast message="Link copied!" type="success" /> : null}
    </div>
  )
}
