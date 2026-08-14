import { BarChart3, Crown, Hammer, Rocket, Sparkles } from 'lucide-react'
import BackButton from '../components/BackButton'
import JobMarketDoorButton, { type DoorAccent } from '../components/JobMarketDoorButton'
import PageHeader from '../components/PageHeader'

// The old /job-market was a single long dashboard (spotlight card, ONS
// earnings, trending up/down, demand/salary/skills/sector charts - see
// MarketTicker.tsx, jobMarketData.js, onsEarnings.js, the charts/ components
// and getWeeklySpotlight()). This page is now a lobby of 4 doors instead;
// none of that content was deleted, it's just not wired up here anymore -
// it's the natural source material for filling in Spotlight and Statistics
// in a later pass, so it's left in place rather than removed as dead code.
interface Door {
  icon: typeof Sparkles
  title: string
  subtitle: string
  href: string
  accent: DoorAccent
  iconClassName?: string
}

const DOORS: Door[] = [
  {
    icon: Sparkles,
    title: "This Week's Spotlight",
    subtitle: 'Discover something new',
    href: '/job-market/spotlight',
    accent: 'purple',
  },
  {
    icon: BarChart3,
    title: 'Statistics',
    subtitle: 'Numbers behind the market',
    href: '/job-market/statistics',
    accent: 'blue',
  },
  {
    icon: Rocket,
    title: 'Easiest Jobs to Get Into',
    subtitle: 'No degree? No problem',
    href: '/job-market/easiest',
    accent: 'emerald',
  },
  {
    icon: Crown,
    title: 'Highest Paying Jobs',
    subtitle: 'Where the money is',
    href: '/job-market/highest-paying',
    accent: 'amber',
  },
  // "Roll a Job" moved to the main nav bar (see App.tsx, next to "Job
  // Market") - it's a top-level destination now, not buried a click deep
  // inside this hub. /job-market/roll itself is untouched, still reachable
  // by anyone who lands on this URL directly.
  {
    icon: Hammer,
    title: 'Career Smasher',
    subtitle: 'Break a job into skills, then branch to new careers',
    href: '/career-smasher',
    accent: 'orange',
    // hammer-smash-icon: only the icon does the wind-up-and-swing animation
    // on hover (index.css), not the whole card - matches every other door's
    // own separate lift/shadow hover treatment.
    iconClassName: 'hammer-smash-icon',
  },
]

export default function JobMarketPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
      <BackButton to="/role" />
      <PageHeader title="Job Market" subtitle="Explore careers your way" />
      <div className="flex flex-col gap-6">
        {DOORS.map((door, index) => (
          <JobMarketDoorButton key={door.href} {...door} index={index} />
        ))}
      </div>
    </div>
  )
}
