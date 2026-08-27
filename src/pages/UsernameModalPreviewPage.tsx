import { useState } from 'react'
import UsernameModal from '../components/UsernameModal'

// Dev/QA preview for the account-setup modal, mirroring the existing
// /preview/mythic-reveal route - the real modal only mounts for a signed-in
// player with no username yet (App.tsx), which is awkward to reach on demand.
// This renders it standalone against a plain backdrop.
export default function UsernameModalPreviewPage() {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
      {open ? (
        <UsernameModal dismissible onClose={() => setOpen(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Reopen modal
        </button>
      )}
    </div>
  )
}
