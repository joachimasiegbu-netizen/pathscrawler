// Student Hub content as a single FAQ set. Each sub-page renders the
// questions for its topic (as a scan-and-expand list), and /student-hub/faq
// shows everything grouped. Questions are written to fit the answers, so the
// facts only live in one place. England 2024/25 system; every page tells
// the reader to confirm current figures on gov.uk / ucas.com.

export type FaqTopic = 'student-finance' | 'ucas' | 'repaying' | 'maintenance' | 'apprenticeship-or-uni'

export interface Faq {
  id: string
  topic: FaqTopic
  question: string
  answer: string
}

export const FAQ_TOPIC_LABEL: Record<FaqTopic, string> = {
  'student-finance': 'Student Finance (SFE)',
  ucas: 'UCAS & applying',
  repaying: 'Repaying your loan',
  maintenance: 'Maintenance Loan',
  'apprenticeship-or-uni': 'Apprenticeship vs University',
}

export const FAQS: Faq[] = [
  // ---------- Student Finance ----------
  {
    id: 'sf-when-apply',
    topic: 'student-finance',
    question: 'When should I apply for Student Finance?',
    answer:
      'As early as you can. Applications open months before the academic year and processing takes weeks. Apply by the spring deadline (usually late May) to be sure the money is there for the start of term.',
  },
  {
    id: 'sf-no-offer',
    topic: 'student-finance',
    question: 'Can I apply before I have a confirmed university place?',
    answer:
      'Yes. Put down your most likely course and university. You can change it later, including after Clearing, without starting the application again.',
  },
  {
    id: 'sf-household-income',
    topic: 'student-finance',
    question: 'What is the "household income" part of the application?',
    answer:
      'The Maintenance Loan is means-tested. Whoever you live with, usually a parent, submits their income for the relevant tax year through their own separate login. That figure decides how much Maintenance Loan you are offered.',
  },
  {
    id: 'sf-evidence',
    topic: 'student-finance',
    question: 'What evidence does Student Finance ask for?',
    answer:
      'Usually a passport or birth certificate to confirm your identity. Upload it in the portal as soon as it is requested. Missing evidence is the most common reason funding arrives late.',
  },
  {
    id: 'sf-when-paid',
    topic: 'student-finance',
    question: 'How and when do I actually get the money?',
    answer:
      'The Tuition Fee Loan is paid straight to your university. Your Maintenance Loan is paid into your bank account in three instalments, one at the start of each term, but only after you have enrolled and registered at university.',
  },
  {
    id: 'sf-entitlement',
    topic: 'student-finance',
    question: 'What happens after I get my entitlement letter?',
    answer:
      'Check the Tuition and Maintenance Loan figures, then accept your funding online. Registering at university is what releases the payments.',
  },

  // ---------- UCAS ----------
  {
    id: 'ucas-deadline',
    topic: 'ucas',
    question: 'What is the UCAS application deadline?',
    answer:
      'End of January for most courses. Oxford, Cambridge, and most medicine, dentistry and veterinary courses close in mid-October, which is much earlier.',
  },
  {
    id: 'ucas-personal-statement',
    topic: 'ucas',
    question: 'Do I write a different personal statement for each university?',
    answer:
      'No. The same personal statement goes to every course you apply to, so write about the subject and why you want to study it, not about one specific university.',
  },
  {
    id: 'ucas-five-choices',
    topic: 'ucas',
    question: 'How many courses can I apply to?',
    answer:
      'Up to five. You do not have to use all five, and universities cannot see which other courses you picked or in what order.',
  },
  {
    id: 'ucas-firm-insurance',
    topic: 'ucas',
    question: 'What are firm and insurance choices?',
    answer:
      'Once your offers are back you choose a firm choice (your first pick) and an insurance choice (a backup, usually with lower grade requirements). Miss your firm offer and you may still be accepted by your insurance.',
  },
  {
    id: 'ucas-clearing',
    topic: 'ucas',
    question: 'What is Clearing and who is it for?',
    answer:
      'Clearing runs from July to October for anyone without a place, whether you missed your grades, changed your mind, or applied late. You contact universities directly by phone, and places genuinely exist, including at strong universities.',
  },
  {
    id: 'ucas-trade-up',
    topic: 'ucas',
    question: 'I beat my predicted grades, can I trade up to a better course?',
    answer:
      'The old "Adjustment" process no longer exists. You can self-release into Clearing to look for a different course, but you lose your original confirmed place the moment you do, so only do it once you are sure.',
  },

  // ---------- Repaying ----------
  {
    id: 'rep-which-plan',
    topic: 'repaying',
    question: 'Which repayment plan will I be on?',
    answer:
      'If you are starting a course now, you will be on Plan 5. Plan 2 is the older version, for people who went to university several years ago before the current system came in. The two work in a similar way but the numbers differ.',
  },
  {
    id: 'rep-monthly',
    topic: 'repaying',
    question: 'How much do I repay each month?',
    answer:
      'You repay 9% of everything you earn above a set threshold. On Plan 5 that threshold is currently around £25,000 a year, so roughly £2,080 a month. Earn less than that and you repay nothing that month. On the older Plan 2 the threshold sits a little higher.',
  },
  {
    id: 'rep-interest',
    topic: 'repaying',
    question: 'What interest is added to the balance?',
    answer:
      'On Plan 5 the interest is inflation only, with no top-up based on your income. On the older Plan 2 it runs from inflation up to inflation plus 3%, depending on what you earn.',
  },
  {
    id: 'rep-write-off',
    topic: 'repaying',
    question: 'When is the loan written off?',
    answer:
      'On Plan 5, whatever is still outstanding is cancelled after 40 years of being due to repay. On the older Plan 2 it is 30 years. Either way, anything left at that point is wiped and you owe nothing more.',
  },
  {
    id: 'rep-never-repay',
    topic: 'repaying',
    question: 'Is it true most people never repay it in full?',
    answer:
      'On Plan 5, a large share of graduates are expected to still be repaying when the 40-year write-off arrives. For most people the size of the balance matters far less than their future salary, because the repayment is capped at 9% above the threshold no matter how big the balance is.',
  },
  {
    id: 'rep-credit-score',
    topic: 'repaying',
    question: 'Does my student loan affect my credit score or mortgage?',
    answer:
      'It is not on your credit file and mortgage lenders do not treat it as normal debt. They do count the monthly repayment when working out how much you can borrow, though, because it lowers your take-home pay.',
  },
  {
    id: 'rep-drop-out',
    topic: 'repaying',
    question: 'What if I drop out?',
    answer:
      'You still repay the tuition for any year you started, plus any maintenance already paid to you. Leaving early in a year rather than near the end can make a real difference to how much that is.',
  },
  {
    id: 'rep-clear-early',
    topic: 'repaying',
    question: 'Can I clear it early if I earn well?',
    answer:
      'Yes. On a graduate salary that climbs past roughly £45k, it is realistic to clear a balance of that size in about 10 to 15 years, at which point the 9% deduction stops. The Debt Calculator lets you model your own numbers.',
  },

  // ---------- Maintenance ----------
  {
    id: 'mnt-how-much',
    topic: 'maintenance',
    question: 'How much Maintenance Loan will I get?',
    answer:
      'It depends on your household income and where you live while studying. As a rough guide right now: living with parents, up to about £8,600 a year; living away from home outside London, up to about £10,200; living in London, up to about £13,300. A higher household income brings the amount down toward a minimum.',
  },
  {
    id: 'mnt-minimum',
    topic: 'maintenance',
    question: 'Do I get anything on a high household income?',
    answer:
      'Yes. There is a minimum amount everyone qualifies for regardless of household income. On a high household income that works out at roughly £3,800 living at home, £4,800 living away outside London, or £6,600 in London.',
  },
  {
    id: 'mnt-why-home-less',
    topic: 'maintenance',
    question: 'Why does living at home get less?',
    answer:
      'The loan is meant to cover living costs, and living with parents is assumed to be cheaper. Living away from home pushes it up, and living in London pushes it up the most.',
  },
  {
    id: 'mnt-repayable',
    topic: 'maintenance',
    question: 'Is the Maintenance Loan repayable?',
    answer:
      'Yes. It is added to the same balance as your Tuition Fee Loan and repaid the same way, as 9% of income above the threshold. Grants, bursaries and scholarships are not repayable.',
  },
  {
    id: 'mnt-exact-figure',
    topic: 'maintenance',
    question: 'Where do I find my exact figure?',
    answer:
      'In your online Student Finance account, once your application and your household income details have been processed. The numbers above are ballpark maximums, not a quote.',
  },

  // ---------- Apprenticeship vs Uni ----------
  {
    id: 'app-cost',
    topic: 'apprenticeship-or-uni',
    question: 'What does an apprenticeship cost me?',
    answer:
      'Nothing in tuition. The employer and government fund the training. A degree costs £9,250 a year in tuition (as a loan) plus living costs.',
  },
  {
    id: 'app-earn',
    topic: 'apprenticeship-or-uni',
    question: 'Do I earn money as an apprentice?',
    answer:
      'Yes, a wage from day one. The minimum apprentice rate is lower than the standard minimum wage, but many employers pay well above it, and it rises each year. At university your income is the Maintenance Loan (a debt) plus any part-time work.',
  },
  {
    id: 'app-degree',
    topic: 'apprenticeship-or-uni',
    question: 'Can I get a degree through an apprenticeship?',
    answer:
      'Yes. Degree apprenticeships take you up to a full bachelor’s or master’s while you work. Other apprenticeships run from Level 2 up to Level 5.',
  },
  {
    id: 'app-catch',
    topic: 'apprenticeship-or-uni',
    question: 'What is the catch with an apprenticeship?',
    answer:
      'You are tied to one employer and one occupation, there are fewer providers, and popular ones are competitive to get onto. University offers broader subject choice, is easier to switch direction in, and gives you the full student experience.',
  },
  {
    id: 'app-debt',
    topic: 'apprenticeship-or-uni',
    question: 'How much debt do I end up with each way?',
    answer:
      'An apprenticeship typically leaves you with none. A degree often leaves a loan balance of £40,000 to £60,000, repaid as 9% of income above the threshold, or written off after 30 to 40 years.',
  },
  {
    id: 'app-prospects',
    topic: 'apprenticeship-or-uni',
    question: 'Which one gives better job prospects?',
    answer:
      'Neither is universally better. An apprenticeship gives you 3 to 5 years of real work experience and contacts by the time you finish. A degree gives a recognised qualification and, if you seek them out, placements and internships. It depends on the field and the person.',
  },
]

