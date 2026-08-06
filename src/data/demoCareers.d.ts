export interface BacktrackPathway {
  type: 'vocational' | 'university'
  name: string
  duration: string
  cost: string
  entryRequirements: string
  subjects: string[]
  description: string
}

export interface CourseLink {
  name: string
  url: string
  description: string
}

export interface Career {
  id: number
  category: string
  title: string
  salary: string
  description: string
  requirements: string[]
  supportTags?: string[]
  dayToDay: string[]
  whereToStudy: CourseLink[]
  progression: string[]
  similarCareers: number[]
  matchedSubjects: string[]
  backtrackPathways: BacktrackPathway[]
}

declare const demoCareers: Career[]
export default demoCareers
