import {
  Banknote,
  Bell,
  Briefcase,
  Calculator,
  Code2,
  Crown,
  Dumbbell,
  FlaskConical,
  GraduationCap,
  Hammer,
  Home,
  Landmark,
  Palette,
  Shield,
  Sprout,
  Stethoscope,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { Career } from '../data/demoCareers'
import { HammerAndChisel, Pliers } from './customIcons'

// One icon per career, for anywhere a career needs a single representative
// symbol rather than a full card (built for MythicRevealPreviewPage.tsx's
// reveal moment, general-purpose enough to reuse elsewhere later - e.g. the
// real Roll a Job Mythic reveal, if this preview gets adopted).
//
// Title overrides come first (checked in order, first match wins) for the
// handful of careers where the category-level icon would be too generic to
// read as "that specific job" at a glance - everything else falls back to
// one icon per category.
const TITLE_OVERRIDES: { match: RegExp; icon: LucideIcon }[] = [
  { match: /^(prime minister|president|vice president)$/i, icon: Landmark },
  { match: /royal butler/i, icon: Crown },
  { match: /investment banker/i, icon: Landmark },
  { match: /surgeon|anaesthetist|ophthalmologist|orthodontist|medical practitioner|doctor/i, icon: Stethoscope },
  { match: /chief financial|tax director|accountant/i, icon: Calculator },
  { match: /quantitative developer|software|developer|engineer.*data|data.*engineer/i, icon: Code2 },
  { match: /thatcher/i, icon: Home },
  { match: /bell founder/i, icon: Bell },
  // Was plain Hammer for both of these - lucide has no combined "hammer
  // and chisel" icon, and Hammer alone stood in for it since these two
  // stonemasonry/carving careers otherwise just fell through to the
  // Construction & Trades category default anyway (also Hammer). Fixed
  // now with a hand-built one - see customIcons.tsx's own comment on
  // HammerAndChisel.
  { match: /pargeter/i, icon: HammerAndChisel },
  { match: /figurehead carver/i, icon: HammerAndChisel },
  { match: /rattan furniture/i, icon: Pliers },
]

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Technology & Digital': Code2,
  'Business & Finance': Banknote,
  'Healthcare & Medicine': Stethoscope,
  'Engineering & Manufacturing': Wrench,
  'Creative & Media': Palette,
  'Education & Training': GraduationCap,
  'Service & Hospitality': UtensilsCrossed,
  'Agriculture & Animal Care': Sprout,
  'Sport & Leisure': Dumbbell,
  'Construction & Trades': Hammer,
  'Public Services': Shield,
  'Science & Research': FlaskConical,
}

// Pick, not the full Career - a couple of callers (SlotMachineLane's
// spinning reel) only ever have a career's title/tier/category in hand,
// not a complete Career record, and title/category are the only two
// fields this function actually reads.
export function getCareerIcon(career: Pick<Career, 'title' | 'category'>): LucideIcon {
  const override = TITLE_OVERRIDES.find((entry) => entry.match.test(career.title))
  if (override) return override.icon
  return CATEGORY_ICONS[career.category] ?? Briefcase
}
