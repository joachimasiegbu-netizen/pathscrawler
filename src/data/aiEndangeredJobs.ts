// Real UK job categories most exposed to AI/automation (2025-2026) - see
// PathScrawler_AI_Endangered_Jobs.txt for the original source list. careerId
// is a manual match against demoCareers.js. The 5 that had no match now
// have their own new career entries (ids 135-139) written specifically for
// this page, rather than a fuzzy/guessed match against an unrelated
// existing career.

export interface AiEndangeredJob {
  title: string
  careerId?: number
}

export const aiEndangeredJobs: AiEndangeredJob[] = [
  { title: 'Bookkeepers / payroll clerks / wage clerks', careerId: 74 },
  { title: 'Data entry & records clerks', careerId: 71 },
  { title: 'Customer service reps (especially chat / text-based)', careerId: 75 },
  { title: 'Administrative / secretarial / clerical roles', careerId: 95 },
  { title: 'Telephone sales / telemarketers', careerId: 135 },
  { title: 'Travel agents', careerId: 136 },
  { title: 'Junior / routine software developers', careerId: 137 },
  { title: 'Legal secretaries & junior paralegals', careerId: 138 },
  { title: 'Translators (routine work)', careerId: 139 },
]

export const aiEndangeredNotes = [
  'These roles are repeatedly flagged by IPPR, Microsoft Research, GLA London reports, and employer surveys as having high AI exposure.',
  'Routine cognitive, text-based, and entry-level knowledge work is currently the most vulnerable category.',
]
