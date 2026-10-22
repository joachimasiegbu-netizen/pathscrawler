import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { TriangleAlert, Trash2, X } from 'lucide-react'
import Button from './Button'
import { contactEmailText } from '../data/legal'
import { useAuthStore } from '../store/useAuthStore'
import { clearLocalAccountData } from '../utils/clearLocalAccountData'

/** What someone has to type to confirm. Deliberately a real word rather than
 * their email: an email address is sitting right there on the page to copy,
 * which makes the gate theatre rather than a check. */
const CONFIRM_WORD = 'DELETE'

/**
 * Account deletion, on ProfilePage. The UK GDPR right to erasure, which the
 * privacy policy already promises - it previously pointed people at an email
 * address instead, which meant the one right most likely to be exercised was
 * the only one the app couldn't do.
 *
 * The real deletion is server-side (delete_own_account() in
 * supabase/schema.sql); every app table cascades off auth.users, so one RPC
 * removes the account, its rolls, titles, best cards, profile, binder and
 * saved pathways together. This component owns the confirmation, the local
 * cleanup afterwards, and saying what will actually be destroyed.
 */
export default function DeleteAccountPanel() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)
  const deleteAccount = useAuthStore((state) => state.deleteAccount)
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canConfirm = confirmText.trim().toUpperCase() === CONFIRM_WORD && !deleting

  const handleDelete = async () => {
    if (!canConfirm || !currentUser) return
    // Captured before the call: deleteAccount() clears the session, so
    // currentUser is null by the time the local cleanup needs this id.
    const userId = currentUser.id
    setDeleting(true)
    setError(null)
    const result = await deleteAccount()
    if (!result.success) {
      setError(result.error ?? 'Something went wrong.')
      setDeleting(false)
      return
    }
    clearLocalAccountData(userId)
    // Home, not /login - someone who just deleted their account is the last
    // person who should land on a sign-in form.
    navigate('/', { replace: true })
  }

  const closeModal = () => {
    if (deleting) return
    setOpen(false)
    setConfirmText('')
    setError(null)
  }

  return (
    <>
      <div className="rounded-2xl border border-error/30 bg-error/5 p-5 dark:border-error/40 dark:bg-error/10">
        <h2 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-error">
          <TriangleAlert className="h-4 w-4" />
          Delete account
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Permanently deletes your account and everything in it - your username and title, every roll, your Binder,
          and your saved pathways. This can't be undone.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-error/40 bg-transparent px-4 py-2 text-sm font-semibold text-error transition hover:bg-error/10"
        >
          <Trash2 className="h-4 w-4 shrink-0" />
          Delete my account
        </button>
      </div>

      {open
        ? createPortal(
            // Portalled for the same reason AuthPromptModal is: this page sits
            // inside wrappers that apply CSS transforms, which would otherwise
            // become the containing block for a position: fixed overlay.
            <div
              className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 py-6"
              onClick={closeModal}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-account-title"
                onClick={(event) => event.stopPropagation()}
                className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800"
              >
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close"
                  disabled={deleting}
                  className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40 dark:hover:bg-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
                  <TriangleAlert className="h-5 w-5" aria-hidden="true" />
                </div>

                <h2 id="delete-account-title" className="mt-4 text-lg font-bold text-slate-950 dark:text-slate-50">
                  Delete your account?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  This permanently deletes <strong className="break-all">{currentUser?.email}</strong> and everything
                  attached to it. It cannot be undone, and we can't recover it afterwards.
                </p>

                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <li>Your username, title and graduation quote</li>
                  <li>Every career you've rolled, and your place on the leaderboard</li>
                  <li>Your Binder and your saved pathways</li>
                </ul>

                <label className="mt-4 block">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Type {CONFIRM_WORD} to confirm
                  </span>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(event) => setConfirmText(event.target.value)}
                    autoComplete="off"
                    disabled={deleting}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-error focus:ring-2 focus:ring-error/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </label>

                {error ? (
                  <div
                    role="alert"
                    className="mt-3 rounded-lg border border-error/30 bg-error/5 p-3 text-sm leading-6 text-error dark:bg-error/10"
                  >
                    <p>{error}</p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                      Your account has not been deleted. You can also email <strong>{contactEmailText()}</strong> and
                      we'll do it for you.
                    </p>
                  </div>
                ) : null}

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={!canConfirm}
                    className="min-h-[44px] flex-1 rounded-xl bg-error px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {deleting ? 'Deleting…' : 'Delete permanently'}
                  </button>
                  <Button variant="ghost" onClick={closeModal} className="flex-1 justify-center">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
