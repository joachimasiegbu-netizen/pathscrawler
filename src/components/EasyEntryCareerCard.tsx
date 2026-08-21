import { useNavigate } from 'react-router-dom'
import { Clock, GraduationCap } from 'lucide-react'
import type { EasyEntryCareer } from '../utils/easyEntryCareers'
import SavePathwayButton from './SavePathwayButton'
import ShowFullPathwayButton from './ShowFullPathwayButton'

interface EasyEntryCareerCardProps {
  entry: EasyEntryCareer
}

export default function EasyEntryCareerCard({ entry }: EasyEntryCareerCardProps) {
  const navigate = useNavigate()
  const { career, qualificationLabel, timeToStart, whyEasy } = entry

  const goToDetail = () => navigate(`/career/${career.id}`)

  return (
    // A plain clickable div, not <button>, because the "See the pathway"
    // action below needs to be its own real <button> - nesting a button
    // inside a button is invalid HTML and makes click targeting
    // unpredictable, so this whole-card click and that inner button click
    // both exist side by side, with the inner one stopping propagation.
    // role="link" (not "button") since this goes to a different page,
    // rather than performing an action in place - a screen reader
    // announces it as "[title]... link" this way.
    <div
      role="link"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          goToDetail()
        }
      }}
      aria-label={`${career.title}, view career details`}
      // No hover:border-color here, same reasoning as HighestPayingCareerCard -
      // this card's own left edge (border-l-emerald-500) is a deliberate
      // "easy entry" accent, and a generic hover border-color utility would
      // win the cascade over it during hover and flash it to indigo.
      className="flex h-full w-full cursor-pointer flex-col rounded-2xl border border-l-4 border-gray-200 border-l-emerald-500 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] dark:border-slate-700 dark:border-l-emerald-500 dark:bg-slate-800"
    >
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          <Clock className="h-3 w-3" />
          {timeToStart}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          <GraduationCap className="h-3 w-3" />
          {qualificationLabel}
        </span>
      </div>

      <h3 className="mt-3 text-base font-bold text-slate-950 dark:text-slate-50">{career.title}</h3>
      <p className="mt-0.5 text-sm font-semibold text-slate-700 dark:text-slate-200">{career.salary}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{career.description}</p>

      <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-emerald-700 dark:border-slate-700 dark:text-emerald-400">
        {whyEasy}
      </p>

      <div className="mt-3 flex gap-2">
        <ShowFullPathwayButton career={career} className="flex-1" />
        <SavePathwayButton careerId={career.id} className="flex-1" />
      </div>
    </div>
  )
}
