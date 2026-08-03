const fs = require('fs')
const path = require('path')
const subjects = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'subjects.json'), 'utf8'))
const candidates = subjects.filter((s) => /modern languages|languages|language/i.test(s.label))
console.log('matches', candidates.length)
for (const s of candidates) {
  console.log(`${s.label} | ${s.id} | ${s.category}`)
}
