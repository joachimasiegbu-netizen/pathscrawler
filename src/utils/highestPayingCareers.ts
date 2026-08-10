import demoCareers from '../data/demoCareers'
import type { Career } from '../data/demoCareers'

// This page is built on the ~38 careers in demoCareers.js whose `salary`
// field carries verified UK ONS ASHE 2025 occupation-level median and
// top-10%-earner figures (spot-checked via live web search against
// third-party citations of the same ONS dataset before being added). Every
// other career in demoCareers.js keeps its original illustrative salary
// range and is deliberately left out of this page rather than mixed in
// alongside figures with real evidence behind them. IDs below are: the 10
// pre-existing careers whose salary field was updated (Cloud Architect,
// AI/ML Engineer, Accountant, Investment Banker, Pharmacist, Dentist,
// Mechanical Engineer, Electrical Engineer, Quantity Surveyor, University
// Lecturer), plus 28 newly added senior/specialist careers.
const VERIFIED_HIGH_PAYING_IDS = [
  7, 8, 12, 19, 24, 27, 32, 33, 37, 49, 97, 98, 99, 100, 101, 102, 103, 104,
  105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
  120, 121, 122, 123, 124,
]

export type SortOption = 'salary-desc' | 'salary-asc' | 'alpha'
export type FilterOption =
  | 'all'
  | 'no-degree'
  | 'under-5-years'
  | '100k-plus'
  | 'medicine'
  | 'tech'
  | 'finance'
  | 'engineering'

export const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'salary-desc', label: 'Salary (high → low)' },
  { key: 'salary-asc', label: 'Salary (low → high)' },
  { key: 'alpha', label: 'A-Z' },
]

export const FILTER_OPTIONS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'no-degree', label: 'No degree needed' },
  { key: 'under-5-years', label: 'Under 5 years training' },
  { key: '100k-plus', label: '£100k+' },
  { key: 'medicine', label: 'Medicine' },
  { key: 'tech', label: 'Tech' },
  { key: 'finance', label: 'Finance' },
  { key: 'engineering', label: 'Engineering' },
]

export interface PathwayStep {
  label: string
  title: string
  detail: string
  salary: string
}

export interface HighestPayingCareer {
  career: Career
  rank: number
  totalCareers: number
  medianSalary: string
  peakSalary: string
  timeToSenior: string
  noDegreeNeeded: boolean
  whyItPaysWell: string
  negotiationTips: string[]
  sideIncome: string
  pathwaySteps: PathwayStep[]
}

function parseSalaryBounds(salary: string): { lower: number; upper: number; hasPlus: boolean } {
  const matches = salary.match(/\d+(?:\.\d+)?/g)
  if (!matches || matches.length === 0) return { lower: 0, upper: 0, hasPlus: false }
  const numbers = matches.map(Number)
  return { lower: Math.min(...numbers), upper: Math.max(...numbers), hasPlus: /\+/.test(salary) }
}

// The `salary` field on every verified career is written as
// '£{median}k - £{top10%}k[+]' (see the source comment above), so its own
// two numbers ARE the real median and top-10% figures - no interpolation
// needed for the headline numbers shown on the card.
function realMedianAndPeak(salary: string): { medianSalary: string; peakSalary: string } {
  const { lower, upper, hasPlus } = parseSalaryBounds(salary)
  return {
    medianSalary: `£${lower}k`,
    peakSalary: `£${upper}k${hasPlus ? '+' : ''}`,
  }
}

const DEGREE_PATTERN = /\bdegree\b|postgraduate|\bphd\b|doctorate|master'?s/i
const MEDICAL_DEGREE_PATTERN = /medical degree|nursing degree|dentistry degree|pharmacy degree|midwifery degree|dentistry\s|medicine\s|mbbs|bds/i
const APPRENTICESHIP_PATTERN = /apprenticeship|nats-|atpl-/i

// No real per-career training-duration dataset exists - labelled as an
// estimate in the UI, banded from what's already on the career (regulated/
// clinical training realistically takes longer than a standard degree).
function estimateTimeToSenior(career: Career): string {
  const text = career.requirements.join(' ')
  if (MEDICAL_DEGREE_PATTERN.test(text)) return '8-12 years'
  if (DEGREE_PATTERN.test(text)) return '6-9 years'
  if (APPRENTICESHIP_PATTERN.test(text)) return '4-6 years'
  return '5-7 years'
}

