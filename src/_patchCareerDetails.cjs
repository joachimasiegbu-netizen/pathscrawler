const fs = require('fs')
const path = require('path')
const vm = require('vm')

const filePath = path.join(__dirname, 'data', 'demoCareers.js')
const text = fs.readFileSync(filePath, 'utf8')
const match = text.match(/const rawDemoCareers = \[([\s\S]*?)\];\s*\n\/\/ Normalize subject ids/)
if (!match) {
  throw new Error('rawDemoCareers block not found')
}

const rawSource = match[0]
  .replace(/^const rawDemoCareers = /, '')
  .replace(/;\s*\n\/\/ Normalize subject ids$/, '')
const sandbox = { raw: null }
vm.createContext(sandbox)
new vm.Script('raw = ' + rawSource).runInContext(sandbox)
const raw = sandbox.raw

const careerUpdates = {
  'AI/Machine Learning Engineer': {
    dayToDay: [
      'Build and train machine learning models',
      'Clean and prepare large datasets',
      'Test model accuracy and performance',
      'Deploy AI solutions into production',
      'Research new algorithms and techniques',
    ],
    whereToStudy: [
      'University degree in computer science or AI',
      'Masters in machine learning or data science',
      'Online specialisation (Coursera, DeepLearning.AI)',
      'AI apprenticeship programmes',
    ],
    progression: [
      'Junior ML Engineer (£35k-£45k)',
      'ML Engineer (£45k-£60k)',
      'Senior ML Engineer (£60k-£80k)',
      'Principal AI Scientist (£80k+)',
    ],
    similarCareers: [3, 2, 7, 9],
  },
  Accountant: {
    dayToDay: [
      'Prepare financial records and reconcile accounts',
      'Manage invoices, payroll and expense reports',
      'Support audits and financial compliance',
      'Communicate with clients and stakeholders',
    ],
    whereToStudy: [
      'Accounting degree or finance degree',
      'Apprenticeship or AAT/CIMA training',
      'Professional bookkeeping courses',
      'College finance and business programmes',
    ],
    progression: [
      'Trainee Accountant (£25k-£35k)',
      'Accountant (£35k-£50k)',
      'Senior Accountant (£50k-£70k)',
      'Finance Manager (£70k+)',
    ],
    similarCareers: [11, 13, 74, 71],
  },
  'Aerospace Engineer': {
    dayToDay: [
      'Design aircraft and spacecraft components',
      'Calculate loads, performance and materials',
      'Review technical drawings and prototypes',
      'Work with teams to solve engineering challenges',
    ],
    whereToStudy: [
      'Aerospace engineering degree',
      'Engineering apprenticeship or HND',
      'Technical college manufacturing course',
      'Industry placements with aerospace firms',
    ],
    progression: [
      'Graduate Aerospace Engineer (£28k-£40k)',
      'Aerospace Engineer (£40k-£55k)',
      'Senior Aerospace Engineer (£55k-£70k)',
      'Lead Aerospace Engineer (£70k+)',
    ],
    similarCareers: [31, 32, 33, 35],
  },
  Animator: {
    dayToDay: [
      'Create storyboards, character motion and animation',
      'Build scenes using animation tools and software',
      'Refine timing and visual effects for projects',
      'Collaborate with designers, directors and teams',
    ],
    whereToStudy: [
      'Animation or digital media degree',
      'Portfolio-based creative workshops',
      'Film and animation school programmes',
      'Industry internships or apprenticeships',
    ],
    progression: [
      'Junior Animator (£20k-£30k)',
      'Animator (£30k-£40k)',
      'Senior Animator (£40k-£55k)',
      'Lead Animator (£55k+)',
    ],
    similarCareers: [39, 40, 41, 45],
  },
  Architect: {
    dayToDay: [
      'Design buildings, spaces and structural plans',
      'Produce drawings, models and client presentations',
      'Coordinate with engineers and construction teams',
      'Ensure design meets safety, planning and budget needs',
    ],
    whereToStudy: [
      'Architecture degree with professional accreditation',
      'RIBA-validated architectural course',
      'Design studio placements or internships',
      'Professional development in planning and sustainability',
    ],
    progression: [
      'Architectural Assistant (£28k-£35k)',
      'Architect (£35k-£50k)',
      'Senior Architect (£50k-£70k)',
      'Design Director (£70k+)',
    ],
    similarCareers: [31, 34, 35, 37],
  },
  'Blockchain Developer': {
    dayToDay: [
      'Build and test smart contracts and blockchain apps',
      'Secure distributed ledger systems and protocols',
      'Debug crypto transactions and blockchain logic',
      'Research new decentralised technologies and tools',
    ],
    whereToStudy: [
      'Computer science or software engineering degree',
      'Blockchain development bootcamp',
      'Online blockchain and crypto courses',
      'Developer apprenticeship in distributed systems',
    ],
    progression: [
      'Junior Blockchain Developer (£35k-£45k)',
      'Blockchain Developer (£45k-£60k)',
      'Senior Blockchain Developer (£60k-£75k)',
      'Blockchain Architect (£75k+)',
    ],
    similarCareers: [8, 3, 63, 66],
  },
  Bookkeeper: {
    dayToDay: [
      'Record financial transactions and process invoices',
      'Reconcile bank statements and account ledgers',
      'Prepare basic financial reports for businesses',
      'Support payroll, VAT and compliance processes',
    ],
    whereToStudy: [
      'Bookkeeping and accounting course',
      'Business administration apprenticeship',
      'Professional AAT or bookkeeping training',
      'College finance and business pathways',
    ],
    progression: [
      'Junior Bookkeeper (£18k-£25k)',
      'Bookkeeper (£25k-£35k)',
      'Senior Bookkeeper (£35k-£45k)',
      'Finance Administrator (£45k+)',
    ],
    similarCareers: [12, 71, 74, 75],
  },
  'Business Analyst': {
    dayToDay: [
      'Gather and analyse business requirements',
      'Create reports, process maps and recommendations',
      'Work with stakeholders to improve systems',
      'Support project planning and decision-making',
    ],
    whereToStudy: [
      'Business analysis or management degree',
      'Professional analysis diploma or certificate',
      'College business and finance courses',
      'Apprenticeship in business or project support',
    ],
    progression: [
      'Junior Business Analyst (£28k-£35k)',
      'Business Analyst (£35k-£50k)',
      'Senior Business Analyst (£50k-£65k)',
      'Lead Business Analyst (£65k+)',
    ],
    similarCareers: [12, 13, 14, 18],
  },
  'CAD Technician': {
    dayToDay: [
      'Produce CAD drawings and technical models',
      'Update designs based on engineering input',
      'Check measurements and specifications for accuracy',
      'Share drawings with teams and support production',
    ],
    whereToStudy: [
      'CAD technician or design technology course',
      'Engineering college or apprenticeship',
      'Specialist CAD software training',
      'Work-based technical design placements',
    ],
    progression: [
      'Junior CAD Technician (£20k-£28k)',
      'CAD Technician (£28k-£35k)',
      'Senior CAD Technician (£35k-£45k)',
      'CAD Team Lead (£45k+)',
    ],
    similarCareers: [31, 32, 33, 37],
  },
  'Care Assistant': {
    dayToDay: [
      'Support daily living and personal care tasks',
      'Help patients with meals, mobility and hygiene',
      'Observe wellbeing and report changes to staff',
      'Offer companionship and emotional support',
    ],
    whereToStudy: [
      'Health and social care course',
      'Care apprenticeship programme',
      'Workplace training in healthcare settings',
      'Adult learning or GCSE care qualifications',
    ],
    progression: [
      'Care Assistant (£18k-£22k)',
      'Senior Care Assistant (£22k-£28k)',
      'Team Leader (£28k-£35k)',
      'Care Coordinator (£35k+)',
    ],
    similarCareers: [21, 22, 24, 26],
  },
  'Career Advisor': {
    dayToDay: [
      'Guide people through career and education decisions',
      'Research training and job pathways for clients',
      'Prepare development plans and interview prep',
      'Meet individuals and support their next steps',
    ],
    whereToStudy: [
      'Career guidance or education degree',
      'Counselling and advice qualifications',
      'Apprenticeship in welfare or career services',
      'Professional training in employability support',
    ],
    progression: [
      'Career Advisor (£22k-£30k)',
      'Senior Career Advisor (£30k-£40k)',
      'Careers Manager (£40k-£50k)',
      'Head of Careers (£50k+)',
    ],
    similarCareers: [11, 16, 49, 48],
  },
  'Chemical Engineer': {
    dayToDay: [
      'Design chemical processes and industrial systems',
      'Carry out experiments and analyse results',
      'Improve efficiency and safety in production',
      'Work with technical teams on process development',
    ],
    whereToStudy: [
      'Chemical engineering degree',
      'Engineering apprenticeship or HND',
      'Industry placements in manufacturing or energy',
      'Professional development in process safety',
    ],
    progression: [
      'Graduate Chemical Engineer (£28k-£38k)',
      'Chemical Engineer (£38k-£50k)',
      'Senior Chemical Engineer (£50k-£65k)',
      'Principal Engineer (£65k+)',
    ],
    similarCareers: [31, 32, 33, 34],
  },
  'Civil Engineer': {
    dayToDay: [
      'Design infrastructure and construction projects',
      'Inspect site plans and monitor progress',
      'Coordinate with contractors and stakeholders',
      'Ensure projects meet safety and quality standards',
    ],
    whereToStudy: [
      'Civil engineering degree',
      'Engineering apprenticeship or HND',
      'College construction and project management courses',
      'Professional development in surveying and design',
    ],
    progression: [
      'Graduate Civil Engineer (£26k-£36k)',
      'Civil Engineer (£36k-£50k)',
      'Senior Civil Engineer (£50k-£65k)',
      'Project Manager (£65k+)',
    ],
    similarCareers: [32, 33, 34, 35],
  },
  'Cloud Architect': {
    dayToDay: [
      'Design cloud systems and infrastructure',
      'Guide cloud deployments and migrations',
      'Set architecture standards for scalability',
      'Review performance and optimise costs',
    ],
    whereToStudy: [
      'Cloud computing degree or IT degree',
      'AWS/Azure certification training',
      'Cloud architecture bootcamps',
      'Apprenticeship in cloud or infrastructure support',
    ],
    progression: [
      'Junior Cloud Architect (£45k-£55k)',
      'Cloud Architect (£55k-£70k)',
      'Senior Cloud Architect (£70k-£85k)',
      'Principal Cloud Architect (£85k+)',
    ],
    similarCareers: [7, 8, 66, 57],
  },
  'Cloud Security Engineer': {
    dayToDay: [
      'Secure cloud platforms and monitor threats',
      'Configure protections and access controls',
      'Investigate incidents and patch vulnerabilities',
      'Support secure deployments and governance',
    ],
    whereToStudy: [
      'Cyber security or computing degree',
      'Cloud security certification',
      'Specialist security training',
      'Security apprenticeship or industry experience',
    ],
    progression: [
      'Junior Cloud Security Engineer (£40k-£50k)',
      'Cloud Security Engineer (£50k-£65k)',
      'Senior Cloud Security Engineer (£65k-£80k)',
      'Lead Security Engineer (£80k+)',
    ],
    similarCareers: [3, 7, 8, 66],
  },
  'Content Writer': {
    dayToDay: [
      'Write articles, blogs and social content',
      'Edit and proofread copy for publication',
      'Research topics and meet content briefs',
      'Work with marketing teams to shape messaging',
    ],
    whereToStudy: [
      'Writing, journalism or media degree',
      'Creative writing course or diploma',
      'Content marketing or copywriting training',
      'Online writing and editing programmes',
    ],
    progression: [
      'Junior Writer (£20k-£28k)',
      'Content Writer (£28k-£38k)',
      'Senior Writer (£38k-£50k)',
      'Content Lead (£50k+)',
    ],
    similarCareers: [43, 44, 48, 75],
  },
  'Customer Service Advisor': {
    dayToDay: [
      'Answer customer enquiries and resolve issues',
      'Record interactions and update case notes',
      'Work with teams to improve customer service',
      'Provide friendly support across channels',
    ],
    whereToStudy: [
      'Customer service apprenticeship',
      'Business administration course',
      'Communication and service training',
      'Retail or office skills development',
    ],
    progression: [
      'Customer Service Advisor (£18k-£25k)',
      'Senior Customer Service Advisor (£25k-£32k)',
      'Team Leader (£32k-£40k)',
      'Customer Service Manager (£40k+)',
    ],
    similarCareers: [71, 75, 16, 48],
  },
  'Cyber Security Analyst': {
    dayToDay: [
      'Monitor security alerts and investigate incidents',
      'Test systems for vulnerabilities and patch issues',
      'Analyse logs and report on risk',
      'Work with teams to improve security controls',
    ],
    whereToStudy: [
      'Cyber security degree',
      'Security certification such as CompTIA or CISSP',
      'Technical cyber security training',
      'Security apprenticeship or industry experience',
    ],
    progression: [
      'Junior Cyber Security Analyst (£30k-£40k)',
      'Cyber Security Analyst (£40k-£55k)',
      'Senior Cyber Security Analyst (£55k-£70k)',
      'Security Consultant (£70k+)',
    ],
    similarCareers: [3, 8, 63, 66],
  },
  'Data Analyst': {
    dayToDay: [
      'Collect and analyse data from multiple sources',
      'Build reports and dashboards for teams',
      'Interpret trends and share insights',
      'Work with stakeholders to improve decisions',
    ],
    whereToStudy: [
      'Data analysis or statistics degree',
      'Excel, SQL and analytics course',
      'Bootcamp in data and reporting tools',
      'Apprenticeship in data analytics',
    ],
    progression: [
      'Junior Data Analyst (£28k-£35k)',
      'Data Analyst (£35k-£50k)',
      'Senior Data Analyst (£50k-£65k)',
      'Analytics Lead (£65k+)',
    ],
    similarCareers: [2, 8, 52, 63],
  },
  'Data Entry Clerk': {
    dayToDay: [
      'Enter information accurately into systems',
      'Check records for errors and consistency',
      'Organise files and maintain data quality',
      'Support administrative and office tasks',
    ],
    whereToStudy: [
      'Business administration or office skills course',
      'Data entry training and IT basics',
      'Apprenticeship in administration',
      'Clerical skills and typing development',
    ],
    progression: [
      'Junior Data Entry Clerk (£18k-£22k)',
      'Data Entry Clerk (£22k-£28k)',
      'Senior Data Entry Clerk (£28k-£35k)',
      'Office Administrator (£35k+)',
    ],
    similarCareers: [12, 71, 74, 75],
  },
  'Database Administrator': {
    dayToDay: [
      'Manage and optimise database systems',
      'Monitor performance and run backups',
      'Support developers with data access',
      'Resolve database issues and maintain security',
    ],
    whereToStudy: [
      'IT or database management degree',
      'SQL and database administration course',
      'Certification in database platforms',
      'Apprenticeship in IT infrastructure',
    ],
    progression: [
      'Junior DBA (£28k-£35k)',
      'Database Administrator (£35k-£50k)',
      'Senior DBA (£50k-£65k)',
      'Lead DBA (£65k+)',
    ],
    similarCareers: [1, 9, 61, 62],
  },
  Dentist: {
    dayToDay: [
      'Examine patients and diagnose oral health issues',
      'Carry out treatments and dental procedures',
      'Advise patients on care and prevention',
      'Work with dental nurses and support staff',
    ],
    whereToStudy: [
      'Dentistry degree with clinical placements',
      'Hospital-based dental foundation training',
      'Specialist dental practice experience',
      'Ongoing professional development',
    ],
    progression: [
      'Dental Foundation Dentist (£35k-£45k)',
      'Associate Dentist (£45k-£60k)',
      'Senior Dentist (£60k-£80k)',
      'Practice Principal (£80k+)',
    ],
    similarCareers: [21, 22, 24, 28],
  },
}

