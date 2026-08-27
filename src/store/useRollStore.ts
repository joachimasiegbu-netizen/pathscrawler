import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TIERS, type TierKey } from '../utils/careerTiers'
import type { RollContext } from '../utils/rollEngine'

// Same pure-localStorage pattern as useCompareStore.ts.
// The Recent Rolls list and the pity system (soft/hard guaranteed rolls)
// have been removed - this store now only keeps `lastRolledCareerId`
// (needed so rollEngine.ts can still avoid repeating the same career twice
// in a row - that's part of the weighted-random logic itself, not a
// "history" feature) plus lifetime tallies for the stats panel and the
// first-visit tutorial flag.
interface RollState {
  lastRolledCareerId: number | null
  lifetimeTierCounts: Partial<Record<TierKey, number>>
  lifetimeCareerCounts: Record<number, number>
  lifetimeTotalRolls: number
  bestTier: TierKey | null
  hasSeenRollTutorial: boolean
  /** The career currently sitting open on the Roll a Job page, if any -
   * kept ONLY in memory (see the persist partialize below), so clicking
   * through to a career's own detail page and pressing Back still shows the
   * card you just rolled (and can still Add it to your Binder) instead of
   * resetting to the idle Roll button, since JobMarketRollPage's own
   * `result` state is just local React state that dies when the route
   * unmounts. Deliberately NOT persisted: a stale value would make a card
   * from a previous visit (or a previous day) pop up the next time Roll a
   * Job was opened. Only the id: JobMarketRollPage already has a proven way
   * to rebuild a full RollOutcome from just a career id (getOddsForCareer -
   * see its own "shared-link view" effect), so there's no need to duplicate
   * tier/weight/odds here too. */
  activeResultCareerId: number | null
  getRollContext: () => RollContext
  recordRoll: (careerId: number, tier: TierKey) => void
  setActiveResultCareerId: (careerId: number | null) => void
  resetStats: () => void
  dismissTutorial: () => void
}

function tierRank(tier: TierKey): number {
  return TIERS.findIndex((t) => t.key === tier)
}

const initialState = {
  lastRolledCareerId: null as number | null,
  lifetimeTierCounts: {} as Partial<Record<TierKey, number>>,
  lifetimeCareerCounts: {} as Record<number, number>,
  lifetimeTotalRolls: 0,
  bestTier: null as TierKey | null,
  hasSeenRollTutorial: false,
  activeResultCareerId: null as number | null,
}

export const useRollStore = create<RollState>()(
  persist(
    (set, get) => ({
      ...initialState,

      getRollContext: () => {
        const state = get()
        return {
          lastCareerId: state.lastRolledCareerId,
          lifetimeTierCounts: state.lifetimeTierCounts,
          lifetimeTotalRolls: state.lifetimeTotalRolls,
        }
      },

      recordRoll: (careerId, tier) => {
        const state = get()
        set({
          lastRolledCareerId: careerId,
          lifetimeTierCounts: {
            ...state.lifetimeTierCounts,
            [tier]: (state.lifetimeTierCounts[tier] ?? 0) + 1,
          },
          lifetimeCareerCounts: {
            ...state.lifetimeCareerCounts,
            [careerId]: (state.lifetimeCareerCounts[careerId] ?? 0) + 1,
          },
          lifetimeTotalRolls: state.lifetimeTotalRolls + 1,
          bestTier: state.bestTier === null || tierRank(tier) > tierRank(state.bestTier) ? tier : state.bestTier,
        })
      },

      resetStats: () =>
        set({
          lastRolledCareerId: null,
          lifetimeTierCounts: {},
          lifetimeCareerCounts: {},
          lifetimeTotalRolls: 0,
          bestTier: null,
        }),

      dismissTutorial: () => set({ hasSeenRollTutorial: true }),

      setActiveResultCareerId: (careerId) => set({ activeResultCareerId: careerId }),
    }),
    {
      name: 'pathscrawler-roll',
      // activeResultCareerId is intentionally left out - it's the card open
      // on the Roll page right now, only meaningful within this session.
      // Persisting it made a stale card resurface every time Roll a Job was
      // reopened. Everything else here is a lifetime tally or a one-time
      // flag that should survive a reload.
      partialize: (state) => ({
        lastRolledCareerId: state.lastRolledCareerId,
        lifetimeTierCounts: state.lifetimeTierCounts,
        lifetimeCareerCounts: state.lifetimeCareerCounts,
        lifetimeTotalRolls: state.lifetimeTotalRolls,
        bestTier: state.bestTier,
        hasSeenRollTutorial: state.hasSeenRollTutorial,
      }),
      // Bumped because the persisted shape changed (rollHistory and the
      // pity counters - rollsSinceEpicPlus/rollsSinceLegendaryPlus - were
      // removed). Without an explicit migrate, zustand/persist would merge
      // those stale fields from an old session's localStorage back onto
      // the new state shape; this rebuilds state from only the fields
      // that still exist, so old history/pity data is actually dropped
      // rather than just unused.
      version: 1,
      migrate: (persisted) => {
        const old = (persisted ?? {}) as Partial<RollState>
        return {
          ...initialState,
          lifetimeTierCounts: old.lifetimeTierCounts ?? {},
          lifetimeCareerCounts: old.lifetimeCareerCounts ?? {},
          lifetimeTotalRolls: old.lifetimeTotalRolls ?? 0,
          bestTier: old.bestTier ?? null,
          hasSeenRollTutorial: old.hasSeenRollTutorial ?? false,
        }
      },
    },
  ),
)
