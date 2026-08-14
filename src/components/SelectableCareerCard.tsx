import { useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { useCompareStore } from '../store/useCompareStore'
import Toast from './Toast'

interface SelectableCareerCardProps {
  careerId: number
  children: ReactNode
  className?: string
  /**
   * Optional whole-card click-to-navigate, for callers whose "card" is a
   * bespoke div (not the shared Card.tsx, which has its own onClick prop) -
   * e.g. CareerChangerResultsPage. Applies the same role="link"/tabIndex/
   * Enter+Space handling as Card.tsx, on this component's own outer div,
   * and (critically) makes the selection-toggle overlay below
   * stopPropagation so toggling a selection in selection mode doesn't ALSO
   * fire this as a navigation.
   */
  onClick?: () => void
  /** Accessible name for screen readers when onClick is set. */
  ariaLabel?: string
}

// Wraps an EXISTING career card (whatever markup a page already renders -
// Card, EasyEntryCareerCard, HighestPayingCareerCard, a bespoke div, ...)
// with the Binder's Google-Photos-style selection affordance, without that
// card needing to know selection mode exists. Outside selection mode this
// is a total pass-through (just `children`, no extra DOM) unless onClick is
// set. Inside selection mode: the real card dims and goes inert
// (`pointer-events-none`, so its own buttons/links can't be triggered by
// mistake), and an invisible full-cover button on top intercepts the tap to
// toggle selection instead - simpler and more robust than trying to detect
// "was this click on MY circle or on the card's own button underneath" via
// bubbling.
export default function SelectableCareerCard({ careerId, children, className = '', onClick, ariaLabel }: SelectableCareerCardProps) {
  const selectionMode = useCompareStore((state) => state.compareSelectionMode)
  const selected = useCompareStore((state) => state.selectedCompareCards.includes(careerId))
  const toggleCompareSelection = useCompareStore((state) => state.toggleCompareSelection)
  const [showMaxToast, setShowMaxToast] = useState(false)
  const isInteractive = Boolean(onClick)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  // className (e.g. ResultPage's "highlighted dream career" ring) has to
  // keep applying outside selection mode too - a bare Fragment pass-through
  // here would silently drop it, since Fragments can't carry a className.
  if (!selectionMode) {
    return (
      <div
        role={isInteractive ? 'link' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={onClick}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        aria-label={isInteractive ? ariaLabel : undefined}
        className={`${className} ${isInteractive ? 'cursor-pointer' : ''}`}
      >
        {children}
      </div>
    )
  }

  const handleToggle = (event: MouseEvent) => {
    // Without this, toggling a selection would bubble up to the card-level
    // onClick below (when set) and navigate away mid-selection.
    event.stopPropagation()
    const result = toggleCompareSelection(careerId)
    if (result === 'max-reached') {
      setShowMaxToast(true)
      window.setTimeout(() => setShowMaxToast(false), 2500)
    }
  }

  return (
    <div className={`relative ${className}`} onClick={onClick ? (event) => event.stopPropagation() : undefined}>
      {/* inert (not just pointer-events-none): several of the wrapped cards
          are a whole clickable/keyboard-focusable div (role="button"/"link"
          tabIndex={0}, Enter/Space triggers navigation) - pointer-events
          alone only blocks mouse/touch, so a keyboard user tabbing through
          the page could still reach and activate the card underneath,
          bypassing the selection overlay entirely. inert removes it from
          the tab order and blocks all interaction, not just pointer ones. */}
      {/* @types/react doesn't know about `inert` yet even though every
          current browser does - cast is just to satisfy the JSX typing. */}
      <div
        className="pointer-events-none opacity-60 transition-opacity duration-200"
        {...({ inert: '' } as Record<string, string>)}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={selected}
        aria-label={selected ? 'Remove this career from comparison' : 'Select this career for comparison'}
        className="absolute inset-0 z-10 cursor-pointer rounded-2xl"
      />
      {/* 24x24px per the brief - a fixed size here, not the Binder's
          responsive h-5/h-6, since these grids run at more varied widths. */}
      <span
        className={`pointer-events-none absolute left-2 top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-sm transition-colors ${
          selected ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'
        }`}
        aria-hidden="true"
      >
        {selected ? <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} /> : null}
      </span>
      {showMaxToast ? <Toast message="You can only compare up to 3 careers at once" type="info" /> : null}
    </div>
  )
}
