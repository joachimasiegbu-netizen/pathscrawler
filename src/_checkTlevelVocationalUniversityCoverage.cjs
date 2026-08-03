const fs = require('fs')
const path = require('path')
const vm = require('vm')

const subjects = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'subjects.json'), 'utf8'))
const subjectMap = subjects.reduce((map, subject) => {
  map[subject.label.toLowerCase()] = subject.id
  return map
}, {})

const targetLabels = [
  'T-Level Digital Production, Design & Development',
  'T-Level Digital Business Services',
  'T-Level Digital Support Services',
  'T-Level Construction: Design, Surveying & Planning',
  'T-Level Construction: Building Services Engineering',
  'T-Level Construction: On-Site Construction',
  'T-Level Education & Childcare',
  'T-Level Health',
  'T-Level Healthcare Science',
  'T-Level Science',
  'T-Level Engineering & Manufacturing: Design & Development',
  'T-Level Engineering & Manufacturing: Maintenance, Installation & Repair',
  'T-Level Engineering & Manufacturing: Processing & Control',
  'T-Level Finance',
  'T-Level Accounting',
  'T-Level Management & Administration',
  'T-Level Legal Services',
  'T-Level Agriculture, Land Management & Production',
  'T-Level Animal Care & Management',
  'T-Level Hairdressing, Barbering & Beauty Therapy',
  'T-Level Craft & Design',
  'T-Level Media, Broadcast & Production',
  'T-Level Catering',
  'NVQ Plumbing',
  'NVQ Electrical Installation',
  'NVQ Carpentry',
  'BTEC Construction',
  'NVQ Health & Social Care',
  'NVQ Early Years Educator',
  'BTEC Health & Social Care',
  'Healthcare Assistant Apprenticeship',
  'Dental Nursing Apprenticeship',
  'Cyber Security Apprenticeship',
  'Software Development Apprenticeship',
  'Network Engineer Apprenticeship',
  'NVQ Business Administration',
  'Customer Service Apprenticeship',
  'HR Apprenticeship',
  'Accounting Apprenticeship (AAT)',
  'NVQ Vehicle Maintenance',
  'Mechanical Engineering Apprenticeship',
  'Electrical Engineering Apprenticeship',
  'Aerospace Manufacturing Apprenticeship',
  'NVQ Catering & Professional Cookery',
  'Chef Apprenticeship',
  'NVQ Hairdressing',
  'NVQ Beauty Therapy',
  'BTEC Performing Arts',
  'BTEC Media',
  'BTEC Music',
  'BTEC Art & Design',
  'Photography Apprenticeship',
  'NVQ Land-Based Studies',
  'Horticulture Apprenticeship',
  'Agriculture Apprenticeship',
  'Animal Care Apprenticeship',
  'Police Apprenticeship',
  'Firefighter Apprenticeship',
  'Military Apprenticeship',
  'Computer Science',
  'Software Engineering',
  'Cyber Security',
  'Data Science',
  'Artificial Intelligence',
  'Information Technology',
  'Business Management',
  'Marketing',
  'Finance',
  'Accounting',
  'Economics',
  'Human Resource Management',
  'International Business',
  'Law (LLB)',
  'Criminology',
  'Medicine (MBBS)',
  'Nursing (all branches)',
  'Midwifery',
  'Pharmacy',
  'Physiotherapy',
  'Occupational Therapy',
  'Dentistry',
  'Psychology',
  'Biomedical Science',
  'Biochemistry',
  'Microbiology',
  'Forensic Science',
  'Environmental Science',
  'Marine Biology',
  'Astrophysics',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Geology',
  'Meteorology',
  'Civil Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Aerospace Engineering',
  'Chemical Engineering',
  'Architecture',
  'Interior Design',
  'Product Design',
  'Animation',
  'Film Production',
  'Music Production',
  'Creative Writing',
  'Journalism',
  'English Literature',
  'History',
  'Philosophy',
  'Politics',
  'Sociology',
  'Anthropology',
  'Archaeology',
  'Education Studies',
  'Primary Education',
  'Secondary Education',
  'Special Educational Needs',
  'Social Work',
  'Youth Work',
  'Policing & Criminal Investigation',
  'Fire & Rescue',
  'Paramedic Science',
  'Public Health',
  'Sports Science',
  'Sports Therapy',
  'Exercise Physiology',
  'Coaching & Sports Development',
  'Geography',
  'Geology',
  'Agriculture',
  'Animal Science',
  'Zoology',
  'Veterinary Medicine',
  'Fashion Design',
  'Textile Design',
  'Photography',
  'Fine Art',
  'Theatre & Performance',
  'Dance',
  'Event Management',
  'Hotel & Hospitality Management',
  'Tourism Management',
  'Culinary Arts',
  'Nutrition & Food Science',
  'Occupational Health & Safety',
  'Quantity Surveying',
  'Building Surveying',
  'Town Planning',
  'Transport Planning',
  'Estate Management',
  'Real Estate',
  'Actuarial Science',
  'Banking & Finance',
  'Taxation',
  'Audit & Assurance',
  'Supply Chain Management',
  'Operations Management',
  'Quality Management',
]

const normalizedSubjectMap = Object.entries(subjectMap).reduce((map, [label, id]) => {
  map[label.replace(/[^a-z0-9]+/g, ' ').trim()] = id
  return map
}, {})

const demoText = fs.readFileSync(path.join(__dirname, 'data', 'demoCareers.js'), 'utf8')
const match = demoText.match(/const rawDemoCareers = \[([\s\S]*?)\]\s*\/\/ Normalize subject ids/)
if (!match) throw new Error('rawDemoCareers not found')
const rawSource = match[0].replace(/^const rawDemoCareers = /, '').replace(/;?\s*\/\/ Normalize subject ids$/, '')
const sandbox = { raw: null }
vm.createContext(sandbox)
new vm.Script('raw = ' + rawSource).runInContext(sandbox)
const careers = sandbox.raw

function findId(label) {
  const key = label.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  return normalizedSubjectMap[key] || null
}

for (const label of targetLabels) {
  const id = findId(label)
  const status = id ? id : 'NOT FOUND'
  const matches = id
    ? careers.filter((career) => Array.isArray(career.matchedSubjects) && career.matchedSubjects.includes(id)).map((career) => career.title)
    : []
  console.log(`${label} | ${status} | ${matches.length} | ${matches.join('; ')}`)
}
