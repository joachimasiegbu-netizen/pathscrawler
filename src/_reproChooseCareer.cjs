const fs = require('fs')
const path = require('path')
const vm = require('vm')

const subjects = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'subjects.json'), 'utf8'))
const text = fs.readFileSync(path.join(__dirname, '_fixSubjectMatching.cjs'), 'utf8')
const match = text.match(/function chooseCareer\([\s\S]*?^}\n/sm)
if (!match) throw new Error('chooseCareer function block not found')
const funcSource = match[0]
const sandbox = { fs, path, vm, console, require, process, module: {}, exports: {} }
const script = new vm.Script(`const subjects = ${JSON.stringify(subjects)};
const text = ${JSON.stringify(text)};
const match = text.match(/function chooseCareer\\([\\s\\S]*?^}\\n/sm);
const chooseCareer = ${funcSource};
const missingSubjects = subjects.filter((subject) => !['dummy'].includes(subject.id));
const results = missingSubjects.map(subject => {
  let career
  try {
    career = chooseCareer(subject)
  } catch (err) {
    return { id: subject.id, error: err.message }
  }
  return { id: subject.id, career: career && career.title, defined: !!career }
})
console.log(JSON.stringify(results.filter(r => !r.defined || !r.career), null, 2));
`)
script.runInNewContext(sandbox)
