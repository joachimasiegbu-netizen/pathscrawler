export interface BacktrackPathway {
  type: 'vocational' | 'university'
  name: string
  duration: string
  cost: string
  entryRequirements: string
  subjects: string[]
  description: string
}

export interface CourseLink {
  name: string
  url: string
  description: string
}

export interface Career {
  id: number
  /** Real UK employment share, as a percentage of the ~31.4M UK workforce -
   * ONS SOC 2020 occupation employee counts via the DfE "Occupations in
   * Demand" 2024 dataset, not derived from this app's own roll odds. Most
   * careers map to a specific 4-digit SOC code; a few whose title is
   * broader than any single SOC code in that dataset (e.g. "Construction
   * Trades Worker") use an average across that SOC group instead - see the
   * inline comment on each entry in demoCareers.js for its source. */
  employmentPercentage: number
  /** Human-readable rarity string (e.g. "1 in every 43,000 workers"),
   * preferred over computing "1 in every N" from employmentPercentage when
   * present. Used for the ultra-rare heritage-craft/specialist careers
   * whose headline counts are deliberately rounded, clean figures quoted
   * by the trade bodies themselves (Heritage Crafts etc.), rather than a
   * raw division that would print an oddly-precise number. Optional -
   * absent on the original 111 careers, which fall back to the computed
   * version. */
  rarityLabel?: string
  /** Hard-overrides careerTiers.ts's usual employmentPercentage-based tier
   * math - used ONLY for the 4 Celestial careers (Prime Minister,
   * President, Vice President, Royal Butler), whose real employment share
   * is technically far rarer than even the Mythic cutoff, but which are
   * deliberately kept OUT of the normal weighted roll pool entirely
   * (see rollEngine.ts) rather than folded into it - Celestial is reserved
   * for exactly these 4 named entries, never derived from data. Plain
   * string literal (not TierKey) to avoid this file importing from
   * careerTiers.ts, which itself imports Career from here. */
  forcedTier?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'celestial'
  category: string
  title: string
  salary: string
  description: string
  requirements: string[]
  supportTags?: string[]
  dayToDay: string[]
  whereToStudy: CourseLink[]
  progression: string[]
  similarCareers: number[]
  matchedSubjects: string[]
  backtrackPathways: BacktrackPathway[]
}

declare const demoCareers: Career[]
export default demoCareers
