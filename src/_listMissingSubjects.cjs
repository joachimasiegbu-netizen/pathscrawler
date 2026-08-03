const fs = require('fs')
const path = require('path')
const vm = require('vm')

const subjectsPath = path.join(__dirname, 'data', 'subjects.json')
const demoPath = path.join(__dirname, 'data', 'demoCareers.js')
const subjects = JSON.parse(fs.readFileSync(subjectsPath, 'utf8'))
const text = fs.readFileSync(demoPath, 'utf8')
const start = text.indexOf('const rawDemoCareers = [')
if (start < 0) throw new Error('rawDemoCareers block not found')
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
if (end < 0) throw new Error('rawDemoCareers block not closed')
const rawSource = text.slice(idx, end + 1)
const sandbox = { raw: null }
vm.createContext(sandbox)
new vm.Script('raw = ' + rawSource).runInContext(sandbox)
const careers = sandbox.raw
const used = new Set()
careers.forEach((career) => {
  if (Array.isArray(career.matchedSubjects)) {
    career.matchedSubjects.forEach((subj) => used.add(subj))
  }
})
const missing = subjects.filter((subject) => !used.has(subject.id))
const categoryCounts = {}
missing.forEach((subj) => {
  categoryCounts[subj.category] = (categoryCounts[subj.category] || 0) + 1
})
console.log('missing count', missing.length)
console.log('category counts', categoryCounts)
missing.forEach((subj) => {
  console.log(`${subj.category}\t${subj.id}\t${subj.label}`)
})
