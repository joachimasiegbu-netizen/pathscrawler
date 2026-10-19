import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import { useAuthStore } from './useAuthStore'

// Replaces the old useCareerBoardStore ("My saved careers") - same one-click
// bookmark concept, but now backing "My saved pathways" (MyPathwaysPage,
// reached from the account menu), so it needed the same account-gating
// useBinderStore already has: data scoped per signed-in user under
// `savedByUser[userId]` rather than one shared anonymous localStorage blob,
// and every write no-ops (returns 'unauthenticated') while signed out
// instead of silently saving to a pool nobody's account can see later.
//
// SYNCED (see the decision table in useCompareStore.ts), on exactly the
// arrangement useBinderStore.ts documents in full: localStorage mirror for
// the instant/offline path, `saved_pathways` rows (supabase/schema.sql) as
// the source of truth across devices, owner-only policies because a saved
// pathway is private. A pathway is the end product of the entire assessment
// flow, and it used to survive only as long as the browser cache did.
function currentUserId(): string | null {
  return useAuthStore.getState().currentUser?.id ?? null
}

/** One row of `saved_pathways`. */
interface SavedPathwayRow {
  career_id: number
  saved_at: string
}

/* Fire-and-forget, logging rather than throwing - same contract as
   useBinderStore's own write paths and syncProfile before them. */
async function pushSaved(userId: string, entries: SavedPathwayEntry[]): Promise<void> {
  if (!isSupabaseConfigured || !supabase || entries.length === 0) return
  const { error } = await supabase.from('saved_pathways').upsert(
    entries.map((entry) => ({
      user_id: userId,
      career_id: entry.careerId,
      saved_at: new Date(entry.savedAt).toISOString(),
    })),
    { onConflict: 'user_id,career_id' },
  )
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to sync saved pathways to Supabase:', error.message)
  }
}

async function deleteSavedRow(userId: string, careerId: number): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return
  const { error } = await supabase.from('saved_pathways').delete().eq('user_id', userId).eq('career_id', careerId)
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to remove saved pathway from Supabase:', error.message)
  }
}

export interface SavedPathwayEntry {
  careerId: number
  savedAt: number
}

export type TogglePathwayResult = 'added' | 'removed' | 'unauthenticated'

interface SavedPathwaysState {
  savedByUser: Record<string, SavedPathwayEntry[]>
  /** Accounts whose local-only bookmarks have already been uploaded once -
   * same first-login-merge latch useBinderStore.mergedUserIds documents. */
  mergedUserIds: string[]
  /** Set once hydrateFromSupabase resolves for an account. Not persisted. */
  hydratedUserId: string | null
  hydrateFromSupabase: () => Promise<void>
  toggle: (careerId: number) => TogglePathwayResult
  remove: (careerId: number) => void
}

export const useSavedPathwaysStore = create<SavedPathwaysState>()(
  persist(
    (set, get) => ({
      savedByUser: {},
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
          .from('saved_pathways')
          .select('career_id, saved_at')
          .eq('user_id', userId)
          .order('saved_at', { ascending: false })
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to load saved pathways from Supabase:', error.message)
          set({ hydratedUserId: userId })
          return
        }

        const remote: SavedPathwayEntry[] = (data ?? []).map((row) => {
          const typed = row as SavedPathwayRow
          return { careerId: typed.career_id, savedAt: Date.parse(typed.saved_at) || Date.now() }
        })
        const local = get().savedByUser[userId] ?? []

        if (get().mergedUserIds.includes(userId)) {
          // Remote wins once this account's local-only rows have been
          // uploaded - an unsave on another device has to stick.
          set({ savedByUser: { ...get().savedByUser, [userId]: remote }, hydratedUserId: userId })
          return
        }

        // First login after this store started syncing: union, so bookmarks
        // made before the table existed are uploaded instead of wiped.
        const remoteIds = new Set(remote.map((entry) => entry.careerId))
        const localOnly = local.filter((entry) => !remoteIds.has(entry.careerId))
        const merged = [...remote, ...localOnly].sort((a, b) => b.savedAt - a.savedAt)
        set({
          savedByUser: { ...get().savedByUser, [userId]: merged },
          mergedUserIds: [...get().mergedUserIds, userId],
          hydratedUserId: userId,
        })
        void pushSaved(userId, localOnly)
      },

      toggle: (careerId) => {
        const userId = currentUserId()
        if (!userId) return 'unauthenticated'
        const existing = get().savedByUser[userId] ?? []
        const isSaved = existing.some((entry) => entry.careerId === careerId)
        const entry: SavedPathwayEntry = { careerId, savedAt: Date.now() }
        const next = isSaved ? existing.filter((e) => e.careerId !== careerId) : [entry, ...existing]
        set({ savedByUser: { ...get().savedByUser, [userId]: next } })
        if (isSaved) void deleteSavedRow(userId, careerId)
        else void pushSaved(userId, [entry])
        return isSaved ? 'removed' : 'added'
      },

      remove: (careerId) => {
        const userId = currentUserId()
        if (!userId) return
        const existing = get().savedByUser[userId] ?? []
        set({ savedByUser: { ...get().savedByUser, [userId]: existing.filter((entry) => entry.careerId !== careerId) } })
        void deleteSavedRow(userId, careerId)
      },
    }),
    {
      name: 'pathscrawler-saved-pathways',
      version: 3,
      // v1 (useCareerBoardStore) stored one flat `careerIds` array shared by
      // every visitor to this browser, from before this was account-gated.
      // Not attributable to any single account, so it's dropped on upgrade -
      // same call useBinderStore made for its own v1 -> v2 migration.
      // v2 -> v3: adds mergedUserIds for the Supabase sync - empty for
      // everyone already persisted, so every existing account gets the union
      // merge on its next sign-in. Same reasoning as useBinderStore's v3.
      migrate: (_persisted, version) => {
        if (version < 2) return { savedByUser: {}, mergedUserIds: [] }
        const state = (_persisted ?? { savedByUser: {} }) as SavedPathwaysState
        if (version < 3) return { ...state, mergedUserIds: [] }
        return state
      },
      // hydratedUserId describes this page load, not the data - persisting it
      // would claim a sync that hasn't happened yet on the next load.
      partialize: (state) => ({ savedByUser: state.savedByUser, mergedUserIds: state.mergedUserIds }),
    },
  ),
)

// Stable empty reference so a signed-out visitor (or a signed-in user with
// nothing saved yet) doesn't get a fresh `[]` every render and defeat
// zustand's reference-equality render skip.
const EMPTY_SAVED: SavedPathwayEntry[] = []

/**
 * Saved pathways for whichever user is currently signed in. Subscribes to
 * BOTH useAuthStore (so signing in/out or switching accounts updates the
 * result) and useSavedPathwaysStore (so saving/removing updates it) - same
 * two-store-subscription reasoning as useMyBinderCards.
 */
export function useMySavedPathways(): SavedPathwayEntry[] {
  const userId = useAuthStore((state) => state.currentUser?.id ?? null)
  return useSavedPathwaysStore((state) => (userId ? (state.savedByUser[userId] ?? EMPTY_SAVED) : EMPTY_SAVED))
}

export function useIsPathwaySaved(careerId: number): boolean {
  const userId = useAuthStore((state) => state.currentUser?.id ?? null)
  return useSavedPathwaysStore((state) =>
    userId ? (state.savedByUser[userId] ?? EMPTY_SAVED).some((entry) => entry.careerId === careerId) : false,
  )
}
