import { type LucideIcon } from 'lucide-react'
import BackButton from './BackButton'
import EmptyState from './EmptyState'
import PageHeader from './PageHeader'

interface JobMarketSubPageShellProps {
  icon: LucideIcon
  title: string
  subtitle: string
}

// Shared shell for the four Job Market door destinations - right now
// they're all placeholders ("Coming soon"), filled in per-page in a later
// pass. Each door still gets its own dedicated route/page file (not one
// parameterized route) since spotlight/statistics/easiest/highest-paying
// will diverge a lot once real content lands - this shell just keeps that
// eventual divergence from meaning four copies of the same boilerplate today.
export default function JobMarketSubPageShell({ icon, title, subtitle }: JobMarketSubPageShellProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <BackButton to="/job-market" label="Job Market" />
      <PageHeader title={title} subtitle={subtitle} />
      <EmptyState icon={icon} title="Coming soon" message="We're building this section out next - check back soon." />
    </div>
  )
}
