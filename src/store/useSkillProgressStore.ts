import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Lightweight, per-browser learning tracker for the Skills page. Not
// account-scoped on purpose - it's a personal "am I doing this" checklist,
// same category as useRollStore's local tallies, not something that needs to
// follow you across devices or into Supabase.

export type SkillStatus = 'learning' | 'learned'

interface SkillProgressState {
  status: Record<string, SkillStatus>
  setStatus: (skillId: string, status: SkillStatus | null) => void
  cycle: (skillId: string) => void
  reset: () => void
}

// none -> learning -> learned -> none
function nextStatus(current: SkillStatus | undefined): SkillStatus | null {
  if (current === 'learning') return 'learned'
  if (current === 'learned') return null
  return 'learning'
}

export const useSkillProgressStore = create<SkillProgressState>()(
  persist(
    (set, get) => ({
      status: {},
      setStatus: (skillId, status) => {
        const next = { ...get().status }
        if (status === null) delete next[skillId]
        else next[skillId] = status
        set({ status: next })
      },
      cycle: (skillId) => {
        const next = { ...get().status }
        const n = nextStatus(next[skillId])
        if (n === null) delete next[skillId]
        else next[skillId] = n
        set({ status: next })
      },
      reset: () => set({ status: {} }),
    }),
    { name: 'pathscrawler-skill-progress', version: 1 },
  ),
)
