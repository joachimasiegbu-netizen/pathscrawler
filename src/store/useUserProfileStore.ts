import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import { isFallbackName, randomFallbackName } from '../utils/usernameValidation'
import { useAuthStore } from './useAuthStore'

// Account-scoped profile: the player's chosen display name and which one of
// their unlocked titles (useTitleProgressStore.ts / titles.ts) they've
// equipped to show next to it. Same scoping pattern as useTitleProgressStore
// (profilesByUser keyed on the real Supabase auth.users.id) so switching or
// signing out accounts swaps the visible profile cleanly.
//
// Two-layer storage, mirroring recordRoll in useLeaderboardStore.ts:
//   - zustand/persist to localStorage      -> instant, offline, per-device
//   - upsert into Supabase's `profiles`    -> global, so OTHER players see
//                                             this name/title on the board
// The leaderboard read (useLeaderboardStore.ts) joins `profiles` in by
// user_id; the local copy here is the fast path for the signed-in player's
// own name everywhere else in the app.
//
// Unlocked-title state is NOT duplicated here - it already lives in
// useTitleProgressStore.ts with its own one-way-latch logic and migrations.
// This store only records which unlocked title is *equipped*; whether a
// given title is actually unlocked is still asked of titles.ts.

export interface UserProfile {
  username: string
  /** Title id (titles.ts), or null for "no title shown". */
  equippedTitleId: string | null
  /** True when `username` was auto-assigned because the player skipped the
   * setup modal - drives the persistent "Set your name" banner. */
  isFallbackName: boolean
  /** epoch ms - last local change, also written to profiles.updated_at. */
  updatedAt: number
}

interface ProfileRow {
  user_id: string
  email: string
  username: string
  equipped_title_id: string | null
  is_fallback_name: boolean
  updated_at: string
}

function currentUser(): { id: string; email: string } | null {
  const user = useAuthStore.getState().currentUser
  return user ? { id: user.id, email: user.email } : null
}

/** Fire-and-forget upsert to Supabase. No-ops (and logs, never throws) while
 * signed out or unconfigured - identical contract to recordRoll. */
async function syncProfile(userId: string, email: string, profile: UserProfile): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return
  const { error } = await supabase.from('profiles').upsert(
    {
      user_id: userId,
      email,
      username: profile.username,
      equipped_title_id: profile.equippedTitleId,
      is_fallback_name: profile.isFallbackName,
      updated_at: new Date(profile.updatedAt).toISOString(),
    },
    { onConflict: 'user_id' },
  )
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to sync profile to Supabase:', error.message)
  }
}

/** Case-insensitive uniqueness check against `profiles`. Returns false
 * (i.e. "not taken, go ahead") whenever Supabase can't answer - a missing
 * backend shouldn't block a player from naming themselves locally. Excludes
 * the caller's own row so re-confirming your existing name isn't a clash. */
export async function isUsernameTaken(name: string, selfUserId: string | null): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false
  // .ilike with no % wildcards is a case-insensitive exact match.
  const { data, error } = await supabase.from('profiles').select('user_id').ilike('username', name).limit(2)
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Username availability check failed:', error.message)
    return false
  }
  return (data ?? []).some((row) => row.user_id !== selfUserId)
}

interface UserProfileState {
  profilesByUser: Record<string, UserProfile>
  /** True once hydrateFromSupabase has resolved for the current session -
   * App.tsx waits on this before deciding whether to show the setup modal,
   * so a returning player with a name on another device doesn't get the
   * modal flashed at them. */
  hydratedUserId: string | null
  setUsername: (name: string) => void
  assignFallbackName: () => void
  equipTitle: (titleId: string | null) => void
  hydrateFromSupabase: () => Promise<void>
  getProfile: () => UserProfile | null
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      profilesByUser: {},
      hydratedUserId: null,

      setUsername: (name) => {
        const user = currentUser()
        if (!user) return
        const existing = get().profilesByUser[user.id]
        const profile: UserProfile = {
          username: name,
          // Brand-new profile -> equipped with the freebie Trainee badge by
          // default (backlog spec). An existing profile keeps whatever it
          // had, including a deliberate null ("None").
          equippedTitleId: existing ? existing.equippedTitleId : 'trainee',
          isFallbackName: false,
          updatedAt: Date.now(),
        }
        set({ profilesByUser: { ...get().profilesByUser, [user.id]: profile } })
        void syncProfile(user.id, user.email, profile)
      },

      assignFallbackName: () => {
        const user = currentUser()
        if (!user) return
        const existing = get().profilesByUser[user.id]
        // Already has a real (or even a fallback) name - don't clobber it.
        if (existing?.username) return
        const profile: UserProfile = {
          username: randomFallbackName(),
          equippedTitleId: 'trainee',
          isFallbackName: true,
          updatedAt: Date.now(),
        }
        set({ profilesByUser: { ...get().profilesByUser, [user.id]: profile } })
        void syncProfile(user.id, user.email, profile)
      },

      equipTitle: (titleId) => {
        const user = currentUser()
        if (!user) return
        const existing = get().profilesByUser[user.id]
        if (!existing) return
        if (existing.equippedTitleId === titleId) return
        const profile: UserProfile = { ...existing, equippedTitleId: titleId, updatedAt: Date.now() }
        set({ profilesByUser: { ...get().profilesByUser, [user.id]: profile } })
        void syncProfile(user.id, user.email, profile)
      },

      hydrateFromSupabase: async () => {
        const user = currentUser()
        if (!user) return
        if (!isSupabaseConfigured || !supabase) {
          set({ hydratedUserId: user.id })
          return
        }
        const { data, error } = await supabase
          .from('profiles')
          .select('user_id, email, username, equipped_title_id, is_fallback_name, updated_at')
          .eq('user_id', user.id)
          .maybeSingle()
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to load profile from Supabase:', error.message)
          set({ hydratedUserId: user.id })
          return
        }
        const row = data as ProfileRow | null
        if (row?.username) {
          const remote: UserProfile = {
            username: row.username,
            equippedTitleId: row.equipped_title_id,
            isFallbackName: row.is_fallback_name ?? isFallbackName(row.username),
            updatedAt: Date.parse(row.updated_at) || Date.now(),
          }
          set({
            profilesByUser: { ...get().profilesByUser, [user.id]: remote },
            hydratedUserId: user.id,
          })
          return
        }
        // No remote row yet. If this device has a local name, push it up so
        // the two agree; otherwise leave it unset so App.tsx shows the modal.
        const local = get().profilesByUser[user.id]
        if (local?.username) void syncProfile(user.id, user.email, local)
        set({ hydratedUserId: user.id })
      },

      getProfile: () => {
        const user = currentUser()
        return user ? (get().profilesByUser[user.id] ?? null) : null
      },
    }),
    {
      name: 'pathscrawler-user-profile',
      version: 1,
      partialize: (state) => ({ profilesByUser: state.profilesByUser }),
    },
  ),
)

const EMPTY_PROFILE: UserProfile | null = null

/** Reactive mirror of getProfile() - subscribes to both stores like
 * useMyTitleProgress() does, so signing in/out or switching accounts
 * re-renders consumers with the right profile. */
export function useMyUserProfile(): UserProfile | null {
  const userId = useAuthStore((state) => state.currentUser?.id ?? null)
  return useUserProfileStore((state) => (userId ? (state.profilesByUser[userId] ?? EMPTY_PROFILE) : EMPTY_PROFILE))
}
