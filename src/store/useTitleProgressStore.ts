import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Career } from '../data/demoCareers'
import { TIERS, type TierKey } from '../utils/careerTiers'
import {
  COMMON_CAREER_IDS,
  EARLY_ROLL_WINDOW,
  MONEY_BAGS_CAREER_IDS,
  MONEY_BAGS_ROLL_WINDOW,
  MYTHIC_CAREER_IDS,
  SWEAT_LORD_ROLLS_TARGET,
  SWEAT_LORD_WINDOW_MS,
  type TitleUnlockProgress,
} from '../utils/titles'
import { useAuthStore } from './useAuthStore'

// Account-scoped, same pattern as useBinderStore.ts (cardsByUser ->
// progressByUser here) rather than useRollStore.ts's flat per-browser
// counters - several of these titles are inherently tied to an account
// (Binder contents, leaderboard rank), so the whole system follows the
// Binder's scoping rather than mixing the two models. This is a SEPARATE
// counter set from useRollStore's own lifetimeTotalRolls etc. (which still
// power RollStatsPanel unchanged) - two different questions ("how many
// rolls has this browser ever seen" vs "how many rolls has THIS account
// made toward its titles") that happen to often have the same answer, but
// aren't the same field.
export interface TitleProgress {
  totalRolls: number
  hasCelestialRoll: boolean
  rollsSinceLegendaryPlus: number
  longestLegendaryDrySpell: number
  hasLegendaryInFirst20: boolean
  hasMythicInFirst20: boolean
  hasCelestialInFirst20: boolean
  /** Rolling 24h window - epoch ms timestamps, pruned every roll. Small
   * (caps near SWEAT_LORD_ROLLS_TARGET entries), fine to persist as-is. */
  recentRollTimestamps: number[]
  hasHitSweatLord: boolean
  hasReachedTop3: boolean
  hasCompletedCommonSet: boolean
  hasCompletedMythicSet: boolean
  hasCompletedMoneyBagsSet: boolean
  hasRolledAiEndangered: boolean
  /** Which title ids have already shown their one-time unlock toast. */
  seenTitleIds: string[]
  /** Which title ids have already been written to Supabase's title_unlocks
   * table (useLeaderboardStore.ts's recordTitleUnlock) - deliberately a
   * SEPARATE flag from seenTitleIds above, not reused: seenTitleIds is a
   * UI concern (has the toast shown) that already existed before titles
   * counted toward the leaderboard, and gating the Supabase sync on it
   * would mean every title a player earned BEFORE this sync existed (its
   * toast already shown, seenTitleIds already includes it) would silently
   * never get synced at all - the sync effect (RollStandingPanel.tsx)
   * checks every currently-unlocked title against this list instead of
   * only newly-transitioning ones, so it naturally backfills those too. */
  syncedTitleIds: string[]
}

function emptyProgress(): TitleProgress {
  return {
    totalRolls: 0,
    hasCelestialRoll: false,
    rollsSinceLegendaryPlus: 0,
    longestLegendaryDrySpell: 0,
    hasLegendaryInFirst20: false,
    hasMythicInFirst20: false,
    hasCelestialInFirst20: false,
    recentRollTimestamps: [],
    hasHitSweatLord: false,
    hasReachedTop3: false,
    hasCompletedCommonSet: false,
    hasCompletedMythicSet: false,
    hasCompletedMoneyBagsSet: false,
    hasRolledAiEndangered: false,
    seenTitleIds: [],
    syncedTitleIds: [],
  }
}

function tierRank(tier: TierKey): number {
  return TIERS.findIndex((t) => t.key === tier)
}
const LEGENDARY_RANK = tierRank('legendary')

function currentUserId(): string | null {
  return useAuthStore.getState().currentUser?.id ?? null
}

