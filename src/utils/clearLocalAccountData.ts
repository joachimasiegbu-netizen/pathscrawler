import { useBinderStore } from '../store/useBinderStore'
import { useSavedPathwaysStore } from '../store/useSavedPathwaysStore'
import { useTitleProgressStore } from '../store/useTitleProgressStore'
import { useUserProfileStore } from '../store/useUserProfileStore'

/**
 * Drops one account's slices out of this browser's persisted stores.
 *
 * Called after a successful account deletion (ProfilePage's danger zone).
 * `delete_own_account()` removes everything server-side, but the four
 * account-keyed stores below are mirrored into localStorage - so without
 * this, the deleted account's binder, saved pathways, titles and username
 * would all still be sitting in this browser, and would reappear in full for
 * anyone who happened to sign up with a new account on the same device.
 * Deleting an account has to mean deleted here too, not just server-side.
 *
 * Why this lives outside useAuthStore: all four of these stores import
 * useAuthStore (to read currentUser.id), so useAuthStore cannot import them
 * back without a circular import. Keeping it as a separate function the
 * caller invokes also keeps the dependency pointing one way, which is the
 * arrangement every one of those stores already documents.
 *
 * Takes the user id explicitly rather than reading it from useAuthStore,
 * because by the time this runs the session has already been cleared -
 * currentUser is null, and the slices are keyed on the id it used to hold.
 */
export function clearLocalAccountData(userId: string): void {
  if (!userId) return

  const omit = <T>(record: Record<string, T>): Record<string, T> => {
    if (!(userId in record)) return record
    const next = { ...record }
    delete next[userId]
    return next
  }

  // Each store is reset rather than merely emptied: mergedUserIds has to lose
  // this id too, or a later account reusing the same id (which cannot happen
  // in practice, but is exactly the kind of assumption that rots) would skip
  // its first-login union merge.
  useBinderStore.setState((state) => ({
    cardsByUser: omit(state.cardsByUser),
    mergedUserIds: state.mergedUserIds.filter((id) => id !== userId),
    hydratedUserId: null,
    loadError: null,
  }))

  useSavedPathwaysStore.setState((state) => ({
    savedByUser: omit(state.savedByUser),
    mergedUserIds: state.mergedUserIds.filter((id) => id !== userId),
    hydratedUserId: null,
  }))

  useTitleProgressStore.setState((state) => ({
    progressByUser: omit(state.progressByUser),
  }))

  useUserProfileStore.setState((state) => ({
    profilesByUser: omit(state.profilesByUser),
    hydratedUserId: null,
    loadError: null,
  }))
}
