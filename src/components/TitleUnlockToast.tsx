import { Check, Crown, Flame, Skull, Sparkles, Trophy, X } from 'lucide-react'
import type { TitleIcon, TitleWithStatus } from '../utils/titles'

const ICONS: Record<TitleIcon, typeof Trophy> = {
  crown: Crown,
  flame: Flame,
  skull: Skull,
  sparkles: Sparkles,
  trophy: Trophy,
}

// Richer replacement for the generic <Toast> when a title unlocks: tinted to
// the title's rarity colour, shows the flavour subtitle, and offers a
// one-tap "Equip" straight from the toast (spec). The parent
// (RollStandingPanel.tsx) still owns the 5s auto-dismiss timer and the
// unlock chime.
//
// Redesigned per an explicit reference (a "success message" card with a
// torn/zigzag left edge, a circular icon badge, bold heading + muted
// subtext, and an X) - adopted the CARD SHAPE (the zigzag edge, the round
// icon badge) and the TOP-OF-SCREEN position, but kept this component's own
// already-good behavior rather than flattening it to match the reference
// literally: each title keeps ITS OWN icon (crown/flame/skull/...) and
// rarity colour tinting the zigzag/badge/equip-button, instead of a
// hardcoded green checkmark for every unlock - a plain checkmark would be a
// real loss of the per-title identity this panel already has everywhere
// else (TitlePill, the Titles tab, the detail modal).
export default function TitleUnlockToast({
  title,
  isEquipped,
  onEquip,
  onDismiss,
}: {
  title: TitleWithStatus
  isEquipped: boolean
  onEquip: () => void
  onDismiss: () => void
}) {
  const Icon = ICONS[title.icon]
  // '#ffffff' would be invisible on the near-white toast body - use a warm
  // gold instead for the accent furniture (matches the "white + gold glow"
  // identity), while the pill itself elsewhere keeps the real white.
  const accent = title.color === '#ffffff' ? '#d97706' : title.color

  return (
    <div
      role="status"
      // top-20, not bottom-6 (per explicit request to move this to the top
      // of the screen) - clears the header's own icon row (h-11 circles +
      // padding) plus a comfortable gap, rather than sitting flush under it.
      className="fixed left-1/2 top-20 z-[60] w-[min(92vw,400px)] -translate-x-1/2 overflow-hidden rounded-2xl border bg-white shadow-2xl dark:bg-slate-800"
      style={{ borderColor: `${accent}66` }}
    >
      {/* Zigzag/torn-edge accent, tinted to the title's own colour - a pure
          CSS repeating-gradient "sawtooth" (two 45deg gradients tiled
          vertically), not an SVG: it needs to tile cleanly to whatever
          height this card ends up being (subtitle length, equip button,
          etc. all vary it), which a fixed-size shape can't do without
          stretching/distorting. w-3, not wider - a hinted accent along the
          edge, not a competing block of colour next to the icon badge. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-3"
        style={{
          backgroundImage: `linear-gradient(135deg, transparent 50%, ${accent} 50%), linear-gradient(45deg, ${accent} 50%, transparent 50%)`,
          backgroundSize: '12px 12px',
          backgroundRepeat: 'repeat-y',
          opacity: 0.35,
        }}
        aria-hidden="true"
      />

      <div className="flex items-start gap-3 py-4 pl-6 pr-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accent}22`, color: accent }}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold" style={{ color: accent }}>
            Title unlocked: {title.name}
          </p>
          <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-300">{title.subtitle}</p>

          <button
            type="button"
            onClick={onEquip}
            disabled={isEquipped}
            className="mt-2 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white transition disabled:opacity-70"
            style={{ backgroundColor: accent }}
          >
            {isEquipped ? <Check className="h-3 w-3" /> : null}
            {isEquipped ? 'Equipped' : 'Equip now'}
          </button>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 text-slate-400 transition hover:text-slate-700 dark:text-slate-500 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
