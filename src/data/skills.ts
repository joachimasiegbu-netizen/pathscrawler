// "Skills You Should Learn" - high-value, in-demand, transferable skills a
// user can start on for free or cheap, each tied to careers already in the
// app. Time estimates are honest ballpark "to a useful working level", not
// "to mastery". Resources are real, free-or-cheap starting points.

export type SkillCategory = 'Hard' | 'Soft' | 'Digital' | 'Trade'
export type SkillCost = 'free' | 'under50' | 'funded'
/** Career-goal tags for the goal filter. */
export type SkillGoal = 'tech' | 'remote' | 'business' | 'creative' | 'trades' | 'care' | 'any'

export interface SkillResource {
  label: string
  url: string
}

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  why: string
  /** Ballpark hours to a useful working level - drives the time filter. */
  timeHours: number
  timeLabel: string
  cost: SkillCost
  costLabel: string
  resources: SkillResource[]
  /** demoCareers ids this skill genuinely helps with. */
  careerIds: number[]
  /** Salary / employability impact, one line. */
  impact: string
  goals: SkillGoal[]
  /** Under ~10 hours and an immediate CV line, shown in "Quick Wins". */
  quickWin?: boolean
}

export const SKILLS: Skill[] = [
  // -------- Hard --------
  {
    id: 'excel',
    name: 'Spreadsheets (Excel / Google Sheets)',
    category: 'Hard',
    why: 'Almost every office job assumes it. Formulas, pivot tables and clean data handling put you ahead of most applicants immediately.',
    timeHours: 15,
    timeLabel: 'About a weekend, plus practice',
    cost: 'free',
    costLabel: 'Free',
    resources: [
      { label: 'Excel Is Fun (YouTube)', url: 'https://www.youtube.com/user/ExcelIsFun' },
      { label: 'GCFGlobal Excel course', url: 'https://edu.gcfglobal.org/en/excel/' },
    ],
    careerIds: [12, 74, 11, 14, 94, 2],
    impact: 'A baseline for admin and finance roles, and "advanced Excel" is a common pay-band gate.',
    goals: ['business', 'remote'],
    quickWin: true,
  },
  {
    id: 'data-analysis',
    name: 'Data analysis basics',
    category: 'Hard',
    why: 'Turning a messy spreadsheet into a clear answer is a rare, well-paid skill. Start with descriptive stats and charts, then a tool like Excel or Python.',
    timeHours: 60,
    timeLabel: 'About 2 months part-time',
    cost: 'free',
    costLabel: 'Free',
    resources: [
      { label: 'Khan Academy: Statistics', url: 'https://www.khanacademy.org/math/statistics-probability' },
      { label: 'freeCodeCamp: Data Analysis with Python', url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/' },
    ],
    careerIds: [2, 11, 62, 1],
    impact: 'Junior data analyst roles start around £25k to £30k and rise fast.',
    goals: ['tech', 'business', 'remote'],
  },
  {
    id: 'sql',
    name: 'SQL',
    category: 'Hard',
    why: 'The language for asking databases questions. Small, learnable, and on a huge share of data, analyst and developer job ads.',
    timeHours: 25,
    timeLabel: 'About 2 weeks part-time',
    cost: 'free',
    costLabel: 'Free',
    resources: [
      { label: 'SQLBolt (interactive)', url: 'https://sqlbolt.com' },
      { label: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial/' },
    ],
    careerIds: [2, 62, 1, 11],
    impact: 'Adds a concrete, testable line to a CV, and it is a common analyst interview screen.',
    goals: ['tech', 'business', 'remote'],
  },
  {
    id: 'first-aid',
    name: 'Emergency first aid',
    category: 'Hard',
    why: 'A one-day certificate that makes you more employable in care, education, sport, hospitality and site work, and is genuinely useful.',
    timeHours: 8,
    timeLabel: '1 day course',
    cost: 'under50',
    costLabel: 'Often £30 to £90, sometimes employer-paid',
    resources: [
      { label: 'St John Ambulance courses', url: 'https://www.sja.org.uk/courses/' },
      { label: 'British Red Cross first aid', url: 'https://www.redcross.org.uk/first-aid' },
    ],
    careerIds: [48, 82, 94, 23],
    impact: 'A required or preferred ticket for many care, school and site roles.',
    goals: ['care', 'trades'],
    quickWin: true,
  },
  {
    id: 'driving',
    name: 'A full driving licence',
    category: 'Hard',
    why: 'Quietly one of the biggest employability multipliers outside cities. Trades, care visits, delivery, agriculture and sales all assume it.',
    timeHours: 45,
    timeLabel: '2 to 6 months of lessons',
    cost: 'funded',
    costLabel: 'Usually £1,000 or more, though some schemes fund it',
    resources: [
      { label: 'Learn to drive a car (gov.uk)', url: 'https://www.gov.uk/learn-to-drive-a-car' },
      { label: 'Theory test practice (gov.uk)', url: 'https://www.gov.uk/take-practice-theory-test' },
    ],
    careerIds: [143, 142, 144, 23, 82, 17],
    impact: 'Removes a hard filter from a large share of non-office job ads.',
    goals: ['trades', 'care'],
  },
  {
    id: 'coding-basics',
    name: 'Programming fundamentals',
    category: 'Hard',
    why: 'Variables, loops, functions and reading errors. Enough to automate boring tasks and to know whether a tech career is for you before committing.',
    timeHours: 80,
    timeLabel: 'About 3 months part-time',
    cost: 'free',
    costLabel: 'Free',
    resources: [
      { label: 'freeCodeCamp', url: 'https://www.freecodecamp.org' },
      { label: 'The Odin Project', url: 'https://www.theodinproject.com' },
      { label: 'Skills Bootcamps (gov.uk)', url: 'https://www.gov.uk/guidance/find-a-skills-bootcamp' },
    ],
    careerIds: [1, 9, 5, 3],
    impact: 'Entry to junior developer routes, roughly £24k to £32k to start, and to Skills Bootcamp funding.',
    goals: ['tech', 'remote'],
  },

  // -------- Digital --------
  {
    id: 'ai-prompting',
    name: 'AI prompting (ChatGPT, Claude, Copilot)',
    category: 'Digital',
    why: 'Getting useful, accurate output from AI tools, and knowing when not to trust them, is now an expected office skill. Fast to pick up and immediately visible on the job.',
    timeHours: 6,
    timeLabel: 'A few evenings',
    cost: 'free',
    costLabel: 'Free tier is enough',
    resources: [
      { label: 'Anthropic prompt engineering guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
      { label: 'OpenAI prompt engineering guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
    ],
    careerIds: [44, 15, 72, 75, 11],
    impact: 'A credible "AI literate" line, and it raises output in almost any desk role.',
    goals: ['remote', 'business', 'creative', 'tech'],
    quickWin: true,
  },
  {
    id: 'canva',
    name: 'Canva / basic design',
    category: 'Digital',
    why: 'Make clean social posts, slide decks, flyers and simple brand assets without a designer. Small businesses and charities need this constantly.',
    timeHours: 8,
    timeLabel: '1 weekend',
    cost: 'free',
    costLabel: 'Free tier',
    resources: [
      { label: 'Canva Design School', url: 'https://www.canva.com/designschool/' },
      { label: 'Flux Academy (YouTube)', url: 'https://www.youtube.com/@FluxAcademy' },
    ],
    careerIds: [44, 15, 39, 72],
    impact: 'Turns "can you make this look decent?" into a yes, common in marketing and admin.',
    goals: ['creative', 'remote', 'business'],
    quickWin: true,
  },
  {
    id: 'social-media',
    name: 'Social media management',
    category: 'Digital',
    why: 'Content planning, scheduling, basic analytics and community replies for a brand. Very hireable at junior level and remote-friendly.',
    timeHours: 30,
    timeLabel: 'About 1 month part-time',
    cost: 'free',
    costLabel: 'Free',
    resources: [
      { label: 'Meta Blueprint (free courses)', url: 'https://www.facebook.com/business/learn' },
      { label: 'HubSpot Academy: Social Media', url: 'https://academy.hubspot.com/courses/social-media' },
    ],
    careerIds: [44, 15],
    impact: 'Junior social and marketing roles pay roughly £20k to £26k, often remote or hybrid.',
    goals: ['creative', 'remote', 'business'],
  },
  {
    id: 'crm',
    name: 'CRM tools (HubSpot / Salesforce basics)',
    category: 'Digital',
    why: 'Sales, support and admin teams run on a CRM. Knowing how to log, segment and report on contacts makes you useful from week one.',
    timeHours: 12,
    timeLabel: 'About 1 weekend',
    cost: 'free',
    costLabel: 'Free training and free tiers',
    resources: [
      { label: 'HubSpot Academy', url: 'https://academy.hubspot.com' },
      { label: 'Salesforce Trailhead', url: 'https://trailhead.salesforce.com' },
    ],
    careerIds: [17, 75, 72, 15],
    impact: 'Named CRM experience is a common filter for sales and support job ads.',
    goals: ['business', 'remote'],
    quickWin: true,
  },

  // -------- Soft --------
  {
    id: 'communication',
    name: 'Clear written communication',
    category: 'Soft',
    why: 'Short, structured emails and messages that get a decision. The single most transferable skill, and the one most people never deliberately practise.',
    timeHours: 10,
    timeLabel: 'Ongoing, quick to start',
    cost: 'free',
    costLabel: 'Free',
    resources: [
      { label: 'Grammarly Handbook', url: 'https://www.grammarly.com/blog/' },
      { label: 'Google Technical Writing (free)', url: 'https://developers.google.com/tech-writing' },
    ],
    careerIds: [11, 14, 75, 15, 72],
    impact: 'Compounds in every role. It is the difference between "reliable" and "gets promoted".',
    goals: ['any'],
    quickWin: true,
  },
  {
    id: 'negotiation',
    name: 'Negotiation',
    category: 'Soft',
    why: 'Asking for a salary, a deadline, or a better deal without damaging the relationship. One good salary negotiation can be worth thousands a year, compounding.',
    timeHours: 12,
    timeLabel: 'A book and some practice',
    cost: 'under50',
    costLabel: 'A £10 book',
    resources: [
      { label: '"Never Split the Difference" (summary and book)', url: 'https://www.blackswanltd.com/never-split-the-difference' },
      { label: 'Harvard PON free articles', url: 'https://www.pon.harvard.edu/free-reports/' },
    ],
    careerIds: [17, 14, 15],
    impact: 'Directly moves your own pay, and it is core to sales, management and freelancing.',
    goals: ['business'],
  },
  {
    id: 'time-management',
    name: 'Time management and prioritisation',
    category: 'Soft',
    why: 'Planning a week, protecting focus time, and saying no. Employers read it as reliability, and it makes studying and side projects actually happen.',
    timeHours: 8,
    timeLabel: 'A weekend to set up habits',
    cost: 'free',
    costLabel: 'Free',
    resources: [
      { label: 'Todoist Productivity Methods', url: 'https://todoist.com/productivity-methods' },
      { label: 'Cal Newport blog', url: 'https://calnewport.com/blog/' },
    ],
    careerIds: [14, 11, 72],
    impact: 'Named on most job specs. The visible signal of it is hitting deadlines.',
    goals: ['any'],
    quickWin: true,
  },
  {
    id: 'resilience',
    name: 'Resilience and feedback',
    category: 'Soft',
    why: 'Taking criticism without spiralling, recovering from a knock-back, and keeping standards under pressure. Interviewers probe for it, and every hard job needs it.',
    timeHours: 10,
    timeLabel: 'Ongoing practice',
    cost: 'free',
    costLabel: 'Free',
    resources: [
      { label: 'NHS mental wellbeing tips', url: 'https://www.nhs.uk/mental-health/self-help/tips-and-support/' },
      { label: 'Mind: Managing stress', url: 'https://www.mind.org.uk/information-support/tips-for-everyday-living/stress/' },
    ],
    careerIds: [22, 23, 48],
    impact: 'The trait most cited for surviving the first year in high-pressure roles.',
    goals: ['care', 'any'],
  },

  // -------- Trade --------
  {
    id: 'electrical-safety',
    name: 'Electrical safety basics',
    category: 'Trade',
    why: 'Understanding a consumer unit, isolation, and safe testing before you commit to an electrical apprenticeship, or just to work safely on site in another trade.',
    timeHours: 20,
    timeLabel: 'About a week of study plus a short course',
    cost: 'under50',
    costLabel: 'Free videos, with taster courses from about £40',
    resources: [
      { label: 'eFIXX (YouTube)', url: 'https://www.youtube.com/@eFIXX' },
      { label: 'Find an apprenticeship (gov.uk)', url: 'https://www.gov.uk/apply-apprenticeship' },
    ],
    careerIds: [142, 89],
    impact: 'Takes the risk out of committing to a 3 or 4 year electrical apprenticeship.',
    goals: ['trades'],
  },
  {
    id: 'plumbing-basics',
    name: 'Plumbing basics',
    category: 'Trade',
    why: 'Isolating water, fixing a tap, understanding a heating system. Enough to help on jobs, pass a taster, or just stop paying someone £120 for a washer.',
    timeHours: 18,
    timeLabel: 'About a week part-time',
    cost: 'free',
    costLabel: 'Free videos, and college tasters vary',
    resources: [
      { label: 'Plumberparts (YouTube)', url: 'https://www.youtube.com/@Plumberparts' },
      { label: 'Find a Skills Bootcamp (gov.uk)', url: 'https://www.gov.uk/guidance/find-a-skills-bootcamp' },
    ],
    careerIds: [143, 89],
    impact: 'A credible reason to be taken on as a plumber’s labourer or apprentice.',
    goals: ['trades'],
  },
  {
    id: 'carpentry-intro',
    name: 'Carpentry and joinery intro',
    category: 'Trade',
    why: 'Measuring, marking, sawing square, and using basic power tools safely. The foundation for site carpentry, bench joinery and general construction.',
    timeHours: 25,
    timeLabel: 'About 2 weeks part-time',
    cost: 'under50',
    costLabel: 'Free videos, with weekend courses from about £50',
    resources: [
      { label: 'Rag ’n’ Bone Brown (YouTube)', url: 'https://www.youtube.com/@RagnBoneBrown' },
      { label: 'Apprenticeships (gov.uk)', url: 'https://www.gov.uk/apprenticeships-guide' },
    ],
    careerIds: [144, 89],
    impact: 'Gets you onto a site or a joinery apprenticeship with something to show.',
    goals: ['trades'],
  },
  {
    id: 'tickets',
    name: 'Site tickets (CSCS card, manual handling)',
    category: 'Trade',
    why: 'A CSCS card plus a manual-handling certificate is the minimum to legally set foot on most UK construction sites. Fast to get, and it unlocks paid labouring work now.',
    timeHours: 10,
    timeLabel: 'A day or two',
    cost: 'under50',
    costLabel: 'Test plus card, roughly £60 total',
    resources: [
      { label: 'CSCS: get a card', url: 'https://www.cscs.uk.com/applying-for-cards/' },
      { label: 'CITB health, safety and environment test', url: 'https://www.citb.co.uk/courses-and-qualifications/health-safety-and-environment-hse-test/' },
    ],
    careerIds: [89, 144, 143, 142],
    impact: 'The single fastest route from "no experience" to paid site work.',
    goals: ['trades'],
    quickWin: true,
  },
]

export interface SkillStack {
  id: string
  name: string
  skillIds: string[]
  outcome: string
  careerId: number
}

export const SKILL_STACKS: SkillStack[] = [
  {
    id: 'junior-data',
    name: 'Excel, Data analysis and SQL',
    skillIds: ['excel', 'data-analysis', 'sql'],
    outcome: 'Junior Data Analyst',
    careerId: 2,
  },
  {
    id: 'social-marketer',
    name: 'Canva, Social media and AI prompting',
    skillIds: ['canva', 'social-media', 'ai-prompting'],
    outcome: 'Junior Social Media / Marketing Assistant',
    careerId: 44,
  },
  {
    id: 'site-start',
    name: 'Site tickets, Carpentry intro and First aid',
    skillIds: ['tickets', 'carpentry-intro', 'first-aid'],
    outcome: 'Construction labourer, then apprentice',
    careerId: 89,
  },
  {
    id: 'office-allrounder',
    name: 'Spreadsheets, CRM and Clear communication',
    skillIds: ['excel', 'crm', 'communication'],
    outcome: 'Sales / Customer Service / Office Admin',
    careerId: 75,
  },
  {
    id: 'dev-start',
    name: 'Programming fundamentals, SQL and AI prompting',
    skillIds: ['coding-basics', 'sql', 'ai-prompting'],
    outcome: 'Junior Developer via a Skills Bootcamp',
    careerId: 1,
  },
]

export const SKILL_GOAL_LABELS: Record<SkillGoal, string> = {
  tech: 'Get into tech',
  remote: 'Work remotely',
  business: 'Office and business',
  creative: 'Creative work',
  trades: 'Get into a trade',
  care: 'Care and education',
  any: 'Anything',
}

/** Time-commitment filter buckets. */
export const TIME_BUCKETS: { id: string; label: string; maxHours: number }[] = [
  { id: 'weekend', label: 'I have a weekend', maxHours: 14 },
  { id: 'month', label: 'I have a month', maxHours: 40 },
  { id: 'quarter', label: 'I have 3 months', maxHours: 120 },
]

export const SKILL_COST_LABELS: Record<SkillCost, string> = {
  free: 'Free',
  under50: 'Under £50',
  funded: 'Bootcamp or scheme funded',
}
