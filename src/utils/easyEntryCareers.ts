import demoCareers from '../data/demoCareers'
import type { Career } from '../data/demoCareers'

// There's no `entryRequirements`/`easeOfEntry` field on Career, and the
// category names this feature was originally briefed against ("Retail",
// "Driving & Logistics", "Construction (Entry)", ...) don't match the real
// 12 categories in demoCareers.js. Rather than inventing a field with
// per-career judgment calls baked in as if it were data, this derives
// "easy to get into" from what's actually there: the real requirements
// text and the real supportTags. See classifyEntry() for exactly what that
// means and where it's a deliberate simplification.

export type EntryBarrier = 'very-easy' | 'easy'
export type FilterKey = 'all' | 'quick-cert' | 'apprenticeship' | 'part-time'

export interface EasyEntryCareer {
  career: Career
  barrier: EntryBarrier
  qualificationLabel: string
  timeToStart: string
  whyEasy: string
  isApprenticeship: boolean
  isPartTimeFriendly: boolean
}

const DEGREE_PATTERN = /\bdegree\b|postgraduate|\bphd\b|doctorate|master'?s/i
const APPRENTICESHIP_PATTERN = /apprenticeship/i
const VOCATIONAL_PATTERN =
  /\bnvq\b|qualification|certif|\bcerts?\b|comptia|diploma|college course|vocational|\blevel [0-9]|\bbtec\b|bootcamp|portfolio/i
// A standalone "Experience in ..."/"Experience of ..." bullet is a real
// barrier even with zero formal qualifications attached to it - it's asking
// for prior work history, which takes time to build regardless of whether
// any course or degree is involved. Matched per-requirement (not against
// the whole joined blob) so it only fires on a dedicated "you need
// experience" bullet, not a stray use of the word elsewhere.
const EXPERIENCE_REQUIRED_PATTERN = /^(industry )?experience (in|of)\b/i
// A role that pays up to £55k+ almost never has a genuinely "walk in with
// no background" barrier even when its requirements text doesn't happen to
// say "degree" - this is what actually caught "Ethical Hacker" (£30k-£65k,
// "Certs + Experience"), which the keyword scan alone let through.
const HIGH_CEILING_SALARY = 55

// A career only counts as low-barrier if NOTHING in its requirements
// mentions a degree - including "X qualification or degree" phrasing. A
// real "or degree" alternative route does exist for a couple of these
// (Veterinary Nurse, Event Manager), but a plain keyword scan can't tell
// "degree is one option" from "degree is required" apart reliably, and
// excluding them is the safer direction to be wrong in for a page whose
// whole promise is "you won't need one of these".
function classifyEntry(career: Career): EntryBarrier | null {
  const text = career.requirements.join(' ')
  if (DEGREE_PATTERN.test(text)) return null
  if (career.requirements.some((requirement) => EXPERIENCE_REQUIRED_PATTERN.test(requirement.trim()))) return null
  if (parseSalaryUpperBound(career.salary) > HIGH_CEILING_SALARY) return null
  return VOCATIONAL_PATTERN.test(text) || APPRENTICESHIP_PATTERN.test(text) ? 'easy' : 'very-easy'
}

function buildQualificationLabel(career: Career, barrier: EntryBarrier): string {
  const text = career.requirements.join(' ')
  if (barrier === 'very-easy') return 'GCSEs / on-the-job'
  if (APPRENTICESHIP_PATTERN.test(text)) return 'Apprenticeship'
  if (/\bnvq\b/i.test(text)) return 'NVQ'
  if (/\bbtec\b/i.test(text)) return 'BTEC'
  if (/bootcamp/i.test(text)) return 'Bootcamp / self-taught'
  if (/portfolio/i.test(text)) return 'Portfolio'
  if (/college course/i.test(text)) return 'College course'
  if (/comptia/i.test(text)) return 'Industry certificate'
  return 'Short vocational course'
}

function estimateTimeToStart(barrier: EntryBarrier, isApprenticeship: boolean): string {
  if (barrier === 'very-easy') return 'Immediate'
  return isApprenticeship ? 'A few months (apprenticeship)' : 'A few weeks (short course)'
}

function buildWhyEasy(barrier: EntryBarrier, isApprenticeship: boolean, qualificationLabel: string): string {
  if (barrier === 'very-easy') {
    return 'No formal qualifications beyond GCSEs - most employers train you on the job.'
  }
  if (isApprenticeship) {
    return "You earn while you train through a paid apprenticeship - no degree, no upfront course fees."
  }
  return `A ${qualificationLabel.toLowerCase()} gets you in - weeks, not years, and no degree required.`
}

function parseSalaryUpperBound(salary: string): number {
  const matches = salary.match(/\d+(?:\.\d+)?/g)
  if (!matches) return 0
  return Math.max(...matches.map((value) => Number.parseFloat(value)))
}

// "Part-time friendly" has no literal field either - the closest honest
// signal in the data is the Remote friendly / Work from home supportTags,
// which (unlike "Flexible hours", present on all 83 careers and therefore
// useless as a filter) actually differ from career to career.
function isPartTimeFriendly(career: Career): boolean {
  const tags = career.supportTags ?? []
  return tags.includes('Remote friendly') || tags.includes('Work from home')
}

const BARRIER_RANK: Record<EntryBarrier, number> = { 'very-easy': 0, easy: 1 }

let cachedList: EasyEntryCareer[] | null = null

export function getEasyEntryCareers(): EasyEntryCareer[] {
  if (cachedList) return cachedList

  const entries: EasyEntryCareer[] = []
  for (const career of demoCareers) {
    const barrier = classifyEntry(career)
    if (!barrier) continue
    const isApprenticeship = APPRENTICESHIP_PATTERN.test(career.requirements.join(' '))
    const qualificationLabel = buildQualificationLabel(career, barrier)
    entries.push({
      career,
      barrier,
      qualificationLabel,
      timeToStart: estimateTimeToStart(barrier, isApprenticeship),
      whyEasy: buildWhyEasy(barrier, isApprenticeship, qualificationLabel),
      isApprenticeship,
      isPartTimeFriendly: isPartTimeFriendly(career),
    })
  }

  entries.sort((a, b) => {
    if (BARRIER_RANK[a.barrier] !== BARRIER_RANK[b.barrier]) return BARRIER_RANK[a.barrier] - BARRIER_RANK[b.barrier]
    return parseSalaryUpperBound(b.career.salary) - parseSalaryUpperBound(a.career.salary)
  })

  cachedList = entries
  return entries
}

export function filterEasyEntryCareers(entries: EasyEntryCareer[], filter: FilterKey): EasyEntryCareer[] {
  switch (filter) {
    case 'quick-cert':
      return entries.filter((entry) => entry.barrier === 'easy' && !entry.isApprenticeship)
    case 'apprenticeship':
      return entries.filter((entry) => entry.isApprenticeship)
    case 'part-time':
      return entries.filter((entry) => entry.isPartTimeFriendly)
    case 'all':
    default:
      return entries
  }
}
