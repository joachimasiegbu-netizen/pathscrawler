// Real UK jobs that have died out or nearly died out, compiled August 2026 -
// see PathScrawler_Extinct_UK_Jobs.txt for the original source list this
// file mirrors. Deliberately kept OUT of demoCareers.js: everything in that
// file is a job someone can actually train for and pursue today (it has a
// salary, requirements, a progression ladder) - these don't, some have
// literally zero UK practitioners left, so giving them a "career" schema
// would misleadingly imply they're still pursuable. This is history/
// trivia content, shown on its own page (JobMarketVanishedJobsPage), not
// wired into Roll a Job, Weekly Spotlight, or anything career-pursuit-
// shaped.

export interface JobSource {
  label: string
  url: string
}

export interface VanishedJob {
  title: string
  status: string
  detail: string
  sources: JobSource[]
}

// --- Fully or almost extinct jobs -------------------------------------------
export const fullyExtinctJobs: VanishedJob[] = [
  {
    title: 'Lighthouse Keeper (full-time resident)',
    status: 'Effectively extinct as a full-time job',
    detail:
      'All UK lighthouses were automated by 1998 (last English keeper: North Foreland, Nov 1998; last Scottish: Fair Isle South, March 1998). Only a handful of part-time "retained" attendants remain.',
    sources: [
      { label: 'Association of Lighthouse Keepers', url: 'https://alk.org.uk/keepers/' },
      { label: 'BBC News', url: 'https://www.bbc.co.uk/news/articles/cpq75rg3zvyo' },
      {
        label: 'The Scotsman',
        url: 'https://www.scotsman.com/news/transport/meet-scotlands-youngest-lighthouse-keeper-jeri-cormack-they-have-an-inherent-mystery-8802347',
      },
    ],
  },
  {
    title: 'Knocker-up (human alarm clock)',
    status: 'Extinct',
    detail: 'Alarm clocks became cheap and reliable. Last practitioners worked into the 1950s-60s in industrial towns.',
    sources: [
      { label: 'Findmypast', url: 'https://www.findmypast.co.uk/blog/history/quirky-extinct-jobs' },
      { label: 'Business Insider', url: 'https://www.businessinsider.com/jobs-that-no-longer-exist' },
      { label: 'BBC Bitesize', url: 'https://www.bbc.co.uk/bitesize/articles/zyvf6g8' },
    ],
  },
  {
    title: 'Lamplighter (gas street lamps)',
    status: 'Extinct as a regular job',
    detail: 'Electric street lighting replaced gas. By 1986 only one full-time lamplighter was left in London (Temple).',
    sources: [
      { label: 'Findmypast', url: 'https://www.findmypast.co.uk/blog/history/quirky-extinct-jobs' },
      {
        label: 'British Newspaper Archive',
        url: 'https://www.britishnewspaperarchive.com/blog/seven-unusual-or-lost-occupations-from-history',
      },
    ],
  },
  {
    title: 'Switchboard Operator',
    status: 'Extinct',
    detail: 'Automatic telephone exchanges replaced manual ones - mostly gone by the mid-1970s.',
    sources: [
      {
        label: 'Wigan Today',
        url: 'https://www.wigantoday.net/retro/16-once-popular-jobs-lost-to-technology-5303911',
      },
    ],
  },
  {
    title: 'Lift / Elevator Operator',
    status: 'Nearly extinct',
    detail: 'Self-service lifts became standard from the 1970s. A few operators remain, only in luxury hotels or historic buildings.',
    sources: [
      {
        label: 'Wigan Today',
        url: 'https://www.wigantoday.net/retro/16-once-popular-jobs-lost-to-technology-5303911',
      },
      {
        label: 'Anglotopia',
        url: 'https://anglotopia.net/british-history/brit-history-british-occupations-1900s-lost-history',
      },
    ],
  },
  {
    title: 'Resurrectionist (body snatcher)',
    status: 'Extinct',
    detail: 'The Anatomy Act 1832 legalised a supply of unclaimed bodies for medical schools, ending the trade.',
    sources: [
      { label: 'Timedive', url: 'https://timedive.co.uk/10-forgotten-historical-professions-that-no-longer-exist/' },
      { label: 'Business Insider', url: 'https://www.businessinsider.com/jobs-that-no-longer-exist' },
    ],
  },
  {
    title: 'Gong Farmer / Night-Soil Man',
    status: 'Extinct',
    detail: 'Modern sewage systems replaced the need to empty cesspits by hand.',
    sources: [{ label: 'Timedive', url: 'https://timedive.co.uk/10-forgotten-historical-professions-that-no-longer-exist/' }],
  },
  {
    title: 'Petrol Pump Attendant (full-service)',
    status: 'Almost gone',
    detail: 'Self-service pumps became the norm. Only a tiny number of full-service stations remain in the UK.',
    sources: [
      {
        label: 'Birmingham Mail',
        url: 'https://www.birminghammail.co.uk/news/nostalgia/gallery/jobs-used-see-ladybird-books-30725585',
      },
    ],
  },
]

