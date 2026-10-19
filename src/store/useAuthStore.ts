import { create } from 'zustand'
import { isSupabaseConfigured, setRememberMe, supabase } from '../lib/supabaseClient'
import { isDisposableEmail } from '../utils/disposableEmailDomains'

// REAL AUTH NOW - this used to be a from-scratch mock (accounts/passwords
// hashed and stored directly in this browser's localStorage, no server at
// all). It's now a thin wrapper around Supabase Auth: the actual account
// list, password hashing, and session JWT all live server-side in the
// Supabase project (see .env.example for how this app is pointed at one),
// not in this file. This is what makes the leaderboard (useLeaderboardStore)
// genuinely global now - `currentUser.id` is a real, stable auth.users.id
// every device agrees on, not a per-browser crypto.randomUUID().
//
// One consequence worth knowing: any account created under the OLD mock
// system, and any Binder card / saved pathway stored against one of those
// old fake ids, is now orphaned - a real Supabase user gets a completely
// different id, so there's nothing to migrate onto. Same call made for
// every previous breaking storage change in this app (useBinderStore's
// v1->v2 migration, useRollStore's pity-system removal): dropped rather
// than guessing at how to carry stale data forward.
//
// SESSION, not LOCAL or SYNCED (see PERSISTENCE.md): no zustand/persist
// here at all, deliberately - Supabase's own client durably persists the
// real session and this store only mirrors it into reactive state.
//
// WHERE THE LOCAL-DATA MERGE LIVES: not here, despite this being the
// obvious-looking home for it. The account-scoped collections
// (useBinderStore, useSavedPathwaysStore) each own their own
// hydrateFromSupabase(), which unions local with remote and uploads the
// local-only half the first time it runs for an account; App.tsx fires all
// of them from one effect keyed on currentUser.id. Doing it from this file
// would mean useAuthStore importing the stores that already import IT,
// which is the circular dependency every one of them is careful to avoid
// (see each store's own currentUserId() comment). Keying on the user id
// also covers session restore on page load and account switching, not just
// the signIn() success path - three entry points, one effect.

export interface MockUser {
  id: string
  email: string
}

interface AuthResult {
  success: boolean
  error?: string
  /** true when signUp succeeded but Supabase is holding the account for
   * email confirmation - there's no session yet, so `currentUser` is still
   * null and the caller shouldn't navigate anywhere as if signed in. */
  needsEmailConfirmation?: boolean
}

interface AuthState {
  currentUser: MockUser | null
  isAuthenticated: boolean
  /** Alias for currentUser - some call sites (e.g. binder gating) read this name. */
  user: MockUser | null
  /** False until the very first getSession() round trip resolves - lets a
   * route guard (BinderAuthWall etc.) avoid a false "you're signed out"
   * flash while a real, valid session is still being restored from
   * Supabase's own storage on page load. */
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<AuthResult>
  /** `remember` defaults true (see supabaseClient.ts's own comment on why) -
   * checked = the session survives closing the browser; unchecked = it's
   * gone the moment the tab/browser closes. Has to be set BEFORE the actual
   * sign-in call below, not after - Supabase writes the session to storage
   * as part of signInWithPassword itself, so setting the flag afterward
   * would be too late for that very first write. */
  signIn: (email: string, password: string, remember?: boolean) => Promise<AuthResult>
  signOut: () => Promise<void>
  /** Sends the "click here to reset your password" email via Supabase - no
   * AuthResult needed the way signUp/signIn have one, since this never
   * signs anyone in or out, it just triggers an email. */
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>
  /** Only works with an active RECOVERY session - i.e. the visitor arrived
   * via the emailed reset link, which Supabase's client auto-exchanges into
   * a real (if short-lived) session on load (detectSessionInUrl, on by
   * default - see supabaseClient.ts). Called from ResetPasswordPage.tsx. */
  updatePassword: (newPassword: string) => Promise<AuthResult>
}

function toMockUser(user: { id: string; email?: string | null } | null | undefined): MockUser | null {
  if (!user) return null
  return { id: user.id, email: user.email ?? '' }
}

const NOT_CONFIGURED_ERROR = 'Sign-in is not set up yet - this app is missing its Supabase configuration.'

