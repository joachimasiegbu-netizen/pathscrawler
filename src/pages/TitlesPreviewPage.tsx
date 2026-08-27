import { useState } from 'react'
import TitlePill from '../components/TitlePill'
import TitleUnlockToast from '../components/TitleUnlockToast'
import { TITLES, type TitleWithStatus } from '../utils/titles'

// Dev/QA preview for the equip-title visuals (pills in both surface tones +
// the unlock toast), mirroring /preview/mythic-reveal and
// /preview/username-modal. Not linked from anywhere in the app.
export default function TitlesPreviewPage() {
  const [toastTitle, setToastTitle] = useState<TitleWithStatus | null>(null)

  return (
    <div className="min-h-screen space-y-10 bg-slate-100 p-8 dark:bg-slate-950">
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Pills — dark tone (leaderboard / roll page)</h2>
        <div className="flex flex-wrap gap-2 rounded-xl bg-slate-900 p-4">
          {TITLES.map((t) => (
            <TitlePill key={t.id} titleId={t.id} tone="dark" />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Pills — light tone (binder header / profile)</h2>
        <div className="flex flex-wrap gap-2 rounded-xl bg-white p-4 shadow">
          {TITLES.map((t) => (
            <TitlePill key={t.id} titleId={t.id} tone="light" />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Unlock toast</h2>
        <div className="flex flex-wrap gap-2">
          {TITLES.filter((t) => t.id !== 'trainee').map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setToastTitle({ ...t, unlocked: true })}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {t.name}
            </button>
          ))}
        </div>
      </section>

      {toastTitle ? (
        <TitleUnlockToast
          title={toastTitle}
          isEquipped={false}
          onEquip={() => setToastTitle(null)}
          onDismiss={() => setToastTitle(null)}
        />
      ) : null}
    </div>
  )
}
