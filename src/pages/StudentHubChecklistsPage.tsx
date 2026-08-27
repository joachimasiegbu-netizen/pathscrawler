import { ListChecks } from 'lucide-react'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import Checklist from '../components/Checklist'
import StudentHubFaqFooter from '../components/StudentHubFaqFooter'
import { SFE_CHECKLIST, UCAS_CHECKLIST } from '../data/studentHubFaq'

export default function StudentHubChecklistsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <BackButton to="/student-hub" label="Student Hub" />
      <PageHeader
        icon={ListChecks}
        title="Checklists"
        subtitle="Tick things off as you go. Hit Copy to paste the list into your notes."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Checklist title="Student Finance application" items={SFE_CHECKLIST} />
        <Checklist title="UCAS application" items={UCAS_CHECKLIST} />
      </div>

      <StudentHubFaqFooter faqId="sf-when-apply" />
    </div>
  )
}
