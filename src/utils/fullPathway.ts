import type { Career } from '../data/demoCareers'
import subjectsData from '../data/subjects.json'

export interface Subject {
  id: string
  label: string
  description: string
  category: string
}

const subjectsById = new Map<string, Subject>(subjectsData.map((subject) => [subject.id, subject]))

/** The 4 level cards this feature applies to, in SubjectSelectionPage's own `level.key` vocabulary. */
export type PathwayStartLevel = 'gcse' | 'a-level' | 'tlevel' | 'university'

export interface PathwayGroup {
  label: string
  subjects: Subject[]
}

export interface PathwayStep {
  key: string
  stepNumber: number
  levelLabel: string
  groups: PathwayGroup[]
  timeEstimate: string
  whyThisStep: string
}

// Wall-of-pills protection - a popular career's matchedSubjects can list
// 7+ university courses alone (e.g. Software Developer). Capped per group,
// not because more correlation doesn't exist, but because a step nobody can
// visually scan isn't actually useful. Same reasoning as MAX_CHILDREN in
// the Career Smasher tree.
const MAX_SUBJECTS_PER_GROUP = 6

// Rough, standard UK education timings - not derived per-subject (this data
// set has no per-course duration field), just the typical span for that
// qualification level as a whole.
const TIME_ESTIMATES: Record<string, string> = {
  GCSE: '2 years (Years 10-11)',
  Post16: '2 years',
  University: '3-4 years',
  Masters: '1-2 years',
}

/** career.matchedSubjects, resolved to full Subject records and grouped by
 * subjects.json's own `category` field (GCSE / A-Level / Vocational /
 * T-Level / University / Masters / ...). This IS the correlation - every
 * subject in this list was already hand-curated as relevant to this
 * specific career, across every level at once, so grouping by category is
 * enough to answer "what should I take at level N for this career" without
 * a separate subject-to-subject adjacency graph the underlying data
 * doesn't have. */
function groupCareerSubjectsByCategory(career: Career): Record<string, Subject[]> {
  const groups: Record<string, Subject[]> = {}
  for (const id of career.matchedSubjects) {
    const subject = subjectsById.get(id)
    if (!subject) continue
    const bucket = (groups[subject.category] ??= [])
    if (bucket.length < MAX_SUBJECTS_PER_GROUP) bucket.push(subject)
  }
  return groups
}

function group(label: string, subjects: Subject[] | undefined): PathwayGroup {
  return { label, subjects: subjects ?? [] }
}

/** Which of the career's own `backtrackPathways` entries to follow, when it
 * has more than one - e.g. the same career reachable via a straight
 * academic route or an apprenticeship. 'university' (or whichever single
 * route the career actually has) is the default; 'vocational' swaps the
 * Post-16-through-degree steps for that pathway's own apprenticeship
 * subjects/duration instead. */
export type PathwayRoute = 'university' | 'vocational'

/** Builds the ordered step chain from `startLevel` through to `career`,
 * using ONLY subjects that are already in career.matchedSubjects (real
 * curated data, nothing invented). Steps with zero subjects across every
 * one of their groups are still returned (so the timeline stays
 * continuous) - the modal renders those as an empty-state, same pattern as
 * the Career Smasher tree's "No skill data yet" nodes.
 *
 * `route` only changes anything when starting from GCSE and the career
 * actually has a 'vocational' backtrackPathways entry - an apprenticeship
 * route replaces Post-16 + Undergraduate with its own single step (the
 * apprenticeship itself, not a precursor to one), since that's what makes
 * it a genuinely alternate branch rather than just the same degree route
 * with different Post-16 pills. */
