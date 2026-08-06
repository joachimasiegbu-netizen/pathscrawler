import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'

// Even a mathematically smooth CSS gradient can render with visible banding
// (fake contour rings) because browsers only have 256 shades per channel to
// spread across the color range. A faint noise layer breaks up those bands
// without being visible as texture itself - standard fix for gradient banding.
const noiseSvg = `<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
const noiseDataUri = `data:image/svg+xml,${encodeURIComponent(noiseSvg)}`

// Same background color Role Selection (and the app shell generally) uses -
// matching it here is what actually kills the "hard cut" glitch. A crossfade
// between two mounted pages was tried and reverted (it re-introduced visible
// ghosting), so this fades out self-contained within this one page instead:
// content disappears, the vivid blue gradient dissolves into this exact
// color, and only once that's finished do we navigate - so by the time
// RoleSelectionPage mounts, the color is already sitting there waiting and
// the actual page swap is invisible.
const ROLE_SELECTION_BG = '#E0E7FF'
const EXIT_DURATION = 0.25

export default function LoadingPage() {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const [isExiting, setIsExiting] = useState(false)

  const handleStartJourney = () => {
    if (reduceMotion) {
      navigate('/role')
      return
    }
    setIsExiting(true)
    setTimeout(() => navigate('/role'), EXIT_DURATION * 1000)
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center gap-6 overflow-hidden px-8 py-8"
      style={{
        backgroundImage: `url("${noiseDataUri}"), radial-gradient(circle at center, #FFFFFF 0%, #D6E3FB 12%, #8FB8F5 30%, #5088EA 50%, #2C5FD6 70%, #142866 100%)`,
        backgroundBlendMode: 'overlay',
      }}
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: ROLE_SELECTION_BG }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 1 : 0 }}
        transition={{ duration: EXIT_DURATION }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-6 text-center"
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: EXIT_DURATION }}
      >
        <div className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg">
            <span className="text-3xl font-bold text-white">P</span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-primary-dark/70">PathScrawler</p>
            <h1 className="text-3xl font-bold leading-tight text-slate-900">Explore your future with clarity.</h1>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={handleStartJourney}
          animate={reduceMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
          transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
          className="cursor-pointer rounded-[24px] bg-primary px-7 py-4 text-center text-sm text-white shadow-lg transition duration-200 hover:bg-primary-dark"
        >
          Start journey
        </motion.button>
      </motion.div>
    </div>
  )
}
