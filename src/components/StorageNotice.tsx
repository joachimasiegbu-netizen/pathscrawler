import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import { STORAGE_NOTICE_KEY } from '../data/legal'

// First-visit notice about what PathScrawler saves on the device. Everything
// in DEVICE_STORAGE (legal.ts) is strictly necessary for a feature the user
// chose, so PECR needs it disclosed rather than consented to - this is a
// notice, not a consent banner, which is why there's no "Reject" button.
// Adding analytics or advertising storage would change that.

function hasSeenNotice(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_NOTICE_KEY) === '1'
  } catch {
    // Storage blocked (private mode etc.) - nothing gets saved anyway, but
    // still show the notice so the disclosure isn't skipped.
    return false
  }
}

export default function StorageNotice() {
  const [visible, setVisible] = useState(() => !hasSeenNotice())
  if (!visible) return null

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_NOTICE_KEY, '1')
    } catch {
      // Can't remember the dismissal - it'll show again next visit.
    }
    setVisible(false)
  }

  return (
    <div
      role="region"
      aria-label="How PathScrawler uses your device's storage"
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:gap-5">
        <p className="flex-1 text-sm leading-6 text-slate-700 dark:text-slate-200">
          We save your choices on this device so PathScrawler remembers them. No adverts or tracking.{' '}
          <Link to="/privacy#device-storage" className="font-semibold text-primary underline dark:text-primary-light">
            See what's saved
          </Link>
        </p>
        <Button onClick={dismiss} className="w-full shrink-0 sm:w-auto">
          Got it
        </Button>
      </div>
    </div>
  )
}
