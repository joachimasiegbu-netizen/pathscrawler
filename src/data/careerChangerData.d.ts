export interface CurrentRole {
  id: string
  title: string
}

export interface JobSkills {
  hardSkills: string[]
  softSkills: string[]
}

export declare const currentRoles: CurrentRole[]
export declare const currentJobSkills: Record<string, JobSkills>

declare const _default: {
  currentRoles: CurrentRole[]
  currentJobSkills: Record<string, JobSkills>
}
export default _default
