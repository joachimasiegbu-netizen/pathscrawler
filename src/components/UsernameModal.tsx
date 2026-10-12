import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Clock, Loader2, X } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { getUsernameCooldownRemainingMs, isUsernameTaken, useMyUserProfile, useUserProfileStore } from '../store/useUserProfileStore'
import {
  USERNAME_MAX,
  USERNAME_UNAVAILABLE_MESSAGE,
  validateUsernameFormat,
} from '../utils/usernameValidation'

/** "3 days" / "1 hour" / "less than an hour" - a rough, human countdown, not
 * a live-ticking clock (the shortest cooldown here is measured in hours, so
 * a per-second timer would be overkill - re-renders naturally whenever the
 * profile itself changes instead). */
function formatCooldown(ms: number): string {
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000))
  if (days >= 1) return `${days} ${days === 1 ? 'day' : 'days'}`
  const hours = Math.ceil(ms / (60 * 60 * 1000))
  if (hours >= 1) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  return 'less than an hour'
}

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
  const profile = useMyUserProfile()

  // Once-every-7-days rate limit - explicit request, including telling the
  // player about the rule up front, not just after a rejected attempt.
  // Recomputed from `profile` (reactive) rather than a ticking timer - the
  // shortest thing formatCooldown ever shows is "1 hour", so re-rendering
  // only when the profile itself changes is plenty precise.
  const cooldownRemainingMs = getUsernameCooldownRemainingMs(profile)
  const inCooldown = cooldownRemainingMs > 0

  const [value, setValue] = useState('')
  const [availability, setAvailability] = useState<Availability>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const checkSeq = useRef(0)

  useEffect(() => {
    if (!inCooldown) inputRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const trimmedLen = value.length
  const format = useMemo(() => validateUsernameFormat(value), [value])
  const showFormatError = value.length > 0 && !format.valid

  // Debounced case-insensitive uniqueness check - only runs once the format
  // is already valid, so a half-typed name doesn't spam the network. Also
  // skipped entirely during the cooldown - nothing to submit either way.
  useEffect(() => {
    setSubmitError(null)
    if (!format.valid || inCooldown) {
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
  }, [value, format.valid, currentUser?.id, inCooldown])

  const canSubmit = !inCooldown && format.valid && availability === 'available' && !submitting

  const handleContinue = async () => {
    if (submitting || inCooldown) return
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
    // Backstop against the cooldown having kicked in between this modal
    // opening and this click (e.g. left open across the boundary) - the
    // store itself is the actual source of truth, this UI check is just
    // what keeps the form from ever LOOKING submittable in that window.
    const applied = setUsername(value)
    setSubmitting(false)
    if (!applied) {
      setSubmitError('You can only change your name once every 7 days - come back later.')
      return
    }
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
            {/* Told up front, not just discovered after a rejected submit -
                explicit request. Always visible (even outside the cooldown)
                so it's known before someone commits to a name. */}
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500">
              <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
              You can only change this once every 7 days.
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

        {inCooldown ? (
          // Replaces the whole form - nothing to type or submit while
          // blocked, so a disabled input just invites a confused retry
          // instead of clearly explaining why.
          <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-amber-300/60 bg-amber-50 px-3.5 py-3 text-sm leading-6 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              You already changed your name recently. You can change it again in{' '}
              <span className="font-semibold">{formatCooldown(cooldownRemainingMs)}</span>.
            </span>
          </div>
        ) : (
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
              placeholder="e.g. lucas3000"
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
        )}

        {!inCooldown ? (
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleContinue}
          className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? 'Saving…' : 'Continue'}
        </button>
        ) : null}

        {/* Skip only ever means anything before a real name exists - once
            the cooldown is active the player already has one, so this
            would either be a confusing no-op or (if dismissible) is
            redundant with the X/backdrop close already available. */}
        {!inCooldown ? (
        <button
          type="button"
          onClick={handleSkip}
          className="mt-3 w-full text-center text-xs font-semibold text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          Skip for now
        </button>
        ) : null}
      </div>
    </div>
  )
}
