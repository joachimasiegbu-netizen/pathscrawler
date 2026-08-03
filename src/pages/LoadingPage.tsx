import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'
import WaveBackground from '../components/WaveBackground'

export default function LoadingPage() {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gap-6 bg-blue-600 px-8 py-8 text-white">
      <WaveBackground />
      <div className="relative flex flex-col items-center justify-center gap-6 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 shadow-lg">
            <span className="text-3xl font-bold text-white">P</span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-100/80">PathScrawler</p>
            <h1 className="text-3xl font-bold leading-tight">Explore your future with clarity.</h1>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={() => navigate('/role')}
          animate={reduceMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.75, 1, 0.75] }}
          transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
          className="cursor-pointer rounded-[24px] border border-white/20 bg-white/10 px-7 py-4 text-center text-sm text-slate-200 transition duration-200 hover:bg-white/20"
        >
          Start journey
        </motion.button>
      </div>
    </div>
  )
}
