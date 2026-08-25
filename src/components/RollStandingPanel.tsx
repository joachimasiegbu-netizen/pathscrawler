import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Crown, Dices, Flame, Lock, Skull, Sparkles, Trophy, X } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useMyBinderCards } from '../store/useBinderStore'
import { recordTitleUnlock, useLeaderboardEntries } from '../store/useLeaderboardStore'
import { useMyTitleProgress, useTitleProgressStore, type TitleProgress } from '../store/useTitleProgressStore'
import { TIERS } from '../utils/careerTiers'
import { TIER_BAR_COLOR } from '../utils/tierStyles'
import {
  COMMON_CAREER_IDS,
  EARLY_ROLL_WINDOW,
  GAMBLING_ADDICT_ROLLS_TARGET,
  getTitlesWithStatus,
  JOB_DRY_SPELL_TARGET,
  SWEAT_LORD_ROLLS_TARGET,
  type TitleIcon,
  type TitleWithStatus,
} from '../utils/titles'
import Toast from './Toast'

const TITLE_ICONS: Record<TitleIcon, typeof Trophy> = {
  crown: Crown,
  flame: Flame,
  skull: Skull,
  sparkles: Sparkles,
  trophy: Trophy,
}

function formatChance(share: number): string {
  const pct = share * 100
  if (pct >= 1) return `${pct.toFixed(0)}%`
  return `${pct.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}%`
}

interface TitleProgressInfo {
  label: string
  /** 0-100, only set when climbing this number genuinely means "closer to
   * done" - e.g. Job's dry-spell count actually IS progress toward 500.
   * Left unset for the "in your first 20 rolls" trio (golden-child/
   * seraph-of-the-end/heavens-descendant) and Icarus deliberately - using
   * up more of a fixed window without succeeding isn't progress, it's
   * just spent opportunity, and a filling bar would misleadingly suggest
   * otherwise. Per explicit request ("completion bar should be for each
   * individual title, not in general") - one title's own bar, not a
   * whole-set summary. */
  percent?: number
}

// Live "how close are you" readout for the detail modal - only for titles
// that are (a) not hidden (a hidden title reveals NOTHING, progress
// included, until it's actually earned - same rule the row itself follows)
// and (b) still locked (nothing left to track once earned) and (c) have an
// actual running number behind them (Chosen One is a flat "did it happen
// or not", nothing to show a fraction of). Reads straight off fields
// useTitleProgressStore.ts already tracks - no new state needed for this.
function getProgressInfo(title: TitleWithStatus, progress: TitleProgress, commonCollected: number, yourRank: number): TitleProgressInfo | null {
  if (title.unlocked || title.isHidden) return null
  switch (title.id) {
    case 'gambling-addict':
      return {
        label: `${progress.totalRolls.toLocaleString()} / ${GAMBLING_ADDICT_ROLLS_TARGET.toLocaleString()} rolls`,
        percent: Math.min(100, (progress.totalRolls / GAMBLING_ADDICT_ROLLS_TARGET) * 100),
      }
    case 'icarus':
      return { label: yourRank === -1 ? 'Unranked so far' : `Currently #${yourRank + 1} on the leaderboard` }
    case 'golden-child':
    case 'seraph-of-the-end':
    case 'heavens-descendant':
      // Once totalRolls passes the window, this specific title can never
      // unlock again - worth saying plainly rather than leaving it looking
      // like it's still in reach.
      return {
        label:
          progress.totalRolls >= EARLY_ROLL_WINDOW
            ? `Window closed - only your first ${EARLY_ROLL_WINDOW} rolls counted`
            : `${progress.totalRolls} / ${EARLY_ROLL_WINDOW} rolls used`,
      }
    case 'working-class-hero':
      return {
        label: `${commonCollected} / ${COMMON_CAREER_IDS.size} Common careers collected`,
        percent: Math.min(100, (commonCollected / COMMON_CAREER_IDS.size) * 100),
      }
    case 'job':
      return {
        label: `Current dry spell: ${progress.rollsSinceLegendaryPlus} / ${JOB_DRY_SPELL_TARGET} rolls`,
        percent: Math.min(100, (progress.rollsSinceLegendaryPlus / JOB_DRY_SPELL_TARGET) * 100),
      }
    case 'sweat-lord':
      return {
        label: `${progress.recentRollTimestamps.length} / ${SWEAT_LORD_ROLLS_TARGET} rolls in the last 24h`,
        percent: Math.min(100, (progress.recentRollTimestamps.length / SWEAT_LORD_ROLLS_TARGET) * 100),
      }
    default:
      return null
  }
}

