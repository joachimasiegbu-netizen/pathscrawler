import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Career } from '../data/demoCareers'
import type { TierKey } from '../utils/careerTiers'
import { useAuthStore } from './useAuthStore'
import { MAX_COMPARE_CAREERS } from './useCompareStore'

export interface BinderCard {
  /** Unique per copy (so duplicates of the same career are distinct entries). */
  id: string
  careerId: number
  title: string
  tier: TierKey
  salary: string
  dateRolled: number
  rollAttemptNumber: number
}

export const MAX_BINDER_SIZE = 200

export type AddCardResult = 'added' | 'duplicate' | 'full' | 'unauthenticated'

export type ToggleSelectionResult = 'selected' | 'deselected' | 'max-reached'

// This is a DIFFERENT feature from useCareerBoardStore ("My saved careers" -
// a plain bookmark list used on the Spotlight/Easiest Jobs/Highest Paying
// cards, no duplicates, no history). This store is specifically the Roll a
// Job trading-card collection: every copy of every roll you choose to keep
// is its own entry, duplicates included, capped at MAX_BINDER_SIZE per user.
//
// The Binder is account-gated (see BinderAuthWall / MyBinderPage), so its
// data is scoped per signed-in user rather than one shared localStorage
// blob: everything lives under `cardsByUser[userId]` in the single
// persisted record, keyed by useAuthStore's currentUser.id, which this
// store reads directly (one-way dependency - useAuthStore never imports
// this store back, so there's no circular-import risk). There's no backend
// yet, so "per account" still means "per browser" underneath, same
// prototype-auth caveat as useAuthStore itself - but the data is at least
// correctly partitioned per account rather than shared across every
// visitor of this browser, and every read/write no-ops while signed out
// rather than silently falling back to an anonymous pool.
function currentUserId(): string | null {
  return useAuthStore.getState().currentUser?.id ?? null
}

interface BinderState {
  // Reactive selectors need to read this map directly (see EMPTY_CARDS /
  // useMyBinderCards below) rather than through a method on the store - a
  // `cards()` function here wouldn't re-run when useAuthStore's
  // currentUser changes, since that's a *different* store and zustand only
  // re-invokes a store's own selectors on that store's own state changes.
  cardsByUser: Record<string, BinderCard[]>
  // Every BinderCard requires rollAttemptNumber/dateRolled, and addCard is
  // only ever called from RollResultCard's "Add to Binder" button - there is
  // no other write path into this store, so the Binder is exclusively
  // Roll a Job cards by construction, not by a filter applied at read time.
  addCard: (career: Career, tier: TierKey, rollAttemptNumber: number) => AddCardResult
  removeCard: (id: string) => void
  clearBinder: () => void

  // Google-Photos-style multi-select for the Binder grid, used to send 2-3
  // cards to the app's existing compare feature (useCompareStore/
  // ComparePage) - transient UI state, not part of the collection data
  // itself, so it's excluded from persistence (see partialize below).
  binderSelectionMode: boolean
  selectedBinderCards: number[]
  enterSelectionMode: () => void
  exitSelectionMode: () => void
  toggleBinderSelection: (careerId: number) => ToggleSelectionResult
}

export const useBinderStore = create<BinderState>()(
  persist(
    (set, get) => ({
      cardsByUser: {},

      addCard: (career, tier, rollAttemptNumber) => {
        const userId = currentUserId()
        if (!userId) return 'unauthenticated'
        const existing = get().cardsByUser[userId] ?? []
        if (existing.length >= MAX_BINDER_SIZE) return 'full'
        const isDuplicate = existing.some((card) => card.careerId === career.id)
        const newCard: BinderCard = {
          id: `${career.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          careerId: career.id,
          title: career.title,
          tier,
          salary: career.salary,
          dateRolled: Date.now(),
          rollAttemptNumber,
        }
        set({ cardsByUser: { ...get().cardsByUser, [userId]: [newCard, ...existing] } })
        return isDuplicate ? 'duplicate' : 'added'
      },

      removeCard: (id) => {
        const userId = currentUserId()
        if (!userId) return
        const existing = get().cardsByUser[userId] ?? []
        set({ cardsByUser: { ...get().cardsByUser, [userId]: existing.filter((card) => card.id !== id) } })
      },

      clearBinder: () => {
        const userId = currentUserId()
        if (!userId) return
        set({ cardsByUser: { ...get().cardsByUser, [userId]: [] } })
      },

      binderSelectionMode: false,
      selectedBinderCards: [],

      enterSelectionMode: () => set({ binderSelectionMode: true, selectedBinderCards: [] }),

      // Also the "Cancel" action - clears every selection and drops the
      // circles/dimming, not just the mode flag.
      exitSelectionMode: () => set({ binderSelectionMode: false, selectedBinderCards: [] }),

      toggleBinderSelection: (careerId) => {
        const { selectedBinderCards } = get()
        if (selectedBinderCards.includes(careerId)) {
          set({ selectedBinderCards: selectedBinderCards.filter((id) => id !== careerId) })
          return 'deselected'
        }
        if (selectedBinderCards.length >= MAX_COMPARE_CAREERS) {
          return 'max-reached'
        }
        set({ selectedBinderCards: [...selectedBinderCards, careerId] })
        return 'selected'
      },
    }),
    {
      // "pathscrawler-*" to match every other store's naming in this app
      // (useCareerBoardStore, useCompareStore, useRollStore, ...).
      name: 'pathscrawler-binder',
      version: 2,
      // v1 stored one flat `cards` array shared by every visitor to this
      // browser, from before the Binder was account-gated. That data isn't
      // attributable to any single account, so rather than guessing an
      // owner for it, it's dropped on upgrade - same call made for
      // useRollStore's pity-system removal earlier in this app's history.
      migrate: (_persisted, version) => {
        if (version < 2) return { cardsByUser: {} }
        return _persisted as BinderState
      },
      // Selection mode is a transient UI session, not collection data - if
      // it were persisted, reloading mid-selection would resurrect stale
      // gray cards/circles from a comparison that never happened.
      partialize: (state) => ({ cardsByUser: state.cardsByUser }),
    },
  ),
)

// Stable reference (not a fresh `[]` on every call) so components that are
// signed out, or whose account has no cards yet, don't re-render every time
// some unrelated selector runs - `?? []` inline would create a new array
// each call and defeat zustand's reference-equality render skip.
const EMPTY_CARDS: BinderCard[] = []

/**
 * Cards for whichever user is currently signed in. Subscribes to BOTH
 * useAuthStore (so switching accounts, or signing out, updates the result)
 * and useBinderStore (so adding/removing a card updates it) - a plain
 * selector on useBinderStore alone can't do this, since it only re-runs
 * when useBinderStore's own state changes, not when a completely separate
 * store's currentUser changes.
 */
export function useMyBinderCards(): BinderCard[] {
  const userId = useAuthStore((state) => state.currentUser?.id ?? null)
  return useBinderStore((state) => (userId ? (state.cardsByUser[userId] ?? EMPTY_CARDS) : EMPTY_CARDS))
}
