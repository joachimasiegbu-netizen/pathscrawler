const fs = require('fs')
const path = require('path')
const vm = require('vm')

const subjects = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'subjects.json'), 'utf8'))
const demoText = fs.readFileSync(path.join(__dirname, 'data', 'demoCareers.js'), 'utf8')
const match = demoText.match(/const rawDemoCareers = \[([\s\S]*?)\]\s*\/\/ Normalize subject ids/)
if (!match) throw new Error('rawDemoCareers block not found')
const rawSource = match[0].replace(/^const rawDemoCareers = /, '').replace(/;?\/\/ Normalize subject ids$/, '')
const sandbox = { raw: null }
vm.createContext(sandbox)
new vm.Script('raw = ' + rawSource).runInContext(sandbox)
const careers = sandbox.raw

const subjectIds = subjects.map((subject) => subject.id)
const subjectCounts = {}
for (const id of subjectIds) subjectCounts[id] = (subjectCounts[id] || 0) + 1
const duplicates = Object.entries(subjectCounts).filter(([, count]) => count > 1)

const careerSubjects = []
for (const career of careers) {
  if (Array.isArray(career.matchedSubjects)) careerSubjects.push(...career.matchedSubjects)
}
const careerSubjectCounts = {}
for (const id of careerSubjects) careerSubjectCounts[id] = (careerSubjectCounts[id] || 0) + 1
const careerOnly = Object.keys(careerSubjectCounts).filter((id) => !subjectCounts[id])
const missingFromCareer = Object.keys(subjectCounts).filter((id) => !careerSubjectCounts[id])

console.log('total subjects', subjectIds.length)
console.log('unique subject ids', Object.keys(subjectCounts).length)
console.log('duplicate subject ids count', duplicates.length)
console.log('sample duplicates', duplicates.slice(0, 20))
console.log('career matchedSubjects unique', Object.keys(careerSubjectCounts).length)
console.log('career only ids count', careerOnly.length)
console.log('career only sample', careerOnly.slice(0, 40))
console.log('missing from career count', missingFromCareer.length)
console.log('missing from career sample', missingFromCareer.slice(0, 40))
