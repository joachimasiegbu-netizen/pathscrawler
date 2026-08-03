import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react'
import { usePathStore } from '../store/usePathStore'
import WaveBackground from '../components/WaveBackground'

export default function BacktrackWelcomePage() {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gap-6 bg-blue-600 px-8 py-8 text-white">
      <WaveBackground />

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-6 top-8 inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition hover:text-white"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>

      <div className="relative flex max-w-md flex-col items-center justify-center gap-6 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 shadow-lg">
            <Compass className="h-9 w-9 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-100/80">Backtrack your path</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight">How do I get there?</h1>
          </div>
          <p className="text-sm leading-6 text-slate-100/90">
            Know your dream career? We'll show you the exact steps to get there.
          </p>
        </div>

        <motion.button
          type="button"
          onClick={() => navigate('/backtrack/categories')}
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-primary shadow-lg transition hover:bg-slate-50"
        >
          Find my pathway
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  )
}
