import { GraduationCap } from 'lucide-react'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import JobMarketDoorButton from '../components/JobMarketDoorButton'
import { HUB_SECTIONS } from '../data/studentHubSections'

// The Student Hub landing - a lobby of tiles, one per topic, so a school
// leaver can go straight to the thing they need instead of scrolling a wall
// of text. Each tile leads to a short FAQ page (or a tool).
export default function StudentHubPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
      <BackButton to="/role" label="Home" />
      <PageHeader
        icon={GraduationCap}
        title="Student Hub"
        subtitle="Loans, UCAS, apprenticeships and skills. Short answers, so you can decide for yourself."
      />
      <div className="flex flex-col gap-6">
        {HUB_SECTIONS.map((section, index) => (
          <JobMarketDoorButton
            key={section.id}
            icon={section.icon}
            title={section.title}
            subtitle={section.subtitle}
            href={section.path}
            accent={section.accent}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
