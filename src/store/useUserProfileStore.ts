import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import { reportError } from '../utils/reportError'
import { isFallbackName, randomFallbackName } from '../utils/usernameValidation'
import { useAuthStore } from './useAuthStore'

// Account-scoped profile: the player's chosen display name and which one of
// their unlocked titles (useTitleProgressStore.ts / titles.ts) they've
// equipped to show next to it. Same scoping pattern as useTitleProgressStore
// (profilesByUser keyed on the real Supabase auth.users.id) so switching or
// signing out accounts swaps the visible profile cleanly.
//
// SYNCED (see PERSISTENCE.md): a name and equipped title are how OTHER
// players see you on the leaderboard, so they're global by definition - this
// store is the pattern the binder and saved pathways were later built on.
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
  /** Graduate title's reward (titles.ts) - a custom, up to 120-char
   * "yearbook quote" shown under this player's name on the leaderboard.
   * null until they set one; the editor (ProfilePage.tsx) only shows once
   * Graduate is actually unlocked, but nothing here enforces that itself -
   * same trust boundary as username, backstopped by the same server-side
   * check constraint (schema.sql) for length. */
  graduationQuote: string | null
  /** epoch ms of the last time setUsername actually applied a change - null
   * until the player has ever set a real name (assignFallbackName never
   * touches this, so skipping setup doesn't start the clock; the FIRST real
   * name a player picks doesn't either, since there's nothing to compare
   * against yet - only a genuine second-or-later change does). Drives the
   * once-every-7-days rate limit (USERNAME_CHANGE_COOLDOWN_MS below). Client-
   * side only, same trust model as the rest of this store - there's no
   * server-side trigger enforcing it, just the UI refusing to offer a
   * change during the cooldown. */
  usernameChangedAt: number | null
  /** epoch ms - last local change, also written to profiles.updated_at. */
  updatedAt: number
}

interface ProfileRow {
  user_id: string
  email: string
  username: string
  equipped_title_id: string | null
  is_fallback_name: boolean
  graduation_quote: string | null
  username_changed_at: string | null
  updated_at: string
}

/** How often a player is allowed to change their username - explicit
 * request. Exported so the UI (UsernameModal.tsx) can compute and display
 * the remaining cooldown up front, not just discover it after a rejected
 * submit. */
export const USERNAME_CHANGE_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000