export const useAuthStore = create<AuthState>()((set) => {
  // Hydrate from whatever session Supabase's own persisted storage already
  // has (survives a refresh), then keep currentUser in lockstep with every
  // future auth event (sign in, sign out, token refresh, and - importantly -
  // a session restored on load) via onAuthStateChange, which fires once
  // immediately with the current state AND on every change after that. No
  // separate zustand/persist middleware here on purpose - Supabase's own
  // client already durably persists the real session; this store just
  // mirrors it into reactive app state.
  if (isSupabaseConfigured && supabase) {
    supabase.auth.onAuthStateChange((_event, session) => {
      const user = toMockUser(session?.user)
      set({ currentUser: user, user, isAuthenticated: user !== null, isLoading: false })
    })
  }

  return {
    currentUser: null,
    isAuthenticated: false,
    user: null,
    isLoading: isSupabaseConfigured,

    signUp: async (email, password) => {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: NOT_CONFIGURED_ERROR }
      const normalizedEmail = email.trim().toLowerCase()
      if (!normalizedEmail || !password) return { success: false, error: 'Enter an email and password.' }
      // 8, not Supabase's own platform-default 6 - raised per the
      // 2026-08-31 pentest report's recommendation, alongside enabling
      // leaked-password-protection (a Supabase dashboard-only toggle this
      // client can't flip). This is still just the UX-fast-path half of
      // that: the project's own server-side minimum-length policy is a
      // dashboard setting too, so raising it there is what actually makes
      // this unbypassable rather than only tightening the common case.
      if (password.length < 8) return { success: false, error: 'Password must be at least 8 characters.' }
      // UX-only fast path - the real, unbypassable block is the "before
      // user created" Postgres Auth Hook (schema.sql's
      // hook_reject_disposable_email), which Supabase Auth itself runs
      // server-side regardless of what this client does. This just saves a
      // round trip for the common case instead of leaving the disposable
      // check to only ever happen after signUp() is already called.
      if (isDisposableEmail(normalizedEmail)) {
        return { success: false, error: 'Please sign up with a permanent email address - disposable/temporary email addresses are not allowed.' }
      }

      // emailRedirectTo, explicitly - without it, Supabase builds the
      // confirmation link from the project's dashboard-configured Site URL
      // instead, regardless of where this app is actually running. Same
      // "use wherever we're actually running, not a fixed dashboard
      // default" fix as requestPasswordReset's own redirectTo below - a
      // signer-upper on the deployed site was getting a confirmation link
      // that pointed at whatever the dashboard's Site URL happened to be
      // (localhost, from local dev) instead of back to this deployment.
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      })
      if (error) return { success: false, error: error.message }

      // A session comes back immediately when the project has email
      // confirmation turned off; when it's on, Supabase creates the account
      // but withholds the session until the confirmation link is clicked -
      // that's a real, different outcome the UI needs to show differently
      // (not an error, but not "you're in" either).
      if (!data.session) {
        return { success: true, needsEmailConfirmation: true }
      }
      const user = toMockUser(data.session.user)
      set({ currentUser: user, user, isAuthenticated: true, isLoading: false })
      return { success: true }
    },

    signIn: async (email, password, remember = true) => {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: NOT_CONFIGURED_ERROR }
      setRememberMe(remember)
      const normalizedEmail = email.trim().toLowerCase()
      const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
      if (error) return { success: false, error: error.message }
      const user = toMockUser(data.user)
      set({ currentUser: user, user, isAuthenticated: true, isLoading: false })
      return { success: true }
    },

    signOut: async () => {
      if (!isSupabaseConfigured || !supabase) {
        set({ currentUser: null, user: null, isAuthenticated: false })
        return
      }
      await supabase.auth.signOut()
      set({ currentUser: null, user: null, isAuthenticated: false })
    },

    requestPasswordReset: async (email) => {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: NOT_CONFIGURED_ERROR }
      const normalizedEmail = email.trim().toLowerCase()
      if (!normalizedEmail) return { success: false, error: 'Enter your email.' }
      // redirectTo has to be an exact match against an entry in the
      // Supabase project's Authentication -> URL Configuration -> Redirect
      // URLs allowlist, or the emailed link silently fails to establish a
      // session - can't configure that from here (same limitation as every
      // other Supabase-dashboard-only setting this app has hit), so
      // ResetPasswordPage.tsx's own comment flags it for whoever sets this
      // project up. Always resolves success (even for an email with no
      // account) - Supabase itself does this deliberately, so this can't
      // be used to check which emails have an account.
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) return { success: false, error: error.message }
      return { success: true }
    },

    updatePassword: async (newPassword) => {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: NOT_CONFIGURED_ERROR }
      // 8, not 6 - same reasoning as signUp's own check above.
      if (newPassword.length < 8) return { success: false, error: 'Password must be at least 8 characters.' }
      const { data, error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) return { success: false, error: error.message }
      const user = toMockUser(data.user)
      set({ currentUser: user, user, isAuthenticated: user !== null, isLoading: false })
      return { success: true }
    },
  }
})
