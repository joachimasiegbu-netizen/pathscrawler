import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Loader2, X } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { isUsernameTaken, useUserProfileStore } from '../store/useUserProfileStore'
import {
  USERNAME_MAX,
  USERNAME_UNAVAILABLE_MESSAGE,
  validateUsernameFormat,
} from '../utils/usernameValidation'

// First-run account setup: a signed-in player with no username yet gets this
// as a blocking overlay (App.tsx decides when to mount it). They can pick a
// name that passes validateUsernameFormat + a Supabase uniqueness check, or
// "Skip for now" to be assigned a generic fallback name plus the persistent
// "Set your name" banner (SetYourNameBanner.tsx).
//
// Styled to match the app's other centered modals (TitleDetailModal in
// RollStandingPanel.tsx, the accessibility panel wrapper in App.tsx) -
// white / slate-800 panel, not a bespoke third treatment.

type Availability = 'idle' | 'checking' | 'available' | 'taken'

interface UsernameModalProps {
  /** When set, the modal is dismissible (Skip / X / backdrop) - the setup
   * flow passes false so the only ways out are a valid name or Skip. The
   * preview route passes true. */
  dismissible?: boolean
  onClose?: () => void
}

export default function UsernameModal({ dismissible = false, onClose }: UsernameModalProps) {
  const currentUser = useAuthStore((state) => state.currentUser)
  const setUsername = useUserProfileStore((state) => state.setUsername)
  const assignFallbackName = useUserProfileStore((state) => state.assignFallbackName)

  const [value, setValue] = useState('')
  const [availability, setAvailability] = useState<Availability>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const checkSeq = useRef(0)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const trimmedLen = value.length
  const format = useMemo(() => validateUsernameFormat(value), [value])
  const showFormatError = value.length > 0 && !format.valid

  // Debounced case-insensitive uniqueness check - only runs once the format
  // is already valid, so a half-typed name doesn't spam the network.
  useEffect(() => {
    setSubmitError(null)
    if (!format.valid) {
      setAvailability('idle')
      return
    }
    const seq = ++checkSeq.current
    setAvailability('checking')
    const timer = window.setTimeout(async () => {
      const taken = await isUsernameTaken(value, currentUser?.id ?? null)
      if (seq !== checkSeq.current) return
      setAvailability(taken ? 'taken' : 'available')
    }, 350)
    return () => window.clearTimeout(timer)
  }, [value, format.valid, currentUser?.id])

  const canSubmit = format.valid && availability === 'available' && !submitting

  const handleContinue = async () => {
    if (submitting) return
    const finalFormat = validateUsernameFormat(value)
    if (!finalFormat.valid) {
      setSubmitError(finalFormat.error ?? USERNAME_UNAVAILABLE_MESSAGE)
      return
    }
    setSubmitting(true)
    const taken = await isUsernameTaken(value, currentUser?.id ?? null)
    if (taken) {
      setSubmitting(false)
      setAvailability('taken')
      setSubmitError(USERNAME_UNAVAILABLE_MESSAGE)
      return
    }
    setUsername(value)
    setSubmitting(false)
    onClose?.()
  }

  const handleSkip = () => {
    assignFallbackName()
    onClose?.()
  }

  const statusMessage = submitError
    ? submitError
    : showFormatError
      ? format.error
      : availability === 'taken'
        ? USERNAME_UNAVAILABLE_MESSAGE
        : null

  const isValidState = format.valid && availability === 'available'

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm"
      onClick={dismissible ? onClose : undefined}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="username-modal-title"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="username-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Pick a username
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              This is how other employees will see you on the leaderboard.
            </p>
          </div>
          {dismissible ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-slate-400 transition hover:text-slate-700 dark:text-slate-500 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>

        <div className="mt-5">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={value}
              maxLength={USERNAME_MAX}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && canSubmit) handleContinue()
              }}
              placeholder="e.g. Joachim"
              aria-invalid={statusMessage ? true : undefined}
              className={`w-full rounded-lg border bg-white px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:ring-2 dark:bg-slate-950 dark:text-slate-100 ${
                statusMessage
                  ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20 dark:border-rose-500'
                  : isValidState
                    ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-400/20 dark:border-emerald-500'
                    : 'border-slate-200 focus:border-primary focus:ring-primary/20 dark:border-slate-700'
              }`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {availability === 'checking' ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" aria-hidden="true" />
              ) : isValidState ? (
                <Check className="h-4 w-4 text-emerald-500" aria-label="Username available" />
              ) : null}
            </span>
          </div>

          <div className="mt-1.5 flex min-h-[1.25rem] items-center justify-between gap-3 text-xs">
            <span className={statusMessage ? 'font-medium text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}>
              {statusMessage ?? (isValidState ? 'Looks good.' : ' ')}
            </span>
            <span className="shrink-0 font-mono tabular-nums text-slate-400 dark:text-slate-500">
              {trimmedLen}/{USERNAME_MAX}
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleContinue}
          className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? 'Saving…' : 'Continue'}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="mt-3 w-full text-center text-xs font-semibold text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
