import demoCareers, { type Career } from '../data/demoCareers'
import { CAREER_SKILLS } from '../data/careerSkills'

// Job node <-> skill node, alternating levels. Depth 0 is always the root
// job. Odd depths are skill nodes, even depths (>0) are job nodes.
export interface JobNodeData {
  type: 'job'
  career: Career
}
export interface SkillNodeData {
  type: 'skill'
  name: string
}
export type TreeNodeData = JobNodeData | SkillNodeData

// Hard backstop per the brief ("limit to 3-4 levels deep to prevent
// infinite loops") - root (0) + 4 more levels of expansion (1-4), so at
// most job -> skill -> job -> skill -> job, five tiers total. Nodes at
// MAX_DEPTH render without any further expand affordance.
export const MAX_DEPTH = 4
// Cap on how many children one expansion reveals - a popular skill like
// "Attention to Detail" is shared by dozens of careers in this data set;
// showing all of them at once would make the tree unreadable long before
// the depth cap ever mattered. Deliberately not the sketch's "fan out in
// an arc" for an unbounded child count - a fixed cap is what keeps the
// layout algorithm (see CareerSmasherTree.tsx) simple and the tree legible.
export const MAX_CHILDREN = 5

let careerById: Map<number, Career> | null = null
function getCareerById(id: number): Career | undefined {
  if (!careerById) careerById = new Map(demoCareers.map((c) => [c.id, c]))
  return careerById.get(id)
}

// skill -> which careers need it, INVERTED from CAREER_SKILLS (careerId ->
// skills) rather than hand-authored separately - one source of truth, so
// editing a career's skill list can't silently leave the reverse map out
// of sync the way two independently-maintained maps could.
let skillToCareerIds: Map<string, number[]> | null = null
function getSkillToCareerIds(): Map<string, number[]> {
  if (skillToCareerIds) return skillToCareerIds
  const map = new Map<string, number[]>()
  for (const [careerIdStr, skills] of Object.entries(CAREER_SKILLS)) {
    const careerId = Number(careerIdStr)
    for (const skill of skills) {
      const existing = map.get(skill)
      if (existing) existing.push(careerId)
      else map.set(skill, [careerId])
    }
  }
  skillToCareerIds = map
  return map
}

export function getSkillsForCareer(careerId: number): string[] {
  return CAREER_SKILLS[careerId] ?? []
}

/** Careers that need `skill`, excluding anything already in `excludeIds`
 * (the current branch's own ancestor chain - stops a job leading back to
 * itself one hop later, e.g. Journalist -> Writing -> Journalist), capped
 * at MAX_CHILDREN. */
export function getCareersForSkill(skill: string, excludeIds: Set<number>): Career[] {
  const ids = getSkillToCareerIds().get(skill) ?? []
  const careers: Career[] = []
  for (const id of ids) {
    if (excludeIds.has(id)) continue
    const career = getCareerById(id)
    if (career) careers.push(career)
    if (careers.length >= MAX_CHILDREN) break
  }
  return careers
}

/** Skills for `careerId`, excluding anything already in `excludeSkills`
 * (same cycle-prevention as getCareersForSkill, for the other direction). */
export function getSkillsExcluding(careerId: number, excludeSkills: Set<string>): string[] {
  return getSkillsForCareer(careerId)
    .filter((skill) => !excludeSkills.has(skill))
    .slice(0, MAX_CHILDREN)
}

// One accent per category - reused for the root pill's fill and every job
// node's border further down the tree (a job node's own category always
// resolves cleanly, unlike a skill node's, which could be reached through
// branches from several different categories at once - see CareerSmasherTree.tsx
// for why skill nodes stay a single neutral tint instead of trying to
// inherit a category color).
export const CATEGORY_COLOR: Record<string, { solid: string; text: string; border: string; ring: string }> = {
  'Technology & Digital': { solid: 'bg-indigo-600', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-500', ring: 'ring-indigo-400' },
  'Business & Finance': { solid: 'bg-emerald-600', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-500', ring: 'ring-emerald-400' },
  'Healthcare & Medicine': { solid: 'bg-rose-600', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-500', ring: 'ring-rose-400' },
  'Engineering & Manufacturing': { solid: 'bg-amber-600', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-500', ring: 'ring-amber-400' },
  'Creative & Media': { solid: 'bg-purple-600', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-500', ring: 'ring-purple-400' },
  'Education & Training': { solid: 'bg-sky-600', text: 'text-sky-700 dark:text-sky-400', border: 'border-sky-500', ring: 'ring-sky-400' },
  'Service & Hospitality': { solid: 'bg-pink-600', text: 'text-pink-700 dark:text-pink-400', border: 'border-pink-500', ring: 'ring-pink-400' },
  'Agriculture & Animal Care': { solid: 'bg-lime-600', text: 'text-lime-700 dark:text-lime-400', border: 'border-lime-500', ring: 'ring-lime-400' },
  'Sport & Leisure': { solid: 'bg-orange', text: 'text-orange', border: 'border-orange', ring: 'ring-orange' },
  'Construction & Trades': { solid: 'bg-stone-600', text: 'text-stone-700 dark:text-stone-400', border: 'border-stone-500', ring: 'ring-stone-400' },
  'Public Services': { solid: 'bg-blue-600', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-500', ring: 'ring-blue-400' },
  'Science & Research': { solid: 'bg-teal-600', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-500', ring: 'ring-teal-400' },
}

const FALLBACK_COLOR = { solid: 'bg-slate-600', text: 'text-slate-700 dark:text-slate-400', border: 'border-slate-500', ring: 'ring-slate-400' }

export function getCategoryColor(category: string) {
  return CATEGORY_COLOR[category] ?? FALLBACK_COLOR
}
