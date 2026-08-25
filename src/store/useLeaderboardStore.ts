import { useEffect, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Career } from '../data/demoCareers'
import { TIER_POINTS, type TierKey } from '../utils/careerTiers'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import { useAuthStore } from './useAuthStore'

// GLOBAL NOW - this used to be a per-browser localStorage tally (every
// account's rolls only ever visible on the one browser they signed in on).
// It's real Supabase data now: every roll a signed-in player makes is
// inserted as its own row into the `rolls` table, and a database trigger
// (see supabase/schema.sql) maintains one summary row per player in
// `user_best_cards` - their top 4 rolls by points, the score those sum to,
// their lifetime roll count, and their best tier ever. The client never
// computes any of that itself; it only ever appends raw roll events and
// reads the already-aggregated leaderboard back.
//
// RLS on both tables (see the same schema file) means: anyone can READ the
// leaderboard, signed in or not (that's the point of a leaderboard), but a
// player can only ever INSERT rolls under their own account - nobody can
// write a fake score for someone else.

/** How many of a player's best rolls make up their score - "your top 4". */
export const LEADERBOARD_TOP_N = 4

export interface LeaderboardCard {
  careerId: number
  title: string
  tier: TierKey
  points: number
  rolledAt: string
}

export interface LeaderboardEntry {
  userId: string
  email: string
  score: number
  topRolls: LeaderboardCard[]
  totalRolls: number
  bestTier: TierKey | null
}

/** No-ops (and logs, not throws) while signed out or unconfigured - a roll
 * made signed-out never counts toward the leaderboard, same as before. */
export async function recordRoll(career: Career, tier: TierKey): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return
  const user = useAuthStore.getState().currentUser
  if (!user) return

  const { error } = await supabase.from('rolls').insert({
    user_id: user.id,
    email: user.email,
    career_id: career.id,
    title: career.title,
    tier,
    points: TIER_POINTS[tier],
  })
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to record roll for the leaderboard:', error.message)
  }
}

/** Same shape as recordRoll above - no-ops while signed out/unconfigured,
 * fire-and-forget. Called once per title the moment it unlocks (see
 * RollStandingPanel.tsx's sync effect) so titles count toward the
 * leaderboard score globally, not just in this browser's own local
 * useTitleProgressStore. A duplicate insert (23505 - the primary key on
 * (user_id, title_id), schema.sql) is expected and harmless, not logged -
 * it just means this exact unlock was already recorded, e.g. re-detected
 * on a second device or after a local state migration. */
export async function recordTitleUnlock(titleId: string, points: number): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return
  const user = useAuthStore.getState().currentUser
  if (!user) return

  const { error } = await supabase.from('title_unlocks').insert({
    user_id: user.id,
    email: user.email,
    title_id: titleId,
    points,
  })
  if (error && error.code !== '23505') {
    // eslint-disable-next-line no-console
    console.error('Failed to record title unlock for the leaderboard:', error.message)
  }
}

interface UserBestCardsRow {
  user_id: string
  email: string
  score: number
  top_cards: LeaderboardCard[] | null
  total_rolls: number
  best_tier: TierKey | null
}

function rowToEntry(row: UserBestCardsRow): LeaderboardEntry {
  return {
    userId: row.user_id,
    email: row.email,
    score: row.score,
    topRolls: row.top_cards ?? [],
    totalRolls: row.total_rolls,
    bestTier: row.best_tier,
  }
}

// Ties (equal score) break by comparing each player's best roll, then
// second-best, then third... before falling back to total rolls made - the
// database query already sorts by score, this just refines exact tie order
// client-side using each row's already-aggregated top_cards.
function compareEntries(a: LeaderboardEntry, b: LeaderboardEntry): number {
  if (b.score !== a.score) return b.score - a.score
  for (let i = 0; i < LEADERBOARD_TOP_N; i += 1) {
    const diff = (b.topRolls[i]?.points ?? 0) - (a.topRolls[i]?.points ?? 0)
    if (diff !== 0) return diff
  }
  return b.totalRolls - a.totalRolls
}

