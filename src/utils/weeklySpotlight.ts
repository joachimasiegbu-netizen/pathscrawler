import demoCareers from '../data/demoCareers'
import type { Career } from '../data/demoCareers'
import { getCareerTier } from './careerTiers'

// No backend, so "weekly" is derived deterministically from the ISO week
// number of the current date rather than fetched - it rotates once a week
// on its own, with no stale-data risk and nothing to keep in sync.

// Weekly Spotlight is restricted to Mythic-tier careers only - the rarest
// jobs in the whole list by real UK employment share (getCareerTier, under
// 0.06% - see careerTiers.ts). Roll a Job's own card color/pool uses this
// exact same tier check now (pay no longer factors into tier at all), so
// this keeps surfacing endangered crafts like Master Thatcher for the same
// reason they're Mythic on a roll - genuine workforce scarcity, not a
// separate rule. Filtered once at module load, not per-call, since
// demoCareers is static - every getWeeklySpotlight() call indexes into
// this same small pool instead of the full career list.
const mythicCareers = demoCareers.filter((career) => getCareerTier(career) === 'mythic')

function getIsoWeekNumber(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNumber = (target.getUTCDay() + 6) % 7 // Monday = 0
  target.setUTCDate(target.getUTCDate() - dayNumber + 3)
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4))
  const firstDayNumber = (firstThursday.getUTCDay() + 6) % 7
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNumber + 3)
  return 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000))
}

// Per-career "why this job is vanishing" blurbs, keyed by exact title -
// checked before the category fallback below. Every Mythic career is now
// one of the 10 endangered heritage crafts/specialist roles or one of the 2
// original ultra-rare occupations, so a generic category blurb ("Tech
// roles are booming...") would read strangely here - these are jobs
// disappearing, not sectors hiring.
const spotlightBlurbs: Record<string, string> = {
  'Master Thatcher': "Only around 800 master thatchers remain for the UK's 50-60k thatched roofs, and the workforce is ageing faster than apprentices are coming through - a skills shortage that's now a genuine conservation risk.",
  'Pipe Organ Builder / Restorer': "Heritage Crafts lists organ building as endangered - 62% of the workforce is over 46, most firms are just 1-2 people, and there's no college course, only a trainee post with one of the handful of remaining builders.",
  'Bell Founder': 'The Whitechapel Bell Foundry, one of the last in the world, closed in 2017. Traditional loam-mould bell casting now survives almost entirely at a single Loughborough foundry.',
  'Traditional Hand Engraver': 'Laser engraving has displaced most of the trade - fewer than 100 full-time hand engravers are thought to remain in the UK, cutting lettering and crests into jewellery and silver the way it was done a century ago.',
  'Forensic Anthropologist': 'Fewer than 50 people in the UK do this as full-time casework - most who train in it end up in academia or another field entirely, since permanent forensic posts are vanishingly rare.',
  'Architectural / Traditional Blacksmith': 'Scotland alone is estimated to have only around 20 architectural blacksmiths left. Hand-forging ornamental ironwork for listed buildings is a heritage skill with very few working practitioners.',
  'Pargeter (Decorative Plasterer)': "As few as 6-11 skilled professional pargeters remain, nearly all in East Anglia. Freehand ornamental plasterwork has been crowded out by plain modern rendering, and it's now critically endangered.",
  'Rattan Furniture Maker': "Every rattan furniture maker left in the UK works for the same single company - the entire trade was nearly lost when manufacturing moved to Asia in the 1970s, and there's still no independent training route.",
  'Cut Crystal Glass Cutter': "Fewer than 8 people in the UK cut crystal glass as their main job, spread across a handful of glassworks. Most of that workforce is over 50, and training routes are almost nonexistent.",
  "Ship's Figurehead Carver": 'Heritage Crafts records just one full-time figurehead carver left in the UK, and zero trainees behind him - about as close to a one-person craft as a real job can get.',
  'Senior Police Officer (Chief Inspector+)': 'A genuinely tiny slice of UK policing - only a handful of officers hold Chief Inspector rank or above at any one time, reached after years of frontline service and promotion boards.',
  'Energy / Mining Production Director': "One of the rarest job titles in the UK's real employment data - a board-level production role that exists at only a small number of large energy and mining firms.",
}

export interface WeeklySpotlight {
  career: Career
  blurb: string
}

export function getWeeklySpotlight(date: Date = new Date()): WeeklySpotlight {
  const weekNumber = getIsoWeekNumber(date)
  const career = mythicCareers[weekNumber % mythicCareers.length]
  const blurb = spotlightBlurbs[career.title] || `${career.title} is one of the rarest jobs in the UK - fewer people hold this role than almost any other career on PathScrawler.`
  return { career, blurb }
}