export function faqsForTopic(topic: FaqTopic): Faq[] {
  return FAQS.filter((f) => f.topic === topic)
}

export function getFaq(id: string): Faq | undefined {
  return FAQS.find((f) => f.id === id)
}

// Guard against ever shipping a duplicate question again (dev only - warns
// loudly in the console, does nothing in production builds).
if (import.meta.env.DEV) {
  const seenIds = new Set<string>()
  const seenQuestions = new Set<string>()
  for (const f of FAQS) {
    const q = f.question.trim().toLowerCase().replace(/\s+/g, ' ')
    if (seenIds.has(f.id)) console.warn(`[studentHubFaq] duplicate id: ${f.id}`)
    if (seenQuestions.has(q)) console.warn(`[studentHubFaq] duplicate/near-identical question: "${f.question}"`)
    seenIds.add(f.id)
    seenQuestions.add(q)
  }
}

export const STUDENT_HUB_SOURCES = [
  { label: 'Student finance (gov.uk)', url: 'https://www.gov.uk/student-finance' },
  { label: 'Repaying your student loan (gov.uk)', url: 'https://www.gov.uk/repaying-your-student-loan' },
  { label: 'UCAS', url: 'https://www.ucas.com' },
  { label: 'Become an apprentice (gov.uk)', url: 'https://www.gov.uk/apprenticeships-guide' },
  { label: 'Student Loans mythbusting (Money Saving Expert)', url: 'https://www.moneysavingexpert.com/students/student-loans-tuition-fees-changes/' },
]

export const SFE_CHECKLIST: string[] = [
  'Register for a Student Finance account at gov.uk/student-finance',
  'Note your application deadline (usually late May for guaranteed funding by term 1)',
  'Enter your most likely course and university (changeable later)',
  'Ask your parent/partner to register and submit household income',
  'Upload identity evidence (passport or birth certificate) if requested',
  'Check the entitlement letter figures, then accept your funding',
  'Enrol at university so the Tuition Fee Loan is released',
  'Confirm your bank details for the 3 Maintenance Loan instalments',
]

export const UCAS_CHECKLIST: string[] = [
  'Register on ucas.com and link your school/college buzzword if you have one',
  'Shortlist up to 5 courses, checking entry requirements and any admissions tests',
  'Book any required admissions tests (e.g. for medicine) before their deadlines',
  'Draft the personal statement about the subject; get 2 people to review it',
  'Ask your referee early and give them your deadline',
  'Submit before the end-of-January deadline (mid-October for Oxbridge/medicine)',
  'Reply to offers: pick a firm choice and a lower-grade insurance choice',
  'Have a Clearing plan: 3 or 4 backup courses and their phone numbers saved',
]
