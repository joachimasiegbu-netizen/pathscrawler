const fs = require('fs')
const path = require('path')
const vm = require('vm')

const subjectsPath = path.join(__dirname, 'data', 'subjects.json')
const demoPath = path.join(__dirname, 'data', 'demoCareers.js')
const subjects = JSON.parse(fs.readFileSync(subjectsPath, 'utf8'))
const text = fs.readFileSync(demoPath, 'utf8')
const match = text.match(/const rawDemoCareers = \[([\s\S]*?)\]\s*\/\/ Normalize subject ids/)
if (!match) throw new Error('rawDemoCareers block not found')
const rawSource = match[0].replace(/^const rawDemoCareers = /, '').replace(/;?\s*\/\/ Normalize subject ids$/, '')
const sandbox = { raw: null }
vm.createContext(sandbox)
new vm.Script('raw = ' + rawSource).runInContext(sandbox)
const careers = sandbox.raw

const subjectExists = new Map()
for (const career of careers) {
  if (!Array.isArray(career.matchedSubjects)) career.matchedSubjects = []
  for (const subj of career.matchedSubjects) {
    subjectExists.set(subj, true)
  }
}

const normalize = (value) => value.toLowerCase().replace(/[\W_]+/g, ' ')
const careerIndex = careers.map((career) => ({
  career,
  id: career.id,
  title: career.title,
  category: career.category || '',
  tokens: normalize(career.title + ' ' + (career.category || '')).split(/\s+/).filter(Boolean),
}))

const generics = [
  {
    title: 'Hospitality Worker',
    category: 'Service & Hospitality',
    description: 'Support hospitality, catering and guest service roles across hotels, events and food service.',
    baseSubjects: ['gcse-food-technology', 'nvq-catering-professional-cookery', 'btec-hospitality', 'chef-apprenticeship', 'hotel-management-apprenticeship', 'vocational-hospitality-catering', 'hotel-hospitality-management-ba', 'event-management-ba', 'tourism-management-ba', 'culinary-arts-ba', 'nutrition-food-science-bsc'],
  },
  {
    title: 'Public Services Worker',
    category: 'Public Services',
    description: 'Work in public and emergency services to keep communities safe, help people and support operations.',
    baseSubjects: ['btec-public-services', 'police-apprenticeship', 'firefighter-apprenticeship', 'military-apprenticeship', 'policing-criminal-investigation-bsc', 'fire-rescue-bsc', 'emergency-planning-bsc', 'disaster-management-bsc', 'public-administration-ba', 'local-government-management-ba'],
  },
  {
    title: 'Legal Advisor',
    category: 'Business & Finance',
    description: 'Provide legal guidance, support contracts and help organisations manage compliance and risk.',
    baseSubjects: ['alevel-law', 'law-llb', 'business-law-llb', 'international-law-llb', 'tlevel-legal-services'],
  },
  {
    title: 'Science Researcher',
    category: 'Science & Research',
    description: 'Study scientific problems, run experiments and help develop knowledge in technology, environment and health.',
    baseSubjects: ['computer-forensics-bsc', 'biomedical-science-bsc', 'biochemistry-bsc', 'microbiology-bsc', 'forensic-science-bsc', 'environmental-science-bsc', 'marine-biology-bsc', 'astrophysics-bsc', 'mathematics-bsc', 'physics-bsc', 'chemistry-bsc', 'biology-bsc', 'geology-bsc', 'meteorology-bsc', 'materials-science-bsc', 'nanotechnology-bsc'],
  },
  {
    title: 'Creative Arts Worker',
    category: 'Creative & Media',
    description: 'Produce creative content, support performance projects and work in media, art or design roles.',
    baseSubjects: ['btec-performing-arts', 'btec-music', 'btec-art-design', 'alevel-drama-theatre', 'theatre-performance-ba', 'dance-ba', 'film-production-ba', 'music-production-ba', 'photography-ba', 'graphic-design-ba', 'creative-writing-ba', 'journalism-ba', 'virtual-reality-development-bsc', 'augmented-reality-development-bsc'],
  },
  {
    title: 'Salon Worker',
    category: 'Service & Hospitality',
    description: 'Work in salons and beauty settings providing hair, beauty and grooming services.',
    baseSubjects: ['nvq-hairdressing', 'nvq-beauty-therapy', 'barbering-apprenticeship', 'tlevel-hairdressing-barbering-beauty-therapy'],
  },
  {
    title: 'Sports Coach',
    category: 'Sport & Leisure',
    description: 'Support athletes, plan training and help people improve their fitness and sporting performance.',
    baseSubjects: ['btec-sport', 'personal-training', 'sports-coaching-apprenticeship', 'leisure-management-apprenticeship', 'sports-therapy-bsc', 'exercise-physiology-bsc', 'coaching-sports-development-bsc'],
  },
  {
    title: 'Animal Care Worker',
    category: 'Agriculture & Animal Care',
    description: 'Care for animals, support farming and manage practical animal welfare tasks.',
    baseSubjects: ['nvq-land-based-studies', 'horticulture-apprenticeship', 'agriculture-apprenticeship', 'animal-care-apprenticeship', 'veterinary-medicine-bvetmed'],
  },
]

