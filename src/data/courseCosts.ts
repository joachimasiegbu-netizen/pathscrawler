import subjectsData from './subjects.json'

// Course parameters for the Student Debt Calculator, built from the same
// undergraduate subject list the Undergraduate route uses (subjects.json,
// category "University"). English undergraduate tuition is capped at roughly
// the same figure for home students on essentially every course, so one
// number is used across the board; check gov.uk for the current cap. Course
// length varies (most are 3 years; medicine, dentistry and vet are longer).
// Starting salary is a rough average by field, and the calculator lets the
// user override every value.

export interface CoursePreset {
  id: string
  label: string
  tuitionPerYear: number
  years: number
  /** Rough average graduate starting salary (£) for this field. */
  typicalStartingSalary: number
}

const HOME_UNDERGRAD_TUITION = 9790

function yearsForCourse(label: string): number {
  if (/\b(MBBS|BDS|BVetMed)\b/.test(label)) return 5
  if (/\b(MPharm|MEng)\b/.test(label)) return 4
  return 3
}

function startingSalaryForCourse(label: string): number {
  const l = label.toLowerCase()
  if (/medicine|mbbs/.test(l)) return 33000
  if (/dentist|dental|bds/.test(l)) return 34000
  if (/vet\b|veterinary/.test(l)) return 32000
  if (/nursing|midwif|paramedic|physiother|radiograph|occupational therapy|dietet|speech|operating department|pharmac/.test(l)) return 28000
  if (/comput|software|cyber|data sci|artificial intel|information tech|web dev|game dev|network eng|virtual reality|augmented reality/.test(l)) return 30000
  if (/engineer|mechatron|robotic/.test(l)) return 30000
  if (/teaching|primary education|secondary education|special educational needs/.test(l)) return 30000
  if (/economic|finance|account|actuar/.test(l)) return 28000
  if (/law|llb/.test(l)) return 25000
  if (/business|marketing|management|human resource|supply chain|entrepreneur|international business/.test(l)) return 25000
  if (/polic|fire\b|rescue|emergency|disaster|public admin|local government/.test(l)) return 26000
  if (/psycholog|counsel|psychotherap/.test(l)) return 24000
  if (/social work|youth work|sociolog|anthropolog|development studies|gender studies|disability studies/.test(l)) return 24000
  if (/biomed|biochem|microbiol|forensic|environmental sci|marine biolog|physics|astrophys|chemistry|biolog|geolog|meteorolog|materials sci|nanotech|mathematic|maths/.test(l)) return 25000
  if (/architect|urban planning|landscape/.test(l)) return 24000
  if (/nutrition|food science|sports science|sports therap|exercise|coaching/.test(l)) return 23000
  if (/design|animation|fashion|film|music production|creative writing|journalism|photograph|theatre|dance|art history|game design/.test(l)) return 22000
  if (/hospitality|hotel|event management|tourism|culinary/.test(l)) return 22000
  if (/history|philosoph|english lit|english lang|literature|classic|medieval|linguist|modern languages|translat/.test(l)) return 23000
  if (/education studies|early childhood|tesol|tefl/.test(l)) return 24000
  return 24000
}

export const UNDERGRAD_COURSES: CoursePreset[] = (subjectsData as { id: string; label: string; category: string }[])
  .filter((s) => s.category === 'University')
  .map((s) => ({
    id: s.id,
    label: s.label.replace(/^University\s+/, ''),
    tuitionPerYear: HOME_UNDERGRAD_TUITION,
    years: yearsForCourse(s.label),
    typicalStartingSalary: startingSalaryForCourse(s.label),
  }))
  .sort((a, b) => a.label.localeCompare(b.label))

/** Used as the starting state before a course is picked. */
export const DEFAULT_COURSE: CoursePreset = {
  id: 'generic',
  label: 'A typical 3-year degree',
  tuitionPerYear: HOME_UNDERGRAD_TUITION,
  years: 3,
  typicalStartingSalary: 25000,
}

export function courseById(id: string): CoursePreset {
  return UNDERGRAD_COURSES.find((c) => c.id === id) ?? DEFAULT_COURSE
}

export function searchCourses(query: string, limit = 8): CoursePreset[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  return UNDERGRAD_COURSES.filter((c) => c.label.toLowerCase().includes(q)).slice(0, limit)
}
