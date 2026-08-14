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
  /** Real UK employment share, as a percentage of the ~31.4M UK workforce -
   * ONS SOC 2020 occupation employee counts via the DfE "Occupations in
   * Demand" 2024 dataset, not derived from this app's own roll odds. Most
   * careers map to a specific 4-digit SOC code; a few whose title is
   * broader than any single SOC code in that dataset (e.g. "Construction
   * Trades Worker") use an average across that SOC group instead - see the
   * inline comment on each entry in demoCareers.js for its source. */
  employmentPercentage: number
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
