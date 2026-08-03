const fs = require('fs')
const path = require('path')
const vm = require('vm')

const subjects = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'subjects.json'), 'utf8'))
const demo = fs.readFileSync(path.join(__dirname, 'data', 'demoCareers.js'), 'utf8')
const match = demo.match(/const rawDemoCareers = \[([\s\S]*?)\]\s*\/\/ Normalize subject ids/)
if (!match) throw new Error('rawDemoCareers block not found')
const rawSource = match[0].replace(/^const rawDemoCareers = /, '').replace(/;?\s*\/\/ Normalize subject ids$/, '')
const sandbox = { raw: null }
vm.createContext(sandbox)
new vm.Script('raw = ' + rawSource).runInContext(sandbox)
const careers = sandbox.raw

const normalize = (value) => value.toLowerCase().replace(/[\W_]+/g, ' ')
const careerIndex = careers.map((career) => ({
  id: career.id,
  title: career.title,
  category: career.category || '',
  tokens: normalize(career.title + ' ' + (career.category || '')).split(/\s+/).filter(Boolean),
}))

const generics = [
  { title: 'Hospitality Worker', category: 'Service & Hospitality', description: '', baseSubjects: ['gcse-food-technology', 'nvq-catering-professional-cookery', 'btec-hospitality', 'chef-apprenticeship', 'hotel-management-apprenticeship', 'vocational-hospitality-catering', 'hotel-hospitality-management-ba', 'event-management-ba', 'tourism-management-ba', 'culinary-arts-ba', 'nutrition-food-science-bsc'] },
  { title: 'Public Services Worker', category: 'Public Services', description: '', baseSubjects: ['btec-public-services', 'police-apprenticeship', 'firefighter-apprenticeship', 'military-apprenticeship', 'policing-criminal-investigation-bsc', 'fire-rescue-bsc', 'emergency-planning-bsc', 'disaster-management-bsc', 'public-administration-ba', 'local-government-management-ba'] },
  { title: 'Legal Advisor', category: 'Business & Finance', description: '', baseSubjects: ['alevel-law', 'law-llb', 'business-law-llb', 'international-law-llb', 'tlevel-legal-services'] },
  { title: 'Science Researcher', category: 'Science & Research', description: '', baseSubjects: ['computer-forensics-bsc', 'biomedical-science-bsc', 'biochemistry-bsc', 'microbiology-bsc', 'forensic-science-bsc', 'environmental-science-bsc', 'marine-biology-bsc', 'astrophysics-bsc', 'mathematics-bsc', 'physics-bsc', 'chemistry-bsc', 'biology-bsc', 'geology-bsc', 'meteorology-bsc', 'materials-science-bsc', 'nanotechnology-bsc'] },
  { title: 'Creative Arts Worker', category: 'Creative & Media', description: '', baseSubjects: ['btec-performing-arts', 'btec-music', 'btec-art-design', 'alevel-drama-theatre', 'theatre-performance-ba', 'dance-ba', 'film-production-ba', 'music-production-ba', 'photography-ba', 'graphic-design-ba', 'creative-writing-ba', 'journalism-ba', 'virtual-reality-development-bsc', 'augmented-reality-development-bsc'] },
  { title: 'Salon Worker', category: 'Service & Hospitality', description: '', baseSubjects: ['nvq-hairdressing', 'nvq-beauty-therapy', 'barbering-apprenticeship', 'tlevel-hairdressing-barbering-beauty-therapy'] },
  { title: 'Sports Coach', category: 'Sport & Leisure', description: '', baseSubjects: ['btec-sport', 'personal-training', 'sports-coaching-apprenticeship', 'leisure-management-apprenticeship', 'sports-therapy-bsc', 'exercise-physiology-bsc', 'coaching-sports-development-bsc'] },
  { title: 'Animal Care Worker', category: 'Agriculture & Animal Care', description: '', baseSubjects: ['nvq-land-based-studies', 'horticulture-apprenticeship', 'agriculture-apprenticeship', 'animal-care-apprenticeship', 'veterinary-medicine-bvetmed'] },
]

function addGenericCareer(template) {
  const existing = careers.find((career) => career.title === template.title)
  if (existing) return existing
  const id = Math.max(...careers.map((career) => career.id)) + 1
  const career = {
    id,
    category: template.category,
    title: template.title,
    salary: '£18k - £40k',
    description: template.description,
    requirements: [],
    matchedSubjects: [...template.baseSubjects],
    dayToDay: [],
    whereToStudy: [],
    progression: [],
    similarCareers: [],
  }
  careers.push(career)
  careerIndex.push({ id: career.id, title: career.title, category: career.category, tokens: normalize(career.title + ' ' + career.category).split(/\s+/).filter(Boolean) })
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
    .map((career) => ({ career, score: subjectScore(subject, career) }))
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
  if (subject.category === 'Vocational' || subject.category === 'BTEC' || subject.category === 'T-Level' || subject.category.startsWith('Refugee')) {
    return careers.find((career) => career.title === 'Project Manager') || careers[0]
  }
  return careers.find((career) => career.title === 'Career Advisor') || careers[0]
}

let hadNoCareer = false
const chosen = []

for (const subject of subjects) {
  const career = chooseCareer(subject)
  chosen.push({ subject, careerTitle: career ? career.title : null, careerCategory: career ? career.category : null })
  if (!career) hadNoCareer = true
}

const noCareer = chosen.filter((item) => !item.careerTitle)
const counts = chosen.reduce((acc, item) => {
  const key = item.careerTitle || 'NO_CAREER'
  acc[key] = (acc[key] || 0) + 1
  return acc
}, {})

console.log('noCareer', noCareer.length)
if (noCareer.length) {
  noCareer.forEach((item) => console.log(item.subject.id, item.subject.label, item.subject.category))
}
console.log('career assignment counts', counts)
console.log('total subjects', chosen.length)
console.log('choices sample')
chosen.slice(0, 80).forEach((item) => console.log(item.subject.id, '=>', item.careerTitle, item.careerCategory))
