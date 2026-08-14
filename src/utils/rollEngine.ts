import demoCareers from '../data/demoCareers'
import type { Career } from '../data/demoCareers'
import { getCareerTier, TIERS, type TierKey } from './careerTiers'
import { computeRollWeight } from './rollWeights'

interface WeightedEntry {
  career: Career
  tier: TierKey
  weight: number
}

// Two-stage selection: which TIER comes up is controlled by TIERS[].targetShare
// (the section 8 distribution target - Common ~40%, ..., Mythic ~0.5%);
// which CAREER wins within that tier is controlled by its rollWeight (the
// section 1-4 real-world-odds factors). A single flat sum across all 111
// careers using only the section 1 point values was tried first and
// rejected: those factors don't have anywhere near enough dynamic range to
// offset how many careers this app now has sitting in the Legendary salary
// band (20, thanks to the senior/executive careers added for the Highest
// Paying page) - a flat sum put Legendary at ~12-13% of rolls, five times
// the ~2-3% target, no matter how the per-career weights were tuned. Tier
// picked first, career picked within it, hits the target distribution by
// construction while still keeping "realistic odds" as the tie-breaker for
// which specific career you get inside that tier.
let cachedPools: Record<TierKey, WeightedEntry[]> | null = null
let cachedTotalWeight = 0

function getPools(): Record<TierKey, WeightedEntry[]> {
  if (cachedPools) return cachedPools
  const pools = Object.fromEntries(TIERS.map((tier) => [tier.key, [] as WeightedEntry[]])) as Record<TierKey, WeightedEntry[]>
  let total = 0
  for (const career of demoCareers) {
    const tier = getCareerTier(career)
    // Floor of 1: a career should never be literally impossible to roll,
    // even if every factor bottoms out.
    const weight = Math.max(1, computeRollWeight(career))
    pools[tier].push({ career, tier, weight })
    total += weight
  }
  cachedPools = pools
  cachedTotalWeight = total
  return pools
}

export function getTotalRollWeight(): number {
  getPools()
  return cachedTotalWeight
}

// Standard weighted-random walk (section 3): accumulate weights until the
// running total exceeds a random draw.
function weightedPick(entries: WeightedEntry[], weightOf: (entry: WeightedEntry) => number = (e) => e.weight): WeightedEntry {
  const total = entries.reduce((sum, entry) => sum + weightOf(entry), 0)
  let roll = Math.random() * total
  for (const entry of entries) {
    roll -= weightOf(entry)
    if (roll <= 0) return entry
  }
  return entries[entries.length - 1]
}

function pickTier(shareOf: (tier: TierKey) => number = (tier) => TIERS.find((t) => t.key === tier)!.targetShare): TierKey {
  const total = TIERS.reduce((sum, tier) => sum + shareOf(tier.key), 0)
  let roll = Math.random() * total
  for (const tier of TIERS) {
    roll -= shareOf(tier.key)
    if (roll <= 0) return tier.key
  }
  return TIERS[TIERS.length - 1].key
}

function pickFromTier(pools: Record<TierKey, WeightedEntry[]>, tier: TierKey): WeightedEntry {
  const pool = pools[tier]
  if (pool.length > 0) return weightedPick(pool)
  // Empty pool safety net (shouldn't happen with the current data, but a
  // salary re-shuffle could empty one out): walk outward to the nearest
  // non-empty tier rather than failing the roll.
  const index = TIERS.findIndex((t) => t.key === tier)
  for (let offset = 1; offset < TIERS.length; offset++) {
    for (const candidate of [index - offset, index + offset]) {
      if (candidate >= 0 && candidate < TIERS.length && pools[TIERS[candidate].key].length > 0) {
        return weightedPick(pools[TIERS[candidate].key])
      }
    }
  }
  return { career: demoCareers[0], tier: 'common', weight: 1 } // unreachable: demoCareers is never empty
}

// Cap on how often Common can dominate, checked against a real running
// lifetime tally (see useRollStore's lifetimeTierCounts) rather than any
// shown history list - needs a minimum sample before it can kick in at all
// so an unlucky start doesn't look "corrected". Set ~10 points above
// Common's own 55% target (same headroom the old 50% cap gave the
// previous 40% target) so this stays a genuine safety net against bad
// luck rather than a drag that fights the target itself - it was doing
// exactly that at the old 50% cap, capping observed Common at ~50% instead
// of the intended 55% (caught by re-simulating after this rebalance).
const COMMON_CAP_SHARE = 0.65
const MIN_ROLLS_BEFORE_CAP = 10

export interface RollContext {
  lastCareerId: number | null
  lifetimeTierCounts: Partial<Record<TierKey, number>>
  lifetimeTotalRolls: number
}

export interface RollOutcome {
  career: Career
  tier: TierKey
  rollWeight: number
  totalWeight: number
  /** "1 in N people roll this career" - N, already rounded. */
  oddsDenominator: number
}

function oddsDenominatorFor(pools: Record<TierKey, WeightedEntry[]>, entry: WeightedEntry): number {
  const tierTotalWeight = pools[entry.tier].reduce((sum, e) => sum + e.weight, 0)
  const tierShare = TIERS.find((t) => t.key === entry.tier)!.targetShare
  const effectiveProbability = tierShare * (entry.weight / tierTotalWeight)
  return Math.max(1, Math.round(1 / effectiveProbability))
}

// Odds for a SPECIFIC career, independent of any roll context - used for
// the shared-link view (someone opens a /job-market/roll?career=...&tier=...
// link) where nothing was actually rolled by this visitor, just displayed.
export function getOddsForCareer(career: Career): { tier: TierKey; rollWeight: number; totalWeight: number; oddsDenominator: number } | null {
  const pools = getPools()
  const tier = getCareerTier(career)
  const entry = pools[tier].find((e) => e.career.id === career.id)
  if (!entry) return null
  return { tier, rollWeight: entry.weight, totalWeight: getTotalRollWeight(), oddsDenominator: oddsDenominatorFor(pools, entry) }
}

function attemptRoll(pools: Record<TierKey, WeightedEntry[]>): WeightedEntry {
  return pickFromTier(pools, pickTier())
}

// Weighted-random selection (section 3, tier-then-career per the note
// above), with a re-roll-once safety net for immediate repeats and an
// over-represented Common tier. No pity system - every roll is independent.
export function rollForCareer(ctx: RollContext): RollOutcome {
  const pools = getPools()
  const totalWeight = getTotalRollWeight()

  let entry = attemptRoll(pools)

  const commonShare =
    ctx.lifetimeTotalRolls >= MIN_ROLLS_BEFORE_CAP ? (ctx.lifetimeTierCounts.common ?? 0) / ctx.lifetimeTotalRolls : 0
  const violatesCommonCap = entry.tier === 'common' && commonShare > COMMON_CAP_SHARE
  const isImmediateRepeat = entry.career.id === ctx.lastCareerId

  if (violatesCommonCap || isImmediateRepeat) {
    entry = attemptRoll(pools)
  }

  return {
    career: entry.career,
    tier: entry.tier,
    rollWeight: entry.weight,
    totalWeight,
    oddsDenominator: oddsDenominatorFor(pools, entry),
  }
}
