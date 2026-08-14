// Career Smasher's job-skill tree data. One source of truth: which skills
// each career needs (careerId -> skill names). The reverse map (skill ->
// which careers need it, what the tree actually branches out through) is
// DERIVED from this by inversion (see getSkillToCareerIds() in
// src/utils/skillTree.ts), not hand-authored as a second file - a
// hand-written skill->careers map would drift out of sync with this one the
// first time either gets edited without the other, and the "if a skill is
// in a career's list, that career must appear in the skill's related-careers
// list" rule the tree depends on would only be a promise, not a guarantee.
// Deriving it means that rule can't ever be broken.
//
// Skill names are real and specific (SQL, Figma, Blueprint Reading, Adobe
// Suite - not generic placeholders), but still deliberately REUSED across
// several careers wherever the real-world skill genuinely is shared - that
// overlap is what makes the tree branch to DIFFERENT careers when you
// expand a skill node (e.g. "Patient Care" fans out across Nurse, Doctor,
// Paramedic, Midwife, ...; "Leadership" fans out across senior roles in
// completely different categories) instead of every skill leading straight
// back to just the one career that introduced it. A handful of skills are
// intentionally near-unique to one specialist career (e.g. "Aerodynamics",
// "Piloting") because that's just true to the real job - expanding one of
// those hits the tree's "No related careers found" empty state, which is
// the same real state the UI already handles for skills that happen to
// have no other match yet.

// The cross-cutting skills reused across many DIFFERENT categories, not
// just within one domain - these are what make the tree jump from, say, a
// tech career into a completely unrelated one a couple of hops later. This
// list is documentation of that shared pool, not an exhaustive vocabulary -
// most careers below also carry domain-specific skills that aren't in it.
export const CANONICAL_SKILLS = [
  'Communication',
  'Problem Solving',
  'Attention to Detail',
  'Critical Thinking',
  'Creativity',
  'Leadership',
  'Organisation',
  'Research',
  'Customer Service',
  'Time Management',
  'Empathy',
  'Decision Making',
  'Teamwork',
  'Public Speaking',
  'Negotiation',
  'Risk Assessment',
  'Strategic Planning',
  'Budgeting',
  'Project Management',
  'Physical Fitness',
]

