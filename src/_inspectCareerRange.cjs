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
    if (depth === 0) {
      end = i
      break
    }
  }
}
if (end < 0) throw new Error('end not found')
const rawSource = text.slice(idx, end + 1)
const sandbox = { raw: null }
vm.createContext(sandbox)
new vm.Script('raw = ' + rawSource).runInContext(sandbox)
const raw = sandbox.raw
const ids = Array.from({ length: 22 }, (_, i) => 23 + i)
for (const id of ids) {
  const career = raw.find((c) => c.id === id)
  if (!career) {
    console.log('id', id, 'MISSING')
    continue
  }
  const title = career.title
  const fields = {
    dayToDay: Array.isArray(career.dayToDay),
    whereToStudy: Array.isArray(career.whereToStudy),
    progression: Array.isArray(career.progression),
    similarCareers: Array.isArray(career.similarCareers),
  }
  console.log('id', id, 'title', title, fields)
}
