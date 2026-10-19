import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Career } from '../data/demoCareers'
import type { TierKey } from '../utils/careerTiers'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
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

// This is a DIFFERENT feature from useSavedPathwaysStore ("My saved
// pathways" - a plain bookmark list used on Results/Search/Career Changer/
// Easiest Jobs/Highest Paying Jobs cards, no duplicates, no history). This
// store is specifically the Roll a Job trading-card collection: every copy
// of every roll you choose to keep is its own entry, duplicates included -
// MAX_BINDER_SIZE caps how many DISTINCT careers an account can hold, not
// the total entry count, so re-rolling (and re-saving) a career you already
// have never counts against it and never gets blocked (see addCard below).
//
// The Binder is account-gated (see BinderAuthWall / MyBinderPage), so its
// data is scoped per signed-in user rather than one shared localStorage
// blob: everything lives under `cardsByUser[userId]` in the single
// persisted record, keyed by useAuthStore's currentUser.id, which this
// store reads directly (one-way dependency - useAuthStore never imports
// this store back, so there's no circular-import risk). Every read/write
// no-ops while signed out rather than silently falling back to an anonymous
// pool.
//
// SYNCED (see the decision table in useCompareStore.ts). "Per account" used
// to still mean "per browser" underneath - clearing the cache, or opening
// the app on a different device, lost the whole collection. It is now a real
// Supabase table (`binder_cards`, supabase/schema.sql) with the same
// two-layer arrangement useUserProfileStore.ts uses:
//   - zustand/persist to localStorage -> instant, offline, per-device
//   - binder_cards rows               -> the source of truth across devices
// Writes go to both (the local set first, so the grid never waits on a round
// trip); hydrateFromSupabase pulls the account's real collection back on
// sign-in. Unlike the leaderboard tables, nobody but the owner can read
// these rows - the Binder is private, so its policies are owner-only.
function currentUserId(): string | null {
  return useAuthStore.getState().currentUser?.id ?? null
}

/** One row of `binder_cards`. snake_case on the wire, camelCase in the app -
 *  converted by the two mappers below rather than renaming the TS type. */
interface BinderCardRow {
  card_id: string
  career_id: number
  title: string
  tier: string
  salary: string
  date_rolled: string
  roll_attempt_number: number
}

function toRow(userId: string, card: BinderCard) {
  return {
    user_id: userId,
    card_id: card.id,
    career_id: card.careerId,
    title: card.title,
    tier: card.tier,
    salary: card.salary,
    date_rolled: new Date(card.dateRolled).toISOString(),
    roll_attempt_number: card.rollAttemptNumber,
  }
}

function fromRow(row: BinderCardRow): BinderCard {
  return {
    id: row.card_id,
    careerId: row.career_id,
    title: row.title,
    tier: row.tier as TierKey,
    salary: row.salary,
    dateRolled: Date.parse(row.date_rolled) || Date.now(),
    rollAttemptNumber: row.roll_attempt_number,
  }
}

/* The three write paths below are all fire-and-forget: they log on failure
   and never throw, exactly like syncProfile in useUserProfileStore.ts. A
   dropped sync leaves the local copy intact and correct for this device, and
   the next sign-in's merge (hydrateFromSupabase) pushes it up again - which
   is a far better failure mode than making "Add to Binder" fail, or block,
   because the network is down. */

/** Upserts, not inserts: re-sending a card already in the account is a
 *  conflict on (user_id, card_id), which is expected during the first-login
 *  merge rather than an error worth surfacing. */
async function pushCards(userId: string, cards: BinderCard[]): Promise<void> {
  if (!isSupabaseConfigured || !supabase || cards.length === 0) return
  const { error } = await supabase
    .from('binder_cards')
    .upsert(cards.map((card) => toRow(userId, card)), { onConflict: 'user_id,card_id' })
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to sync binder cards to Supabase:', error.message)
  }
}

async function deleteCardRow(userId: string, cardId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return
  const { error } = await supabase.from('binder_cards').delete().eq('user_id', userId).eq('card_id', cardId)
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to remove binder card from Supabase:', error.message)
  }
}

async function deleteAllCardRows(userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return
  const { error } = await supabase.from('binder_cards').delete().eq('user_id', userId)
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to clear binder in Supabase:', error.message)
  }
}

interface BinderState {
  // Reactive selectors need to read this map directly (see EMPTY_CARDS /
  // useMyBinderCards below) rather than through a method on the store - a
  // `cards()` function here wouldn't re-run when useAuthStore's
  // currentUser changes, since that's a *different* store and zustand only
  // re-invokes a store's own selectors on that store's own state changes.
  cardsByUser: Record<string, BinderCard[]>
  /** Accounts whose local-only cards have already been uploaded once (the
   * first-login merge below). Persisted, and the reason a card deleted on
   * another device doesn't come back from this device's stale mirror: before
   * an account is in here the merge is a union (nothing local is ever
   * dropped), after it the remote collection is authoritative. */
  mergedUserIds: string[]
  /** Set once hydrateFromSupabase has resolved for an account - lets a
   * consumer tell "no cards yet" apart from "not loaded yet", the same way
   * useUserProfileStore.hydratedUserId does. Not persisted. */
  hydratedUserId: string | null
  /** Pulls this account's real collection from Supabase and, the first time
   * it runs for an account, pushes up anything this browser has that the
   * account doesn't. Called from App.tsx on sign-in. */
  hydrateFromSupabase: () => Promise<void>
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
      mergedUserIds: [],
      hydratedUserId: null,