const genericTemplates = []
const genericMapping = new Map()

function addGenericCareer(template) {
  const existing = careers.find((career) => career.title === template.title)
  if (existing) return existing
  const id = Math.max(...careers.map((career) => career.id)) + genericTemplates.length + 1
  const career = {
    id,
    category: template.category,
    title: template.title,
    salary: '£18k - £40k',
    description: template.description,
    requirements: ['Relevant vocational training', 'Practical skills', 'Good communication', 'Customer service or team working'],
    matchedSubjects: [...template.baseSubjects],
    dayToDay: [
      'Support everyday tasks and customer needs',
      'Work with colleagues to complete practical work',
      'Use skills to solve problems and support services',
      'Keep records and follow workplace procedures',
    ],
    whereToStudy: [
      'Vocational or apprenticeship programme',
      'Technical college or training course',
      'Work-based learning and placements',
    ],
    progression: [
      `${template.title} Apprentice (£18k-£24k)`,
      `${template.title} (£24k-£32k)`,
      `Senior ${template.title} (£32k-£40k)`,
    ],
    similarCareers: [1, 5, 11],
  }
  careers.push(career)
  careerIndex.push({
    career,
    id: career.id,
    title: career.title,
    category: career.category,
    tokens: normalize(career.title + ' ' + career.category).split(/\s+/).filter(Boolean),
  })
  genericTemplates.push(career)
  return career
}

function subjectScore(subject, career) {
  const tokens = new Set(normalize(subject.id + ' ' + subject.label + ' ' + subject.category).split(/\s+/).filter(Boolean))
  let score = 0
  for (const token of career.tokens) {
    if (tokens.has(token)) score += 2
    if (subject.label.toLowerCase().includes(token)) score += 1
    if (subject.id.includes(token)) score += 1
  }
  if (subject.category === 'GCSE' && ['teacher', 'education', 'school'].some((word) => career.tokens.includes(word))) score += 1
  if (subject.category === 'University' && career.category.toLowerCase().includes('university')) score += 1
  return score
}

