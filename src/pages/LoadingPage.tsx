import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'

export default function LoadingPage() {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center gap-6 px-8 py-8"
      style={{
        background:
          'radial-gradient(circle at center, #FFFFFF 0%, #D6E3FB 12%, #8FB8F5 30%, #5088EA 50%, #2C5FD6 70%, #142866 100%)',
      }}
    >
      <div className="relative flex flex-col items-center justify-center gap-6 text-center">
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
          onClick={() => navigate('/role')}
          animate={reduceMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
          transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
          className="cursor-pointer rounded-[24px] bg-primary px-7 py-4 text-center text-sm text-white shadow-lg transition duration-200 hover:bg-primary-dark"
        >
          Start journey
        </motion.button>
      </div>
    </div>
  )
}
