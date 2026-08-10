import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'
import Logo from '../components/Logo'

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
// content disappears, the vivid indigo gradient dissolves into this exact
// color, and only once that's finished do we navigate - so by the time
// RoleSelectionPage mounts, the color is already sitting there waiting and
// the actual page swap is invisible. Two variants because that target color
// itself depends on dark mode (bg-background vs bg-background-dark).
const ROLE_SELECTION_BG_LIGHT = '#F8FAFC'
const ROLE_SELECTION_BG_DARK = '#0F172A'
const EXIT_DURATION = 0.25

export default function LoadingPage() {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const darkMode = usePathStore((state) => state.accessibilitySettings.darkMode)
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
        backgroundImage: `url("${noiseDataUri}"), radial-gradient(circle at center, #FFFFFF 0%, #E4E9F2 12%, #A7BDD9 30%, #5D82AC 50%, #2E4A70 70%, #0F1E30 100%)`,
        backgroundBlendMode: 'overlay',
      }}
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: darkMode ? ROLE_SELECTION_BG_DARK : ROLE_SELECTION_BG_LIGHT }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 1 : 0 }}
        transition={{ duration: EXIT_DURATION }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-6 text-center"
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: EXIT_DURATION }}
      >
        <div className="space-y-6">
          <motion.div
            className="flex justify-center"
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={reduceMotion ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Logo size="lg" />
          </motion.div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900">Explore your future with clarity.</h1>
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
