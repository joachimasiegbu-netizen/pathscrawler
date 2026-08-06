import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Same pure-localStorage pattern as useAuthStore.ts / pathwayStorage.ts - no
// backend, so "compare list" just lives in this browser. Capped at 3 careers
// since that's what fits a readable side-by-side comparison.

const MAX_COMPARE = 3

interface CompareState {
  careerIds: number[]
  toggle: (id: number) => void
  remove: (id: number) => void
  clear: () => void
  isCompared: (id: number) => boolean
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      careerIds: [],
      toggle: (id) => {
        const { careerIds } = get()
        if (careerIds.includes(id)) {
          set({ careerIds: careerIds.filter((careerId) => careerId !== id) })
          return
        }
        if (careerIds.length >= MAX_COMPARE) {
          return
        }
        set({ careerIds: [...careerIds, id] })
      },
      remove: (id) => set({ careerIds: get().careerIds.filter((careerId) => careerId !== id) }),
      clear: () => set({ careerIds: [] }),
      isCompared: (id) => get().careerIds.includes(id),
    }),
    {
      name: 'pathscrawler-compare-careers',
    },
  ),
)

export const MAX_COMPARE_CAREERS = MAX_COMPARE
