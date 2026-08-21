import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthStore } from './useAuthStore'

// Replaces the old useCareerBoardStore ("My saved careers") - same one-click
// bookmark concept, but now backing "My saved pathways" (MyPathwaysPage,
// reached from the account menu), so it needed the same account-gating
// useBinderStore already has: data scoped per signed-in user under
// `savedByUser[userId]` rather than one shared anonymous localStorage blob,
// and every write no-ops (returns 'unauthenticated') while signed out
// instead of silently saving to a pool nobody's account can see later.
function currentUserId(): string | null {
  return useAuthStore.getState().currentUser?.id ?? null
}

export interface SavedPathwayEntry {
  careerId: number
  savedAt: number
}

export type TogglePathwayResult = 'added' | 'removed' | 'unauthenticated'

interface SavedPathwaysState {
  savedByUser: Record<string, SavedPathwayEntry[]>
  toggle: (careerId: number) => TogglePathwayResult
  remove: (careerId: number) => void
}

export const useSavedPathwaysStore = create<SavedPathwaysState>()(
  persist(
    (set, get) => ({
      savedByUser: {},

      toggle: (careerId) => {
        const userId = currentUserId()
        if (!userId) return 'unauthenticated'
        const existing = get().savedByUser[userId] ?? []
        const isSaved = existing.some((entry) => entry.careerId === careerId)
        const next = isSaved
          ? existing.filter((entry) => entry.careerId !== careerId)
          : [{ careerId, savedAt: Date.now() }, ...existing]
        set({ savedByUser: { ...get().savedByUser, [userId]: next } })
        return isSaved ? 'removed' : 'added'
      },

      remove: (careerId) => {
        const userId = currentUserId()
        if (!userId) return
        const existing = get().savedByUser[userId] ?? []
        set({ savedByUser: { ...get().savedByUser, [userId]: existing.filter((entry) => entry.careerId !== careerId) } })
      },
    }),
    {
      name: 'pathscrawler-saved-pathways',
      version: 2,
      // v1 (useCareerBoardStore) stored one flat `careerIds` array shared by
      // every visitor to this browser, from before this was account-gated.
      // Not attributable to any single account, so it's dropped on upgrade -
      // same call useBinderStore made for its own v1 -> v2 migration.
      migrate: (_persisted, version) => {
        if (version < 2) return { savedByUser: {} }
        return _persisted as SavedPathwaysState
      },
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
