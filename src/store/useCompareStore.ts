import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Same pure-localStorage pattern as useAuthStore.ts / pathwayStorage.ts - no
// backend, so "compare list" just lives in this browser. Capped at 3 careers
// since that's what fits a readable side-by-side comparison.
//
// This is the ONE shared compare list for the whole app - CareerDetailPage's
// simple always-visible "Add to compare"/"Added" toggle, the header's
// "Compare (N)" pill, and the grid "selection mode" (Compare button ->
// gray/dim cards with circles -> floating button) on every results page all
// read and write the SAME selectedCompareCards array, not separate lists.
// Picking a career from any of those surfaces shows it as compared
// everywhere else too.

const MAX_COMPARE = 3

export type ToggleCompareResult = 'selected' | 'deselected' | 'max-reached'

interface CompareState {
  selectedCompareCards: number[]
  /** True while a results page's "Compare" grid-selection UI is active (see CompareButton/SelectableCareerCard). */
  compareSelectionMode: boolean
  /** Route to return to from /compare - set when selection mode is entered, so the back button knows where "back" means. */
  compareSourcePage: string | null

  /** Plain toggle, no result - what CareerDetailPage's single always-visible button uses. */
  toggle: (id: number) => void
  /** Same toggle, but reports what happened - what SelectableCareerCard uses to show the max-reached toast. */
  toggleCompareSelection: (id: number) => ToggleCompareResult
  remove: (id: number) => void
  clear: () => void
  isCompared: (id: number) => boolean

  enterCompareSelectionMode: (sourceRoute: string) => void
  /** Also the "Cancel" action - clears every selection, not just the mode flag (leaving compared cards after cancelling would be surprising). */
  exitCompareSelectionMode: () => void
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      selectedCompareCards: [],
      compareSelectionMode: false,
      compareSourcePage: null,

      toggle: (id) => {
        get().toggleCompareSelection(id)
      },

      toggleCompareSelection: (id) => {
        const { selectedCompareCards } = get()
        if (selectedCompareCards.includes(id)) {
          set({ selectedCompareCards: selectedCompareCards.filter((careerId) => careerId !== id) })
          return 'deselected'
        }
        if (selectedCompareCards.length >= MAX_COMPARE) {
          return 'max-reached'
        }
        set({ selectedCompareCards: [...selectedCompareCards, id] })
        return 'selected'
      },

      remove: (id) => set({ selectedCompareCards: get().selectedCompareCards.filter((careerId) => careerId !== id) }),
      clear: () => set({ selectedCompareCards: [] }),
      isCompared: (id) => get().selectedCompareCards.includes(id),

      enterCompareSelectionMode: (sourceRoute) => set({ compareSelectionMode: true, compareSourcePage: sourceRoute }),
      exitCompareSelectionMode: () => set({ compareSelectionMode: false, selectedCompareCards: [], compareSourcePage: null }),
    }),
    {
      name: 'pathscrawler-compare-careers',
      version: 2,
      // v1 stored this same list under the field name `careerIds` - carry it
      // over under the new name rather than losing an existing compare list
      // on upgrade.
      migrate: (persisted, version) => {
        if (version < 2 && persisted && typeof persisted === 'object' && 'careerIds' in persisted) {
          return { selectedCompareCards: (persisted as { careerIds: number[] }).careerIds ?? [] }
        }
        return persisted as CompareState
      },
      // compareSelectionMode/compareSourcePage are a transient UI session,
      // not saved comparison data - persisting them would resurrect stale
      // gray cards/circles (and a source route that may no longer make
      // sense) on a fresh page load.
      partialize: (state) => ({ selectedCompareCards: state.selectedCompareCards }),
    },
  ),
)

export const MAX_COMPARE_CAREERS = MAX_COMPARE
