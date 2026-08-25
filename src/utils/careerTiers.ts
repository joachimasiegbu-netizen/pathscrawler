import type { Career } from '../data/demoCareers'

export type TierKey = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'celestial'

export interface TierConfig {
  key: TierKey
  label: string
  emoji: string
  /**
   * Target long-run roll share (sums to 1). Display/reference only - actual
   * roll probability is per-career now (see rollWeights.ts / rollEngine.ts),
   * not picked by tier. Kept here because it's still what the tier-balance
   * cap in rollEngine.ts is checking against.
   */
  targetShare: number
}

// Ordered weakest -> strongest. targetShare IS the roll probability
// (rollEngine.ts's pickTier() uses it directly as the per-tier weight in
// its weighted-random walk), so tuning these numbers directly retunes the
// odds - separate from getCareerTier below (which career FALLS INTO which
// tier in the first place, real-world-rarity based, not this probability
// of landing on that tier once picked).
// Was all zeroed except celestial=1 (a leftover from testing Celestial's
// reveal animation), then a flat 68/20/8/3/0.5/0.3/0.1 split. That split
// was picked independent of how many real careers actually populate each
// tier (getCareerTier below) - fine on its own, but combined with the old
// boundary table's uneven pool sizes (Uncommon's 103 careers vs Common's
// 33, etc.) it produced a real problem: a SPECIFIC Common career was ~11x
// more likely to come up than a specific Uncommon one, despite Uncommon
// nominally being the harder tier to land. Retuned alongside the boundary
// rework below so per-career odds (share / pool size) actually decrease
// at every step now: Common ~1 in 91, Uncommon ~1 in 191, Rare ~1 in 433,
// Epic ~1 in 699, Legendary ~1 in 1,429, Mythic ~1 in 3,597, Celestial ~1
// in 8,000. Sums to 99.95%, not a clean 100 - pickTier() below normalizes
// against its own running total either way, so that tiny shortfall
// doesn't skew the actual odds.
export const TIERS: TierConfig[] = [
  { key: 'common', label: 'Common', emoji: '🟢', targetShare: 0.65 },
  { key: 'uncommon', label: 'Uncommon', emoji: '🔵', targetShare: 0.22 },
  { key: 'rare', label: 'Rare', emoji: '🟣', targetShare: 0.09 },
  { key: 'epic', label: 'Epic', emoji: '🟡', targetShare: 0.03 },
  { key: 'legendary', label: 'Legendary', emoji: '💎', targetShare: 0.007 },
  { key: 'mythic', label: 'Mythic', emoji: '⚫', targetShare: 0.0025 },
  { key: 'celestial', label: 'Celestial', emoji: '✨', targetShare: 0.0005 },
]

/** Parses a "£35k - £45k" style range into its midpoint. Used for salary
 * DISPLAY/comparison purposes elsewhere (Highest Paying sort, Compare's
 * "best salary" highlight, Binder's salary sort, titles.ts's Money Bags
 * threshold) - no longer for tier classification, see getCareerTier below.
 *
 * Was matching bare `\d+` runs, which silently mangled both salary formats
 * actually used in demoCareers.js: a comma thousands-separator split a
 * single number into two matches ("£150,000" -> "150" and "000", averaging
 * to 90 instead of 150000), and a "k" shorthand was dropped entirely
 * ("£35k - £45k" -> 40 instead of 40000). Caught because it made every
 * salary in the app parse as a tiny 2-3 digit number - titles.ts's "£60k+"
 * Money Bags threshold matched ZERO real careers as a result, which (via a
 * second bug, the empty-target-set fix in useTitleProgressStore.ts) meant
 * the title unlocked for everyone regardless of their Binder. Now matches a
 * full comma-grouped number (or decimal) with an optional trailing k/K,
 * strips the comma/k before parsing, and multiplies by 1000 when the k was
 * present. Re-verified against the full 184-career set: no more near-zero
 * results (one genuine 0, "Photographer"'s "Variable" salary, which has no
 * digits to parse at all - same fallback as before). */
export function parseSalaryAvg(salary: string): number {
  const matches = salary.match(/\d[\d,]*(?:\.\d+)?\s*[kK]?/g)
  if (!matches || matches.length === 0) return 0
  const numbers = matches.map((raw) => {
    const isThousands = /[kK]\s*$/.test(raw)
    const numeric = Number(raw.replace(/[,\s]/g, '').replace(/[kK]$/, ''))
    return isThousands ? numeric * 1000 : numeric
  })
  return (Math.min(...numbers) + Math.max(...numbers)) / 2
}

