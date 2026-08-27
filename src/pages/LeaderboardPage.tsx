import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dices, Trophy } from 'lucide-react'
import BackButton from '../components/BackButton'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import { getTierConfig, type TierKey } from '../utils/careerTiers'
import { getTierStyle } from '../utils/tierStyles'
import { usePathStore } from '../store/usePathStore'
import { useAuthStore } from '../store/useAuthStore'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { LEADERBOARD_TOP_N, useLeaderboardEntries, type LeaderboardEntry } from '../store/useLeaderboardStore'
import TitlePill from '../components/TitlePill'

// A genuinely global leaderboard now (see useLeaderboardStore.ts) - promoted
// out of /job-market/roll/... to its own top-level /leaderboard route since
// it's no longer "this browser's own numbers", it's every PathScrawler
// player's. Still the same dark "game mode" shell as Roll a Job itself
// (full-bleed breakout + .dark-mode ancestor trick + radial vignette,
// forced regardless of the site's own light/dark toggle - see App.tsx's
// isRollActive) since this is still visually part of that arcade corner.
const RANK_MEDAL: Record<number, string> = { 0: '🥇', 1: '🥈', 2: '🥉' }

function TierPip({ tier }: { tier: TierKey }) {
  const config = getTierConfig(tier)
  const style = getTierStyle(tier)
  return (
    <span
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${style.badgeBg} ${style.badgeText}`}
      title={config.label}
    >
      {config.emoji}
    </span>
  )
}

/** Display name for a row: the chosen username, or - until that player sets
 * one - the part of their email before the @ (a handle, not a full address
 * on a game board). Every row renders the same way regardless. */
function displayNameFor(entry: LeaderboardEntry): string {
  if (entry.username) return entry.username
  const local = entry.email.split('@')[0]
  return local || entry.email
}

function LeaderboardRow({ entry, rank, isYou }: { entry: LeaderboardEntry; rank: number; isYou: boolean }) {
  const bestConfig = entry.bestTier ? getTierConfig(entry.bestTier) : null
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-4 transition sm:flex-row sm:items-center sm:justify-between ${
        isYou ? 'border-amber-400/50 bg-amber-400/10 ring-1 ring-amber-400/30' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-base font-bold text-slate-300">
          {RANK_MEDAL[rank] ?? `#${rank + 1}`}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {entry.equippedTitleId ? <TitlePill titleId={entry.equippedTitleId} /> : null}
            <span className="min-w-0 truncate font-semibold text-slate-100">{displayNameFor(entry)}</span>
            {isYou ? (
              <span className="shrink-0 rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                You
              </span>
            ) : null}
          </div>
          <p className="text-xs text-slate-400">
            {entry.totalRolls} {entry.totalRolls === 1 ? 'roll' : 'rolls'} · Best: {bestConfig ? `${bestConfig.emoji} ${bestConfig.label}` : '—'}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
        <div className="flex gap-1" aria-label={`Top ${LEADERBOARD_TOP_N} rolls`}>
          {Array.from({ length: LEADERBOARD_TOP_N }).map((_, index) =>
            entry.topRolls[index] ? (
              <TierPip key={`${entry.userId}-${index}`} tier={entry.topRolls[index].tier} />
            ) : (
              <span key={index} className="h-7 w-7 rounded-full border border-dashed border-white/10" aria-hidden="true" />
            ),
          )}
        </div>
        <p className="w-14 text-right text-lg font-extrabold text-amber-300">{entry.score}</p>
      </div>
    </div>
  )
}

export default function LeaderboardPage() {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const currentUser = useAuthStore((state) => state.currentUser)
  const { entries, loading } = useLeaderboardEntries()

  const yourRank = useMemo(
    () => (currentUser ? entries.findIndex((entry) => entry.userId === currentUser.id) : -1),
    [entries, currentUser],
  )

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
      // No background here - see JobMarketRollPage.tsx's identical comment:
      // -translate-x-1/2 below is a `transform`, which breaks
      // `background-attachment: fixed` on this exact element (CSS spec
      // behavior, confirmed via a real rendered seam, not eyeballed) -
      // MobileContainer.tsx's own forceDarkBg gradient (which IS correctly
      // bg-fixed, on an element with no transform) already paints this
      // same gradient behind everything, header included.
      className="dark-mode relative left-1/2 min-h-screen w-screen -translate-x-1/2 px-4 pb-16 pt-3 sm:px-6"
    >
      <BackButton to="/job-market/roll" label="Roll a Job" />

      <div className="mx-auto mt-6 max-w-2xl space-y-8">
        <PageHeader
          icon={Trophy}
          title="Roll a Job Leaderboard"
          subtitle="Ranked by every card you've ever rolled, plus every Achievement you've earned - rarer tiers score more, so keep rolling to climb."
        />

        {!isSupabaseConfigured ? (
          <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm leading-6 text-red-200">
            This deployment isn't connected to a leaderboard database yet - see .env.example.
          </div>
        ) : !currentUser ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold text-amber-300 underline underline-offset-2"
            >
              Sign in
            </button>{' '}
            to start earning your own spot on this board - rolls made while signed out are just for you, they don't count here.
          </div>
        ) : yourRank === -1 && !loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
            You haven't rolled anything yet - your first roll will put you on the board.
          </div>
        ) : null}

        {loading ? (
          <p className="text-center text-sm text-slate-400">Loading the leaderboard…</p>
        ) : entries.length === 0 ? (
          <EmptyState
            icon={Dices}
            title="No rolls on the board yet"
            message="Sign in and roll for a career to claim the top spot."
            actionLabel="Roll a job"
            onAction={() => navigate('/job-market/roll')}
          />
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <LeaderboardRow key={entry.userId} entry={entry} rank={index} isYou={entry.userId === currentUser?.id} />
            ))}
          </div>
        )}

        {/* Genuinely global now (see useLeaderboardStore.ts) - every
            signed-in player everywhere, not just this browser. */}
        <p className="text-center text-xs leading-5 text-slate-500">🌐 Live leaderboard - every PathScrawler player, on every device.</p>
      </div>
    </motion.div>
  )
}