export function buildPathwaySteps(career: Career, startLevel: PathwayStartLevel, route: PathwayRoute = 'university'): PathwayStep[] {
  const byCategory = groupCareerSubjectsByCategory(career)
  const steps: PathwayStep[] = []
  let stepNumber = 1

  if (startLevel === 'gcse') {
    steps.push({
      key: 'gcse',
      stepNumber: stepNumber++,
      levelLabel: 'GCSE',
      groups: [group('GCSE subjects', byCategory.GCSE)],
      timeEstimate: TIME_ESTIMATES.GCSE,
      whyThisStep: `These GCSE subjects build the foundation ${career.title} needs and keep the right Post-16 options open.`,
    })

    const vocationalPathway = career.backtrackPathways.find((pathway) => pathway.type === 'vocational')
    if (route === 'vocational' && vocationalPathway) {
      const vocationalSubjects = vocationalPathway.subjects
        .map((id) => subjectsById.get(id))
        .filter((subject): subject is Subject => Boolean(subject))
        .slice(0, MAX_SUBJECTS_PER_GROUP)
      steps.push({
        key: 'vocational',
        stepNumber: stepNumber++,
        levelLabel: vocationalPathway.name,
        groups: [group('Recommended subjects', vocationalSubjects)],
        timeEstimate: vocationalPathway.duration,
        whyThisStep: `${vocationalPathway.description} Entry requirements: ${vocationalPathway.entryRequirements}.`,
      })
      return steps
    }

    steps.push({
      key: 'post16',
      stepNumber: stepNumber++,
      levelLabel: 'Post-16 (A-Levels, BTECs & T-Levels)',
      groups: [
        group('A-Levels', byCategory['A-Level']),
        group('BTEC / Vocational', byCategory.Vocational),
        group('T-Levels', byCategory['T-Level']),
      ],
      timeEstimate: TIME_ESTIMATES.Post16,
      whyThisStep: `Any of these Post-16 routes carry your GCSE foundation forward into the qualifications ${career.title} actually looks for.`,
    })
  } else if (startLevel === 'a-level') {
    steps.push({
      key: 'a-level',
      stepNumber: stepNumber++,
      levelLabel: 'A-Levels & BTECs',
      groups: [group('A-Levels', byCategory['A-Level']), group('BTEC / Vocational', byCategory.Vocational)],
      timeEstimate: TIME_ESTIMATES.Post16,
      whyThisStep: `These are the A-Level and BTEC subjects that line up with ${career.title}'s usual entry requirements.`,
    })
  } else if (startLevel === 'tlevel') {
    steps.push({
      key: 'tlevel',
      stepNumber: stepNumber++,
      levelLabel: 'T-Levels',
      groups: [group('T-Levels', byCategory['T-Level'])],
      timeEstimate: TIME_ESTIMATES.Post16,
      whyThisStep: `T-Levels combine classroom study with an industry placement, giving direct, hands-on experience toward ${career.title}.`,
    })
  }

  // University appears for every start level except when we're already
  // starting AT university.
  if (startLevel !== 'university') {
    steps.push({
      key: 'university',
      stepNumber: stepNumber++,
      levelLabel: 'Undergraduate',
      groups: [group('Degree options', byCategory.University)],
      timeEstimate: TIME_ESTIMATES.University,
      whyThisStep: `These degrees are the direct route from here into ${career.title}.`,
    })
  } else {
    steps.push({
      key: 'university',
      stepNumber: stepNumber++,
      levelLabel: 'Undergraduate',
      groups: [group('Degree options', byCategory.University)],
      timeEstimate: TIME_ESTIMATES.University,
      whyThisStep: `The degree itself, and the most direct route into ${career.title}.`,
    })
    // Only add a Masters step if this career actually has postgrad-tagged
    // subjects - most don't, and an always-empty step would just be noise.
    if ((byCategory.Masters?.length ?? 0) > 0) {
      steps.push({
        key: 'masters',
        stepNumber: stepNumber++,
        levelLabel: "Postgrad (Master's)",
        groups: [group("Master's / conversion courses", byCategory.Masters)],
        timeEstimate: TIME_ESTIMATES.Masters,
        whyThisStep: `A relevant Master's can deepen or convert your degree specifically toward ${career.title}.`,
      })
    }
  }

  return steps
}

export const START_LEVEL_LABELS: Record<PathwayStartLevel, string> = {
  gcse: 'GCSE',
  'a-level': 'A-Levels & BTECs',
  tlevel: 'T-Levels',
  university: 'Undergraduate',
}
