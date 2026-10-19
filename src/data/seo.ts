// Search and share metadata for every route: the tab title, the meta
// description, whether search engines should index it, and whether it goes
// in sitemap.xml. RouteMeta.tsx applies this on each navigation, and
// src/data/sitemap.ts builds the sitemap from it at build time.
//
// Adding a route in App.tsx? Add a row here too, or the page gets the
// "Page not found" title and a noindex. Rows are matched in order, so a
// specific path must come before a :param path that would also match it.

// Production origin. Canonical URLs, the sitemap and robots.txt all point
// here, so moving to a custom domain means changing this, the og:image URL
// in index.html, and the Sitemap line in public/robots.txt.
export const SITE_URL = 'https://pathscrawler.vercel.app'

export const SITE_NAME = 'PathScrawler'

// index.html carries copies of these two for link-preview scrapers, which
// never run JavaScript - keep them in step.
export const DEFAULT_TITLE = 'PathScrawler | Explore careers and the routes into them'
export const DEFAULT_DESCRIPTION =
  'Find careers that fit you and the qualifications, apprenticeships and courses that get you there. Careers guidance for UK students and career changers.'

export interface RouteSeo {
  /** Same pattern syntax as the matching <Route path> in App.tsx. */
  path: string
  /** Shown as "<title> | PathScrawler". Omitted = DEFAULT_TITLE. */
  title?: string
  /** Omitted = DEFAULT_DESCRIPTION. */
  description?: string
  /** List in sitemap.xml. Static paths only. */
  sitemap?: boolean
  /** Keep out of search results: per-user, private, or mid-flow pages. */
  noindex?: boolean
  /** The page sets its own title/description with usePageMeta (it needs
   *  data only the page has, e.g. the career's name). */
  ownMeta?: boolean
}

export const NOT_FOUND_SEO: RouteSeo = { path: '*', title: 'Page not found', noindex: true }