// Lives in the app's normal global header now (App.tsx), not just Roll a
// Job's own always-dark "game mode" page - so unlike RollResultCard/
// MythicRevealCard/etc., this needs real light/dark theming rather than one
// fixed dark-glass look. Styled to match the header's existing dropdowns
// (the account menu, AccessibilitySettingsPanel) - white/slate-800 panel,
// slate-200/700 borders - rather than inventing a third dropdown look.
export default function RollStandingPanel() {
  const navigate = useNavigate()
  const [panelOpen, setPanelOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'titles' | 'odds'>('titles')
  const [toastQueue, setToastQueue] = useState<TitleWithStatus[]>([])
  const [activeToast, setActiveToast] = useState<TitleWithStatus | null>(null)
  const [selectedTitle, setSelectedTitle] = useState<TitleWithStatus | null>(null)

  const currentUser = useAuthStore((state) => state.currentUser)
  const cards = useMyBinderCards()
  const progress = useMyTitleProgress()
  const { entries: leaderboardEntries } = useLeaderboardEntries()
  const yourRank = currentUser ? leaderboardEntries.findIndex((entry) => entry.userId === currentUser.id) : -1

  const titles = getTitlesWithStatus(progress)
  const earnedCount = titles.filter((t) => t.unlocked).length
  const commonCollectedCount = new Set(cards.map((card) => card.careerId).filter((id) => COMMON_CAREER_IDS.has(id))).size

  // Two reactive syncs into useTitleProgressStore - neither is something
  // recordRoll (fired once per roll, JobMarketRollPage.tsx) can determine
  // on its own: leaderboard rank comes from a live Supabase subscription,
  // and Binder contents change on Add/Remove/Clear, none of which are roll
  // events. Both are idempotent no-ops once already latched (see the store),
  // and both run regardless of whether the panel is open - this component
  // is always mounted in the header now, so it's the right permanent home
  // for these watchers.
  useEffect(() => {
    if (yourRank !== -1 && yourRank < 3) {
      useTitleProgressStore.getState().markTop3Reached()
    }
  }, [yourRank])

  useEffect(() => {
    const binderCareerIds = new Set(cards.map((card) => card.careerId))
    useTitleProgressStore.getState().syncBinderCompletion(binderCareerIds)
  }, [cards])

  // Queue + one-at-a-time display for newly-unlocked titles' one-time
  // toast - markTitleSeen() fires immediately (not after the toast
  // finishes) so a title never re-queues itself on a re-render before its
  // toast has shown.
  useEffect(() => {
    const newlyUnlocked = titles.filter((title) => title.unlocked && !progress.seenTitleIds.includes(title.id))
    if (newlyUnlocked.length === 0) return
    newlyUnlocked.forEach((title) => useTitleProgressStore.getState().markTitleSeen(title.id))
    setToastQueue((current) => [...current, ...newlyUnlocked])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.seenTitleIds, titles.map((t) => t.unlocked).join(',')])

  // Syncs every currently-unlocked title to Supabase's title_unlocks
  // table (useLeaderboardStore.ts) so it counts toward the global
  // leaderboard score, not just this browser's own local progress -
  // titles used to be entirely local/per-device. Deliberately checks
  // EVERY unlocked title against syncedTitleIds, not just newly-
  // transitioning ones like the toast effect above - gating this on
  // seenTitleIds instead would mean any title already earned (and its
  // toast already shown) before this sync existed would never get synced
  // at all. This naturally backfills those on top of syncing new unlocks
  // going forward, both through the same one effect.
  useEffect(() => {
    const unsynced = titles.filter((title) => title.unlocked && !progress.syncedTitleIds.includes(title.id))
    if (unsynced.length === 0) return
    unsynced.forEach((title) => {
      useTitleProgressStore.getState().markTitleSynced(title.id)
      void recordTitleUnlock(title.id, title.points)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.syncedTitleIds, titles.map((t) => t.unlocked).join(',')])

  // Split into two effects on purpose - was one, keyed on [toastQueue,
  // activeToast], and that was a real bug: appending a SECOND title to the
  // queue while the first was already showing changed `toastQueue`, which
  // re-ran the effect, whose cleanup cleared the in-flight dismiss timer -
  // and since `activeToast` was still truthy, the early return meant no
  // replacement timer ever got scheduled. The toast then just sat there
  // permanently instead of dismissing after 4s. Popping the next queued
  // toast and auto-dismissing the current one are two different concerns
  // now, each keyed only on what it actually needs.
  useEffect(() => {
    if (activeToast || toastQueue.length === 0) return
    const [next, ...rest] = toastQueue
    setActiveToast(next)
    setToastQueue(rest)
  }, [toastQueue, activeToast])

  useEffect(() => {
    if (!activeToast) return
    const timeout = window.setTimeout(() => setActiveToast(null), 4000)
    return () => window.clearTimeout(timeout)
  }, [activeToast])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setPanelOpen((value) => !value)}
        aria-label="Your titles and roll odds"
        aria-expanded={panelOpen}
        className={`relative flex h-11 w-11 items-center justify-center rounded-full shadow-sm ring-1 transition ${
          panelOpen
            ? 'bg-secondary/15 text-secondary-dark ring-secondary/50 dark:bg-secondary/20 dark:text-secondary-light'
            : 'bg-white text-primary ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-sky-200 dark:ring-slate-700 dark:hover:bg-slate-700'
        }`}
      >
        <Trophy className="h-5 w-5" />
        {earnedCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-black">
            {earnedCount}
          </span>
        ) : null}
      </button>

      {panelOpen ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPanelOpen(false)} />
          <div className="absolute right-0 top-14 z-50 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-secondary-dark dark:text-secondary-light" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Achievements</span>
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="text-slate-400 transition hover:text-slate-700 dark:text-slate-500 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex border-b border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('titles')}
                className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-wider transition ${
                  activeTab === 'titles'
                    ? 'border-b-2 border-secondary text-secondary-dark dark:text-secondary-light'
                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                }`}
              >
                Titles
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('odds')}
                className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-wider transition ${
                  activeTab === 'odds'
                    ? 'border-b-2 border-secondary text-secondary-dark dark:text-secondary-light'
                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                }`}
              >
                Roll Odds
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {!currentUser ? (
                <p className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">Sign in to start earning titles.</p>
              ) : activeTab === 'titles' ? (
                <TitlesTab
                  titles={titles}
                  onSelect={(title) => {
                    setPanelOpen(false)
                    setSelectedTitle(title)
                  }}
                  onNavigate={(path) => {
                    setPanelOpen(false)
                    navigate(path)
                  }}
                />
              ) : (
                <OddsTab />
              )}
            </div>
          </div>
        </>
      ) : null}

      {activeToast ? <Toast message={`🏆 Title unlocked: ${activeToast.name} — ${activeToast.subtitle}`} type="success" /> : null}

      {selectedTitle ? (
        <TitleDetailModal
          title={selectedTitle}
          progress={getProgressInfo(selectedTitle, progress, commonCollectedCount, yourRank)}
          onClose={() => setSelectedTitle(null)}
        />
      ) : null}
    </div>
  )
}