interface TitleProgressState {
  progressByUser: Record<string, TitleProgress>
  recordRoll: (career: Career, tier: TierKey) => void
  markTop3Reached: () => void
  /** Reactively checked against LIVE Binder contents whenever the Binder
   * changes (see RollStandingPanel.tsx) - a career-id superset check, not
   * something recordRoll can determine on its own since rolling a career
   * doesn't necessarily mean it's IN the Binder (the player has to add it). */
  syncBinderCompletion: (binderCareerIds: Set<number>) => void
  markTitleSeen: (titleId: string) => void
  markTitleSynced: (titleId: string) => void
  getProgress: () => TitleUnlockProgress
}

export const useTitleProgressStore = create<TitleProgressState>()(
  persist(
    (set, get) => ({
      progressByUser: {},

      recordRoll: (career, tier) => {
        const userId = currentUserId()
        if (!userId) return
        const existing = get().progressByUser[userId] ?? emptyProgress()
        const totalRolls = existing.totalRolls + 1
        const isLegendaryPlus = tierRank(tier) >= LEGENDARY_RANK

        const now = Date.now()
        const recentRollTimestamps = [...existing.recentRollTimestamps, now].filter(
          (ts) => now - ts <= SWEAT_LORD_WINDOW_MS,
        )

        const rollsSinceLegendaryPlus = isLegendaryPlus ? 0 : existing.rollsSinceLegendaryPlus + 1

        set({
          progressByUser: {
            ...get().progressByUser,
            [userId]: {
              ...existing,
              totalRolls,
              hasCelestialRoll: existing.hasCelestialRoll || tier === 'celestial',
              rollsSinceLegendaryPlus,
              longestLegendaryDrySpell: Math.max(existing.longestLegendaryDrySpell, rollsSinceLegendaryPlus),
              hasLegendaryInFirst20: existing.hasLegendaryInFirst20 || (tier === 'legendary' && totalRolls <= EARLY_ROLL_WINDOW),
              hasMythicInFirst20: existing.hasMythicInFirst20 || (tier === 'mythic' && totalRolls <= EARLY_ROLL_WINDOW),
              hasCelestialInFirst20: existing.hasCelestialInFirst20 || (tier === 'celestial' && totalRolls <= EARLY_ROLL_WINDOW),
              recentRollTimestamps,
              hasHitSweatLord: existing.hasHitSweatLord || recentRollTimestamps.length >= SWEAT_LORD_ROLLS_TARGET,
              hasRolledAiEndangered: existing.hasRolledAiEndangered || career.aiEndangered === true,
            },
          },
        })
      },

      markTop3Reached: () => {
        const userId = currentUserId()
        if (!userId) return
        const existing = get().progressByUser[userId] ?? emptyProgress()
        if (existing.hasReachedTop3) return
        set({ progressByUser: { ...get().progressByUser, [userId]: { ...existing, hasReachedTop3: true } } })
      },

      syncBinderCompletion: (binderCareerIds) => {
        const userId = currentUserId()
        if (!userId) return
        const existing = get().progressByUser[userId] ?? emptyProgress()
        // targets.size === 0 guard: a vacuous for...of over an empty set
        // never enters the loop, so this fell straight through to `return
        // true` for ANY empty target set - genuinely happened for
        // MONEY_BAGS_CAREER_IDS (titles.ts) when parseSalaryAvg had a
        // parsing bug that made every real career's salary compute near
        // zero (fixed in careerTiers.ts), silently unlocking Money Bags for
        // every account regardless of their Binder. An empty target set
        // should never count as "collected the full set" for any reason.
        const hasAll = (targets: Set<number>) => {
          if (targets.size === 0) return false
          for (const id of targets) {
            if (!binderCareerIds.has(id)) return false
          }
          return true
        }
        const hasCompletedCommonSet = existing.hasCompletedCommonSet || hasAll(COMMON_CAREER_IDS)
        const hasCompletedMythicSet = existing.hasCompletedMythicSet || hasAll(MYTHIC_CAREER_IDS)
        // Money Bags additionally has to have completed within the first
        // MONEY_BAGS_ROLL_WINDOW rolls - checked at the moment the set is
        // FIRST detected as complete, not re-checked afterward (so it stays
        // permanently earned, or permanently missed, the instant that
        // window closes).
        const hasCompletedMoneyBagsSet =
          existing.hasCompletedMoneyBagsSet || (hasAll(MONEY_BAGS_CAREER_IDS) && existing.totalRolls <= MONEY_BAGS_ROLL_WINDOW)
        if (
          hasCompletedCommonSet === existing.hasCompletedCommonSet &&
          hasCompletedMythicSet === existing.hasCompletedMythicSet &&
          hasCompletedMoneyBagsSet === existing.hasCompletedMoneyBagsSet
        ) {
          return
        }
        set({
          progressByUser: {
            ...get().progressByUser,
            [userId]: { ...existing, hasCompletedCommonSet, hasCompletedMythicSet, hasCompletedMoneyBagsSet },
          },
        })
      },

      markTitleSeen: (titleId) => {
        const userId = currentUserId()
        if (!userId) return
        const existing = get().progressByUser[userId] ?? emptyProgress()
        if (existing.seenTitleIds.includes(titleId)) return
        set({
          progressByUser: {
            ...get().progressByUser,
            [userId]: { ...existing, seenTitleIds: [...existing.seenTitleIds, titleId] },
          },
        })
      },

      markTitleSynced: (titleId) => {
        const userId = currentUserId()
        if (!userId) return
        const existing = get().progressByUser[userId] ?? emptyProgress()
        if (existing.syncedTitleIds.includes(titleId)) return
        set({
          progressByUser: {
            ...get().progressByUser,
            [userId]: { ...existing, syncedTitleIds: [...existing.syncedTitleIds, titleId] },
          },
        })
      },

      getProgress: () => {
        const userId = currentUserId()
        return userId ? (get().progressByUser[userId] ?? emptyProgress()) : emptyProgress()
      },
    }),
    {
      name: 'pathscrawler-title-progress',
      // v1 -> v2: hasCompletedMoneyBagsSet could have been computed `true`
      // for EVERY account under the old parseSalaryAvg bug (see
      // syncBinderCompletion's own comment) - a value already-persisted
      // from that broken logic can't be trusted, so that step forces it
      // back to false for everyone on upgrade. Genuinely-earned Working
      // Class Hero / Standing on a Million Lives progress (unaffected by
      // that bug - they don't use parseSalaryAvg at all) is left alone.
      // v2 -> v3: adds syncedTitleIds (titles now sync to Supabase's
      // title_unlocks table, schema.sql, so they count toward the
      // leaderboard score) - a plain additive default of [] for every
      // existing account, not a correction of bad data like v2 was. Any
      // titles they'd already earned before this existed get genuinely
      // synced (not just defaulted) the next time the sync effect runs
      // (RollStandingPanel.tsx), since an empty syncedTitleIds makes every
      // currently-unlocked title look unsynced yet.
      version: 3,
      migrate: (persisted, version) => {
        let state = (persisted ?? { progressByUser: {} }) as { progressByUser: Record<string, TitleProgress> }
        if (version < 2) {
          state = {
            progressByUser: Object.fromEntries(
              Object.entries(state.progressByUser).map(([userId, progress]) => [userId, { ...progress, hasCompletedMoneyBagsSet: false }]),
            ),
          }
        }
        if (version < 3) {
          state = {
            progressByUser: Object.fromEntries(
              Object.entries(state.progressByUser).map(([userId, progress]) => [
                userId,
                { ...progress, syncedTitleIds: progress.syncedTitleIds ?? [] },
              ]),
            ),
          }
        }
        return state
      },
      partialize: (state) => ({ progressByUser: state.progressByUser }),
    },
  ),
)

const EMPTY_PROGRESS = emptyProgress()

/** Reactive hook mirror of getProgress() - subscribes to both stores like
 * useMyBinderCards() does, so switching/signing out accounts updates it. */
export function useMyTitleProgress(): TitleProgress {
  const userId = useAuthStore((state) => state.currentUser?.id ?? null)
  return useTitleProgressStore((state) => (userId ? (state.progressByUser[userId] ?? EMPTY_PROGRESS) : EMPTY_PROGRESS))
}
