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

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Supabase's own storage key, separate from every "pathscrawler-*"
        // zustand/persist key elsewhere in this app - this is the actual
        // session/JWT, not app state, so it gets its own namespace.
        storageKey: 'pathscrawler-supabase-auth',
      },
    })
  : null
