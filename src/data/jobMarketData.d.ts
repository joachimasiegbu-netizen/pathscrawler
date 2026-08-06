export interface TrendingJob {
  career: string
  change: string
  avgSalary: string
  jobPostings: string
  description: string
}

export interface HotSkillEntry {
  skill: string
  demandScore: number
}

export interface SalaryTrendMonth {
  month: string
  softwareDev: number
  nurse: number
  aiEngineer: number
  graphicDesigner: number
  retailManager: number
  careAssistant: number
}

export interface SectorShare {
  sector: string
  percentage: number
}

export interface JobMarketData {
  lastUpdated: string
  sourceCredit: string
  trendingUp: TrendingJob[]
  trendingDown: TrendingJob[]
  hotSkills: HotSkillEntry[]
  salaryTrends: SalaryTrendMonth[]
  sectorDistribution: SectorShare[]
}

export declare const jobMarketData: JobMarketData
