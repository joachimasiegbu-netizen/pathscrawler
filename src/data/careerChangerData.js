// Career Changer data layer for the 4-step flow (qualification -> current
// job -> preferences -> results).
//
// `currentRoles` — the "what do you do now?" list shown in Step 2. Just
// id + title; the actual transferable skills for each job live in
// `currentJobSkills` below (hardSkills/softSkills, richer than a flat list).
//
// `currentJobSkills` — hard/soft skills for every Step 2 job option,
// keyed by `currentRoles[].id`. 'unemployed' intentionally carries little
// data - there's nothing real to claim there.
//
// `careerSkillRequirements` — hard/soft skills for the alternate-career
// side of the match, used only to compute a "skills that transfer" bonus
// on the results cards. Deliberately scoped to the ~33 career slugs that
// actually appear somewhere in `careerSwitchMap` below (see that map's own
// comment for why every id here has to resolve to something real) rather
// than the full breadth of UK job titles - a skills entry for a career
// that can never appear as a result would just be dead data.
//
// `careerSwitchMap` — keyed by `currentRoles[].id`. Each entry's
// `alternateCareers` is keyed by a kebab-case slug of a real
// `demoCareers.js` career title; `careerId` is that career's numeric
// `id` in demoCareers.js, included alongside the slug so a switch target
// can always be resolved back to its full career record without a
// separate slugify step.
//
// Every `subjectId` referenced under viaMasters/viaProfessional is a real
// id from postgraduateSubjects.js; every `subjectId` under
// viaApprenticeship is a real Vocational-category id from subjects.json.
// Nothing here is invented - if a realistic Master's, Professional or
// Apprenticeship route didn't already exist in that data, the route (or
// the whole alternate career) is omitted rather than pointing at an id
// that wouldn't resolve to a label anywhere else in the app.

export const currentRoles = [
  { id: 'retail-worker', title: 'Retail Worker' },
  { id: 'retail-manager', title: 'Retail Manager' },
  { id: 'teacher', title: 'Teacher' },
  { id: 'nurse', title: 'Nurse' },
  { id: 'office-admin', title: 'Office Admin' },
  { id: 'engineer', title: 'Engineer' },
  { id: 'hospitality', title: 'Hospitality Worker' },
  { id: 'construction', title: 'Construction Worker' },
  { id: 'sales', title: 'Sales' },
  { id: 'military', title: 'Military' },
  { id: 'warehouse', title: 'Warehouse' },
  { id: 'call-centre', title: 'Call Centre' },
  { id: 'chef', title: 'Chef' },
  { id: 'driver', title: 'Driver' },
  { id: 'cleaner', title: 'Cleaner' },
  { id: 'security', title: 'Security' },
  { id: 'beauty', title: 'Beauty' },
  { id: 'social-care', title: 'Social Care' },
  { id: 'banking', title: 'Banking Assistant' },
  { id: 'it-support', title: 'IT Support' },
  { id: 'unemployed', title: 'Unemployed' },
]