// --- Career tier (real-world UK rarity, employment-share based) ------------
// Pay doesn't factor into this at all. Cutoffs are on
// career.employmentPercentage (real UK workforce share, ~31.4M people - see
// demoCareers.d.ts) - LOWER percentage means FEWER people hold that job in
// real life, so it earns a RARER tier. This is the one tier check the whole
// app shares (Roll a Job's card color/pool, Binder, Compare, Stats, Weekly
// Spotlight) - there's no separate pay-based classification.
//
// Was a fixed "1 in X" band table (Common 1-50, ..., Celestial 4,000,001+,
// each boundary exactly 10x the last), then a second, wider band table
// (Common 1-150, ..., Mythic 500,001-5,000,000) that fit the real data
// better but still produced a genuinely broken pyramid once actually
// counted up: Common 33 / Uncommon 103 / Rare 25 / Epic 7 / Legendary 5 /
// Mythic 9 - Uncommon OUT-populating Common by 3x, and Mythic having
// nearly double Legendary's pool, both backwards for a rarity ladder.
// Combined with TIERS[]'s old flat share split, that meant a specific
// Uncommon career was landing LESS often than a specific Common one
// despite Uncommon nominally being rarer - the exact inversion this
// third table (and the retuned TIERS[] shares above) was built to fix.
// Derived from the real, sorted employmentPercentage gaps in the current
// 184-career set rather than another guessed round-number scheme -
// boundaries dropped into the actual gaps between clusters of careers so
// each tier holds a believable, monotonically-shrinking pool: Common 59,
// Uncommon 42, Rare 39, Epic 21, Legendary 10, Mythic 9 (Celestial's
// still the fixed 4, see below) - 184 total, a real pyramid this time.
// Re-verified against the current data set: no exact-pct tie gets split
// across a boundary. Consequence: the careers added to populate the
// SECOND table's Legendary band (demoCareers.js's "LEGENDARY TIER
// CAREERS" block) land differently again here - LEGENDARY_MAX_PCT moved
// from 1-in-80,000 to a much LESS strict 1-in-100, so several that had
// fallen to Epic under the second table are back in Legendary under this
// one; see that block's own comment for the up-to-date per-career count.
// Celestial is NOT wired to CELESTIAL_MAX_PCT here (there isn't one) -
// still reserved for exactly the 4 hand-picked careers via forcedTier
// below. The rarest REAL career in the current set (Pargeter / Cut
// Crystal Glass Cutter, ~1 in 4,310,345) is still well inside the new
// MYTHIC_MAX_PCT floor rather than needing a separate Celestial cutoff.
const MYTHIC_MAX_PCT = 0.0007 // ~1 in 1,429
const LEGENDARY_MAX_PCT = 0.01 // 1 in 100
const EPIC_MAX_PCT = 0.0958 // ~1 in 10.4
const RARE_MAX_PCT = 0.195 // ~1 in 5.1
const UNCOMMON_MAX_PCT = 0.42 // ~1 in 2.4

export function getCareerTier(career: Career): TierKey {
  // Celestial is never reached via employmentPercentage math, no matter
  // how tiny - it's reserved for exactly the 4 hand-picked careers that
  // set this field (Prime Minister, President, Vice President, Royal
  // Butler - see demoCareers.js), kept deliberately separate from real
  // occupation data rather than folded into whichever percentage a "1 in
  // 4,000,001+" cutoff would otherwise imply (several genuine heritage
  // crafts are already rarer than that in real life, and conflating them
  // with Celestial would both crowd out the 4 intended careers and
  // mis-badge real, pursuable ones as a joke-tier "you can never actually
  // do this" rarity).
  if (career.forcedTier) return career.forcedTier
  const pct = career.employmentPercentage
  if (pct < MYTHIC_MAX_PCT) return 'mythic'
  if (pct < LEGENDARY_MAX_PCT) return 'legendary'
  if (pct < EPIC_MAX_PCT) return 'epic'
  if (pct < RARE_MAX_PCT) return 'rare'
  if (pct < UNCOMMON_MAX_PCT) return 'uncommon'
  return 'common'
}

export function getTierConfig(tier: TierKey): TierConfig {
  return TIERS.find((entry) => entry.key === tier) ?? TIERS[0]
}

// --- Leaderboard scoring -----------------------------------------------------
// Flat points per tier (rarer = worth more), used by useLeaderboardStore to
// score each roll and rank the Roll a Job leaderboard. Deliberately not a
// straight function of targetShare - a simple doubling-ish curve so a
// single Mythic (or Celestial) clearly outweighs a stack of Commons
// without needing the full odds math the roll itself uses.
export const TIER_POINTS: Record<TierKey, number> = {
  common: 1,
  uncommon: 5,
  rare: 15,
  epic: 30,
  legendary: 60,
  mythic: 100,
  celestial: 200,
}

// --- Displayed rarity ("1 in every N workers") ------------------------------
// The real figure, always - no floor/cap of any kind. Celestial careers
// don't use this at all in practice (they carry their own hand-written
// rarityLabel, checked first everywhere this gets displayed), but the
// function still needs to return SOMETHING finite for them since
// employmentPercentage is a required field either way.
export function getDisplayRarityN(career: Career): number {
  return Math.round(100 / career.employmentPercentage)
}
