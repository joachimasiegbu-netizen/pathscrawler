import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Same pure-localStorage pattern as useCompareStore.ts / useAuthStore.ts -
// no backend, so "My Career Board" (careers a user has bookmarked from the
// Career Changer results page) just lives in this browser.

interface CareerBoardState {
  careerIds: number[]
  toggle: (id: number) => void
  remove: (id: number) => void
  clear: () => void
  isSaved: (id: number) => boolean
}

export const useCareerBoardStore = create<CareerBoardState>()(
  persist(
    (set, get) => ({
      careerIds: [],
      toggle: (id) => {
        const { careerIds } = get()
        set({
          careerIds: careerIds.includes(id)
            ? careerIds.filter((careerId) => careerId !== id)
            : [...careerIds, id],
        })
      },
      remove: (id) => set({ careerIds: get().careerIds.filter((careerId) => careerId !== id) }),
      clear: () => set({ careerIds: [] }),
      isSaved: (id) => get().careerIds.includes(id),
    }),
    {
      name: 'pathscrawler-career-board',
    },
  ),
)
