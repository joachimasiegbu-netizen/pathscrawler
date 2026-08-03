const fs = require('fs')
const path = require('path')
const vm = require('vm')

const subjects = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'subjects.json'), 'utf8'))
const demoText = fs.readFileSync(path.join(__dirname, 'data', 'demoCareers.js'), 'utf8')
const match = demoText.match(/const rawDemoCareers = \[([\s\S]*?)\]\s*\/\/ Normalize subject ids/)
if (!match) throw new Error('rawDemoCareers block not found')
const rawSource = match[0].replace(/^const rawDemoCareers = /, '').replace(/;?\s*\/\/ Normalize subject ids$/, '')
const sandbox = { raw: null }
vm.createContext(sandbox)
new vm.Script('raw = ' + rawSource).runInContext(sandbox)
const careers = sandbox.raw

const normalize = (value) => value.toLowerCase().replace(/[\W_]+/g, ' ')
const careerIndex = careers.map((career) => ({
  career,
  id: career.id,
  title: career.title,
  category: career.category || '',
  tokens: normalize(career.title + ' ' + (career.category || '')).split(/\s+/).filter(Boolean),
}))

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

  if (scored.length) {
    return scored[0].career
  }
  return careers.find((career) => career.title === 'Career Advisor') || careers[0]
}

const subjectMap = new Map()
for (const career of careers) {
  if (!Array.isArray(career.matchedSubjects)) career.matchedSubjects = []
  for (const subj of career.matchedSubjects) subjectMap.set(subj, true)
}
const missingSubjects = subjects.filter((subject) => !subjectMap.has(subject.id))
console.log('missingSubjects count', missingSubjects.length)
const toAdd = []
for (const subject of missingSubjects) {
  const career = chooseCareer(subject)
  if (!career) {
    console.log('no career for', subject.id)
    continue
  }
  if (!career.matchedSubjects) career.matchedSubjects = []
  if (!career.matchedSubjects.includes(subject.id)) {
    career.matchedSubjects.push(subject.id)
    toAdd.push({ subject: subject.id, career: career.title })
  }
}
console.log('added count', toAdd.length)
console.log('added sample', toAdd.slice(0,20))
const finalSubjectSet = new Set()
for (const career of careers) {
  for (const subj of career.matchedSubjects) finalSubjectSet.add(subj)
}
console.log('final has vocational-care-worker', finalSubjectSet.has('vocational-care-worker'))
const stillMissing = subjects.filter((subject) => !finalSubjectSet.has(subject.id))
console.log('still missing', stillMissing.map((s) => s.id))
console.log('voc career match', toAdd.find((a) => a.subject === 'vocational-care-worker'))