function chooseCareer(subject) {
  const keyword = subject.id.toLowerCase()
  const label = subject.label.toLowerCase()

  const explicit = [
    { match: /maths/, titles: ['Software Developer', 'Accountant', 'Data Analyst', 'Business Analyst', 'Project Manager', 'Investment Banker', 'Secondary School Teacher', 'Primary School Teacher', 'Nurse', 'Career Advisor'] },
    { match: /english/, titles: ['Writer/Copywriter', 'Career Advisor', 'Customer Service Advisor', 'Teaching Assistant', 'Secondary School Teacher', 'Primary School Teacher'] },
    { match: /science/, titles: ['Doctor/GP', 'Nurse', 'Paramedic', 'Pharmacist', 'Dentist', 'Civil Engineer', 'Mechanical Engineer', 'Chemical Engineer', 'Physiotherapist', 'Occupational Therapist', 'Radiographer', 'Midwife'] },
    { match: /biology/, titles: ['Doctor/GP', 'Nurse', 'Pharmacist', 'Dentist', 'Physiotherapist', 'Psychologist'] },
    { match: /chemistry/, titles: ['Doctor/GP', 'Pharmacist', 'Dentist', 'Chemical Engineer', 'Aerospace Engineer', 'Dentist'] },
    { match: /physics/, titles: ['Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Aerospace Engineer', 'AI/Machine Learning Engineer', 'Data Analyst'] },
    { match: /history|geography|religious|politics|sociology|philosophy|classical|modern languages|languages|translation|linguistics|anthropology|archaeology/, titles: ['Secondary School Teacher', 'University Lecturer', 'Career Advisor', 'Writer/Copywriter'] },
    { match: /spanish|french|german|mandarin/, titles: ['Secondary School Teacher', 'University Lecturer', 'Translator', 'Career Advisor'] },
    { match: /music|drama|theatre|film|dance|media|art|photography|graphic|fashion|design/, titles: ['Film/TV Producer', 'Graphic Designer', 'Video Editor', 'Animator', 'UX/UI Designer', 'Writer/Copywriter'] },
    { match: /business|finance|accounting|economics|management/, titles: ['Financial Advisor', 'Accountant', 'Business Analyst', 'Project Manager', 'Marketing Manager', 'Investment Banker'] },
    { match: /law|legal/, titles: ['Legal Advisor', 'Management Consultant', 'Business Analyst'] },
    { match: /psychology|psychotherapist|counselling|mental health/, titles: ['Psychologist', 'Career Advisor', 'Nurse'] },
    { match: /health|nursing|midwifery|pharmacy|physiotherapy|occupational therapy|paramedic|radiography|dietetics|biomedical|forensic science/, titles: ['Doctor/GP', 'Nurse', 'Pharmacist', 'Dentist', 'Physiotherapist', 'Occupational Therapist', 'Paramedic', 'Radiographer', 'Psychologist'] },
    { match: /computer|software|web|game|network|cyber|security|artificial|digital/, titles: ['Software Developer', 'AI/Machine Learning Engineer', 'Web Developer', 'Game Developer', 'Network Engineer', 'Cyber Security Analyst', 'DevOps Engineer', 'Digital Forensics Investigator', 'Cloud Security Engineer', 'IT Support Technician'] },
    { match: /engineering|construction|mechanical|electrical|aerospace|civil|chemical|automotive|nuclear|renewable|railway|mechatronics|robotics/, titles: ['Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Aerospace Engineer', 'Chemical Engineer', 'Architect', 'CAD Technician', 'Quantity Surveyor'] },
    { match: /hospitality|catering|hotel|tourism|event|food|nutrition|culinary/, titles: ['Hospitality Worker'] },
    { match: /police|firefighter|public services|emergency|disaster|rescue|criminal|justice|law-enforcement/, titles: ['Public Services Worker'] },
    { match: /hairdressing|beauty|barber|salon/, titles: ['Salon Worker'] },
    { match: /sport|physical education|coaching|fitness|health and social care|sports therapy|exercise physiology/, titles: ['Sports Coach', 'Physiotherapist', 'Nurse', 'Midwife'] },
    { match: /horticulture|agriculture|animal care|veterinary|land-based|zoology/, titles: ['Animal Care Worker'] },
    { match: /education|teaching|primary|secondary|childcare|special educational needs|early years|tesol/, titles: ['Secondary School Teacher', 'Primary School Teacher', 'Teaching Assistant', 'University Lecturer'] },
  ]

  for (const rule of explicit) {
    if (rule.match.test(keyword) || rule.match.test(label)) {
      for (const title of rule.titles) {
        const career = careers.find((c) => c.title === title)
        if (career) return career
      }
    }
  }

  const scored = careerIndex
    .map((entry) => ({ career: entry.career, score: subjectScore(subject, entry) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
  if (scored.length) return scored[0].career

  for (const template of generics) {
    if (template.baseSubjects.some((base) => keyword.includes(base) || label.includes(base.replace(/-/g, ' ')))) {
      return addGenericCareer(template)
    }
  }

  if (subject.category === 'University') {
    return careers.find((career) => career.title === 'University Lecturer') || careers[0]
  }
  if (subject.category === 'Vocational' || subject.category === 'BTEC' || subject.category === 'T-Level') {
    return careers.find((career) => career.title === 'Project Manager') || careers[0]
  }
  return careers.find((career) => career.title === 'Career Advisor') || careers[0]
}

const updatedCareers = new Set()
const missingSubjects = subjects.filter((subject) => !subjectExists.has(subject.id))
console.log('debug: missingSubjects', missingSubjects.length)
const vocSubject = missingSubjects.find((subject) => subject.id === 'vocational-care-worker')
if (vocSubject) {
  const vocCareer = chooseCareer(vocSubject)
  console.log('debug: chooseCareer(vocational-care-worker)', vocCareer ? vocCareer.title : 'NONE')
}
for (const subject of missingSubjects) {
  const career = chooseCareer(subject)
  if (!career) {
    console.log('debug: no career for', subject.id)
    continue
  }
  if (!career.matchedSubjects) career.matchedSubjects = []
  if (!career.matchedSubjects.includes(subject.id)) {
    career.matchedSubjects.push(subject.id)
    updatedCareers.add(career.title)
  }
}

// Add core subjects broadly
const coreSubjects = ['gcse-maths', 'gcse-english']
for (const career of careers) {
  for (const core of coreSubjects) {
    if (!career.matchedSubjects.includes(core)) {
      career.matchedSubjects.push(core)
      updatedCareers.add(career.title)
    }
  }
}

const scienceCandidates = careers.filter((career) => {
  return /health|medical|science|engineer|technology|digital|teacher|design|analyst|developer/.test((career.category || '').toLowerCase()) || /Doctor|Nurse|Pharmacist|Dentist|Physiotherapist|Occupational Therapist|Radiographer|Midwife|Engineer|Technician|Developer|Analyst/.test(career.title)
})
for (const career of scienceCandidates) {
  if (!career.matchedSubjects.includes('gcse-science-combined')) {
    career.matchedSubjects.push('gcse-science-combined')
    updatedCareers.add(career.title)
  }
}

// Ensure every subject has at least one career now.
const finalSubjectSet = new Set()
for (const career of careers) {
  for (const subj of career.matchedSubjects) finalSubjectSet.add(subj)
}
const stillMissing = subjects.filter((subject) => !finalSubjectSet.has(subject.id))
console.log('initialMissing', missingSubjects.length)
console.log('updatedCareers', updatedCareers.size)
console.log('finalSubjectCount', finalSubjectSet.size)
if (stillMissing.length) {
  console.log('still missing ids', stillMissing.map((s) => s.id).join(', '))
  throw new Error(`Still missing subjects: ${stillMissing.map((s) => s.id).join(', ')}`)
}

const quoteString = (value) => value.replace(/'/g, "\\'")
const formatValue = (value, indent = 4) => {
  if (Array.isArray(value)) {
    const indentStr = ' '.repeat(indent)
    const inner = value
      .map((item) => `    ${typeof item === 'string' ? `'${quoteString(item)}'` : JSON.stringify(item)}`)
      .join(',\n')
    return `[\n${inner}\n${' '.repeat(indent - 2)}]`
  }
  if (typeof value === 'string') return `'${quoteString(value)}'`
  return JSON.stringify(value)
}

const formatCareer = (career) => {
  const orderedKeys = [
    'id',
    'category',
    'title',
    'salary',
    'description',
    'requirements',
    'matchedSubjects',
    'dayToDay',
    'whereToStudy',
    'progression',
    'similarCareers',
    'supportTags',
  ]
  const keys = [...new Set([...orderedKeys, ...Object.keys(career)])]
  return '  {' +
    '\n' +
    keys
      .filter((key) => key in career)
      .map((key) => `    ${key}: ${formatValue(career[key], 6)}`)
      .join(',\n') +
    '\n  }'
}

const formatted = careers.map(formatCareer).join(',\n')
const newBlock = `const rawDemoCareers = [\n${formatted}\n]\n// Normalize subject ids`
const newText = text.slice(0, match.index) + newBlock + text.slice(match.index + match[0].length)
fs.writeFileSync(demoPath, newText, 'utf8')
console.log(`Updated ${updatedCareers.size} careers. Added ${genericTemplates.length} generic careers.`)
console.log('Subjects missing before patch:', missingSubjects.map((s) => s.id).join(', '))
console.log('Updated careers:', [...updatedCareers].sort().join(', '))
console.log('Generic careers:', genericTemplates.map((c) => c.title).join(', '))
