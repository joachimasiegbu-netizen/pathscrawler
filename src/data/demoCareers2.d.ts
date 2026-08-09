import type { BacktrackPathway, Career, CourseLink } from './demoCareers'

export type { BacktrackPathway, CourseLink }

export interface Career2 extends Career {
  hardSkills: string[]
  softSkills: string[]
}

declare const demoCareers2: Career2[]
export default demoCareers2
