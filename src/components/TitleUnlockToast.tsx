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
// (RollStandingPanel.tsx) still owns the 5s auto-dismiss timer.
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
      className="fixed bottom-6 left-1/2 z-[60] w-[min(92vw,400px)] -translate-x-1/2 overflow-hidden rounded-2xl border bg-white shadow-2xl dark:bg-slate-800"
      style={{ borderColor: `${accent}66` }}
    >
      <div className="h-1 w-full" style={{ backgroundColor: accent }} />
      <div className="flex items-start gap-3 p-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}22`, color: accent }}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 dark:text-white">Title unlocked: {title.name}</p>
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
