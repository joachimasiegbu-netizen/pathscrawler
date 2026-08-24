import demoCareers from '../data/demoCareers'
import { TIERS, getTierConfig, type TierKey } from '../utils/careerTiers'
import type { GroupedBinderCard } from '../utils/binderGrouping'

interface BinderStatsPanelProps {
  grouped: GroupedBinderCard[]
}

function tierRank(tier: TierKey): number {
  return TIERS.findIndex((t) => t.key === tier)
}

const DOT_COLOR: Record<TierKey, string> = {
  common: 'bg-emerald-500',
  uncommon: 'bg-blue-500',
  rare: 'bg-purple-500',
  epic: 'bg-amber-500',
  legendary: 'bg-accent',
  mythic: 'bg-red-500',
  celestial: 'bg-gradient-to-r from-slate-200 to-amber-300',
}

export default function BinderStatsPanel({ grouped }: BinderStatsPanelProps) {
  const uniqueOwned = grouped.length
  const totalUniqueCareers = demoCareers.length
  const progressPct = Math.round((uniqueOwned / totalUniqueCareers) * 100)

  const rarest = grouped.reduce<GroupedBinderCard | null>((best, entry) => {
    if (!best || tierRank(entry.latest.tier) > tierRank(best.latest.tier)) return entry
    return best
  }, null)

  const tierCounts = grouped.reduce<Partial<Record<TierKey, number>>>((counts, entry) => {
    counts[entry.latest.tier] = (counts[entry.latest.tier] ?? 0) + 1
    return counts
  }, {})

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:shadow-none sm:p-5">
      <p className="text-lg font-bold">
        {uniqueOwned} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ {totalUniqueCareers} cards collected</span>
      </p>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Rarest card: {rarest ? `${getTierConfig(rarest.latest.tier).emoji} ${rarest.latest.title}` : '—'}
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Collection progress</span>
          <span>{progressPct}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Tier breakdown</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          {TIERS.map((tier) => (
            <span key={tier.key} className="inline-flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${DOT_COLOR[tier.key as TierKey]}`} aria-hidden="true" />
              {tier.label} {tierCounts[tier.key as TierKey] ?? 0}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