export const currentJobSkills = {
  'retail-worker': {
    hardSkills: ['cash handling', 'stock management', 'POS systems', 'sales processing'],
    softSkills: ['customer service', 'communication', 'patience', 'time management', 'teamwork'],
  },
  'retail-manager': {
    hardSkills: ['inventory management', 'sales forecasting', 'scheduling', 'budgeting'],
    softSkills: ['leadership', 'problem solving', 'negotiation', 'decision making', 'motivation'],
  },
  teacher: {
    hardSkills: ['lesson planning', 'curriculum design', 'assessment', 'subject expertise'],
    softSkills: ['communication', 'patience', 'organisation', 'empathy', 'presentation'],
  },
  nurse: {
    hardSkills: ['clinical procedures', 'medical records', 'medication administration', 'patient assessment'],
    softSkills: ['empathy', 'crisis management', 'communication', 'attention to detail', 'resilience'],
  },
  'office-admin': {
    hardSkills: ['data entry', 'Microsoft Office', 'scheduling', 'filing systems', 'email management'],
    softSkills: ['organisation', 'communication', 'time management', 'reliability', 'discretion'],
  },
  engineer: {
    hardSkills: ['CAD software', 'technical drawing', 'project planning', 'quality control', 'prototyping'],
    softSkills: ['problem solving', 'analytical thinking', 'teamwork', 'attention to detail', 'logical reasoning'],
  },
  hospitality: {
    hardSkills: ['food safety', 'booking systems', 'cash handling', 'event coordination'],
    softSkills: ['customer service', 'multitasking', 'communication', 'calm under pressure', 'teamwork'],
  },
  construction: {
    hardSkills: ['tool use', 'blueprint reading', 'health & safety', 'materials knowledge', 'measurement'],
    softSkills: ['physical stamina', 'teamwork', 'problem solving', 'reliability', 'attention to detail'],
  },
  sales: {
    hardSkills: ['CRM software', 'sales forecasting', 'product knowledge', 'contract negotiation'],
    softSkills: ['persuasion', 'communication', 'resilience', 'target driven', 'relationship building'],
  },
  military: {
    hardSkills: ['logistics', 'equipment maintenance', 'security protocols', 'navigation', 'communications'],
    softSkills: ['leadership', 'discipline', 'teamwork', 'crisis management', 'adaptability'],
  },
  warehouse: {
    hardSkills: ['inventory systems', 'forklift operation', 'picking & packing', 'health & safety'],
    softSkills: ['organisation', 'physical stamina', 'reliability', 'teamwork', 'time management'],
  },
  'call-centre': {
    hardSkills: ['CRM systems', 'data entry', 'product knowledge', 'complaint logging'],
    softSkills: ['communication', 'listening', 'patience', 'conflict resolution', 'empathy'],
  },
  chef: {
    hardSkills: ['food preparation', 'kitchen management', 'menu planning', 'health & safety', 'cost control'],
    softSkills: ['creativity', 'time management', 'teamwork', 'calm under pressure', 'attention to detail'],
  },
  driver: {
    hardSkills: ['route planning', 'vehicle maintenance', 'delivery logistics', 'navigation apps'],
    softSkills: ['time management', 'reliability', 'independence', 'customer service', 'patience'],
  },
  cleaner: {
    hardSkills: ['cleaning chemicals', 'equipment use', 'health & safety', 'infection control'],
    softSkills: ['attention to detail', 'time management', 'reliability', 'independence', 'thoroughness'],
  },
  security: {
    hardSkills: ['CCTV operation', 'access control', 'incident reporting', 'health & safety'],
    softSkills: ['observation', 'calm under pressure', 'conflict resolution', 'reliability', 'alertness'],
  },
  beauty: {
    hardSkills: ['treatment techniques', 'product knowledge', 'salon software', 'hygiene standards'],
    softSkills: ['customer service', 'creativity', 'sales', 'attention to detail', 'listening'],
  },
  'social-care': {
    hardSkills: ['care planning', 'medication support', 'safeguarding', 'documentation'],
    softSkills: ['empathy', 'patience', 'communication', 'resilience', 'advocacy'],
  },
  banking: {
    hardSkills: ['financial products', 'compliance', 'fraud detection', 'banking software', 'risk assessment'],
    softSkills: ['attention to detail', 'customer service', 'integrity', 'numeracy', 'communication'],
  },
  'it-support': {
    hardSkills: ['troubleshooting', 'networking', 'Windows/Mac support', 'ticketing systems', 'hardware repair'],
    softSkills: ['problem solving', 'customer service', 'patience', 'communication', 'logical thinking'],
  },
  unemployed: {
    hardSkills: [],
    softSkills: ['adaptability', 'willingness to learn', 'motivation'],
  },
}

