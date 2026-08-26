import demoCareers from '../data/demoCareers'
import { getCareerTier, parseSalaryAvg } from './careerTiers'

export type TitleIcon = 'crown' | 'flame' | 'skull' | 'sparkles' | 'trophy'

export interface TitleDef {
  id: string
  rank: number
  name: string
  icon: TitleIcon
  isHidden: boolean
  /** Shown once unlocked, never before - a locked title shows no subtext at
   * all (see RollStandingPanel.tsx). */
  condition: string
  /** Flavor line shown once, the moment the title flips from locked to
   * unlocked (see RollStandingPanel.tsx's seenTitleIds handling). */
  subtitle: string
  /** Shown in the detail view (RollStandingPanel.tsx), not the row itself.
   * Roughly scaled to real difficulty, not a round guess per title - see
   * each entry's own comment for the odds/effort behind its number. A
   * different currency from TIER_POINTS (careerTiers.ts, 1-200 for a single
   * roll's leaderboard score) - titles are bigger asks than one roll, so
   * they sit on their own, higher scale. */
  points: number
}

// Thresholds referenced both by TITLES's own condition/hint copy below and
// by isTitleUnlocked further down - declared first (TITLES references
// MONEY_BAGS_SALARY_THRESHOLD/MONEY_BAGS_ROLL_WINDOW directly in its own
// condition string), a plain `const` doesn't hoist the way a function
// would.
// £60k+ threshold for Money Bags - picked as a clear "elite earner" round
// number well above the median rolled career.
export const MONEY_BAGS_SALARY_THRESHOLD = 60000
// "Within your first N rolls" window for the three early-roll titles
// (Golden Child / Seraph of the End / Heaven's Descendant).
export const EARLY_ROLL_WINDOW = 20
// Shadow Banned's dry-spell length - was Job's own condition before Job's
// condition changed to a leaderboard-rank drop; the underlying 500-roll
// dry-spell mechanic itself didn't go away, it just moved to its own new
// title id instead of being reused under Job's name.
export const SHADOW_BANNED_DRY_SPELL_TARGET = 500
// Employee of the Month's total-rolls target (was Gambling Addict's - same
// id/condition/mechanic, only the display name changed).
export const GAMBLING_ADDICT_ROLLS_TARGET = 2500
// Job's own new condition - a leaderboard rank has to fall this many spots
// (or more) from the best rank this account has ever held for Job to
// unlock. 0-indexed same as everywhere else this app tracks rank (findIndex
// on the leaderboard entries array), so a 2-spot drop really is 2 places.
export const JOB_RANK_DROP_TARGET = 2
// Money Bags must complete its full-set collection by this roll count.
export const MONEY_BAGS_ROLL_WINDOW = 300
// Sweat Lord's rolling-window target.
export const SWEAT_LORD_ROLLS_TARGET = 1000
export const SWEAT_LORD_WINDOW_MS = 24 * 60 * 60 * 1000