function isUnder5YearsTraining(career: Career): boolean {
  const estimate = estimateTimeToSenior(career)
  const firstNumber = Number(estimate.match(/\d+/)?.[0] ?? '99')
  return firstNumber < 5
}

// A career counts as "no degree needed" if it has at least one vocational
// (apprenticeship / certification-led) backtrack route on record, rather
// than text-matching the word "degree" in requirements - several roles
// here (e.g. IT Project Manager) list a degree as one option among others.
function hasNoDegreeRoute(career: Career): boolean {
  return career.backtrackPathways.some((pathway) => pathway.type === 'vocational')
}

const WHY_IT_PAYS_WELL: Record<string, string> = {
  'Technology & Digital':
    'Specialist technical skills are scarce relative to demand, and systems that break are expensive - experienced practitioners are paid a premium to keep things running and secure.',
  'Business & Finance':
    'These roles carry direct financial and regulatory responsibility. A costly mistake is easy to make without the right judgement, so employers pay for a proven track record.',
  'Healthcare & Medicine':
    'Years of regulated clinical training combined with a genuine shortage of qualified specialists push salaries up sharply once you reach consultant or senior level.',
  'Engineering & Manufacturing':
    'Safety-critical, technically demanding work needs chartered-level expertise, and there are consistently fewer qualified engineers than projects that need them.',
  'Education & Training':
    "Senior leadership posts are highly competitive, and pay scales with the size of what you're responsible for - a whole institution, not just a classroom.",
  'Public Services':
    'Senior leadership posts carry major operational and public accountability, which is reflected in the pay band even though entry-level roles in this sector pay modestly.',
  'Construction & Trades':
    "Large projects can't proceed without sign-off from a qualified, insured specialist - that scarcity and liability is what drives senior pay here.",
}
const DEFAULT_WHY_IT_PAYS_WELL =
  'This career combines specialist skills, real responsibility and steady demand - a combination that tends to be well rewarded.'

const NEGOTIATION_TIPS: Record<string, string[]> = {
  'Technology & Digital': [
    'Get certifications relevant to your specific stack (cloud, security, AI/ML)',
    'Consider contracting - day rates often beat an equivalent salaried role',
    'Specialise in a scarce niche rather than staying a generalist',
  ],
  'Business & Finance': [
    'Pursue a recognised professional qualification (ACA/ACCA/CFA or equivalent)',
    'Target London or another major financial centre, where pay bands run higher',
    'Build a specialism employers are actively competing to hire for',
  ],
  'Healthcare & Medicine': [
    "Move into a consultant or specialist post as soon as you're eligible",
    "Take on private practice or locum work where your registration allows it",
    'Consider roles in areas with acute staff shortages, which often pay more',
  ],
  'Engineering & Manufacturing': [
    'Get chartered status (e.g. CEng) - it unlocks senior pay bands',
    'Specialise in a high-demand area like renewables or safety-critical systems',
    'Consider contracting for major infrastructure projects',
  ],
  'Education & Training': [
    'Move into leadership (head of department, then senior leadership)',
    'Add exam-board examining or educational writing to your CV',
    'Consider international schools, which often pay significantly more',
  ],
  'Public Services': [
    'Pursue promotion boards and leadership qualifications as early as eligible',
    'Specialise in high-demand or high-risk areas that carry extra responsibility allowances',
    'Build a track record on major incidents or projects that gets you noticed',
  ],
  'Construction & Trades': [
    'Get chartered status (e.g. RICS, CIOB) - it unlocks senior pay bands',
    'Take on larger, higher-value projects as your track record builds',
    'Consider contracting for major developers or infrastructure schemes',
  ],
}
const DEFAULT_NEGOTIATION_TIPS = [
  'Build a track record employers can point to, not just a job title',
  'Look for professional accreditation relevant to your field',
  "Don't accept the first offer - it's rarely the ceiling",
]

const SIDE_INCOME: Record<string, string> = {
  'Technology & Digital': 'Freelance projects, consulting or technical writing are common - potentially an extra £5k-£20k a year.',
  'Business & Finance': "Consulting, non-executive board roles or mentoring can add extra income once you're established.",
  'Healthcare & Medicine': 'Private practice, locum shifts or medico-legal work are common additional income sources once qualified.',
  'Education & Training': 'Tutoring, examining, or writing educational materials are common ways to supplement income.',
  'Engineering & Manufacturing': 'Consulting or expert-witness work is available to experienced chartered engineers.',
  'Construction & Trades': 'Consulting or expert-witness work is available to experienced chartered surveyors and project managers.',
}
const DEFAULT_SIDE_INCOME =
  "Side income depends on your employer's policies - freelancing, consulting or teaching may be possible alongside this role."

