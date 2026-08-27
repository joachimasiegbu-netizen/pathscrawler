import demoCareers from './demoCareers'
import type { Career } from './demoCareers'
import { getCareerTier } from '../utils/careerTiers'

// Per-JOB testimonials. Every rollable career gets at least two - a mix of
// positive, lukewarm and critical, because a real review section isn't all
// five stars. Shown on the career detail page (CareerDetailPage.tsx), the
// /testimonials feed and the landing carousel.
//
// EXCLUDED (no testimonials): Mythic and Celestial tier careers, and the
// heritage / "cultural" crafts (the ones carrying a hand-written
// rarityLabel). Vanished / extinct jobs live in their own data set
// (vanishedJobs.ts) and never had career detail pages, so there's nothing
// to exclude for them here.
//
// The quotes are generated from templates, seeded on the career id, so a
// given job's testimonials are varied but STABLE across renders (they don't
// reshuffle every time the page mounts). Not real user reviews - if a real
// review system is added later this becomes the seed / fallback.

export interface Testimonial {
  id: string
  name: string
  initials: string
  accent: string
  quote: string
  careerId: number
  careerLabel: string
  rating: 1 | 2 | 3 | 4 | 5
  date: string
}

const ACCENTS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#f43f5e']

const NAMES = [
  'Amara O.', 'Daniel K.', 'Priya S.', 'Marcus T.', 'Lena H.', 'Joe R.', 'Fatima A.', 'Callum B.',
  'Grace W.', 'Ibrahim N.', 'Sophie L.', 'Ryan D.', 'Nadia P.', 'Tom E.', 'Chloe M.', 'Deshawn F.',
  'Hana Y.', 'Olly G.', 'Bex C.', 'Sam W.', 'Jack H.', 'Maria S.', 'Leon A.', 'Yusuf K.',
  'Ellie B.', 'Aoife D.', 'Rob T.', 'Kim L.', 'Zainab H.', 'Ash P.', 'Nina G.', 'Paul R.',
  'Cara J.', 'Femi O.', 'Dev S.', 'Molly W.', 'Gareth E.', 'Tia N.', 'Owen H.', 'Ravi M.',
]

// {role} is replaced with the career title. Buckets keep positives and
// criticals separate so every job is guaranteed at least one of each.
const POSITIVE = [
  "Rolled {role} on a whim and it actually stuck. I've started a free course and I'm looking forward to work for the first time in years.",
  "The day-in-the-life for {role} sold me - it didn't hide the hard parts and I still wanted in.",
  "I'd written {role} off as 'not for someone like me'. The pathway page showed me two routes in I never knew existed.",
  "Best careers resource I've used. The {role} entry had actual qualifications and honest salary bands, no fluff.",
  "Lined {role} up against two other options in the compare tool and finally made a decision I'd been stuck on for a year.",
  "Signposted me to the right apprenticeship for {role} in five minutes. My school careers advisor took a term and got it wrong.",
  "The {role} salary range matched what I was actually offered. That kind of honesty is rare.",
  "Rolled {role}, read it properly, and it changed my A-level choices. Wish I'd found this at 14.",
]

const CRITICAL = [
  "{role} sounded perfect until I read the hours. Not the life I want - but glad I found out here and not two years in.",
  "Bit of a reality check. I love the idea of {role}; the day-to-day, less so. Useful, if a little deflating.",
  "The {role} route is more competitive than the page lets on. Accurate on the job, optimistic on how easy it is to get in.",
  "Pay for {role} is lower than I'd assumed once you see the full range. Rather know now than later.",
  "More physical than I'd pictured. The {role} write-up is fair - I just wasn't the audience for it.",
  "Fine as a starting point for {role}, but you'll still need to do your own digging. It points you at the right questions, not the answers.",
  "Honestly a bit put off {role} after reading this. Which is the point, I suppose.",
  "The {role} progression section is thin. Everything before it was solid though.",
]

const NEUTRAL = [
  "More honest than the {role} open day I went to. Same facts, none of the sales pitch.",
  "Decent overview of {role}. Got me from 'maybe' to actually applying.",
  "Rolled {role} three times before I read it. When I did, the requirements list was genuinely helpful.",
  "Used the {role} page with my tutor group - even the quiet kids started asking about pathways.",
  "Solid on {role}. Docked a star only because I wanted more on progression.",
]

