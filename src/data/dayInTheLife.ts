// "A day in the life": an honest, hour-by-hour timeline for a handful of
// priority careers, shown on the career detail page (CareerDetailPage.tsx)
// when an entry exists for that career id. Deliberately not a tidy 9 to 5:
// night shifts, split shifts, dawn starts, unpaid admin. Each entry has
// 6 to 10 blocks plus 1 to 3 "reality check" lines, the things an open day
// or a job ad won't tell you.

export type DayMood = 'routine' | 'admin' | 'stress' | 'reward'

export interface DayBlock {
  /** Wall-clock label, e.g. "07:00" or "00:15". */
  time: string
  title: string
  detail: string
  mood: DayMood
}

export interface DayInTheLife {
  /** demoCareers id. */
  careerId: number
  /** One line of context: shift pattern and setting. */
  summary: string
  blocks: DayBlock[]
  realityChecks: string[]
}

export const DAY_IN_THE_LIFE: DayInTheLife[] = [
  {
    careerId: 22,
    summary: 'Hospital ward, "long day" shift, 07:00 to 19:30 on paper',
    blocks: [
      { time: '06:15', title: 'Alarm, then the commute in the dark', detail: 'Shift starts at 07:00 whatever the traffic did. You are not paid from the moment you arrive. You are paid from the moment handover starts.', mood: 'routine' },
      { time: '07:00', title: 'Handover', detail: 'Twelve patients, two admitted overnight, one quietly deteriorating. You write down everything because you will not remember it in three hours.', mood: 'admin' },
      { time: '07:45', title: 'Drug round', detail: 'Every dose cross-checked against the chart. One patient refuses their meds; you document the refusal and move on.', mood: 'routine' },
      { time: '09:30', title: 'A patient falls', detail: 'Obs, doctor review, incident form, phone call to the family. Your other eleven patients still need you the whole time.', mood: 'stress' },
      { time: '11:00', title: 'Obs, dressings, chasing bloods', detail: 'Wound care, help someone to the toilet, ring the lab about results that should have been back an hour ago.', mood: 'routine' },
      { time: '13:15', title: 'Lunch, 20 minutes, standing up', detail: 'Interrupted twice. You eat half of it.', mood: 'routine' },
      { time: '15:00', title: 'Consultant ward round', detail: 'Take notes, book scans, update six care plans while walking.', mood: 'admin' },
      { time: '17:30', title: 'Discharges and an admission', detail: 'Two discharges (about an hour of paperwork each) and one new patient up from A&E.', mood: 'admin' },
      { time: '19:15', title: 'Handover to nights, then home', detail: 'You leave 30 minutes late, unpaid. A patient you sat with all day squeezed your hand and said thank you. That is the part that keeps people in it.', mood: 'reward' },
    ],
    realityChecks: [
      'Nurses can spend up to 60% of a shift on documentation and admin rather than direct patient care.',
      'The NHS "long day" is 12.5 hours on paper, and most staff report leaving 20 to 40 minutes late, unpaid, most days.',
    ],
  },
  {
    careerId: 1,
    summary: 'Product team, remote, "flexible" hours',
    blocks: [
      { time: '08:45', title: 'Coffee and the overnight backlog', detail: 'Skim Slack and 40 emails. Something is on fire in #incidents, not yours yet.', mood: 'routine' },
      { time: '09:15', title: 'Stand-up', detail: 'Fifteen minutes, mostly "still on the same ticket".', mood: 'admin' },
      { time: '09:30', title: 'Deep work block', detail: 'Headphones on. You get a genuine 90 minutes of focused coding, the best part of the day.', mood: 'reward' },
      { time: '11:00', title: 'Code review', detail: 'Read 600 lines of someone else’s change, leave a dozen comments, approve.', mood: 'admin' },
      { time: '11:45', title: 'A "quick question" call', detail: 'Runs 40 minutes and ends with "let’s take it offline".', mood: 'stress' },
      { time: '13:00', title: 'Lunch away from the desk', detail: 'In theory.', mood: 'routine' },
      { time: '14:00', title: 'The morning’s fix broke CI', detail: 'Bisect, patch, push, wait 12 minutes for the pipeline, repeat.', mood: 'stress' },
      { time: '15:30', title: 'Pairing with a junior', detail: 'Teaching is slower than doing it yourself, but it is the job.', mood: 'routine' },
      { time: '16:45', title: 'Write the ticket, push, log off', detail: 'Or don’t log off, if the deploy is tonight.', mood: 'admin' },
    ],
    realityChecks: [
      'Focused coding is typically 2 to 4 hours of a working day. The rest is meetings, reviews and context-switching.',
      '"Remote and flexible" often stretches the working day across more hours, not fewer.',
    ],
  },
  {
    careerId: 47,
    summary: 'Secondary school, term-time weekday',
    blocks: [
      { time: '07:30', title: 'In before the students', detail: 'Photocopier jam. Set up the room, re-read the lesson you finished planning at 10pm.', mood: 'routine' },
      { time: '08:40', title: 'Form time', detail: 'Registration, uniform, planners, and a safeguarding disclosure you must report before lunch.', mood: 'stress' },
      { time: '09:00', title: 'Periods 1 and 2', detail: 'Two year groups, two topics, back to back, no gap.', mood: 'routine' },
      { time: '11:00', title: 'Break duty', detail: 'Fifteen minutes patrolling a corridor with a coffee going cold.', mood: 'admin' },
      { time: '11:20', title: 'Period 3, cover', detail: 'You cover an absent colleague’s class in a subject you don’t teach.', mood: 'stress' },
      { time: '13:00', title: 'Lunch', detail: 'Run a revision club, eat at your desk, answer three parent emails.', mood: 'admin' },
      { time: '13:40', title: 'Periods 4 and 5', detail: 'Bottom set, Friday afternoon. You earn every minute, and the lesson that lands is genuinely the best feeling in the job.', mood: 'reward' },
      { time: '15:15', title: 'Students leave, and the desk work starts', detail: 'Marking, planning, a department meeting, a phone call home.', mood: 'admin' },
      { time: '18:00', title: 'Leave with a bag of books', detail: 'Plan tomorrow after dinner.', mood: 'routine' },
    ],
    realityChecks: [
      'Teachers in England report roughly 50-hour weeks in term time, and only about half is contact time with students.',
      'Marking and planning mostly happen in evenings and weekends, and eat into the holidays too.',
    ],
  },
  {
    careerId: 86,
    summary: 'Restaurant kitchen, split shift',
    blocks: [
      { time: '08:00', title: 'Deliveries', detail: 'Check every box, reject the bad fish, log fridge temperatures, sign for it.', mood: 'admin' },
      { time: '09:00', title: 'Prep', detail: 'Butcher, portion, blanch, build sauces. Four hours of knife work before a customer walks in.', mood: 'routine' },
      { time: '12:00', title: 'Lunch service', detail: 'Tickets stack up. Someone’s in the weeds; you run their section and yours.', mood: 'stress' },
      { time: '14:30', title: 'Split break', detail: 'Two hours, too short to go home, too long to stand around. You nap in the car or do more prep.', mood: 'routine' },
      { time: '16:30', title: 'Dinner prep and briefing', detail: 'New specials, 86 the halibut, a twelve-top booked for 20:00.', mood: 'admin' },
      { time: '18:30', title: 'Dinner service', detail: 'Five hours on your feet. Burns and cuts you won’t feel until later. When a plate goes out perfect under pressure, that’s the hit you chase.', mood: 'reward' },
      { time: '23:30', title: 'Close', detail: 'Deep clean, wrap everything, write tomorrow’s order, mop the floor.', mood: 'routine' },
      { time: '00:15', title: 'Leave', detail: 'Back at 08:00.', mood: 'routine' },
    ],
    realityChecks: [
      'Kitchen weeks of 50 to 70 hours across split shifts are normal, and evenings, weekends and holidays are the busy times.',
      'Most of the day is prep and cleaning. "Cooking on service" is a small, intense slice of it.',
    ],
  },
  {
    careerId: 142,
    summary: 'Self-employed, domestic jobs and site work',
    blocks: [
      { time: '07:00', title: 'Van check and load', detail: 'Stock the van, load materials, first job across town. Traffic is part of the trade.', mood: 'routine' },
      { time: '08:00', title: 'Job 1: consumer unit upgrade', detail: 'Power off to the whole house for three hours. The customer is not thrilled.', mood: 'routine' },
      { time: '10:30', title: 'Job 2: fault-finding', detail: '"It just stopped working." Two hours tracing a cable to a corroded junction box in a loft.', mood: 'stress' },
      { time: '12:30', title: 'Lunch in the van', detail: 'Order the afternoon’s parts from the wholesaler.', mood: 'admin' },
      { time: '13:15', title: 'Job 3: site work', detail: 'New sockets and lighting on a building site. Dust, noise, other trades in your way.', mood: 'routine' },
      { time: '16:00', title: 'Testing and certification', detail: 'Test results, minor-works certs, photos for the customer. Getting it signed off right is the difference between a tradesperson and a cowboy.', mood: 'reward' },
      { time: '17:00', title: 'Invoicing and quotes', detail: 'Send today’s invoice, chase last month’s unpaid one, quote two new jobs.', mood: 'admin' },
      { time: '18:00', title: 'Restock the van', detail: 'Ready for tomorrow.', mood: 'routine' },
    ],
    realityChecks: [
      'Self-employed electricians spend evenings on quotes, invoicing and certification. It is unpaid, but it keeps the work coming.',
      'The physical toll is real: lofts, under floors, on site, in all weather, year after year.',
    ],
  },
  {
    careerId: 90,
    summary: 'Response team, late shift, 14:00 to midnight',
    blocks: [
      { time: '14:00', title: 'Briefing', detail: 'Overnight intel, wanted persons, a missing teenager still outstanding.', mood: 'admin' },
      { time: '14:30', title: 'Kit up, first call', detail: 'Check the car, then a shoplifter detained by security.', mood: 'routine' },
      { time: '15:30', title: 'Custody', detail: 'Booking a prisoner in is over an hour of forms before you’re back on the road.', mood: 'admin' },
      { time: '17:00', title: 'Domestic incident', detail: 'De-escalate, safeguard, take statements, upload body-worn footage.', mood: 'stress' },
      { time: '19:00', title: '"Meal break"', detail: 'Thirty minutes, often cut short by the radio.', mood: 'routine' },
      { time: '19:45', title: 'Collision on the ring road', detail: 'Scene management, first aid, traffic redirected for two hours.', mood: 'stress' },
      { time: '22:00', title: 'Back-to-back calls', detail: 'A fight outside a pub, a welfare check, a burglary that’s long gone. Now and then you genuinely help someone on the worst day of their life, and that’s why people stay.', mood: 'reward' },
      { time: '23:30', title: 'Statements and case files', detail: 'Everything from the shift, written up court-ready or it doesn’t count.', mood: 'admin' },
      { time: '00:30', title: 'Off duty, in theory', detail: 'The adrenaline takes a while to drop.', mood: 'routine' },
    ],
    realityChecks: [
      'A large share of policing is paperwork and process. Every incident generates statements, logs and evidence handling.',
      'Earlies, lates and nights are standard, rest days get cancelled, and the emotional load builds up over a career.',
    ],
  },
  {
    careerId: 153,
    summary: 'Children and families team, office plus visits',
    blocks: [
      { time: '08:30', title: 'Emails and the duty phone', detail: 'Three new referrals overnight; one needs a same-day visit.', mood: 'admin' },
      { time: '09:00', title: 'Team meeting', detail: 'Allocate cases, talk through the ones keeping people awake.', mood: 'routine' },
      { time: '09:45', title: 'Court report', detail: 'Due Friday. Two hours of writing, weighing every word.', mood: 'admin' },
      { time: '12:00', title: 'Home visit', detail: 'A family who doesn’t want you there. Observe, ask the hard questions, keep the child in view.', mood: 'stress' },
      { time: '13:30', title: 'Late lunch in the car', detail: 'Writing up the visit while it’s still fresh.', mood: 'routine' },
      { time: '14:15', title: 'Multi-agency meeting', detail: 'School, health, police in one room, each with a piece of the picture. When a plan actually comes together for a child, it matters.', mood: 'reward' },
      { time: '16:00', title: 'Supervision', detail: 'Your caseload is over the recommended number. It has been for months.', mood: 'stress' },
      { time: '17:00', title: 'Case notes', detail: 'Every contact recorded, or legally it didn’t happen.', mood: 'admin' },
      { time: '18:30', title: 'Leave', detail: 'The duty phone might ring tonight anyway.', mood: 'routine' },
    ],
    realityChecks: [
      'Case recording and reports take up a large part of the week, often more time than face-to-face work with families.',
      'Caseloads frequently exceed recommended limits, and vicarious trauma and burnout are widely reported.',
    ],
  },
  {
    careerId: 161,
    summary: 'Café, opening shift, 05:30 to 15:00',
    blocks: [
      { time: '05:30', title: 'Open up in the dark', detail: 'Switch the machine on first. It needs 30 minutes to reach temperature.', mood: 'routine' },
      { time: '06:00', title: 'Set up', detail: 'Grind, dial in the espresso, brew batch, pastries out, count the float.', mood: 'routine' },
      { time: '06:30', title: 'First rush', detail: 'Commuters, no patience, 200 drinks in 90 minutes, names you’ll mishear.', mood: 'stress' },
      { time: '08:30', title: 'Restock between waves', detail: 'Wipe the steam wand every single time.', mood: 'routine' },
      { time: '10:00', title: 'Mid-morning', detail: 'Laptops move in, orders get fussier: oat-milk, half-shot, extra-hot.', mood: 'routine' },
      { time: '12:00', title: 'Lunch rush', detail: 'Coffee plus food tickets plus a queue out the door. Nail a busy rush as a team and the shift flies.', mood: 'reward' },
      { time: '14:00', title: 'Deep clean', detail: 'Backflush the machine, strip the grinder, take stock.', mood: 'admin' },
      { time: '15:00', title: 'Cash up and hand over', detail: 'Walk out smelling of steamed milk.', mood: 'routine' },
    ],
    realityChecks: [
      'Hospitality shifts start before dawn or end after midnight, and weekends and holidays are peak, not time off.',
      'It’s skilled and physical. You are on your feet the whole shift, and repetitive strain from tamping and steaming is common.',
    ],
  },
]

export function getDayInTheLife(careerId: number): DayInTheLife | null {
  return DAY_IN_THE_LIFE.find((entry) => entry.careerId === careerId) ?? null
}