function TitlesTab({
  titles,
  onSelect,
  onNavigate,
}: {
  titles: TitleWithStatus[]
  onSelect: (title: TitleWithStatus) => void
  onNavigate: (path: string) => void
}) {
  return (
    <div className="space-y-3 p-4">
      <div className="pb-2 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {titles.filter((t) => t.unlocked).length} of {titles.length} earned
        </p>
      </div>

      {titles.map((title) => {
        const Icon = TITLE_ICONS[title.icon]
        // Hidden titles show NOTHING identifying until earned - not even
        // the name (name falls back to '???', matching a locked non-hidden
        // title's icon-only treatment). Non-hidden titles always show their
        // real name, locked or not, but still no subtext until unlocked.
        // Once ANY title unlocks, its real name and condition both show in
        // full - nothing stays masked after it's actually been earned.
        const displayName = title.isHidden && !title.unlocked ? '???' : title.name
        const conditionLine = title.unlocked ? title.condition : undefined
        return (
          <button
            type="button"
            key={title.id}
            onClick={() => onSelect(title)}
            // Rows are real buttons already, but nothing about a flat
            // bordered card actually READS as clickable at rest - per
            // explicit request, added a persistent chevron (a standard
            // "tap for more" affordance, not just a hover-only cue) plus a
            // visible hover/press state (background tint + slight scale-
            // down on tap, not just the old border-color-only hover).
            className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:border-secondary/50 hover:bg-secondary/5 active:scale-[0.98] dark:hover:bg-secondary/10 ${
              title.unlocked
                ? 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-white/5'
                : 'border-slate-100 bg-slate-50/60 opacity-60 hover:opacity-90 dark:border-slate-800 dark:bg-black/20'
            }`}
          >
            <div
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                title.unlocked
                  ? 'bg-secondary/15 text-secondary-dark dark:bg-secondary/20 dark:text-secondary-light'
                  : 'bg-slate-200/70 text-slate-400 dark:bg-white/5 dark:text-white/20'
              }`}
            >
              {title.unlocked ? <Icon className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`truncate text-sm font-bold ${title.unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-white/50'}`}>
                  {displayName}
                </span>
                {title.unlocked && title.isHidden ? (
                  <span className="rounded border border-purple-400/40 bg-purple-100 px-1.5 py-0.5 text-[10px] text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300">
                    SECRET
                  </span>
                ) : null}
              </div>
              {conditionLine ? <p className="truncate text-[11px] text-slate-400 dark:text-white/30">{conditionLine}</p> : null}
            </div>

            <span className="flex shrink-0 items-center gap-1.5">
              {title.unlocked ? (
                <span className="text-xs font-mono text-secondary-dark/70 dark:text-secondary-light/60">#{String(title.rank).padStart(2, '0')}</span>
              ) : null}
              <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-secondary-dark dark:text-slate-600 dark:group-hover:text-secondary-light" />
            </span>
          </button>
        )
      })}

      {/* Moved here from the Odds tab, per explicit request - two direct
          jumps, since anyone looking at their titles is either about to
          check where they stand (Leaderboard) or about to go try their
          luck (Roll a Job). Both close the panel before navigating - it
          stayed open across a route change otherwise, since this
          component lives in the header and never unmounts. */}
      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-white/5">
        <button
          type="button"
          onClick={() => onNavigate('/leaderboard')}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-secondary/30 bg-secondary/10 px-3 py-2.5 text-xs font-semibold text-secondary-dark transition hover:bg-secondary/20 dark:text-secondary-light"
        >
          <Trophy className="h-3.5 w-3.5" />
          Leaderboard
        </button>
        <button
          type="button"
          onClick={() => onNavigate('/job-market/roll')}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-dark"
        >
          <Dices className="h-3.5 w-3.5" />
          Roll a Job
        </button>
      </div>
    </div>
  )
}

