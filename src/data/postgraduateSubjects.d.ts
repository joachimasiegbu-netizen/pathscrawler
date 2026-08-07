export interface PostgraduateSubject {
  id: string
  name: string
  category: string
  duration: string
  description: string
  entryRequirements: string
}

export interface PostgraduateSubjects {
  masters: PostgraduateSubject[]
  phd: PostgraduateSubject[]
  professional: PostgraduateSubject[]
}

export declare const postgraduateSubjects: PostgraduateSubjects
export default postgraduateSubjects