const targetTitles = Object.keys(careerUpdates)
let updated = 0
for (const career of raw) {
  if (targetTitles.includes(career.title)) {
    const update = careerUpdates[career.title]
    career.dayToDay = update.dayToDay
    career.whereToStudy = update.whereToStudy
    career.progression = update.progression
    career.similarCareers = update.similarCareers
    updated += 1
  }
}

if (!updated) {
  throw new Error('No careers updated')
}

const quoteString = (value) => value.replace(/'/g, "\\'")
const formatValue = (value, indent = 4) => {
  if (Array.isArray(value)) {
    const indentStr = ' '.repeat(indent)
    const inner = value.map((item) => {
      if (typeof item === 'string') {
        return `${indentStr}  '${quoteString(item)}',`
      }
      return `${indentStr}  ${JSON.stringify(item)},`
    }).join('\n')
    return `[\n${inner}\n${indentStr}]`
  }
  if (typeof value === 'string') {
    return `'${quoteString(value)}'`
  }
  return JSON.stringify(value)
}

const formatCareer = (career) => {
  const orderedKeys = [
    'id',
    'category',
    'title',
    'salary',
    'description',
    'requirements',
    'matchedSubjects',
    'dayToDay',
    'whereToStudy',
    'progression',
    'similarCareers',
    'supportTags',
  ]
  const keys = [...new Set([...orderedKeys, ...Object.keys(career)])]
  return '  {' +
    '\n' +
    keys.filter((key) => key in career).map((key) => {
      const value = career[key]
      return `    ${key}: ${formatValue(value, 4)}`
    }).join(',\n') +
    '\n  }'
}

const formatted = raw.map(formatCareer).join(',\n')
const newBlock = `const rawDemoCareers = [\n${formatted}\n]\n// Normalize subject ids`
const newText = text.slice(0, match.index) + newBlock + text.slice(match.index + match[0].length)
fs.writeFileSync(filePath, newText, 'utf8')
console.log(`Updated ${updated} career records.`)
