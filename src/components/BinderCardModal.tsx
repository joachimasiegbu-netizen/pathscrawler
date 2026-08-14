import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Trash2, X } from 'lucide-react'
import demoCareers from '../data/demoCareers'
import { getTierConfig } from '../utils/careerTiers'
import { getTierStyle } from '../utils/tierStyles'
import type { GroupedBinderCard } from '../utils/binderGrouping'
import { usePathStore } from '../store/usePathStore'

interface BinderCardModalProps {
  entry: GroupedBinderCard
  onClose: () => void
  onRemove: () => void
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Full-size detail view of a binder slot - same tier-colored card language
// as RollResultCard, plus the collection-specific facts (roll date, roll
// attempt #, how many copies) and a remove action. "Remove from binder"
// removes every copy of this career, not just one - a binder slot is the
// career, duplicates are just a count on it.
export default function BinderCardModal({ entry, onClose, onRemove }: BinderCardModalProps) {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const [armed, setArmed] = useState(false)
  const { latest, count } = entry
  const career = demoCareers.find((item) => item.id === latest.careerId)

  const config = getTierConfig(latest.tier)
  const style = getTierStyle(latest.tier)
  const isMythic = latest.tier === 'mythic'

  const handleRemove = () => {
    if (!armed) {
      setArmed(true)
      window.setTimeout(() => setArmed(false), 3000)
      return
    }
    onRemove()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6"
      onClick={onClose}
    >
      <motion.div
        onClick={(event) => event.stopPropagation()}
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`relative w-full max-w-md rounded-2xl border-l-4 p-6 shadow-2xl ${style.cardBorder} ${
          isMythic ? 'bg-slate-950' : `bg-white ${style.cardTint} dark:bg-slate-800`
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`absolute right-3 top-3 rounded-full p-1.5 transition ${
            isMythic ? 'text-slate-400 hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${style.badgeBg} ${style.badgeText}`}>
            {config.emoji} {config.label}
          </span>
          {count > 1 ? (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isMythic ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
              {count} copies
            </span>
          ) : null}
        </div>

        <h2 className={`mt-3 text-2xl font-bold ${isMythic ? 'text-white' : 'text-slate-950 dark:text-slate-50'}`}>{latest.title}</h2>
        <p className={`mt-1 text-lg font-semibold ${isMythic ? 'text-amber-400' : 'text-slate-700 dark:text-slate-200'}`}>{latest.salary}</p>

        {career ? (
          <p className={`mt-3 line-clamp-3 text-sm leading-6 ${isMythic ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>{career.description}</p>
        ) : null}

        <div className={`mt-4 space-y-1 border-t pt-4 text-xs ${isMythic ? 'border-white/10 text-slate-400' : 'border-slate-100 text-slate-500 dark:border-slate-700 dark:text-slate-400'}`}>
          <p>Roll date: {formatDate(latest.dateRolled)}</p>
          <p>Rolled on attempt #{latest.rollAttemptNumber}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 text-sm font-semibold">
          <button
            type="button"
            onClick={() => career && navigate(`/career/${career.id}`, { state: { from: 'binder' } })}
            disabled={!career}
            className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            View full career page
            <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className={`col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 transition ${
              armed
                ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400'
                : isMythic
                  ? 'border-white/15 text-slate-300 hover:bg-white/10'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/50'
            }`}
          >
            <Trash2 className="h-4 w-4 shrink-0" />
            {armed ? 'Click again to confirm removal' : count > 1 ? `Remove from binder (${count} copies)` : 'Remove from binder'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