// 13 titles, ranks 1-13 - final content as given, not placeholder/example
// data. Every title is permanent once earned (see useTitleProgressStore.ts -
// every flag it tracks is a one-way latch, never unset by later play,
// specifically so a later "Clear binder" click can't retroactively re-lock
// Working Class Hero / Money Bags / Standing on a Million Lives).
export const TITLES: TitleDef[] = [
  {
    id: 'chosen-one',
    rank: 1,
    name: 'The Chosen One',
    icon: 'crown',
    isHidden: false,
    condition: 'Roll a Celestial',
    subtitle: 'Fate itself rolled the dice for you.',
    // Celestial's own tier odds are 0.05% (careerTiers.ts) - no roll limit
    // here, so it's really "how long until it's likely," not a fixed
    // probability - median rolls-to-first-hit is ~1,386 at that rate.
    points: 500,
  },
  {
    // id kept as 'gambling-addict' even though the displayed name changed
    // to "Employee of the Month" - this id is what's actually recorded in
    // Supabase's title_unlocks table (schema.sql) and in seenTitleIds/
    // syncedTitleIds locally, so keeping it stable means anyone who'd
    // already earned this under its old name keeps it (just sees the new
    // name now), rather than being silently un-earned by a rename.
    id: 'gambling-addict',
    rank: 2,
    name: 'Employee of the Month',
    icon: 'flame',
    isHidden: false,
    condition: '2,500 total rolls',
    subtitle: "2,500 pulls in. There's no such thing as \"just one more.\"",
    // Pure volume, no luck involved - lower than the luck-gated titles.
    points: 150,
  },
  {
    id: 'icarus',
    rank: 3,
    name: 'Icarus',
    icon: 'flame',
    isHidden: false,
    condition: 'Reach top 3 on the leaderboard',
    subtitle: 'They say you will soon fall. Prove them wrong.',
    // Competitive, not a fixed personal probability - depends on everyone
    // else's rolls too, which is worth more than a pure-solo title.
    points: 350,
  },
  {
    id: 'golden-child',
    rank: 4,
    name: 'Golden Child',
    icon: 'sparkles',
    isHidden: false,
    condition: 'Roll a Legendary within your first 20 rolls',
    subtitle: "Legendary, and you'd barely warmed up the reel.",
    // Legendary's 0.7% tier odds (careerTiers.ts) over 20 rolls -
    // 1-(1-0.007)^20 =~ 13% - the most attainable of the three "in your
    // first 20" titles, so the fewest points of the three.
    points: 150,
  },
  {
    id: 'seraph-of-the-end',
    rank: 5,
    name: 'Seraph of the End',
    icon: 'sparkles',
    isHidden: false,
    condition: 'Roll a Mythic within your first 20 rolls',
    subtitle: 'Mythic, this early? Something up there noticed you.',
    // Mythic's 0.25% tier odds over 20 rolls =~ 5% - a real longshot.
    points: 300,
  },
  {
    id: 'heavens-descendant',
    rank: 6,
    name: "Heaven's Descendant",
    icon: 'crown',
    isHidden: false,
    condition: 'Roll a Celestial within your first 20 rolls',
    subtitle: "Celestial, before roll twenty-one. Beginner's luck doesn't cover this.",
    // Celestial's 0.05% tier odds over 20 rolls =~ 1% - the hardest of the
    // three "in your first 20" titles, so the most points of the three.
    points: 600,
  },
  {
    id: 'working-class-hero',
    rank: 7,
    name: 'Working Class Hero',
    icon: 'trophy',
    isHidden: false,
    condition: 'Collect every Common career in your Binder',
    subtitle: 'Every Common job, willingly collected. Someone has to.',
    // 59 careers (COMMON_CAREER_IDS) - individually easy pulls, but every
    // single one has to land and get kept, a real grind+patience ask.
    points: 250,
  },
  {
    id: 'money-bags',
    rank: 8,
    name: 'Money Bags',
    icon: 'trophy',
    isHidden: true,
    // Was 'Hidden' forever, even post-unlock - reverted per explicit
    // request: once a hidden title unlocks, there's no reason left to mask
    // its condition, same as the other two hidden titles already did.
    condition: `Collect every career paying £${(MONEY_BAGS_SALARY_THRESHOLD / 1000).toFixed(0)}k+ in your Binder, all within your first ${MONEY_BAGS_ROLL_WINDOW} rolls`,
    subtitle: 'Every high-earning card in the collection, before the count even got hard.',
    // 50 careers (MONEY_BAGS_CAREER_IDS) PLUS a hard 300-roll deadline -
    // the compound condition (full set AND a time limit) is what pushes
    // this above Working Class Hero's plain 59-career collection.
    points: 450,
  },
  {
    id: 'job',
    rank: 9,
    name: 'Job',
    icon: 'skull',
    isHidden: false,
    // Was "500 rolls without landing a Legendary+" - that mechanic didn't
    // disappear, it moved to its own new title (Shadow Banned, rank 12)
    // below. Job's condition is a genuinely different one now: a real
    // reversal of fortune on the leaderboard itself, matching its
    // biblical namesake even more directly than the old dry-spell did.
    condition: 'Drop 2 or more ranks on the leaderboard',
    subtitle: 'The Lord gave, and the Lord hath taken away.',
    // Competitive/circumstantial like Icarus (rank 3) rather than a fixed
    // personal probability - can be triggered by your own bad rolls OR by
    // everyone else simply catching up around you either way.
    points: 200,
  },
  {
    id: 'standing-on-a-million-lives',
    rank: 10,
    name: 'Standing on a Million Lives',
    icon: 'skull',
    isHidden: true,
    condition: 'Collect every Mythic career in your Binder',
    subtitle: 'The full Mythic set, assembled by your own hand.',
    // 9 careers (MYTHIC_CAREER_IDS), each individually at Mythic's 0.25%
    // tier odds split across just those 9 - the single hardest collection
    // target in the whole set, so the single highest point value.
    points: 700,
  },
  {
    id: 'sweat-lord',
    rank: 11,
    name: 'Sweat Lord',
    icon: 'flame',
    isHidden: false,
    condition: '1,000 rolls within 24 hours',
    subtitle: 'A thousand rolls in a day. Go outside.',
    // Pure rate/dedication, no luck at all - real commitment (a roll every
    // ~86 seconds non-stop for a full day), but a guaranteed outcome for
    // anyone willing to put the time in, same category as Gambling Addict.
    points: 200,
  },
  {
    // Inherits Job's OLD condition verbatim (500 rolls without landing a
    // Legendary+) - see Job's own comment above for why this moved here
    // rather than being invented fresh. Reuses longestLegendaryDrySpell
    // (useTitleProgressStore.ts), the same field Job's unlock check read
    // before, so anyone's existing dry-spell progress is already correct
    // for THIS title with no migration needed - that counter never had
    // anything to do with which title id consumed it.
    id: 'shadow-banned',
    rank: 12,
    name: 'Shadow Banned',
    icon: 'skull',
    isHidden: false,
    condition: '500 rolls without landing a Legendary',
    subtitle: 'RNG put you in timeout.',
    // Same reasoning Job's own points value used to carry - bad-luck-
    // gated, not skill or effort, nothing the player actually controls.
    points: 200,
  },
  {
    id: 'final-generation',
    rank: 13,
    name: 'Final Generation',
    icon: 'skull',
    isHidden: true,
    condition: 'Roll a career at risk of AI automation',
    subtitle: "You're the last wave of humans doing this. After you, it's all AI.",
    // 7 tagged careers (aiEndangered, demoCareers.js) spread across
    // several tiers, several of them Common/Uncommon - despite being
    // hidden, genuinely the easiest title to stumble into by accident.
    points: 120,
  },
]

