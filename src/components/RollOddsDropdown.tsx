import { useState } from 'react'
import { ChevronDown, Info } from 'lucide-react'
import { TIERS } from '../utils/careerTiers'

// "1 in N rolls" instead of a raw percentage - a fraction like 0.25% reads
// a lot less intuitively at a glance than "1 in 400". Separate copy of this
// formatting from RollStandingPanel.tsx's own formatChance() on purpose -
// that panel deliberately shows the percentage instead (reverted back to
// it per explicit request, after briefly trying this same "1 in N" format
// there first) - this is a second, independent place with its own,
// different format, not a shared helper the two disagreeing would be a bug.
function formatOdds(share: number): string {
  const n = Math.round(1 / share)
  return `1 in ${n.toLocaleString('en-GB')}`
}

// Small standalone dropdown sitting right under the Roll button itself
// (JobMarketRollPage.tsx) - deliberately its own button, not folded into
// the Roll Odds tab already inside the header's Trophy dropdown
// (RollStandingPanel.tsx), per explicit request for a second, separate
// one specifically in "1 in N" format with its own disclaimer. Always-dark
// styling (not light/dark-toggle-aware) is intentional here, unlike
// RollStandingPanel - this only ever lives on Roll a Job's own forced-dark
// "game mode" page, never the ambient-toggle header.
export default function RollOddsDropdown() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="See real roll odds"
        className="flex items-center gap-1.5 text-xs font-semibold text-indigo-200/70 transition hover:text-indigo-100"
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
        See real odds
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* right-0, not centered - this trigger sits on the right side
              of its own row (Job Market left / See real odds right,
              JobMarketRollPage.tsx), so a panel centered under it would
              overflow off that row's own right edge. Anchoring the
              panel's right edge to the button's keeps it fully
              contained instead. */}
          <div className="absolute right-0 top-full z-50 mt-2 w-[min(88vw,300px)] rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
            <ul className="space-y-1.5 text-sm">
              {TIERS.map((tier) => (
                <li key={tier.key} className="flex items-center justify-between text-white/80">
                  <span>
                    {tier.emoji} {tier.label}
                  </span>
                  <span className="font-mono text-white/50">{formatOdds(tier.targetShare)}</span>
                </li>
              ))}
            </ul>
            {/* The disclaimer, per explicit request - these ARE the real,
                exact numbers this app rolls with (not rounded for show),
                but stated plainly so nobody reads "1 in 400" as some kind
                of promise or countdown to their next Mythic. */}
            <p className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-5 text-white/40">
              These are the real, technically accurate odds - but every roll is completely independent and random.
              Don't put too much trust in these numbers predicting your next pull.
            </p>
          </div>
        </>
      ) : null}
    </div>
  )
}
