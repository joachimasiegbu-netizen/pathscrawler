import type { Career } from './demoCareers'

export interface BacktrackCategory {
  key: string
  label: string
  description: string
  match: (career: Career) => boolean
}

const AI_DATA_TITLES = new Set(['AI/Machine Learning Engineer', 'Data Analyst', 'Database Administrator'])

export const backtrackCategories: BacktrackCategory[] = [
  {
    key: 'science-research',
    label: 'Science & Research',
    description: 'Research, experiments and scientific discovery.',
    match: (career) => career.category === 'Science & Research',
  },
  {
    key: 'law-justice',
    label: 'Law & Justice',
    description: 'Legal advice, policing and public protection.',
    match: (career) => career.title === 'Legal Advisor' || career.category === 'Public Services',
  },
  {
    key: 'forensics',
    label: 'Forensics',
    description: 'Investigate evidence and solve cases with science.',
    match: (career) => /forensic/i.test(career.title) || /forensic/i.test(career.description),
  },
  {
    key: 'it-technology',
    label: 'IT & Technology',
    description: 'Build and maintain the software and systems we rely on.',
    match: (career) => career.category === 'Technology & Digital',
  },
  {
    key: 'ai-data',
    label: 'AI & Data',
    description: 'Turn data into insight and build intelligent systems.',
    match: (career) => AI_DATA_TITLES.has(career.title),
  },
  {
    key: 'healthcare-medicine',
    label: 'Healthcare & Medicine',
    description: "Care for people's health and wellbeing.",
    match: (career) => career.category === 'Healthcare & Medicine',
  },
  {
    key: 'engineering',
    label: 'Engineering',
    description: 'Design, build and maintain the world around us.',
    match: (career) => career.category === 'Engineering & Manufacturing',
  },
  {
    key: 'business-finance',
    label: 'Business & Finance',
    description: 'Manage money, strategy and organisations.',
    match: (career) => career.category === 'Business & Finance',
  },
  {
    key: 'creative-media',
    label: 'Creative & Media',
    description: 'Design, tell stories and create content.',
    match: (career) => career.category === 'Creative & Media',
  },
  {
    key: 'education-training',
    label: 'Education & Training',
    description: 'Teach, support and develop others.',
    match: (career) => career.category === 'Education & Training',
  },
  {
    key: 'construction-trades',
    label: 'Construction & Trades',
    description: 'Build and maintain the places we live and work.',
    match: (career) => career.category === 'Construction & Trades',
  },
  {
    key: 'hospitality-tourism',
    label: 'Hospitality & Tourism',
    description: 'Deliver great food, stays and experiences.',
    match: (career) => career.category === 'Service & Hospitality',
  },
]

export function getBacktrackCategory(key: string | undefined): BacktrackCategory | undefined {
  return backtrackCategories.find((category) => category.key === key)
}

export function careersForCategory(key: string | undefined, careers: Career[]): Career[] {
  const category = getBacktrackCategory(key)
  if (!category) return []
  return careers.filter((career) => category.match(career))
}
