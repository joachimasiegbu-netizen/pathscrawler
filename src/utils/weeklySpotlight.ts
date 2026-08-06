import demoCareers from '../data/demoCareers'
import type { Career } from '../data/demoCareers'

// No backend, so "weekly" is derived deterministically from the ISO week
// number of the current date rather than fetched - it rotates once a week
// on its own, with no stale-data risk and nothing to keep in sync.

function getIsoWeekNumber(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNumber = (target.getUTCDay() + 6) % 7 // Monday = 0
  target.setUTCDate(target.getUTCDate() - dayNumber + 3)
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4))
  const firstDayNumber = (firstThursday.getUTCDay() + 6) % 7
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNumber + 3)
  return 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000))
}

const spotlightBlurbs: Record<string, string> = {
  'Technology & Digital': 'Tech roles are booming as employers race to digitise operations and build AI-driven products.',
  'Business & Finance': 'Business and finance careers stay in steady demand as every industry needs people who can manage money and strategy.',
  'Healthcare & Medicine': "Healthcare careers are growing fast as the UK's population ages and services expand.",
  'Engineering & Manufacturing': 'Engineering is booming with investment in infrastructure, green energy and advanced manufacturing.',
  'Creative & Media': 'Creative and media careers are thriving as brands compete for attention across digital platforms.',
  'Education & Training': 'Education roles remain essential and in demand as schools and training providers look to fill posts.',
  'Service & Hospitality': 'Hospitality is bouncing back strongly, with employers actively hiring across the sector.',
  'Agriculture & Animal Care': 'Agriculture and animal care roles are growing as sustainable food production becomes a national priority.',
  'Sport & Leisure': 'Sport and leisure careers are expanding alongside growing public investment in health and wellbeing.',
  'Construction & Trades': 'Construction and trades are booming, driven by a nationwide push to build more homes and infrastructure.',
  'Public Services': 'Public service careers offer strong job security as councils and agencies continue to recruit.',
  'Science & Research': 'Science and research careers are growing as the UK invests heavily in innovation and R&D.',
}

export interface WeeklySpotlight {
  career: Career
  blurb: string
}

export function getWeeklySpotlight(date: Date = new Date()): WeeklySpotlight {
  const weekNumber = getIsoWeekNumber(date)
  const career = demoCareers[weekNumber % demoCareers.length]
  const blurb = spotlightBlurbs[career.category] || `${career.category} roles are in demand right now.`
  return { career, blurb }
}
