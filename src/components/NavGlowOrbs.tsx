// The 12 floating blurred circles behind "Job Market"/"Roll a Job" in the
// header (App.tsx) - see .nav-glow-btn in index.css for the actual colors/
// animation. Split into its own component purely so the two buttons that
// use it don't each need to repeat this same list of 12 divs inline.
const CIRCLE_KEYS = Array.from({ length: 12 }, (_, i) => i + 1)

export default function NavGlowOrbs() {
  return (
    <>
      {CIRCLE_KEYS.map((n) => (
        <div key={n} className={`glow-circle c${n}`} aria-hidden="true" />
      ))}
    </>
  )
}
