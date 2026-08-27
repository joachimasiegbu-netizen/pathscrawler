import { useNavigate } from 'react-router-dom'
import { Circle, Clock, ExternalLink, Loader, TrendingUp, Wallet } from 'lucide-react'
import demoCareers from '../data/demoCareers'
import type { Skill, SkillCategory } from '../data/skills'
import { useSkillProgressStore } from '../store/useSkillProgressStore'

const CATEGORY_STYLE: Record<SkillCategory, string> = {
  Hard: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  Digital: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  Soft: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  Trade: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
}

const careerTitleById = new Map(demoCareers.map((c) => [c.id, c.title]))

export default function SkillCard({ skill }: { skill: Skill }) {
  const navigate = useNavigate()
  const status = useSkillProgressStore((s) => s.status[skill.id])
  const cycle = useSkillProgressStore((s) => s.cycle)

  const StatusIcon = status === 'learned' ? TrendingUp : status === 'learning' ? Loader : Circle
  const statusLabel = status === 'learned' ? 'Learned' : status === 'learning' ? 'Learning' : 'Track'

  return (
    <div
      className={`flex h-full flex-col gap-3 rounded-2xl border p-4 transition ${
        status === 'learned'
          ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-500/40 dark:bg-emerald-500/5'
          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${CATEGORY_STYLE[skill.category]}`}>
            {skill.category}
          </span>
          <h3 className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">{skill.name}</h3>
        </div>
        <button
          type="button"
          onClick={() => cycle(skill.id)}
          className={`flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-bold uppercase tracking-wide transition ${
            status === 'learned'
              ? 'border-emerald-400 bg-emerald-400 text-white'
              : status === 'learning'
                ? 'border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                : 'border-slate-200 text-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700'
          }`}
        >
          <StatusIcon className="h-3 w-3" />
          {statusLabel}
        </button>
      </div>

      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{skill.why}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {skill.timeLabel}
        </span>
        <span className="inline-flex items-center gap-1">
          <Wallet className="h-3.5 w-3.5" /> {skill.costLabel}
        </span>
      </div>

      <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300">
        <span className="font-semibold">Impact:</span> {skill.impact}
      </p>

      {skill.careerIds.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {skill.careerIds.slice(0, 4).map((id) => {
            const title = careerTitleById.get(id)
            if (!title) return null
            return (
              <button
                key={id}
                type="button"
                onClick={() => navigate(`/career/${id}`)}
                className="rounded-full border border-primary/30 bg-primary-soft/40 px-2.5 py-0.5 text-[11px] font-semibold text-primary-dark transition hover:bg-primary-soft/70 dark:border-primary/40 dark:bg-primary/10 dark:text-primary-light"
              >
                {title}
              </button>
            )
          })}
        </div>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-1">
        {skill.resources.map((r) => (
          <a
            key={r.url}
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
          >
            {r.label}
            <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </div>
    </div>
  )
}