export const ROUTE_SEO: RouteSeo[] = [
  { path: '/', sitemap: true },
  {
    path: '/assessment',
    title: 'Find your path in 60 seconds',
    description: 'Answer a few quick questions and get a shortlist of careers that suit you.',
    sitemap: true,
  },
  {
    path: '/role',
    title: 'What describes you best?',
    description:
      'Student, career changer, mature learner or already set on a goal: pick where you are now and get pathways that fit.',
    sitemap: true,
  },

  // Career changer
  {
    path: '/career-changer/current-role',
    title: 'Change career: where can your skills take you?',
    description: 'Tell us what you do now and see alternative careers your existing skills carry over to.',
    sitemap: true,
  },
  { path: '/career-changer/preferences', title: 'What matters in your next career?', noindex: true },
  { path: '/career-changer/results', title: 'Alternate careers for you', noindex: true },

  // Qualifications
  {
    path: '/subjects',
    title: 'Choose your qualification level',
    description:
      'GCSEs, A-Levels, BTECs, T-Levels, vocational courses, degrees and professional qualifications, and the careers each one leads to.',
    sitemap: true,
  },
  {
    path: '/subjects/refugee-asylum-seeker',
    title: 'New to the UK? Career pathways for refugees and asylum seekers',
    description: 'Improve your English, get your qualifications recognised and find your next career step in the UK.',
    sitemap: true,
  },
  {
    path: '/subjects/refugee-asylum-seeker/levels',
    title: 'Choose your next qualification step',
    description: 'Start with the pathway that fits your language level, experience and goal.',
    sitemap: true,
  },
  { path: '/subjects/refugee-asylum-seeker/:subpage', title: 'Pathways for refugees and asylum seekers' },
  {
    path: '/subjects/disabled-learner',
    title: 'Accessible pathways for disabled learners',
    description: 'Explore careers and qualifications with the right support for you.',
    sitemap: true,
  },
  { path: '/subjects/disabled-learner/support', title: 'What support would help you at work?' },
  {
    path: '/subjects/tlevel',
    title: 'T-Level subjects',
    description:
      'Technical qualifications combining classroom learning with industry placements. Equivalent to 3 A-Levels.',
    sitemap: true,
  },
  {
    path: '/subjects/gcse',
    title: 'GCSE subjects',
    description: 'Build strong foundations with core school qualifications, and see where each subject can take you.',
    sitemap: true,
  },
  {
    path: '/subjects/a-level',
    title: 'A-Level and BTEC subjects',
    description: 'Advanced academic A-Levels or practical BTECs for university and career progression.',
    sitemap: true,
  },
  {
    path: '/subjects/vocational',
    title: 'Vocational courses',
    description: 'Gain practical skills for apprenticeships and work-based learning.',
    sitemap: true,
  },
  {
    path: '/subjects/university',
    title: 'Undergraduate degrees',
    description: 'Prepare for higher education and degree-level study, and see the careers each degree leads to.',
    sitemap: true,
  },
  {
    path: '/subjects/masters',
    title: "Master's degrees",
    description: 'Postgraduate study for a career pivot or specialisation: MSc, MA, MBA, MEng and more.',
    sitemap: true,
  },
  {
    path: '/subjects/phd',
    title: 'PhD and doctoral research',
    description: 'Research degrees for academia and specialist research careers.',
    sitemap: true,
  },
  {
    path: '/subjects/professional',
    title: 'Professional qualifications',
    description:
      'Industry certifications, conversion courses and professional diplomas: GDL, PGCE, CIM, ACCA, CFA and more.',
    sitemap: true,
  },
  { path: '/subjects/:level', title: 'Choose your subjects' },
  {
    path: '/refugee/esol',
    title: 'ESOL and English language resources',
    description: 'English courses for speakers of other languages, often the first step to work and study in the UK.',
    sitemap: true,
  },
  {
    path: '/refugee/recognition',
    title: 'Get your qualifications recognised in the UK',
    description: 'Find out how to get qualifications from abroad recognised in the UK.',
    sitemap: true,
  },

  // Careers
  { path: '/results', title: 'Your career matches', noindex: true },
  { path: '/career/:id', ownMeta: true },
  { path: '/career-pathway/:careerId', title: 'Career pathway' },
  { path: '/search', title: 'Search careers', noindex: true },
  {
    path: '/backtrack/categories',
    title: 'Work backwards from your dream career',
    description: "Pick the field your dream career belongs to and we'll show you the routes into it.",
    sitemap: true,
  },
  { path: '/backtrack/careers/:category', title: 'Choose a career' },
  { path: '/backtrack/pathway/:careerId', title: 'Routes into your career' },
  { path: '/backtrack/options/:careerId', title: 'Ways to get there' },
  { path: '/backtrack/subjects/:careerId/:pathway', title: 'Subjects for your route' },

  // Accounts and saved work - per-user, never indexed
  { path: '/login', title: 'Sign in', noindex: true },
  { path: '/signup', title: 'Create an account', noindex: true },
  { path: '/forgot-password', title: 'Forgot your password?', noindex: true },
  { path: '/reset-password', title: 'Reset your password', noindex: true },
  { path: '/pathway/:id', title: 'Shared pathway', noindex: true },
  { path: '/my-pathways', title: 'My saved pathways', noindex: true },
  { path: '/my-pathways/:pathwayId', title: 'My pathway', noindex: true },
  { path: '/compare', title: 'Compare careers', noindex: true },
  { path: '/binder', title: 'My career binder', noindex: true },
  { path: '/binder/compare', title: 'Compare careers', noindex: true },
  { path: '/profile', title: 'Your profile', noindex: true },

  // Job Market
  {
    path: '/job-market',
    title: 'Job Market',
    description:
      "Explore careers your way: this week's spotlight, UK statistics, the easiest jobs to get into and the highest paying.",
    sitemap: true,
  },
  {
    path: '/job-market/spotlight',
    title: "This week's career spotlight",
    description: 'A new career to discover every week.',
    sitemap: true,
  },
  {
    path: '/job-market/statistics',
    title: 'UK job market statistics',
    description:
      'The numbers behind the UK job market: AI exposure, skills shortages, heritage crafts and jobs that have vanished.',
    sitemap: true,
  },
  {
    path: '/job-market/statistics/uk-numbers',
    title: 'UK labour market numbers',
    description: 'Headline figures on the UK labour market, including jobs and crafts that have all but disappeared.',
    sitemap: true,
  },
  {
    path: '/job-market/statistics/uk-numbers/heritage-crafts',
    title: 'Endangered and heritage crafts',
    description: 'Real crafts dying out in the UK, and the ones you can still train for.',
    sitemap: true,
  },
  {
    path: '/job-market/statistics/uk-numbers/high-demand-careers',
    title: 'Skills shortages and demand',
    description: 'Careers in genuine UK skills-shortage fields.',
    sitemap: true,
  },
  {
    path: '/job-market/statistics/uk-numbers/vanished-jobs',
    title: 'Vanished jobs',
    description: 'Jobs that used to exist in the UK and simply do not anymore.',
    sitemap: true,
  },
  {
    path: '/job-market/statistics/ai-endangered-jobs',
    title: 'Jobs endangered by AI',
    description: 'Which real UK roles are most exposed to AI and automation right now.',
    sitemap: true,
  },
  {
    path: '/job-market/easiest',
    title: 'Easiest jobs to get into',
    description: 'Careers you can start without years of study.',
    sitemap: true,
  },
  {
    path: '/job-market/highest-paying',
    title: 'Highest paying jobs',
    description: 'Careers where the investment pays off.',
    sitemap: true,
  },
  {
    path: '/job-market/roll',
    title: 'Roll a Job',
    description: 'Roll for a random career card, collect them all and see where you rank on the leaderboard.',
    sitemap: true,
  },
  {
    path: '/job-market/skills',
    title: 'Skills you should learn',
    description: 'High-value skills and free resources to learn them.',
    sitemap: true,
  },
  {
    path: '/leaderboard',
    title: 'Roll a Job leaderboard',
    description: "See who's top of the Roll a Job leaderboard.",
    sitemap: true,
  },

  // Student Hub - the topic pages are listed one by one (rather than just
  // /student-hub/:topic) so each gets its own title and a sitemap entry.
  // Mirrors HUB_SECTIONS in studentHubSections.ts.
  {
    path: '/student-hub',
    title: 'Student Hub',
    description: 'Loans, UCAS, apprenticeships and skills. Short answers, so you can decide for yourself.',
    sitemap: true,
  },
  {
    path: '/student-hub/faq',
    title: 'Student Hub FAQ',
    description: 'Every question from across the hub, grouped by topic.',
    sitemap: true,
  },
  {
    path: '/student-hub/checklists',
    title: 'Student Finance and UCAS checklists',
    description: 'Student Finance and UCAS checklists to tick off as you go.',
    sitemap: true,
  },
  {
    path: '/student-hub/debt-calculator',
    title: 'Student debt calculator',
    description: 'See your student loan balance year by year and what you would repay.',
    sitemap: true,
  },
  {
    path: '/student-hub/student-finance',
    title: 'Applying for Student Finance',
    description: 'Applying for Student Finance England, step by step.',
    sitemap: true,
  },
  {
    path: '/student-hub/ucas',
    title: 'UCAS and applying',
    description: 'UCAS deadlines, your personal statement and Clearing.',
    sitemap: true,
  },
  {
    path: '/student-hub/repaying',
    title: 'Repaying your student loan',
    description: 'Plan 5, interest, and when your student loan gets written off.',
    sitemap: true,
  },
  {
    path: '/student-hub/maintenance',
    title: 'Maintenance Loan',
    description: 'What you get to live on at university, and why it varies.',
    sitemap: true,
  },
  {
    path: '/student-hub/apprenticeship-or-uni',
    title: 'Apprenticeship vs university',
    description: 'Earn while you learn, and the trade-offs against a degree.',
    sitemap: true,
  },
  // Old locations that App.tsx redirects - matched so they don't flash
  // "Page not found" for the frame before the redirect lands.
  { path: '/job-market/student-hub/*', noindex: true },
  { path: '/student-hub/skills', noindex: true },
  { path: '/student-hub/:topic', title: 'Student Hub' },

  // Everything else
  {
    path: '/testimonials',
    title: 'What people say about the jobs',
    description: 'What people say about working in the careers featured on PathScrawler.',
    sitemap: true,
  },
  {
    path: '/privacy',
    title: 'Privacy policy',
    description: 'What PathScrawler stores about you, and why.',
    sitemap: true,
  },
  {
    path: '/terms',
    title: 'Terms of use',
    description: 'The terms for using PathScrawler. Careers and student finance figures are guidance, not advice.',
    sitemap: true,
  },
  // QA-only pages that render components in isolation
  { path: '/preview/*', noindex: true },
]
