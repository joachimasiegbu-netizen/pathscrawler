export interface CurrentRole {
  id: string
  title: string
}

export interface JobSkills {
  hardSkills: string[]
  softSkills: string[]
}

export interface RetrainingRoute {
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeToSwitch: string
  subjectId: string
  whyItFits: string
}

export interface AlternateCareer {
  careerId: number
  careerTitle: string
  viaMasters?: RetrainingRoute
  viaProfessional?: RetrainingRoute
  viaApprenticeship?: RetrainingRoute
}

export interface CareerSwitchEntry {
  alternateCareers: Record<string, AlternateCareer>
}

export declare const currentRoles: CurrentRole[]
export declare const currentJobSkills: Record<string, JobSkills>
export declare const careerSkillRequirements: Record<string, JobSkills>
export declare const careerSwitchMap: Record<string, CareerSwitchEntry>

declare const _default: {
  currentRoles: CurrentRole[]
  currentJobSkills: Record<string, JobSkills>
  careerSkillRequirements: Record<string, JobSkills>
  careerSwitchMap: Record<string, CareerSwitchEntry>
}
export default _default
