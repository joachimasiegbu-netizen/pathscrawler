const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'data', 'demoCareers.js')
let text = fs.readFileSync(filePath, 'utf8')
const regex = /const rawDemoCareers = \[([\s\S]*?)\]\s*\/\/ Normalize subject ids/m
const match = text.match(regex)
if (!match) throw new Error('rawDemoCareers block not found')
const rawSource = '[' + match[1] + ']'
const vm = require('vm')
const sandbox = { raw: null }
vm.createContext(sandbox)
new vm.Script('raw = ' + rawSource).runInContext(sandbox)
const raw = sandbox.raw
const categories = {}
raw.forEach((career) => {
  categories[career.category] = categories[career.category] || []
  categories[career.category].push(career.id)
})

const toSentence = (text) => text.replace(/\b(\w)/g, (m) => m.toUpperCase())
const escapeString = (value) => value.replace(/'/g, "\\'")

const studyOptions = {
  'Technology & Digital': [
    'University degree in computing or IT',
    'Coding bootcamp or specialist training course',
    'Professional certification such as CompTIA or AWS',
    'Apprenticeship in digital or software development',
  ],
  'Business & Finance': [
    'Business or finance degree',
    'Apprenticeship in business administration or accounting',
    'Professional certificates such as AAT or CIMA',
    'College courses in management, marketing or finance',
  ],
  'Healthcare & Medicine': [
    'Healthcare degree or diploma',
    'Nursing, paramedic or medical school training',
    'Clinical placements in hospitals or care settings',
    'Specialist health science or therapy courses',
  ],
  'Engineering & Manufacturing': [
    'Engineering degree or HND',
    'Technical college or apprenticeships in engineering',
    'Industry training and professional development',
    'Design technology and manufacturing courses',
  ],
  'Creative & Media': [
    'Creative arts or media degree',
    'Portfolio-based design or film school training',
    'College courses in digital media and production',
    'Online creative courses and specialised workshops',
  ],
  'Education & Training': [
    'Teaching degree and PGCE/PGDE',
    'School-based teacher training programmes',
    'College courses in education and child development',
    'Apprenticeships in education support roles',
  ],
}

const titleTemplates = [
  {
    match: /software developer|web developer|game developer|mobile app developer|technical writer|database administrator|devops engineer|cloud architect|cloud security engineer|site reliability engineer/i,
    dayToDay: [
      'Write, test and improve software or technical solutions',
      'Fix issues and update systems with user feedback',
      'Collaborate with colleagues, designers and managers',
      'Research new tools, languages and best practices',
    ],
  },
  {
    match: /data analyst|cyber security analyst|ethical hacker|digital forensics investigator|blockchain developer/i,
    dayToDay: [
      'Investigate data, systems and security events',
      'Prepare reports and recommend improvements',
      'Work with stakeholders to solve technical problems',
      'Test systems, monitor performance and manage risk',
    ],
  },
  {
    match: /ux\/ui designer|graphic designer|animator|video editor|photographer|film\/tv producer|social media manager|content writer|writer\/copywriter/i,
    dayToDay: [
      'Create and refine visual or written content',
      'Work with teams to meet campaign and project goals',
      'Use software tools to design, edit and present work',
      'Gather feedback and improve creative deliverables',
    ],
  },
  {
    match: /business analyst|accountant|financial advisor|project manager|marketing manager|human resources officer|sales manager|management consultant|investment banker|insurance underwriter|bookkeeper|customer service advisor|data entry clerk|virtual assistant/i,
    dayToDay: [
      'Analyse information and prepare clear reports',
      'Communicate with clients, colleagues and stakeholders',
      'Make decisions that support business goals',
      'Organise work and manage deadlines for projects',
    ],
  },
  {
    match: /doctor|nurse|paramedic|pharmacist|physiotherapist|occupational therapist|dentist|psychologist|radiographer|midwife|care assistant/i,
    dayToDay: [
      'Care for patients and support their health needs',
      'Record observations and update care plans',
      'Work closely with healthcare teams and specialists',
      'Deliver treatment and advice in clinical settings',
    ],
  },
  {
    match: /civil engineer|mechanical engineer|electrical engineer|aerospace engineer|chemical engineer|architect|quantity surveyor|cad technician/i,
    dayToDay: [
      'Design plans, inspect drawings and review technical details',
      'Coordinate with project teams and clients on requirements',
      'Monitor progress and solve practical problems on site',
      'Ensure work follows standards, safety and quality controls',
    ],
  },
  {
    match: /primary school teacher|secondary school teacher|teaching assistant|university lecturer|career advisor/i,
    dayToDay: [
      'Prepare learning activities and teaching materials',
      'Support learners through lessons and one-to-one help',
      'Assess progress and give helpful feedback',
      'Coordinate with colleagues and support staff',
    ],
  },
]

const progressionRanges = {
  entry: 'Entry (£18k-£30k)',
  mid: 'Mid-level (£30k-£50k)',
  senior: 'Senior (£45k-£70k)',
  lead: 'Lead / Specialist (£60k+)',
}

function generateDayToDay(career) {
  const title = career.title
  const matching = titleTemplates.find((tpl) => tpl.match.test(title))
  if (matching) {
    return matching.dayToDay
  }
  if (career.category === 'Education & Training') {
    return [
      'Prepare lessons, activities and learning resources',
      'Support learners and help them build new skills',
      'Review progress and adapt teaching approaches',
      'Work with colleagues, parents and support teams',
    ]
  }
  return [
    `Work on ${title.toLowerCase()} tasks throughout the day`,
    'Collaborate with colleagues and share ideas',
    'Review work, solve problems and improve outcomes',
    'Learn new techniques and stay up to date with trends',
  ]
}

function generateWhereToStudy(career) {
  const options = studyOptions[career.category] || ['University degree', 'College course', 'Apprenticeship', 'Short specialist training']
  if (career.title.match(/doctor|nurse|paramedic|pharmacist|physiotherapist|occupational therapist|dentist|psychologist|radiographer|midwife/i)) {
    return [
      'Clinical degree with placements or professional training',
      'Specialist health science or therapy course',
      'Accredited clinical practice and on-the-job learning',
      'Continuous professional development in healthcare',
    ]
  }
  if (career.title.match(/teacher|lecturer|assistant|career advisor/i)) {
    return [
      'Education degree with qualified teacher status',
      'School-based training and classroom experience',
      'Professional development in teaching and learning',
      'Apprenticeship or teaching assistant pathway',
    ]
  }
  if (career.title.match(/software developer|data analyst|cyber security analyst|cloud architect|ai\/machine learning engineer|web developer|game developer|devops engineer|database administrator|blockchain developer|ethical hacker|digital forensics investigator|network engineer|it support technician|technical writer/i)) {
    return [
      'University degree in computing, data or cyber security',
      'Bootcamp or vocational course in digital skills',
      'Professional certification in cloud, security or development',
      'Apprenticeship in IT, computing or digital services',
    ]
  }
  if (career.title.match(/graphic designer|ux\/ui designer|animator|video editor|photographer|film\/tv producer|social media manager|content writer|writer\/copywriter/i)) {
    return [
      'Creative arts or media degree with practical projects',
      'Portfolio-based design, film or writing course',
      'Workshops and short courses for creative skills',
      'Industry placements or internships in media work',
    ]
  }
  return options
}

function generateProgression(career) {
  const title = career.title.replace(/\//g, '')
  const base = title.match(/\b(Developer|Engineer|Analyst|Designer|Manager|Advisor|Officer|Consultant|Teacher|Lecturer|Writer|Producer|Administrator|Technician|Surveyor|Assistant|Doctor|Nurse|Paramedic|Pharmacist|Dentist|Psychologist|Radiographer|Midwife|Architect|Accountant|Bookkeeper|Sales|Financial|Cyber|Cloud)\b/)
  const roleName = base ? base[1] : title
  return [
    `${roleName} Apprentice / Junior (${progressionRanges.entry})`,
    `${roleName} (${progressionRanges.mid})`,
    `Senior ${roleName} (${progressionRanges.senior})`,
    `Lead ${roleName} / Specialist (${progressionRanges.lead})`,
  ]
}

function generateSimilarCareers(career) {
  const sameCategoryIds = categories[career.category].filter((id) => id !== career.id)
  const index = sameCategoryIds.indexOf(career.id)
  const similar = []
  for (let offset = 0; similar.length < 4 && offset < sameCategoryIds.length; offset += 1) {
    const next = sameCategoryIds[(sameCategoryIds.indexOf(career.id) + offset) % sameCategoryIds.length]
    if (next && next !== career.id && !similar.includes(next)) similar.push(next)
  }
  if (similar.length < 4) {
    const allOtherIds = raw.map((c) => c.id).filter((id) => !similar.includes(id) && id !== career.id)
    similar.push(...allOtherIds.slice(0, 4 - similar.length))
  }
  return similar.slice(0, 4)
}

raw.forEach((career) => {
  career.dayToDay = career.dayToDay || generateDayToDay(career)
  career.whereToStudy = career.whereToStudy || generateWhereToStudy(career)
  career.progression = career.progression || generateProgression(career)
  career.similarCareers = career.similarCareers || generateSimilarCareers(career)
})

function formatArray(arr) {
  return '[\n' + arr.map((value) => {
    if (typeof value === 'string') {
      return `      '${escapeString(value)}',`
    }
    return `      ${JSON.stringify(value)},`
  }).join('\n') + '\n    ]'
}

function formatCareer(career) {
  const keys = []
  Object.keys(career).forEach((key) => {
    if (key === 'matchedSubjects') {
      keys.push(key)
      keys.push('dayToDay', 'whereToStudy', 'progression', 'similarCareers')
    } else if (!['dayToDay', 'whereToStudy', 'progression', 'similarCareers'].includes(key)) {
      keys.push(key)
    }
  })
  return '  {' +
    '\n' +
    keys.map((key) => {
      const value = career[key]
      if (Array.isArray(value)) {
        return `    ${key}: ${formatArray(value)}`
      }
      if (typeof value === 'string') {
        return `    ${key}: '${escapeString(value)}'`
      }
      return `    ${key}: ${JSON.stringify(value)}`
    }).join(',\n') +
    '\n  }'
}

const formatted = raw.map(formatCareer).join(',\n')
const replacement = `const rawDemoCareers = [\n${formatted}\n];\n\n// Normalize subject ids`
const newText = text.slice(0, match.index) + replacement + text.slice(match.index + match[0].length)
fs.writeFileSync(filePath, newText, 'utf8')
console.log('Updated', raw.length, 'career objects with detail fields.')
