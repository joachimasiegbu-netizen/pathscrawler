import { useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  Clock,
  GraduationCap,
  Route,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import type { HighestPayingCareer } from '../utils/highestPayingCareers'
import SavePathwayButton from './SavePathwayButton'
import ShowFullPathwayButton from './ShowFullPathwayButton'

interface HighestPayingCareerCardProps {
  entry: HighestPayingCareer
}

type SectionKey = 'pathway' | 'why' | 'negotiate' | 'side'

const SECTIONS: { key: SectionKey; label: string; icon: typeof Route }[] = [
  { key: 'pathway', label: 'Full pathway', icon: Route },
  { key: 'why', label: 'Why it pays well', icon: TrendingUp },
  { key: 'negotiate', label: 'Negotiation tips', icon: GraduationCap },
  { key: 'side', label: 'Side income potential', icon: Wallet },
]

export default function HighestPayingCareerCard({ entry }: HighestPayingCareerCardProps) {
  const navigate = useNavigate()
  const { career } = entry
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(() => new Set(['pathway']))

  const goToDetail = () => navigate(`/career/${career.id}`, { state: { from: 'highest-paying' } })

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToDetail()
    }
  }

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    // Whole card navigates to the detail page (role="link", not "button" -
    // it goes to a different resource, not performing an in-place action).
    // Everything else INSIDE that's independently clickable (accordion
    // toggles, Backtrack, Save) stops propagation so it doesn't also
    // trigger this navigation - same pattern as EasyEntryCareerCard.
    <div
      role="link"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={handleKeyDown}
      aria-label={`${career.title}, view career details`}
      // No hover:border-color here - this card's left edge is a deliberate
      // amber accent (border-l-amber-500) marking "highest paying," and a
      // generic hover border-color utility would win the cascade over it
      // during hover (a `:hover` pseudo-class selector out-specifies a
      // plain class one) and flash it to indigo. Lift + shadow alone is
      // already a clear enough hover cue without touching that color.
      className="flex h-full cursor-pointer flex-col rounded-2xl border border-l-4 border-gray-200 border-l-amber-500 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] dark:border-slate-700 dark:border-l-amber-500 dark:bg-slate-800"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{career.category}</p>
          <h3 className="mt-1 text-xl font-bold text-slate-950 dark:text-slate-50">{career.title}</h3>
        </div>
        <span className="shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400">
          Rank #{entry.rank}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-lg font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-400">
          {entry.medianSalary} - {entry.peakSalary}
        </span>
        {entry.noDegreeNeeded ? (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
            No degree needed
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          ~{entry.timeToSenior} to senior
        </span>
      </div>

      {/* Accordion sections */}
      <div className="mt-5 divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-700 dark:border-slate-700">
        {SECTIONS.map(({ key, label, icon: Icon }) => {
          const isOpen = openSections.has(key)
          return (
            <div key={key}>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  toggleSection(key)
                }}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-2 py-3 text-left"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  <Icon className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  {label}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4">
                      {key === 'pathway' ? (
                        <div className="relative space-y-4 pl-5">
                          <div className="absolute bottom-1 left-[5px] top-1 w-0.5 bg-amber-200 dark:bg-amber-900" aria-hidden="true" />
                          {entry.pathwaySteps.map((step) => (
                            <div key={step.label} className="relative">
                              <span className="absolute -left-5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-amber-500 bg-white dark:bg-slate-800" aria-hidden="true" />
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">{step.label}</p>
                              <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-sm font-bold text-slate-950 dark:text-slate-50">
                                {step.title}
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{step.salary}</span>
                              </p>
                              <p className="mt-0.5 text-xs leading-5 text-slate-600 dark:text-slate-300">{step.detail}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      {key === 'why' ? (
                        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{entry.whyItPaysWell}</p>
                      ) : null}
                      {key === 'negotiate' ? (
                        <ul className="space-y-1.5">
                          {entry.negotiationTips.map((tip) => (
                            <li key={tip} className="flex items-start gap-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {key === 'side' ? (
                        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{entry.sideIncome}</p>
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
        <ShowFullPathwayButton career={career} className="flex-1" />
        <SavePathwayButton careerId={career.id} className="flex-1" />
      </div>
    </div>
  )
}
