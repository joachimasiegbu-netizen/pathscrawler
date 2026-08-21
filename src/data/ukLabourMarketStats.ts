// Real UK labour market reference stats, compiled August 2026 from ONS
// Labour Market (Aug 2026), Skills England Occupations in Demand 2025, and
// the Heritage Crafts Red List 2025 - see PathScrawler_UK_Stats.txt for the
// original compiled source table this file mirrors. Kept as its own data
// file (same pattern as onsEarnings.ts) since these are exact quoted
// figures from named releases, not illustrative/generated data.
//
// Deliberately NOT included here: the source table's two "average weekly
// earnings" figures (£755 total pay / £703 regular pay). The Statistics
// page this links from already has its own earnings section (median weekly/
// annual earnings + a nominal-vs-real growth chart, from a different ONS
// release) - showing a second, similarly-worded pay figure right after
// that would read as a repeat even though the underlying series differs.
// Everything below is either genuinely new (employment size/rate, heritage
// craft counts) or a different granularity of "demand" than that page's
// per-career trending list (economy-wide shortage counts vs named careers).

export interface StatEntry {
  label: string
  value: string
  note: string
}

// --- Core UK labour market context ------------------------------------------
// This is also the real-world denominator PathScrawler's rarity system is
// built on - every "1 in every N workers" figure across Roll a Job and the
// career pages divides into this same ~34.5M total (see demoCareers.js).
export const coreLabourMarketStats: StatEntry[] = [
  { label: 'People in employment (UK, aged 16+)', value: '34.47 million', note: 'ONS, Apr-Jun 2026' },
  { label: 'Employment rate (16-64)', value: '75.1%', note: 'ONS, Apr-Jun 2026' },
  { label: 'Unemployment rate', value: '4.9%', note: 'ONS, Apr-Jun 2026' },
  { label: 'Self-employed', value: '~4.53-4.57 million', note: 'ONS Labour Force Survey, recent quarters' },
]

// --- Rarity & heritage craft stats -------------------------------------------
export const heritageCraftStats: StatEntry[] = [
  { label: 'Critically endangered heritage crafts', value: '72', note: 'Heritage Crafts Red List 2025' },
  { label: 'Endangered heritage crafts', value: '93', note: 'Heritage Crafts Red List 2025' },
  { label: 'Currently viable heritage crafts', value: '115', note: 'Heritage Crafts Red List 2025' },
  { label: 'Total crafts assessed', value: '285', note: 'Heritage Crafts Red List 2025' },
  { label: 'At-risk crafts (critically + endangered)', value: '165', note: 'Heritage Crafts Red List 2025' },
]

// careerId on each example links straight to the real PathScrawler career
// it became - Welsh/Irish vernacular thatching doesn't have its own entry
// (Heritage Crafts tracks it as a newly-endangered TECHNIQUE within
// thatching, not a separate profession with its own UK headcount), so it
// points at Master Thatcher (id 125), whose requirements now name both
// styles explicitly, rather than a fabricated standalone career.
export const newEndangeredCrafts2025 = {
  label: 'New critically endangered crafts added in 2025',
  value: '12',
  examples: [
    { label: 'Rattan furniture', careerId: 132 },
    { label: 'Cut crystal', careerId: 133 },
    { label: 'Ship figurehead carving', careerId: 134 },
    { label: 'Welsh/Irish vernacular thatching', careerId: 125 },
  ],
  source: 'Heritage Crafts Red List 2025',
}

// --- Demand & skills shortage stats ------------------------------------------
export const demandSkillsStats: StatEntry[] = [
  { label: 'Occupations in critical demand', value: '62', note: 'out of ~368 analysed - Skills England Occupations in Demand 2025' },
  { label: 'Workers in critical-demand occupations', value: '5.1 million', note: '15.4% of UK employment - Skills England 2025' },
  { label: 'Workers in elevated-demand occupations', value: '10.9 million', note: '32.9% of UK employment - Skills England 2025' },
  { label: 'Combined high-demand workers', value: '~16 million', note: '~48% of the workforce - Skills England 2025' },
]

// careerId is a manual match against demoCareers.js, not a fuzzy title
// match (Skills England's own occupation titles are plurals/groupings that
// don't line up 1:1 with demoCareers titles) - "Specialist medical
// practitioners" -> id 100 "Specialist Medical Practitioner (Consultant
// Doctor)", "Care workers & home carers" -> id 73 "Care Assistant".
export const standoutOccupations = [
  { label: 'Largest critical-demand occupation', title: 'Specialist medical practitioners', value: '~137,000 workers', careerId: 100 },
  { label: 'Largest elevated-demand occupation', title: 'Care workers & home carers', value: '~910,000 workers', careerId: 73 },
]

export const statsCompiledDate = 'August 2026'
export const statsSources = [
  'ONS Labour Market (Aug 2026)',
  'Skills England Occupations in Demand 2025',
  'Heritage Crafts Red List 2025',
]