// Static per-career id sets, computed once from the bundled career list -
// these never change at runtime, so there's no reason to recompute them on
// every render/roll.
export const COMMON_CAREER_IDS: Set<number> = new Set(
  demoCareers.filter((career) => getCareerTier(career) === 'common').map((career) => career.id),
)
export const MYTHIC_CAREER_IDS: Set<number> = new Set(
  demoCareers.filter((career) => getCareerTier(career) === 'mythic').map((career) => career.id),
)
export const MONEY_BAGS_CAREER_IDS: Set<number> = new Set(
  demoCareers.filter((career) => parseSalaryAvg(career.salary) >= MONEY_BAGS_SALARY_THRESHOLD).map((career) => career.id),
)

/** The minimum progress shape every unlock check below reads from -
 * satisfied by useTitleProgressStore.ts's TitleProgress, kept as its own
 * type here so this file doesn't need to import that store (titles.ts stays
 * pure data/logic, no store dependency). */
export interface TitleUnlockProgress {
  hasCelestialRoll: boolean
  totalRolls: number
  hasReachedTop3: boolean
  hasLegendaryInFirst20: boolean
  hasMythicInFirst20: boolean
  hasCelestialInFirst20: boolean
  hasCompletedCommonSet: boolean
  hasCompletedMoneyBagsSet: boolean
  longestLegendaryDrySpell: number
  hasCompletedMythicSet: boolean
  hasHitSweatLord: boolean
  hasRolledAiEndangered: boolean
  /** Job's own new condition - latched the first time this account's
   * leaderboard rank is observed to have fallen JOB_RANK_DROP_TARGET or
   * more spots below the best rank it's ever held (useTitleProgressStore
   * .ts's markLeaderboardRankObserved). */
  hasDroppedTwoRanks: boolean
}

function isTitleUnlocked(id: string, p: TitleUnlockProgress): boolean {
  switch (id) {
    case 'chosen-one':
      return p.hasCelestialRoll
    case 'gambling-addict':
      return p.totalRolls >= GAMBLING_ADDICT_ROLLS_TARGET
    case 'icarus':
      return p.hasReachedTop3
    case 'golden-child':
      return p.hasLegendaryInFirst20
    case 'seraph-of-the-end':
      return p.hasMythicInFirst20
    case 'heavens-descendant':
      return p.hasCelestialInFirst20
    case 'working-class-hero':
      return p.hasCompletedCommonSet
    case 'money-bags':
      return p.hasCompletedMoneyBagsSet
    case 'job':
      return p.hasDroppedTwoRanks
    case 'standing-on-a-million-lives':
      return p.hasCompletedMythicSet
    case 'sweat-lord':
      return p.hasHitSweatLord
    case 'shadow-banned':
      return p.longestLegendaryDrySpell >= SHADOW_BANNED_DRY_SPELL_TARGET
    case 'final-generation':
      return p.hasRolledAiEndangered
    default:
      return false
  }
}

export interface TitleWithStatus extends TitleDef {
  unlocked: boolean
}

/** Every title plus its unlocked state for this progress snapshot - earned
 * titles first (so what the player has actually accomplished is the first
 * thing they see, not buried under a wall of locked ones), rank ascending
 * within each group. */
export function getTitlesWithStatus(progress: TitleUnlockProgress): TitleWithStatus[] {
  return TITLES.map((title) => ({ ...title, unlocked: isTitleUnlocked(title.id, progress) })).sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1
    return a.rank - b.rank
  })
}