// --- deterministic RNG (mulberry32) so a career's set is stable ---------
function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function initialsOf(name: string): string {
  const parts = name.replace(/[^A-Za-z .]/g, '').trim().split(/\s+/)
  const first = parts[0]?.[0] ?? '?'
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? ''
  return (first + second).toUpperCase()
}

function fillTemplate(tpl: string, role: string): string {
  return tpl.replace(/\{role\}/g, role)
}

/** True when a career is eligible for testimonials (i.e. NOT mythic/
 * celestial tier and NOT a heritage craft). */
export function careerHasTestimonials(career: Career): boolean {
  const tier = getCareerTier(career)
  if (tier === 'mythic' || tier === 'celestial') return false
  if (career.rarityLabel) return false
  return true
}

const RATING_FOR: Record<'pos' | 'crit' | 'neu', [1 | 2 | 3 | 4 | 5, 1 | 2 | 3 | 4 | 5]> = {
  pos: [5, 4],
  crit: [2, 3],
  neu: [3, 4],
}

const BASE_DATE = Date.UTC(2025, 3, 1) // 1 Apr 2025, testimonials spread backwards from here
const DAY = 86400000

function buildForCareer(career: Career): Testimonial[] {
  const role = career.title
  const next = rng(career.id * 2654435761)
  const pick = <T,>(arr: T[]) => arr[Math.floor(next() * arr.length)]

  // Guaranteed: one positive, one critical. ~45% of careers get a third
  // (neutral). Names never repeat within a career's set.
  const usedNames = new Set<string>()
  const uniqueName = () => {
    let n = pick(NAMES)
    let guard = 0
    while (usedNames.has(n) && guard++ < 8) n = pick(NAMES)
    usedNames.add(n)
    return n
  }

  const plan: { bucket: 'pos' | 'crit' | 'neu'; tpl: string }[] = [
    { bucket: 'pos', tpl: pick(POSITIVE) },
    { bucket: 'crit', tpl: pick(CRITICAL) },
  ]
  if (next() < 0.45) plan.push({ bucket: 'neu', tpl: pick(NEUTRAL) })
  // Half the time, flip order so the first card isn't always the 5-star one.
  if (next() < 0.5) plan.reverse()

  return plan.map((p, index) => {
    const name = uniqueName()
    const [hi, lo] = RATING_FOR[p.bucket]
    const rating = next() < 0.5 ? hi : lo
    const ageDays = 20 + Math.floor(next() * 410)
    return {
      id: `t-${career.id}-${index}`,
      name,
      initials: initialsOf(name),
      accent: pick(ACCENTS),
      quote: fillTemplate(p.tpl, role),
      careerId: career.id,
      careerLabel: role,
      rating,
      date: new Date(BASE_DATE - ageDays * DAY).toISOString().slice(0, 10),
    }
  })
}

// Built once at module load for every eligible career.
const BY_CAREER: Map<number, Testimonial[]> = new Map()
for (const career of demoCareers) {
  if (careerHasTestimonials(career)) BY_CAREER.set(career.id, buildForCareer(career))
}

export function getTestimonialsForCareer(careerId: number): Testimonial[] {
  return BY_CAREER.get(careerId) ?? []
}

// A representative spread for the /testimonials feed and the landing
// carousel - the first few eligible careers in each category, so the feed
// isn't 300 cards but still shows the range.
export const TESTIMONIALS: Testimonial[] = (() => {
  const perCategory = new Map<string, number>()
  const out: Testimonial[] = []
  for (const career of demoCareers) {
    if (!BY_CAREER.has(career.id)) continue
    const seen = perCategory.get(career.category) ?? 0
    if (seen >= 3) continue
    perCategory.set(career.category, seen + 1)
    out.push(...(BY_CAREER.get(career.id) ?? []))
  }
  return out
})()

/** Categories present in the featured feed, for the filter control. */
export const TESTIMONIAL_CATEGORIES: string[] = (() => {
  const ids = new Set(TESTIMONIALS.map((t) => t.careerId))
  const cats = new Set<string>()
  for (const career of demoCareers) if (ids.has(career.id)) cats.add(career.category)
  return [...cats].sort()
})()

const CATEGORY_BY_CAREER = new Map(demoCareers.map((c) => [c.id, c.category]))
export function categoryOfTestimonial(testimonial: Testimonial): string {
  return CATEGORY_BY_CAREER.get(testimonial.careerId) ?? ''
}

export function formatTestimonialDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}
