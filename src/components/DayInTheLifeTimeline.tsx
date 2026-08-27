import { AlertTriangle } from 'lucide-react'
import type { DayInTheLife, DayMood } from '../data/dayInTheLife'

// Vertical hour-by-hour timeline for CareerDetailPage. Each block's dot is
// coloured by mood so the shape of the day reads at a glance - how much of
// it is admin, where the stress spikes are, where the reward is. "Reality
// check" lines sit in their own callout below.

const MOOD: Record<DayMood, { dot: string; ring: string; label: string }> = {
  routine: { dot: 'bg-slate-400', ring: 'ring-slate-200 dark:ring-slate-700', label: 'Routine' },
  admin: { dot: 'bg-violet-400', ring: 'ring-violet-200 dark:ring-violet-900', label: 'Admin / paperwork' },
  stress: { dot: 'bg-amber-500', ring: 'ring-amber-200 dark:ring-amber-900', label: 'High pressure' },
  reward: { dot: 'bg-emerald-500', ring: 'ring-emerald-200 dark:ring-emerald-900', label: 'The rewarding bit' },
}

const LEGEND_ORDER: DayMood[] = ['routine', 'admin', 'stress', 'reward']

export default function DayInTheLifeTimeline({ data }: { data: DayInTheLife }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">{data.summary}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {LEGEND_ORDER.map((mood) => (
          <span key={mood} className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className={`h-2 w-2 rounded-full ${MOOD[mood].dot}`} />
            {MOOD[mood].label}
          </span>
        ))}
      </div>

      <ol className="relative ml-1 space-y-5 border-l border-slate-200 pl-6 dark:border-slate-700">
        {data.blocks.map((block, index) => (
          <li key={index} className="relative">
            <span
              className={`absolute -left-[31px] top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ${MOOD[block.mood].dot} ${MOOD[block.mood].ring}`}
              aria-hidden="true"
            />
            <p className="font-mono text-xs font-semibold tabular-nums text-slate-400 dark:text-slate-500">{block.time}</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">{block.title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{block.detail}</p>
          </li>
        ))}
      </ol>

      <div className="space-y-2 rounded-xl border border-amber-300/50 bg-amber-50 p-4 dark:border-amber-500/25 dark:bg-amber-500/10">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
          <AlertTriangle className="h-3.5 w-3.5" />
          Reality check
        </p>
        <ul className="space-y-1.5">
          {data.realityChecks.map((check, index) => (
            <li key={index} className="text-sm leading-6 text-amber-900 dark:text-amber-100">
              {check}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
