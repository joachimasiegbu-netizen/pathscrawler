const fs = require('fs')
const path = require('path')
const vm = require('vm')

const filePath = path.join(__dirname, 'data', 'demoCareers.js')
const text = fs.readFileSync(filePath, 'utf8')
const start = text.indexOf('const rawDemoCareers = [')
if (start < 0) throw new Error('start not found')
let idx = text.indexOf('[', start)
let depth = 0
let end = -1
for (let i = idx; i < text.length; i++) {
  const ch = text[i]
  if (ch === '[') depth++
  else if (ch === ']') {
    depth--
    if (depth === 0) { end = i; break }
  }
}
if (end < 0) throw new Error('end not found')
const rawSource = text.slice(idx, end + 1)
const sandbox = { raw: null }
vm.createContext(sandbox)
new vm.Script('raw = ' + rawSource).runInContext(sandbox)
const raw = sandbox.raw
const titles = [
  'DevOps Engineer',
  'Digital Forensics Investigator',
  'Doctor/GP',
  'Electrical Engineer',
  'Ethical Hacker',
  'Film/TV Producer',
  'Financial Advisor',
  'Game Developer',
  'Graphic Designer',
  'Human Resources Officer',
  'IT Support Technician',
  'Insurance Underwriter',
  'Investment Banker',
  'Management Consultant',
  'Marketing Manager',
  'Mechanical Engineer',
  'Midwife',
  'Mobile App Developer',
  'Network Engineer',
  'Nurse',
  'Occupational Therapist',
  'Paramedic',
]

titles.forEach((title) => {
  const career = raw.find((c) => c.title === title)
  if (!career) {
    console.log('MISSING:', title)
    return
  }
  const status = {
    id: career.id,
    dayToDay: Array.isArray(career.dayToDay),
    whereToStudy: Array.isArray(career.whereToStudy),
    progression: Array.isArray(career.progression),
    similarCareers: Array.isArray(career.similarCareers),
  }
  console.log('FOUND:', title, JSON.stringify(status))
})