// --- Jobs reduced to ceremonial or tiny numbers ------------------------------
export const ceremonialOrTinyJobs: VanishedJob[] = [
  {
    title: 'Town Crier',
    status: 'Mostly ceremonial / tourist role',
    detail: 'Survives today largely as a ceremonial and tourism role rather than a working public-announcement job.',
    sources: [{ label: 'Findmypast', url: 'https://www.findmypast.co.uk/blog/history/quirky-extinct-jobs' }],
  },
  {
    title: 'Traditional Milkman (doorstep delivery)',
    status: 'Tiny remnant',
    detail: 'A small remnant survives through eco-friendly and specialist milk-delivery rounds.',
    sources: [
      { label: 'Business Insider', url: 'https://www.businessinsider.com/jobs-that-no-longer-exist' },
      {
        label: 'Birmingham Mail',
        url: 'https://www.birminghammail.co.uk/news/nostalgia/gallery/jobs-used-see-ladybird-books-30725585',
      },
    ],
  },
]

// --- Fully extinct UK production jobs (zero active practitioners) -----------
// From the Heritage Crafts Red List's own "extinct" category - once proper
// paid occupations, now with nobody left in the UK doing them at all.
// Deliberately NOT linked to any demoCareers entry (unlike the AI-endangered
// jobs elsewhere on the site) - these have zero current UK practitioners,
// so there's nothing to "pursue"; a career-page link would misleadingly
// imply otherwise. Cricket-ball making and lacrosse-stick making (also on
// Heritage Crafts' extinct list) were dropped rather than written up with
// no real per-craft detail behind them.
export const extinctProductionCrafts: VanishedJob[] = [
  {
    title: 'Goldbeating',
    status: 'Extinct',
    detail:
      "W Habberley Meadows Ltd of Birmingham, the last UK gold beaters, stopped hammering gold into leaf by hand years ago due to cheap foreign competition - they still supply gold leaf today, just no longer beat it in the UK.",
    sources: [
      { label: 'Heritage Crafts', url: 'https://heritagecrafts.org.uk/craft/gold-beating/' },
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/HCA_Red_List_of_Endangered_Crafts' },
    ],
  },
  {
    title: 'Paper Mould & Deckle Making',
    status: 'Extinct',
    detail:
      'The last UK maker, Ron MacDonald, died in 2017, and the craft was formally added to the extinct category in the 2019 Red List edition.',
    sources: [
      {
        label: 'Heritage Crafts',
        url: 'https://heritagecrafts.org.uk/our-stories/announcements/craft-skills-under-threat-with-37-additions-to-the-red-list-of-endangered-crafts/',
      },
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/HCA_Red_List_of_Endangered_Crafts' },
    ],
  },
  {
    title: 'Mouth-Blown Flat Glass Making',
    status: 'Extinct since 2022',
    detail:
      'English Antique Glass in Birmingham, the last UK producer, stopped in 2022 under pressure to reduce workshop space - Heritage Crafts is now funding glassblower Elliot Walker in an attempt to revive the craft.',
    sources: [
      { label: 'Heritage Crafts', url: 'https://heritagecrafts.org.uk/craft/mouth-blown-sheet-glass-making/' },
      { label: 'ITV News', url: 'https://www.itv.com/news/2023-05-12/the-17-crafts-at-risk-of-dying-out-by-the-next-generation' },
    ],
  },
]

export const extinctCraftsSource: JobSource = {
  label: 'Wikipedia - HCA Red List of Endangered Crafts',
  url: 'https://en.wikipedia.org/wiki/HCA_Red_List_of_Endangered_Crafts',
}

export const vanishedJobsCompiledDate = 'August 2026'
