import type { Career } from '../data/demoCareers'
import { parseSalaryAvg } from './careerTiers'

// This file models "how hard is it to actually land this job" as a single
// rollWeight per career, from five factors the brief specified. None of
// demoCareers.js has explicit entry-barrier/competition/experience/geography
// fields, so each factor below is inferred from fields that DO exist
// (requirements text, title, category, salary, supportTags) via keyword
// heuristics - a modelled approximation, not sourced real labour-market
// data (unlike the ONS-backed salary figures elsewhere in this app). The
// goal is realistic RELATIVE ordering (entry-level/common roles roll far
// more often than executive/specialist ones), not exact reproduction of
// the brief's illustrative example numbers.

// --- A. Entry barrier (biggest factor) ---------------------------------
const MEDICAL_DEGREE_PATTERN = /\bmedicine\b|\bmbbs\b|dentistry|\bbds\b|pharmacy|\bmpharm\b|nursing degree|midwifery/i
const PHD_PATTERN = /\bphd\b|doctorate/i
const MASTERS_PATTERN = /master'?s|\bmsc\b|\bmba\b|postgraduate|\bpgce\b|conversion/i
const DEGREE_PATTERN = /degree|bachelor|\bbsc\b|\bba\b\.?|\bllb\b|\bbeng\b/i
const ALEVEL_PATTERN = /a-level|\bbtec\b|t-level/i
const GCSE_PATTERN = /\bgcse/i

// Exported for the Binder comparison page's "Easiest to start" highlight -
// higher weight = lower barrier (a career needing "no formal qualification"
// scores 40, a medical degree scores 1), same direction as its use below.
export function entryBarrierWeight(career: Career): number {
  const text = career.requirements.join(' ')
  if (MEDICAL_DEGREE_PATTERN.test(text)) return 1
  if (PHD_PATTERN.test(text)) return 3
  if (MASTERS_PATTERN.test(text)) return 8
  if (DEGREE_PATTERN.test(text)) return 15
  if (ALEVEL_PATTERN.test(text)) return 25
  if (GCSE_PATTERN.test(text)) return 30
  return 40 // no formal qualification mentioned
}

// --- B. Competition level ------------------------------------------------
// UK skills-shortage areas (healthcare, trades, engineering, tech, hospitality
// turnover, chronically understaffed public services) vs. famously
// oversubscribed fields (creative/media, sport) vs. everything else.
const HIGH_DEMAND_CATEGORIES = new Set([
  'Healthcare & Medicine',
  'Construction & Trades',
  'Engineering & Manufacturing',
  'Technology & Digital',
  'Service & Hospitality',
  'Public Services',
])
const OVERSATURATED_CATEGORIES = new Set(['Creative & Media', 'Sport & Leisure'])

function competitionWeight(career: Career, experienceLevel: ExperienceLevel): number {
  // The very top of any field is fiercely contested, regardless of how
  // in-demand the field is generally - so this check comes first.
  if (experienceLevel === 'executive') return 2
  if (OVERSATURATED_CATEGORIES.has(career.category)) return 2
  if (HIGH_DEMAND_CATEGORIES.has(career.category)) return 10
  return 5
}

// --- C. Experience required ----------------------------------------------
type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'executive'

const EXECUTIVE_PATTERN = /\bchief\b|\bceo\b|\bcfo\b|\bcio\b|\bciso\b|\bdirector\b|\bvp\b|\bpresident\b|superintendent/i
const SENIOR_PATTERN = /senior|consultant|head of|principal|\blead\b/i
const MID_PATTERN = /manager|specialist|coordinator|officer/i
const ENTRY_PATTERN = /trainee|apprentice|assistant|junior|entry/i

function experienceLevelOf(career: Career): ExperienceLevel {
  const title = career.title
  if (ENTRY_PATTERN.test(title)) return 'entry'
  if (EXECUTIVE_PATTERN.test(title)) return 'executive'
  if (SENIOR_PATTERN.test(title)) return 'senior'
  if (MID_PATTERN.test(title)) return 'mid'
  return 'junior' // ordinary, unqualified title - treat as an early-career role
}

const EXPERIENCE_WEIGHT: Record<ExperienceLevel, number> = {
  entry: 10,
  junior: 7,
  mid: 4,
  senior: 2,
  executive: 1,
}

// --- D. Salary (minor factor) ---------------------------------------------
function salaryWeight(career: Career): number {
  const avg = parseSalaryAvg(career.salary)
  if (avg < 30) return 8
  if (avg < 45) return 6
  if (avg < 65) return 4
  if (avg < 100) return 2
  return 1
}

// --- E. Geography / flexibility -------------------------------------------
const NICHE_LOCATION_CATEGORIES = new Set(['Agriculture & Animal Care'])
const MAJOR_CITY_CATEGORIES = new Set(['Business & Finance'])
const MAJOR_CITY_TITLE_PATTERN = /pilot|air traffic|investment banker|stockbroker|broker|barrister/i
const REMOTE_TAG_PATTERN = /remote friendly|work from home/i

function geographyWeight(career: Career): number {
  // A career explicitly tagged remote/work-from-home is nationwide by
  // definition, regardless of what its category would otherwise suggest.
  if ((career.supportTags ?? []).some((tag) => REMOTE_TAG_PATTERN.test(tag))) return 5
  if (NICHE_LOCATION_CATEGORIES.has(career.category)) return 1
  if (MAJOR_CITY_TITLE_PATTERN.test(career.title) || MAJOR_CITY_CATEGORIES.has(career.category)) return 2
  return 5
}

export function computeRollWeight(career: Career): number {
  const experienceLevel = experienceLevelOf(career)
  return (
    entryBarrierWeight(career) +
    competitionWeight(career, experienceLevel) +
    EXPERIENCE_WEIGHT[experienceLevel] +
    salaryWeight(career) +
    geographyWeight(career)
  )
}
