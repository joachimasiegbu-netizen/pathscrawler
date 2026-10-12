import { useMemo, useState } from 'react'
import { Zap } from 'lucide-react'
import BackButton from '../components/BackButton'
import CompareButton from '../components/CompareButton'
import CompareFloatingButton from '../components/CompareFloatingButton'
import EasyEntryCareerCard from '../components/EasyEntryCareerCard'
import EmptyState from '../components/EmptyState'
import JobMarketFilterBar from '../components/JobMarketFilterBar'
import PageHeader from '../components/PageHeader'
import SelectableCareerCard from '../components/SelectableCareerCard'
import StaggerGrid from '../components/StaggerGrid'
import { filterEasyEntryCareers, getEasyEntryCareers, type FilterKey } from '../utils/easyEntryCareers'

export default function JobMarketEasiestPage() {
  const [filter, setFilter] = useState<FilterKey>('all')
  const allEntries = useMemo(() => getEasyEntryCareers(), [])
  const visibleEntries = useMemo(() => filterEasyEntryCareers(allEntries, filter), [allEntries, filter])

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <BackButton to="/job-market" label="Job Market" />
      <PageHeader icon={Zap} title="Easiest Jobs to Get Into" subtitle="Careers you can start without years of study" />

      {/* justify-start, not justify-between - Compare used to be pushed all
          the way to the far right edge of the row, leaving an odd gap from
          the "Showing N careers" count next to it (explicit request to
          bring it in close instead). */}
      <div className="flex flex-wrap items-center justify-start gap-3">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Showing {visibleEntries.length} {visibleEntries.length === 1 ? 'career' : 'careers'}
        </p>
        <CompareButton disabled={visibleEntries.length < 2} />
      </div>

      <JobMarketFilterBar active={filter} onChange={setFilter} />

      {visibleEntries.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No careers match this filter"
          message="Try 'All' to see everything."
          actionLabel="Show all"
          onAction={() => setFilter('all')}
        />
      ) : (
        <StaggerGrid revealOnMount className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleEntries.map((entry) => (
            <SelectableCareerCard key={entry.career.id} careerId={entry.career.id}>
              <EasyEntryCareerCard entry={entry} />
            </SelectableCareerCard>
          ))}
        </StaggerGrid>
      )}

      <CompareFloatingButton />
    </div>
  )
}
