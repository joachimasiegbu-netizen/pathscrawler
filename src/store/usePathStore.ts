import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SubjectOption {
  id: string
  label: string
  description: string
  category: string
}

export interface CareerOption {
  id: string
  title: string
  description: string
  salary: string
  requirements: string[]
  subjects: string[]
}

interface PreviousQualification {
  country: string
  level: string
}

interface PathState {
  currentPath: 'education' | 'career' | null
  selectedRole: string | null
  selectedSubjects: string[]
  selectedLevel: string | null
  esolLevel: string | null
  ukQualifications: boolean | null
  previousQualifications: PreviousQualification | null
  supportNeeds: string[]
  accessibilitySettings: {
    reduceMotion: boolean
    highContrast: boolean
    largerText: boolean
    dyslexiaFont: boolean
    darkMode: boolean
  }
  progress: number
  assessmentCompleted: boolean
  matchedRoles: string[]
  recommendedRole: string | null
  highlightedCareerId: number | null
  setCurrentPath: (path: 'education' | 'career') => void
  setSelectedRole: (role: string) => void
  setSelectedSubjects: (subjectIds: string[]) => void
  setSelectedLevel: (level: string | null) => void
  setEsolLevel: (level: string | null) => void
  setUkQualifications: (hasQualifications: boolean | null) => void
  setPreviousQualifications: (qualification: PreviousQualification | null) => void
  setSupportNeeds: (needs: string[]) => void
  setAccessibilitySettings: (settings: {
    reduceMotion: boolean
    highContrast: boolean
    largerText: boolean
    dyslexiaFont: boolean
    darkMode: boolean
  }) => void
  toggleSubject: (subjectId: string) => void
  setProgress: (progress: number) => void
  setAssessmentCompleted: (completed: boolean) => void
  setMatchedRoles: (roles: string[]) => void
  setRecommendedRole: (role: string | null) => void
  setHighlightedCareerId: (careerId: number | null) => void
  reset: () => void
}

export const usePathStore = create<PathState>()(
  persist(
    (set) => ({
      currentPath: null,
      selectedRole: null,
      selectedLevel: null,
      esolLevel: null,
      ukQualifications: null,
      previousQualifications: null,
      supportNeeds: [],
      accessibilitySettings: {
        reduceMotion: false,
        highContrast: false,
        largerText: false,
        dyslexiaFont: false,
        darkMode: false,
      },
      selectedSubjects: [],
      progress: 0,
      assessmentCompleted: false,
      matchedRoles: [],
      recommendedRole: null,
      highlightedCareerId: null,
      setCurrentPath: (path) => set({ currentPath: path }),
      setSelectedRole: (role) => set((state) => ({ selectedRole: role, selectedSubjects: [], selectedLevel: null, supportNeeds: role === 'disabled-learner' ? state.supportNeeds : [], highlightedCareerId: null })),
      setSelectedSubjects: (subjectIds) => set({ selectedSubjects: subjectIds }),
      setSelectedLevel: (level) => set({ selectedLevel: level }),
      setEsolLevel: (level) => set({ esolLevel: level }),
      setUkQualifications: (hasQualifications) => set({ ukQualifications: hasQualifications }),
      setPreviousQualifications: (qualification) => set({ previousQualifications: qualification }),
      setSupportNeeds: (needs) => set({ supportNeeds: needs }),
      setAccessibilitySettings: (settings) => set({ accessibilitySettings: settings }),
      toggleSubject: (subjectId) =>
        set((state) => ({
          selectedSubjects: state.selectedSubjects.includes(subjectId)
            ? state.selectedSubjects.filter((id) => id !== subjectId)
            : [...state.selectedSubjects, subjectId],
        })),
      setProgress: (progress) => set({ progress }),
      setAssessmentCompleted: (completed) => set({ assessmentCompleted: completed }),
      setMatchedRoles: (matchedRoles) => set({ matchedRoles }),
      setRecommendedRole: (recommendedRole: string | null) => set({ recommendedRole }),
      setHighlightedCareerId: (highlightedCareerId) => set({ highlightedCareerId }),
      reset: () =>
        set((state) => ({
          currentPath: null,
          selectedRole: null,
          selectedLevel: null,
          esolLevel: null,
          ukQualifications: null,
          previousQualifications: null,
          supportNeeds: [],
          accessibilitySettings: state.accessibilitySettings,
          selectedSubjects: [],
          progress: 0,
          assessmentCompleted: false,
          matchedRoles: [],
          recommendedRole: null,
          highlightedCareerId: null,
        })),
    }),
    {
      name: 'pathscrawler-storage',
      // persist only long-lived fields; don't persist transient subject selections or selectedLevel
      partialize: (state) => ({
        currentPath: state.currentPath,
        selectedRole: state.selectedRole,
        selectedLevel: state.selectedLevel,
        selectedSubjects: state.selectedSubjects,
        supportNeeds: state.supportNeeds,
        accessibilitySettings: state.accessibilitySettings,
        progress: state.progress,
        assessmentCompleted: state.assessmentCompleted,
        matchedRoles: state.matchedRoles,
        recommendedRole: state.recommendedRole,
        highlightedCareerId: state.highlightedCareerId,
      }),
    },
  ),
)