// Scoped to the ~33 alternate-career slugs actually used in careerSwitchMap
// below - see the file header comment for why. Same hardSkills/softSkills
// shape as currentJobSkills, used only to compute the results page's
// "skills that transfer" bonus (an overlap count/list against whichever
// current job the user picked), never to gate which careers can appear.
export const careerSkillRequirements = {
  'sales-manager': {
    hardSkills: ['sales forecasting', 'CRM software', 'territory planning', 'pipeline management'],
    softSkills: ['leadership', 'communication', 'negotiation', 'motivation', 'target driven'],
  },
  'hr-officer': {
    hardSkills: ['recruitment', 'employment law', 'HR systems', 'payroll basics'],
    softSkills: ['communication', 'empathy', 'discretion', 'organisation', 'conflict resolution'],
  },
  bookkeeper: {
    hardSkills: ['accounting software', 'reconciliation', 'invoicing', 'financial records'],
    softSkills: ['attention to detail', 'organisation', 'integrity', 'numeracy'],
  },
  'administrative-assistant': {
    hardSkills: ['data entry', 'scheduling', 'Microsoft Office', 'filing systems'],
    softSkills: ['organisation', 'communication', 'reliability', 'time management'],
  },
  'business-analyst': {
    hardSkills: ['requirements gathering', 'process mapping', 'data analysis', 'stakeholder management'],
    softSkills: ['communication', 'problem solving', 'analytical thinking', 'negotiation', 'organisation'],
  },
  'marketing-manager': {
    hardSkills: ['digital marketing', 'campaign management', 'analytics', 'content strategy'],
    softSkills: ['creativity', 'communication', 'analytical thinking', 'adaptability', 'strategic thinking'],
  },
  'project-manager': {
    hardSkills: ['project planning', 'budgeting', 'risk management', 'scheduling'],
    softSkills: ['leadership', 'communication', 'organisation', 'problem solving', 'time management'],
  },
  'management-consultant': {
    hardSkills: ['business analysis', 'strategy', 'data modelling', 'presentation'],
    softSkills: ['communication', 'problem solving', 'analytical thinking', 'adaptability', 'confidence'],
  },
  'career-advisor': {
    hardSkills: ['careers guidance frameworks', 'labour market knowledge', 'assessment', 'case management'],
    softSkills: ['communication', 'empathy', 'patience', 'organisation'],
  },
  'university-lecturer': {
    hardSkills: ['curriculum design', 'subject expertise', 'academic writing', 'assessment'],
    softSkills: ['communication', 'presentation', 'critical thinking', 'mentoring'],
  },
  psychologist: {
    hardSkills: ['psychological assessment', 'research methods', 'case formulation', 'data analysis'],
    softSkills: ['empathy', 'communication', 'analytical thinking', 'patience', 'resilience'],
  },
  physiotherapist: {
    hardSkills: ['manual therapy', 'exercise prescription', 'assessment', 'rehabilitation'],
    softSkills: ['empathy', 'communication', 'patience', 'problem solving'],
  },
  'occupational-therapist': {
    hardSkills: ['assessment', 'adaptation design', 'rehabilitation planning', 'equipment prescription'],
    softSkills: ['empathy', 'creativity', 'problem solving', 'communication', 'patience'],
  },
  accountant: {
    hardSkills: ['financial reporting', 'tax', 'auditing', 'accounting software', 'regulatory compliance'],
    softSkills: ['attention to detail', 'integrity', 'analytical thinking', 'organisation', 'numeracy'],
  },
  'renewable-energy-engineer': {
    hardSkills: ['electrical systems', 'installation standards', 'project planning', 'site assessment'],
    softSkills: ['problem solving', 'attention to detail', 'teamwork', 'analytical thinking'],
  },
  'quantity-surveyor': {
    hardSkills: ['cost estimation', 'contract management', 'valuation', 'procurement'],
    softSkills: ['numeracy', 'attention to detail', 'negotiation', 'organisation', 'communication'],
  },
  'event-manager': {
    hardSkills: ['budgeting', 'vendor management', 'logistics', 'booking systems'],
    softSkills: ['organisation', 'communication', 'problem solving', 'calm under pressure', 'multitasking'],
  },
  'civil-engineer': {
    hardSkills: ['structural analysis', 'AutoCAD', 'project management', 'materials science'],
    softSkills: ['problem solving', 'analytical thinking', 'teamwork', 'attention to detail'],
  },
  'police-public-services-officer': {
    hardSkills: ['incident reporting', 'investigation basics', 'public order', 'first aid'],
    softSkills: ['calm under pressure', 'communication', 'judgment', 'resilience', 'teamwork'],
  },
  'cyber-security-analyst': {
    hardSkills: ['network security', 'risk assessment', 'incident response', 'troubleshooting'],
    softSkills: ['analytical thinking', 'attention to detail', 'calm under pressure', 'problem solving'],
  },
  'mechanical-engineer': {
    hardSkills: ['CAD', 'manufacturing processes', 'materials knowledge', 'tool use'],
    softSkills: ['problem solving', 'analytical thinking', 'teamwork', 'attention to detail'],
  },
  'care-assistant': {
    hardSkills: ['personal care', 'mobility assistance', 'medication prompting', 'documentation'],
    softSkills: ['empathy', 'patience', 'communication', 'reliability', 'resilience'],
  },
  'virtual-assistant': {
    hardSkills: ['scheduling', 'email management', 'data entry', 'Microsoft Office'],
    softSkills: ['organisation', 'communication', 'reliability', 'time management'],
  },
  'customer-service-advisor': {
    hardSkills: ['CRM systems', 'complaint handling', 'product knowledge', 'data entry'],
    softSkills: ['communication', 'patience', 'listening', 'customer service'],
  },
  'construction-trades-worker': {
    hardSkills: ['tool use', 'blueprint reading', 'health & safety', 'measurement'],
    softSkills: ['physical stamina', 'teamwork', 'reliability', 'attention to detail'],
  },
  nurse: {
    hardSkills: ['clinical procedures', 'patient assessment', 'medication', 'medical records'],
    softSkills: ['empathy', 'communication', 'resilience', 'attention to detail', 'teamwork'],
  },
  'social-media-manager': {
    hardSkills: ['content creation', 'analytics', 'scheduling tools', 'platform algorithms'],
    softSkills: ['creativity', 'communication', 'adaptability', 'trend awareness'],
  },
  'graphic-designer': {
    hardSkills: ['Adobe Creative Suite', 'typography', 'branding', 'layout'],
    softSkills: ['creativity', 'communication', 'attention to detail', 'time management'],
  },
  'financial-advisor': {
    hardSkills: ['financial planning', 'pensions', 'investments', 'regulatory compliance'],
    softSkills: ['communication', 'trustworthiness', 'empathy', 'analytical thinking', 'organisation'],
  },
  'insurance-underwriter': {
    hardSkills: ['risk assessment', 'policy terms', 'data analysis', 'regulatory compliance'],
    softSkills: ['analytical thinking', 'attention to detail', 'decision making', 'communication'],
  },
  'network-engineer': {
    hardSkills: ['routing & switching', 'network security', 'troubleshooting', 'cabling standards'],
    softSkills: ['problem solving', 'attention to detail', 'calm under pressure', 'communication'],
  },
  'software-developer': {
    hardSkills: ['programming', 'version control', 'database basics', 'debugging'],
    softSkills: ['problem solving', 'logical thinking', 'attention to detail', 'teamwork', 'continuous learning'],
  },
  'devops-engineer': {
    hardSkills: ['CI/CD', 'cloud platforms', 'automation', 'monitoring'],
    softSkills: ['problem solving', 'collaboration', 'continuous learning', 'adaptability'],
  },
}

