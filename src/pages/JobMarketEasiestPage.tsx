import { useMemo, useState } from 'react'
import { Zap } from 'lucide-react'
import BackButton from '../components/BackButton'
import EasyEntryCareerCard from '../components/EasyEntryCareerCard'
import EmptyState from '../components/EmptyState'
import JobMarketFilterBar from '../components/JobMarketFilterBar'
import PageHeader from '../components/PageHeader'
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

      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        Showing {visibleEntries.length} {visibleEntries.length === 1 ? 'career' : 'careers'}
      </p>

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
            <EasyEntryCareerCard key={entry.career.id} entry={entry} />
          ))}
        </StaggerGrid>
      )}
    </div>
  )
}
