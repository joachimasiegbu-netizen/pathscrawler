import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Dices, Pencil, Trophy, UserRound } from 'lucide-react'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import TitlePill from '../components/TitlePill'
import UsernameModal from '../components/UsernameModal'
import { useAuthStore } from '../store/useAuthStore'
import { useMyUserProfile, useUserProfileStore } from '../store/useUserProfileStore'
import { useMyTitleProgress } from '../store/useTitleProgressStore'
import { getTitlesWithStatus } from '../utils/titles'

// The player's identity page: display name + equipped title, a quick
// equip/unequip grid of every title they've unlocked, and a jump to the full
// Achievements panel. Equipped title appears here as a badge under the name
// (spec: "Profile page: Below username as a badge/pill").
export default function ProfilePage() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)
  const profile = useMyUserProfile()
  const equipTitle = useUserProfileStore((state) => state.equipTitle)
  const progress = useMyTitleProgress()
  const [editingName, setEditingName] = useState(false)

  const titles = getTitlesWithStatus(progress, !!currentUser)
  const unlocked = titles.filter((title) => title.unlocked)
  const equippedTitleId = profile?.equippedTitleId ?? null

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <BackButton to="/" />
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-semibold text-primary underline underline-offset-2 dark:text-primary-light"
          >
            Sign in
          </button>{' '}
          to set up your profile.
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <BackButton to="/" />

      <div className="mt-6 space-y-6">
        <PageHeader icon={UserRound} title="Profile" subtitle="Your name and title, as other employees see you." />

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
      </div>

      {editingName ? <UsernameModal dismissible onClose={() => setEditingName(false)} /> : null}
    </div>
  )
}
