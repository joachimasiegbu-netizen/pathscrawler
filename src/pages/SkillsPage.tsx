import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, RotateCcw, Sparkles, Zap } from 'lucide-react'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import SkillCard from '../components/SkillCard'
import demoCareers from '../data/demoCareers'
import {
  SKILLS,
  SKILL_COST_LABELS,
  SKILL_GOAL_LABELS,
  SKILL_STACKS,
  TIME_BUCKETS,
  type SkillCost,
  type SkillGoal,
} from '../data/skills'
import { useSkillProgressStore } from '../store/useSkillProgressStore'

const careerTitleById = new Map(demoCareers.map((c) => [c.id, c.title]))
const GOALS: SkillGoal[] = ['tech', 'remote', 'business', 'creative', 'trades', 'care']
const COSTS: SkillCost[] = ['free', 'under50', 'funded']

export default function SkillsPage() {
  const navigate = useNavigate()
  const [timeBucket, setTimeBucket] = useState<string | null>(null)
  const [cost, setCost] = useState<SkillCost | null>(null)
  const [goal, setGoal] = useState<SkillGoal | null>(null)

  const status = useSkillProgressStore((s) => s.status)
  const resetProgress = useSkillProgressStore((s) => s.reset)
  const learningCount = Object.values(status).filter((s) => s === 'learning').length
  const learnedCount = Object.values(status).filter((s) => s === 'learned').length

  const filtered = useMemo(() => {
    const maxHours = timeBucket ? TIME_BUCKETS.find((b) => b.id === timeBucket)?.maxHours ?? Infinity : Infinity
    return SKILLS.filter((skill) => {
      if (skill.timeHours > maxHours) return false
      if (cost && skill.cost !== cost) return false
      if (goal && !skill.goals.includes(goal) && !skill.goals.includes('any')) return false
      return true
    })
  }, [timeBucket, cost, goal])

  const quickWins = filtered.filter((s) => s.quickWin)
  const anyFilter = timeBucket || cost || goal

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
      <BackButton to="/job-market" label="Job Market" />
      <PageHeader
        icon={Sparkles}
        title="Skills You Should Learn"
        subtitle="High-value, transferable skills you can start for free or cheap. Each one is tied to real careers in the app."
      />

      {/* progress summary */}
      {learningCount + learnedCount > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-bold text-indigo-600 dark:text-indigo-300">{learningCount}</span> learning ·{' '}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{learnedCount}</span> learned
          </p>
          <button
            type="button"
            onClick={resetProgress}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset tracker
          </button>
        </div>
      ) : null}

      {/* filters */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
        <FilterRow label="I have…">
          {TIME_BUCKETS.map((b) => (
            <Chip key={b.id} active={timeBucket === b.id} onClick={() => setTimeBucket(timeBucket === b.id ? null : b.id)}>
              {b.label}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Cost">
          {COSTS.map((c) => (
            <Chip key={c} active={cost === c} onClick={() => setCost(cost === c ? null : c)}>
              {SKILL_COST_LABELS[c]}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Goal">
          {GOALS.map((g) => (
            <Chip key={g} active={goal === g} onClick={() => setGoal(goal === g ? null : g)}>
              {SKILL_GOAL_LABELS[g]}
            </Chip>
          ))}
        </FilterRow>
        {anyFilter ? (
          <button
            type="button"
            onClick={() => {
              setTimeBucket(null)
              setCost(null)
              setGoal(null)
            }}
            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {/* quick wins */}
      {quickWins.length > 0 ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Zap className="h-4 w-4 text-amber-500" />
            Quick wins: under 10 hours, instant CV line
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickWins.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      ) : null}

      {/* all skills */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {anyFilter ? `${filtered.length} matching ${filtered.length === 1 ? 'skill' : 'skills'}` : 'All skills'}
        </h2>
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
            Nothing matches all three filters. Try loosening one.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </section>

      {/* stack builder */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Stack builder: combos that unlock a role
        </h2>
        <div className="space-y-3">
          {SKILL_STACKS.map((stack) => (
            <button
              key={stack.id}
              type="button"
              onClick={() => navigate(`/career/${stack.careerId}`)}
              className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-700"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{stack.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-500" />
                  {stack.outcome}
                  {careerTitleById.has(stack.careerId) ? (
                    <span className="text-slate-400">· view {careerTitleById.get(stack.careerId)}</span>
                  ) : null}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-14 shrink-0 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? 'bg-indigo-600 text-white'
          : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  )
}
