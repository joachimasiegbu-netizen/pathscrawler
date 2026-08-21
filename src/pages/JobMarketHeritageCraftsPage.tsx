import { useNavigate } from 'react-router-dom'
import { Hammer } from 'lucide-react'
import BackButton from '../components/BackButton'
import Card from '../components/Card'
import RevealSection from '../components/RevealSection'
import ScrollToTopButton from '../components/ScrollToTopButton'
import StaggerGrid from '../components/StaggerGrid'
import { statsSources } from '../data/ukLabourMarketStats'
import { heritageCraftCareers } from '../utils/labourMarketCareerExamples'

// Own page (not a dropdown) for the "Endangered & heritage crafts" stats on
// JobMarketUkStatsPage - all 5 of those stat cards used to each open an
// identical list of the same 7 careers (the app has no per-craft
// critically-endangered/endangered/viable breakdown to tell them apart), so
// rather than 5 buttons to the same content, there's one link out here. The
// Red List recap stats (72/93/115/285/165, the "12 new in 2025" callout)
// stay back on JobMarketUkStatsPage only - repeating them here as well was
// the actual complaint that got this page split off, so this is just the
// unique content: the career list itself.

export default function JobMarketHeritageCraftsPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/job-market/statistics/uk-numbers" label="UK Labour Market Numbers" />
        <div>
          <h2 className="flex items-center gap-3 text-4xl font-extrabold text-slate-950 dark:text-slate-50 sm:text-5xl">
            <Hammer className="h-8 w-8 shrink-0 text-amber-600 dark:text-amber-400 sm:h-9 sm:w-9" aria-hidden="true" />
            Endangered & Heritage Crafts
          </h2>
          <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-amber-500 to-amber-300" />
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-200">
            The Heritage Crafts Red List 2025 tracks 165 at-risk UK crafts. PathScrawler has full career profiles for
            {' '}{heritageCraftCareers.length} of them below - not all 165, just the ones with real, sourced data behind
            them.
          </p>
        </div>
      </div>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          <Hammer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          Heritage crafts on PathScrawler
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {heritageCraftCareers.length} of the UK's rarest real occupations - also PathScrawler's Mythic-tier Weekly
          Spotlight careers.
        </p>

        <StaggerGrid className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {heritageCraftCareers.map((career) => (
            <Card
              key={career.id}
              title={career.title}
              description={career.description}
              badge={career.salary}
              animateBadge={false}
              onClick={() => navigate(`/career/${career.id}`)}
              ariaLabel={`${career.title}, view career details`}
            >
              <p className="mt-1 text-xs font-semibold text-amber-700 dark:text-amber-400">{career.rarityLabel}</p>
            </Card>
          ))}
        </StaggerGrid>
      </RevealSection>

      <RevealSection className="text-center text-xs text-slate-400 dark:text-slate-500">
        <p>Source: {statsSources[2]}.</p>
      </RevealSection>

      <ScrollToTopButton />
    </div>
  )
}
