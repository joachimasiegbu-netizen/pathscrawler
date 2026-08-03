const fs = require('fs')
const path = require('path')
const vm = require('vm')

const filePath = path.join(__dirname, 'data', 'demoCareers.js')
const text = fs.readFileSync(filePath, 'utf8')
let match = text.match(/const rawDemoCareers = \[([\s\S]*?)\]\s*\/\/ Normalize subject ids/)
if (!match) {
  match = text.match(/const rawDemoCareers = \[([\s\S]*?)\];\s*\/\/ Normalize subject ids/)
}
if (!match) {
  throw new Error('rawDemoCareers block not found')
}

const rawSource = match[0]
  .replace(/^const rawDemoCareers = /, '')
  .replace(/;?\s*\/\/ Normalize subject ids$/, '')
const sandbox = { raw: null }
vm.createContext(sandbox)
new vm.Script('raw = ' + rawSource).runInContext(sandbox)
const raw = sandbox.raw

const titles = [
  'AI/Machine Learning Engineer',
  'Accountant',
  'Aerospace Engineer',
  'Animator',
  'Architect',
  'Blockchain Developer',
  'Bookkeeper',
  'Business Analyst',
  'CAD Technician',
  'Care Assistant',
  'Career Advisor',
  'Chemical Engineer',
  'Civil Engineer',
  'Cloud Architect',
  'Cloud Security Engineer',
  'Content Writer',
  'Customer Service Advisor',
  'Cyber Security Analyst',
  'Data Analyst',
  'Data Entry Clerk',
  'Database Administrator',
  'Dentist',
]

for (const title of titles) {
  const careers = raw.filter((career) => career.title === title)
  const counts = careers.length
  const fieldStatus = careers.map((career) => ({
    dayToDay: Array.isArray(career.dayToDay),
    whereToStudy: Array.isArray(career.whereToStudy),
    progression: Array.isArray(career.progression),
    similarCareers: Array.isArray(career.similarCareers),
  }))
  console.log(`${title}: count=${counts}, fields=${JSON.stringify(fieldStatus)}`)
}