function OddsTab() {
  return (
    <div className="space-y-4 p-4">
      <p className="text-center text-xs text-slate-400 dark:text-white/40">Pure randomness. No pity. No guarantees.</p>

      {TIERS.map((tier) => {
        const chance = formatChance(tier.targetShare)
        // Real percentage below 1.5 renders as an invisible sliver at
        // this bar's scale - floored just for the VISUAL width, the text
        // next to it still shows the real, un-floored number.
        const visualWidth = Math.max(tier.targetShare * 100, 1.5)
        return (
          <div key={tier.key} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600 dark:text-white/70">
                {tier.emoji} {tier.label}
              </span>
              <span className="font-mono text-slate-400 dark:text-white/40">{chance}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
              <div
                className={`h-full rounded-full ${TIER_BAR_COLOR[tier.key]} ${
                  tier.key === 'celestial' ? 'shadow-[0_0_8px_rgba(0,0,0,0.25)] dark:shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''
                }`}
                style={{ width: `${visualWidth}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Full detail on demand, per explicit request ("each title should be
// clickable... the full sub text, how many points it gives"). Reuses the
// same centered-overlay pattern the accessibility settings modal already
// uses (App.tsx) rather than inventing a second modal treatment.
//
// Hidden + still locked stays maximally mysterious here too, not just in
// the row - a click that fully revealed a "hidden" title's name/
// requirements/reward would defeat the entire point of hiding it. Every
// other case (unlocked, or locked-but-not-hidden) shows everything: the
// requirements (previously only ever shown post-unlock in the row itself -
// this is the one place a still-locked, non-hidden title's "how do I
// actually get this" is spelled out), the full subtitle (once earned),
// the point value, and - where there's an actual running number behind
// the condition - live progress toward it, as a percentage completion bar
// specific to THIS title (getProgressInfo above) - per explicit request,
// one title's own bar, not a whole-set summary elsewhere in the panel.
//
// "How many people have earned it" (also requested) needs real cross-
// account aggregation - a Supabase table recording title unlocks the way
// `rolls`/`user_best_cards` already do for the leaderboard (schema.sql) -
// which useTitleProgressStore.ts doesn't have yet (it's local-only,
// per-browser persisted state, same as useBinderStore). Left out of this
// view rather than faked with a placeholder number; worth building as its
// own follow-up if wanted.
function TitleDetailModal({
  title,
  progress,
  onClose,
}: {
  title: TitleWithStatus
  progress: TitleProgressInfo | null
  onClose: () => void
}) {
  const Icon = TITLE_ICONS[title.icon]
  const isMystery = title.isHidden && !title.unlocked
  const displayName = isMystery ? '???' : title.name

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 px-4 py-6" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${
              title.unlocked
                ? 'bg-secondary/15 text-secondary-dark dark:bg-secondary/20 dark:text-secondary-light'
                : 'bg-slate-200/70 text-slate-400 dark:bg-white/5 dark:text-white/20'
            }`}
          >
            {title.unlocked ? <Icon className="h-7 w-7" /> : <Lock className="h-7 w-7" />}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 transition hover:text-slate-700 dark:text-slate-500 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{displayName}</h2>
          {title.unlocked && title.isHidden ? (
            <span className="rounded border border-purple-400/40 bg-purple-100 px-1.5 py-0.5 text-[10px] text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300">
              SECRET
            </span>
          ) : null}
        </div>

        {isMystery ? (
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            This is a secret achievement. Its name, requirements and reward all stay hidden until you actually earn it.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {title.unlocked ? <p className="text-sm italic leading-6 text-slate-600 dark:text-slate-300">"{title.subtitle}"</p> : null}

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Requirements</p>
              <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{title.condition}</p>
            </div>

            {progress ? (
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Progress</p>
                  {progress.percent !== undefined ? (
                    <p className="text-[11px] font-mono font-semibold text-secondary-dark dark:text-secondary-light">
                      {Math.round(progress.percent)}%
                    </p>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{progress.label}</p>
                {progress.percent !== undefined ? (
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-secondary to-secondary-light transition-[width] duration-500"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="flex items-center justify-between rounded-xl bg-secondary/10 px-3 py-2.5">
              <span className="text-xs font-semibold text-secondary-dark dark:text-secondary-light">Points</span>
              <span className="text-sm font-bold text-secondary-dark dark:text-secondary-light">+{title.points}</span>
            </div>

            <p className={`text-xs font-semibold ${title.unlocked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
              {title.unlocked ? '✓ Unlocked' : 'Not yet unlocked'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
