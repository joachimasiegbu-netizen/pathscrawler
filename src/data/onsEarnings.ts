// Real data: ONS "Employee earnings in the UK: 2025"
// Source: Office for National Statistics, Annual Survey of Hours and
// Earnings (ASHE), statistical bulletin released 23 October 2025. These
// figures are exact quotes from that bulletin - kept separate from
// jobMarketData.js, which holds general/illustrative trend patterns rather
// than official statistics.

export interface EarningsHeadlineStat {
  label: string
  value: string
  deltaLabel: string
}

export const earningsHeadlineStats: EarningsHeadlineStat[] = [
  {
    label: 'Median weekly earnings (full-time)',
    value: '£766.60',
    deltaLabel: '+5.3% nominal / +1.1% real vs April 2024',
  },
  {
    label: 'Median annual earnings (full-time)',
    value: '£39,039',
    deltaLabel: '+4.3% vs April 2024',
  },
]

// Figure 2: annual % change in nominal vs real (CPIH-adjusted) median gross
// weekly earnings, by working pattern, UK, April 2025.
export const earningsGrowthData = [
  { category: 'All jobs', nominal: 4.7, real: 0.6 },
  { category: 'Full-time', nominal: 5.3, real: 1.1 },
  { category: 'Part-time', nominal: 6.4, real: 2.1 },
]

export const earningsSource = {
  label: 'ONS, Employee earnings in the UK: 2025',
  url: 'https://www.ons.gov.uk/employmentandlabourmarket',
  released: '23 October 2025',
}