      hydrateFromSupabase: async () => {
        const userId = currentUserId()
        if (!userId) return
        if (!isSupabaseConfigured || !supabase) {
          set({ hydratedUserId: userId })
          return
        }
        const { data, error } = await supabase
          .from('binder_cards')
          .select('card_id, career_id, title, tier, salary, date_rolled, roll_attempt_number')
          .eq('user_id', userId)
          .order('date_rolled', { ascending: false })
        if (error) {
          // Leave the local mirror exactly as it is - it's this device's
          // whole collection until the next successful hydrate, and the
          // account stays out of mergedUserIds so its local-only cards still
          // get their upload attempt next time.
          // eslint-disable-next-line no-console
          console.error('Failed to load binder from Supabase:', error.message)
          set({ hydratedUserId: userId })
          return
        }

        const remote = (data ?? []).map((row) => fromRow(row as BinderCardRow))
        const local = get().cardsByUser[userId] ?? []
        const alreadyMerged = get().mergedUserIds.includes(userId)

        if (alreadyMerged) {
          // Remote wins: a card removed on another device has to stay
          // removed, and this account's local-only cards were uploaded the
          // first time round.
          set({
            cardsByUser: { ...get().cardsByUser, [userId]: remote },
            hydratedUserId: userId,
          })
          return
        }

        // FIRST LOGIN AFTER THIS STORE STARTED SYNCING (the "merge local data
        // into the account" step). Everything this browser holds for this
        // account predates the table, so a remote-wins read here would delete
        // a collection that was never backed up - which is the worst possible
        // moment to lose it. Union instead, newest first (the order the grid
        // renders), then push the local-only half up.
        const remoteIds = new Set(remote.map((card) => card.id))
        const localOnly = local.filter((card) => !remoteIds.has(card.id))
        const merged = [...remote, ...localOnly].sort((a, b) => b.dateRolled - a.dateRolled)
        set({
          cardsByUser: { ...get().cardsByUser, [userId]: merged },
          mergedUserIds: [...get().mergedUserIds, userId],
          hydratedUserId: userId,
        })
        void pushCards(userId, localOnly)
      },

      addCard: (career, tier, rollAttemptNumber) => {
        const userId = currentUserId()
        if (!userId) return 'unauthenticated'
        const existing = get().cardsByUser[userId] ?? []
        const isDuplicate = existing.some((card) => card.careerId === career.id)
        // MAX_BINDER_SIZE now caps DISTINCT careers, not total entries - a
        // duplicate (re-rolling a career already in the Binder) always goes
        // through regardless of how many total cards (duplicates included)
        // are already sitting there, per explicit request not to count
        // duplicates toward "full". Only a genuinely NEW career is checked
        // against the cap.
        if (!isDuplicate) {
          const uniqueCareerCount = new Set(existing.map((card) => card.careerId)).size
          if (uniqueCareerCount >= MAX_BINDER_SIZE) return 'full'
        }
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
        void pushCards(userId, [newCard])
        return isDuplicate ? 'duplicate' : 'added'
      },

      removeCard: (id) => {
        const userId = currentUserId()
        if (!userId) return
        const existing = get().cardsByUser[userId] ?? []
        set({ cardsByUser: { ...get().cardsByUser, [userId]: existing.filter((card) => card.id !== id) } })
        void deleteCardRow(userId, id)
      },

      clearBinder: () => {
        const userId = currentUserId()
        if (!userId) return
        set({ cardsByUser: { ...get().cardsByUser, [userId]: [] } })
        void deleteAllCardRows(userId)
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
      // (useSavedPathwaysStore, useCompareStore, useRollStore, ...).
      name: 'pathscrawler-binder',
      version: 3,
      // v1 stored one flat `cards` array shared by every visitor to this
      // browser, from before the Binder was account-gated. That data isn't
      // attributable to any single account, so rather than guessing an
      // owner for it, it's dropped on upgrade - same call made for
      // useRollStore's pity-system removal earlier in this app's history.
      // v2 -> v3: adds mergedUserIds for the Supabase sync. Empty for
      // everyone already persisted, which is exactly right - no existing
      // account has had its local cards uploaded yet, so every one of them
      // should get the union merge on its next sign-in rather than a
      // remote-wins read against an empty table.
      migrate: (_persisted, version) => {
        if (version < 2) return { cardsByUser: {}, mergedUserIds: [] }
        const state = (_persisted ?? { cardsByUser: {} }) as BinderState
        if (version < 3) return { ...state, mergedUserIds: [] }
        return state
      },
      // Selection mode is a transient UI session, not collection data - if
      // it were persisted, reloading mid-selection would resurrect stale
      // gray cards/circles from a comparison that never happened.
      // hydratedUserId is deliberately out too: it describes this page load's
      // progress, and a persisted `true` would claim a sync that hasn't
      // happened yet on the next one.
      partialize: (state) => ({ cardsByUser: state.cardsByUser, mergedUserIds: state.mergedUserIds }),
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