// careerId -> 4-6 skills, each reasoned from what that specific role
// actually demands (not auto-generated) - see the category-grouped comments
// below for the reasoning trail.
export const CAREER_SKILLS = {
  // Technology & Digital
  1: ['Coding', 'Problem Solving', 'Git', 'Agile', 'Testing', 'System Design'],
  2: ['SQL', 'Statistics', 'Data Analysis', 'Python', 'Data Visualization', 'Critical Thinking'],
  3: ['Networking', 'Risk Assessment', 'Linux', 'Incident Response', 'Compliance'],
  4: ['User Research', 'Wireframing', 'Figma', 'Prototyping', 'Accessibility', 'Creativity'],
  5: ['Networking', 'Problem Solving', 'Customer Service', 'Documentation'],
  6: ['Networking', 'Linux', 'Cloud Computing', 'Problem Solving', 'Attention to Detail'],
  7: ['System Design', 'Cloud Computing', 'Networking', 'Strategic Planning', 'Problem Solving'],
  8: ['Python', 'Machine Learning', 'Statistics', 'Mathematics', 'Problem Solving'],
  9: ['Coding', 'Git', 'Testing', 'Accessibility', 'Creativity'],
  10: ['Coding', 'Creativity', 'Storytelling', 'Testing', 'Problem Solving'],
  61: ['Git', 'Automation', 'Cloud Computing', 'Testing', 'Problem Solving'],
  62: ['SQL', 'Database Design', 'Attention to Detail', 'Risk Assessment'],
  63: ['Coding', 'Cryptography', 'Problem Solving', 'Mathematics'],
  64: ['Penetration Testing', 'Linux', 'Networking', 'Risk Assessment', 'Critical Thinking'],
  65: ['Forensic Analysis', 'Attention to Detail', 'Critical Thinking', 'Incident Response'],
  66: ['Cloud Computing', 'Networking', 'Incident Response', 'Compliance', 'Risk Assessment'],
  67: ['Automation', 'System Design', 'Linux', 'Problem Solving', 'Testing'],
  68: ['Coding', 'Mobile Development', 'Testing', 'Creativity', 'Problem Solving'],
  69: ['SQL', 'Requirements Analysis', 'Critical Thinking', 'Documentation'],
  70: ['Technical Writing', 'Research', 'Attention to Detail', 'Documentation'],
  99: ['Leadership', 'Strategic Planning', 'Budgeting', 'Vendor Management', 'Decision Making'],
  109: ['Agile', 'Project Management', 'Organisation', 'Leadership', 'Time Management'],
  114: ['Python', 'Mathematics', 'Statistics', 'Coding', 'Critical Thinking'],
  115: ['Risk Assessment', 'Compliance', 'Leadership', 'Incident Response', 'Strategic Planning'],
  116: ['Leadership', 'Agile', 'System Design', 'Project Management', 'Teamwork'],
  124: ['Leadership', 'Strategic Planning', 'System Design', 'Budgeting', 'Decision Making'],

  // Business & Finance
  11: ['SQL', 'Requirements Analysis', 'Data Visualization', 'Data Analysis', 'Critical Thinking', 'Communication'],
  12: ['Excel', 'Attention to Detail', 'Tax Knowledge', 'Financial Reporting', 'Analysis'],
  13: ['Financial Modeling', 'Negotiation', 'Client Relations', 'Communication', 'Financial Literacy'],
  14: ['Project Management', 'Organisation', 'Leadership', 'Budgeting', 'Time Management'],
  15: ['Strategic Planning', 'Analytics', 'Copywriting', 'Social Media', 'Budgeting', 'Creativity'],
  16: ['Recruitment', 'Interviewing', 'Employment Law', 'Communication', 'Empathy'],
  17: ['Sales', 'Negotiation', 'Leadership', 'Communication'],
  18: ['Strategic Planning', 'Problem Solving', 'Research', 'Presentation', 'Critical Thinking'],
  19: ['Financial Modeling', 'Excel', 'Negotiation', 'Market Analysis', 'Risk Assessment', 'Presentation'],
  20: ['Risk Assessment', 'Attention to Detail', 'Financial Modeling', 'Compliance'],
  71: ['Data Entry', 'Attention to Detail', 'Organisation', 'Time Management'],
  72: ['Organisation', 'Scheduling', 'Time Management', 'Communication', 'Multitasking'],
  74: ['Excel', 'Financial Reporting', 'Attention to Detail', 'Organisation'],
  75: ['Customer Service', 'Communication', 'Empathy', 'Problem Solving'],
  92: ['Legal Research', 'Contract Law', 'Writing', 'Critical Thinking'],
  95: ['Organisation', 'Scheduling', 'Time Management', 'Attention to Detail'],
  97: ['Leadership', 'Strategic Planning', 'Decision Making', 'Public Speaking', 'Budgeting'],
  98: ['Strategic Planning', 'Leadership', 'Copywriting', 'Analytics', 'Creativity'],
  102: ['Financial Modeling', 'Financial Reporting', 'Leadership', 'Budgeting', 'Strategic Planning'],
  104: ['Public Speaking', 'Copywriting', 'Strategic Planning', 'Crisis Management'],
  111: ['Market Analysis', 'Financial Modeling', 'Negotiation', 'Risk Assessment', 'Decision Making'],
  112: ['Statistics', 'Mathematics', 'Risk Assessment', 'Excel', 'Critical Thinking'],
  121: ['Sales', 'Leadership', 'Negotiation', 'Strategic Planning', 'Public Speaking'],
  122: ['Financial Modeling', 'Leadership', 'Strategic Planning', 'Budgeting', 'Forecasting'],
  123: ['Tax Knowledge', 'Compliance', 'Financial Reporting', 'Leadership', 'Attention to Detail'],

  // Healthcare & Medicine
  21: ['Diagnosis', 'Anatomy', 'Patient Care', 'Decision Making', 'Prescribing', 'Stress Management'],
  22: ['Patient Care', 'Medical Knowledge', 'Communication', 'Empathy', 'Attention to Detail', 'Infection Control'],
  23: ['Emergency Response', 'Patient Care', 'Decision Making', 'Physical Fitness', 'First Aid'],
  24: ['Medication Management', 'Attention to Detail', 'Patient Care', 'Prescribing', 'Communication'],
  25: ['Rehabilitation', 'Patient Care', 'Anatomy', 'Empathy', 'Problem Solving'],
  26: ['Rehabilitation', 'Patient Care', 'Empathy', 'Problem Solving', 'Creativity'],
  27: ['Surgical Skills', 'Anatomy', 'Patient Care', 'Precision Work', 'Attention to Detail'],
  28: ['Counselling', 'Empathy', 'Active Listening', 'Critical Thinking', 'Research'],
  29: ['Precision Work', 'Patient Care', 'Attention to Detail', 'Medical Knowledge'],
  30: ['Patient Care', 'Empathy', 'Decision Making', 'Infection Control', 'First Aid'],
  73: ['Patient Care', 'Empathy', 'Manual Handling', 'Record Keeping', 'Physical Fitness'],
  100: ['Diagnosis', 'Patient Care', 'Leadership', 'Decision Making', 'Anatomy'],
  108: ['Leadership', 'Strategic Planning', 'Budgeting', 'Organisation', 'Patient Care'],
  117: ['Surgical Skills', 'Anatomy', 'Precision Work', 'Decision Making', 'Patient Care'],
  118: ['Surgical Skills', 'Precision Work', 'Anatomy', 'Attention to Detail', 'Patient Care'],
  119: ['Surgical Skills', 'Diagnosis', 'Precision Work', 'Patient Care', 'Attention to Detail'],
  120: ['Patient Care', 'Precision Work', 'Decision Making', 'Stress Management', 'Anatomy'],

  // Engineering & Manufacturing
  31: ['Engineering Design', 'Blueprint Reading', 'Mathematics', 'Site Surveying', 'Project Management'],
  32: ['Engineering Design', 'CAD Software', 'Mathematics', 'Problem Solving', 'Materials Science'],
  33: ['Engineering Design', 'Mathematics', 'CAD Software', 'Problem Solving', 'Attention to Detail'],
  34: ['Engineering Design', 'Aerodynamics', 'Mathematics', 'Precision Work', 'CAD Software'],
  35: ['Engineering Design', 'Chemical Processes', 'Scientific Method', 'Risk Assessment', 'Problem Solving'],
  36: ['Design', 'Engineering Design', 'CAD Software', 'Creativity', 'Project Management'],
  37: ['Cost Estimating', 'Mathematics', 'Budgeting', 'Attention to Detail', 'Site Surveying'],
  38: ['CAD Software', 'Blueprint Reading', 'Precision Work', 'Attention to Detail'],
  93: ['Engineering Design', 'Renewable Systems', 'Scientific Method', 'Project Management', 'Problem Solving'],
  101: ['Piloting', 'Decision Making', 'Attention to Detail', 'Air Traffic Rules', 'Stress Management'],
  107: ['Leadership', 'Risk Assessment', 'Strategic Planning', 'Budgeting', 'Safety Regulations'],

  // Creative & Media
  39: ['Adobe Suite', 'Typography', 'Color Theory', 'Creativity', 'Client Relations', 'Branding'],
  40: ['Video Editing', 'Storyboarding', 'Creativity', 'Attention to Detail', 'Adobe Suite'],
  41: ['Composition', 'Lighting', 'Photo Editing', 'Client Relations', 'Creativity'],
  42: ['Animation Software', 'Storyboarding', 'Creativity', 'Color Theory', 'Attention to Detail'],
  43: ['Writing', 'Creativity', 'Storytelling', 'Research', 'Copywriting'],
  44: ['Social Media', 'Copywriting', 'Analytics', 'Creativity', 'Strategic Planning'],
  45: ['Leadership', 'Storytelling', 'Project Management', 'Budgeting', 'Creativity'],
  76: ['Writing', 'Research', 'Creativity', 'Digital Publishing', 'Storytelling'],
  96: ['Writing', 'Research', 'Interviewing', 'Storytelling', 'Fact Checking'],

  // Education & Training
  46: ['Teaching', 'Lesson Planning', 'Classroom Management', 'Child Development', 'Empathy'],
  47: ['Teaching', 'Subject Knowledge', 'Lesson Planning', 'Classroom Management', 'Public Speaking', 'Assessment'],
  48: ['Teaching', 'Classroom Management', 'Child Development', 'Communication', 'Behaviour Support'],
  49: ['Teaching', 'Subject Knowledge', 'Research', 'Public Speaking', 'Mentoring', 'Assessment'],
  50: ['Active Listening', 'Empathy', 'Research', 'Interviewing', 'Mentoring', 'Counselling'],
  105: ['Leadership', 'Strategic Planning', 'Curriculum Design', 'Organisation', 'Decision Making'],

  // Service & Hospitality
  77: ['Customer Service', 'Organisation', 'Multitasking', 'Communication'],
  79: ['Customer Service', 'Creativity', 'Manual Dexterity', 'Attention to Detail'],
  86: ['Cooking Techniques', 'Time Management', 'Creativity', 'Food Hygiene', 'Stock Control', 'Teamwork'],
  87: ['Event Planning', 'Organisation', 'Vendor Coordination', 'Negotiation', 'Multitasking'],
  94: ['Sales', 'Leadership', 'Stock Control', 'Customer Service', 'Cash Handling', 'Merchandising'],

  // Agriculture & Animal Care
  82: ['Animal Handling', 'Empathy', 'Physical Fitness', 'Attention to Detail'],
  83: ['Livestock Management', 'Land Management', 'Machinery Operation', 'Physical Fitness', 'Problem Solving'],
  84: ['Plant Care', 'Land Management', 'Attention to Detail', 'Scientific Method', 'Creativity'],
  85: ['Animal Handling', 'Patient Care', 'Empathy', 'Attention to Detail', 'Manual Dexterity'],

  // Sport & Leisure
  88: ['Coaching', 'Physical Fitness', 'Motivation', 'Teaching', 'Leadership'],

  // Construction & Trades
  89: ['Manual Dexterity', 'Tool Handling', 'Health & Safety', 'Blueprint Reading', 'Physical Fitness'],
  113: ['Project Management', 'Leadership', 'Budgeting', 'Site Management', 'Risk Assessment'],

  // Public Services
  90: ['Conflict Resolution', 'Law Enforcement', 'Physical Fitness', 'Decision Making', 'Emergency Response'],
  103: ['Vehicle Operation', 'Attention to Detail', 'Decision Making', 'Time Management'],
  106: ['Leadership', 'Conflict Resolution', 'Decision Making', 'Strategic Planning', 'Law Enforcement'],
  110: ['Legal Research', 'Contract Law', 'Writing', 'Negotiation', 'Critical Thinking'],

  // Science & Research
  91: ['Scientific Method', 'Lab Techniques', 'Data Analysis', 'Research', 'Critical Thinking'],
}
