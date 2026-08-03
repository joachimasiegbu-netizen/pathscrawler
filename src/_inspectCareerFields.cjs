const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'data', 'demoCareers.js');
const text = fs.readFileSync(filePath, 'utf8');
const dataMatch = text.match(/const rawDemoCareers = \[([\s\S]*?)\]\s*\/\/ Normalize subject ids/);
if (!dataMatch) {
  console.error('rawDemoCareers block not found');
  process.exit(1);
}
const rawText = dataMatch[0].replace(/^const rawDemoCareers = /, '').replace(/\/\/ Normalize subject ids[\s\S]*$/, '');
const vm = require('vm');
const sandbox = { raw: null };
vm.createContext(sandbox);
new vm.Script('raw = ' + rawText).runInContext(sandbox);
const raw = sandbox.raw;
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
];
for (const title of titles) {
  const item = raw.find((c) => c.title === title);
  if (!item) {
    console.log(`${title}: NOT FOUND`);
    continue;
  }
  const fields = ['dayToDay', 'whereToStudy', 'progression', 'similarCareers'];
  const status = fields.map((field) => `${field}=${field in item}`).join(', ');
  console.log(`${item.id} - ${title}: ${status}`);
}
