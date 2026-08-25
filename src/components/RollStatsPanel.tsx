import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, RotateCcw, Trophy } from 'lucide-react'
import demoCareers from '../data/demoCareers'
import { getCareerTier, getTierConfig, TIER_POINTS, TIERS, type TierKey } from '../utils/careerTiers'
import { TIER_BAR_COLOR } from '../utils/tierStyles'
import { useAuthStore } from '../store/useAuthStore'
import { useLeaderboardEntries } from '../store/useLeaderboardStore'
import { useRollStore } from '../store/useRollStore'

// Optional lifetime stats panel - collapsed by default so it doesn't
// compete with the main roll/result area. "Reset stats" uses a two-click
// arm/confirm pattern (click once to arm, click again within a few
// seconds to actually reset) rather than a browser confirm() dialog,
// consistent with how the rest of this app avoids native dialogs.
export default function RollStatsPanel() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [armed, setArmed] = useState(false)
  const lifetimeTotalRolls = useRollStore((state) => state.lifetimeTotalRolls)
  const lifetimeTierCounts = useRollStore((state) => state.lifetimeTierCounts)
  const lifetimeCareerCounts = useRollStore((state) => state.lifetimeCareerCounts)
  const bestTier = useRollStore((state) => state.bestTier)
  const resetStats = useRollStore((state) => state.resetStats)
  const currentUser = useAuthStore((state) => state.currentUser)
  const { entries: leaderboardEntries } = useLeaderboardEntries()
  const yourRank = currentUser ? leaderboardEntries.findIndex((entry) => entry.userId === currentUser.id) : -1

  const mostRolled = useMemo(() => {
    const entries = Object.entries(lifetimeCareerCounts)
    if (entries.length === 0) return null
    const [topId, count] = entries.reduce((best, current) => (current[1] > best[1] ? current : best))
    const career = demoCareers.find((item) => item.id === Number(topId))
    return career ? { title: career.title, count, points: TIER_POINTS[getCareerTier(career)] } : null
  }, [lifetimeCareerCounts])

  if (lifetimeTotalRolls === 0) return null

  const handleReset = () => {
    if (!armed) {
      setArmed(true)
      window.setTimeout(() => setArmed(false), 3000)
      return
    }
    resetStats()
    setArmed(false)
  }

  return (
    // stopPropagation: this panel sits inside the page's "click outside
    // the card closes it" container - without this, any click in here
    // (the toggle, Reset stats, ...) would bubble up and immediately
    // dismiss whatever result card is currently open.
    <div className="mt-6 w-full max-w-md px-4 sm:px-0" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="mx-auto flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
      >
        <BarChart3 className="h-3.5 w-3.5" />
        {open ? 'Hide roll stats' : 'Show roll stats'}
      </button>

      {open ? (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
            <div>
              <p className="text-lg font-bold text-slate-950 dark:text-slate-50">{lifetimeTotalRolls}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total rolls</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-950 dark:text-slate-50">
                {bestTier ? `${getTierConfig(bestTier).emoji} ${getTierConfig(bestTier).label}` : '—'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Best roll ever</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              {/* Leaderboard-points value for whichever career you've
                  rolled most, not the career name itself anymore - the
                  title/count moved down into the caption line. */}
              <p className="truncate text-lg font-bold text-slate-950 dark:text-slate-50">
                {mostRolled ? `+${mostRolled.points}` : '—'}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {mostRolled ? `${mostRolled.title} (${mostRolled.count}x)` : 'Most rolled'}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Rarity distribution</p>
            <div className="mt-1.5 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              {TIERS.map((tier) => {
                const count = lifetimeTierCounts[tier.key as TierKey] ?? 0
                const pct = (count / lifetimeTotalRolls) * 100
                if (pct === 0) return null
                return <div key={tier.key} className={TIER_BAR_COLOR[tier.key as TierKey]} style={{ width: `${pct}%` }} title={`${tier.label}: ${count}`} />
              })}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              {TIERS.map((tier) => (
                <span key={tier.key} className="inline-flex items-center gap-1">
                  {tier.emoji} {tier.label} {lifetimeTierCounts[tier.key as TierKey] ?? 0}
                </span>
              ))}
            </div>
          </div>

          {/* Your rank on the Roll a Job leaderboard (useLeaderboardStore) -
              a different feature from the stats above (this browser's own
              lifetime tally): rank compares this account against every
              other account that has rolled here. stopPropagation for the
              same reason the outer wrapper has it - this whole panel sits
              inside the page's "click outside closes the result card"
              container. */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              navigate('/leaderboard')
            }}
            className="mt-4 flex w-full items-center justify-between rounded-xl border border-amber-400/30 bg-amber-50 px-3 py-2.5 text-left transition hover:bg-amber-100 dark:bg-amber-400/10 dark:hover:bg-amber-400/15"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
              <Trophy className="h-3.5 w-3.5" />
              Leaderboard rank
            </span>
            <span className="text-sm font-bold text-amber-800 dark:text-amber-300">
              {!currentUser ? 'Sign in to join' : yourRank === -1 ? 'Unranked yet' : `#${yourRank + 1} of ${leaderboardEntries.length}`}
            </span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className={`mt-4 inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              armed
                ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/50'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {armed ? 'Click again to confirm reset' : 'Reset stats'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
