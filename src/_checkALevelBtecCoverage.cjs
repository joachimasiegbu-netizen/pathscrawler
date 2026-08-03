const fs = require('fs')
const path = require('path')
const vm = require('vm')

const subjects = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'subjects.json'), 'utf8'))
const labelToId = subjects.reduce((map, subject) => {
  map[subject.label] = subject.id
  return map
}, {})

const targetLabels = [
  'A-Level Mathematics',
  'A-Level English Literature',
  'A-Level English Language',
  'A-Level Biology',
  'A-Level Chemistry',
  'A-Level Physics',
  'A-Level Psychology',
  'A-Level Sociology',
  'A-Level Politics',
  'A-Level Law',
  'A-Level Economics',
  'A-Level Business Studies',
  'A-Level Computer Science',
  'A-Level Media Studies',
  'A-Level Art & Design',
  'A-Level Photography',
  'A-Level Music Technology',
  'A-Level Drama & Theatre',
  'A-Level Physical Education',
  'A-Level Geography',
  'A-Level History',
  'A-Level Philosophy',
  'A-Level Modern Languages',
  'A-Level Classical Civilisation',
  'A-Level Environmental Science',
  'A-Level Film Studies',
  'A-Level Graphic Communication',
  'BTEC IT (Level 3)',
  'BTEC Computing (Level 3)',
  'BTEC Business (Level 3)',
  'BTEC Engineering (Level 3)',
  'BTEC Health & Social Care (Level 3)',
  'BTEC Sport (Level 3)',
  'BTEC Performing Arts (Level 3)',
  'BTEC Media (Level 3)',
  'BTEC Music (Level 3)',
  'BTEC Art & Design (Level 3)',
  'BTEC Construction (Level 3)',
  'BTEC Hospitality (Level 3)',
  'BTEC Travel & Tourism (Level 3)',
  'BTEC Public Services (Level 3)',
  'BTEC Applied Science (Level 3)',
  'BTEC Forensic Science (Level 3)',
]

const demoText = fs.readFileSync(path.join(__dirname, 'data', 'demoCareers.js'), 'utf8')
const match = demoText.match(/const rawDemoCareers = \[([\s\S]*?)\]\s*\/\/ Normalize subject ids/)
if (!match) throw new Error('rawDemoCareers not found')
const rawSource = match[0].replace(/^const rawDemoCareers = /, '').replace(/;?\s*\/\/ Normalize subject ids$/, '')
const sandbox = { raw: null }
vm.createContext(sandbox)
new vm.Script('raw = ' + rawSource).runInContext(sandbox)
const careers = sandbox.raw

for (const label of targetLabels) {
  const id = labelToId[label]
  const title = id ? `${label} | ${id}` : `${label} | MISSING ID`
  const matches = id
    ? careers.filter((career) => Array.isArray(career.matchedSubjects) && career.matchedSubjects.includes(id)).map((career) => career.title)
    : []
  console.log(`${title} -> ${matches.length} | ${matches.join('; ')}`)
}
