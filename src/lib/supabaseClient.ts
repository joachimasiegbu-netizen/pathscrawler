import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Real backend, finally - see .env.example for where these two values come
// from. isSupabaseConfigured lets every consumer (useAuthStore,
// useLeaderboardStore) degrade gracefully rather than crash at import time
// if someone clones this repo without setting up their own Supabase
// project - useAuthStore falls back to "nobody's signed in" and
// useLeaderboardStore falls back to an empty board, both with a console
// warning, instead of a blank white screen.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase is not configured (missing VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY) - auth and the leaderboard will not work until .env.local is set. See .env.example.',
  )
}

// "Remember me" (LoginPage.tsx) - a small, ALWAYS-in-localStorage flag
// (never the session itself) that decides which real storage the actual
// session tokens below get read from/written to: localStorage (survives
// closing the browser - "30-day persistent", bounded by the Supabase
// project's own refresh-token expiry, not literally hand-rolled here) when
// remembered, sessionStorage (gone the moment the tab/browser closes) when
// not. Defaults to remembered (`!== '0'`) so anyone who never touches the
// checkbox keeps the exact always-logged-in behavior this app already had
// before "Remember me" existed - unchecking it is the new, opt-in MORE
// restrictive behavior, not the other way around.
const REMEMBER_ME_KEY = 'pathscrawler-remember-me'
export function setRememberMe(remember: boolean): void {
  try {
    window.localStorage.setItem(REMEMBER_ME_KEY, remember ? '1' : '0')
  } catch {
    // localStorage unavailable (private mode, etc.) - falls through to the
    // default (remembered) read below every time; nothing else to do.
  }
}
function isRemembered(): boolean {
  try {
    return window.localStorage.getItem(REMEMBER_ME_KEY) !== '0'
  } catch {
    return true
  }
}

// Supabase's own `auth.storage` option wants this exact getItem/setItem/
// removeItem shape (it awaits them, so sync-or-async both work). Routes
// every read/write through whichever real storage the flag above currently
// picks, and always clears the OTHER one on write so a later "remember me"
// flip can't resurrect a stale session from whichever storage this session
// didn't use.
const rememberAwareStorage = {
  getItem: (key: string) => (isRemembered() ? window.localStorage : window.sessionStorage).getItem(key),
  setItem: (key: string, value: string) => {
    const target = isRemembered() ? window.localStorage : window.sessionStorage
    const other = isRemembered() ? window.sessionStorage : window.localStorage
    other.removeItem(key)
    target.setItem(key, value)
  },
  removeItem: (key: string) => {
    window.localStorage.removeItem(key)
    window.sessionStorage.removeItem(key)
  },
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: rememberAwareStorage,
        // Supabase's own storage key, separate from every "pathscrawler-*"
        // zustand/persist key elsewhere in this app - this is the actual
        // session/JWT, not app state, so it gets its own namespace.
        storageKey: 'pathscrawler-supabase-auth',
      },
    })
  : null
