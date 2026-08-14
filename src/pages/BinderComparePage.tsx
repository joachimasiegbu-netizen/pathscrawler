import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import demoCareers, { type Career } from '../data/demoCareers'
import BinderAuthWall from '../components/BinderAuthWall'
import Button from '../components/Button'
import { useAuthStore } from '../store/useAuthStore'
import { useBinderStore, useMyBinderCards } from '../store/useBinderStore'
import { groupBinderCards } from '../utils/binderGrouping'
import { getTierConfig, type TierKey } from '../utils/careerTiers'
import { getTierStyle } from '../utils/tierStyles'
import { computeCompareHighlights } from '../utils/compareHighlights'

// A progression rung looks like "Hospitality Worker (£24k-£32k)" - pull out
// just the bracketed salary for the entry/mid/senior stat row; falls back
// to the whole step text if a rung has no embedded figures (some backtrack
// pathway-style entries don't).
function salaryFromStep(step: string): string {
  const match = step.match(/\(([^)]*£[^)]*)\)/)
  return match ? match[1] : step
}

// This is a Binder-only view (selection happens on /binder, in
// binderSelectionMode) rather than a rebuild of the app's general-purpose
// /compare page (ComparePage.tsx/useCompareStore, reached from career
// results elsewhere) - it needed its own tier-colored card treatment
// (badges/borders matching Roll a Job) and "best of" highlights the
// generic page has no concept of, so it gets its own route/store slice
// instead of bolting Binder-specific fields onto the shared one.
export default function BinderComparePage() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)
  const binderSelectionMode = useBinderStore((state) => state.binderSelectionMode)
  const selectedBinderCards = useBinderStore((state) => state.selectedBinderCards)
  const exitSelectionMode = useBinderStore((state) => state.exitSelectionMode)
  const binderCards = useMyBinderCards()

  const tierByCareerId = useMemo(() => {
    const map = new Map<number, TierKey>()
    for (const entry of groupBinderCards(binderCards)) map.set(entry.latest.careerId, entry.latest.tier)
    return map
  }, [binderCards])

  const careers = useMemo(
    () => selectedBinderCards.map((id) => demoCareers.find((career) => career.id === id)).filter((c): c is Career => Boolean(c)),
    [selectedBinderCards],
  )

  // Leaving this page - either "done comparing" (the header back arrow) or
  // "nothing valid to compare" (the error state below) - is the point
  // selection mode actually ends and its state clears, per the brief
  // ("persist selections only while in selection mode... clear on cancel
  // or after comparison"). Arriving here does NOT clear anything, so the
  // selection survives the /binder -> /binder/compare navigation itself.
  const backToBinder = () => {
    exitSelectionMode()
    navigate('/binder')
  }

  // The Binder itself is account-gated (see MyBinderPage/BinderAuthWall) -
  // this page shows the same Roll a Job careers, so it's gated the same
  // way rather than being reachable by URL while signed out.
  if (!currentUser) {
    return <BinderAuthWall />
  }

  // Covers both failure modes from the brief: too few selected, and
  // arriving here without selection mode having been active at all (e.g.
  // typing the URL directly, or a stale selection from a previous visit
  // that was never cleared).
  if (!binderSelectionMode || careers.length < 2) {
    return (
      <div className="binder-texture relative left-1/2 w-screen min-h-screen -translate-x-1/2 bg-background px-4 py-8 dark:bg-background-dark sm:px-6">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Select at least 2 careers to compare</p>
          <Button onClick={backToBinder}>Back to Binder</Button>
        </div>
      </div>
    )
  }

  const { bestSalary, easiestStart, bestLongTerm } = computeCompareHighlights(careers)

  return (
    <div className="binder-texture relative left-1/2 w-screen min-h-screen -translate-x-1/2 bg-background px-4 py-8 dark:bg-background-dark sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <button
          type="button"
          onClick={backToBinder}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Binder
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">Compare Careers</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Side-by-side comparison of your selected careers</p>
        </div>

        <div className="overflow-x-auto pb-2">
          <div
            className={`grid min-w-[560px] gap-6 sm:min-w-0 sm:grid-cols-2 ${
              careers.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
            }`}
          >
            {careers.map((career) => {
              const tier = tierByCareerId.get(career.id) ?? 'common'
              const config = getTierConfig(tier)
              const style = getTierStyle(tier)
              const isMythic = tier === 'mythic'
              const entryStep = career.progression[0]
              const midStep = career.progression.length >= 3 ? career.progression[Math.floor(career.progression.length / 2)] : undefined
              const seniorStep = career.progression.length >= 2 ? career.progression[career.progression.length - 1] : undefined

              return (
                <div
                  key={career.id}
                  className={`flex flex-col gap-4 rounded-2xl border-l-4 p-5 shadow-soft ${style.cardBorder} ${
                    isMythic ? 'bg-slate-950' : `bg-white ${style.cardTint} dark:bg-slate-800`
                  }`}
                >
                  <div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${style.badgeBg} ${style.badgeText}`}>
                      {config.emoji} {config.label}
                    </span>
                    <h2 className={`mt-2 text-xl font-bold leading-tight ${isMythic ? 'text-white' : 'text-slate-950 dark:text-slate-50'}`}>
                      {career.title}
                    </h2>
                    <p className={`mt-0.5 text-xs font-semibold uppercase tracking-wide ${isMythic ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      {career.category}
                    </p>
                  </div>

                  <div>
                    <p className={`text-2xl font-extrabold ${style.salaryTextClass}`}>{career.salary}</p>
                    {bestSalary.id === career.id ? (
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                        ✓ Highest salary
                      </span>
                    ) : null}
                  </div>

                  <p className={`text-sm leading-6 ${isMythic ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>{career.description}</p>

                  {entryStep || seniorStep ? (
                    // Ternary of two COMPLETE class strings, not a
                    // concatenated `grid-cols-${n}` - Tailwind's build-time
                    // scanner can't see through string concatenation with a
                    // variable inside it (learned the hard way on the Roll
                    // a Job result card's tier-glow buttons earlier).
                    <div
                      className={`grid gap-2 rounded-xl p-3 text-center ${midStep ? 'grid-cols-3' : 'grid-cols-2'} ${
                        isMythic ? 'bg-white/5' : 'bg-slate-50 dark:bg-slate-900/40'
                      }`}
                    >
                      {entryStep ? (
                        <div>
                          <p className={`text-[10px] font-semibold uppercase tracking-wide ${isMythic ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>Entry</p>
                          <p className={`mt-0.5 text-xs font-bold ${isMythic ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>{salaryFromStep(entryStep)}</p>
                        </div>
                      ) : null}
                      {midStep ? (
                        <div>
                          <p className={`text-[10px] font-semibold uppercase tracking-wide ${isMythic ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>Mid</p>
                          <p className={`mt-0.5 text-xs font-bold ${isMythic ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>{salaryFromStep(midStep)}</p>
                        </div>
                      ) : null}
                      {seniorStep ? (
                        <div>
                          <p className={`text-[10px] font-semibold uppercase tracking-wide ${isMythic ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>Senior</p>
                          <p className={`mt-0.5 text-xs font-bold ${isMythic ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>{salaryFromStep(seniorStep)}</p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${isMythic ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>Entry requirements</p>
                    <ul className={`mt-2 space-y-1 text-sm ${isMythic ? 'text-slate-300' : 'text-slate-700 dark:text-slate-300'}`}>
                      {career.requirements.map((req) => (
                        <li key={req} className="list-disc pl-5">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="secondary" onClick={() => navigate(`/career/${career.id}`, { state: { from: 'binder-compare' } })} className="mt-auto w-full justify-center">
                    View full career
                    <ArrowLeft className="ml-1.5 h-4 w-4 rotate-180" aria-hidden="true" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5 dark:shadow-none">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Best for...</p>
          <ul className="mt-2.5 space-y-1.5 text-sm text-slate-700 dark:text-slate-200">
            <li>
              💰 Best salary: <strong className="text-slate-950 dark:text-white">{bestSalary.title}</strong>
            </li>
            <li>
              🚀 Easiest to start: <strong className="text-slate-950 dark:text-white">{easiestStart.title}</strong>
            </li>
            <li>
              📈 Best long-term: <strong className="text-slate-950 dark:text-white">{bestLongTerm.title}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
