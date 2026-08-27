import {
  BadgePoundSterling,
  Calculator,
  GraduationCap,
  Hammer,
  HelpCircle,
  Landmark,
  ListChecks,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { DoorAccent } from '../components/JobMarketDoorButton'
import type { FaqTopic } from './studentHubFaq'

export interface HubSection {
  id: string
  path: string
  title: string
  subtitle: string
  icon: LucideIcon
  accent: DoorAccent
  /** Set when the page is a FAQ topic page rendered by StudentHubTopicPage. */
  topic?: FaqTopic
  /** The one FAQ shown in this page's end-of-page callout. */
  spotlightFaqId?: string
  /** Extra "go here next" links shown on a topic page, above the FAQ callout. */
  relatedLinks?: { label: string; path: string }[]
}

// Tiles on the /student-hub lobby, in order. The first five are FAQ topic
// pages (one generic component, routed by :topic); the rest are their own
// pages.
//
// spotlightFaqId on a topic page ALWAYS points at a FAQ from a DIFFERENT
// topic - the end-of-page callout is a "you might also wonder" cross-link,
// so it can never repeat a question already listed on that page.
export const HUB_SECTIONS: HubSection[] = [
  {
    id: 'debt-calculator',
    path: '/student-hub/debt-calculator',
    title: 'Debt Calculator',
    subtitle: 'See your loan balance year by year',
    icon: Calculator,
    accent: 'indigo',
    spotlightFaqId: 'rep-clear-early',
  },
  {
    id: 'student-finance',
    path: '/student-hub/student-finance',
    title: 'Student Finance',
    subtitle: 'Applying for SFE, step by step',
    icon: Landmark,
    accent: 'blue',
    topic: 'student-finance',
    spotlightFaqId: 'mnt-how-much',
  },
  {
    id: 'ucas',
    path: '/student-hub/ucas',
    title: 'UCAS and applying',
    subtitle: 'Deadlines, personal statement, Clearing',
    icon: GraduationCap,
    accent: 'purple',
    topic: 'ucas',
    spotlightFaqId: 'sf-when-apply',
  },
  {
    id: 'repaying',
    path: '/student-hub/repaying',
    title: 'Repaying your loan',
    subtitle: 'Plan 5, interest, and when it gets written off',
    icon: BadgePoundSterling,
    accent: 'amber',
    topic: 'repaying',
    spotlightFaqId: 'app-debt',
    relatedLinks: [
      { label: 'Model your own balance in the Debt Calculator', path: '/student-hub/debt-calculator' },
      { label: 'See the no-debt route: Apprenticeship vs University', path: '/student-hub/apprenticeship-or-uni' },
    ],
  },
  {
    id: 'maintenance',
    path: '/student-hub/maintenance',
    title: 'Maintenance Loan',
    subtitle: 'What you get to live on, and why it varies',
    icon: Wallet,
    accent: 'emerald',
    topic: 'maintenance',
    spotlightFaqId: 'sf-household-income',
  },
  {
    id: 'apprenticeship-or-uni',
    path: '/student-hub/apprenticeship-or-uni',
    title: 'Apprenticeship vs University',
    subtitle: 'Earn while you learn, and the trade-offs',
    icon: Hammer,
    accent: 'rose',
    topic: 'apprenticeship-or-uni',
    spotlightFaqId: 'rep-write-off',
  },
  {
    id: 'checklists',
    path: '/student-hub/checklists',
    title: 'Checklists',
    subtitle: 'Student Finance and UCAS, tick as you go',
    icon: ListChecks,
    accent: 'emerald',
    spotlightFaqId: 'sf-when-apply',
  },
  {
    id: 'faq',
    path: '/student-hub/faq',
    title: 'All FAQs',
    subtitle: 'Every question in one place',
    icon: HelpCircle,
    accent: 'purple',
  },
]

export function sectionByTopic(topic: string): HubSection | undefined {
  return HUB_SECTIONS.find((s) => s.topic === topic)
}
