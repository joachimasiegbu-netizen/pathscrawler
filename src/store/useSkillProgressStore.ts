import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// LOCAL for now, and the one entry in PERSISTENCE.md's table flagged as the
// NEXT SYNC CANDIDATE. Lightweight, per-browser learning tracker for the
// Skills page. Unlike compare lists or an in-flight assessment, this is real
// accumulated progress, so "it's only a checklist" is a weak argument for
// losing it with the cache; the actual blocker is that this store has no
// account scoping at all (one flat `status` map per browser, where every
// synced store is keyed `byUser`), so syncing it means that refactor plus a
// table, not just a write-through. Called out rather than left as an
// accident.

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