export const careerSwitchMap = {
  'retail-worker': {
    alternateCareers: {
      'sales-manager': {
        careerId: 17,
        careerTitle: 'Sales Manager',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'cim-marketing', whyItFits: 'Your day-to-day sales and customer service experience is the foundation the CIM Marketing qualification builds on for a move into sales leadership.' },
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-marketing', whyItFits: 'You already understand what makes customers buy - an MSc Marketing turns that instinct into a strategic skill set.' },
      },
      'hr-officer': {
        careerId: 16,
        careerTitle: 'Human Resources Officer',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-3 years', subjectId: 'hr-apprenticeship', whyItFits: 'Handling customers and colleagues on the shop floor gives you a head start on the people skills an HR apprenticeship builds on.' },
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '12-18 months', subjectId: 'cipd-level-5-hr', whyItFits: 'CIPD Level 5 turns your everyday experience managing customer relationships into formal people-management credentials.' },
      },
      'bookkeeper': {
        careerId: 74,
        careerTitle: 'Bookkeeper',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '1-2 years', subjectId: 'aat-professional-qualification', whyItFits: 'Cash handling and stock reconciliation have already given you a feel for accuracy with numbers, which AAT builds into a bookkeeping qualification.' },
      },
      'administrative-assistant': {
        careerId: 95,
        careerTitle: 'Administrative Assistant',
        viaApprenticeship: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'nvq-business-administration', whyItFits: 'Stock management and organising a shop floor are administrative skills in disguise - this apprenticeship formalises them for an office setting.' },
      },
    },
  },

  'retail-manager': {
    alternateCareers: {
      'business-analyst': {
        careerId: 11,
        careerTitle: 'Business Analyst',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1-2 years', subjectId: 'msc-management', whyItFits: 'Your operations experience and stakeholder management translate directly to business analysis.' },
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'prince2-project-management', whyItFits: 'Retail management is essentially project management with inventory and staff instead of software and deadlines.' },
      },
      'marketing-manager': {
        careerId: 15,
        careerTitle: 'Marketing Manager',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-marketing', whyItFits: 'Your customer-facing experience gives you deep insight into consumer behaviour and purchasing decisions.' },
      },
      'hr-officer': {
        careerId: 16,
        careerTitle: 'Human Resources Officer',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-human-resource-management', whyItFits: 'Managing retail staff gives you hands-on experience with recruitment, conflict resolution, and team development.' },
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '12-18 months', subjectId: 'cipd-level-5-hr', whyItFits: 'CIPD builds on your people-management experience with formal HR credentials.' },
      },
      'project-manager': {
        careerId: 14,
        careerTitle: 'Project Manager',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '3-6 months', subjectId: 'prince2-project-management', whyItFits: 'You already manage deadlines, budgets, and teams daily - PRINCE2 just formalises it.' },
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-management', whyItFits: 'Your operational leadership is a strong foundation for certified project management.' },
      },
      'management-consultant': {
        careerId: 18,
        careerTitle: 'Management Consultant',
        viaMasters: { difficulty: 'Hard', timeToSwitch: '1-2 years', subjectId: 'mba', whyItFits: 'Full P&L, staffing and operational responsibility for a store is exactly the kind of business experience an MBA and consulting firms build on.' },
      },
    },
  },

  'teacher': {
    alternateCareers: {
      'career-advisor': {
        careerId: 50,
        careerTitle: 'Career Advisor',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'ma-education', whyItFits: 'You already guide young people through decisions about their future - an MA Education sharpens that into a specialist advisory skill set.' },
      },
      'hr-officer': {
        careerId: 16,
        careerTitle: 'Human Resources Officer',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '12-18 months', subjectId: 'cipd-level-5-hr', whyItFits: 'Classroom behaviour management and staff training are close cousins of workplace people management.' },
      },
      'university-lecturer': {
        careerId: 49,
        careerTitle: 'University Lecturer',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1-2 years', subjectId: 'ma-education', whyItFits: 'Your subject expertise and experience designing lessons and presenting to a room translate directly to lecturing.' },
      },
      'psychologist': {
        careerId: 28,
        careerTitle: 'Psychologist',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-psychology-conversion', whyItFits: 'Years spent observing how students learn and behave give you a practical head start on psychological study.' },
      },
    },
  },

  'nurse': {
    alternateCareers: {
      'physiotherapist': {
        careerId: 25,
        careerTitle: 'Physiotherapist',
        viaProfessional: { difficulty: 'Hard', timeToSwitch: '2 years', subjectId: 'physiotherapy-pre-registration', whyItFits: 'Your clinical experience and patient-handling skills carry straight across into physiotherapy training.' },
      },
      'occupational-therapist': {
        careerId: 26,
        careerTitle: 'Occupational Therapist',
        viaProfessional: { difficulty: 'Hard', timeToSwitch: '2 years', subjectId: 'occupational-therapy-pre-registration', whyItFits: 'Person-centred care planning is central to both nursing and occupational therapy.' },
      },
      'psychologist': {
        careerId: 28,
        careerTitle: 'Psychologist',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-psychology-conversion', whyItFits: 'Your understanding of patients under stress and in crisis is a strong practical foundation for psychology.' },
      },
      'university-lecturer': {
        careerId: 49,
        careerTitle: 'University Lecturer',
        viaProfessional: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'pgce-further-education', whyItFits: 'Experienced nurses are in high demand teaching the next generation on health and social care courses.' },
      },
    },
  },

  'office-admin': {
    alternateCareers: {
      'hr-officer': {
        careerId: 16,
        careerTitle: 'Human Resources Officer',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '12-18 months', subjectId: 'cipd-level-5-hr', whyItFits: 'You already handle staff records, onboarding paperwork and internal communication - CIPD makes it official.' },
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-human-resource-management', whyItFits: 'Office administration gives direct exposure to the HR processes this MSc builds into a specialist career.' },
      },
      'bookkeeper': {
        careerId: 74,
        careerTitle: 'Bookkeeper',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '1-2 years', subjectId: 'aat-professional-qualification', whyItFits: 'Data entry and record-keeping are the daily habits bookkeeping is built on.' },
      },
      'accountant': {
        careerId: 12,
        careerTitle: 'Accountant',
        viaProfessional: { difficulty: 'Hard', timeToSwitch: '2-4 years', subjectId: 'acca-accounting', whyItFits: 'Strong administrative accuracy and software skills are the foundation ACCA study builds on.' },
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-3 years', subjectId: 'accounting-apprenticeship-aat', whyItFits: 'You already work with numbers and systems daily - this apprenticeship turns that into a recognised accounting qualification.' },
      },
      'business-analyst': {
        careerId: 11,
        careerTitle: 'Business Analyst',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1-2 years', subjectId: 'msc-management', whyItFits: 'Process-driven admin work and software confidence are exactly what business analysis is built on.' },
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'prince2-project-management', whyItFits: 'Coordinating schedules, systems and people is project management in miniature.' },
      },
    },
  },

  'engineer': {
    alternateCareers: {
      'project-manager': {
        careerId: 14,
        careerTitle: 'Project Manager',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '3-6 months', subjectId: 'prince2-project-management', whyItFits: 'Technical projects already run on planning, risk and stakeholder management - PRINCE2 formalises the skills you use daily.' },
      },
      'renewable-energy-engineer': {
        careerId: 93,
        careerTitle: 'Renewable Energy Engineer',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-renewable-energy-engineering', whyItFits: 'Your existing engineering fundamentals transfer directly into the fast-growing renewables sector.' },
      },
      'management-consultant': {
        careerId: 18,
        careerTitle: 'Management Consultant',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1-2 years', subjectId: 'mba', whyItFits: 'Technical analysis and structured problem-solving are exactly what consulting firms look for in engineering hires.' },
      },
      'quantity-surveyor': {
        careerId: 37,
        careerTitle: 'Quantity Surveyor',
        viaProfessional: { difficulty: 'Medium', timeToSwitch: '2 years', subjectId: 'rics-chartered-surveyor', whyItFits: 'Your design and technical analysis background suits cost and contract management on construction projects.' },
      },
    },
  },

  'hospitality': {
    alternateCareers: {
      'event-manager': {
        careerId: 87,
        careerTitle: 'Event Manager',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-3 years', subjectId: 'hotel-management-apprenticeship', whyItFits: 'Juggling guests, staff and operations under pressure is exactly what event and hotel management apprenticeships build on.' },
      },
      'hr-officer': {
        careerId: 16,
        careerTitle: 'Human Resources Officer',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '12-18 months', subjectId: 'cipd-level-5-hr', whyItFits: 'Staff scheduling and conflict resolution on shift are day-to-day HR skills in practice.' },
      },
      'sales-manager': {
        careerId: 17,
        careerTitle: 'Sales Manager',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'cim-marketing', whyItFits: 'Upselling and building repeat custom in hospitality is sales experience most sales-manager candidates don’t have.' },
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-marketing', whyItFits: 'You already understand what makes guests come back - this builds it into strategic marketing skill.' },
      },
      'project-manager': {
        careerId: 14,
        careerTitle: 'Project Manager',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'prince2-project-management', whyItFits: 'Running a busy shift or event is project management with a very tight deadline.' },
      },
    },
  },

  'construction': {
    alternateCareers: {
      'quantity-surveyor': {
        careerId: 37,
        careerTitle: 'Quantity Surveyor',
        viaProfessional: { difficulty: 'Medium', timeToSwitch: '2 years', subjectId: 'rics-chartered-surveyor', whyItFits: 'On-site experience with materials, timelines and costs is the foundation quantity surveying is built on.' },
      },
      'civil-engineer': {
        careerId: 31,
        careerTitle: 'Civil Engineer',
        viaMasters: { difficulty: 'Hard', timeToSwitch: '2-3 years', subjectId: 'msc-civil-engineering', whyItFits: 'Hands-on knowledge of how structures actually get built gives you a practical grounding most engineering students don’t have.' },
      },
      'renewable-energy-engineer': {
        careerId: 93,
        careerTitle: 'Renewable Energy Engineer',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-4 years', subjectId: 'nvq-electrical-installation', whyItFits: 'Site experience is the ideal starting point for an electrical qualification leading into renewable energy installation and engineering.' },
        viaMasters: { difficulty: 'Hard', timeToSwitch: '2-3 years', subjectId: 'msc-renewable-energy-engineering', whyItFits: 'Your construction background gives you a practical understanding of large-scale installation that classroom-only engineers lack.' },
      },
      'project-manager': {
        careerId: 14,
        careerTitle: 'Project Manager',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'prince2-project-management', whyItFits: 'You already coordinate trades, timelines and site safety - PRINCE2 turns that into a formal qualification.' },
      },
    },
  },

  'sales': {
    alternateCareers: {
      'sales-manager': {
        careerId: 17,
        careerTitle: 'Sales Manager',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'cim-marketing', whyItFits: 'A strong track record hitting targets is the clearest possible case for stepping up to managing a sales team.' },
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-marketing', whyItFits: 'Understanding what drives a customer to buy translates directly into leading a sales function.' },
      },
      'marketing-manager': {
        careerId: 15,
        careerTitle: 'Marketing Manager',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-marketing', whyItFits: 'Persuasion and relationship-building skills transfer directly into brand and campaign strategy.' },
      },
      'business-analyst': {
        careerId: 11,
        careerTitle: 'Business Analyst',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1-2 years', subjectId: 'msc-management', whyItFits: 'Understanding client needs and negotiating outcomes builds exactly the stakeholder skills business analysts rely on.' },
      },
      'management-consultant': {
        careerId: 18,
        careerTitle: 'Management Consultant',
        viaMasters: { difficulty: 'Hard', timeToSwitch: '1-2 years', subjectId: 'mba', whyItFits: 'A strong record of hitting targets and building client relationships is exactly what consulting firms recruit for.' },
      },
    },
  },

  'military': {
    alternateCareers: {
      'project-manager': {
        careerId: 14,
        careerTitle: 'Project Manager',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '3-6 months', subjectId: 'prince2-project-management', whyItFits: 'Military logistics and structured leadership map almost directly onto formal project management methodology.' },
      },
      'police-public-services-officer': {
        careerId: 90,
        careerTitle: 'Police & Public Services Officer',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-3 years', subjectId: 'police-apprenticeship', whyItFits: 'Discipline, teamwork and staying calm in a crisis are core to both military and policing careers.' },
      },
      'management-consultant': {
        careerId: 18,
        careerTitle: 'Management Consultant',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1-2 years', subjectId: 'mba', whyItFits: 'Leadership under pressure and structured problem-solving are highly valued by consulting firms.' },
      },
      'cyber-security-analyst': {
        careerId: 3,
        careerTitle: 'Cyber Security Analyst',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-4 years', subjectId: 'cyber-security-apprenticeship', whyItFits: 'A background in structured, high-stakes operations and information security suits a move into cyber security.' },
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-cyber-security', whyItFits: 'Discipline and an eye for risk carry over well into defending systems and data.' },
      },
    },
  },

  'warehouse': {
    alternateCareers: {
      'project-manager': {
        careerId: 14,
        careerTitle: 'Project Manager',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'prince2-project-management', whyItFits: 'Coordinating stock, deadlines and a team is project management by another name.' },
      },
      'mechanical-engineer': {
        careerId: 32,
        careerTitle: 'Mechanical Engineer',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-4 years', subjectId: 'mechanical-engineering-apprenticeship', whyItFits: 'Hands-on equipment and machinery experience gives you a practical grounding most engineering apprentices start without.' },
      },
      'administrative-assistant': {
        careerId: 95,
        careerTitle: 'Administrative Assistant',
        viaApprenticeship: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'nvq-business-administration', whyItFits: 'Inventory systems and organisation skills translate well into an office administration role.' },
      },
      'bookkeeper': {
        careerId: 74,
        careerTitle: 'Bookkeeper',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '1-2 years', subjectId: 'aat-professional-qualification', whyItFits: 'Stock and inventory tracking builds exactly the numeracy and record-keeping habits bookkeeping relies on.' },
      },
    },
  },

  'call-centre': {
    alternateCareers: {
      'hr-officer': {
        careerId: 16,
        careerTitle: 'Human Resources Officer',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '12-18 months', subjectId: 'cipd-level-5-hr', whyItFits: 'Handling difficult calls and resolving conflict daily builds transferable HR and employee-relations skills.' },
      },
      'care-assistant': {
        careerId: 73,
        careerTitle: 'Care Assistant',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '1-2 years', subjectId: 'healthcare-assistant-apprenticeship', whyItFits: 'Patience, active listening and staying calm with distressed callers transfer well into care work.' },
      },
      'virtual-assistant': {
        careerId: 72,
        careerTitle: 'Virtual Assistant',
        viaApprenticeship: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'customer-service-apprenticeship', whyItFits: 'Builds directly on the customer service, data entry and communication skills you already use every shift.' },
      },
      'sales-manager': {
        careerId: 17,
        careerTitle: 'Sales Manager',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'cim-marketing', whyItFits: 'Outbound and retention calls are sales experience in disguise - this route turns it into a leadership qualification.' },
      },
    },
  },

  'chef': {
    alternateCareers: {
      'event-manager': {
        careerId: 87,
        careerTitle: 'Event Manager',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-3 years', subjectId: 'hotel-management-apprenticeship', whyItFits: 'Running a busy kitchen under pressure is the same skill set as running events and hospitality venues.' },
      },
      'university-lecturer': {
        careerId: 49,
        careerTitle: 'University Lecturer',
        viaProfessional: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'pgce-further-education', whyItFits: 'Experienced chefs are in demand teaching the next generation on catering and hospitality courses.' },
      },
      'hr-officer': {
        careerId: 16,
        careerTitle: 'Human Resources Officer',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '12-18 months', subjectId: 'cipd-level-5-hr', whyItFits: 'Running a kitchen team under pressure builds real, practical people-management experience.' },
      },
      'project-manager': {
        careerId: 14,
        careerTitle: 'Project Manager',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'prince2-project-management', whyItFits: 'Multitasking a busy service against the clock is project management with a very short deadline.' },
      },
    },
  },

  'driver': {
    alternateCareers: {
      'administrative-assistant': {
        careerId: 95,
        careerTitle: 'Administrative Assistant',
        viaApprenticeship: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'nvq-business-administration', whyItFits: 'Route-planning and scheduling discipline translates well into organised office administration work.' },
      },
      'customer-service-advisor': {
        careerId: 75,
        careerTitle: 'Customer Service Advisor',
        viaApprenticeship: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'customer-service-apprenticeship', whyItFits: 'You already deliver good service to every customer on your round - this builds on that directly.' },
      },
      'project-manager': {
        careerId: 14,
        careerTitle: 'Project Manager',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'prince2-project-management', whyItFits: 'Coordinating routes, timings and deliveries mirrors the planning discipline of project management.' },
      },
      'police-public-services-officer': {
        careerId: 90,
        careerTitle: 'Police & Public Services Officer',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-3 years', subjectId: 'police-apprenticeship', whyItFits: 'Reliability, calm decision-making on the road and public-facing conduct align well with policing.' },
      },
    },
  },

  'cleaner': {
    alternateCareers: {
      'care-assistant': {
        careerId: 73,
        careerTitle: 'Care Assistant',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '1-2 years', subjectId: 'healthcare-assistant-apprenticeship', whyItFits: 'Reliability and attention to detail are core to both facilities and care work, and healthcare assistant roles welcome career changers.' },
      },
      'administrative-assistant': {
        careerId: 95,
        careerTitle: 'Administrative Assistant',
        viaApprenticeship: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'nvq-business-administration', whyItFits: 'The same organisation and reliability that makes a strong facilities worker supports a move into admin.' },
      },
      'construction-trades-worker': {
        careerId: 89,
        careerTitle: 'Construction Trades Worker',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-3 years', subjectId: 'btec-construction', whyItFits: 'Hands-on, practical facilities experience is a solid base for construction and building-maintenance trades.' },
      },
      'nurse': {
        careerId: 22,
        careerTitle: 'Nurse',
        viaProfessional: { difficulty: 'Hard', timeToSwitch: '2-3 years', subjectId: 'nursing-conversion', whyItFits: 'Reliable, detail-focused facilities and care-adjacent work is a realistic starting point for an accelerated nursing programme.' },
      },
    },
  },

  'security': {
    alternateCareers: {
      'police-public-services-officer': {
        careerId: 90,
        careerTitle: 'Police & Public Services Officer',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-3 years', subjectId: 'police-apprenticeship', whyItFits: 'Observation, conflict resolution and staying calm under pressure are exactly what policing recruiters look for.' },
      },
      'cyber-security-analyst': {
        careerId: 3,
        careerTitle: 'Cyber Security Analyst',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-4 years', subjectId: 'cyber-security-apprenticeship', whyItFits: 'A security mindset - watching for threats and responding calmly to incidents - transfers conceptually from physical to digital security.' },
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-cyber-security', whyItFits: 'Your vigilance and incident-response experience is a strong practical foundation for cyber security study.' },
      },
      'administrative-assistant': {
        careerId: 95,
        careerTitle: 'Administrative Assistant',
        viaApprenticeship: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'nvq-business-administration', whyItFits: 'Shift reports, incident logging and site administration build transferable office skills.' },
      },
    },
  },

  'beauty': {
    alternateCareers: {
      'sales-manager': {
        careerId: 17,
        careerTitle: 'Sales Manager',
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '6-12 months', subjectId: 'cim-marketing', whyItFits: 'Upselling treatments and products builds real sales experience that transfers into a sales leadership role.' },
      },
      'social-media-manager': {
        careerId: 44,
        careerTitle: 'Social Media Manager',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-marketing', whyItFits: 'Beauty professionals often already run their own social media and build a client base online - this formalises that skill.' },
      },
      'graphic-designer': {
        careerId: 39,
        careerTitle: 'Graphic Designer',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'ma-graphic-design', whyItFits: 'An eye for style, colour and presentation transfers directly into visual design work.' },
      },
      'event-manager': {
        careerId: 87,
        careerTitle: 'Event Manager',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-3 years', subjectId: 'hotel-management-apprenticeship', whyItFits: 'Client-facing service and attention to detail suit running events and hospitality venues.' },
      },
    },
  },

  'social-care': {
    alternateCareers: {
      'nurse': {
        careerId: 22,
        careerTitle: 'Nurse',
        viaProfessional: { difficulty: 'Hard', timeToSwitch: '2 years', subjectId: 'nursing-conversion', whyItFits: 'Safeguarding and care-planning experience is exactly the foundation accelerated nursing programmes are designed for.' },
      },
      'psychologist': {
        careerId: 28,
        careerTitle: 'Psychologist',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-psychology-conversion', whyItFits: 'Your understanding of human behaviour and safeguarding practice gives you a genuine head start into psychology.' },
      },
      'occupational-therapist': {
        careerId: 26,
        careerTitle: 'Occupational Therapist',
        viaProfessional: { difficulty: 'Hard', timeToSwitch: '2 years', subjectId: 'occupational-therapy-pre-registration', whyItFits: 'Person-centred care experience is directly relevant to occupational therapy training.' },
      },
      'career-advisor': {
        careerId: 50,
        careerTitle: 'Career Advisor',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'ma-education', whyItFits: 'Supporting vulnerable people towards positive outcomes mirrors the guidance work of a career advisor.' },
      },
    },
  },

  'banking': {
    alternateCareers: {
      'accountant': {
        careerId: 12,
        careerTitle: 'Accountant',
        viaProfessional: { difficulty: 'Medium', timeToSwitch: '2-4 years', subjectId: 'acca-accounting', whyItFits: 'Numeracy and compliance experience from banking is the exact foundation ACCA study builds on.' },
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-3 years', subjectId: 'accounting-apprenticeship-aat', whyItFits: 'You already work with financial systems daily - this apprenticeship turns that into a recognised qualification.' },
      },
      'financial-advisor': {
        careerId: 13,
        careerTitle: 'Financial Advisor',
        viaProfessional: { difficulty: 'Hard', timeToSwitch: '2-4 years', subjectId: 'cfa-finance', whyItFits: 'Existing product knowledge and compliance experience from banking gives you a head start into financial advice.' },
      },
      'business-analyst': {
        careerId: 11,
        careerTitle: 'Business Analyst',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-finance', whyItFits: 'Strong numerical and analytical skills from banking translate directly into financial and business analysis.' },
      },
      'insurance-underwriter': {
        careerId: 20,
        careerTitle: 'Insurance Underwriter',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-finance', whyItFits: 'Attention to detail and compliance knowledge from banking directly supports assessing and pricing risk.' },
      },
    },
  },

  'it-support': {
    alternateCareers: {
      'cyber-security-analyst': {
        careerId: 3,
        careerTitle: 'Cyber Security Analyst',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-4 years', subjectId: 'cyber-security-apprenticeship', whyItFits: 'Troubleshooting and systems knowledge is the exact foundation cyber security roles are built on.' },
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-cyber-security', whyItFits: 'You already think in terms of systems and vulnerabilities - this route makes it your specialism.' },
      },
      'network-engineer': {
        careerId: 6,
        careerTitle: 'Network Engineer',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-4 years', subjectId: 'network-engineer-apprenticeship', whyItFits: 'Your day-to-day networking basics scale up directly into a dedicated network engineering role.' },
      },
      'software-developer': {
        careerId: 1,
        careerTitle: 'Software Developer',
        viaApprenticeship: { difficulty: 'Medium', timeToSwitch: '2-4 years', subjectId: 'software-development-apprenticeship', whyItFits: 'Technical troubleshooting and existing software skills are a strong base for learning to build software.' },
        viaProfessional: { difficulty: 'Easy', timeToSwitch: '3-6 months', subjectId: 'coding-bootcamp-software-development', whyItFits: 'A fast, intensive route to prove you can code, building on the technical problem-solving you already do.' },
      },
      'devops-engineer': {
        careerId: 61,
        careerTitle: 'DevOps Engineer',
        viaMasters: { difficulty: 'Medium', timeToSwitch: '1 year', subjectId: 'msc-software-engineering', whyItFits: 'Your systems, networking and troubleshooting knowledge translates well into DevOps practice.' },
      },
    },
  },
}

export default { currentRoles, careerSwitchMap }
