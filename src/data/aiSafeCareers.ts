// The counterpart to aiEndangeredJobs.ts - real UK job categories least
// exposed to AI/automation, for the "Careers Least at Risk from AI"
// section on JobMarketAiEndangeredJobsPage. Every occupation here now
// links to a real PathScrawler career (demoCareers.js ids 140-158 were
// written specifically to fill the gaps, alongside the handful - Nurses,
// Chefs, Police etc. - that already existed).

export interface AiSafeOccupation {
  name: string
  careerId?: number
}

export interface AiSafeCategory {
  name: string
  occupations: AiSafeOccupation[]
}

export const aiSafeReasons: { label: string; detail: string }[] = [
  {
    label: 'Physical unpredictability',
    detail: 'Real-world sites and situations change too much moment to moment for a model to plan around in advance.',
  },
  {
    label: 'Manual dexterity',
    detail: 'Fine motor skill and hands-on work with tools and materials is still far beyond what robotics can reliably do.',
  },
  {
    label: 'Human judgment',
    detail: 'High-stakes calls made under uncertainty, with incomplete information, still need a person to own the decision.',
  },
  {
    label: 'Real-time adaptation',
    detail: 'Work that shifts by the minute - a different customer, patient or hazard - resists being scripted in advance.',
  },
  {
    label: 'Creative physical work',
    detail: 'Skilled hands-on craft and improvisation combine judgment and dexterity in ways that are hard to automate together.',
  },
  {
    label: 'Presence-based care',
    detail: 'Roles built on being physically and emotionally present with another person - comfort, trust, touch - are not a software problem.',
  },
]

export const aiSafeCategories: AiSafeCategory[] = [
  {
    name: 'Construction Trades',
    occupations: [
      { name: 'Roofers', careerId: 140 },
      { name: 'Plasterers', careerId: 141 },
      { name: 'Electricians', careerId: 142 },
      { name: 'Plumbers', careerId: 143 },
      { name: 'Carpenters', careerId: 144 },
      { name: 'Bricklayers', careerId: 145 },
      { name: 'Construction Trades Worker', careerId: 89 },
    ],
  },
  {
    name: 'Healthcare & Care',
    occupations: [
      { name: 'Nurses', careerId: 22 },
      { name: 'Care Workers', careerId: 73 },
      { name: 'Paramedics', careerId: 23 },
      { name: 'Midwives', careerId: 30 },
      { name: 'Pharmacists', careerId: 24 },
      { name: 'Dental Nurses', careerId: 146 },
    ],
  },
  {
    name: 'Emergency & Security',
    occupations: [
      { name: 'Police', careerId: 90 },
      { name: 'Fire Service', careerId: 147 },
      { name: 'Security Guards', careerId: 148 },
    ],
  },
  {
    name: 'Personal Services',
    occupations: [
      { name: 'Hairdressers', careerId: 79 },
      { name: 'Chefs', careerId: 86 },
      { name: 'Cleaners', careerId: 149 },
      { name: 'Childcare', careerId: 150 },
    ],
  },
  {
    name: 'Sports & Physical',
    occupations: [
      { name: 'Sports Professionals', careerId: 151 },
      { name: 'Coaches', careerId: 88 },
      { name: 'Fitness Instructors', careerId: 152 },
    ],
  },
  {
    name: 'Social & Community',
    occupations: [
      { name: 'Social Workers', careerId: 153 },
      { name: 'Counsellors', careerId: 154 },
      { name: 'Youth Workers', careerId: 155 },
      { name: 'Clergy', careerId: 156 },
    ],
  },
  {
    name: 'Agriculture & Manual',
    occupations: [
      { name: 'Farm Workers', careerId: 83 },
      { name: 'Fishing', careerId: 157 },
      { name: 'Refuse Collectors', careerId: 158 },
    ],
  },
]

export const aiSafeExposure: { sector: string; exposure: number }[] = [
  { sector: 'Maintenance & repair', exposure: 4 },
  { sector: 'Construction trades', exposure: 6.5 },
  { sector: 'Healthcare delivery', exposure: 8 },
  { sector: 'Personal services', exposure: 12.5 },
  { sector: 'Emergency services', exposure: 13.5 },
  { sector: 'Agriculture', exposure: 17.5 },
  { sector: 'Arts & entertainment', exposure: 17.5 },
]

export const aiSafeHeadlineStat = 'Construction trades face only ~6% AI task exposure.'

export const aiSafeSource =
  'Data sourced from UK Government / DfE - Assessment of AI capabilities and the impact on the UK labour market (2026).'