/** 0 when a change is allowed right now, otherwise how many ms remain. */
export function getUsernameCooldownRemainingMs(profile: UserProfile | null | undefined): number {
  if (!profile?.usernameChangedAt) return 0
  return Math.max(0, USERNAME_CHANGE_COOLDOWN_MS - (Date.now() - profile.usernameChangedAt))
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
      graduation_quote: profile.graduationQuote,
      username_changed_at: profile.usernameChangedAt === null ? null : new Date(profile.usernameChangedAt).toISOString(),
      updated_at: new Date(profile.updatedAt).toISOString(),
    },
    { onConflict: 'user_id' },
  )
  if (error) {
    reportError(error, { where: 'userProfile.sync', extra: { userId } })
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
    reportError(error, { where: 'userProfile.isUsernameTaken' })
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
  /** Why the last hydrate failed, or null if it didn't. ProfilePage needs
   * this to tell "no name set yet" apart from "we could not read your
   * profile" - without it a failed load renders the account's email as the
   * display name and an empty title grid, which reads as "you have earned
   * nothing", the one thing it definitely does not mean. Not persisted. */
  loadError: string | null
  /** Returns false (and leaves the profile untouched) if a change isn't
   * allowed yet - either not signed in, or still within
   * USERNAME_CHANGE_COOLDOWN_MS of the last real change. The UI should
   * check getUsernameCooldownRemainingMs() before even offering the form,
   * this is the backstop for calling it anyway. */
  setUsername: (name: string) => boolean
  assignFallbackName: () => void
  equipTitle: (titleId: string | null) => void
  /** Graduate title's reward - null clears it back to "no quote shown". No
   * length/unlock check here (ProfilePage.tsx's editor already caps input
   * at 120 chars and only renders once Graduate is unlocked); the server-
   * side check constraint (schema.sql) is the real backstop, same trust
   * model as setUsername relying on usernameValidation.ts client-side plus
   * profiles_username_format server-side. */
  setGraduationQuote: (quote: string | null) => void
  hydrateFromSupabase: () => Promise<void>
  getProfile: () => UserProfile | null
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      profilesByUser: {},
      hydratedUserId: null,
      loadError: null,

      setUsername: (name) => {
        const user = currentUser()
        if (!user) return false
        const existing = get().profilesByUser[user.id]
        // Once-every-7-days rate limit - explicit request. Only a genuine
        // prior CHANGE starts the clock (see usernameChangedAt's own
        // comment), so this only ever blocks a second-or-later change, never
        // someone's first real name.
        if (getUsernameCooldownRemainingMs(existing) > 0) return false
        const profile: UserProfile = {
          username: name,
          // Brand-new profile -> equipped with the freebie Trainee badge by
          // default (backlog spec). An existing profile keeps whatever it
          // had, including a deliberate null ("None").
          equippedTitleId: existing ? existing.equippedTitleId : 'trainee',
          isFallbackName: false,
          graduationQuote: existing ? existing.graduationQuote : null,
          usernameChangedAt: Date.now(),
          updatedAt: Date.now(),
        }
        set({ profilesByUser: { ...get().profilesByUser, [user.id]: profile } })
        void syncProfile(user.id, user.email, profile)
        return true
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
          graduationQuote: null,
          // Skipping setup isn't a "change" - doesn't start the cooldown.
          usernameChangedAt: null,
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

      setGraduationQuote: (quote) => {
        const user = currentUser()
        if (!user) return
        const existing = get().profilesByUser[user.id]
        if (!existing) return
        const trimmed = quote?.trim() || null
        if (existing.graduationQuote === trimmed) return
        const profile: UserProfile = { ...existing, graduationQuote: trimmed, updatedAt: Date.now() }
        set({ profilesByUser: { ...get().profilesByUser, [user.id]: profile } })
        void syncProfile(user.id, user.email, profile)
      },

      hydrateFromSupabase: async () => {
        const user = currentUser()
        if (!user) return
        if (!isSupabaseConfigured || !supabase) {
          set({ hydratedUserId: user.id, loadError: null })
          return
        }
        // Clear any previous failure so a retry doesn't render the old banner
        // under the new attempt.
        set({ loadError: null })
        const { data, error } = await supabase
          .from('profiles')
          .select('user_id, email, username, equipped_title_id, is_fallback_name, graduation_quote, username_changed_at, updated_at')
          .eq('user_id', user.id)
          .maybeSingle()
        if (error) {
          reportError(error, { where: 'userProfile.hydrate', extra: { userId: user.id } })
          set({
            hydratedUserId: user.id,
            loadError: "We couldn't load your profile just now.",
          })
          return
        }
        const row = data as ProfileRow | null
        if (row?.username) {
          const remote: UserProfile = {
            username: row.username,
            equippedTitleId: row.equipped_title_id,
            isFallbackName: row.is_fallback_name ?? isFallbackName(row.username),
            graduationQuote: row.graduation_quote ?? null,
            usernameChangedAt: row.username_changed_at ? Date.parse(row.username_changed_at) : null,
            updatedAt: Date.parse(row.updated_at) || Date.now(),
          }
          set({
            profilesByUser: { ...get().profilesByUser, [user.id]: remote },
            hydratedUserId: user.id,
            loadError: null,
          })
          return
        }
        // No remote row yet. If this device has a local name, push it up so
        // the two agree; otherwise leave it unset so App.tsx shows the modal.
        const local = get().profilesByUser[user.id]
        if (local?.username) void syncProfile(user.id, user.email, local)
        set({ hydratedUserId: user.id, loadError: null })
      },

      getProfile: () => {
        const user = currentUser()
        return user ? (get().profilesByUser[user.id] ?? null) : null
      },
    }),
    {
      name: 'pathscrawler-user-profile',
      // v1 -> v2: adds graduationQuote (Graduate title's reward, titles.ts)
      // - plain additive default (null) for every already-persisted
      // profile, same pattern useTitleProgressStore.ts's own version bumps
      // use. hydrateFromSupabase overwrites this with the real remote value
      // on next load anyway; the migration just keeps the LOCAL copy's
      // shape/types honest (`string | null`, never `undefined`) in the
      // meantime.
      // v2 -> v3: adds usernameChangedAt (once-a-week rename limit) - null
      // for everyone already persisted, same reasoning: nobody's next
      // change should be blocked by a cooldown that didn't exist yet when
      // they last changed their name.
      version: 3,
      migrate: (persisted, version) => {
        const state = (persisted ?? { profilesByUser: {} }) as { profilesByUser: Record<string, UserProfile> }
        if (version < 2) {
          state.profilesByUser = Object.fromEntries(
            Object.entries(state.profilesByUser).map(([userId, profile]) => [
              userId,
              { ...profile, graduationQuote: profile.graduationQuote ?? null },
            ]),
          )
        }
        if (version < 3) {
          state.profilesByUser = Object.fromEntries(
            Object.entries(state.profilesByUser).map(([userId, profile]) => [
              userId,
              { ...profile, usernameChangedAt: profile.usernameChangedAt ?? null },
            ]),
          )
        }
        return state
      },
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
