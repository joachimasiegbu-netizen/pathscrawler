import type { BinderCard } from '../store/useBinderStore'

export interface GroupedBinderCard {
  /** The most recently rolled copy - what the tile displays. */
  latest: BinderCard
  /** All copies, newest first. */
  copies: BinderCard[]
  count: number
}

// A binder "slot" is one career, however many copies you've rolled of it -
// duplicates show as a count badge on a single tile rather than as
// separate tiles (section 4 of the brief: "show a small x2 badge on the
// card", singular).
export function groupBinderCards(cards: BinderCard[]): GroupedBinderCard[] {
  const byCareerId = new Map<number, BinderCard[]>()
  for (const card of cards) {
    const existing = byCareerId.get(card.careerId)
    if (existing) existing.push(card)
    else byCareerId.set(card.careerId, [card])
  }
  return Array.from(byCareerId.values()).map((copies) => {
    const sorted = [...copies].sort((a, b) => b.dateRolled - a.dateRolled)
    return { latest: sorted[0], copies: sorted, count: sorted.length }
  })
}
