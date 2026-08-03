const fs = require('fs')
const path = require('path')
const vm = require('vm')

const subjects = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'subjects.json'), 'utf8'))
const labelToId = subjects.reduce((map, subject) => {
  map[subject.label] = subject.id
  return map
}, {})

const targetLabels = [
  'GCSE Maths',
  'GCSE English',
  'GCSE Science (Combined)',
  'GCSE Biology',
  'GCSE Chemistry',
  'GCSE Physics',
  'GCSE History',
  'GCSE Geography',
  'GCSE Religious Studies',
  'GCSE Spanish',
  'GCSE French',
  'GCSE German',
  'GCSE Mandarin',
  'GCSE Art & Design',
  'GCSE Music',
  'GCSE Drama',
  'GCSE Media Studies',
  'GCSE Design & Technology',
  'GCSE Computer Science',
  'GCSE Business Studies',
  'GCSE Economics',
  'GCSE Modern Languages (general)',
  'GCSE Food Technology',
  'GCSE Physical Education',
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
  if (!id) {
    console.log(label, '-> MISSING SUBJECT LABEL')
    continue
  }
  const careerTitles = careers
    .filter((career) => Array.isArray(career.matchedSubjects) && career.matchedSubjects.includes(id))
    .map((career) => career.title)
  console.log(`${label} | ${id} | ${careerTitles.length} | ${careerTitles.join('; ')}`)
}