function parseProgressionEntry(raw: string): { title: string; salary: string } {
  const match = raw.match(/^(.*)\(([^()]+)\)\s*$/)
  if (!match) return { title: raw.trim(), salary: '' }
  return { title: match[1].trim(), salary: match[2].trim() }
}

function buildPathwaySteps(career: Career): PathwayStep[] {
  const entryRoute = career.backtrackPathways[0]
  const steps = career.progression.map(parseProgressionEntry)
  const first = steps[0]
  const mid = steps[2] ?? steps[1]
  const last = steps[steps.length - 1]

  return [
    {
      label: 'Step 1 - Education / entry',
      title: entryRoute ? entryRoute.name : 'Entry qualification',
      detail: entryRoute
        ? `${entryRoute.entryRequirements} - ${entryRoute.duration}`
        : career.requirements[0] ?? 'Entry requirements vary by employer.',
      salary: first?.salary || 'Training / study period',
    },
    {
      label: 'Step 2 - First role',
      title: first?.title ?? career.title,
      detail: 'Your first role in the field - building the day-to-day experience everything after this is based on.',
      salary: first?.salary ?? '',
    },
    {
      label: 'Step 3 - Mid-level',
      title: mid?.title ?? career.title,
      detail: 'Level up through experience, certifications and a growing track record.',
      salary: mid?.salary ?? '',
    },
    {
      label: 'Step 4 - Senior / peak',
      title: last?.title ?? career.title,
      detail: 'Senior, lead or specialist positions, often with people-management or strategic responsibility.',
      salary: last?.salary || career.salary,
    },
  ]
}

let cachedRankById: Map<number, number> | null = null

function getRankMap(): Map<number, number> {
  if (cachedRankById) return cachedRankById
  const verified = demoCareers.filter((career) => VERIFIED_HIGH_PAYING_IDS.includes(career.id))
  const sorted = [...verified].sort((a, b) => parseSalaryBounds(b.salary).upper - parseSalaryBounds(a.salary).upper)
  cachedRankById = new Map(sorted.map((career, index) => [career.id, index + 1]))
  return cachedRankById
}

export function getHighestPayingCareers(
  sort: SortOption = 'salary-desc',
  filter: FilterOption = 'all',
): HighestPayingCareer[] {
  const rankById = getRankMap()
  const totalCareers = VERIFIED_HIGH_PAYING_IDS.length

  let list = demoCareers.filter((career) => VERIFIED_HIGH_PAYING_IDS.includes(career.id))

  switch (filter) {
    case 'no-degree':
      list = list.filter(hasNoDegreeRoute)
      break
    case 'under-5-years':
      list = list.filter(isUnder5YearsTraining)
      break
    case '100k-plus':
      list = list.filter((career) => parseSalaryBounds(career.salary).upper >= 100)
      break
    case 'medicine':
      list = list.filter((career) => career.category === 'Healthcare & Medicine')
      break
    case 'tech':
      list = list.filter((career) => career.category === 'Technology & Digital')
      break
    case 'finance':
      list = list.filter((career) => career.category === 'Business & Finance')
      break
    case 'engineering':
      list = list.filter((career) => career.category === 'Engineering & Manufacturing')
      break
    default:
      break
  }

  const sorted = [...list].sort((a, b) => {
    if (sort === 'alpha') return a.title.localeCompare(b.title)
    const diff = parseSalaryBounds(b.salary).upper - parseSalaryBounds(a.salary).upper
    return sort === 'salary-asc' ? -diff : diff
  })

  return sorted.map((career) => {
    const { medianSalary, peakSalary } = realMedianAndPeak(career.salary)
    return {
      career,
      rank: rankById.get(career.id) ?? 0,
      totalCareers,
      medianSalary,
      peakSalary,
      timeToSenior: estimateTimeToSenior(career),
      noDegreeNeeded: hasNoDegreeRoute(career),
      whyItPaysWell: WHY_IT_PAYS_WELL[career.category] ?? DEFAULT_WHY_IT_PAYS_WELL,
      negotiationTips: NEGOTIATION_TIPS[career.category] ?? DEFAULT_NEGOTIATION_TIPS,
      sideIncome: SIDE_INCOME[career.category] ?? DEFAULT_SIDE_INCOME,
      pathwaySteps: buildPathwaySteps(career),
    }
  })
}
