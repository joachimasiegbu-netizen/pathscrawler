import { useEffect, useState } from 'react'
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

/**
 * Ranked leaderboard across EVERY account that has ever rolled, best score
 * first - fetched from Supabase's user_best_cards table and kept live via
 * a realtime subscription, so a roll made on any device (yours or anyone
 * else's) updates every open leaderboard view within moments, no refresh
 * needed.
 */
export function useLeaderboardEntries(): LeaderboardResult {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }
    const client = supabase
    let cancelled = false

    async function fetchEntries() {
      const { data, error } = await client
        .from('user_best_cards')
        .select('user_id, email, score, top_cards, total_rolls, best_tier')
        .order('score', { ascending: false })
        .limit(200)
      if (cancelled) return
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load the leaderboard:', error.message)
        setLoading(false)
        return
      }
      const rows = (data ?? []) as UserBestCardsRow[]
      setEntries(rows.map(rowToEntry).sort(compareEntries))
      setLoading(false)
    }

    fetchEntries()

    // Any insert/update on ANY row (not just this user's) should refresh
    // the whole board - a roll on a different device is exactly the case
    // this subscription exists for.
    const channel = client
      .channel('leaderboard-user-best-cards')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_best_cards' }, () => {
        fetchEntries()
      })
      .subscribe()

    return () => {
      cancelled = true
      client.removeChannel(channel)
    }
  }, [])

  return { entries, loading }
}
