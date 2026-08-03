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

const careerSubjects = []
for (const career of careers) {
  if (Array.isArray(career.matchedSubjects)) {
    careerSubjects.push(...career.matchedSubjects)
  }
}
const uniqueCareerSubjects = [...new Set(careerSubjects)]
const subjectIds = subjects.map((subject) => subject.id)
const uniqueSubjectIds = [...new Set(subjectIds)]
console.log('subjects total', subjectIds.length)
console.log('unique subjects', uniqueSubjectIds.length)
console.log('career matchedSubjects total', careerSubjects.length)
console.log('career matchedSubjects unique', uniqueCareerSubjects.length)
console.log('still missing from careers', subjectIds.filter((id) => !new Set(uniqueCareerSubjects).has(id)).length)
console.log('sample missing', subjectIds.filter((id) => !new Set(uniqueCareerSubjects).has(id)).slice(0, 40).join(', '))