export interface LeaderboardResult {
  entries: LeaderboardEntry[]
  loading: boolean
}

// Module-level shared subscription, not one per component instance - was
// one `useEffect` per call to useLeaderboardEntries(), each opening its OWN
// `client.channel('leaderboard-user-best-cards')` and calling `.subscribe()`
// on it. That was fine while only ever ONE component used this hook at a
// time (RollStatsPanel on Roll a Job, or LeaderboardPage) - it broke the
// moment RollStandingPanel.tsx started calling it too and got mounted
// globally (App.tsx's header, present on every page): Supabase's client
// dedupes `.channel(name)` calls by name onto the SAME underlying channel
// object, so the second simultaneously-mounted caller's `.subscribe()`
// threw "cannot add postgres_changes callbacks... after subscribe()" -
// uncaught, no error boundary in this app, so it took down the entire React
// tree (confirmed via the exact browser console trace, not guessed - the
// crash was inside RollStatsPanel specifically, the second of the two
// simultaneously-mounted callers on the Roll a Job page).
//
// Reference-counted instead: the real channel + fetch only happen once, for
// however many components are actually using this hook at any moment: the
// first mount opens it, the last unmount closes it, everyone in between
// just reads the same shared, already-fetched data and re-renders via a
// tiny local listener set (no separate store/library needed for this).
let sharedEntries: LeaderboardEntry[] = []
let sharedLoading = isSupabaseConfigured
let sharedChannel: RealtimeChannel | null = null
let subscriberCount = 0
const listeners = new Set<() => void>()

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

async function fetchSharedEntries() {
  if (!isSupabaseConfigured || !supabase) {
    sharedLoading = false
    notifyListeners()
    return
  }
  const { data, error } = await supabase
    .from('user_best_cards')
    .select('user_id, email, score, top_cards, total_rolls, best_tier')
    .order('score', { ascending: false })
    .limit(200)
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load the leaderboard:', error.message)
    sharedLoading = false
    notifyListeners()
    return
  }
  const rows = (data ?? []) as UserBestCardsRow[]
  sharedEntries = rows.map(rowToEntry).sort(compareEntries)
  sharedLoading = false
  notifyListeners()
}

function acquireSharedSubscription() {
  subscriberCount += 1
  if (sharedChannel || !isSupabaseConfigured || !supabase) return
  fetchSharedEntries()
  // Any insert/update on ANY row (not just this user's) should refresh the
  // whole board - a roll on a different device is exactly the case this
  // subscription exists for.
  sharedChannel = supabase
    .channel('leaderboard-user-best-cards')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'user_best_cards' }, () => {
      fetchSharedEntries()
    })
    .subscribe()
}

function releaseSharedSubscription() {
  subscriberCount = Math.max(0, subscriberCount - 1)
  if (subscriberCount > 0 || !sharedChannel || !supabase) return
  supabase.removeChannel(sharedChannel)
  sharedChannel = null
}

/**
 * Ranked leaderboard across EVERY account that has ever rolled, best score
 * first - fetched from Supabase's user_best_cards table and kept live via
 * a realtime subscription, so a roll made on any device (yours or anyone
 * else's) updates every open leaderboard view within moments, no refresh
 * needed. Safe to call from multiple simultaneously-mounted components -
 * see the shared-subscription comment above.
 */
export function useLeaderboardEntries(): LeaderboardResult {
  const [, forceRender] = useState(0)

  useEffect(() => {
    const listener = () => forceRender((n) => n + 1)
    listeners.add(listener)
    acquireSharedSubscription()
    return () => {
      listeners.delete(listener)
      releaseSharedSubscription()
    }
  }, [])

  return { entries: sharedEntries, loading: sharedLoading }
}
