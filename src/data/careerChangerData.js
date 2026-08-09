// Career Changer data layer for the 3-step flow (current job -> preferences
// -> results).
//
// `currentRoles` — the "what do you do now?" list shown in Step 1. Just
// id + title; the actual transferable skills for each job live in
// `currentJobSkills` below (hardSkills/softSkills, richer than a flat list).
//
// `currentJobSkills` — hard/soft skills for every Step 1 job option,
// keyed by `currentRoles[].id`. 'unemployed' intentionally carries little
// data - there's nothing real to claim there. These are compared directly
// against every career's own hardSkills/softSkills in demoCareers2.js to
// rank matches on CareerChangerResultsPage.tsx - see that page for the
// scoring logic.
//
// This file used to also carry `careerSkillRequirements` (skills for a
// curated ~33-career subset) and `careerSwitchMap` (a hand-authored
// current-job -> alternate-careers list with per-route difficulty/time/
// copy). Both were removed once demoCareers2.js grew hardSkills/softSkills
// on all 83 careers: matching is now computed generically against the full
// library instead of a small curated list, which made the old hand-authored
// data fully redundant - every consumer of it was in
// CareerChangerResultsPage.tsx, and nothing else in the app ever imported
// it.

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
