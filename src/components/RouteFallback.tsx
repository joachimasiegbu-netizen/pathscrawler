import { usePathStore } from '../store/usePathStore'

/**
 * What shows while a route's chunk is in flight (App.tsx's <Suspense> around
 * <Routes>, added when the 62 pages were split with React.lazy).
 *
 * Deliberately almost nothing: on a warm cache a chunk resolves in a few
 * milliseconds, and a spinner that appears and vanishes inside one frame
 * reads as a flicker - worse than a brief blank. So this holds the page's
 * height to stop the footer jumping up the screen, and only fades a quiet
 * label in after a beat, by which point the wait is real enough to explain.
 *
 * aria-busy + role="status" rather than a visible spinner is also what a
 * screen reader actually wants here: "loading", once, not a decorative
 * animation it has no way to describe.
 */
export default function RouteFallback() {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-[60vh] items-center justify-center px-4"
    >
      <span
        className={`text-sm text-slate-400 dark:text-slate-500 ${reduceMotion ? '' : 'route-fallback-label'}`}
      >
        Loading…
      </span>
    </div>
  )
}
