export interface Career {
  id: number
  category: string
  title: string
  salary: string
  description: string
  requirements: string[]
  supportTags?: string[]
  dayToDay: string[]
  whereToStudy: string[]
  progression: string[]
  similarCareers: number[]
  matchedSubjects: string[]
}

declare const demoCareers: Career[]
export default demoCareers
