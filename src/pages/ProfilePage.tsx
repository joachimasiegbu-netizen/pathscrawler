import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Dices, GraduationCap, Lock, Pencil, Trophy, UserRound } from 'lucide-react'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import TitlePill from '../components/TitlePill'
import UsernameModal from '../components/UsernameModal'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'
import { useMyUserProfile, useUserProfileStore } from '../store/useUserProfileStore'
import { useMyTitleProgress } from '../store/useTitleProgressStore'
import { getTitlesWithStatus } from '../utils/titles'

const GRADUATION_QUOTE_MAX = 120

// The player's identity page: display name + equipped title, a quick
// equip/unequip grid of every title they've unlocked, and a jump to the full
// Achievements panel. Equipped title appears here as a badge under the name
// (spec: "Profile page: Below username as a badge/pill").
export default function ProfilePage() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)
  const profile = useMyUserProfile()
  const equipTitle = useUserProfileStore((state) => state.equipTitle)
  const setGraduationQuote = useUserProfileStore((state) => state.setGraduationQuote)
  // The three states this page was missing entirely. Without them a slow or
  // failed profile read rendered the account's raw email as the display name
  // next to an empty title grid - indistinguishable from a brand-new account
  // that has genuinely earned nothing.
  const hydratedUserId = useUserProfileStore((state) => state.hydratedUserId)
  const loadError = useUserProfileStore((state) => state.loadError)
  const hydrateProfile = useUserProfileStore((state) => state.hydrateFromSupabase)
  const [retrying, setRetrying] = useState(false)
  const progress = useMyTitleProgress()
  const [editingName, setEditingName] = useState(false)
  // Local draft, not written to the store on every keystroke - only on
  // Save, same "edit then commit" shape UsernameModal already uses for the
  // name itself, just inline here instead of a separate modal.
  const [quoteDraft, setQuoteDraft] = useState(profile?.graduationQuote ?? '')
  const [quoteSaved, setQuoteSaved] = useState(false)

  // Keeps the draft in sync with whatever the store actually holds - most
  // importantly the moment hydrateFromSupabase (App.tsx, on sign-in)
  // resolves a remote quote that wasn't there yet on this device's first
  // render, which a bare useState initializer would otherwise miss forever.
  useEffect(() => {
    setQuoteDraft(profile?.graduationQuote ?? '')
  }, [profile?.graduationQuote])

  const titles = getTitlesWithStatus(progress, !!currentUser)
  const unlocked = titles.filter((title) => title.unlocked)
  const equippedTitleId = profile?.equippedTitleId ?? null
  const hasGraduated = unlocked.some((title) => title.id === 'graduate')

  // Keyed on the user id rather than a boolean so switching accounts shows
  // the skeleton again instead of the previous account's name.
  const isLoadingProfile =
    isSupabaseConfigured && !!currentUser && hydratedUserId !== currentUser.id

  const handleRetry = async () => {
    setRetrying(true)
    try {
      await hydrateProfile()
    } finally {
      setRetrying(false)
    }
  }

  if (!currentUser) {
    // Same AuthWall pattern as BinderAuthWall.tsx/My Pathways (lock icon,
    // heading, description, two buttons) - this used to be a single plain
    // underlined-link line, the odd one out among the app's three account-
    // gated pages.
    return (
      <div className="mx-auto w-full max-w-md px-4 py-10 sm:px-0">
        <BackButton to="/" />

        <div className="mt-6 space-y-5 rounded-2xl bg-white p-8 text-center shadow-soft dark:bg-slate-800">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft/60 text-primary dark:bg-primary/15 dark:text-primary-light">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-950 dark:text-slate-50">Sign in to set up your profile</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Your Profile is where you set your name and show off the titles you've earned. Sign in or create an
              account to get started.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
            <Button onClick={() => navigate('/login')} className="flex-1 justify-center">
              Sign In
            </Button>
            <Button variant="secondary" onClick={() => navigate('/signup')} className="flex-1 justify-center">
              Create Account
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <BackButton to="/" />

      <div className="mt-6 space-y-6">
        <PageHeader icon={UserRound} title="Profile" subtitle="Your name and title, as other employees see you." />

        {/* FAILED. A warning, not a blocker: the cards below still render
            from this device's local copy, which is usually correct - it just
            might be behind a change made on another device. */}
        {loadError ? (
          <div
            role="alert"
            className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100"
          >
            <p className="font-semibold">{loadError}</p>
            <p className="mt-1 text-amber-800 dark:text-amber-200/80">
              You're seeing the copy saved on this device. Changes you make now may not reach your other devices until
              this works.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              disabled={retrying}
              className="mt-3 min-h-[44px] rounded-lg border border-amber-400/60 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 disabled:opacity-60 dark:text-amber-100 dark:hover:bg-amber-500/20"
            >
              {retrying ? 'Trying…' : 'Try again'}
            </button>
          </div>
        ) : null}

        {/* LOADING. Holds the shape of the identity card and the title grid
            so the page does not reflow when the real values land. */}
        {isLoadingProfile ? (
          <div aria-busy="true" role="status" aria-live="polite" className="space-y-6">
            <span className="sr-only">Loading your profile…</span>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="skeleton-shimmer h-6 w-40 rounded-full" />
              <div className="skeleton-shimmer mt-2.5 h-5 w-24 rounded-full" />
              <div className="skeleton-shimmer mt-3 h-3 w-52 rounded-full" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="skeleton-shimmer h-4 w-32 rounded-full" />
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="skeleton-shimmer h-7 w-24 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        ) : (
        <>
        {/* Identity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xl font-bold text-slate-950 dark:text-white">{profile?.username ?? currentUser.email}</p>
              <div className="mt-1.5 min-h-[1.5rem]">
                {equippedTitleId ? (
                  <TitlePill titleId={equippedTitleId} tone="light" />
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">No title equipped</span>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{currentUser.email}</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingName(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Pencil className="h-3.5 w-3.5" />
              Change name
            </button>
          </div>
        </div>

        {/* Graduation Quote - Graduate title's reward (titles.ts): a custom,
            up to 120-char "yearbook quote" shown under this player's name
            on the leaderboard (LeaderboardPage.tsx). Only shown once
            Graduate is actually unlocked - a locked reward has nothing to
            edit yet. */}
        {hasGraduated ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <GraduationCap className="h-4 w-4" />
              Graduation quote
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">
              Shows under your name on the leaderboard, like a yearbook quote.
            </p>
            <textarea
              value={quoteDraft}
              onChange={(event) => {
                setQuoteDraft(event.target.value.slice(0, GRADUATION_QUOTE_MAX))
                setQuoteSaved(false)
              }}
              maxLength={GRADUATION_QUOTE_MAX}
              rows={2}
              placeholder="Write something for the yearbook…"
              className="mt-3 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {quoteDraft.length} / {GRADUATION_QUOTE_MAX}
              </p>
              <button
                type="button"
                onClick={() => {
                  setGraduationQuote(quoteDraft)
                  setQuoteSaved(true)
                }}
                disabled={quoteDraft === (profile?.graduationQuote ?? '')}
                // min-h-[44px] + px-4: a real touch target on a phone, same
                // figure Button.tsx uses app-wide. The other small buttons
                // on this page only ever sit next to one another; this one is
                // the primary action of its own section, so it's the one that
                // actually gets thumbed.
                className="min-h-[44px] rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50 disabled:hover:bg-primary"
              >
                {quoteSaved && quoteDraft === (profile?.graduationQuote ?? '') ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        ) : null}

        {/* Title picker */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Equip a title ({unlocked.length})
            </h2>
            <button
              type="button"
              onClick={() => navigate('/leaderboard')}
              className="flex items-center gap-1 text-xs font-semibold text-primary transition hover:text-primary-dark dark:text-primary-light"
            >
              <Trophy className="h-3.5 w-3.5" />
              Leaderboard
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => equipTitle(null)}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                equippedTitleId === null
                  ? 'border-amber-400 bg-amber-50 text-amber-700 ring-1 ring-amber-400/40 dark:bg-amber-400/10 dark:text-amber-300'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              None
            </button>

            {unlocked.map((title) => {
              const isEquipped = equippedTitleId === title.id
              return (
                <button
                  key={title.id}
                  type="button"
                  onClick={() => equipTitle(isEquipped ? null : title.id)}
                  aria-pressed={isEquipped}
                  className={`flex items-center gap-1 rounded-lg border px-1 py-1 transition ${
                    isEquipped ? 'border-amber-400 ring-1 ring-amber-400/40' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-600'
                  }`}
                >
                  {isEquipped ? <Check className="ml-1 h-3 w-3 text-amber-500" /> : null}
                  <TitlePill titleId={title.id} tone="light" />
                </button>
              )
            })}
          </div>

          {unlocked.length <= 1 ? (
            <p className="mt-3 text-xs leading-5 text-slate-400 dark:text-slate-500">
              Roll careers and hit milestones to earn more titles.{' '}
              <button
                type="button"
                onClick={() => navigate('/job-market/roll')}
                className="inline-flex items-center gap-1 font-semibold text-primary dark:text-primary-light"
              >
                <Dices className="h-3 w-3" />
                Roll a Job
              </button>
            </p>
          ) : null}
        </div>
        </>
        )}
      </div>

      {editingName ? <UsernameModal dismissible onClose={() => setEditingName(false)} /> : null}
    </div>
  )
}
