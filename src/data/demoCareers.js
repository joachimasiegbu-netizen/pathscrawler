const rawDemoCareers = [
  {
    id: 1,
    employmentPercentage: 1.7625, // SOC 2134: Programmers and software development professionals
    category: 'Technology & Digital',
    title: 'Software Developer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£25k - £70k',
    description: 'Build applications, solve technical problems and write clean code across web and mobile platforms.',
    requirements: [
      'Degree in computing or related field',
      'Strong programming skills',
      'Portfolio of projects',
      'GCSE Maths and Computer Science',
    ],
    matchedSubjects: [
      'msc-computer-science',
      'computer-science-bsc',
      'alevel-compsci',
      'gcse-computer-science',
      'btec-it',
      'cyber-security-apprenticeship',
      'software-development-apprenticeship',
      'network-engineer-apprenticeship',
      'software-engineering-bsc',
      'cyber-security-bsc',
      'computer-forensics-bsc',
      'web-development-bsc',
      'game-development-bsc',
      'network-engineering-bsc',
      'functional-skills-maths-entry-1',
      'functional-skills-maths-entry-2',
      'functional-skills-maths-level-1',
      'functional-skills-maths-level-2',
      'gcse-maths-refugee',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Write, test and improve software or technical solutions',
      'Fix issues and update systems with user feedback',
      'Collaborate with colleagues, designers and managers',
      'Research new tools, languages and best practices',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=software+developer', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=software+developer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=software+developer', description: 'Business & tech skills' },
    ],
    progression: [
      'Developer Apprentice / Junior (Entry (£18k-£30k))',
      'Developer (Mid-level (£30k-£50k))',
      'Senior Developer (Senior (£45k-£70k))',
      'Lead Developer / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      2,
      3,
      4,
      5,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'cyber-security-apprenticeship',
          'software-development-apprenticeship',
          'network-engineer-apprenticeship',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Software Developer.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-compsci',
          'btec-it',
          'software-engineering-bsc',
          'cyber-security-bsc',
          'computer-forensics-bsc',
          'web-development-bsc',
          'game-development-bsc',
          'network-engineering-bsc',
          'nanotechnology-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a Software Developer.',
      },
    ]
  },
  {
    id: 2,
    employmentPercentage: 0.3683, // SOC 3544: Data analysts
    category: 'Technology & Digital',
    title: 'Data Analyst',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£28k - £55k',
    description: 'Use data to uncover insights, build reports and support decisions with analytics tools.',
    requirements: [
      'Degree or bootcamp in data/analytics',
      'Excel and SQL experience',
      'Strong numerical skills',
      'GCSE Maths and A-Level Maths',
    ],
    matchedSubjects: [
      'msc-computer-science',
      'msc-data-science',
      'computer-science-bsc',
      'alevel-mathematics',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Collect and analyse data from multiple sources',
      'Build reports and dashboards for teams',
      'Interpret trends and share insights',
      'Work with stakeholders to improve decisions',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=data+analyst', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=data+analyst', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=data+analyst', description: 'Business & tech skills' },
    ],
    progression: [
      'Junior Data Analyst (£28k-£35k)',
      'Data Analyst (£35k-£50k)',
      'Senior Data Analyst (£50k-£65k)',
      'Analytics Lead (£65k+)',
    ],
    similarCareers: [
      8,
      63,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-mathematics',
          'alevel-economics',
        ],
        description: 'Study full-time for a degree that leads into a career as a Data Analyst.',
      },
    ]
  },
  {
    id: 3,
    employmentPercentage: 0.2056, // SOC 2135: Cyber security professionals
    category: 'Technology & Digital',
    title: 'Cyber Security Analyst',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£30k - £65k',
    description: 'Protect systems from attacks, monitor networks and respond to security incidents.',
    requirements: [
      'Degree or security certifications',
      'Understanding of networks',
      'Attention to detail',
      'GCSE Computer Science',
    ],
    matchedSubjects: [
      'msc-cyber-security',
      'computer-science-bsc',
      'gcse-computer-science',
      'alevel-compsci',
      'tlevel-digital-support-services',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'btec-computing',
    ],
    dayToDay: [
      'Monitor security alerts and investigate incidents',
      'Test systems for vulnerabilities and patch issues',
      'Analyse logs and report on risk',
      'Work with teams to improve security controls',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=cyber+security+analyst', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=cyber+security+analyst', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=cyber+security+analyst', description: 'Business & tech skills' },
    ],
    progression: [
      'Junior Cyber Security Analyst (£30k-£40k)',
      'Cyber Security Analyst (£40k-£55k)',
      'Senior Cyber Security Analyst (£55k-£70k)',
      'Security Consultant (£70k+)',
    ],
    similarCareers: [
      8,
      63,
      66,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'tlevel-digital-support-services',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Cyber Security Analyst.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-compsci',
          'btec-computing',
        ],
        description: 'Study full-time for a degree that leads into a career as a Cyber Security Analyst.',
      },
    ]
  },
  {
    id: 4,
    employmentPercentage: 0.0989, // SOC 2141: Web design professionals
    category: 'Technology & Digital',
    title: 'UX/UI Designer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£25k - £60k',
    description: 'Design user experiences and interfaces that are intuitive, accessible and visually engaging.',
    requirements: [
      'Portfolio of design work',
      'UX research knowledge',
      'Familiarity with design tools',
      'GCSE Art and Computer Science',
    ],
    matchedSubjects: [
      'gcse-art-design',
      'gcse-computer-science',
      'alevel-media',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Create and refine visual or written content',
      'Work with teams to meet campaign and project goals',
      'Use software tools to design, edit and present work',
      'Gather feedback and improve creative deliverables',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=ux+ui+designer', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=ux+ui+designer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=ux+ui+designer', description: 'Business & tech skills' },
    ],
    progression: [
      'Designer Apprentice / Junior (Entry (£18k-£30k))',
      'Designer (Mid-level (£30k-£50k))',
      'Senior Designer (Senior (£45k-£70k))',
      'Lead Designer / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      1,
      2,
      3,
      5,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-media',
        ],
        description: 'Study full-time for a degree that leads into a career as a UX/UI Designer.',
      },
    ]
  },
  {
    id: 5,
    employmentPercentage: 0.4421, // SOC 3132: IT user support technicians
    category: 'Technology & Digital',
    title: 'IT Support Technician',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£20k - £40k',
    description: 'Provide technical support, fix hardware and help users solve computing problems in business settings.',
    requirements: [
      'CompTIA A+ or equivalent',
      'Customer service skills',
      'Basic networking knowledge',
      'GCSEs',
    ],
    matchedSubjects: [
      'computer-science-bsc',
      'gcse-computer-science',
      'btec-it',
      'tlevel-digital-support-services',
      'augmented-reality-development-bsc',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Work on it support technician tasks throughout the day',
      'Collaborate with colleagues and share ideas',
      'Review work, solve problems and improve outcomes',
      'Learn new techniques and stay up to date with trends',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=it+support+technician', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=it+support+technician', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=it+support+technician', description: 'Business & tech skills' },
    ],
    progression: [
      'Technician Apprentice / Junior (Entry (£18k-£30k))',
      'Technician (Mid-level (£30k-£50k))',
      'Senior Technician (Senior (£45k-£70k))',
      'Lead Technician / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      1,
      2,
      3,
      4,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'tlevel-digital-support-services',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a IT Support Technician.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-it',
          'augmented-reality-development-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a IT Support Technician.',
      },
    ]
  },
  {
    id: 6,
    employmentPercentage: 0.096, // SOC 2137: IT network professionals
    category: 'Technology & Digital',
    title: 'Network Engineer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£26k - £55k',
    description: 'Design, install and maintain networks while ensuring reliable connectivity and system performance.',
    requirements: [
      'CCNA or degree',
      'Network troubleshooting skills',
      'Understanding of routing and switching',
      'GCSE Computer Science',
    ],
    matchedSubjects: [
      'gcse-computer-science',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'btec-computing',
      'tlevel-digital-support-services',
    ],
    dayToDay: [
      'Work on network engineer tasks throughout the day',
      'Collaborate with colleagues and share ideas',
      'Review work, solve problems and improve outcomes',
      'Learn new techniques and stay up to date with trends',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=network+engineer', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=network+engineer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=network+engineer', description: 'Business & tech skills' },
    ],
    progression: [
      'Engineer Apprentice / Junior (Entry (£18k-£30k))',
      'Engineer (Mid-level (£30k-£50k))',
      'Senior Engineer (Senior (£45k-£70k))',
      'Lead Engineer / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      1,
      2,
      3,
      4,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'tlevel-engineering-manufacturing-processing-control',
          'tlevel-digital-support-services',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Network Engineer.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-computing',
        ],
        description: 'Study full-time for a degree that leads into a career as a Network Engineer.',
      },
    ]
  },
  {
    id: 7,
    employmentPercentage: 0.6052, // SOC 2133: IT business analysts, architects and systems designers
    category: 'Technology & Digital',
    title: 'Cloud Architect',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£80k - £160k+',
    description: 'Design cloud infrastructure, optimize deployments and manage services on AWS, Azure or Google Cloud.',
    requirements: [
      'Cloud certifications',
      'Experience with cloud platforms',
      'Architecture knowledge',
      'Degree',
    ],
    matchedSubjects: [
      'msc-computer-science',
      'alevel-mathematics',
      'information-technology-bsc',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'alevel-compsci',
      'btec-computing',
    ],
    dayToDay: [
      'Design cloud systems and infrastructure',
      'Guide cloud deployments and migrations',
      'Set architecture standards for scalability',
      'Review performance and optimise costs',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=cloud+architect', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=cloud+architect', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=cloud+architect', description: 'Business & tech skills' },
    ],
    progression: [
      'Junior Cloud Engineer (£45k-£65k)',
      'Cloud Architect (£65k-£95k)',
      'Senior Cloud Architect (£95k-£130k)',
      'Principal / Lead Cloud Architect (£130k-£160k+)',
    ],
    similarCareers: [
      8,
      66,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'university-engineering',
          'alevel-mathematics',
          'information-technology-bsc',
          'alevel-compsci',
          'btec-computing',
        ],
        description: 'Study full-time for a degree that leads into a career as a Cloud Architect.',
      },
    ]
  },
  {
    id: 8,
    employmentPercentage: 1.7625, // SOC 2134: Programmers and software development professionals (no distinct ML/AI SOC code)
    category: 'Technology & Digital',
    title: 'AI/Machine Learning Engineer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£65k - £150k+',
    description: 'Build intelligent models and systems that learn from data and automate decision-making.',
    requirements: [
      'Degree in AI or computing',
      'Python programming',
      'Machine learning knowledge',
      'A-Level Maths',
    ],
    matchedSubjects: [
      'msc-computer-science',
      'msc-data-science',
      'phd-computer-science',
      'computer-science-bsc',
      'alevel-mathematics',
      'data-science-bsc',
      'tlevel-digital-production-design-development',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'alevel-compsci',
      'gcse-computer-science',
      'artificial-intelligence-bsc',
    ],
    dayToDay: [
      'Build and train machine learning models',
      'Clean and prepare large datasets',
      'Test model accuracy and performance',
      'Deploy AI solutions into production',
      'Research new algorithms and techniques',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=ai+machine+learning+engineer', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=ai+machine+learning+engineer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=ai+machine+learning+engineer', description: 'Business & tech skills' },
    ],
    progression: [
      'Junior ML Engineer (£40k-£60k)',
      'ML Engineer (£60k-£85k)',
      'Senior ML Engineer (£85k-£120k)',
      'Principal AI/ML Engineer (£120k-£150k+)',
    ],
    similarCareers: [
      3,
      2,
      7,
      9,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'tlevel-digital-production-design-development',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a AI/Machine Learning Engineer.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-mathematics',
          'data-science-bsc',
          'alevel-compsci',
          'artificial-intelligence-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a AI/Machine Learning Engineer.',
      },
    ]
  },
  {
    id: 9,
    employmentPercentage: 1.7625, // SOC 2134: Programmers and software development professionals
    category: 'Technology & Digital',
    title: 'Web Developer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£22k - £50k',
    description: 'Create responsive websites and web applications using modern front-end and back-end technologies.',
    requirements: [
      'Portfolio or bootcamp experience',
      'HTML/CSS/JavaScript skills',
      'Problem solving',
      'GCSE Computer Science',
    ],
    matchedSubjects: [
      'computer-science-bsc',
      'gcse-computer-science',
      'alevel-compsci',
      'btec-it',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'btec-computing',
      'tlevel-digital-production-design-development',
    ],
    dayToDay: [
      'Write, test and improve software or technical solutions',
      'Fix issues and update systems with user feedback',
      'Collaborate with colleagues, designers and managers',
      'Research new tools, languages and best practices',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=web+developer', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=web+developer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=web+developer', description: 'Business & tech skills' },
    ],
    progression: [
      'Developer Apprentice / Junior (Entry (£18k-£30k))',
      'Developer (Mid-level (£30k-£50k))',
      'Senior Developer (Senior (£45k-£70k))',
      'Lead Developer / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      1,
      2,
      3,
      4,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'tlevel-digital-production-design-development',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Web Developer.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-compsci',
          'btec-it',
          'btec-computing',
        ],
        description: 'Study full-time for a degree that leads into a career as a Web Developer.',
      },
    ]
  },
  {
    id: 10,
    employmentPercentage: 1.7625, // SOC 2134: Programmers and software development professionals (no distinct game dev SOC code)
    category: 'Technology & Digital',
    title: 'Game Developer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£24k - £60k',
    description: 'Develop interactive games, write gameplay code and build immersive experiences for players.',
    requirements: [
      'Degree or portfolio',
      'Programming and creative skills',
      'Knowledge of game engines',
      'GCSE Computer Science and Art',
    ],
    matchedSubjects: [
      'gcse-computer-science',
      'gcse-art-design',
      'alevel-art-design',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'alevel-compsci',
      'virtual-reality-development-bsc',
    ],
    dayToDay: [
      'Write, test and improve software or technical solutions',
      'Fix issues and update systems with user feedback',
      'Collaborate with colleagues, designers and managers',
      'Research new tools, languages and best practices',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=game+developer', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=game+developer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=game+developer', description: 'Business & tech skills' },
    ],
    progression: [
      'Developer Apprentice / Junior (Entry (£18k-£30k))',
      'Developer (Mid-level (£30k-£50k))',
      'Senior Developer (Senior (£45k-£70k))',
      'Lead Developer / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      1,
      2,
      3,
      4,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-art-design',
          'alevel-compsci',
          'virtual-reality-development-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a Game Developer.',
      },
    ]
  },
  {
    id: 11,
    employmentPercentage: 0.6952, // SOC 2431: Management consultants and business analysts
    category: 'Business & Finance',
    title: 'Business Analyst',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£30k - £60k',
    description: 'Translate business needs into technical solutions and support strategy with clear insight.',
    requirements: [
      'Degree or experience in business',
      'Analytical thinking',
      'Communication skills',
      'GCSE English and Business',
    ],
    matchedSubjects: [
      'mba',
      'gcse-business-studies',
      'alevel-business-studies',
      'gcse-english',
      'gcse-maths',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Gather and analyse business requirements',
      'Create reports, process maps and recommendations',
      'Work with stakeholders to improve systems',
      'Support project planning and decision-making',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=business+analyst', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=business+analyst', description: 'Affordable professional courses' },
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=business+analyst', description: 'Creative & practical classes' },
    ],
    progression: [
      'Junior Business Analyst (£28k-£35k)',
      'Business Analyst (£35k-£50k)',
      'Senior Business Analyst (£50k-£65k)',
      'Lead Business Analyst (£65k+)',
    ],
    similarCareers: [
      12,
      13,
      14,
      18,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-business-studies',
        ],
        description: 'Study full-time for a degree that leads into a career as a Business Analyst.',
      },
    ]
  },
  {
    id: 12,
    employmentPercentage: 0.6081, // SOC 2421: Chartered and certified accountants
    category: 'Business & Finance',
    title: 'Accountant',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£50k - £100k+',
    description: 'Prepare financial records, manage accounts and support compliance for businesses and clients.',
    requirements: [
      'ACA/ACCA/CIMA qualifications',
      'Numerical accuracy',
      'Attention to detail',
      'A-Level Maths',
    ],
    matchedSubjects: [
      'msc-finance',
      'acca-accounting',
      'a-level-mathematics',
      'gcse-maths',
      'accounting-bsc',
      'gcse-english',
      'accounting-apprenticeship-aat',
    ],
    dayToDay: [
      'Prepare financial records and reconcile accounts',
      'Manage invoices, payroll and expense reports',
      'Support audits and financial compliance',
      'Communicate with clients and stakeholders',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=accountant', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=accountant', description: 'Affordable professional courses' },
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=accountant', description: 'Creative & practical classes' },
    ],
    progression: [
      'Trainee Accountant (£22k-£30k)',
      'Qualified Accountant (£30k-£45k)',
      'Senior Accountant (£45k-£70k)',
      'Finance Manager / Chartered Accountant (£70k-£100k+)',
    ],
    similarCareers: [
      11,
      13,
      74,
      71,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'accounting-apprenticeship-aat',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Accountant.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'accounting-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a Accountant.',
      },
    ]
  },
  {
    id: 13,
    employmentPercentage: 0.8971, // SOC 2422: Finance and investment analysts and advisers
    category: 'Business & Finance',
    title: 'Financial Advisor',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£24k - £70k',
    description: 'Advise clients on savings, pensions and investments while helping them meet long-term goals.',
    requirements: [
      'Degree and Level 4 Diploma',
      'Financial regulation knowledge',
      'Communication skills',
      'GCSE Maths',
    ],
    matchedSubjects: [
      'msc-finance',
      'cfa-finance',
      'acca-accounting',
      'gcse-maths',
      'finance-bsc',
      'business-management-ba',
      'gcse-economics',
      'nvq-business-administration',
      'economics-bsc',
      'human-resource-management-ba',
      'international-business-ba',
      'supply-chain-management-ba',
      'tlevel-finance',
      'tlevel-accounting',
      'tlevel-management-administration',
      'gcse-english',
    ],
    dayToDay: [
      'Analyse information and prepare clear reports',
      'Communicate with clients, colleagues and stakeholders',
      'Make decisions that support business goals',
      'Organise work and manage deadlines for projects',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=financial+advisor', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=financial+advisor', description: 'Affordable professional courses' },
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=financial+advisor', description: 'Creative & practical classes' },
    ],
    progression: [
      'Financial Apprentice / Junior (Entry (£18k-£30k))',
      'Financial (Mid-level (£30k-£50k))',
      'Senior Financial (Senior (£45k-£70k))',
      'Lead Financial / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      11,
      12,
      14,
      15,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'nvq-business-administration',
          'hotel-management-apprenticeship',
          'leisure-management-apprenticeship',
          'tlevel-digital-business-services',
          'tlevel-finance',
          'tlevel-accounting',
          'tlevel-management-administration',
          'tlevel-agriculture-land-management-production',
          'tlevel-animal-care-management',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Financial Advisor.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'finance-bsc',
          'business-management-ba',
          'economics-bsc',
          'human-resource-management-ba',
          'international-business-ba',
          'supply-chain-management-ba',
          'hotel-hospitality-management-ba',
          'event-management-ba',
          'tourism-management-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Financial Advisor.',
      },
    ]
  },
  {
    id: 14,
    employmentPercentage: 0.9943, // SOC 2440: Business and financial project management professionals
    category: 'Business & Finance',
    title: 'Project Manager',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£30k - £70k',
    description: 'Lead projects from start to finish, coordinate teams and deliver outcomes on time and budget.',
    requirements: [
      'Degree and PRINCE2',
      'Organisation skills',
      'Stakeholder management',
      'GCSEs and experience',
    ],
    matchedSubjects: [
      'mba',
      'project-management-bsc',
      'business-management-ba',
      'gcse-english',
      'gcse-maths',
    ],
    dayToDay: [
      'Analyse information and prepare clear reports',
      'Communicate with clients, colleagues and stakeholders',
      'Make decisions that support business goals',
      'Organise work and manage deadlines for projects',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=project+manager', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=project+manager', description: 'Affordable professional courses' },
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=project+manager', description: 'Creative & practical classes' },
    ],
    progression: [
      'Manager Apprentice / Junior (Entry (£18k-£30k))',
      'Manager (Mid-level (£30k-£50k))',
      'Senior Manager (Senior (£45k-£70k))',
      'Lead Manager / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      11,
      12,
      13,
      15,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'project-management-bsc',
          'business-management-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Project Manager.',
      },
    ]
  },
  {
    id: 15,
    employmentPercentage: 0.4004, // SOC 2432: Marketing and commercial managers
    category: 'Business & Finance',
    title: 'Marketing Manager',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£26k - £60k',
    description: 'Create marketing campaigns, build brands and measure performance to grow business reach.',
    requirements: [
      'Degree and experience',
      'Creative thinking',
      'Digital marketing knowledge',
      'GCSE English and Business',
    ],
    matchedSubjects: [
      'mba',
      'cim-marketing',
      'gcse-business-studies',
      'gcse-english',
      'marketing-ba',
      'gcse-maths',
    ],
    dayToDay: [
      'Analyse information and prepare clear reports',
      'Communicate with clients, colleagues and stakeholders',
      'Make decisions that support business goals',
      'Organise work and manage deadlines for projects',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=marketing+manager', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=marketing+manager', description: 'Affordable professional courses' },
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=marketing+manager', description: 'Creative & practical classes' },
    ],
    progression: [
      'Manager Apprentice / Junior (Entry (£18k-£30k))',
      'Manager (Mid-level (£30k-£50k))',
      'Senior Manager (Senior (£45k-£70k))',
      'Lead Manager / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      11,
      12,
      13,
      14,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'marketing-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Marketing Manager.',
      },
    ]
  },
  {
    id: 16,
    employmentPercentage: 0.6323, // SOC 3571: Human resources and industrial relations officers
    category: 'Business & Finance',
    title: 'Human Resources Officer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£22k - £45k',
    description: 'Manage recruitment, training and employee support within organisations.',
    requirements: [
      'Degree or CIPD',
      'People skills',
      'HR knowledge',
      'GCSE English',
    ],
    matchedSubjects: [
      'cipd-level-7-hr',
      'gcse-english',
      'business-management-ba',
      'gcse-maths',
      'hr-apprenticeship',
    ],
    dayToDay: [
      'Analyse information and prepare clear reports',
      'Communicate with clients, colleagues and stakeholders',
      'Make decisions that support business goals',
      'Organise work and manage deadlines for projects',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=human+resources+officer', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=human+resources+officer', description: 'Affordable professional courses' },
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=human+resources+officer', description: 'Creative & practical classes' },
    ],
    progression: [
      'Officer Apprentice / Junior (Entry (£18k-£30k))',
      'Officer (Mid-level (£30k-£50k))',
      'Senior Officer (Senior (£45k-£70k))',
      'Lead Officer / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      11,
      12,
      13,
      14,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'hr-apprenticeship',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Human Resources Officer.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'business-management-ba',
          'social-work-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Human Resources Officer.',
      },
    ]
  },
  {
    id: 17,
    employmentPercentage: 1.037, // SOC 3556: Sales accounts and business development managers
    category: 'Business & Finance',
    title: 'Sales Manager',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£25k - £70k',
    description: 'Lead sales teams, develop strategies and maintain customer relationships for business growth.',
    requirements: [
      'Experience in sales',
      'Communication skills',
      'Leadership',
      'GCSEs and customer service',
    ],
    matchedSubjects: [
      'mba',
      'customer-service-apprenticeship',
      'business-management-ba',
      'gcse-english',
      'gcse-maths',
    ],
    dayToDay: [
      'Analyse information and prepare clear reports',
      'Communicate with clients, colleagues and stakeholders',
      'Make decisions that support business goals',
      'Organise work and manage deadlines for projects',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=sales+manager', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=sales+manager', description: 'Affordable professional courses' },
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=sales+manager', description: 'Creative & practical classes' },
    ],
    progression: [
      'Sales Apprentice / Junior (Entry (£18k-£30k))',
      'Sales (Mid-level (£30k-£50k))',
      'Senior Sales (Senior (£45k-£70k))',
      'Lead Sales / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      11,
      12,
      13,
      14,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'customer-service-apprenticeship',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Sales Manager.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'business-management-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Sales Manager.',
      },
    ]
  },
  {
    id: 18,
    employmentPercentage: 0.6952, // SOC 2431: Management consultants and business analysts
    category: 'Business & Finance',
    title: 'Management Consultant',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£32k - £80k',
    description: 'Advise companies on strategy, operations and performance improvements.',
    requirements: [
      'Top degree',
      'Analytical ability',
      'Problem solving',
      'A-Levels and degree',
    ],
    matchedSubjects: [
      'mba',
      'ma-international-relations',
      'phd-business-management',
      'a-level-economics',
      'business-management-ba',
      'project-management-bsc',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Analyse information and prepare clear reports',
      'Communicate with clients, colleagues and stakeholders',
      'Make decisions that support business goals',
      'Organise work and manage deadlines for projects',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=management+consultant', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=management+consultant', description: 'Affordable professional courses' },
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=management+consultant', description: 'Creative & practical classes' },
    ],
    progression: [
      'Consultant Apprentice / Junior (Entry (£18k-£30k))',
      'Consultant (Mid-level (£30k-£50k))',
      'Senior Consultant (Senior (£45k-£70k))',
      'Lead Consultant / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      92,
      11,
      12,
      13,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'business-management-ba',
          'project-management-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a Management Consultant.',
      },
    ]
  },
  {
    id: 19,
    employmentPercentage: 0.8971, // SOC 2422: Finance and investment analysts and advisers
    category: 'Business & Finance',
    title: 'Investment Banker',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£84k - £500k+',
    description: 'Work on deals, markets and finance strategies for corporate clients and investors.',
    requirements: [
      'Degree and internships',
      'Financial modelling',
      'Strong maths',
      'A-Level Maths and Economics',
    ],
    matchedSubjects: [
      'msc-finance',
      'cfa-finance',
      'a-level-economics',
      'a-level-mathematics',
      'finance-bsc',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Analyse information and prepare clear reports',
      'Communicate with clients, colleagues and stakeholders',
      'Make decisions that support business goals',
      'Organise work and manage deadlines for projects',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=investment+banker', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=investment+banker', description: 'Affordable professional courses' },
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=investment+banker', description: 'Creative & practical classes' },
    ],
    progression: [
      'Analyst (£45k-£70k)',
      'Associate (£70k-£110k)',
      'Vice President (£110k-£210k)',
      'Managing Director (£210k-£500k+)',
    ],
    similarCareers: [
      11,
      12,
      13,
      14,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'finance-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a Investment Banker.',
      },
    ]
  },
  {
    id: 20,
    employmentPercentage: 0.1002, // SOC 3532: Insurance underwriters
    category: 'Business & Finance',
    title: 'Insurance Underwriter',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£22k - £50k',
    description: 'Assess risk, price policies and make decisions on insurance cover for clients.',
    requirements: [
      'Degree or apprenticeship',
      'Risk assessment skills',
      'Attention to detail',
      'GCSEs',
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-business-studies',
      'btec-business',
      'gcse-english',
    ],
    dayToDay: [
      'Analyse information and prepare clear reports',
      'Communicate with clients, colleagues and stakeholders',
      'Make decisions that support business goals',
      'Organise work and manage deadlines for projects',
    ],
    whereToStudy: [
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=insurance+underwriter', description: 'Creative & practical classes' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=insurance+underwriter', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=insurance+underwriter', description: 'Business & tech skills' },
    ],
    progression: [
      'Insurance Underwriter Apprentice / Junior (Entry (£18k-£30k))',
      'Insurance Underwriter (Mid-level (£30k-£50k))',
      'Senior Insurance Underwriter (Senior (£45k-£70k))',
      'Lead Insurance Underwriter / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      11,
      12,
      13,
      14,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-business',
        ],
        description: 'Study full-time for a degree that leads into a career as a Insurance Underwriter.',
      },
    ]
  },
  {
    id: 21,
    employmentPercentage: 0.5022, // SOC 2211: Generalist medical practitioners
    category: 'Healthcare & Medicine',
    title: 'Doctor/GP',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£35k - £100k+',
    description: 'Diagnose illnesses and provide treatment across general practice and healthcare settings.',
    requirements: [
      'Medical degree',
      'Clinical experience',
      'A-Level Biology and Chemistry',
      'Strong communication skills',
    ],
    matchedSubjects: [
      'medicine-graduate-entry',
      'alevel-biology',
      'alevel-chemistry',
      'medicine-mbbs',
      'gcse-biology',
      'gcse-chemistry',
      'nvq-health-social-care',
      'healthcare-assistant-apprenticeship',
      'dental-nursing-apprenticeship',
      'nursing-children-bsc',
      'radiography-therapeutic-bsc',
      'dietetics-bsc',
      'biomedical-science-bsc',
      'chemistry-bsc',
      'biology-bsc',
      'nutrition-food-science-bsc',
      'alevel-environmental-science',
      'btec-applied-science',
      'tlevel-health',
      'tlevel-healthcare-science',
      'tlevel-science',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Care for patients and support their health needs',
      'Record observations and update care plans',
      'Work closely with healthcare teams and specialists',
      'Deliver treatment and advice in clinical settings',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=doctor+gp', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=doctor+gp', description: 'Business & tech skills' },
    ],
    progression: [
      'DoctorGP Apprentice / Junior (Entry (£18k-£30k))',
      'DoctorGP (Mid-level (£30k-£50k))',
      'Senior DoctorGP (Senior (£45k-£70k))',
      'Lead DoctorGP / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      91,
      22,
      23,
      24,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'nvq-health-social-care',
          'healthcare-assistant-apprenticeship',
          'dental-nursing-apprenticeship',
          'tlevel-health',
          'tlevel-healthcare-science',
          'tlevel-science',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Doctor/GP.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-biology',
          'alevel-chemistry',
          'medicine-mbbs',
          'computer-science-bsc',
          'nursing-children-bsc',
          'radiography-therapeutic-bsc',
          'dietetics-bsc',
          'biomedical-science-bsc',
          'chemistry-bsc',
          'biology-bsc',
          'nutrition-food-science-bsc',
          'alevel-environmental-science',
          'btec-applied-science',
          'btec-forensic-science',
        ],
        description: 'Study full-time for a degree that leads into a career as a Doctor/GP.',
      },
    ]
  },
  {
    id: 22,
    employmentPercentage: 1.2424, // SOC 2237: Other registered nursing professionals
    category: 'Healthcare & Medicine',
    title: 'Nurse',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£25k - £45k',
    description: 'Provide patient care, support treatment plans and work in hospitals or community settings.',
    requirements: [
      'Nursing degree',
      'Clinical skills',
      'Compassion and resilience',
      'GCSE Science and Health & Social Care',
    ],
    matchedSubjects: [
      'nursing-conversion',
      'gcse-science-combined',
      'btec-health-social-care',
      'nursing-adult-bsc',
      'gcse-maths',
      'gcse-english',
      'operating-department-practice-bsc',
    ],
    dayToDay: [
      'Care for patients and support their health needs',
      'Record observations and update care plans',
      'Work closely with healthcare teams and specialists',
      'Deliver treatment and advice in clinical settings',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=nurse', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=nurse', description: 'Business & tech skills' },
    ],
    progression: [
      'Nurse Apprentice / Junior (Entry (£18k-£30k))',
      'Nurse (Mid-level (£30k-£50k))',
      'Senior Nurse (Senior (£45k-£70k))',
      'Lead Nurse / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      21,
      23,
      24,
      25,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-health-social-care',
          'nursing-adult-bsc',
          'operating-department-practice-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a Nurse.',
      },
    ]
  },
  {
    id: 23,
    employmentPercentage: 0.1274, // SOC 2255: Paramedics
    category: 'Healthcare & Medicine',
    title: 'Paramedic',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£25k - £40k',
    description: 'Respond to emergencies, provide lifesaving care and transport patients to hospital.',
    requirements: [
      'Paramedic science degree',
      'First aid skills',
      'Resilience',
      'GCSE Science',
    ],
    matchedSubjects: [
      'gcse-science-combined',
      'paramedic-science-bsc',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Care for patients and support their health needs',
      'Record observations and update care plans',
      'Work closely with healthcare teams and specialists',
      'Deliver treatment and advice in clinical settings',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=paramedic', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=paramedic', description: 'Business & tech skills' },
    ],
    progression: [
      'Paramedic Apprentice / Junior (Entry (£18k-£30k))',
      'Paramedic (Mid-level (£30k-£50k))',
      'Senior Paramedic (Senior (£45k-£70k))',
      'Lead Paramedic / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      21,
      22,
      24,
      25,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'paramedic-science-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a Paramedic.',
      },
    ]
  },
  {
    id: 24,
    employmentPercentage: 0.1848, // SOC 2251: Pharmacists
    category: 'Healthcare & Medicine',
    title: 'Pharmacist',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£54k - £75k+',
    description: 'Supply medication, support safe prescriptions and advise patients on pharmacy care.',
    requirements: [
      'Pharmacy degree',
      'Chemistry knowledge',
      'Attention to detail',
      'A-Level Chemistry and Biology',
    ],
    matchedSubjects: [
      'alevel-chemistry',
      'alevel-biology',
      'pharmacy-mpharm',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Care for patients and support their health needs',
      'Record observations and update care plans',
      'Work closely with healthcare teams and specialists',
      'Deliver treatment and advice in clinical settings',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=pharmacist', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=pharmacist', description: 'Business & tech skills' },
    ],
    progression: [
      'Pre-registration Pharmacist (£25k-£30k)',
      'Pharmacist (£35k-£45k)',
      'Senior / Specialist Pharmacist (£45k-£60k)',
      'Lead Pharmacist / Superintendent (£60k-£75k+)',
    ],
    similarCareers: [
      21,
      22,
      23,
      25,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-chemistry',
          'alevel-biology',
          'pharmacy-mpharm',
        ],
        description: 'Study full-time for a degree that leads into a career as a Pharmacist.',
      },
    ]
  },
  {
    id: 25,
    employmentPercentage: 0.1773, // SOC 2221: Physiotherapists
    category: 'Healthcare & Medicine',
    title: 'Physiotherapist',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£25k - £45k',
    description: 'Help patients recover movement and manage injuries through therapy and exercise programmes.',
    requirements: [
      'Physiotherapy degree',
      'Anatomy knowledge',
      'Communication skills',
      'A-Level Biology',
    ],
    matchedSubjects: [
      'alevel-biology',
      'physiotherapy-bsc',
      'sports-therapy-bsc',
      'exercise-physiology-bsc',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Care for patients and support their health needs',
      'Record observations and update care plans',
      'Work closely with healthcare teams and specialists',
      'Deliver treatment and advice in clinical settings',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=physiotherapist', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=physiotherapist', description: 'Business & tech skills' },
    ],
    progression: [
      'Physiotherapist Apprentice / Junior (Entry (£18k-£30k))',
      'Physiotherapist (Mid-level (£30k-£50k))',
      'Senior Physiotherapist (Senior (£45k-£70k))',
      'Lead Physiotherapist / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      88,
      21,
      22,
      23,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'sports-coaching-apprenticeship',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Physiotherapist.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-biology',
          'sports-science-bsc',
          'physiotherapy-bsc',
          'btec-sport',
          'sports-therapy-bsc',
          'exercise-physiology-bsc',
          'coaching-sports-development-bsc',
          'alevel-physical-education',
        ],
        description: 'Study full-time for a degree that leads into a career as a Physiotherapist.',
      },
    ]
  },
  {
    id: 26,
    employmentPercentage: 0.1754, // SOC 2222: Occupational therapists
    category: 'Healthcare & Medicine',
    title: 'Occupational Therapist',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£25k - £45k',
    description: 'Support people to regain daily living skills and independence after illness or injury.',
    requirements: [
      'Occupational therapy degree',
      'Empathy and practical skills',
      'Rehabilitation knowledge',
      'GCSE Science',
    ],
    matchedSubjects: [
      'gcse-science-combined',
      'occupational-therapy-bsc',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Care for patients and support their health needs',
      'Record observations and update care plans',
      'Work closely with healthcare teams and specialists',
      'Deliver treatment and advice in clinical settings',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=occupational+therapist', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=occupational+therapist', description: 'Business & tech skills' },
    ],
    progression: [
      'Occupational Therapist Apprentice / Junior (Entry (£18k-£30k))',
      'Occupational Therapist (Mid-level (£30k-£50k))',
      'Senior Occupational Therapist (Senior (£45k-£70k))',
      'Lead Occupational Therapist / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      21,
      22,
      23,
      24,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'occupational-therapy-bsc',
          'disability-studies-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Occupational Therapist.',
      },
    ]
  },
  {
    id: 27,
    employmentPercentage: 0.1037, // SOC 2253: Dental practitioners
    category: 'Healthcare & Medicine',
    title: 'Dentist',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£35k - £100k+',
    description: 'Examine teeth, treat oral health problems and provide dental care to patients.',
    requirements: [
      'Dentistry degree',
      'Manual dexterity',
      'A-Level Chemistry and Biology',
      'Strong attention to detail',
    ],
    matchedSubjects: [
      'alevel-chemistry',
      'alevel-biology',
      'dentistry-bds',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Examine patients and diagnose oral health issues',
      'Carry out treatments and dental procedures',
      'Advise patients on care and prevention',
      'Work with dental nurses and support staff',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=dentist', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=dentist', description: 'Business & tech skills' },
    ],
    progression: [
      'Dental Foundation Dentist (£35k-£45k)',
      'Associate Dentist (£45k-£60k)',
      'Senior Dentist (£60k-£80k)',
      'Practice Principal (£80k+)',
    ],
    similarCareers: [
      21,
      22,
      24,
      28,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-chemistry',
          'alevel-biology',
          'dentistry-bds',
        ],
        description: 'Study full-time for a degree that leads into a career as a Dentist.',
      },
    ]
  },
  {
    id: 28,
    employmentPercentage: 0.0779, // SOC 2225: Clinical psychologists
    category: 'Healthcare & Medicine',
    title: 'Psychologist',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£27k - £50k',
    description: 'Study behaviour and mental health, then support people through assessment and therapy.',
    requirements: [
      'Psychology degree and doctorate',
      'Research skills',
      'Empathy',
      'A-Level Psychology',
    ],
    matchedSubjects: [
      'msc-psychology-conversion',
      'phd-psychology',
      'alevel-psychology',
      'psychology-bsc',
      'clinical-psychology-doctorate',
      'nursing-mental-health-bsc',
      'mental-health-nursing-bsc',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Care for patients and support their health needs',
      'Record observations and update care plans',
      'Work closely with healthcare teams and specialists',
      'Deliver treatment and advice in clinical settings',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=psychologist', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=psychologist', description: 'Business & tech skills' },
    ],
    progression: [
      'Psychologist Apprentice / Junior (Entry (£18k-£30k))',
      'Psychologist (Mid-level (£30k-£50k))',
      'Senior Psychologist (Senior (£45k-£70k))',
      'Lead Psychologist / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      21,
      22,
      23,
      24,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-psychology',
          'psychology-bsc',
          'clinical-psychology-doctorate',
          'nursing-mental-health-bsc',
          'mental-health-nursing-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a Psychologist.',
      },
    ]
  },
  {
    id: 29,
    employmentPercentage: 0.1417, // SOC 2254: Medical radiographers
    category: 'Healthcare & Medicine',
    title: 'Radiographer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£25k - £45k',
    description: 'Use imaging technology to support diagnosis and treatment of patients in hospitals.',
    requirements: [
      'Radiography degree',
      'Technical skills',
      'Attention to detail',
      'GCSE Science',
    ],
    matchedSubjects: [
      'gcse-science-combined',
      'radiography-diagnostic-bsc',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Care for patients and support their health needs',
      'Record observations and update care plans',
      'Work closely with healthcare teams and specialists',
      'Deliver treatment and advice in clinical settings',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=radiographer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=radiographer', description: 'Business & tech skills' },
    ],
    progression: [
      'Radiographer Apprentice / Junior (Entry (£18k-£30k))',
      'Radiographer (Mid-level (£30k-£50k))',
      'Senior Radiographer (Senior (£45k-£70k))',
      'Lead Radiographer / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      21,
      22,
      23,
      24,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'radiography-diagnostic-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a Radiographer.',
      },
    ]
  },
  {
    id: 30,
    employmentPercentage: 0.1267, // SOC 2231: Midwifery nurses
    category: 'Healthcare & Medicine',
    title: 'Midwife',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£25k - £45k',
    description: 'Care for mothers and babies during pregnancy, birth and postnatal recovery.',
    requirements: [
      'Midwifery degree',
      'Compassion and clinical skills',
      'Teamwork',
      'GCSE Science and Health & Social Care',
    ],
    matchedSubjects: [
      'gcse-science-combined',
      'midwifery-bsc',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Care for patients and support their health needs',
      'Record observations and update care plans',
      'Work closely with healthcare teams and specialists',
      'Deliver treatment and advice in clinical settings',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=midwife', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=midwife', description: 'Business & tech skills' },
    ],
    progression: [
      'Midwife Apprentice / Junior (Entry (£18k-£30k))',
      'Midwife (Mid-level (£30k-£50k))',
      'Senior Midwife (Senior (£45k-£70k))',
      'Lead Midwife / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      21,
      22,
      23,
      24,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'midwifery-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a Midwife.',
      },
    ]
  },
  {
    id: 31,
    employmentPercentage: 0.2979, // SOC 2121: Civil engineers
    category: 'Engineering & Manufacturing',
    title: 'Civil Engineer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£26k - £60k',
    description: 'Design and oversee construction projects for roads, bridges and buildings.',
    requirements: [
      'Engineering degree',
      'Strong maths and physics',
      'Project planning',
      'A-Level Maths and Physics',
    ],
    matchedSubjects: [
      'msc-civil-engineering',
      'a-level-mathematics',
      'a-level-physics',
      'civil-engineering-beng',
      'gcse-physics',
      'btec-engineering',
      'mechanical-engineering-apprenticeship',
      'physics-bsc',
      'automotive-engineering-beng',
      'petroleum-engineering-beng',
      'nuclear-engineering-beng',
      'renewable-energy-engineering-beng',
      'railway-engineering-beng',
      'mechatronics-beng',
      'robotics-beng',
      'alevel-physics',
      'tlevel-construction-building-services-engineering',
      'tlevel-construction-on-site-construction',
      'tlevel-engineering-manufacturing-maintenance-installation-repair',
      'vocational-construction-labourer',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Design infrastructure and construction projects',
      'Inspect site plans and monitor progress',
      'Coordinate with contractors and stakeholders',
      'Ensure projects meet safety and quality standards',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=civil+engineer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=civil+engineer', description: 'Business & tech skills' },
    ],
    progression: [
      'Graduate Civil Engineer (£26k-£36k)',
      'Civil Engineer (£36k-£50k)',
      'Senior Civil Engineer (£50k-£65k)',
      'Project Manager (£65k+)',
    ],
    similarCareers: [
      89,
      32,
      33,
      34,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'mechanical-engineering-apprenticeship',
          'tlevel-construction-building-services-engineering',
          'tlevel-construction-on-site-construction',
          'tlevel-engineering-manufacturing-maintenance-installation-repair',
          'vocational-construction-labourer',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Civil Engineer.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'civil-engineering-beng',
          'btec-engineering',
          'physics-bsc',
          'automotive-engineering-beng',
          'petroleum-engineering-beng',
          'nuclear-engineering-beng',
          'renewable-energy-engineering-beng',
          'railway-engineering-beng',
          'mechatronics-beng',
          'robotics-beng',
          'alevel-physics',
        ],
        description: 'Study full-time for a degree that leads into a career as a Civil Engineer.',
      },
    ]
  },
  {
    id: 32,
    employmentPercentage: 0.2252, // SOC 2122: Mechanical engineers
    category: 'Engineering & Manufacturing',
    title: 'Mechanical Engineer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£51k - £85k+',
    description: 'Create mechanical systems and products for industry, transport and manufacturing.',
    requirements: [
      'Engineering degree',
      'Problem solving',
      'Technical drawing',
      'A-Level Maths and Physics',
    ],
    matchedSubjects: [
      'msc-mechanical-engineering',
      'a-level-mathematics',
      'a-level-physics',
      'mechanical-engineering-beng',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'nvq-vehicle-maintenance',
    ],
    dayToDay: [
      'Design plans, inspect drawings and review technical details',
      'Coordinate with project teams and clients on requirements',
      'Monitor progress and solve practical problems on site',
      'Ensure work follows standards, safety and quality controls',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=mechanical+engineer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=mechanical+engineer', description: 'Business & tech skills' },
    ],
    progression: [
      'Graduate Mechanical Engineer (£25k-£32k)',
      'Mechanical Engineer (£32k-£45k)',
      'Senior Mechanical Engineer (£45k-£65k)',
      'Principal / Chartered Mechanical Engineer (£65k-£85k+)',
    ],
    similarCareers: [
      31,
      33,
      34,
      35,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'nvq-vehicle-maintenance',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Mechanical Engineer.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'mechanical-engineering-beng',
        ],
        description: 'Study full-time for a degree that leads into a career as a Mechanical Engineer.',
      },
    ]
  },
  {
    id: 33,
    employmentPercentage: 0.1526, // SOC 2123: Electrical engineers
    category: 'Engineering & Manufacturing',
    title: 'Electrical Engineer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£60k - £95k+',
    description: 'Develop electrical systems and equipment for power, automation and infrastructure.',
    requirements: [
      'Engineering degree',
      'Circuit knowledge',
      'Analytical thinking',
      'A-Level Maths and Physics',
    ],
    matchedSubjects: [
      'msc-electrical-engineering',
      'a-level-mathematics',
      'a-level-physics',
      'electrical-engineering-beng',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'electrical-engineering-apprenticeship',
    ],
    dayToDay: [
      'Design plans, inspect drawings and review technical details',
      'Coordinate with project teams and clients on requirements',
      'Monitor progress and solve practical problems on site',
      'Ensure work follows standards, safety and quality controls',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=electrical+engineer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=electrical+engineer', description: 'Business & tech skills' },
    ],
    progression: [
      'Graduate Electrical Engineer (£26k-£34k)',
      'Electrical Engineer (£34k-£48k)',
      'Senior Electrical Engineer (£48k-£70k)',
      'Principal / Chartered Electrical Engineer (£70k-£95k+)',
    ],
    similarCareers: [
      31,
      32,
      34,
      35,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'electrical-engineering-apprenticeship',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Electrical Engineer.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'electrical-engineering-beng',
        ],
        description: 'Study full-time for a degree that leads into a career as a Electrical Engineer.',
      },
    ]
  },
  {
    id: 34,
    employmentPercentage: 0.0924, // SOC 2126: Aerospace engineers
    category: 'Engineering & Manufacturing',
    title: 'Aerospace Engineer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£28k - £60k',
    description: 'Design aircraft, spacecraft and propulsion systems for aviation and space industries.',
    requirements: [
      'Aerospace degree',
      'Maths and physics skills',
      'Attention to detail',
      'A-Level Maths and Physics',
    ],
    matchedSubjects: [
      'msc-aerospace-engineering',
      'a-level-mathematics',
      'a-level-physics',
      'aerospace-engineering-beng',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'aerospace-manufacturing-apprenticeship',
    ],
    dayToDay: [
      'Design aircraft and spacecraft components',
      'Calculate loads, performance and materials',
      'Review technical drawings and prototypes',
      'Work with teams to solve engineering challenges',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=aerospace+engineer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=aerospace+engineer', description: 'Business & tech skills' },
    ],
    progression: [
      'Graduate Aerospace Engineer (£28k-£40k)',
      'Aerospace Engineer (£40k-£55k)',
      'Senior Aerospace Engineer (£55k-£70k)',
      'Lead Aerospace Engineer (£70k+)',
    ],
    similarCareers: [
      31,
      32,
      33,
      35,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'aerospace-manufacturing-apprenticeship',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Aerospace Engineer.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'aerospace-engineering-beng',
        ],
        description: 'Study full-time for a degree that leads into a career as a Aerospace Engineer.',
      },
    ]
  },
  {
    id: 35,
    employmentPercentage: 0.2776, // estimated from SOC 21xx group average: Chemical engineers not in this dataset - Science/Engineering professionals (SOC 21xx) average
    category: 'Engineering & Manufacturing',
    title: 'Chemical Engineer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£28k - £60k',
    description: 'Develop processes for chemicals, energy and materials in industrial settings.',
    requirements: [
      'Chemical engineering degree',
      'Chemistry knowledge',
      'Analytical skills',
      'A-Level Chemistry and Maths',
    ],
    matchedSubjects: [
      'msc-chemical-engineering',
      'a-level-chemistry',
      'a-level-mathematics',
      'chemical-engineering-beng',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Design chemical processes and industrial systems',
      'Carry out experiments and analyse results',
      'Improve efficiency and safety in production',
      'Work with technical teams on process development',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=chemical+engineer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=chemical+engineer', description: 'Business & tech skills' },
    ],
    progression: [
      'Graduate Chemical Engineer (£28k-£38k)',
      'Chemical Engineer (£38k-£50k)',
      'Senior Chemical Engineer (£50k-£65k)',
      'Principal Engineer (£65k+)',
    ],
    similarCareers: [
      31,
      32,
      33,
      34,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'chemical-engineering-beng',
        ],
        description: 'Study full-time for a degree that leads into a career as a Chemical Engineer.',
      },
    ]
  },
  {
    id: 36,
    employmentPercentage: 0.146, // SOC 2451: Architects
    category: 'Engineering & Manufacturing',
    title: 'Architect',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£28k - £60k',
    description: 'Design buildings and spaces with creativity, structure and sustainability in mind.',
    requirements: [
      'Architecture degree',
      'Design portfolio',
      'Maths and art skills',
      'A-Level Art and Maths',
    ],
    matchedSubjects: [
      'a-level-art-design',
      'a-level-mathematics',
      'architecture-ba',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'landscape-architecture-ba',
    ],
    dayToDay: [
      'Design buildings, spaces and structural plans',
      'Produce drawings, models and client presentations',
      'Coordinate with engineers and construction teams',
      'Ensure design meets safety, planning and budget needs',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=architect', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=architect', description: 'Business & tech skills' },
    ],
    progression: [
      'Architectural Assistant (£28k-£35k)',
      'Architect (£35k-£50k)',
      'Senior Architect (£50k-£70k)',
      'Design Director (£70k+)',
    ],
    similarCareers: [
      31,
      34,
      35,
      37,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'architecture-ba',
          'landscape-architecture-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Architect.',
      },
    ]
  },
  {
    id: 37,
    employmentPercentage: 0.2171, // SOC 2453: Quantity surveyors
    category: 'Engineering & Manufacturing',
    title: 'Quantity Surveyor',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£53k - £90k+',
    description: 'Manage costs and contracts for construction projects from planning through delivery.',
    requirements: [
      'Degree or RICS qualification',
      'Maths literacy',
      'Attention to detail',
      'GCSE Maths and A-Levels',
    ],
    matchedSubjects: [
      'gcse-maths',
      'a-level-mathematics',
      'civil-engineering-beng',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Design plans, inspect drawings and review technical details',
      'Coordinate with project teams and clients on requirements',
      'Monitor progress and solve practical problems on site',
      'Ensure work follows standards, safety and quality controls',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=quantity+surveyor', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=quantity+surveyor', description: 'Business & tech skills' },
    ],
    progression: [
      'Trainee Quantity Surveyor (£24k-£30k)',
      'Quantity Surveyor (£30k-£45k)',
      'Senior Quantity Surveyor (£45k-£65k)',
      'Chartered / Associate Director QS (£65k-£90k+)',
    ],
    similarCareers: [
      31,
      32,
      33,
      34,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'civil-engineering-beng',
        ],
        description: 'Study full-time for a degree that leads into a career as a Quantity Surveyor.',
      },
    ]
  },
  {
    id: 38,
    employmentPercentage: 0.1644, // SOC 3120: CAD, drawing and architectural technicians
    category: 'Engineering & Manufacturing',
    title: 'CAD Technician',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£20k - £35k',
    description: 'Produce technical drawings and models for engineering and manufacturing using CAD software.',
    requirements: [
      'College course in CAD',
      'Design skills',
      'Attention to detail',
      'GCSE Maths and Design',
    ],
    matchedSubjects: [
      'gcse-design-technology',
      'tlevel-engineering-manufacturing-design-development',
      'btec-engineering',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Produce CAD drawings and technical models',
      'Update designs based on engineering input',
      'Check measurements and specifications for accuracy',
      'Share drawings with teams and support production',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=cad+technician', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=cad+technician', description: 'Business & tech skills' },
    ],
    progression: [
      'Junior CAD Technician (£20k-£28k)',
      'CAD Technician (£28k-£35k)',
      'Senior CAD Technician (£35k-£45k)',
      'CAD Team Lead (£45k+)',
    ],
    similarCareers: [
      31,
      32,
      33,
      37,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'tlevel-engineering-manufacturing-design-development',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a CAD Technician.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-engineering',
        ],
        description: 'Study full-time for a degree that leads into a career as a CAD Technician.',
      },
    ]
  },
  {
    id: 39,
    employmentPercentage: 0.4097, // SOC 2142: Graphic and multimedia designers
    category: 'Creative & Media',
    title: 'Graphic Designer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£20k - £45k',
    description: 'Create visual designs for print and digital media using typography, colour and layout.',
    requirements: [
      'Portfolio and degree',
      'Creative software skills',
      'Attention to detail',
      'GCSE Art and Design',
    ],
    matchedSubjects: [
      'gcse-art-design',
      'alevel-art-design',
      'graphic-design-ba',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Create and refine visual or written content',
      'Work with teams to meet campaign and project goals',
      'Use software tools to design, edit and present work',
      'Gather feedback and improve creative deliverables',
    ],
    whereToStudy: [
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=graphic+designer', description: 'Creative & practical classes' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=graphic+designer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=graphic+designer', description: 'Business & tech skills' },
    ],
    progression: [
      'Designer Apprentice / Junior (Entry (£18k-£30k))',
      'Designer (Mid-level (£30k-£50k))',
      'Senior Designer (Senior (£45k-£70k))',
      'Lead Designer / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      40,
      41,
      42,
      43,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-art-design',
          'graphic-design-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Graphic Designer.',
      },
    ]
  },
  {
    id: 40,
    employmentPercentage: 0.3186, // SOC 3417: Photographers, audio-visual and broadcasting equipment operators
    category: 'Creative & Media',
    title: 'Video Editor',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£22k - £45k',
    description: 'Cut and assemble video content to tell stories for film, TV and online channels.',
    requirements: [
      'Editing portfolio',
      'Software proficiency',
      'Storytelling skills',
      'GCSE Media',
    ],
    matchedSubjects: [
      'gcse-media-studies',
      'btec-media',
      'film-production-ba',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Create and refine visual or written content',
      'Work with teams to meet campaign and project goals',
      'Use software tools to design, edit and present work',
      'Gather feedback and improve creative deliverables',
    ],
    whereToStudy: [
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=video+editor', description: 'Creative & practical classes' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=video+editor', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=video+editor', description: 'Business & tech skills' },
    ],
    progression: [
      'Video Editor Apprentice / Junior (Entry (£18k-£30k))',
      'Video Editor (Mid-level (£30k-£50k))',
      'Senior Video Editor (Senior (£45k-£70k))',
      'Lead Video Editor / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      39,
      41,
      42,
      43,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-media',
          'film-production-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Video Editor.',
      },
    ]
  },
  {
    id: 41,
    employmentPercentage: 0.3186, // SOC 3417: Photographers, audio-visual and broadcasting equipment operators
    category: 'Creative & Media',
    title: 'Photographer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: 'Variable',
    description: 'Capture images for editorial, commercial and creative projects with technical and artistic skill.',
    requirements: [
      'Portfolio',
      'Camera and lighting skills',
      'Creativity',
      'GCSE Art',
    ],
    matchedSubjects: [
      'gcse-art-design',
      'photography-apprenticeship',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Create and refine visual or written content',
      'Work with teams to meet campaign and project goals',
      'Use software tools to design, edit and present work',
      'Gather feedback and improve creative deliverables',
    ],
    whereToStudy: [
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=photographer', description: 'Creative & practical classes' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=photographer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=photographer', description: 'Business & tech skills' },
    ],
    progression: [
      'Photographer Apprentice / Junior (Entry (£18k-£30k))',
      'Photographer (Mid-level (£30k-£50k))',
      'Senior Photographer (Senior (£45k-£70k))',
      'Lead Photographer / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      39,
      40,
      42,
      43,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'photography-apprenticeship',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Photographer.',
      },
    ]
  },
  {
    id: 42,
    employmentPercentage: 0.4097, // SOC 2142: Graphic and multimedia designers
    category: 'Creative & Media',
    title: 'Animator',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£22k - £45k',
    description: 'Produce animation and motion graphics for games, film and multimedia projects.',
    requirements: [
      'Animation portfolio',
      'Software skills',
      'Creative storytelling',
      'GCSE Art and Computer Science',
    ],
    matchedSubjects: [
      'gcse-art-design',
      'gcse-computer-science',
      'animation-ba',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Create storyboards, character motion and animation',
      'Build scenes using animation tools and software',
      'Refine timing and visual effects for projects',
      'Collaborate with designers, directors and teams',
    ],
    whereToStudy: [
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=animator', description: 'Creative & practical classes' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=animator', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=animator', description: 'Business & tech skills' },
    ],
    progression: [
      'Junior Animator (£20k-£30k)',
      'Animator (£30k-£40k)',
      'Senior Animator (£40k-£55k)',
      'Lead Animator (£55k+)',
    ],
    similarCareers: [
      39,
      40,
      41,
      45,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'animation-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Animator.',
      },
    ]
  },
  {
    id: 43,
    employmentPercentage: 0.292, // SOC 3412: Authors, writers and translators
    category: 'Creative & Media',
    title: 'Writer/Copywriter',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£20k - £45k',
    description: 'Write engaging content for marketing, websites and brands across digital and print channels.',
    requirements: [
      'Writing portfolio',
      'Strong English skills',
      'Creativity',
      'GCSE English',
    ],
    matchedSubjects: [
      'gcse-english',
      'english-literature-ba',
      'creative-writing-ba',
      'english-language-ba',
      'alevel-english-lit',
      'alevel-english-language',
      'functional-skills-english',
      'functional-skills-english-entry-1',
      'functional-skills-english-entry-2',
      'functional-skills-english-level-1',
      'functional-skills-english-level-2',
      'gcse-english-refugee',
      'foundation-pre-sessional-english',
      'gcse-maths',
      'comparative-literature-ba',
      'academic-writing',
    ],
    dayToDay: [
      'Create and refine visual or written content',
      'Work with teams to meet campaign and project goals',
      'Use software tools to design, edit and present work',
      'Gather feedback and improve creative deliverables',
    ],
    whereToStudy: [
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=writer+copywriter', description: 'Creative & practical classes' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=writer+copywriter', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=writer+copywriter', description: 'Business & tech skills' },
    ],
    progression: [
      'WriterCopywriter Apprentice / Junior (Entry (£18k-£30k))',
      'WriterCopywriter (Mid-level (£30k-£50k))',
      'Senior WriterCopywriter (Senior (£45k-£70k))',
      'Lead WriterCopywriter / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      39,
      40,
      41,
      42,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'english-literature-ba',
          'creative-writing-ba',
          'english-language-ba',
          'alevel-english-lit',
          'alevel-english-language',
          'comparative-literature-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Writer/Copywriter.',
      },
    ]
  },
  {
    id: 44,
    employmentPercentage: 0.6244, // SOC 3554: Advertising and marketing associate professionals
    category: 'Creative & Media',
    title: 'Social Media Manager',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£22k - £45k',
    description: 'Plan social campaigns, manage content and grow audiences across digital channels.',
    requirements: [
      'Experience',
      'Digital marketing knowledge',
      'Communication skills',
      'GCSE English and Media',
    ],
    matchedSubjects: [
      'cim-marketing',
      'gcse-media-studies',
      'marketing-ba',
      'btec-media',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Create and refine visual or written content',
      'Work with teams to meet campaign and project goals',
      'Use software tools to design, edit and present work',
      'Gather feedback and improve creative deliverables',
    ],
    whereToStudy: [
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=social+media+manager', description: 'Creative & practical classes' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=social+media+manager', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=social+media+manager', description: 'Business & tech skills' },
    ],
    progression: [
      'Manager Apprentice / Junior (Entry (£18k-£30k))',
      'Manager (Mid-level (£30k-£50k))',
      'Senior Manager (Senior (£45k-£70k))',
      'Lead Manager / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      39,
      40,
      41,
      42,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'marketing-ba',
          'btec-media',
        ],
        description: 'Study full-time for a degree that leads into a career as a Social Media Manager.',
      },
    ]
  },
  {
    id: 45,
    employmentPercentage: 0.3392, // SOC 3416: Arts officers, producers and directors
    category: 'Creative & Media',
    title: 'Film/TV Producer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£25k - £60k',
    description: 'Manage production teams, budgets and schedules to bring film or television projects to life.',
    requirements: [
      'Industry experience',
      'Project coordination',
      'Networking skills',
      'GCSE Media',
    ],
    matchedSubjects: [
      'gcse-media-studies',
      'film-production-ba',
      'music-production-ba',
      'gcse-music',
      'gcse-drama',
      'btec-performing-arts',
      'btec-music',
      'btec-art-design',
      'interior-design-ba',
      'product-design-ba',
      'fashion-design-ba',
      'photography-ba',
      'theatre-performance-ba',
      'dance-ba',
      'game-design-ba',
      'alevel-photography',
      'alevel-music-technology',
      'alevel-drama-theatre',
      'alevel-film-studies',
      'alevel-graphic-communication',
      'tlevel-craft-design',
      'tlevel-media-broadcast-production',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Create and refine visual or written content',
      'Work with teams to meet campaign and project goals',
      'Use software tools to design, edit and present work',
      'Gather feedback and improve creative deliverables',
    ],
    whereToStudy: [
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=film+tv+producer', description: 'Creative & practical classes' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=film+tv+producer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=film+tv+producer', description: 'Business & tech skills' },
    ],
    progression: [
      'Producer Apprentice / Junior (Entry (£18k-£30k))',
      'Producer (Mid-level (£30k-£50k))',
      'Senior Producer (Senior (£45k-£70k))',
      'Lead Producer / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      39,
      40,
      41,
      42,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'btec-music',
          'tlevel-construction-design-surveying-planning',
          'tlevel-craft-design',
          'tlevel-media-broadcast-production',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Film/TV Producer.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'film-production-ba',
          'music-production-ba',
          'btec-performing-arts',
          'btec-art-design',
          'interior-design-ba',
          'product-design-ba',
          'fashion-design-ba',
          'photography-ba',
          'theatre-performance-ba',
          'dance-ba',
          'game-design-ba',
          'alevel-photography',
          'alevel-music-technology',
          'alevel-drama-theatre',
          'alevel-film-studies',
          'alevel-graphic-communication',
        ],
        description: 'Study full-time for a degree that leads into a career as a Film/TV Producer.',
      },
    ]
  },
  {
    id: 46,
    employmentPercentage: 1.157, // SOC 2314: Primary education teaching professionals
    category: 'Education & Training',
    title: 'Primary School Teacher',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£28k - £45k',
    description: 'Teach young children key skills, literacy and numeracy in primary school settings.',
    requirements: [
      'Degree and PGCE',
      'Classroom management',
      'Lesson planning',
      'GCSE English and Maths',
    ],
    matchedSubjects: [
      'ma-education',
      'pgce-primary',
      'gcse-english',
      'gcse-maths',
      'primary-education-ba',
    ],
    dayToDay: [
      'Prepare learning activities and teaching materials',
      'Support learners through lessons and one-to-one help',
      'Assess progress and give helpful feedback',
      'Coordinate with colleagues and support staff',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=primary+school+teacher', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=primary+school+teacher', description: 'Affordable professional courses' },
    ],
    progression: [
      'Teacher Apprentice / Junior (Entry (£18k-£30k))',
      'Teacher (Mid-level (£30k-£50k))',
      'Senior Teacher (Senior (£45k-£70k))',
      'Lead Teacher / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      47,
      48,
      49,
      1,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'primary-education-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Primary School Teacher.',
      },
    ]
  },
  {
    id: 47,
    employmentPercentage: 1.3965, // SOC 2313: Secondary education teaching professionals
    category: 'Education & Training',
    title: 'Secondary School Teacher',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£28k - £45k',
    description: 'Teach subject lessons to teenagers and support learning in secondary school classrooms.',
    requirements: [
      'Degree in subject and PGCE',
      'Subject knowledge',
      'Classroom skills',
      'A-Level in subject',
    ],
    matchedSubjects: [
      'ma-education',
      'pgce-secondary',
      'a-level-history',
      'secondary-education-ba',
      'education-studies-ba',
      'gcse-history',
      'gcse-geography',
      'gcse-religious-studies',
      'gcse-spanish',
      'gcse-french',
      'gcse-german',
      'gcse-mandarin',
      'nvq-early-years-educator',
      'special-educational-needs-ba',
      'early-childhood-education-ba',
      'tesol-tefl-ba',
      'sociology-ba',
      'politics-ba',
      'anthropology-ba',
      'archaeology-ba',
      'history-ba',
      'philosophy-ba',
      'classical-studies-ba',
      'art-history-ba',
      'linguistics-ba',
      'modern-languages-ba',
      'translation-interpreting-ba',
      'alevel-history',
      'alevel-geography',
      'alevel-politics',
      'alevel-sociology',
      'alevel-modern-languages',
      'alevel-philosophy',
      'alevel-religious-studies',
      'alevel-classical-civilisation',
      'tlevel-education-childcare',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Prepare learning activities and teaching materials',
      'Support learners through lessons and one-to-one help',
      'Assess progress and give helpful feedback',
      'Coordinate with colleagues and support staff',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=secondary+school+teacher', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=secondary+school+teacher', description: 'Affordable professional courses' },
    ],
    progression: [
      'Teacher Apprentice / Junior (Entry (£18k-£30k))',
      'Teacher (Mid-level (£30k-£50k))',
      'Senior Teacher (Senior (£45k-£70k))',
      'Lead Teacher / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      46,
      48,
      49,
      1,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'nvq-early-years-educator',
          'tlevel-education-childcare',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Secondary School Teacher.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'secondary-education-ba',
          'education-studies-ba',
          'special-educational-needs-ba',
          'early-childhood-education-ba',
          'tesol-tefl-ba',
          'sociology-ba',
          'politics-ba',
          'anthropology-ba',
          'archaeology-ba',
          'history-ba',
          'philosophy-ba',
          'classical-studies-ba',
          'art-history-ba',
          'linguistics-ba',
          'modern-languages-ba',
          'translation-interpreting-ba',
          'alevel-history',
          'alevel-geography',
          'alevel-politics',
          'alevel-sociology',
          'alevel-modern-languages',
          'alevel-philosophy',
          'alevel-religious-studies',
          'alevel-classical-civilisation',
        ],
        description: 'Study full-time for a degree that leads into a career as a Secondary School Teacher.',
      },
    ]
  },
  {
    id: 48,
    employmentPercentage: 0.8245, // SOC 6112: Teaching assistants
    category: 'Education & Training',
    title: 'Teaching Assistant',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£18k - £25k',
    description: 'Support teachers and help pupils learn through classroom assistance and one-to-one support.',
    requirements: [
      'GCSEs',
      'Level 2/3 qualification',
      'Patience',
      'GCSE English and Maths',
    ],
    matchedSubjects: [
      'gcse-english',
      'gcse-maths',
      'education-studies-ba',
    ],
    dayToDay: [
      'Prepare learning activities and teaching materials',
      'Support learners through lessons and one-to-one help',
      'Assess progress and give helpful feedback',
      'Coordinate with colleagues and support staff',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=teaching+assistant', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=teaching+assistant', description: 'Affordable professional courses' },
    ],
    progression: [
      'Assistant Apprentice / Junior (Entry (£18k-£30k))',
      'Assistant (Mid-level (£30k-£50k))',
      'Senior Assistant (Senior (£45k-£70k))',
      'Lead Assistant / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      46,
      47,
      49,
      1,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'education-studies-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Teaching Assistant.',
      },
    ]
  },
  {
    id: 49,
    employmentPercentage: 0.7927, // SOC 2311: Higher education teaching professionals
    category: 'Education & Training',
    title: 'University Lecturer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£53k - £78k',
    description: 'Teach and research at university level while shaping academic programmes and supporting students.',
    requirements: [
      'PhD and research experience',
      'Teaching ability',
      'Academic writing',
      'Degree plus postgraduate study',
    ],
    matchedSubjects: [
      'ma-education',
      'phd-computer-science',
      'phd-psychology',
      'phd-education',
      'phd-business-management',
      'phd-biological-sciences',
      'phd-physics',
      'phd-social-sciences',
      'phd-engineering',
      'university-engineering',
      'education-studies-ba',
      'psychology-bsc',
      'entrepreneurship-ba',
      'criminology-ba',
      'criminal-justice-ba',
      'speech-language-therapy-bsc',
      'psychotherapy-bsc',
      'mathematics-bsc',
      'urban-planning-ba',
      'journalism-ba',
      'youth-work-ba',
      'international-relations-ba',
      'development-studies-ba',
      'gender-studies-ba',
      'medieval-studies-ba',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Prepare learning activities and teaching materials',
      'Support learners through lessons and one-to-one help',
      'Assess progress and give helpful feedback',
      'Coordinate with colleagues and support staff',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=university+lecturer', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=university+lecturer', description: 'Affordable professional courses' },
    ],
    progression: [
      'Associate Lecturer (£30k-£38k)',
      'Lecturer (£38k-£48k)',
      'Senior Lecturer (£48k-£62k)',
      'Reader / Professor (£62k-£78k)',
    ],
    similarCareers: [
      46,
      47,
      48,
      1,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'university-engineering',
          'education-studies-ba',
          'psychology-bsc',
          'entrepreneurship-ba',
          'criminology-ba',
          'criminal-justice-ba',
          'speech-language-therapy-bsc',
          'psychotherapy-bsc',
          'mathematics-bsc',
          'urban-planning-ba',
          'journalism-ba',
          'youth-work-ba',
          'international-relations-ba',
          'development-studies-ba',
          'gender-studies-ba',
          'medieval-studies-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a University Lecturer.',
      },
    ]
  },
  {
    id: 50,
    employmentPercentage: 0.0863, // SOC 3572: Careers advisers and vocational guidance specialists
    category: 'Education & Training',
    title: 'Career Advisor',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£22k - £35k',
    description: 'Guide students and adults through career planning, job searches and training decisions.',
    requirements: [
      'Degree or QCF Level 6',
      'Counselling skills',
      'Knowledge of pathways',
      'GCSE English',
    ],
    matchedSubjects: [
      'gcse-english',
      'counselling-ba',
      'business-management-ba',
      'esol-level-1',
      'esol-level-2',
      'ielts-preparation',
      'conversation-pronunciation',
      'functional-skills-ict',
      'vocational-warehouse-logistics',
      'vocational-driving',
      'foundation-access-he-diploma',
      'foundation-international-year',
      'foundation-study-skills',
      'gcse-maths',
    ],
    dayToDay: [
      'Guide people through career and education decisions',
      'Research training and job pathways for clients',
      'Prepare development plans and interview prep',
      'Meet individuals and support their next steps',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=career+advisor', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=career+advisor', description: 'Affordable professional courses' },
    ],
    progression: [
      'Career Advisor (£22k-£30k)',
      'Senior Career Advisor (£30k-£40k)',
      'Careers Manager (£40k-£50k)',
      'Head of Careers (£50k+)',
    ],
    similarCareers: [
      90,
      11,
      16,
      49,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'vocational-warehouse-logistics',
          'vocational-driving',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Career Advisor.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'counselling-ba',
          'business-management-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Career Advisor.',
      },
    ]
  },
  {
    id: 61,
    employmentPercentage: 1.7625, // SOC 2134: Programmers and software development professionals (no distinct DevOps SOC code)
    category: 'Technology & Digital',
    title: 'DevOps Engineer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£35k - £75k',
    description: 'Bridge development and operations teams.',
    requirements: [
      'Linux + Cloud + Scripting',
      'Degree or Experience',
      'BTEC Computing',
    ],
    matchedSubjects: [
      'btec-computing',
      'alevel-compsci',
      'gcse-computer-science',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Write, test and improve software or technical solutions',
      'Fix issues and update systems with user feedback',
      'Collaborate with colleagues, designers and managers',
      'Research new tools, languages and best practices',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=devops+engineer', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=devops+engineer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=devops+engineer', description: 'Business & tech skills' },
    ],
    progression: [
      'Engineer Apprentice / Junior (Entry (£18k-£30k))',
      'Engineer (Mid-level (£30k-£50k))',
      'Senior Engineer (Senior (£45k-£70k))',
      'Lead Engineer / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      1,
      2,
      3,
      4,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-computing',
          'alevel-compsci',
        ],
        description: 'Study full-time for a degree that leads into a career as a DevOps Engineer.',
      },
    ]
  },
  {
    id: 62,
    employmentPercentage: 0.175, // SOC 3133: Database administrators and web content technicians
    category: 'Technology & Digital',
    title: 'Database Administrator',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£28k - £55k',
    description: 'Manage and optimise data storage systems.',
    requirements: [
      'SQL + Certs',
      'GCSE Computer Science',
      'BTEC IT',
    ],
    matchedSubjects: [
      'gcse-computer-science',
      'btec-it',
      'alevel-mathematics',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Manage and optimise database systems',
      'Monitor performance and run backups',
      'Support developers with data access',
      'Resolve database issues and maintain security',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=database+administrator', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=database+administrator', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=database+administrator', description: 'Business & tech skills' },
    ],
    progression: [
      'Junior DBA (£28k-£35k)',
      'Database Administrator (£35k-£50k)',
      'Senior DBA (£50k-£65k)',
      'Lead DBA (£65k+)',
    ],
    similarCareers: [
      1,
      9,
      61,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-it',
          'alevel-mathematics',
        ],
        description: 'Study full-time for a degree that leads into a career as a Database Administrator.',
      },
    ]
  },
  {
    id: 63,
    employmentPercentage: 1.7625, // SOC 2134: Programmers and software development professionals (no distinct blockchain SOC code)
    category: 'Technology & Digital',
    title: 'Blockchain Developer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£35k - £75k',
    description: 'Build decentralised applications and smart contracts.',
    requirements: [
      'Degree or Self-Taught',
      'A-Level Computer Science',
      'Degree Computer Science',
    ],
    matchedSubjects: [
      'alevel-compsci',
      'gcse-computer-science',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Build and test smart contracts and blockchain apps',
      'Secure distributed ledger systems and protocols',
      'Debug crypto transactions and blockchain logic',
      'Research new decentralised technologies and tools',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=blockchain+developer', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=blockchain+developer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=blockchain+developer', description: 'Business & tech skills' },
    ],
    progression: [
      'Junior Blockchain Developer (£35k-£45k)',
      'Blockchain Developer (£45k-£60k)',
      'Senior Blockchain Developer (£60k-£75k)',
      'Blockchain Architect (£75k+)',
    ],
    similarCareers: [
      8,
      3,
      66,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-compsci',
          'university-engineering',
        ],
        description: 'Study full-time for a degree that leads into a career as a Blockchain Developer.',
      },
    ]
  },
  {
    id: 64,
    employmentPercentage: 0.2056, // SOC 2135: Cyber security professionals
    category: 'Technology & Digital',
    title: 'Ethical Hacker',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£30k - £65k',
    description: 'Test systems for security vulnerabilities.',
    requirements: [
      'Certs + Experience',
      'GCSE Computer Science',
      'BTEC Computing',
    ],
    matchedSubjects: [
      'msc-cyber-security',
      'gcse-computer-science',
      'btec-computing',
      'tlevel-digital-support-services',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Investigate data, systems and security events',
      'Prepare reports and recommend improvements',
      'Work with stakeholders to solve technical problems',
      'Test systems, monitor performance and manage risk',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=ethical+hacker', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=ethical+hacker', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=ethical+hacker', description: 'Business & tech skills' },
    ],
    progression: [
      'Ethical Hacker Apprentice / Junior (Entry (£18k-£30k))',
      'Ethical Hacker (Mid-level (£30k-£50k))',
      'Senior Ethical Hacker (Senior (£45k-£70k))',
      'Lead Ethical Hacker / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      1,
      2,
      3,
      4,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'tlevel-digital-support-services',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Ethical Hacker.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-computing',
        ],
        description: 'Study full-time for a degree that leads into a career as a Ethical Hacker.',
      },
    ]
  },
  {
    id: 65,
    employmentPercentage: 0.2056, // SOC 2135: Cyber security professionals
    category: 'Technology & Digital',
    title: 'Digital Forensics Investigator',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£28k - £55k',
    description: 'Recover and investigate digital evidence.',
    requirements: [
      'Degree + Certs',
      'A-Level Computer Science',
      'Degree Cyber Security',
    ],
    matchedSubjects: [
      'alevel-compsci',
      'gcse-computer-science',
      'tlevel-digital-support-services',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'computer-forensics-bsc',
      'forensic-science-bsc',
      'btec-forensic-science',
    ],
    dayToDay: [
      'Investigate data, systems and security events',
      'Prepare reports and recommend improvements',
      'Work with stakeholders to solve technical problems',
      'Test systems, monitor performance and manage risk',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=digital+forensics+investigator', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=digital+forensics+investigator', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=digital+forensics+investigator', description: 'Business & tech skills' },
    ],
    progression: [
      'Digital Forensics Investigator Apprentice / Junior (Entry (£18k-£30k))',
      'Digital Forensics Investigator (Mid-level (£30k-£50k))',
      'Senior Digital Forensics Investigator (Senior (£45k-£70k))',
      'Lead Digital Forensics Investigator / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      1,
      2,
      3,
      4,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'tlevel-digital-support-services',
          'btec-forensic-science',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Digital Forensics Investigator.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-compsci',
          'computer-forensics-bsc',
          'forensic-science-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a Digital Forensics Investigator.',
      },
    ]
  },
  {
    id: 66,
    employmentPercentage: 0.2056, // SOC 2135: Cyber security professionals
    category: 'Technology & Digital',
    title: 'Cloud Security Engineer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£40k - £80k',
    description: 'Secure cloud environments and data.',
    requirements: [
      'Cloud Certs + Security',
      'Degree or Experience',
      'BTEC Computing',
    ],
    matchedSubjects: [
      'msc-cyber-security',
      'btec-computing',
      'alevel-compsci',
      'gcse-computer-science',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Secure cloud platforms and monitor threats',
      'Configure protections and access controls',
      'Investigate incidents and patch vulnerabilities',
      'Support secure deployments and governance',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=cloud+security+engineer', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=cloud+security+engineer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=cloud+security+engineer', description: 'Business & tech skills' },
    ],
    progression: [
      'Junior Cloud Security Engineer (£40k-£50k)',
      'Cloud Security Engineer (£50k-£65k)',
      'Senior Cloud Security Engineer (£65k-£80k)',
      'Lead Security Engineer (£80k+)',
    ],
    similarCareers: [
      3,
      7,
      8,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-computing',
          'alevel-compsci',
        ],
        description: 'Study full-time for a degree that leads into a career as a Cloud Security Engineer.',
      },
    ]
  },
  {
    id: 67,
    employmentPercentage: 1.7625, // SOC 2134: Programmers and software development professionals
    category: 'Technology & Digital',
    title: 'Site Reliability Engineer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£40k - £80k',
    description: 'Ensure systems run reliably at scale.',
    requirements: [
      'Coding + Systems',
      'Degree Computer Science',
      'BTEC Computing',
    ],
    matchedSubjects: [
      'alevel-compsci',
      'btec-computing',
      'gcse-computer-science',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Write, test and improve software or technical solutions',
      'Fix issues and update systems with user feedback',
      'Collaborate with colleagues, designers and managers',
      'Research new tools, languages and best practices',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=site+reliability+engineer', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=site+reliability+engineer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=site+reliability+engineer', description: 'Business & tech skills' },
    ],
    progression: [
      'Engineer Apprentice / Junior (Entry (£18k-£30k))',
      'Engineer (Mid-level (£30k-£50k))',
      'Senior Engineer (Senior (£45k-£70k))',
      'Lead Engineer / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      1,
      2,
      3,
      4,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'alevel-compsci',
          'btec-computing',
        ],
        description: 'Study full-time for a degree that leads into a career as a Site Reliability Engineer.',
      },
    ]
  },
  {
    id: 68,
    employmentPercentage: 1.7625, // SOC 2134: Programmers and software development professionals
    category: 'Technology & Digital',
    title: 'Mobile App Developer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£25k - £60k',
    description: 'Build apps for iOS and Android.',
    requirements: [
      'Degree or Bootcamp',
      'GCSE Computer Science',
      'BTEC Computing',
    ],
    matchedSubjects: [
      'gcse-computer-science',
      'btec-computing',
      'tlevel-digital-production-design-development',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Write, test and improve software or technical solutions',
      'Fix issues and update systems with user feedback',
      'Collaborate with colleagues, designers and managers',
      'Research new tools, languages and best practices',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=mobile+app+developer', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=mobile+app+developer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=mobile+app+developer', description: 'Business & tech skills' },
    ],
    progression: [
      'Developer Apprentice / Junior (Entry (£18k-£30k))',
      'Developer (Mid-level (£30k-£50k))',
      'Senior Developer (Senior (£45k-£70k))',
      'Lead Developer / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      1,
      2,
      3,
      4,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'tlevel-digital-production-design-development',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Mobile App Developer.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-computing',
        ],
        description: 'Study full-time for a degree that leads into a career as a Mobile App Developer.',
      },
    ]
  },
  {
    id: 69,
    employmentPercentage: 0.6052, // SOC 2133: IT business analysts, architects and systems designers
    category: 'Technology & Digital',
    title: 'Systems Analyst',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£28k - £55k',
    description: 'Analyse business needs and design tech solutions.',
    requirements: [
      'Degree or Experience',
      'GCSE Computer Science',
      'BTEC IT',
    ],
    matchedSubjects: [
      'computer-science-bsc',
      'gcse-computer-science',
      'btec-it',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Work on systems analyst tasks throughout the day',
      'Collaborate with colleagues and share ideas',
      'Review work, solve problems and improve outcomes',
      'Learn new techniques and stay up to date with trends',
    ],
    whereToStudy: [
      { name: 'Codecademy', url: 'https://www.codecademy.com/search?query=systems+analyst', description: 'Interactive coding courses' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=systems+analyst', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=systems+analyst', description: 'Business & tech skills' },
    ],
    progression: [
      'Analyst Apprentice / Junior (Entry (£18k-£30k))',
      'Analyst (Mid-level (£30k-£50k))',
      'Senior Analyst (Senior (£45k-£70k))',
      'Lead Analyst / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      1,
      2,
      3,
      4,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-it',
        ],
        description: 'Study full-time for a degree that leads into a career as a Systems Analyst.',
      },
    ]
  },
  {
    id: 70,
    employmentPercentage: 0.292, // SOC 3412: Authors, writers and translators
    category: 'Technology & Digital',
    title: 'Technical Writer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£22k - £45k',
    description: 'Create documentation for technical products.',
    requirements: [
      'Writing + Tech Skills',
      'GCSE English',
      'GCSE Computer Science',
    ],
    matchedSubjects: [
      'computer-science-bsc',
      'gcse-english',
      'gcse-computer-science',
      'btec-it',
      'gcse-maths',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Write, test and improve software or technical solutions',
      'Fix issues and update systems with user feedback',
      'Collaborate with colleagues, designers and managers',
      'Research new tools, languages and best practices',
    ],
    whereToStudy: [
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=technical+writer', description: 'Creative & practical classes' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=technical+writer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=technical+writer', description: 'Business & tech skills' },
    ],
    progression: [
      'Writer Apprentice / Junior (Entry (£18k-£30k))',
      'Writer (Mid-level (£30k-£50k))',
      'Senior Writer (Senior (£45k-£70k))',
      'Lead Writer / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      1,
      2,
      3,
      4,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-it',
        ],
        description: 'Study full-time for a degree that leads into a career as a Technical Writer.',
      },
    ]
  },
  {
    id: 71,
    employmentPercentage: 0.1231, // SOC 4152: Data entry administrators
    category: 'Business & Finance',
    title: 'Data Entry Clerk',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£18k - £28k',
    description: 'Enter and organise information in systems with a focus on accuracy and structure.',
    requirements: [
      'GCSE English',
      'GCSE Maths',
      'Attention to detail',
      'Keyboard skills',
    ],
    matchedSubjects: [
      'gcse-english',
      'gcse-maths',
      'btec-business',
      'esol-entry-1',
      'esol-entry-2',
      'esol-entry-3',
    ],
    dayToDay: [
      'Enter information accurately into systems',
      'Check records for errors and consistency',
      'Organise files and maintain data quality',
      'Support administrative and office tasks',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=data+entry+clerk', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=data+entry+clerk', description: 'Affordable professional courses' },
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=data+entry+clerk', description: 'Creative & practical classes' },
    ],
    progression: [
      'Junior Data Entry Clerk (£18k-£22k)',
      'Data Entry Clerk (£22k-£28k)',
      'Senior Data Entry Clerk (£28k-£35k)',
      'Office Administrator (£35k+)',
    ],
    similarCareers: [
      12,
      74,
      75,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-business',
        ],
        description: 'Study full-time for a degree that leads into a career as a Data Entry Clerk.',
      },
    ]
  },
  {
    id: 72,
    employmentPercentage: 0.4358, // SOC 4215: Personal assistants and other secretaries
    category: 'Business & Finance',
    title: 'Virtual Assistant',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£18k - £30k',
    description: 'Work remotely supporting business tasks, scheduling and communications.',
    requirements: [
      'Organisation skills',
      'Good written English',
      'IT confidence',
      'Customer service awareness',
    ],
    matchedSubjects: [
      'gcse-english',
      'gcse-maths',
      'btec-business',
    ],
    dayToDay: [
      'Analyse information and prepare clear reports',
      'Communicate with clients, colleagues and stakeholders',
      'Make decisions that support business goals',
      'Organise work and manage deadlines for projects',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=virtual+assistant', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=virtual+assistant', description: 'Affordable professional courses' },
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=virtual+assistant', description: 'Creative & practical classes' },
    ],
    progression: [
      'Assistant Apprentice / Junior (Entry (£18k-£30k))',
      'Assistant (Mid-level (£30k-£50k))',
      'Senior Assistant (Senior (£45k-£70k))',
      'Lead Assistant / Specialist (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      11,
      12,
      13,
      14,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-business',
        ],
        description: 'Study full-time for a degree that leads into a career as a Virtual Assistant.',
      },
    ]
  },
  {
    id: 73,
    employmentPercentage: 2.4954, // SOC 6135: Care workers and home carers
    category: 'Healthcare & Medicine',
    title: 'Care Assistant',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£18k - £25k',
    description: 'Provide personal care and support to people in healthcare settings.',
    requirements: [
      'Compassion',
      'Communication skills',
      'GCSE English',
      'Health and social care understanding',
    ],
    matchedSubjects: [
      'btec-health-social-care',
      'gcse-english',
      'gcse-maths',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Support daily living and personal care tasks',
      'Help patients with meals, mobility and hygiene',
      'Observe wellbeing and report changes to staff',
      'Offer companionship and emotional support',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=care+assistant', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=care+assistant', description: 'Business & tech skills' },
    ],
    progression: [
      'Care Assistant (£18k-£22k)',
      'Senior Care Assistant (£22k-£28k)',
      'Team Leader (£28k-£35k)',
      'Care Coordinator (£35k+)',
    ],
    similarCareers: [
      21,
      22,
      24,
      26,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-health-social-care',
        ],
        description: 'Study full-time for a degree that leads into a career as a Care Assistant.',
      },
    ]
  },
  {
    id: 74,
    employmentPercentage: 1.2388, // SOC 4122: Book-keepers, payroll managers and wages clerks
    category: 'Business & Finance',
    title: 'Bookkeeper',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£20k - £35k',
    description: 'Manage financial records, invoices and accounts for businesses.',
    requirements: [
      'Numeracy',
      'Attention to detail',
      'GCSE Maths',
      'Business basics',
    ],
    matchedSubjects: [
      'acca-accounting',
      'gcse-maths',
      'btec-business',
      'accounting-bsc',
      'gcse-english',
    ],
    dayToDay: [
      'Record financial transactions and process invoices',
      'Reconcile bank statements and account ledgers',
      'Prepare basic financial reports for businesses',
      'Support payroll, VAT and compliance processes',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=bookkeeper', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=bookkeeper', description: 'Affordable professional courses' },
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=bookkeeper', description: 'Creative & practical classes' },
    ],
    progression: [
      'Junior Bookkeeper (£18k-£25k)',
      'Bookkeeper (£25k-£35k)',
      'Senior Bookkeeper (£35k-£45k)',
      'Finance Administrator (£45k+)',
    ],
    similarCareers: [
      12,
      71,
      75,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-business',
          'accounting-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a Bookkeeper.',
      },
    ]
  },
  {
    id: 75,
    employmentPercentage: 0.3227, // SOC 7211: Call and contact centre occupations
    category: 'Business & Finance',
    title: 'Customer Service Advisor',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£18k - £28k',
    description: 'Support customers through enquiries and service requests, with remote options available.',
    requirements: [
      'Communication skills',
      'Customer focus',
      'GCSE English',
      'Problem solving',
    ],
    matchedSubjects: [
      'customer-service-apprenticeship',
      'gcse-english',
      'gcse-business-studies',
      'gcse-maths',
      'vocational-retail',
    ],
    dayToDay: [
      'Answer customer enquiries and resolve issues',
      'Record interactions and update case notes',
      'Work with teams to improve customer service',
      'Provide friendly support across channels',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=customer+service+advisor', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=customer+service+advisor', description: 'Affordable professional courses' },
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=customer+service+advisor', description: 'Creative & practical classes' },
    ],
    progression: [
      'Customer Service Advisor (£18k-£25k)',
      'Senior Customer Service Advisor (£25k-£32k)',
      'Team Leader (£32k-£40k)',
      'Customer Service Manager (£40k+)',
    ],
    similarCareers: [
      71,
      16,
      48,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'customer-service-apprenticeship',
          'vocational-retail',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Customer Service Advisor.',
      },
    ]
  },
  {
    id: 76,
    employmentPercentage: 0.292, // SOC 3412: Authors, writers and translators
    category: 'Creative & Media',
    title: 'Content Writer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£20k - £40k',
    description: 'Write articles, social copy and website content for online audiences.',
    requirements: [
      'Strong writing',
      'GCSE English',
      'Creativity',
      'Digital skills',
    ],
    matchedSubjects: [
      'gcse-english',
      'gcse-media-studies',
      'creative-writing-ba',
      'gcse-maths',
    ],
    dayToDay: [
      'Write articles, blogs and social content',
      'Edit and proofread copy for publication',
      'Research topics and meet content briefs',
      'Work with marketing teams to shape messaging',
    ],
    whereToStudy: [
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=content+writer', description: 'Creative & practical classes' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=content+writer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=content+writer', description: 'Business & tech skills' },
    ],
    progression: [
      'Junior Writer (£20k-£28k)',
      'Content Writer (£28k-£38k)',
      'Senior Writer (£38k-£50k)',
      'Content Lead (£50k+)',
    ],
    similarCareers: [
      43,
      44,
      48,
      75,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'creative-writing-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Content Writer.',
      },
    ]
  },
  {
    id: 79,
    employmentPercentage: 0.3969, // SOC 6221: Hairdressers and barbers
    category: 'Service & Hospitality',
    title: 'Salon Worker',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£18k - £40k',
    description: 'Work in salons and beauty settings providing hair, beauty and grooming services.',
    requirements: [
      'Relevant vocational training',
      'Practical skills',
      'Good communication',
      'Customer service or team working',
    ],
    matchedSubjects: [
      'nvq-hairdressing',
      'nvq-beauty-therapy',
      'barbering-apprenticeship',
      'tlevel-hairdressing-barbering-beauty-therapy',
      'vocational-hairdressing',
      'vocational-beauty-therapy',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Support everyday tasks and customer needs',
      'Work with colleagues to complete practical work',
      'Use skills to solve problems and support services',
      'Keep records and follow workplace procedures',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=salon+worker', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=salon+worker', description: 'Business & tech skills' },
    ],
    progression: [
      'Salon Worker Apprentice (£18k-£24k)',
      'Salon Worker (£24k-£32k)',
      'Senior Salon Worker (£32k-£40k)',
    ],
    similarCareers: [
      1,
      5,
      11,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'nvq-hairdressing',
          'nvq-beauty-therapy',
          'barbering-apprenticeship',
          'tlevel-hairdressing-barbering-beauty-therapy',
          'vocational-hairdressing',
          'vocational-beauty-therapy',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Salon Worker.',
      },
    ]
  },
  {
    id: 82,
    employmentPercentage: 0.4409, // estimated from SOC 61xx group average: Animal care worker not in this dataset - Caring personal services (SOC 61xx) average
    category: 'Agriculture & Animal Care',
    title: 'Animal Care Worker',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£18k - £40k',
    description: 'Care for animals, support farming and manage practical animal welfare tasks.',
    requirements: [
      'Relevant vocational training',
      'Practical skills',
      'Good communication',
      'Customer service or team working',
    ],
    matchedSubjects: [
      'nvq-land-based-studies',
      'horticulture-apprenticeship',
      'agriculture-apprenticeship',
      'animal-care-apprenticeship',
      'veterinary-medicine-bvetmed',
      'vocational-care-worker',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Support everyday tasks and customer needs',
      'Work with colleagues to complete practical work',
      'Use skills to solve problems and support services',
      'Keep records and follow workplace procedures',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=animal+care+worker', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=animal+care+worker', description: 'Business & tech skills' },
    ],
    progression: [
      'Animal Care Worker Apprentice (£18k-£24k)',
      'Animal Care Worker (£24k-£32k)',
      'Senior Animal Care Worker (£32k-£40k)',
    ],
    similarCareers: [
      83,
      1,
      5,
      11,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'nvq-land-based-studies',
          'horticulture-apprenticeship',
          'agriculture-apprenticeship',
          'animal-care-apprenticeship',
          'vocational-care-worker',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Animal Care Worker.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'veterinary-medicine-bvetmed',
        ],
        description: 'Study full-time for a degree that leads into a career as a Animal Care Worker.',
      },
    ]
  },
  {
    id: 83,
    employmentPercentage: 0.258, // SOC 5111: Farmers
    category: 'Agriculture & Animal Care',
    title: 'Farmer / Agricultural Worker',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£18k - £45k',
    description: 'Manage land, crops and livestock to produce food and maintain agricultural land.',
    requirements: [
      'Relevant vocational or land-based qualification',
      'Practical outdoor skills',
      'Understanding of livestock or crop management',
      'Physical fitness and problem-solving',
    ],
    matchedSubjects: [
      'agriculture-apprenticeship',
      'nvq-land-based-studies',
      'gcse-biology',
      'gcse-geography',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Plan and carry out seasonal farming or land management tasks',
      'Care for crops, livestock or agricultural equipment',
      'Monitor weather, soil and environmental conditions',
      'Keep records and follow safety and environmental regulations',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=farmer+agricultural+worker', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=farmer+agricultural+worker', description: 'Business & tech skills' },
    ],
    progression: [
      'Farm Worker / Apprentice (£18k-£24k)',
      'Farm Worker (£24k-£32k)',
      'Farm Manager (£32k-£40k)',
      'Estate / Senior Farm Manager (£40k-£45k)',
    ],
    similarCareers: [
      84,
      85,
      82,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'agriculture-apprenticeship',
          'nvq-land-based-studies',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Farmer / Agricultural Worker.',
      },
    ]
  },
  {
    id: 84,
    employmentPercentage: 0.4637, // SOC 5113: Gardeners and landscape gardeners
    category: 'Agriculture & Animal Care',
    title: 'Horticulturist',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£18k - £38k',
    description: 'Grow and care for plants, gardens and green spaces for public, private or commercial use.',
    requirements: [
      'Horticulture or land-based qualification',
      'Plant and soil knowledge',
      'Practical gardening skills',
      'Attention to detail and physical stamina',
    ],
    matchedSubjects: [
      'horticulture-apprenticeship',
      'nvq-land-based-studies',
      'gcse-biology',
      'gcse-art-design',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Plant, prune and maintain gardens, parks or nurseries',
      'Diagnose plant health issues and pests',
      'Design or advise on planting schemes',
      'Operate horticultural tools and equipment safely',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=horticulturist', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=horticulturist', description: 'Business & tech skills' },
    ],
    progression: [
      'Horticulture Apprentice (£18k-£22k)',
      'Gardener / Horticulturist (£22k-£28k)',
      'Senior Horticulturist (£28k-£34k)',
      'Head Gardener / Grounds Manager (£34k-£38k)',
    ],
    similarCareers: [
      83,
      85,
      82,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'horticulture-apprenticeship',
          'nvq-land-based-studies',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Horticulturist.',
      },
    ]
  },
  {
    id: 85,
    employmentPercentage: 0.0765, // SOC 3240: Veterinary nurses
    category: 'Agriculture & Animal Care',
    title: 'Veterinary Nurse',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£20k - £35k',
    description: 'Support veterinary surgeons with animal care, treatment and welfare in clinical settings.',
    requirements: [
      'Veterinary nursing qualification or degree',
      'Animal handling experience',
      'Compassion and attention to detail',
      'Ability to work in clinical environments',
    ],
    matchedSubjects: [
      'veterinary-medicine-bvetmed',
      'animal-care-apprenticeship',
      'gcse-biology',
      'gcse-chemistry',
      'gcse-science-combined',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Assist vets with examinations, treatments and surgery',
      'Monitor and care for animals recovering from treatment',
      'Support pet owners with advice and aftercare',
      'Maintain clinical records and equipment',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=veterinary+nurse', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=veterinary+nurse', description: 'Business & tech skills' },
    ],
    progression: [
      'Trainee Veterinary Nurse (£18k-£22k)',
      'Veterinary Nurse (£22k-£28k)',
      'Senior Veterinary Nurse (£28k-£32k)',
      'Head Veterinary Nurse / Practice Manager (£32k-£35k)',
    ],
    similarCareers: [
      83,
      84,
      82,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'animal-care-apprenticeship',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Veterinary Nurse.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'veterinary-medicine-bvetmed',
        ],
        description: 'Study full-time for a degree that leads into a career as a Veterinary Nurse.',
      },
    ]
  },
  {
    id: 86,
    employmentPercentage: 0.6481, // SOC 5434: Chefs
    category: 'Service & Hospitality',
    title: 'Chef',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£18k - £45k',
    description: 'Prepare and cook food to a high standard in restaurants, hotels or catering settings.',
    requirements: [
      'Culinary training or apprenticeship',
      'Food hygiene and safety knowledge',
      'Creativity and attention to detail',
      'Ability to work under pressure',
    ],
    matchedSubjects: [
      'chef-apprenticeship',
      'nvq-catering-professional-cookery',
      'culinary-arts-ba',
      'gcse-food-technology',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Prepare, cook and present dishes to a high standard',
      'Manage kitchen stock, hygiene and safety',
      'Work as part of a fast-paced kitchen team',
      'Develop menus and refine recipes',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=chef', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=chef', description: 'Business & tech skills' },
    ],
    progression: [
      'Commis Chef (£18k-£22k)',
      'Chef de Partie (£22k-£28k)',
      'Sous Chef (£28k-£36k)',
      'Head Chef (£36k-£45k)',
    ],
    similarCareers: [
      171,
      87,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'chef-apprenticeship',
          'nvq-catering-professional-cookery',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Chef.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'culinary-arts-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Chef.',
      },
    ]
  },
  {
    id: 87,
    employmentPercentage: 0.2053, // SOC 3557: Events managers and organisers
    category: 'Service & Hospitality',
    title: 'Event Manager',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£22k - £45k',
    description: 'Plan and deliver events, from corporate conferences to weddings and festivals.',
    requirements: [
      'Event management qualification or degree',
      'Organisation and project management skills',
      'Strong communication and negotiation',
      'Ability to manage budgets and suppliers',
    ],
    matchedSubjects: [
      'event-management-ba',
      'tourism-management-ba',
      'hotel-hospitality-management-ba',
      'btec-travel-tourism',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Plan event logistics, timelines and budgets',
      'Liaise with venues, suppliers and clients',
      'Coordinate staff and manage events on the day',
      'Evaluate events and manage post-event feedback',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=event+manager', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=event+manager', description: 'Business & tech skills' },
    ],
    progression: [
      'Event Assistant (£20k-£24k)',
      'Event Coordinator (£24k-£30k)',
      'Event Manager (£30k-£38k)',
      'Senior / Head of Events (£38k-£45k)',
    ],
    similarCareers: [
      174,
      86,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'event-management-ba',
          'tourism-management-ba',
          'hotel-hospitality-management-ba',
          'btec-travel-tourism',
        ],
        description: 'Study full-time for a degree that leads into a career as a Event Manager.',
      },
    ]
  },
  {
    id: 88,
    employmentPercentage: 0.3168, // SOC 3432: Sports coaches, instructors and officials
    category: 'Sport & Leisure',
    title: 'Sports Coach / Personal Trainer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£18k - £40k',
    description: 'Coach individuals or teams to improve fitness, sporting performance and healthy habits.',
    requirements: [
      'Sports coaching or personal training qualification',
      'Strong communication and motivational skills',
      'Knowledge of fitness, health and safety',
      'First aid certification',
    ],
    matchedSubjects: [
      'personal-training',
      'sports-coaching-apprenticeship',
      'btec-sport',
      'leisure-management-apprenticeship',
      'alevel-physical-education',
      'gcse-pe',
      'exercise-physiology-bsc',
      'coaching-sports-development-bsc',
      'sports-therapy-bsc',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Plan and deliver coaching or training sessions',
      'Assess fitness levels and set goals with clients',
      'Motivate individuals or teams to improve performance',
      'Track progress and adapt training programmes',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=sports+coach+personal+trainer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=sports+coach+personal+trainer', description: 'Business & tech skills' },
    ],
    progression: [
      'Trainee Coach / Assistant (£18k-£22k)',
      'Sports Coach / Personal Trainer (£22k-£28k)',
      'Senior Coach (£28k-£34k)',
      'Head Coach / Performance Director (£34k-£40k)',
    ],
    similarCareers: [
      25,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'personal-training',
          'sports-coaching-apprenticeship',
          'leisure-management-apprenticeship',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Sports Coach / Personal Trainer.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-sport',
          'alevel-physical-education',
          'exercise-physiology-bsc',
          'coaching-sports-development-bsc',
          'sports-therapy-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a Sports Coach / Personal Trainer.',
      },
    ]
  },
  {
    id: 89,
    employmentPercentage: 0.2396, // estimated from SOC 53xx group average: Generic construction trades - Skilled construction trades (SOC 53xx) average
    category: 'Construction & Trades',
    title: 'Construction Trades Worker',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    salary: '£20k - £42k',
    description: 'Build, install and maintain structures using skilled trade techniques such as plumbing, electrics or carpentry.',
    requirements: [
      'Relevant NVQ or trade apprenticeship',
      'Practical, hands-on skills',
      'Understanding of health and safety on site',
      'Physical fitness and attention to detail',
    ],
    matchedSubjects: [
      'nvq-plumbing',
      'nvq-electrical-installation',
      'nvq-carpentry',
      'btec-construction',
      'bricklaying-apprenticeship',
      'gcse-maths',
      'gcse-design-technology',
      'gcse-english',
    ],
    dayToDay: [
      'Install, repair or build structures and systems on site',
      'Read plans and technical drawings',
      'Follow safety regulations and site procedures',
      'Work with tools, materials and other tradespeople',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=construction+trades+worker', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=construction+trades+worker', description: 'Business & tech skills' },
    ],
    progression: [
      'Trade Apprentice (£18k-£24k)',
      'Qualified Tradesperson (£24k-£32k)',
      'Senior Tradesperson / Supervisor (£32k-£38k)',
      'Self-employed / Contracts Manager (£38k-£42k)',
    ],
    similarCareers: [
      31,
      38,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'nvq-plumbing',
          'nvq-electrical-installation',
          'nvq-carpentry',
          'bricklaying-apprenticeship',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Construction Trades Worker.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-construction',
        ],
        description: 'Study full-time for a degree that leads into a career as a Construction Trades Worker.',
      },
    ]
  },
  {
    id: 90,
    employmentPercentage: 0.5846, // SOC 3312: Police officers (sergeant and below)
    category: 'Public Services',
    title: 'Police & Public Services Officer',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£20k - £45k',
    description: 'Protect and support the public through policing, fire and rescue or wider public service roles.',
    requirements: [
      'Public services qualification or relevant apprenticeship',
      'Physical fitness and resilience',
      'Strong communication and teamwork',
      'Commitment to public safety and community support',
    ],
    matchedSubjects: [
      'btec-public-services',
      'police-apprenticeship',
      'firefighter-apprenticeship',
      'military-apprenticeship',
      'vocational-security-guard',
      'policing-criminal-investigation-bsc',
      'fire-rescue-bsc',
      'emergency-planning-bsc',
      'disaster-management-bsc',
      'public-administration-ba',
      'local-government-management-ba',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Respond to incidents and support public safety',
      'Patrol, investigate or manage emergency situations',
      'Work closely with communities and other agencies',
      'Complete reports and follow legal procedures',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=police+and+public+services+officer', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=police+and+public+services+officer', description: 'Affordable professional courses' },
    ],
    progression: [
      'Trainee / Cadet (£20k-£24k)',
      'Officer (£24k-£32k)',
      'Senior Officer / Sergeant (£32k-£40k)',
      'Inspector / Senior Management (£40k-£45k)',
    ],
    similarCareers: [
      50,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'police-apprenticeship',
          'firefighter-apprenticeship',
          'military-apprenticeship',
          'vocational-security-guard',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Police & Public Services Officer.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'btec-public-services',
          'policing-criminal-investigation-bsc',
          'fire-rescue-bsc',
          'emergency-planning-bsc',
          'disaster-management-bsc',
          'public-administration-ba',
          'local-government-management-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Police & Public Services Officer.',
      },
    ]
  },
  {
    id: 91,
    employmentPercentage: 0.2228, // SOC 2162: Other researchers, unspecified discipline
    category: 'Science & Research',
    title: 'Science Researcher',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£24k - £55k',
    description: 'Investigate scientific questions through research, experiments and data analysis across specialist fields.',
    requirements: [
      'Science degree in a relevant specialism',
      'Strong analytical and research skills',
      'Attention to detail and scientific method',
      'Report writing and data analysis',
    ],
    matchedSubjects: [
      'msc-data-science',
      'msc-public-health',
      'phd-computer-science',
      'phd-psychology',
      'phd-engineering',
      'phd-biological-sciences',
      'phd-physics',
      'phd-social-sciences',
      'biochemistry-bsc',
      'microbiology-bsc',
      'forensic-science-bsc',
      'environmental-science-bsc',
      'marine-biology-bsc',
      'astrophysics-bsc',
      'geology-bsc',
      'meteorology-bsc',
      'materials-science-bsc',
      'gcse-biology',
      'gcse-chemistry',
      'gcse-physics',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Design and carry out experiments or field research',
      'Analyse data and interpret scientific results',
      'Write reports and share findings with peers',
      'Keep up to date with developments in the field',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=science+researcher', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=science+researcher', description: 'Business & tech skills' },
    ],
    progression: [
      'Research Assistant (£24k-£30k)',
      'Research Scientist (£30k-£40k)',
      'Senior Researcher (£40k-£50k)',
      'Principal Scientist / Research Lead (£50k-£55k)',
    ],
    similarCareers: [
      49,
      21,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'biochemistry-bsc',
          'microbiology-bsc',
          'forensic-science-bsc',
          'environmental-science-bsc',
          'marine-biology-bsc',
          'astrophysics-bsc',
          'geology-bsc',
          'meteorology-bsc',
          'materials-science-bsc',
        ],
        description: 'Study full-time for a degree that leads into a career as a Science Researcher.',
      },
    ]
  },
  {
    id: 92,
    employmentPercentage: 0.6084, // SOC 2412: Solicitors and lawyers
    category: 'Business & Finance',
    title: 'Legal Advisor',
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    salary: '£26k - £70k',
    description: 'Provide legal advice and support to individuals, businesses or organisations on rights and regulations.',
    requirements: [
      'Law degree (LLB) or legal qualification',
      'Strong analytical and communication skills',
      'Attention to detail and integrity',
      'Professional legal training (e.g. SQE)',
    ],
    matchedSubjects: [
      'gdl-law-conversion',
      'law-llb',
      'alevel-law',
      'business-law-llb',
      'international-law-llb',
      'tlevel-legal-services',
      'gcse-english',
      'gcse-maths',
    ],
    dayToDay: [
      'Research legal issues and prepare advice or documents',
      'Support clients or colleagues with legal queries',
      'Review contracts, regulations and compliance matters',
      'Represent or support cases as required',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=legal+advisor', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=legal+advisor', description: 'Affordable professional courses' },
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=legal+advisor', description: 'Creative & practical classes' },
    ],
    progression: [
      'Paralegal / Trainee (£22k-£30k)',
      'Legal Advisor (£30k-£42k)',
      'Senior Legal Advisor / Associate (£42k-£58k)',
      'Solicitor / Legal Counsel (£58k-£70k)',
    ],
    similarCareers: [
      18,
      11,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'tlevel-legal-services',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Legal Advisor.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'law-llb',
          'alevel-law',
          'business-law-llb',
          'international-law-llb',
        ],
        description: 'Study full-time for a degree that leads into a career as a Legal Advisor.',
      },
    ]
  },
  {
    id: 93,
    employmentPercentage: 0.2776, // estimated from SOC 21xx group average: Renewable energy engineer not in this dataset - Science/Engineering professionals (SOC 21xx) average
    category: 'Engineering & Manufacturing',
    title: 'Renewable Energy Engineer',
    salary: '£32k - £58k',
    description: "Design, install and maintain renewable energy systems such as wind, solar and hydro to support the UK's transition to clean power.",
    requirements: [
      'Degree in engineering or renewable energy',
      'Understanding of electrical or mechanical systems',
      'Problem-solving skills',
      'A-Level Maths and Physics',
    ],
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    matchedSubjects: [
      'msc-renewable-energy-engineering',
      'renewable-energy-engineering-beng',
      'university-engineering',
      'btec-engineering',
      'alevel-environmental-science',
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
    ],
    dayToDay: [
      'Design and model renewable energy systems',
      'Oversee installation of wind, solar or hydro infrastructure',
      'Test and maintain equipment for efficiency and safety',
      'Work with engineers and planners on green energy projects',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=renewable+energy+engineer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=renewable+energy+engineer', description: 'Business & tech skills' },
    ],
    progression: [
      'Graduate Renewable Energy Engineer (£28k-£35k)',
      'Renewable Energy Engineer (£35k-£48k)',
      'Senior Renewable Energy Engineer (£48k-£58k)',
      'Principal Engineer / Project Lead (£58k+)',
    ],
    similarCareers: [
      33,
      35,
      31,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'renewable-energy-engineering-beng',
          'university-engineering',
        ],
        description: 'Study full-time for a degree that leads into a career as a Renewable Energy Engineer.',
      },
    ]
  },
  {
    id: 94,
    employmentPercentage: 0.9318, // SOC 1150: Managers and directors in retail and wholesale
    category: 'Service & Hospitality',
    title: 'Retail Manager',
    salary: '£24k - £40k',
    description: 'Run the day-to-day operations of a retail store, leading staff, managing stock and driving sales performance.',
    requirements: [
      'Experience in retail or customer service',
      'Leadership and people management skills',
      'Commercial awareness',
      'GCSEs including Maths and English',
    ],
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
    ],
    matchedSubjects: [
      'vocational-retail',
      'btec-business',
      'btec-hospitality',
      'customer-service-apprenticeship',
      'gcse-business-studies',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Lead and motivate a team of retail staff',
      'Manage stock, merchandising and store presentation',
      'Monitor sales performance against targets',
      'Handle customer queries and resolve issues',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=retail+manager', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=retail+manager', description: 'Business & tech skills' },
    ],
    progression: [
      'Assistant Manager (£20k-£26k)',
      'Retail Manager (£26k-£34k)',
      'Senior / Area Manager (£34k-£40k)',
      'Regional Manager (£40k+)',
    ],
    similarCareers: [
      87,
      17,
      171,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'vocational-retail',
          'customer-service-apprenticeship',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming a Retail Manager.',
      },
    ]
  },
  {
    id: 95,
    employmentPercentage: 0.3112, // estimated from SOC 41xx group average: Generic administrative assistant not in this dataset - Administrative occupations (SOC 41xx) average
    category: 'Business & Finance',
    title: 'Administrative Assistant',
    salary: '£19k - £28k',
    description: 'Provide day-to-day administrative support to a team or organisation, keeping schedules, records and communications running smoothly.',
    requirements: [
      'GCSEs including Maths and English',
      'Strong organisation and IT skills',
      'Good written and verbal communication',
      'Attention to detail',
    ],
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    matchedSubjects: [
      'nvq-business-administration',
      'btec-business',
      'gcse-business-studies',
      'gcse-maths',
      'gcse-english',
    ],
    dayToDay: [
      'Manage diaries, emails and correspondence',
      'Organise meetings and take minutes',
      'Maintain accurate records and files',
      'Support colleagues with day-to-day office tasks',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=administrative+assistant', description: 'Business & tech skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=administrative+assistant', description: 'Affordable professional courses' },
    ],
    progression: [
      'Junior Administrator (£19k-£22k)',
      'Administrative Assistant (£22k-£25k)',
      'Senior Administrator / Office Manager (£25k-£28k)',
      'Executive Assistant (£28k+)',
    ],
    similarCareers: [
      72,
      75,
      16,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '2-4 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'nvq-business-administration',
        ],
        description: 'Learn on the job through an apprenticeship or vocational course while working toward becoming an Administrative Assistant.',
      },
    ]
  },
  {
    id: 96,
    employmentPercentage: 0.1645, // SOC 2492: Newspaper and periodical broadcast journalists and reporters
    category: 'Creative & Media',
    title: 'Print Journalist',
    salary: '£20k - £38k',
    description: 'Research, write and edit news and feature stories for newspapers, magazines and online publications.',
    requirements: [
      'Degree in journalism, English or a related subject',
      'Strong writing and research skills',
      'Shorthand and media law knowledge (NCTJ)',
      'GCSE English',
    ],
    supportTags: [
      'Disability Confident employer',
      'Access to Work eligible',
      'Accessible',
      'Flexible hours',
      'Remote friendly',
      'Work from home',
    ],
    matchedSubjects: [
      'journalism-ba',
      'gcse-media-studies',
      'btec-media',
      'gcse-english',
      'gcse-maths',
    ],
    dayToDay: [
      'Research and investigate news stories',
      'Interview sources and gather information',
      'Write and edit articles to deadline',
      'Work with editors to shape coverage',
    ],
    whereToStudy: [
      { name: 'Skillshare', url: 'https://www.skillshare.com/search?query=journalism', description: 'Creative & practical classes' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=journalism', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=journalism', description: 'Business & tech skills' },
    ],
    progression: [
      'Trainee Reporter (£20k-£24k)',
      'Journalist (£24k-£30k)',
      'Senior Journalist / Correspondent (£30k-£38k)',
      'Editor (£38k+)',
    ],
    similarCareers: [
      43,
      76,
      45,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'journalism-ba',
        ],
        description: 'Study full-time for a degree that leads into a career as a Print Journalist.',
      },
    ]
  },
  {
    id: 97,
    employmentPercentage: 0.3237, // SOC 1111: Chief executives and senior officials
    category: 'Business & Finance',
    title: 'Chief Executive / Senior Official',
    salary: '£100k - £200k+',
    description: 'Set the strategic direction of an organisation and take ultimate accountability for its performance, people and results.',
    requirements: [
      'Degree (often an MBA or postgraduate qualification)',
      '10-15+ years of progressively senior management experience',
      'Proven track record leading teams and budgets',
      'Strong strategic and financial judgement',
    ],
    matchedSubjects: [
      'business-management-ba',
      'mba',
      'msc-management',
      'dba-business-administration',
      'alevel-business-studies',
      'gcse-business-studies',
    ],
    dayToDay: [
      'Set organisational strategy and long-term goals',
      'Report to a board or shareholders on performance',
      'Lead senior management team meetings',
      'Represent the organisation externally to investors, press and partners',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Chief%20Executive%20%2F%20Senior%20Official', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Chief%20Executive%20%2F%20Senior%20Official', description: 'Business & tech skills' },
    ],
    progression: [
      'Manager (£35k-£55k)',
      'Senior Manager / Head of Department (£55k-£85k)',
      'Director (£85k-£130k)',
      'Chief Executive / Senior Official (£130k-£200k+)',
    ],
    similarCareers: [
      98,
      102,
      124,
      123,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree + MBA Route',
        duration: '3-4 years degree + 1-2 years MBA',
        cost: 'Higher cost - tuition fees apply (student finance available for first degree)',
        entryRequirements: 'A-Levels or BTEC Level 3, then several years of management experience before an MBA',
        subjects: [
          'business-management-ba',
          'mba',
        ],
        description: 'Study business or a related degree, build up management experience, then take an MBA to accelerate into senior leadership.',
      },
    ]
  },
  {
    id: 98,
    employmentPercentage: 0.7331, // SOC 1132: Marketing, sales and advertising directors
    category: 'Business & Finance',
    title: 'Marketing, Sales & Advertising Director',
    salary: '£94k - £180k+',
    description: 'Own the commercial strategy for how an organisation reaches customers, spanning brand, marketing, advertising and sales performance.',
    requirements: [
      'Degree in marketing, business or a related field',
      '8-12+ years in marketing or sales, including management experience',
      'Strong commercial and budget management skills',
      'Track record of hitting growth or revenue targets',
    ],
    matchedSubjects: [
      'marketing-ba',
      'cim-marketing',
      'msc-marketing',
      'business-management-ba',
      'alevel-business-studies',
    ],
    dayToDay: [
      'Set marketing and sales strategy across channels',
      'Own budgets for advertising and campaigns',
      'Manage and mentor marketing and sales teams',
      'Report on growth, revenue and brand performance to the board',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Marketing%2C%20Sales%20%26%20Advertising%20Director', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Marketing%2C%20Sales%20%26%20Advertising%20Director', description: 'Business & tech skills' },
    ],
    progression: [
      'Marketing / Sales Executive (£24k-£32k)',
      'Marketing / Sales Manager (£32k-£55k)',
      'Head of Marketing / Sales (£55k-£90k)',
      'Marketing, Sales & Advertising Director (£90k-£180k+)',
    ],
    similarCareers: [
      97,
      102,
      121,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'marketing-ba',
          'cim-marketing',
        ],
        description: 'Study marketing or business, then build a track record in marketing or sales roles on the way to a director-level post.',
      },
    ]
  },
  {
    id: 99,
    employmentPercentage: 0.4298, // SOC 1137: Information technology directors
    category: 'Technology & Digital',
    title: 'IT Director / CIO',
    salary: '£92k - £160k+',
    description: 'Own the technology strategy for an organisation, from infrastructure and security to digital transformation and IT budgets.',
    requirements: [
      'Degree in computer science or a related field (or equivalent experience)',
      '10+ years in IT, including senior technical leadership',
      'Experience managing large technology budgets and teams',
      'Strong understanding of cyber security and digital strategy',
    ],
    matchedSubjects: [
      'computer-science-bsc',
      'msc-computer-science',
      'mba',
      'cissp-certification',
      'aws-solutions-architect',
      'azure-solutions-architect',
    ],
    dayToDay: [
      'Set the technology strategy and roadmap',
      'Own IT budgets and vendor relationships',
      'Oversee cyber security and data governance',
      'Report to the board on technology risk and opportunity',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=IT%20Director%20%2F%20CIO', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=IT%20Director%20%2F%20CIO', description: 'Business & tech skills' },
    ],
    progression: [
      'Software Developer / IT Analyst (£25k-£40k)',
      'IT Manager / Team Lead (£40k-£65k)',
      'Head of IT (£65k-£100k)',
      'IT Director / CIO (£100k-£160k+)',
    ],
    similarCareers: [
      119,
      120,
      128,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years degree + 8-10 years experience',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'computer-science-bsc',
          'msc-computer-science',
        ],
        description: 'Study computer science, build up technical and leadership experience, and progress into IT leadership roles.',
      },
    ]
  },
  {
    id: 100,
    employmentPercentage: 0.4794, // SOC 2212: Specialist medical practitioners
    category: 'Healthcare & Medicine',
    title: 'Specialist Medical Practitioner (Consultant Doctor)',
    salary: '£93k - £169k',
    description: 'Lead the diagnosis and treatment of patients within a chosen medical specialism as a fully qualified hospital consultant.',
    requirements: [
      'Medicine degree (MBBS) recognised by the GMC',
      'Foundation training plus specialty training (typically 8-10 years post-degree)',
      'Membership of the relevant Royal College',
      'GMC registration with a licence to practise',
    ],
    matchedSubjects: [
      'medicine-mbbs',
      'medicine-graduate-entry',
      'alevel-biology',
      'alevel-chemistry',
    ],
    dayToDay: [
      'Diagnose and treat patients within a specialism',
      'Lead a clinical team including junior doctors',
      'Make senior decisions on complex cases',
      'Contribute to research, teaching and service improvement',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Specialist%20Medical%20Practitioner%20(Consultant%20Doctor)', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Specialist%20Medical%20Practitioner%20(Consultant%20Doctor)', description: 'Business & tech skills' },
    ],
    progression: [
      'Foundation Doctor (£29k-£34k)',
      'Specialty Registrar (£40k-£60k)',
      'Senior Registrar (£60k-£75k)',
      'Consultant / Specialist Medical Practitioner (£93k-£169k)',
    ],
    similarCareers: [
      125,
      126,
      127,
      128,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Medicine Degree Route',
        duration: '5-6 years degree + 8-10 years specialty training',
        cost: 'Higher cost - tuition fees apply (NHS bursaries available in later years)',
        entryRequirements: 'A-Levels including Chemistry and Biology, plus UCAT/BMAT and interview',
        subjects: [
          'medicine-mbbs',
          'alevel-biology',
          'alevel-chemistry',
        ],
        description: 'Complete a medicine degree, foundation training and specialty training to qualify as a consultant.',
      },
      {
        type: 'university',
        name: 'Graduate Entry Medicine Route',
        duration: '4 years degree + 8-10 years specialty training',
        cost: 'Higher cost - tuition fees apply (NHS bursaries available)',
        entryRequirements: 'An existing science-related degree, plus GAMSAT/UCAT and interview',
        subjects: [
          'medicine-graduate-entry',
        ],
        description: 'For graduates of another discipline, an accelerated medicine degree followed by the same specialty training route.',
      },
    ]
  },
  {
    id: 101,
    employmentPercentage: 0.0983, // SOC 3511: Aircraft pilots and air traffic controllers
    category: 'Engineering & Manufacturing',
    title: 'Aircraft Pilot / Air Traffic Controller',
    salary: '£83k - £150k+',
    description: 'Fly commercial aircraft or direct air traffic safely through controlled airspace, both requiring years of licensed, safety-critical training.',
    requirements: [
      'ATPL (pilots) or NATS air traffic control licence',
      'Rigorous medical, aptitude and background checks',
      'Extensive simulator and supervised operational training',
      'Ongoing recurrent training and licence checks',
    ],
    matchedSubjects: [
      'atpl-pilot-training',
      'nats-air-traffic-control',
      'alevel-mathematics',
      'alevel-physics',
    ],
    dayToDay: [
      'Fly scheduled routes or direct aircraft movements safely',
      'Follow strict safety procedures and checklists',
      'Communicate constantly with crew, controllers or pilots',
      'Complete regular simulator assessments and recurrent training',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Aircraft%20Pilot%20%2F%20Air%20Traffic%20Controller', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Aircraft%20Pilot%20%2F%20Air%20Traffic%20Controller', description: 'Business & tech skills' },
    ],
    progression: [
      'Trainee Pilot / Trainee Controller (£25k-£35k)',
      'First Officer / Air Traffic Controller (£45k-£70k)',
      'Senior First Officer / Watch Manager (£70k-£100k)',
      'Captain / Senior Air Traffic Controller (£100k-£150k+)',
    ],
    similarCareers: [
      103,
      128,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'ATPL / NATS Training Route',
        duration: '2-3 years',
        cost: 'Very high cost for pilot training (loans/sponsorship available); NATS training is salaried',
        entryRequirements: 'GCSEs including Maths and English, strict medical standard, aptitude testing',
        subjects: [
          'atpl-pilot-training',
          'nats-air-traffic-control',
        ],
        description: 'Complete integrated flight training (ATPL) or the NATS-run air traffic control training programme - neither requires a degree.',
      },
    ]
  },
  {
    id: 102,
    employmentPercentage: 1.2402, // SOC 1131: Financial managers and directors
    category: 'Business & Finance',
    title: 'Financial Manager / Director',
    salary: '£76k - £150k+',
    description: 'Own an organisation\'s financial planning, reporting and controls, sitting on the leadership team as its senior finance lead.',
    requirements: [
      'Professional accountancy qualification (ACA, ACCA or CIMA)',
      '8-10+ years in finance, including management experience',
      'Strong financial reporting and strategic planning skills',
      'Experience presenting to senior leadership or a board',
    ],
    matchedSubjects: [
      'icaew-aca',
      'acca-accounting',
      'cima-management-accounting',
      'accounting-bsc',
      'finance-bsc',
    ],
    dayToDay: [
      'Oversee financial reporting, budgeting and forecasting',
      'Manage a finance team and set financial controls',
      'Advise the board on financial strategy and risk',
      'Liaise with auditors, banks and investors',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Financial%20Manager%20%2F%20Director', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Financial%20Manager%20%2F%20Director', description: 'Business & tech skills' },
    ],
    progression: [
      'Trainee Accountant (£22k-£30k)',
      'Qualified Accountant (£35k-£55k)',
      'Finance Manager (£55k-£85k)',
      'Financial Manager / Director (£85k-£150k+)',
    ],
    similarCareers: [
      124,
      123,
      97,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'Degree + Professional Qualification Route',
        duration: '3-4 years degree + 3-4 years training contract',
        cost: 'Higher cost - tuition fees apply (training contracts are usually salaried)',
        entryRequirements: 'A-Levels or BTEC Level 3, then a graduate training contract',
        subjects: [
          'accounting-bsc',
          'icaew-aca',
          'acca-accounting',
        ],
        description: 'Study accounting or finance, then qualify as a chartered accountant while working, progressing toward a director-level finance role.',
      },
    ]
  },
  {
    id: 103,
    employmentPercentage: 0.0977, // SOC 8231: Train and tram drivers
    category: 'Public Services',
    title: 'Train / Tram Driver',
    salary: '£76k - £90k+',
    description: 'Operate passenger or freight trains and trams safely on the rail or tram network, a highly-trained, safety-critical role with no degree required.',
    requirements: [
      'Full UK driving licence and clean record',
      'Pass rail-specific medical, aptitude and colour vision tests',
      'Complete employer-led driver training programme',
      'Ongoing route knowledge and safety recertification',
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'vocational-driving',
    ],
    dayToDay: [
      'Drive trains or trams safely to a strict timetable',
      'Respond correctly to signals and safety systems',
      'Communicate with control centres and station staff',
      'Complete pre and post-service safety checks',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Train%20%2F%20Tram%20Driver', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Train%20%2F%20Tram%20Driver', description: 'Business & tech skills' },
    ],
    progression: [
      'Trainee Driver (£25k-£30k)',
      'Qualified Driver (£40k-£55k)',
      'Senior / Mainline Driver (£55k-£70k)',
      'Senior Driver / Driver Manager (£70k-£90k+)',
    ],
    similarCareers: [
      101,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Employer Training Route',
        duration: '6-12 months',
        cost: 'Low cost - salaried while training',
        entryRequirements: 'GCSEs (English & Maths), full driving licence, pass medical and aptitude tests - no degree needed',
        subjects: [
          'gcse-maths',
          'gcse-english',
        ],
        description: 'Train directly with a train or tram operator - almost all drivers qualify through in-house training rather than university.',
      },
    ]
  },
  {
    id: 104,
    employmentPercentage: 0.1296, // SOC 1133: Public relations and communications directors
    category: 'Business & Finance',
    title: 'PR / Communications Director',
    salary: '£73k - £130k+',
    description: 'Lead an organisation\'s public image, media relations and internal communications strategy at the most senior level.',
    requirements: [
      'Degree in communications, journalism, marketing or a related field',
      '8-10+ years in PR or communications, including management experience',
      'Strong media relations and crisis communications skills',
      'Experience advising senior leadership',
    ],
    matchedSubjects: [
      'journalism-ba',
      'marketing-ba',
      'business-management-ba',
      'alevel-english-language',
    ],
    dayToDay: [
      'Set the communications and media strategy',
      'Manage media relationships and crisis communication',
      'Oversee internal and external messaging',
      'Advise senior leadership on reputation and public image',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=PR%20%2F%20Communications%20Director', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=PR%20%2F%20Communications%20Director', description: 'Business & tech skills' },
    ],
    progression: [
      'PR / Communications Assistant (£22k-£28k)',
      'PR / Communications Manager (£30k-£50k)',
      'Head of Communications (£50k-£80k)',
      'PR / Communications Director (£80k-£130k+)',
    ],
    similarCareers: [
      98,
      97,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'journalism-ba',
          'marketing-ba',
        ],
        description: 'Study communications, journalism or marketing, then build experience through PR and comms roles toward a director-level post.',
      },
    ]
  },
  {
    id: 105,
    employmentPercentage: 0.1371, // SOC 2321: Head teachers and principals
    category: 'Education & Training',
    title: 'Head Teacher / Principal',
    salary: '£72k - £120k+',
    description: 'Lead a school as its most senior member of staff, responsible for educational standards, staff, budgets and pupil outcomes.',
    requirements: [
      'Qualified Teacher Status (QTS)',
      'National Professional Qualification for Headship (NPQH)',
      '10+ years of teaching and senior leadership experience',
      'Strong people management and budget skills',
    ],
    matchedSubjects: [
      'pgce-primary',
      'pgce-secondary',
      'primary-education-ba',
      'secondary-education-ba',
      'ma-education',
    ],
    dayToDay: [
      'Set the strategic direction and standards for the school',
      'Manage staff, budgets and site operations',
      'Report to governors and Ofsted on performance',
      'Represent the school to parents and the wider community',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Head%20Teacher%20%2F%20Principal', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Head%20Teacher%20%2F%20Principal', description: 'Business & tech skills' },
    ],
    progression: [
      'Newly Qualified Teacher (£24k-£30k)',
      'Teacher / Head of Department (£30k-£50k)',
      'Deputy Head / Assistant Principal (£50k-£70k)',
      'Head Teacher / Principal (£70k-£120k+)',
    ],
    similarCareers: [
      46,
      47,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'PGCE / QTS + NPQH Route',
        duration: '3-4 years degree + 1 year PGCE + 10+ years experience',
        cost: 'Higher cost - tuition fees apply (training bursaries available for PGCE)',
        entryRequirements: 'A degree, then a PGCE or School Direct route to QTS, followed by significant leadership experience',
        subjects: [
          'pgce-primary',
          'pgce-secondary',
        ],
        description: 'Qualify as a teacher via a degree and PGCE, then progress through leadership roles and the NPQH qualification to headship.',
      },
    ]
  },
  {
    id: 106,
    employmentPercentage: 0.0502, // SOC 1162: Senior police officers
    category: 'Public Services',
    title: 'Senior Police Officer (Chief Inspector+)',
    salary: '£67k - £100k+',
    description: 'Lead policing operations and strategy at a senior rank, overseeing large teams, major investigations and force-wide decisions.',
    requirements: [
      'Completion of initial police officer training and years of operational service',
      'Senior leadership assessment and promotion process',
      'Strategic Command Course (for the most senior ranks)',
      'Strong leadership, judgement and crisis management skills',
    ],
    matchedSubjects: [
      'policing-criminal-investigation-bsc',
      'criminal-justice-ba',
      'police-apprenticeship',
      'btec-public-services',
    ],
    dayToDay: [
      'Oversee policing operations across a district or force',
      'Lead major investigations or incidents',
      'Manage budgets and senior staffing decisions',
      'Represent the force to the public, press and partner agencies',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Senior%20Police%20Officer%20(Chief%20Inspector%2B)', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Senior%20Police%20Officer%20(Chief%20Inspector%2B)', description: 'Business & tech skills' },
    ],
    progression: [
      'Police Constable (£28k-£35k)',
      'Sergeant / Inspector (£38k-£55k)',
      'Chief Inspector (£55k-£75k)',
      'Superintendent+ (£75k-£100k+)',
    ],
    similarCareers: [
      90,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Police Constable Degree Apprenticeship Route',
        duration: '3 years initial training + 10+ years to senior rank',
        cost: 'Low cost - salaried while training',
        entryRequirements: 'GCSEs (English & Maths), fitness and background checks - no prior degree required',
        subjects: [
          'police-apprenticeship',
        ],
        description: 'Join as a police constable via the apprenticeship route, then progress through the ranks to chief inspector and above.',
      },
    ]
  },
  {
    id: 107,
    employmentPercentage: 0.0362, // SOC 1123: Production managers and directors in mining and energy
    category: 'Engineering & Manufacturing',
    title: 'Energy / Mining Production Director',
    salary: '£63k - £120k+',
    description: 'Direct large-scale energy generation, extraction or mining production operations, balancing output, safety and regulatory compliance.',
    requirements: [
      'Degree in engineering, geology or a related field',
      '10+ years in energy or mining operations, including management experience',
      'Strong understanding of safety and environmental regulation',
      'Experience managing large operational budgets and teams',
    ],
    matchedSubjects: [
      'chemical-engineering-beng',
      'civil-engineering-beng',
      'renewable-energy-engineering-beng',
      'msc-renewable-energy-engineering',
    ],
    dayToDay: [
      'Oversee production targets, safety and site operations',
      'Manage budgets and senior operational teams',
      'Ensure compliance with safety and environmental regulation',
      'Report to the board on production and risk',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Energy%20%2F%20Mining%20Production%20Director', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Energy%20%2F%20Mining%20Production%20Director', description: 'Business & tech skills' },
    ],
    progression: [
      'Graduate Engineer (£26k-£34k)',
      'Site / Operations Engineer (£34k-£55k)',
      'Operations Manager (£55k-£85k)',
      'Energy / Mining Production Director (£85k-£120k+)',
    ],
    similarCareers: [
      109,
      110,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years degree + 10 years experience',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels including Maths and a science subject - typical offer varies by university',
        subjects: [
          'chemical-engineering-beng',
          'renewable-energy-engineering-beng',
        ],
        description: 'Study engineering, then build operational experience in energy or mining toward a production director role.',
      },
    ]
  },
  {
    id: 108,
    employmentPercentage: 0.2292, // SOC 1171: Health services and public health managers and directors
    category: 'Healthcare & Medicine',
    title: 'NHS / Public Health Manager',
    salary: '£62k - £110k+',
    description: 'Lead operational or strategic services within the NHS or public health system, managing budgets, staff and service delivery.',
    requirements: [
      'Degree in healthcare management, public health or a related field',
      '8-10+ years in healthcare, including management experience',
      'Strong understanding of NHS structures and public health policy',
      'Experience managing large budgets and multidisciplinary teams',
    ],
    matchedSubjects: [
      'msc-healthcare-management',
      'msc-public-health',
      'phd-public-health',
      'mba',
    ],
    dayToDay: [
      'Manage healthcare service delivery and budgets',
      'Lead multidisciplinary clinical and non-clinical teams',
      'Ensure compliance with NHS and public health standards',
      'Report to senior NHS leadership or public health bodies',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=NHS%20%2F%20Public%20Health%20Manager', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=NHS%20%2F%20Public%20Health%20Manager', description: 'Business & tech skills' },
    ],
    progression: [
      'Healthcare Assistant / Admin (£22k-£28k)',
      'Service / Department Manager (£30k-£50k)',
      'Senior Service Manager (£50k-£80k)',
      'NHS / Public Health Manager (£80k-£110k+)',
    ],
    similarCareers: [
      100,
      125,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Postgraduate Route',
        duration: '3-4 years degree + MSc + experience',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A degree in a related field, then a postgraduate qualification in healthcare or public health management',
        subjects: [
          'msc-healthcare-management',
          'msc-public-health',
        ],
        description: 'Study a related degree and postgraduate qualification, then build management experience within the NHS or public health system.',
      },
    ]
  },
  {
    id: 109,
    employmentPercentage: 0.2627, // SOC 2131: IT project managers
    category: 'Technology & Digital',
    title: 'IT Project Manager',
    salary: '£58k - £90k+',
    description: 'Plan and deliver technology projects on time and on budget, coordinating developers, designers and business stakeholders.',
    requirements: [
      'Degree in computing, business or a related field (or equivalent experience)',
      'PRINCE2 or Agile/Scrum certification',
      '5+ years of project delivery experience',
      'Strong stakeholder management and organisational skills',
    ],
    matchedSubjects: [
      'project-management-bsc',
      'prince2-project-management',
      'agile-pmp-project-management',
      'computer-science-bsc',
    ],
    dayToDay: [
      'Plan project timelines, budgets and resources',
      'Coordinate development, design and business teams',
      'Manage risks and unblock issues',
      'Report progress to stakeholders and sponsors',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=IT%20Project%20Manager', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=IT%20Project%20Manager', description: 'Business & tech skills' },
    ],
    progression: [
      'Project Coordinator / Junior PM (£26k-£34k)',
      'Project Manager (£34k-£50k)',
      'Senior Project Manager (£50k-£70k)',
      'Programme / Portfolio Manager (£70k-£90k+)',
    ],
    similarCareers: [
      99,
      128,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Certification Route',
        duration: '6-18 months',
        cost: 'Low-medium cost - certification course fees',
        entryRequirements: 'Relevant work experience plus a PRINCE2 or Agile/Scrum certification - a degree is not strictly required',
        subjects: [
          'prince2-project-management',
          'agile-pmp-project-management',
        ],
        description: 'Build project experience in a junior role, then gain PRINCE2 or Agile certification to move into IT project management.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'project-management-bsc',
          'computer-science-bsc',
        ],
        description: 'Study project management or computing, then move into IT project delivery roles.',
      },
    ]
  },
  {
    id: 110,
    employmentPercentage: 0.6084, // SOC 2412: Solicitors and lawyers
    category: 'Public Services',
    title: 'Solicitor / Lawyer',
    salary: '£57k - £130k+',
    description: 'Advise clients on the law, draft contracts and legal documents, and represent them in negotiations or before a court.',
    requirements: [
      'Law degree (LLB) or a degree plus law conversion (GDL/PGDL)',
      'Solicitors Qualifying Exam (SQE) or equivalent legal training',
      'Two years of qualifying work experience',
      'Strong analytical and written communication skills',
    ],
    matchedSubjects: [
      'law-llb',
      'gdl-law-conversion',
      'sqe-preparation',
      'alevel-law',
      'business-law-llb',
    ],
    dayToDay: [
      'Advise clients on legal matters and risk',
      'Draft and review contracts and legal documents',
      'Negotiate on behalf of clients',
      'Represent clients in disputes or before a court',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Solicitor%20%2F%20Lawyer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Solicitor%20%2F%20Lawyer', description: 'Business & tech skills' },
    ],
    progression: [
      'Trainee Solicitor (£28k-£45k)',
      'Newly Qualified Solicitor (£45k-£70k)',
      'Associate / Senior Associate (£70k-£100k)',
      'Partner / Senior Solicitor (£100k-£130k+)',
    ],
    similarCareers: [
      112,
      111,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'Law Degree + SQE Route',
        duration: '3 years degree + 2 years qualifying work experience',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels including English or a humanities subject - typical offer varies by university',
        subjects: [
          'law-llb',
          'sqe-preparation',
        ],
        description: 'Study law (or convert via the GDL), pass the SQE, and complete qualifying work experience to become a solicitor.',
      },
    ]
  },
  {
    id: 111,
    employmentPercentage: 0.1989, // SOC 3531: Brokers
    category: 'Business & Finance',
    title: 'Stockbroker / Financial Broker',
    salary: '£57k - £150k+',
    description: 'Buy and sell shares, bonds and other financial instruments on behalf of clients, advising on investment strategy and market timing.',
    requirements: [
      'Degree in finance, economics or a related field (or equivalent experience)',
      'CFA or IMC financial qualification',
      'FCA-regulated training and approval',
      'Strong numerical and risk-analysis skills',
    ],
    matchedSubjects: [
      'finance-bsc',
      'economics-bsc',
      'cfa-finance',
      'msc-finance',
    ],
    dayToDay: [
      'Advise clients on investment opportunities and risk',
      'Execute trades on behalf of clients or the firm',
      'Monitor markets and economic developments',
      'Build and maintain client relationships',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Stockbroker%20%2F%20Financial%20Broker', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Stockbroker%20%2F%20Financial%20Broker', description: 'Business & tech skills' },
    ],
    progression: [
      'Trainee Broker / Analyst (£28k-£38k)',
      'Broker (£38k-£65k)',
      'Senior Broker (£65k-£100k)',
      'Senior Stockbroker / Financial Broker (£100k-£150k+)',
    ],
    similarCareers: [
      123,
      110,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree + CFA Route',
        duration: '3-4 years degree + CFA exams while working',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels including Maths - typical offer varies by university',
        subjects: [
          'finance-bsc',
          'cfa-finance',
        ],
        description: 'Study finance or economics, then gain FCA approval and the CFA qualification while working in a trading or broking role.',
      },
    ]
  },
  {
    id: 112,
    employmentPercentage: 0.2135, // SOC 2433: Actuaries, economists and statisticians
    category: 'Business & Finance',
    title: 'Actuary',
    salary: '£53k - £120k+',
    description: 'Use statistics, probability and financial theory to assess and manage risk for insurers, pension schemes and financial firms.',
    requirements: [
      'Degree in actuarial science, maths or a related field',
      'IFoA actuarial exams (typically completed while working)',
      'Strong mathematical and analytical skills',
      '3-6 years to become a Fellow of the IFoA',
    ],
    matchedSubjects: [
      'actuarial-science-bsc',
      'mathematics-bsc',
      'ifoa-actuarial-exams',
      'alevel-mathematics',
    ],
    dayToDay: [
      'Build statistical models to assess financial risk',
      'Advise on pricing, reserves or pension funding',
      'Present findings to senior stakeholders',
      'Study toward professional actuarial exams',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Actuary', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Actuary', description: 'Business & tech skills' },
    ],
    progression: [
      'Actuarial Trainee (£28k-£38k)',
      'Part-Qualified Actuary (£38k-£55k)',
      'Qualified Actuary (£55k-£85k)',
      'Senior / Fellow Actuary (£85k-£120k+)',
    ],
    similarCareers: [
      111,
      123,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree + IFoA Exams Route',
        duration: '3-4 years degree + 3-6 years professional exams',
        cost: 'Higher cost - tuition fees apply (exam study often supported by employer)',
        entryRequirements: 'A-Levels including Maths - typical offer varies by university',
        subjects: [
          'actuarial-science-bsc',
          'ifoa-actuarial-exams',
        ],
        description: 'Study actuarial science or maths, then pass the IFoA professional exams while working to qualify as a Fellow.',
      },
    ]
  },
  {
    id: 113,
    employmentPercentage: 0.2709, // SOC 2455: Construction project managers and related professionals
    category: 'Construction & Trades',
    title: 'Construction Project Manager',
    salary: '£48k - £85k+',
    description: 'Plan, budget and oversee construction projects from groundworks to completion, coordinating contractors, architects and clients.',
    requirements: [
      'Degree in construction management or a related field (or equivalent experience)',
      'Relevant site experience and CSCS card',
      'Strong budgeting and scheduling skills',
      'Knowledge of health & safety and building regulations',
    ],
    matchedSubjects: [
      'tlevel-construction-design-surveying-planning',
      'rics-chartered-surveyor',
      'project-management-bsc',
      'btec-construction',
    ],
    dayToDay: [
      'Plan project timelines, budgets and resources',
      'Coordinate contractors, architects and suppliers',
      'Monitor site progress and safety compliance',
      'Report progress and costs to clients',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Construction%20Project%20Manager', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Construction%20Project%20Manager', description: 'Business & tech skills' },
    ],
    progression: [
      'Assistant Site Manager (£26k-£35k)',
      'Site Manager (£35k-£50k)',
      'Project Manager (£50k-£70k)',
      'Senior Construction Project Manager (£70k-£85k+)',
    ],
    similarCareers: [
      115,
      107,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Site Experience + T-Level Route',
        duration: '2-3 years',
        cost: 'Low cost - often salaried while training',
        entryRequirements: 'GCSEs (English & Maths), then a T-Level or apprenticeship in construction',
        subjects: [
          'tlevel-construction-design-surveying-planning',
        ],
        description: 'Start on site and build experience through a T-Level or apprenticeship route into project management.',
      },
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'project-management-bsc',
          'rics-chartered-surveyor',
        ],
        description: 'Study construction management or a related degree, then move into site and project management roles.',
      },
    ]
  },
  {
    id: 114,
    employmentPercentage: 1.7625, // SOC 2134: Programmers and software development professionals
    category: 'Technology & Digital',
    title: 'Quantitative Developer',
    salary: '£90k - £250k+',
    description: 'Build the high-performance trading and pricing systems used by investment banks and hedge funds, combining software engineering with advanced mathematics.',
    requirements: [
      'Degree in computer science, maths, physics or engineering (often a Master\'s or PhD)',
      'Strong programming skills (C++, Python)',
      'Advanced mathematical and statistical knowledge',
      'Experience with financial markets is highly valued',
    ],
    matchedSubjects: [
      'computer-science-bsc',
      'mathematics-bsc',
      'msc-finance-financial-engineering',
      'phd-mathematics',
      'cfa-finance',
    ],
    dayToDay: [
      'Build and optimise trading or pricing algorithms',
      'Analyse large financial datasets',
      'Work closely with traders and quant researchers',
      'Test and deploy low-latency trading systems',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Quantitative%20Developer', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Quantitative%20Developer', description: 'Business & tech skills' },
    ],
    progression: [
      'Graduate Quant Developer (£55k-£80k)',
      'Quant Developer (£80k-£130k)',
      'Senior Quant Developer (£130k-£190k)',
      'Lead Quant Developer / VP (£190k-£250k+)',
    ],
    similarCareers: [
      111,
      128,
      123,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Postgraduate Route',
        duration: '3-4 years degree + often an MSc/PhD',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels including Maths and Further Maths - highly competitive entry, often requiring a postgraduate qualification',
        subjects: [
          'mathematics-bsc',
          'msc-finance-financial-engineering',
        ],
        description: 'Study a highly quantitative degree, often followed by a Master\'s, then move into quant development roles at a bank or hedge fund.',
      },
    ]
  },
  {
    id: 115,
    employmentPercentage: 0.2056, // SOC 2135: Cyber security professionals
    category: 'Technology & Digital',
    title: 'Cybersecurity Manager / CISO',
    salary: '£72k - £180k+',
    description: 'Lead an organisation\'s information security strategy, protecting systems and data from threats and owning incident response.',
    requirements: [
      'Degree in cyber security, computer science or a related field (or equivalent experience)',
      'CISSP or CISM certification',
      '8-10+ years in security, including leadership experience',
      'Strong understanding of risk, compliance and incident response',
    ],
    matchedSubjects: [
      'cyber-security-bsc',
      'msc-cyber-security',
      'cissp-certification',
      'cism-certification',
    ],
    dayToDay: [
      'Set the security strategy and policy',
      'Oversee incident response and threat monitoring',
      'Manage security budgets and teams',
      'Report security risk to the board',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Cybersecurity%20Manager%20%2F%20CISO', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Cybersecurity%20Manager%20%2F%20CISO', description: 'Business & tech skills' },
    ],
    progression: [
      'Security Analyst (£28k-£40k)',
      'Security Engineer / Manager (£40k-£65k)',
      'Head of Security (£65k-£100k)',
      'Cybersecurity Manager / CISO (£100k-£180k+)',
    ],
    similarCareers: [
      99,
      109,
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship + Certification Route',
        duration: '2-4 years plus ongoing certification',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths), then a cyber security apprenticeship and industry certifications',
        subjects: [
          'cyber-security-apprenticeship',
          'cissp-certification',
        ],
        description: 'Start via a cyber security apprenticeship, then build toward CISSP/CISM certification and security leadership roles.',
      },
      {
        type: 'university',
        name: 'University / Postgraduate Route',
        duration: '3-4 years degree + MSc',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'cyber-security-bsc',
          'msc-cyber-security',
        ],
        description: 'Study cyber security, then build experience and certifications toward a CISO-level role.',
      },
    ]
  },
  {
    id: 116,
    employmentPercentage: 0.7486, // SOC 2132: IT managers
    category: 'Technology & Digital',
    title: 'Software Engineering Manager',
    salary: '£75k - £160k+',
    description: 'Lead a team of software engineers, balancing hands-on technical judgement with people management and delivery planning.',
    requirements: [
      'Degree in computer science or a related field (or equivalent experience)',
      '6-8+ years as a software engineer, including some leadership experience',
      'Strong technical judgement across the stack you manage',
      'Good people management and planning skills',
    ],
    matchedSubjects: [
      'computer-science-bsc',
      'software-engineering-bsc',
      'msc-software-engineering',
      'coding-bootcamp-software-development',
    ],
    dayToDay: [
      'Manage and mentor a team of software engineers',
      'Plan technical delivery and sprint priorities',
      'Make architectural and technical trade-off decisions',
      'Report progress and risks to senior leadership',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Software%20Engineering%20Manager', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Software%20Engineering%20Manager', description: 'Business & tech skills' },
    ],
    progression: [
      'Software Developer (£25k-£40k)',
      'Senior Developer (£40k-£65k)',
      'Tech Lead (£65k-£95k)',
      'Software Engineering Manager (£95k-£160k+)',
    ],
    similarCareers: [
      1,
      128,
      99,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years degree + 6-8 years experience',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'computer-science-bsc',
          'software-engineering-bsc',
        ],
        description: 'Study computer science or software engineering, then build experience as a developer before moving into engineering management.',
      },
    ]
  },
  {
    id: 117,
    employmentPercentage: 0.4794, // SOC 2212: Specialist medical practitioners
    category: 'Healthcare & Medicine',
    title: 'Plastic Surgeon',
    salary: '£97k - £200k+',
    description: 'Perform reconstructive and cosmetic surgical procedures, requiring years of surgical specialty training after medical school.',
    requirements: [
      'Medicine degree (MBBS) recognised by the GMC',
      'Core and specialty surgical training (typically 10+ years post-degree)',
      'Membership/Fellowship of the Royal College of Surgeons',
      'GMC registration with a licence to practise',
    ],
    matchedSubjects: [
      'medicine-mbbs',
      'medicine-graduate-entry',
      'alevel-biology',
      'alevel-chemistry',
    ],
    dayToDay: [
      'Perform reconstructive and cosmetic surgical procedures',
      'Assess patients and plan surgical treatment',
      'Lead a surgical team in theatre',
      'Manage post-operative care and follow-up',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Plastic%20Surgeon', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Plastic%20Surgeon', description: 'Business & tech skills' },
    ],
    progression: [
      'Foundation Doctor (£29k-£34k)',
      'Core Surgical Trainee (£40k-£50k)',
      'Specialty Registrar in Plastic Surgery (£55k-£75k)',
      'Consultant Plastic Surgeon (£97k-£200k+)',
    ],
    similarCareers: [
      100,
      118,
      119,
      120,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Medicine + Surgical Training Route',
        duration: '5-6 years degree + 10+ years surgical training',
        cost: 'Higher cost - tuition fees apply (NHS bursaries available in later years)',
        entryRequirements: 'A-Levels including Chemistry and Biology, plus UCAT/BMAT and interview',
        subjects: [
          'medicine-mbbs',
          'alevel-biology',
          'alevel-chemistry',
        ],
        description: 'Complete a medicine degree, foundation training and years of surgical specialty training to qualify as a consultant plastic surgeon.',
      },
    ]
  },
  {
    id: 118,
    employmentPercentage: 0.1037, // SOC 2253: Dental practitioners
    category: 'Healthcare & Medicine',
    title: 'Orthodontist',
    salary: '£100k - £180k+',
    description: 'Specialise in diagnosing and correcting teeth and jaw alignment, typically running or working within a specialist dental practice.',
    requirements: [
      'Dentistry degree (BDS) recognised by the GDC',
      'Dental foundation training plus specialty training in orthodontics',
      'GDC registration with a licence to practise',
      'Strong manual dexterity and attention to detail',
    ],
    matchedSubjects: [
      'dentistry-bds',
      'alevel-biology',
      'alevel-chemistry',
    ],
    dayToDay: [
      'Assess and plan orthodontic treatment for patients',
      'Fit and adjust braces and other orthodontic devices',
      'Monitor treatment progress over months or years',
      'Manage a specialist practice or clinic team',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Orthodontist', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Orthodontist', description: 'Business & tech skills' },
    ],
    progression: [
      'Dental Foundation Trainee (£30k-£38k)',
      'General Dentist (£45k-£70k)',
      'Specialty Registrar in Orthodontics (£50k-£70k)',
      'Consultant / Specialist Orthodontist (£100k-£180k+)',
    ],
    similarCareers: [
      117,
      100,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Dentistry + Specialty Route',
        duration: '5 years degree + 3+ years specialty training',
        cost: 'Higher cost - tuition fees apply (NHS bursaries available in later years)',
        entryRequirements: 'A-Levels including Chemistry and Biology, plus interview',
        subjects: [
          'dentistry-bds',
        ],
        description: 'Complete a dentistry degree and foundation training, then specialise in orthodontics through further postgraduate training.',
      },
    ]
  },
  {
    id: 119,
    employmentPercentage: 0.4794, // SOC 2212: Specialist medical practitioners
    category: 'Healthcare & Medicine',
    title: 'Ophthalmologist',
    salary: '£107k - £200k+',
    description: 'Diagnose and treat conditions of the eye, from prescribing glasses to performing complex eye surgery, as a hospital consultant.',
    requirements: [
      'Medicine degree (MBBS) recognised by the GMC',
      'Ophthalmic specialty training (typically 7-8 years post-degree)',
      'Membership of the Royal College of Ophthalmologists',
      'GMC registration with a licence to practise',
    ],
    matchedSubjects: [
      'medicine-mbbs',
      'medicine-graduate-entry',
      'alevel-biology',
      'alevel-chemistry',
    ],
    dayToDay: [
      'Diagnose and treat eye conditions and disease',
      'Perform eye surgery, including cataract and laser procedures',
      'Lead a clinical team including junior doctors',
      'Contribute to research and teaching',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Ophthalmologist', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Ophthalmologist', description: 'Business & tech skills' },
    ],
    progression: [
      'Foundation Doctor (£29k-£34k)',
      'Core Medical Trainee (£40k-£50k)',
      'Ophthalmology Specialty Registrar (£55k-£75k)',
      'Consultant Ophthalmologist (£107k-£200k+)',
    ],
    similarCareers: [
      100,
      117,
      118,
      120,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Medicine + Specialty Route',
        duration: '5-6 years degree + 7-8 years specialty training',
        cost: 'Higher cost - tuition fees apply (NHS bursaries available in later years)',
        entryRequirements: 'A-Levels including Chemistry and Biology, plus UCAT/BMAT and interview',
        subjects: [
          'medicine-mbbs',
          'alevel-biology',
          'alevel-chemistry',
        ],
        description: 'Complete a medicine degree, foundation training and ophthalmology specialty training to qualify as a consultant.',
      },
    ]
  },
  {
    id: 120,
    employmentPercentage: 0.4794, // SOC 2212: Specialist medical practitioners
    category: 'Healthcare & Medicine',
    title: 'Anaesthetist',
    salary: '£98k - £180k+',
    description: 'Manage pain relief and sedation for patients before, during and after surgery, and provide critical and intensive care.',
    requirements: [
      'Medicine degree (MBBS) recognised by the GMC',
      'Anaesthetic specialty training (typically 7-8 years post-degree)',
      'Membership of the Royal College of Anaesthetists',
      'GMC registration with a licence to practise',
    ],
    matchedSubjects: [
      'medicine-mbbs',
      'medicine-graduate-entry',
      'alevel-biology',
      'alevel-chemistry',
    ],
    dayToDay: [
      'Assess patients and plan anaesthetic care',
      'Administer and monitor anaesthesia during surgery',
      'Manage pain relief and critical care',
      'Work closely with surgical and theatre teams',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Anaesthetist', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Anaesthetist', description: 'Business & tech skills' },
    ],
    progression: [
      'Foundation Doctor (£29k-£34k)',
      'Core Anaesthetic Trainee (£40k-£50k)',
      'Anaesthetic Specialty Registrar (£55k-£75k)',
      'Consultant Anaesthetist (£98k-£180k+)',
    ],
    similarCareers: [
      100,
      117,
      119,
      118,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Medicine + Specialty Route',
        duration: '5-6 years degree + 7-8 years specialty training',
        cost: 'Higher cost - tuition fees apply (NHS bursaries available in later years)',
        entryRequirements: 'A-Levels including Chemistry and Biology, plus UCAT/BMAT and interview',
        subjects: [
          'medicine-mbbs',
          'alevel-biology',
          'alevel-chemistry',
        ],
        description: 'Complete a medicine degree, foundation training and anaesthetic specialty training to qualify as a consultant.',
      },
    ]
  },
  {
    id: 121,
    employmentPercentage: 0.7331, // SOC 1132: Marketing, sales and advertising directors
    category: 'Business & Finance',
    title: 'VP of Sales',
    salary: '£116k - £250k+',
    description: 'Own an organisation\'s revenue targets, leading the entire sales function and setting go-to-market strategy.',
    requirements: [
      'Degree in business or a related field (or equivalent experience)',
      '10+ years in sales, including senior leadership experience',
      'Proven track record hitting or exceeding revenue targets',
      'Strong leadership and negotiation skills',
    ],
    matchedSubjects: [
      'business-management-ba',
      'marketing-ba',
      'mba',
    ],
    dayToDay: [
      'Set sales strategy and revenue targets',
      'Lead and coach senior sales managers',
      'Own key client and partner relationships',
      'Report revenue performance to the board',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=VP%20of%20Sales', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=VP%20of%20Sales', description: 'Business & tech skills' },
    ],
    progression: [
      'Sales Executive (£24k-£32k)',
      'Sales Manager (£35k-£60k)',
      'Head of Sales (£60k-£100k)',
      'VP of Sales (£100k-£250k+)',
    ],
    similarCareers: [
      98,
      97,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years degree + 10 years experience',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'business-management-ba',
          'marketing-ba',
        ],
        description: 'Study business or marketing, then build a track record in sales roles on the way to a VP-level position.',
      },
    ]
  },
  {
    id: 122,
    employmentPercentage: 1.2402, // SOC 1131: Financial managers and directors
    category: 'Business & Finance',
    title: 'Chief Financial Officer (CFO)',
    salary: '£112k - £350k+',
    description: 'Sit on the board as the most senior finance leader, owning financial strategy, investor relations and long-term financial health.',
    requirements: [
      'Professional accountancy qualification (ACA, ACCA or CIMA), often with an MBA',
      '15+ years in finance, including several years at director level',
      'Strong strategic, investor relations and board-level skills',
      'Track record managing large, complex budgets',
    ],
    matchedSubjects: [
      'icaew-aca',
      'acca-accounting',
      'cima-management-accounting',
      'mba',
    ],
    dayToDay: [
      'Own financial strategy and long-term planning',
      'Report to the board and investors on financial performance',
      'Manage risk, treasury and capital allocation',
      'Lead the wider finance function',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Chief%20Financial%20Officer%20(CFO)', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Chief%20Financial%20Officer%20(CFO)', description: 'Business & tech skills' },
    ],
    progression: [
      'Qualified Accountant (£35k-£55k)',
      'Finance Manager (£55k-£85k)',
      'Finance Director (£85k-£150k)',
      'Chief Financial Officer (£150k-£350k+)',
    ],
    similarCareers: [
      102,
      97,
      123,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'Degree + Professional Qualification + MBA Route',
        duration: '3-4 years degree + professional qualification + 15 years experience',
        cost: 'Higher cost - tuition fees apply (training contracts are usually salaried)',
        entryRequirements: 'A-Levels or BTEC Level 3, then a graduate training contract and years of senior finance experience',
        subjects: [
          'accounting-bsc',
          'icaew-aca',
          'mba',
        ],
        description: 'Qualify as a chartered accountant, build up director-level finance experience, and often add an MBA on the way to CFO.',
      },
    ]
  },
  {
    id: 123,
    employmentPercentage: 0.1531, // SOC 2423: Taxation experts
    category: 'Business & Finance',
    title: 'Tax Director',
    salary: '£94k - £180k+',
    description: 'Lead an organisation\'s tax strategy and compliance, managing risk across corporate, personal and international tax matters.',
    requirements: [
      'Professional accountancy or tax qualification (ACA, ACCA, CTA)',
      '10+ years in tax, including senior management experience',
      'Deep knowledge of UK and international tax law',
      'Strong advisory and risk-management skills',
    ],
    matchedSubjects: [
      'icaew-aca',
      'acca-accounting',
      'cima-management-accounting',
      'accounting-bsc',
    ],
    dayToDay: [
      'Set tax strategy and manage compliance risk',
      'Advise the board on tax implications of decisions',
      'Manage relationships with HMRC and external auditors',
      'Lead a team of tax specialists',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Tax%20Director', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Tax%20Director', description: 'Business & tech skills' },
    ],
    progression: [
      'Tax Trainee (£24k-£32k)',
      'Tax Manager (£40k-£60k)',
      'Senior Tax Manager (£60k-£90k)',
      'Tax Director (£90k-£180k+)',
    ],
    similarCareers: [
      122,
      102,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'Degree + Professional Qualification Route',
        duration: '3-4 years degree + 3-4 years training contract',
        cost: 'Higher cost - tuition fees apply (training contracts are usually salaried)',
        entryRequirements: 'A-Levels or BTEC Level 3, then a graduate training contract in tax',
        subjects: [
          'accounting-bsc',
          'icaew-aca',
        ],
        description: 'Study accounting or a related degree, qualify as a chartered accountant or tax adviser, and specialise in tax on the way to director level.',
      },
    ]
  },
  {
    id: 124,
    employmentPercentage: 0.1268, // SOC 2127: Engineering project managers and project engineers
    category: 'Technology & Digital',
    title: 'Director of Engineering',
    salary: '£91k - £160k+',
    description: 'Own the technical strategy and delivery across multiple engineering teams, sitting between senior leadership and engineering management.',
    requirements: [
      'Degree in computer science or a related field (or equivalent experience)',
      '10+ years in software engineering, including senior leadership experience',
      'Strong technical strategy and cross-team planning skills',
      'Experience managing engineering managers and large budgets',
    ],
    matchedSubjects: [
      'computer-science-bsc',
      'software-engineering-bsc',
      'msc-software-engineering',
      'mba',
    ],
    dayToDay: [
      'Set engineering strategy across multiple teams',
      'Manage engineering managers and senior technical staff',
      'Own technical budgets and hiring plans',
      'Report engineering progress and risk to the executive team',
    ],
    whereToStudy: [
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=Director%20of%20Engineering', description: 'Affordable professional courses' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=Director%20of%20Engineering', description: 'Business & tech skills' },
    ],
    progression: [
      'Senior Developer (£40k-£65k)',
      'Tech Lead / Engineering Manager (£65k-£95k)',
      'Head of Engineering (£95k-£130k)',
      'Director of Engineering (£130k-£160k+)',
    ],
    similarCareers: [
      116,
      99,
      19,
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years degree + 10 years experience',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'computer-science-bsc',
          'software-engineering-bsc',
        ],
        description: 'Study computer science or software engineering, then build experience through developer and engineering management roles toward a director post.',
      },
    ]
  },
  // --- Ultra-rare / Mythic-tier heritage crafts & specialist roles ---
  // Real 2025-2026 UK workforce figures from Heritage Crafts' Red List of
  // Endangered Crafts, the Institute of British Organ Building, the
  // National Society of Master Thatchers, trade body/company filings, and
  // (for Forensic Anthropologist) the Royal Anthropological Institute /
  // British Association for Forensic Anthropology - not the DfE
  // "Occupations in Demand" CSV the rest of this file's employmentPercentage
  // values come from, since occupations this niche were never granular
  // enough to get their own SOC-coded row in that dataset. Denominator is
  // ONS's ~34.5M UK "people in work" total (a different, more recent figure
  // than the ~31.4M workforce total the rest of this file uses - both are
  // real ONS totals, just from different points/definitions, so a Master
  // Thatcher's percentage isn't perfectly apples-to-apples comparable to a
  // Software Developer's down to the last decimal - the "1 in every N"
  // rarityLabel string is what's authoritative for these 7, not a precise
  // division of the two numbers). rarityLabel is a new, optional field
  // (see demoCareers.d.ts) - RollResultCard prefers it when present instead
  // of computing "1 in every N" from employmentPercentage, since these
  // headline counts were deliberately rounded to the same clean figures
  // Heritage Crafts and the trade bodies themselves quote, not left as a
  // raw division that'd print a slightly-off number like "43,126".
  {
    id: 125,
    employmentPercentage: 0.002319, // ~800 UK Master Thatchers of ~34.5M in work (National Society of Master Thatchers, 2025)
    rarityLabel: '1 in every 43,000 workers',
    category: 'Construction & Trades',
    title: 'Master Thatcher',
    salary: '£28k - £48k',
    description: 'Weave and repair traditional straw and water reed roofs on historic and residential buildings, keeping a centuries-old craft alive.',
    requirements: [
      'Traditional apprenticeship (typically 5-7 years)',
      'Physical fitness and a head for heights',
      'Knowledge of regional thatching styles (long straw, combed wheat reed, water reed, Welsh vernacular, Irish vernacular)',
      'GCSE Maths and English',
    ],
    supportTags: [],
    dayToDay: [
      'Strip and re-thatch roofs using straw or water reed',
      'Repair storm damage and patch worn or leaking areas',
      'Fit fire-retardant and bird-proofing layers to new work',
      'Advise homeowners and conservation officers on materials and regional style',
    ],
    whereToStudy: [
      { name: 'National Society of Master Thatchers', url: 'https://www.nsmt.co.uk', description: 'Apprenticeships and trade body for UK thatchers' },
      { name: 'Heritage Crafts', url: 'https://heritagecrafts.org.uk/craft/thatching/', description: 'Endangered crafts directory and training routes' },
    ],
    progression: [
      "Thatcher's Apprentice (Entry (£18k-£24k))",
      'Journeyman Thatcher (Mid-level (£28k-£38k))',
      'Master Thatcher (Senior (£38k-£48k))',
      'Master Thatcher with own client waiting list (Lead / Specialist (£45k+))',
    ],
    similarCareers: [
      130,
      131,
      89,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'tlevel-construction-on-site-construction',
      'btec-construction',
      'tlevel-craft-design',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Traditional Apprenticeship Route',
        duration: '5-7 years',
        cost: 'Low cost - trained on the job under a master thatcher, wage while training',
        entryRequirements: 'No formal qualifications required - GCSEs helpful, fitness and reliability essential',
        subjects: [
          'tlevel-construction-on-site-construction',
          'btec-construction',
          'tlevel-craft-design',
        ],
        description: 'Only ~50-60k thatched properties remain in the UK and the workforce is ageing, so most training happens directly under a working master thatcher rather than in a classroom. Heritage Crafts\' 2025 Red List separately flagged Welsh vernacular and Irish vernacular thatching as newly critically endangered regional techniques within this same trade.',
      },
    ],
  },
  {
    id: 126,
    employmentPercentage: 0.0001884, // ~65 UK pipe organ builders/restorers of ~34.5M in work (Institute of British Organ Building, 2025)
    rarityLabel: '1 in every 530,000 workers',
    category: 'Creative & Media',
    title: 'Pipe Organ Builder / Restorer',
    salary: '£26k - £50k',
    description: 'Build, tune, voice and restore pipe organs in churches, cathedrals and concert halls, a craft that blends woodwork, metalwork and acoustics.',
    requirements: [
      'Long-term apprenticeship or trainee post with an established organ builder (5+ years)',
      'Fine woodworking, metalworking and mechanical skills',
      'A trained ear for tuning and voicing pipework',
      'GCSE Maths, English and Science',
    ],
    supportTags: [],
    dayToDay: [
      'Restore and rebuild historic pipe organs on site or in the workshop',
      'Voice and tune individual pipes by ear',
      'Fabricate replacement pipework, action and casework',
      'Carry out routine maintenance and emergency repairs for churches and venues',
    ],
    whereToStudy: [
      { name: 'Institute of British Organ Building', url: 'https://www.ibo.co.uk', description: 'Trade body, apprenticeships and heritage skills training' },
      { name: 'Heritage Crafts', url: 'https://heritagecrafts.org.uk/craft/organ-building/', description: 'Endangered crafts directory and training routes' },
    ],
    progression: [
      'Trainee / Apprentice Organ Builder (Entry (£20k-£26k))',
      'Organ Builder (Mid-level (£26k-£36k))',
      'Senior Restorer (Senior (£36k-£45k))',
      'Master Organ Builder / Workshop Owner (Lead / Specialist (£45k+))',
    ],
    similarCareers: [
      127,
      128,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'tlevel-craft-design',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Trade Apprenticeship Route',
        duration: '5+ years',
        cost: 'Low cost - trained on the job with an established organ-building firm',
        entryRequirements: 'No formal qualifications required - practical aptitude and a trained ear matter most',
        subjects: [
          'gcse-science-combined',
          'tlevel-craft-design',
        ],
        description: "Heritage Crafts lists organ building as endangered - 62% of the workforce is over 46, and most firms are 1-2 people, so almost everyone learns through a direct trainee post rather than a course.",
      },
    ],
  },
  {
    id: 127,
    employmentPercentage: 0.000058, // ~20 UK bell founders of ~34.5M in work (John Taylor & Co, Loughborough - last major traditional foundry, 2025)
    rarityLabel: '1 in every 1,725,000 workers',
    category: 'Engineering & Manufacturing',
    title: 'Bell Founder',
    salary: '£26k - £45k',
    description: 'Cast, tune and hang church and clock bells using traditional loam-mould casting, one of the rarest metal crafts still practised in the UK.',
    requirements: [
      'Long-term apprenticeship at a working bell foundry',
      'Foundry and metal casting skills, comfortable with molten metal',
      'A trained ear for tuning bells to pitch',
      'GCSE Maths and Science',
    ],
    supportTags: [],
    dayToDay: [
      'Prepare loam moulds and cast bronze bells',
      'Tune cast bells on a lathe to the correct pitch',
      'Restore and re-hang historic bells and fittings',
      'Work with churches, cathedrals and heritage bodies on commissions',
    ],
    whereToStudy: [
      { name: 'Heritage Crafts', url: 'https://heritagecrafts.org.uk/craft/bell-founding/', description: 'Endangered crafts directory - bell founding is critically endangered' },
    ],
    progression: [
      'Foundry Apprentice (Entry (£20k-£24k))',
      'Bell Founder (Mid-level (£26k-£34k))',
      'Senior Founder / Tuner (Senior (£34k-£42k))',
      'Master Bell Founder (Lead / Specialist (£42k+))',
    ],
    similarCareers: [
      126,
      130,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'tlevel-craft-design',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Foundry Apprenticeship Route',
        duration: '5+ years',
        cost: 'Low cost - trained on the job at a working bell foundry',
        entryRequirements: 'No formal qualifications required - the Whitechapel Bell Foundry closed in 2017, leaving very few working foundries to train at',
        subjects: [
          'gcse-science-combined',
          'tlevel-craft-design',
        ],
        description: 'Traditional loam-mould casting is now extremely scarce - John Taylor & Co in Loughborough is the last major traditional foundry, so almost the entire trade is learned there or not at all.',
      },
    ],
  },
  {
    id: 128,
    employmentPercentage: 0.0002319, // ~80 UK full-time hand engravers of ~34.5M in work (Heritage Crafts / trade estimate, 2025)
    rarityLabel: '1 in every 430,000 workers',
    category: 'Creative & Media',
    title: 'Traditional Hand Engraver',
    salary: '£25k - £45k',
    description: 'Cut fine lettering and decorative patterns into jewellery, silverware and firearms by hand, a precision skill now largely displaced by laser engraving.',
    requirements: [
      'Apprenticeship or specialist college course in hand engraving',
      'Exceptional hand-eye coordination and patience',
      'Design and draughtsmanship skills',
      'GCSE Art & Design, Maths and English',
    ],
    supportTags: [],
    dayToDay: [
      'Hand-cut monograms, crests and decorative patterns into metal',
      'Engrave jewellery, trophies, silverware and presentation firearms',
      'Design bespoke lettering and motifs for clients',
      'Restore and re-cut worn engraving on antique pieces',
    ],
    whereToStudy: [
      { name: 'Heritage Crafts', url: 'https://heritagecrafts.org.uk/craft/hand-engraving/', description: 'Endangered crafts directory and training routes' },
      { name: 'Birmingham School of Jewellery', url: 'https://www.bcu.ac.uk/jewellery', description: 'Specialist jewellery and engraving courses' },
    ],
    progression: [
      'Engraving Apprentice (Entry (£18k-£24k))',
      'Hand Engraver (Mid-level (£25k-£34k))',
      'Senior Engraver (Senior (£34k-£40k))',
      'Master Engraver / Own Workshop (Lead / Specialist (£40k+))',
    ],
    similarCareers: [
      126,
      39,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'tlevel-craft-design',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Craft Apprenticeship Route',
        duration: '4-6 years',
        cost: 'Low to moderate cost - some specialist college courses charge fees, most training is apprenticeship-based',
        entryRequirements: 'No formal qualifications required - a strong art/design portfolio helps',
        subjects: [
          'tlevel-craft-design',
        ],
        description: 'Still used for high-end jewellery, silver and firearms, but largely displaced by laser engraving - fewer than 100 full-time specialists are thought to remain in the UK.',
      },
    ],
  },
  {
    id: 129,
    employmentPercentage: 0.0001304, // ~45 UK full-time forensic anthropologists of ~34.5M in work (RAI / British Association for Forensic Anthropology, 2025)
    rarityLabel: '1 in every 767,000 workers',
    category: 'Science & Research',
    title: 'Forensic Anthropologist',
    salary: '£35k - £70k+',
    description: 'Analyse human skeletal remains to determine age, sex, ancestry, stature, trauma and time since death, working with police, coroners and international bodies.',
    requirements: [
      "Degree in anthropology or archaeology, plus postgraduate specialisation",
      'Years of supervised casework experience',
      'Professional registration (Royal Anthropological Institute / BAFA)',
      'A-Level Biology or equivalent science background',
    ],
    supportTags: [
      'Flexible hours',
    ],
    dayToDay: [
      'Examine skeletal remains to establish identity and cause of death',
      'Support police and coroners with casework and expert testimony',
      'Assist disaster victim identification and mass grave investigations',
      'Publish research and train the next generation of practitioners',
    ],
    whereToStudy: [
      { name: 'British Association for Forensic Anthropology', url: 'https://bafa.org.uk', description: 'Professional body and case accreditation' },
      { name: 'Royal Anthropological Institute', url: 'https://therai.org.uk', description: 'Professional registration and CPD' },
    ],
    progression: [
      'PhD Researcher / Trainee (Entry (£25k-£35k))',
      'Forensic Anthropologist, casework + academic post (Mid-level (£35k-£50k))',
      'Senior Consultant Forensic Anthropologist (Senior (£50k-£65k))',
      'Lead Consultant / Professor (Lead / Specialist (£65k+))',
    ],
    similarCareers: [
      91,
      28,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'anthropology-ba',
      'archaeology-ba',
      'forensic-science-bsc',
      'btec-forensic-science',
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years degree + postgraduate specialisation + years of casework',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels including a science subject - typical offer varies by university',
        subjects: [
          'anthropology-ba',
          'archaeology-ba',
          'forensic-science-bsc',
        ],
        description: 'Full-time practitioners who regularly do casework are estimated at well under 50 (some sources suggest closer to 20-30 active experts) - most work is freelance, university-based or consultancy, since very few permanent posts exist.',
      },
    ],
  },
  {
    id: 130,
    employmentPercentage: 0.0004348, // ~150 UK architectural/heritage blacksmiths of ~34.5M in work (Scotland alone has ~20 - trade estimate, 2025)
    rarityLabel: '1 in every 230,000 workers',
    category: 'Construction & Trades',
    title: 'Architectural / Traditional Blacksmith',
    salary: '£26k - £48k',
    description: 'Design and forge ornamental gates, railings and structural ironwork by hand, and restore historic wrought and cast ironwork on listed buildings.',
    requirements: [
      'Apprenticeship or specialist blacksmithing course (3-5 years)',
      'Forge and hand-forging skills, comfortable working at high heat',
      'Design and technical drawing skills for bespoke commissions',
      'GCSE Maths, Art & Design and English',
    ],
    supportTags: [],
    dayToDay: [
      'Hand-forge gates, railings, balustrades and structural ironwork',
      'Restore historic wrought and cast ironwork on listed buildings',
      'Work from client briefs and heritage conservation specifications',
      'Run and maintain a traditional coal or gas forge and workshop',
    ],
    whereToStudy: [
      { name: 'Heritage Crafts', url: 'https://heritagecrafts.org.uk/craft/blacksmithing-architectural/', description: 'Endangered crafts directory and training routes' },
      { name: 'National Heritage Ironwork Group', url: 'https://nhig.org.uk', description: 'Standards, training and accreditation for heritage blacksmiths' },
    ],
    progression: [
      'Blacksmithing Apprentice (Entry (£19k-£25k))',
      'Blacksmith (Mid-level (£26k-£36k))',
      'Senior / Heritage Blacksmith (Senior (£36k-£44k))',
      'Master Blacksmith / Own Forge (Lead / Specialist (£44k+))',
    ],
    similarCareers: [
      125,
      131,
      127,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'tlevel-craft-design',
      'btec-construction',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Forge Apprenticeship Route',
        duration: '3-5 years',
        cost: 'Low cost - trained on the job or via a specialist short course, wage while training',
        entryRequirements: 'No formal qualifications required - a strong design/craft portfolio helps for heritage commissions',
        subjects: [
          'tlevel-craft-design',
          'btec-construction',
        ],
        description: 'Scotland alone is estimated to have only around 20 architectural blacksmiths - the specialist heritage-ironwork pool across the whole UK is well under 1 in every 100,000 workers.',
      },
    ],
  },
  {
    id: 131,
    employmentPercentage: 0.0000232, // ~8 UK skilled professional pargeters of ~34.5M in work (Heritage Crafts, East Anglia trade estimate, 2025)
    rarityLabel: '1 in every 4,313,000 workers',
    category: 'Construction & Trades',
    title: 'Pargeter (Decorative Plasterer)',
    salary: '£26k - £45k',
    description: 'Create raised ornamental plasterwork on building exteriors - freehand or moulded motifs, animals and coats of arms - strongly associated with East Anglia.',
    requirements: [
      'Apprenticeship or specialist training under a working pargeter',
      'Freehand modelling and sculptural skills in wet plaster',
      'Design and pattern-drawing ability',
      'GCSE Art & Design, Maths and English',
    ],
    supportTags: [],
    dayToDay: [
      'Model raised decorative motifs, animals and crests into wet plaster',
      'Restore historic pargeting on listed timber-framed buildings',
      'Mix traditional lime-based plasters and prepare surfaces',
      'Work with conservation officers on heritage restoration projects',
    ],
    whereToStudy: [
      { name: 'Heritage Crafts', url: 'https://heritagecrafts.org.uk/craft/pargeting/', description: 'Endangered crafts directory - pargeting is critically endangered' },
    ],
    progression: [
      'Plastering Apprentice (Entry (£19k-£25k))',
      'Decorative Plasterer (Mid-level (£26k-£34k))',
      'Pargeter, simple stamped/combed work (Senior (£34k-£40k))',
      'Master Pargeter, freehand ornamental work (Lead / Specialist (£40k+))',
    ],
    similarCareers: [
      125,
      130,
      36,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'tlevel-craft-design',
      'btec-construction',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Craft Apprenticeship Route',
        duration: '4-6 years',
        cost: 'Low cost - trained on the job under a working pargeter',
        entryRequirements: 'No formal qualifications required - a strong art/sculpture portfolio helps',
        subjects: [
          'tlevel-craft-design',
          'btec-construction',
        ],
        description: 'Only around 6-11 highly skilled professional pargeters are thought to remain, concentrated in East Anglia (Suffolk/Essex) - most modern plastering is plain, so this freehand ornamental skill is critically endangered.',
      },
    ],
  },
  // --- 3 more ultra-rare heritage crafts, added from Heritage Crafts' Red
  // List 2025 "12 new critically endangered crafts" - the actual named
  // examples PathScrawler_UK_Stats.txt cited (rattan furniture, cut
  // crystal, ship figurehead carving), researched individually the same
  // way as ids 125-131 above (Heritage Crafts' own craft pages, fetched
  // May-Aug 2026). The 4th named example, Welsh/Irish vernacular
  // thatching, is NOT a separate entry here - Heritage Crafts lists it as
  // a newly-endangered regional TECHNIQUE within thatching, not a
  // separate profession with its own UK headcount, so it's folded into
  // Master Thatcher (id 125)'s own requirements/backtrackPathways above
  // rather than inventing a second thatcher entry with a fabricated
  // separate practitioner count.
  {
    id: 132,
    employmentPercentage: 0.00005222, // 18 craftspeople at Soane Britain, the UK's only rattan furniture maker, of ~34.5M in work (Heritage Crafts, 2025)
    rarityLabel: '1 in every 1,915,000 workers',
    category: 'Creative & Media',
    title: 'Rattan Furniture Maker',
    salary: '£24k - £42k',
    description: 'Hand-weave and frame rattan furniture, lighting and baskets - a craft that now exists at a single UK company after decades of manufacturing moving overseas.',
    requirements: [
      'Apprenticeship with the one remaining UK rattan furniture maker (typically 3-4 years)',
      'Hand-weaving dexterity and patience for slow, repetitive work',
      'Frame-making and finishing skills',
      'GCSE Maths, English and Design & Technology',
    ],
    supportTags: [],
    dayToDay: [
      'Weave rattan cane into sofas, chairs, lighting and baskets by hand',
      'Build and prepare timber/rattan frames before weaving',
      'Finish and polish completed pieces',
      'Work from bespoke client and interior-designer commissions',
    ],
    whereToStudy: [
      { name: 'Heritage Crafts', url: 'https://heritagecrafts.org.uk/craft/rattan-furniture-making/', description: 'Endangered crafts directory - rattan furniture making is critically endangered' },
    ],
    progression: [
      'Rattan Weaving Apprentice (Entry (£19k-£24k))',
      'Rattan Furniture Maker (Mid-level (£24k-£32k))',
      'Senior Weaver, complex pieces (Senior (£32k-£38k))',
      'Master Weaver / Workshop Lead (Lead / Specialist (£38k+))',
    ],
    similarCareers: [
      128,
      131,
      126,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'tlevel-craft-design',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'In-House Apprenticeship Route',
        duration: '3-4 years',
        cost: 'Low cost - trained on the job, paid at least National Living Wage throughout',
        entryRequirements: 'No formal qualifications required - fine hand-dexterity and patience matter most',
        subjects: [
          'tlevel-craft-design',
        ],
        description: 'All UK rattan furniture making now happens at a single company (Soane Britain, 18 craftspeople) after the trade largely moved to Asia in the 1970s - there is no government apprenticeship route or independent training provider, only that one in-house programme.',
      },
    ],
  },
  {
    id: 133,
    employmentPercentage: 0.0000232, // ~8 UK cut crystal glass cutters with main income of ~34.5M in work (Heritage Crafts, 2025)
    rarityLabel: '1 in every 4,309,000 workers',
    category: 'Creative & Media',
    title: 'Cut Crystal Glass Cutter',
    salary: '£24k - £42k',
    description: 'Hand-cut decorative patterns into blown lead crystal glassware using grinding wheels, then polish it to a brilliant finish - a precision trade down to a handful of UK glassworks.',
    requirements: [
      'Apprenticeship or trainee post at a working crystal glassworks',
      'Steady hands and an eye for symmetry and pattern',
      'Comfort working with grinding wheels and (historically) acid polishing',
      'GCSE Maths, English and Science',
    ],
    supportTags: [],
    dayToDay: [
      'Mark out cutting patterns on blown crystal blanks',
      'Cut facets and designs using rotating grinding wheels',
      'Polish cut glass to a brilliant finish',
      'Work from both traditional pattern books and bespoke commissions',
    ],
    whereToStudy: [
      { name: 'Heritage Crafts', url: 'https://www.heritagecrafts.org.uk/craft/cut-crystal-glass-making-skilled-trades-manufacture/', description: 'Endangered crafts directory - cut crystal glass making is critically endangered' },
    ],
    progression: [
      'Glass Cutting Trainee (Entry (£19k-£24k))',
      'Glass Cutter (Mid-level (£24k-£32k))',
      'Senior Cutter, bespoke commissions (Senior (£32k-£38k))',
      'Master Cutter / Studio Lead (Lead / Specialist (£38k+))',
    ],
    similarCareers: [
      128,
      132,
      126,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'tlevel-craft-design',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Glassworks Trainee Route',
        duration: '4-6 years',
        cost: 'Low cost - trained on the job at one of the UK\'s few remaining crystal glassworks',
        entryRequirements: 'No formal qualifications required - some employers sponsor RCA-linked design training for standout trainees',
        subjects: [
          'gcse-science-combined',
          'tlevel-craft-design',
        ],
        description: 'Fewer than 8 skilled cutters remain with this as their main income, spread across a small handful of glassworks (Dartington, Cumbria Crystal, Royal Brierley among them) - most of the workforce is over 50, with very few trainees behind them.',
      },
    ],
  },
  {
    id: 134,
    employmentPercentage: 0.0000174, // ~6 UK ship figurehead carvers (1 full-time + up to 5 side-income) of ~34.5M in work (Heritage Crafts, 2025)
    rarityLabel: '1 in every 5,745,000 workers',
    category: 'Creative & Media',
    title: "Ship's Figurehead Carver",
    salary: '£22k - £40k+',
    description: 'Hand-carve and restore ornately-sculpted wooden figureheads and decorative ship carvings, a maritime craft down to essentially one full-time practitioner in the UK.',
    requirements: [
      'Woodcarving training (specialist courses or a fine art/sculpture route, since no dedicated apprenticeship exists)',
      'Sculptural skill in laminated timber, from maquette to finished carving',
      'Knowledge of historic ship decoration for accurate restoration work',
      'GCSE Art & Design, Maths and English',
    ],
    supportTags: [
      'Flexible hours',
    ],
    dayToDay: [
      'Sketch and build small-scale maquettes before carving',
      'Laminate and hand-carve timber into figures and decorative panels',
      'Restore historic figureheads for museums and preserved ships',
      'Carve new figureheads and ship ornamentation for private commissions',
    ],
    whereToStudy: [
      { name: 'Heritage Crafts', url: 'https://heritagecrafts.org.uk/craft/figurehead-and-ship-carving/', description: 'Endangered crafts directory - figurehead and ship carving is critically endangered' },
      { name: 'City & Guilds of London Art School', url: 'https://www.cityandguildsartschool.ac.uk', description: 'Woodcarving & gilding degree routes relevant to historic carving' },
    ],
    progression: [
      'Woodcarving Trainee (Entry (£18k-£24k))',
      'Carver, restoration assistant work (Mid-level (£24k-£32k))',
      'Carver, own commissions (Senior (£32k-£40k))',
      'Master Carver, museum & heritage-fleet work (Lead / Specialist (£40k+))',
    ],
    similarCareers: [
      128,
      130,
      125,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'tlevel-craft-design',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Woodcarving & Restoration Route',
        duration: '5+ years, largely self-directed',
        cost: 'Moderate cost - no dedicated apprenticeship exists, so training is via general woodcarving courses plus self-taught restoration experience',
        entryRequirements: 'No formal qualifications required - a strong sculpture/woodcarving portfolio is essential to get restoration commissions',
        subjects: [
          'tlevel-craft-design',
        ],
        description: 'Heritage Crafts records just one full-time UK professional (plus up to 5 more doing it as side income) and zero current trainees - the itinerant, unpredictable nature of ship-restoration work makes it very hard to train someone into full-time.',
      },
    ],
  },
  // --- 5 ordinary, common UK jobs flagged as AI-exposed on the "Jobs
  // Endangered by AI" page (aiEndangeredJobs.ts) - NOT rare or heritage
  // careers (no rarityLabel), just real, everyday roles a growing amount
  // of AI tooling is displacing. employmentPercentage uses the same
  // ~31.4M UK workforce denominator as the original 111 careers (not the
  // ~34.5M heritage-crafts one), since these aren't from that dataset.
  // Where an exact SOC-coded headcount wasn't available, the estimate and
  // its source are named inline rather than presented as more precise
  // than it is.
  {
    id: 135,
    employmentPercentage: 0.1433, // ~45,000 UK telephone salespersons (SOC 7113) - estimate, no single confirmed ONS headcount for this unit group
    category: 'Business & Finance',
    title: 'Telesales Representative',
    salary: '£19k - £28k',
    description: 'Sell products or services to customers over the phone, following scripts and working toward sales targets.',
    requirements: [
      'Communication and persuasion skills',
      'Resilience and a target-driven mindset',
      'GCSE English and Maths',
      'Confidence handling rejection',
    ],
    supportTags: [
      'Remote friendly',
      'Work from home',
    ],
    dayToDay: [
      'Make outbound calls to warm and cold leads',
      'Follow scripts while adapting to the conversation',
      'Log call outcomes and update the CRM',
      'Work toward daily and weekly sales targets',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=telesales', description: 'Business & sales skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=telesales', description: 'Affordable professional courses' },
    ],
    progression: [
      'Telesales Representative (Entry (£19k-£23k))',
      'Senior Telesales Representative (Mid-level (£23k-£28k))',
      'Telesales Team Leader (Senior (£28k-£34k))',
      'Sales Manager (Lead / Specialist (£34k+))',
    ],
    similarCareers: [
      17,
      75,
    ],
    matchedSubjects: [
      'customer-service-apprenticeship',
      'gcse-english',
      'gcse-business-studies',
      'gcse-maths',
      'vocational-retail',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '1-2 years',
        cost: 'Low cost - often paid while you train (apprenticeship wage)',
        entryRequirements: 'GCSEs (English & Maths) or equivalent - varies by employer',
        subjects: [
          'customer-service-apprenticeship',
          'vocational-retail',
        ],
        description: 'Most telesales roles train on the job with no formal qualification required, though AI dialers and scripted bots are shrinking the number of these roles overall.',
      },
    ],
  },
  {
    id: 136,
    employmentPercentage: 0.1656, // ~52,000 UK travel agency employees (IBISWorld, Travel Agencies UK industry employment, 2024/2025)
    category: 'Service & Hospitality',
    title: 'Travel Agent',
    salary: '£19k - £27k',
    description: 'Book flights, holidays and other travel arrangements for customers, matching trips to their budget and preferences.',
    requirements: [
      'Customer service skills',
      'Attention to detail',
      'Sales ability',
      'GCSE English and Maths',
    ],
    supportTags: [],
    dayToDay: [
      'Consult customers on travel needs and budgets',
      'Book flights, hotels and package holidays',
      'Process payments and travel documentation',
      'Stay current on destinations, visas and travel advisories',
    ],
    whereToStudy: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/search?keywords=travel+agent', description: 'Business & travel industry skills' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=travel+agent', description: 'Affordable professional courses' },
    ],
    progression: [
      'Trainee Travel Agent (Entry (£19k-£22k))',
      'Travel Agent (Mid-level (£22k-£27k))',
      'Senior Travel Consultant (Senior (£27k-£33k))',
      'Branch Manager (Lead / Specialist (£33k+))',
    ],
    similarCareers: [
      75,
      179,
    ],
    matchedSubjects: [
      'btec-travel-tourism',
      'gcse-english',
      'gcse-business-studies',
      'gcse-maths',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Travel & Tourism Route',
        duration: '1-2 years',
        cost: 'Low to moderate cost - college course or on-the-job training',
        entryRequirements: 'GCSEs helpful but not always required - varies by employer',
        subjects: [
          'btec-travel-tourism',
        ],
        description: 'Online booking sites and AI trip-planning tools have already reduced demand for this role significantly, and that shift is continuing.',
      },
    ],
  },
  {
    id: 137,
    employmentPercentage: 0.2866, // ~90,000 estimated UK entry-level/junior developers - a subset of SOC 2136's total (see Software Developer, id 1), not a separate SOC code
    category: 'Technology & Digital',
    title: 'Junior Software Developer',
    salary: '£22k - £32k',
    description: 'Write and test code for websites and software under supervision, handling bug fixes, small features and routine tasks.',
    requirements: [
      'Programming fundamentals (at least one language)',
      'Problem-solving skills',
      'GCSE Maths',
      'Willingness to learn and take feedback',
    ],
    supportTags: [
      'Remote friendly',
    ],
    dayToDay: [
      'Write and test code for small features and bug fixes',
      'Pair with senior developers and follow code reviews',
      'Attend stand-ups and sprint planning',
      'Learn the codebase, tools and team conventions',
    ],
    whereToStudy: [
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org', description: 'Free coding curriculum and certifications' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=junior+software+developer', description: 'Affordable professional courses' },
    ],
    progression: [
      'Junior Software Developer (Entry (£22k-£28k))',
      'Software Developer (Mid-level (£28k-£45k))',
      'Senior Software Developer (Senior (£45k-£60k))',
      'Lead Developer / Engineering Manager (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      1,
      10,
      68,
    ],
    matchedSubjects: [
      'software-development-apprenticeship',
      'coding-bootcamp-software-development',
      'computer-science-bsc',
      'gcse-maths',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Bootcamp Route',
        duration: '1-2 years',
        cost: 'Low cost (apprenticeship, paid) to moderate cost (bootcamp fees)',
        entryRequirements: 'No degree required - a portfolio of projects matters more than qualifications',
        subjects: [
          'software-development-apprenticeship',
          'coding-bootcamp-software-development',
        ],
        description: 'AI coding assistants are increasingly handling the routine, entry-level tasks juniors traditionally cut their teeth on, making this specific rung of the career ladder harder to get a foothold on.',
      },
    ],
  },
  {
    id: 138,
    employmentPercentage: 0.1433, // ~45,000 UK legal secretaries (SOC 4212) - estimate, paralegal work folded in rather than a separate entry
    category: 'Business & Finance',
    title: 'Legal Secretary / Paralegal',
    salary: '£20k - £30k',
    description: "Provide administrative, document-drafting and case-research support in solicitors' offices and legal departments.",
    requirements: [
      'Organisation and attention to detail',
      'GCSE English',
      'Confidentiality and discretion',
      'Typing and document-formatting skills',
    ],
    supportTags: [],
    dayToDay: [
      "Prepare legal documents and client correspondence",
      'Manage and organise case files',
      'Research case law and precedent for solicitors',
      'Liaise with clients and courts on case admin',
    ],
    whereToStudy: [
      { name: 'CILEx', url: 'https://www.cilex.org.uk', description: 'Legal executive and paralegal qualifications' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=legal+secretary', description: 'Affordable professional courses' },
    ],
    progression: [
      'Legal Secretary / Paralegal (Entry (£20k-£25k))',
      'Senior Paralegal (Mid-level (£25k-£32k))',
      'Legal Executive (CILEx) (Senior (£32k-£45k))',
      'Chartered Legal Executive (Lead / Specialist (£45k+))',
    ],
    similarCareers: [
      92,
      75,
    ],
    matchedSubjects: [
      'tlevel-legal-services',
      'cilex-legal-executive',
      'gcse-english',
      'gcse-business-studies',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Legal Services Route',
        duration: '2-3 years',
        cost: 'Low to moderate cost - college course or CILEx qualifications, often part-funded by an employer',
        entryRequirements: 'GCSEs (English) - a T Level or CILEx route can start without a law degree',
        subjects: [
          'tlevel-legal-services',
          'cilex-legal-executive',
        ],
        description: 'AI document review and drafting tools are increasingly handling the routine admin this role has traditionally covered.',
      },
    ],
  },
  {
    id: 139,
    employmentPercentage: 0.0892, // ~28,000 UK translation & interpretation employees (Statista, translation and interpretation activities, 2019) - SOC 3412 "Authors, writers and translators" is a broader group average
    category: 'Creative & Media',
    title: 'Translator',
    salary: '£22k - £32k',
    description: 'Translate documents, media and communications between languages for businesses, publishers and public bodies.',
    requirements: [
      'Fluency in at least two languages',
      'Excellent writing skills in the target language',
      'Attention to detail',
      'A relevant degree is common but not always required',
    ],
    supportTags: [
      'Remote friendly',
      'Work from home',
    ],
    dayToDay: [
      'Translate written documents and media between languages',
      'Proofread and quality-check finished translations',
      'Research specialist terminology for technical/legal texts',
      'Liaise with clients on tone, context and requirements',
    ],
    whereToStudy: [
      { name: 'Chartered Institute of Linguists', url: 'https://www.ciol.org.uk', description: 'Professional qualifications and accreditation for translators' },
      { name: 'Udemy', url: 'https://www.udemy.com/courses/search/?q=translation', description: 'Affordable professional courses' },
    ],
    progression: [
      'Junior Translator (Entry (£22k-£26k))',
      'Translator (Mid-level (£26k-£32k))',
      'Senior / Specialist Translator (Senior (£32k-£40k))',
      'Translation Project Manager (Lead / Specialist (£40k+))',
    ],
    similarCareers: [
      43,
      70,
    ],
    matchedSubjects: [
      'modern-languages-ba',
      'translation-interpreting-ba',
      'gcse-french',
      'gcse-spanish',
      'gcse-english',
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels including a modern foreign language - typical offer varies by university',
        subjects: [
          'modern-languages-ba',
          'translation-interpreting-ba',
        ],
        description: 'Machine translation now handles most routine text work, so this route increasingly favours specialist/technical translation over general text.',
      },
    ],
  },
  // --- 19 ordinary, common UK jobs behind the "Careers Least at Risk from
  // AI" pills (aiSafeCareers.ts) - added so every pill in that section
  // links to a real PathScrawler career, not just the ones that happened
  // to already exist. Same ~31.4M workforce denominator as the original
  // 111 careers. These are common, well-documented UK occupations, so
  // employmentPercentage is a rounded general estimate rather than an
  // individually WebSearch-verified figure per role (unlike the ultra-rare
  // heritage crafts, where that precision mattered) - each is noted as an
  // estimate rather than presented as more precise than it is.
  {
    id: 140,
    employmentPercentage: 0.0955, // ~30,000 UK roofers (SOC 5314) - estimate
    category: 'Construction & Trades',
    title: 'Roofer',
    salary: '£22k - £38k',
    description: 'Fit, repair and maintain roofs on new-build and existing properties, working at height in all weather.',
    requirements: [
      'Physical fitness and a head for heights',
      'Practical, hands-on skills',
      'GCSE Maths and English',
      'CSCS card (Construction Skills Certification Scheme)',
    ],
    supportTags: [],
    dayToDay: [
      'Fit tiles, slates or felt roofing to new and existing buildings',
      'Repair storm damage, leaks and worn roofing',
      'Work safely at height using scaffolding and harnesses',
      'Assess roof structures and quote for jobs',
    ],
    whereToStudy: [
      { name: 'CITB', url: 'https://www.citb.co.uk', description: 'Construction apprenticeships and training' },
    ],
    progression: [
      'Roofing Apprentice (Entry (£18k-£24k))',
      'Roofer (Mid-level (£24k-£32k))',
      'Senior Roofer (Senior (£32k-£38k))',
      'Roofing Contractor / Business Owner (Lead / Specialist (£38k+))',
    ],
    similarCareers: [
      89,
      125,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'tlevel-construction-on-site-construction',
      'btec-construction',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship Route',
        duration: '2-3 years',
        cost: 'Low cost - paid apprenticeship wage while training',
        entryRequirements: 'No formal qualifications required - GCSEs helpful',
        subjects: [
          'tlevel-construction-on-site-construction',
          'btec-construction',
        ],
        description: 'Hands-on, physical work at height in unpredictable weather and site conditions - the kind of work AI systems can\'t currently do.',
      },
    ],
  },
  {
    id: 141,
    employmentPercentage: 0.1433, // ~45,000 UK plasterers (SOC 5321) - estimate
    category: 'Construction & Trades',
    title: 'Plasterer',
    salary: '£22k - £36k',
    description: 'Apply plaster, render and dry-lining to walls and ceilings for a smooth, finished surface.',
    requirements: [
      'Practical, hands-on skills',
      'Physical fitness',
      'GCSE Maths and English',
      'CSCS card',
    ],
    supportTags: [],
    dayToDay: [
      'Prepare surfaces and mix plaster/render',
      'Apply plaster to walls and ceilings by hand or machine',
      'Fit dry-lining and plasterboard',
      'Finish surfaces ready for painting/decorating',
    ],
    whereToStudy: [
      { name: 'CITB', url: 'https://www.citb.co.uk', description: 'Construction apprenticeships and training' },
    ],
    progression: [
      'Plastering Apprentice (Entry (£18k-£23k))',
      'Plasterer (Mid-level (£23k-£30k))',
      'Senior Plasterer (Senior (£30k-£36k))',
      'Plastering Contractor (Lead / Specialist (£36k+))',
    ],
    similarCareers: [
      89,
      131,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'tlevel-construction-on-site-construction',
      'btec-construction',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship Route',
        duration: '2-3 years',
        cost: 'Low cost - paid apprenticeship wage while training',
        entryRequirements: 'No formal qualifications required - GCSEs helpful',
        subjects: [
          'tlevel-construction-on-site-construction',
          'btec-construction',
        ],
        description: 'Every wall and room is a slightly different job - reading and adapting to real surfaces in real time is still a human skill.',
      },
    ],
  },
  {
    id: 142,
    employmentPercentage: 0.6369, // ~200,000 UK electricians (SOC 5241) - estimate
    category: 'Construction & Trades',
    title: 'Electrician',
    salary: '£26k - £42k',
    description: 'Install, inspect and repair electrical wiring and systems in homes, businesses and industrial sites.',
    requirements: [
      'Technical and problem-solving skills',
      'Attention to detail and safety awareness',
      'GCSE Maths, English and Science',
      'NVQ/City & Guilds electrical qualification',
    ],
    supportTags: [],
    dayToDay: [
      'Install and wire electrical systems in new builds',
      'Diagnose and repair faults',
      'Test and certify electrical installations for safety',
      'Read technical drawings and building plans',
    ],
    whereToStudy: [
      { name: 'CITB', url: 'https://www.citb.co.uk', description: 'Construction apprenticeships and training' },
      { name: 'NICEIC', url: 'https://www.niceic.com', description: 'Electrical contractor certification' },
    ],
    progression: [
      'Electrical Apprentice (Entry (£18k-£25k))',
      'Electrician (Mid-level (£28k-£36k))',
      'Approved Electrician (Senior (£36k-£42k))',
      'Electrical Contractor / Business Owner (Lead / Specialist (£42k+))',
    ],
    similarCareers: [
      33,
      89,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'gcse-science-combined',
      'electrical-engineering-apprenticeship',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship Route',
        duration: '3-4 years',
        cost: 'Low cost - paid apprenticeship wage while training',
        entryRequirements: 'GCSEs including Maths and Science helpful',
        subjects: [
          'electrical-engineering-apprenticeship',
        ],
        description: 'Diagnosing faults in real buildings and making safety-critical judgment calls on site is still squarely human work.',
      },
    ],
  },
  {
    id: 143,
    employmentPercentage: 0.4777, // ~150,000 UK plumbers and heating engineers - estimate
    category: 'Construction & Trades',
    title: 'Plumber',
    salary: '£26k - £42k',
    description: 'Install and repair pipework, heating systems and water fittings in homes and businesses.',
    requirements: [
      'Practical, hands-on skills',
      'Problem-solving ability',
      'GCSE Maths and English',
      'NVQ/City & Guilds plumbing qualification',
    ],
    supportTags: [],
    dayToDay: [
      'Install and repair pipework, boilers and heating systems',
      'Diagnose and fix leaks and blockages',
      'Fit bathrooms and kitchen plumbing',
      'Carry out gas safety checks (Gas Safe registered plumbers)',
    ],
    whereToStudy: [
      { name: 'CITB', url: 'https://www.citb.co.uk', description: 'Construction apprenticeships and training' },
      { name: 'Gas Safe Register', url: 'https://www.gassaferegister.co.uk', description: 'Gas safety registration and training' },
    ],
    progression: [
      'Plumbing Apprentice (Entry (£18k-£25k))',
      'Plumber (Mid-level (£28k-£36k))',
      'Gas Safe Registered Plumber (Senior (£36k-£42k))',
      'Plumbing Contractor / Business Owner (Lead / Specialist (£42k+))',
    ],
    similarCareers: [
      142,
      89,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'nvq-plumbing',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship Route',
        duration: '3-4 years',
        cost: 'Low cost - paid apprenticeship wage while training',
        entryRequirements: 'No formal qualifications required - GCSEs helpful',
        subjects: [
          'nvq-plumbing',
        ],
        description: 'Every property\'s pipework is laid out differently and faults are rarely identical - hands-on diagnosis in cramped, awkward real spaces is hard to automate.',
      },
    ],
  },
  {
    id: 144,
    employmentPercentage: 0.4777, // ~150,000 UK carpenters and joiners (SOC 5319) - estimate
    category: 'Construction & Trades',
    title: 'Carpenter',
    salary: '£24k - £38k',
    description: 'Build, install and repair wooden structures, fixtures and fittings on construction sites and in workshops.',
    requirements: [
      'Practical woodworking skills',
      'Attention to detail',
      'GCSE Maths and English',
      'NVQ/City & Guilds carpentry qualification',
    ],
    supportTags: [],
    dayToDay: [
      'Measure, cut and fit timber for structures and fittings',
      'Install doors, stairs, kitchens and fitted furniture',
      'Read technical drawings and building plans',
      'Repair and restore existing woodwork',
    ],
    whereToStudy: [
      { name: 'CITB', url: 'https://www.citb.co.uk', description: 'Construction apprenticeships and training' },
    ],
    progression: [
      'Carpentry Apprentice (Entry (£18k-£24k))',
      'Carpenter (Mid-level (£24k-£32k))',
      'Senior Carpenter / Joiner (Senior (£32k-£38k))',
      'Carpentry Contractor / Business Owner (Lead / Specialist (£38k+))',
    ],
    similarCareers: [
      89,
      125,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'nvq-carpentry',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship Route',
        duration: '2-3 years',
        cost: 'Low cost - paid apprenticeship wage while training',
        entryRequirements: 'No formal qualifications required - GCSEs helpful',
        subjects: [
          'nvq-carpentry',
        ],
        description: 'Skilled hands-on craft, adapting each cut and fit to the real material in front of you - creative physical work that\'s hard to automate.',
      },
    ],
  },
  {
    id: 145,
    employmentPercentage: 0.2548, // ~80,000 UK bricklayers (SOC 5312) - estimate
    category: 'Construction & Trades',
    title: 'Bricklayer',
    salary: '£24k - £38k',
    description: 'Build and repair walls, structures and brickwork on construction sites using bricks, blocks and mortar.',
    requirements: [
      'Physical fitness and hands-on skills',
      'Attention to detail and precision',
      'GCSE Maths and English',
      'CSCS card',
    ],
    supportTags: [],
    dayToDay: [
      'Lay bricks and blocks to build walls and structures',
      'Mix mortar and prepare materials',
      'Read building plans and follow measurements precisely',
      'Repair and repoint existing brickwork',
    ],
    whereToStudy: [
      { name: 'CITB', url: 'https://www.citb.co.uk', description: 'Construction apprenticeships and training' },
    ],
    progression: [
      'Bricklaying Apprentice (Entry (£18k-£24k))',
      'Bricklayer (Mid-level (£24k-£32k))',
      'Senior Bricklayer (Senior (£32k-£38k))',
      'Bricklaying Contractor / Business Owner (Lead / Specialist (£38k+))',
    ],
    similarCareers: [
      89,
      130,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'bricklaying-apprenticeship',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship Route',
        duration: '2-3 years',
        cost: 'Low cost - paid apprenticeship wage while training',
        entryRequirements: 'No formal qualifications required - GCSEs helpful',
        subjects: [
          'bricklaying-apprenticeship',
        ],
        description: 'Outdoor, physical, precision work on a different site with different conditions every time - real-world unpredictability that resists automation.',
      },
    ],
  },
  {
    id: 146,
    employmentPercentage: 0.1911, // ~60,000 UK dental nurses (SOC 6131) - estimate
    category: 'Healthcare & Medicine',
    title: 'Dental Nurse',
    salary: '£20k - £28k',
    description: 'Support dentists during treatment, prepare equipment, and care for patients before, during and after procedures.',
    requirements: [
      'Care and communication skills',
      'Attention to detail and hygiene standards',
      'GCSE English, Maths and Science',
      'NVQ/Diploma in Dental Nursing (or equivalent)',
    ],
    supportTags: [],
    dayToDay: [
      'Prepare instruments and materials for dental treatment',
      'Assist dentists during procedures',
      'Reassure and care for patients',
      'Maintain hygiene and sterilisation standards',
    ],
    whereToStudy: [
      { name: 'National Examining Board for Dental Nurses', url: 'https://www.nebdn.org', description: 'Dental nursing qualifications' },
    ],
    progression: [
      'Trainee Dental Nurse (Entry (£18k-£21k))',
      'Qualified Dental Nurse (Mid-level (£21k-£26k))',
      'Senior Dental Nurse (Senior (£26k-£30k))',
      'Practice Manager / Lead Dental Nurse (Lead / Specialist (£30k+))',
    ],
    similarCareers: [
      22,
      24,
    ],
    matchedSubjects: [
      'gcse-english',
      'gcse-maths',
      'gcse-science-combined',
      'dental-nursing-apprenticeship',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Vocational Route',
        duration: '1-2 years',
        cost: 'Low cost - often paid while you train',
        entryRequirements: 'GCSEs (English, Maths, Science) - varies by employer',
        subjects: [
          'dental-nursing-apprenticeship',
        ],
        description: 'Hands-on chairside assistance and calming anxious patients in the moment - presence-based care that AI can\'t provide.',
      },
    ],
  },
  {
    id: 147,
    employmentPercentage: 0.1592, // ~50,000 UK firefighters (SOC 3411, inc. retained/part-time) - estimate
    category: 'Public Services',
    title: 'Firefighter',
    salary: '£24k - £40k',
    description: 'Respond to fires, road accidents and other emergencies to protect life, property and the environment.',
    requirements: [
      'Physical fitness',
      'Calm under pressure',
      'GCSE Maths and English',
      'Full driving licence usually required',
    ],
    supportTags: [],
    dayToDay: [
      'Respond to emergency calls (fires, road accidents, floods)',
      'Carry out rescues and firefighting operations',
      'Maintain equipment and vehicles',
      'Deliver fire safety education to the public',
    ],
    whereToStudy: [
      { name: 'National Fire Chiefs Council', url: 'https://nfcc.org.uk', description: 'Firefighter recruitment and training routes' },
    ],
    progression: [
      'Trainee Firefighter (Entry (£24k-£28k))',
      'Firefighter (Mid-level (£28k-£34k))',
      'Crew Manager (Senior (£34k-£40k))',
      'Watch Manager / Station Manager (Lead / Specialist (£40k+))',
    ],
    similarCareers: [
      90,
      23,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'firefighter-apprenticeship',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Direct Entry Route',
        duration: '1-2 years training',
        cost: 'Low cost - paid role from day one',
        entryRequirements: 'No degree required - fitness test and assessment centre',
        subjects: [
          'firefighter-apprenticeship',
        ],
        description: 'Every incident is physically unpredictable and demands real-time judgment under pressure - the opposite of a scriptable task.',
      },
    ],
  },
  {
    id: 148,
    employmentPercentage: 0.9554, // ~300,000 UK security guards (SOC 9241) - estimate
    category: 'Public Services',
    title: 'Security Guard',
    salary: '£20k - £28k',
    description: 'Protect people, property and premises by monitoring sites, checking access and responding to incidents.',
    requirements: [
      'Alertness and reliability',
      'Communication and conflict-resolution skills',
      'GCSE English',
      'SIA (Security Industry Authority) licence',
    ],
    supportTags: [
      'Flexible hours',
    ],
    dayToDay: [
      'Patrol and monitor premises',
      'Check identification and control access',
      'Respond to alarms and incidents',
      'Write incident reports',
    ],
    whereToStudy: [
      { name: 'Security Industry Authority', url: 'https://www.sia.homeoffice.gov.uk', description: 'SIA licensing and training requirements' },
    ],
    progression: [
      'Security Guard (Entry (£20k-£23k))',
      'Senior Security Officer (Mid-level (£23k-£27k))',
      'Security Supervisor (Senior (£27k-£32k))',
      'Security Manager (Lead / Specialist (£32k+))',
    ],
    similarCareers: [
      90,
    ],
    matchedSubjects: [
      'gcse-english',
      'vocational-security-guard',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'SIA Licence Route',
        duration: 'A few weeks of training',
        cost: 'Low cost - short course plus SIA licence fee',
        entryRequirements: 'No formal qualifications required - background check and SIA licence needed',
        subjects: [
          'vocational-security-guard',
        ],
        description: 'Reading real, unpredictable situations and people in the moment is a human judgment call, not a scriptable one.',
      },
    ],
  },
  {
    id: 149,
    employmentPercentage: 2.5478, // ~800,000 UK cleaners (SOC 9231) - estimate, one of the largest UK occupations
    category: 'Service & Hospitality',
    title: 'Cleaner',
    salary: '£18k - £24k',
    description: 'Clean and maintain homes, offices and public buildings to a high standard of hygiene and presentation.',
    requirements: [
      'Reliability and attention to detail',
      'Physical stamina',
      'No formal qualifications usually required',
      'Basic health & safety awareness',
    ],
    supportTags: [
      'Flexible hours',
      'Part-time available',
    ],
    dayToDay: [
      'Clean and sanitise rooms, surfaces and equipment',
      'Restock supplies and report maintenance issues',
      'Follow health and safety / COSHH procedures',
      'Work to a schedule across multiple sites or rooms',
    ],
    whereToStudy: [
      { name: 'British Institute of Cleaning Science', url: 'https://www.bics.org.uk', description: 'Cleaning industry training and standards' },
    ],
    progression: [
      'Cleaner (Entry (£18k-£21k))',
      'Senior Cleaner (Mid-level (£21k-£23k))',
      'Cleaning Supervisor (Senior (£23k-£27k))',
      'Cleaning Contracts Manager (Lead / Specialist (£27k+))',
    ],
    similarCareers: [
      165,
      148,
    ],
    matchedSubjects: [
      'vocational-cleaning-facilities',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job Route',
        duration: 'Days to weeks',
        cost: 'Low cost - trained on the job',
        entryRequirements: 'No formal qualifications required',
        subjects: [
          'vocational-cleaning-facilities',
        ],
        description: 'Physically adapting to a different, messy, real space every time is a mundane but genuinely hard-to-automate task.',
      },
    ],
  },
  {
    id: 150,
    employmentPercentage: 1.2739, // ~400,000 UK childcare/early years workers (SOC 6121) - estimate
    category: 'Education & Training',
    title: 'Childcare Worker',
    salary: '£17k - £24k',
    description: 'Care for and support the development of young children in nurseries, pre-schools or as a childminder.',
    requirements: [
      'Patience and communication skills',
      'Enhanced DBS check',
      'GCSE English and Maths',
      'Level 3 Early Years qualification (or working toward one)',
    ],
    supportTags: [
      'Flexible hours',
    ],
    dayToDay: [
      'Plan and lead play-based learning activities',
      'Support children\'s social, emotional and physical development',
      'Monitor safety, wellbeing and hygiene',
      'Communicate with parents about a child\'s progress',
    ],
    whereToStudy: [
      { name: 'Early Years Alliance', url: 'https://www.eyalliance.org.uk', description: 'Early years training and qualifications' },
    ],
    progression: [
      'Nursery Assistant (Entry (£17k-£19k))',
      'Early Years Educator (Mid-level (£19k-£23k))',
      'Room Leader (Senior (£23k-£26k))',
      'Nursery Manager (Lead / Specialist (£26k+))',
    ],
    similarCareers: [
      48,
      82,
    ],
    matchedSubjects: [
      'gcse-english',
      'gcse-maths',
      'nvq-early-years-educator',
      'tlevel-education-childcare',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Early Years Qualification Route',
        duration: '1-2 years',
        cost: 'Low to moderate cost - college course or apprenticeship',
        entryRequirements: 'GCSEs (English & Maths) helpful - varies by provider',
        subjects: [
          'nvq-early-years-educator',
          'tlevel-education-childcare',
        ],
        description: 'Presence, patience and emotional attunement with young children is exactly the kind of care work AI can\'t replace.',
      },
    ],
  },
  {
    id: 151,
    employmentPercentage: 0.0955, // ~30,000 UK professional athletes across all sports (SOC 3441) - estimate
    category: 'Sport & Leisure',
    title: 'Professional Athlete',
    salary: '£18k - £100k+',
    description: 'Compete professionally in a sport, training and performing at elite level - pay varies enormously by sport and level.',
    requirements: [
      'Elite physical ability in a chosen sport',
      'Years of dedicated training from a young age',
      'Mental resilience',
      'GCSE Maths and English',
    ],
    supportTags: [],
    dayToDay: [
      'Train and condition for competition',
      'Compete in matches, races or events',
      'Work with coaches on technique and strategy',
      'Manage recovery, diet and injury prevention',
    ],
    whereToStudy: [
      { name: 'UK Sport', url: 'https://www.uksport.gov.uk', description: 'Talent pathways and elite sport support' },
    ],
    progression: [
      'Academy / Youth Athlete (Entry (£18k-£25k))',
      'Professional Athlete (Mid-level (£25k-£45k))',
      'Elite / International Athlete (Senior (£45k-£100k+))',
      'Top-Tier Professional (Lead / Specialist (£100k+))',
    ],
    similarCareers: [
      88,
      152,
    ],
    matchedSubjects: [
      'gcse-maths',
      'gcse-english',
      'gcse-pe',
      'sports-coaching-apprenticeship',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Talent Pathway Route',
        duration: 'Years of youth-level training and competition',
        cost: 'Variable - some sports fund talent pathways, others require significant family investment',
        entryRequirements: 'No formal academic qualifications required - selection is on sporting ability',
        subjects: [
          'sports-coaching-apprenticeship',
        ],
        description: 'Real-time physical performance and split-second in-competition decisions are inherently human.',
      },
    ],
  },
  {
    id: 152,
    employmentPercentage: 0.2866, // ~90,000 UK fitness instructors (SOC 3443) - estimate
    category: 'Sport & Leisure',
    title: 'Fitness Instructor',
    salary: '£18k - £28k',
    description: 'Lead gym sessions, classes and personal training, motivating clients and correcting technique in real time.',
    requirements: [
      'Fitness and communication skills',
      'Level 2/3 Fitness Instructor qualification',
      'GCSE PE and Science helpful',
      'First aid certificate',
    ],
    supportTags: [
      'Flexible hours',
      'Part-time available',
    ],
    dayToDay: [
      'Lead one-to-one and group fitness sessions',
      'Design tailored training programmes',
      'Correct form and technique in real time',
      'Motivate and track client progress',
    ],
    whereToStudy: [
      { name: 'CIMSPA', url: 'https://www.cimspa.co.uk', description: 'Fitness industry qualifications and standards' },
    ],
    progression: [
      'Gym Instructor (Entry (£18k-£21k))',
      'Personal Trainer (Mid-level (£21k-£28k))',
      'Senior / Specialist Trainer (Senior (£28k-£35k))',
      'Studio / Gym Manager (Lead / Specialist (£35k+))',
    ],
    similarCareers: [
      88,
      151,
    ],
    matchedSubjects: [
      'gcse-pe',
      'gcse-science-combined',
      'sports-coaching-apprenticeship',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Fitness Qualification Route',
        duration: 'A few months to 1 year',
        cost: 'Low to moderate cost - short qualification courses',
        entryRequirements: 'No formal qualifications required - a Level 2 Fitness Instructor course is the usual entry point',
        subjects: [
          'sports-coaching-apprenticeship',
        ],
        description: 'Reading a client\'s form and motivation in the room, moment to moment, is hands-on human coaching.',
      },
    ],
  },
  {
    id: 153,
    employmentPercentage: 0.3185, // ~100,000 UK social workers (SOC 2442) - estimate
    category: 'Public Services',
    title: 'Social Worker',
    salary: '£28k - £42k',
    description: 'Support children, families and vulnerable adults, assessing needs and coordinating care and protection.',
    requirements: [
      'Empathy and resilience',
      'Social Work degree (BA/MA) and Social Work England registration',
      'Strong judgment under pressure',
      'Enhanced DBS check',
    ],
    supportTags: [],
    dayToDay: [
      'Assess and support the needs of individuals and families',
      'Coordinate care plans with other services',
      'Make safeguarding judgment calls',
      'Write case reports and attend reviews',
    ],
    whereToStudy: [
      { name: 'Social Work England', url: 'https://www.socialworkengland.org.uk', description: 'Registration and professional standards' },
    ],
    progression: [
      'Newly Qualified Social Worker (Entry (£28k-£32k))',
      'Social Worker (Mid-level (£32k-£38k))',
      'Senior Practitioner (Senior (£38k-£45k))',
      'Team Manager (Lead / Specialist (£45k+))',
    ],
    similarCareers: [
      154,
      155,
    ],
    matchedSubjects: [
      'social-work-ba',
      'gcse-english',
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years',
        cost: 'Higher cost - tuition fees apply (student finance available, some NHS/local authority bursaries)',
        entryRequirements: 'A-Levels or equivalent - typical offer varies by university',
        subjects: [
          'social-work-ba',
        ],
        description: 'High-stakes safeguarding judgment calls, made with incomplete information about real people\'s lives, need a person to own the decision.',
      },
    ],
  },
  {
    id: 154,
    employmentPercentage: 0.1592, // ~50,000 UK counsellors and psychotherapists - estimate
    category: 'Healthcare & Medicine',
    title: 'Counsellor',
    salary: '£22k - £38k',
    description: 'Provide talking therapy to help clients work through emotional, mental health and life challenges.',
    requirements: [
      'Empathy and active listening skills',
      'Counselling/psychotherapy qualification (Level 4+)',
      'Accreditation with a professional body (e.g. BACP)',
      'Personal resilience and boundaries',
    ],
    supportTags: [
      'Remote friendly',
      'Flexible hours',
    ],
    dayToDay: [
      'Hold one-to-one or group therapy sessions',
      'Build trust and rapport with clients',
      'Adapt approach in real time to what a client needs',
      'Keep confidential clinical notes',
    ],
    whereToStudy: [
      { name: 'BACP', url: 'https://www.bacp.co.uk', description: 'Counselling accreditation and training routes' },
    ],
    progression: [
      'Trainee Counsellor (Entry (£20k-£24k))',
      'Qualified Counsellor (Mid-level (£24k-£32k))',
      'Senior / Accredited Counsellor (Senior (£32k-£40k))',
      'Private Practice / Clinical Lead (Lead / Specialist (£40k+))',
    ],
    similarCareers: [
      153,
      22,
    ],
    matchedSubjects: [
      'counselling-ba',
      'gcse-english',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Counselling Qualification Route',
        duration: '2-4 years part-time is common',
        cost: 'Moderate cost - training courses and accreditation fees',
        entryRequirements: 'No specific qualifications required to start Level 2/3 courses - a degree route also exists',
        subjects: [
          'counselling-ba',
        ],
        description: 'Trust, presence and emotional attunement built session by session with a real person - the core of the job is human connection.',
      },
    ],
  },
  {
    id: 155,
    employmentPercentage: 0.1274, // ~40,000 UK youth workers (SOC 2443) - estimate
    category: 'Public Services',
    title: 'Youth Worker',
    salary: '£22k - £32k',
    description: 'Support young people\'s personal, social and educational development through youth clubs, projects and mentoring.',
    requirements: [
      'Communication and relationship-building skills',
      'Enhanced DBS check',
      'Youth Work qualification (or working toward one)',
      'Resilience and adaptability',
    ],
    supportTags: [
      'Flexible hours',
    ],
    dayToDay: [
      'Run youth clubs, groups and activities',
      'Build trusted relationships with young people',
      'Support young people through personal challenges',
      'Liaise with schools, families and other services',
    ],
    whereToStudy: [
      { name: 'National Youth Agency', url: 'https://www.nya.org.uk', description: 'Youth work qualifications and standards' },
    ],
    progression: [
      'Youth Support Worker (Entry (£20k-£24k))',
      'Youth Worker (Mid-level (£24k-£29k))',
      'Senior Youth Worker (Senior (£29k-£34k))',
      'Youth Service Manager (Lead / Specialist (£34k+))',
    ],
    similarCareers: [
      153,
      48,
    ],
    matchedSubjects: [
      'youth-work-ba',
      'gcse-english',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Youth Work Qualification Route',
        duration: '1-3 years',
        cost: 'Low to moderate cost - some routes are apprenticeship/employer-funded',
        entryRequirements: 'No formal qualifications required to start - a degree route also exists',
        subjects: [
          'youth-work-ba',
        ],
        description: 'Building trust with a young person over time, adapting to whatever they bring that day, is relationship-based work.',
      },
    ],
  },
  {
    id: 156,
    employmentPercentage: 0.0955, // ~30,000 UK clergy across denominations - estimate
    category: 'Public Services',
    title: 'Clergy',
    salary: '£20k - £30k',
    description: 'Lead worship, pastoral care and community life for a faith congregation - pay is typically a modest stipend.',
    requirements: [
      'A sense of vocation and pastoral commitment',
      'Denomination-specific ministry training',
      'Public speaking and community leadership skills',
      'Enhanced DBS check',
    ],
    supportTags: [
      'Flexible hours',
    ],
    dayToDay: [
      'Lead services and religious ceremonies',
      'Provide pastoral care and support to a congregation',
      'Support people through bereavement, illness and crisis',
      'Run or oversee community and outreach programmes',
    ],
    whereToStudy: [
      { name: 'Church of England Ministry', url: 'https://www.churchofengland.org/careers-and-vocations', description: 'Ordained ministry training pathways' },
    ],
    progression: [
      'Trainee / Curate (Entry (£18k-£24k))',
      'Minister / Vicar (Mid-level (£24k-£28k))',
      'Senior Minister (Senior (£28k-£32k))',
      'Bishop / Denominational Leader (Lead / Specialist (£32k+))',
    ],
    similarCareers: [
      153,
      154,
    ],
    matchedSubjects: [
      'gcse-religious-studies',
      'alevel-religious-studies',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Ministry Training Route',
        duration: '2-4 years, varies by denomination',
        cost: 'Often funded by the denomination itself',
        entryRequirements: 'Varies significantly by denomination and faith tradition',
        subjects: [
          'gcse-religious-studies',
          'alevel-religious-studies',
        ],
        description: 'Being physically and emotionally present with people at the most significant moments of their lives - comfort, ritual, trust - is not a software problem.',
      },
    ],
  },
  {
    id: 157,
    employmentPercentage: 0.0382, // ~12,000 UK commercial fishing workforce - estimate
    category: 'Agriculture & Animal Care',
    title: 'Commercial Fisher',
    salary: '£20k - £35k',
    description: 'Catch fish and shellfish at sea for the commercial seafood industry, working in physically demanding conditions.',
    requirements: [
      'Physical fitness and resilience',
      'Comfort working at sea in all weather',
      'Basic Sea Survival certificate',
      'Practical, hands-on skills',
    ],
    supportTags: [],
    dayToDay: [
      'Operate fishing gear and equipment at sea',
      'Navigate and read weather/sea conditions',
      'Sort, process and store the catch',
      'Maintain boats and equipment',
    ],
    whereToStudy: [
      { name: 'Seafish', url: 'https://www.seafish.org', description: 'UK seafood industry training and safety courses' },
    ],
    progression: [
      'Deckhand (Entry (£20k-£25k))',
      'Fisher (Mid-level (£25k-£30k))',
      'Skipper (Senior (£30k-£38k))',
      'Boat Owner / Fleet Operator (Lead / Specialist (£38k+))',
    ],
    similarCareers: [
      83,
      84,
    ],
    matchedSubjects: [
      'agriculture-apprenticeship',
      'gcse-maths',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job / Safety Training Route',
        duration: 'Weeks of safety training, then on-the-job experience',
        cost: 'Low cost - safety courses plus on-the-job training',
        entryRequirements: 'No formal qualifications required - sea survival training is essential',
        subjects: [
          'agriculture-apprenticeship',
        ],
        description: 'Working at sea means constantly adapting to weather, tides and conditions that change by the hour.',
      },
    ],
  },
  {
    id: 158,
    employmentPercentage: 0.1592, // ~50,000 UK refuse collectors - estimate
    category: 'Public Services',
    title: 'Refuse Collector',
    salary: '£20k - £26k',
    description: 'Collect household and commercial waste and recycling on a scheduled round, keeping communities clean.',
    requirements: [
      'Physical fitness',
      'Reliability and punctuality',
      'Full driving licence useful (for driver roles)',
      'No formal qualifications usually required',
    ],
    supportTags: [],
    dayToDay: [
      'Collect waste and recycling from homes and businesses',
      'Operate or assist with collection vehicles',
      'Sort recyclable materials',
      'Follow a scheduled round across a local area',
    ],
    whereToStudy: [
      { name: 'WAMITAB', url: 'https://www.wamitab.org.uk', description: 'Waste management training and qualifications' },
    ],
    progression: [
      'Loader / Refuse Collector (Entry (£20k-£23k))',
      'Refuse Vehicle Driver (Mid-level (£23k-£27k))',
      'Crew Supervisor (Senior (£27k-£31k))',
      'Waste Services Manager (Lead / Specialist (£31k+))',
    ],
    similarCareers: [
      148,
      149,
    ],
    matchedSubjects: [
      'gcse-maths',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job Route',
        duration: 'Days to weeks',
        cost: 'Low cost - trained on the job',
        entryRequirements: 'No formal qualifications required',
        subjects: [],
        description: 'Physically navigating real streets, obstacles and properties on a round is still a human (and vehicle) job.',
      },
    ],
  },
  // --- 27 Hospitality & Tourism careers, from a compiled 2025-2026 dataset
  // (National Careers Service / ONS SOC 2020 / UKHospitality / Coursera-
  // Glassdoor 2026 - UK hospitality workforce ~3.5M, UKHospitality; ~2.6M
  // on ONS's narrower measure). category stays 'Service & Hospitality' -
  // the existing internal category string - rather than the literal
  // 'Hospitality & Tourism' the source data uses: backtrackCategories.ts
  // already exposes a category with the *label* "Hospitality & Tourism"
  // that matches on career.category === 'Service & Hospitality', so using
  // that value is what actually puts these careers in the bucket the data
  // asks for - introducing a second, differently-spelled category string
  // would just split the same bucket into two that never match each
  // other. Five roles from the source list were skipped as already
  // present: Chef (id 86), Event Manager (id 87, matches "Conference /
  // Events Manager"), Travel Agent (id 136), Cleaner (id 149), and the
  // "Kitchen Porter" entry-level duplicate (merged into id 167 below,
  // which already covers it). Hospitality Worker (id 77) was removed
  // separately as too vague now that these more specific roles exist.
  {
    id: 159,
    employmentPercentage: 0.7962, // ~250,000 UK waiting staff (SOC 9273) - estimate
    category: 'Service & Hospitality',
    title: 'Waiter / Waitress',
    salary: '£19k - £24k',
    description: 'Take orders, serve food and drinks, and process payments in restaurants, cafes and hotels.',
    requirements: [
      'Communication and multitasking',
      'Customer service skills',
      'No formal qualifications required',
      'GCSE English helpful',
    ],
    supportTags: [
      'Flexible hours',
      'Part-time available',
    ],
    dayToDay: [
      'Take food and drink orders and relay them to the kitchen/bar',
      'Serve customers and process payments',
      'Keep tables and service areas clean and set',
      'Handle customer questions and requests',
    ],
    whereToStudy: [
      { name: 'Institute of Hospitality', url: 'https://www.instituteofhospitality.org', description: 'Hospitality training and career development' },
    ],
    progression: [
      'Waiter / Waitress (Entry (£17k-£20k))',
      'Head Waiter (Mid-level (£20k-£24k))',
      'Restaurant Supervisor (Senior (£24k-£28k))',
      'Restaurant Manager (Lead / Specialist (£28k+))',
    ],
    similarCareers: [
      160,
      171,
    ],
    matchedSubjects: [
      'gcse-english',
      'customer-service-apprenticeship',
      'btec-hospitality',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job Route',
        duration: 'Immediate start, trained on the job',
        cost: 'Low cost - paid from day one',
        entryRequirements: 'No formal qualifications required',
        subjects: [
          'btec-hospitality',
        ],
        description: 'One of the easiest hospitality roles to start in - most venues train new waiting staff on shift.',
      },
    ],
  },
  {
    id: 160,
    employmentPercentage: 0.6369, // ~200,000 UK bar staff (SOC 9274) - estimate
    category: 'Service & Hospitality',
    title: 'Bar Person / Bartender',
    salary: '£19k - £24k',
    description: 'Serve drinks and mix cocktails in pubs, clubs, bars, hotels and restaurants.',
    requirements: [
      'Customer service and cash handling',
      'Drink and cocktail knowledge',
      'No formal qualifications required',
      'Must be 18+ to serve alcohol',
    ],
    supportTags: [
      'Flexible hours',
      'Part-time available',
    ],
    dayToDay: [
      'Prepare and serve drinks and cocktails',
      'Handle cash and card payments',
      'Check ID and manage responsible service of alcohol',
      'Maintain stock levels and clean the bar area',
    ],
    whereToStudy: [
      { name: 'British Institute of Innkeeping', url: 'https://www.bii.org', description: 'Licensed trade training and qualifications' },
    ],
    progression: [
      'Bar Person (Entry (£17k-£20k))',
      'Senior Bartender (Mid-level (£20k-£24k))',
      'Bar Supervisor (Senior (£24k-£28k))',
      'Bar Manager (Lead / Specialist (£28k+))',
    ],
    similarCareers: [
      159,
      173,
    ],
    matchedSubjects: [
      'gcse-english',
      'customer-service-apprenticeship',
      'btec-hospitality',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job Route',
        duration: 'Immediate start, trained on the job',
        cost: 'Low cost - paid from day one',
        entryRequirements: 'No formal qualifications required - must be 18+',
        subjects: [
          'btec-hospitality',
        ],
        description: 'Most bar skills (cocktails, cellar management) are learned on shift rather than in a classroom.',
      },
    ],
  },
  {
    id: 161,
    employmentPercentage: 0.2866, // ~90,000 UK baristas - estimate, no dedicated SOC unit group
    category: 'Service & Hospitality',
    title: 'Barista',
    salary: '£19k - £24k',
    description: 'Prepare and serve coffee and other beverages in cafes, coffee shops, restaurants and hotels.',
    requirements: [
      'Coffee preparation skills (training usually provided)',
      'Customer service and attention to detail',
      'No formal qualifications required',
      'Efficiency under pressure',
    ],
    supportTags: [
      'Flexible hours',
      'Part-time available',
    ],
    dayToDay: [
      'Prepare espresso-based drinks and other beverages',
      'Take orders and handle payments',
      'Maintain and clean coffee equipment',
      'Keep the counter and seating area presentable',
    ],
    whereToStudy: [
      { name: 'Speciality Coffee Association', url: 'https://sca.coffee', description: 'Barista skills and coffee industry training' },
    ],
    progression: [
      'Barista (Entry (£17k-£20k))',
      'Senior Barista (Mid-level (£20k-£24k))',
      'Cafe Supervisor (Senior (£24k-£27k))',
      'Cafe Manager (Lead / Specialist (£27k+))',
    ],
    similarCareers: [
      159,
      86,
    ],
    matchedSubjects: [
      'gcse-english',
      'customer-service-apprenticeship',
      'btec-hospitality',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job Route',
        duration: 'Immediate start, trained on the job',
        cost: 'Low cost - paid from day one, training usually provided',
        entryRequirements: 'No formal qualifications required',
        subjects: [
          'btec-hospitality',
        ],
        description: 'Coffee skills are almost always taught on shift, with some independent chains offering barista academies.',
      },
    ],
  },
  {
    id: 162,
    employmentPercentage: 0.1274, // ~40,000 UK hosts/hostesses - estimate
    category: 'Service & Hospitality',
    title: 'Host / Hostess',
    salary: '£18k - £22k',
    description: 'Greet guests, manage reservations and seat customers in restaurants and venues.',
    requirements: [
      'Communication and organisation',
      'Customer service and professionalism',
      'No formal qualifications required',
      'Confidence managing a busy front desk',
    ],
    supportTags: [
      'Flexible hours',
      'Part-time available',
    ],
    dayToDay: [
      'Greet and welcome guests as they arrive',
      'Manage the reservations book and waiting list',
      'Seat customers and coordinate with waiting staff',
      'Handle guest enquiries and phone bookings',
    ],
    whereToStudy: [
      { name: 'Institute of Hospitality', url: 'https://www.instituteofhospitality.org', description: 'Hospitality training and career development' },
    ],
    progression: [
      'Host / Hostess (Entry (£17k-£19k))',
      'Senior Host (Mid-level (£19k-£22k))',
      'Head Host (Senior (£22k-£25k))',
      'Front of House Manager (Lead / Specialist (£25k+))',
    ],
    similarCareers: [
      163,
      159,
    ],
    matchedSubjects: [
      'gcse-english',
      'customer-service-apprenticeship',
      'btec-hospitality',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job Route',
        duration: 'Immediate start, trained on the job',
        cost: 'Low cost - paid from day one',
        entryRequirements: 'No formal qualifications required',
        subjects: [
          'btec-hospitality',
        ],
        description: 'A natural first hospitality role for anyone confident and organised on their feet.',
      },
    ],
  },
  {
    id: 163,
    employmentPercentage: 0.1911, // ~60,000 UK hotel receptionists - estimate
    category: 'Service & Hospitality',
    title: 'Receptionist (Hotel)',
    salary: '£19k - £25k',
    description: 'Welcome guests, check them in and out, and handle bookings and enquiries about hotel services.',
    requirements: [
      'Communication and IT skills',
      'Customer service and organisation',
      'GCSE English and Maths helpful',
      'A second language is a bonus',
    ],
    supportTags: [
      'Flexible hours',
    ],
    dayToDay: [
      'Check guests in and out',
      'Take and manage room bookings',
      'Answer queries about hotel services and local area',
      'Handle payments and billing',
    ],
    whereToStudy: [
      { name: 'Institute of Hospitality', url: 'https://www.instituteofhospitality.org', description: 'Hospitality training and career development' },
    ],
    progression: [
      'Hotel Receptionist (Entry (£18k-£21k))',
      'Senior Receptionist (Mid-level (£21k-£25k))',
      'Front Office Manager (Senior (£25k-£32k))',
      'Hotel Manager (Lead / Specialist (£32k+))',
    ],
    similarCareers: [
      172,
      164,
    ],
    matchedSubjects: [
      'gcse-english',
      'gcse-maths',
      'btec-hospitality',
      'hotel-management-apprenticeship',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship Route',
        duration: '1-2 years',
        cost: 'Low cost - paid apprenticeship wage while training',
        entryRequirements: 'GCSEs (English & Maths) helpful - varies by employer',
        subjects: [
          'hotel-management-apprenticeship',
        ],
        description: 'A common entry point into hotel management - many front office managers started on the desk.',
      },
    ],
  },
  {
    id: 164,
    employmentPercentage: 0.0701, // ~22,000 UK concierge roles (hotels, serviced apartments, corporate) - estimate
    category: 'Service & Hospitality',
    title: 'Concierge',
    salary: '£20k - £30k',
    description: 'Assist hotel guests with bookings, recommendations, transport and local knowledge.',
    requirements: [
      'Strong local knowledge and networking',
      'Communication and problem-solving',
      'Customer service experience essential',
      'No formal qualifications required',
    ],
    supportTags: [],
    dayToDay: [
      'Arrange restaurant bookings, tickets and transport for guests',
      'Give recommendations on local attractions and events',
      'Handle special requests and problem-solve on the spot',
      'Build a network of local contacts and suppliers',
    ],
    whereToStudy: [
      { name: 'Institute of Hospitality', url: 'https://www.instituteofhospitality.org', description: 'Hospitality training and career development' },
    ],
    progression: [
      'Concierge Assistant (Entry (£19k-£23k))',
      'Concierge (Mid-level (£23k-£28k))',
      'Head Concierge (Senior (£28k-£34k))',
      'Guest Services Manager (Lead / Specialist (£34k+))',
    ],
    similarCareers: [
      163,
      166,
    ],
    matchedSubjects: [
      'gcse-english',
      'btec-hospitality',
      'hotel-hospitality-management-ba',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Experience-Based Route',
        duration: 'Builds from customer-facing hospitality experience',
        cost: 'Low cost - typically progressed into rather than trained for directly',
        entryRequirements: 'No formal qualifications required - strong customer service experience essential',
        subjects: [
          'btec-hospitality',
        ],
        description: 'Usually a step up from front-of-house or reception roles once local knowledge and a contact network are built.',
      },
    ],
  },
  {
    id: 165,
    employmentPercentage: 0.4777, // ~150,000 UK room attendants/housekeepers - estimate
    category: 'Service & Hospitality',
    title: 'Room Attendant / Housekeeper',
    salary: '£18k - £23k',
    description: 'Clean and maintain guest rooms, replenish supplies and ensure hygiene standards in hotels.',
    requirements: [
      'Attention to detail and time management',
      'Physical stamina',
      'No formal qualifications required',
      'Reliability and hygiene standards',
    ],
    supportTags: [
      'Flexible hours',
    ],
    dayToDay: [
      'Clean and prepare guest rooms to a set standard',
      'Restock toiletries, linen and minibar supplies',
      'Report maintenance issues and lost property',
      'Follow hygiene and safety procedures',
    ],
    whereToStudy: [
      { name: 'Institute of Hospitality', url: 'https://www.instituteofhospitality.org', description: 'Hospitality training and career development' },
    ],
    progression: [
      'Room Attendant (Entry (£17k-£19k))',
      'Senior Housekeeper (Mid-level (£19k-£23k))',
      'Housekeeping Supervisor (Senior (£23k-£27k))',
      'Executive Housekeeper (Lead / Specialist (£27k+))',
    ],
    similarCareers: [
      166,
      149,
    ],
    matchedSubjects: [
      'btec-hospitality',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job Route',
        duration: 'Immediate start, trained on the job',
        cost: 'Low cost - paid from day one',
        entryRequirements: 'No formal qualifications required',
        subjects: [
          'btec-hospitality',
        ],
        description: 'Hotels train room attendants on their own standards and checklists directly on the job.',
      },
    ],
  },
  {
    id: 166,
    employmentPercentage: 0.0764, // ~24,000 UK hotel porters - estimate
    category: 'Service & Hospitality',
    title: 'Hotel Porter',
    salary: '£21k - £27k',
    description: 'Welcome guests, carry luggage, and answer questions about hotel services and facilities.',
    requirements: [
      'Customer service and physical fitness',
      'Communication and local knowledge',
      'No formal qualifications required',
      'Reliability and a professional manner',
    ],
    supportTags: [
      'Flexible hours',
    ],
    dayToDay: [
      'Welcome guests and carry luggage to rooms',
      'Show guests around hotel facilities',
      'Answer questions about services and the local area',
      'Support the front desk during busy periods',
    ],
    whereToStudy: [
      { name: 'Institute of Hospitality', url: 'https://www.instituteofhospitality.org', description: 'Hospitality training and career development' },
    ],
    progression: [
      'Hotel Porter (Entry (£19k-£22k))',
      'Senior Porter (Mid-level (£22k-£27k))',
      'Head Porter (Senior (£27k-£31k))',
      'Concierge / Front of House Manager (Lead / Specialist (£31k+))',
    ],
    similarCareers: [
      164,
      163,
    ],
    matchedSubjects: [
      'btec-hospitality',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job Route',
        duration: 'Immediate start, trained on the job',
        cost: 'Low cost - paid from day one',
        entryRequirements: 'No formal qualifications required',
        subjects: [
          'btec-hospitality',
        ],
        description: 'A common route into concierge and front-of-house management with a few years of experience.',
      },
    ],
  },
  {
    id: 167,
    employmentPercentage: 0.5732, // ~180,000 UK kitchen porters/assistants (SOC 9272) - estimate
    category: 'Service & Hospitality',
    title: 'Kitchen Porter / Kitchen Assistant',
    salary: '£17k - £25k',
    description: 'Support chefs, prepare basic food, wash dishes and keep the kitchen clean and organised.',
    requirements: [
      'Teamwork and physical stamina',
      'Hygiene and organisation',
      'No formal qualifications required',
      'Reliability, especially during service',
    ],
    supportTags: [
      'Flexible hours',
      'Part-time available',
    ],
    dayToDay: [
      'Wash dishes, pots and kitchen equipment',
      'Carry out basic food preparation for chefs',
      'Keep kitchen surfaces and floors clean',
      'Take deliveries and manage stock rotation',
    ],
    whereToStudy: [
      { name: 'City & Guilds', url: 'https://www.cityandguilds.com', description: 'Catering and hospitality qualifications' },
    ],
    progression: [
      'Kitchen Assistant (Entry (£17k-£19k))',
      'Kitchen Porter (Mid-level (£19k-£22k))',
      'Commis Chef (Senior (£22k-£25k))',
      'Chef de Partie (Lead / Specialist (£25k+))',
    ],
    similarCareers: [
      86,
      185,
    ],
    matchedSubjects: [
      'btec-hospitality',
      'chef-apprenticeship',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job Route',
        duration: 'Immediate start, no experience needed',
        cost: 'Low cost - paid from day one',
        entryRequirements: 'No formal qualifications required',
        subjects: [
          'chef-apprenticeship',
        ],
        description: 'Constant demand and high turnover make this one of the easiest hospitality roles to start in - and a common route into a chef apprenticeship from there.',
      },
    ],
  },
  {
    id: 168,
    employmentPercentage: 0.0701, // ~22,000 UK pastry chefs - estimate
    category: 'Service & Hospitality',
    title: 'Pastry Chef',
    salary: '£22k - £35k',
    description: 'Create desserts, pastries, breads and baked goods for restaurants, hotels and bakeries.',
    requirements: [
      'NVQ/City & Guilds in patisserie or bakery',
      'Baking techniques and precision',
      'Creativity and time management',
      'Apprenticeship route common',
    ],
    supportTags: [],
    dayToDay: [
      'Bake and prepare desserts, pastries and breads',
      'Design new dishes and seasonal menu items',
      'Manage stock and ingredients for the pastry section',
      'Maintain hygiene and food safety standards',
    ],
    whereToStudy: [
      { name: 'City & Guilds', url: 'https://www.cityandguilds.com', description: 'Catering and hospitality qualifications' },
    ],
    progression: [
      'Junior Pastry Chef (Entry (£20k-£24k))',
      'Pastry Chef (Mid-level (£24k-£30k))',
      'Head Pastry Chef (Senior (£30k-£38k))',
      'Executive Pastry Chef (Lead / Specialist (£38k+))',
    ],
    similarCareers: [
      169,
      170,
    ],
    matchedSubjects: [
      'nvq-catering-professional-cookery',
      'chef-apprenticeship',
      'culinary-arts-ba',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / NVQ Route',
        duration: '6-12 months training',
        cost: 'Low cost - paid apprenticeship wage while training',
        entryRequirements: 'No formal qualifications required to start',
        subjects: [
          'nvq-catering-professional-cookery',
          'chef-apprenticeship',
        ],
        description: 'Most pastry chefs train through a bakery/patisserie NVQ or apprenticeship rather than a degree.',
      },
    ],
  },
  {
    id: 169,
    employmentPercentage: 0.0796, // ~25,000 UK cake decorators - estimate
    category: 'Service & Hospitality',
    title: 'Cake Decorator',
    salary: '£19k - £28k',
    description: 'Design, make and decorate cakes for birthdays, weddings and other special occasions.',
    requirements: [
      'Artistic ability and attention to detail',
      'Creativity and hand-eye coordination',
      'No formal qualifications required',
      'A strong design portfolio helps',
    ],
    supportTags: [
      'Flexible hours',
    ],
    dayToDay: [
      'Bake and prepare cakes to order',
      'Design and apply icing, fondant and decorative details',
      'Meet clients to discuss bespoke designs',
      'Manage orders and delivery schedules',
    ],
    whereToStudy: [
      { name: 'City & Guilds', url: 'https://www.cityandguilds.com', description: 'Catering and hospitality qualifications' },
    ],
    progression: [
      'Cake Decorator (Entry (£18k-£21k))',
      'Senior Cake Decorator (Mid-level (£21k-£26k))',
      'Bakery Supervisor (Senior (£26k-£30k))',
      'Bakery Manager / Own Business (Lead / Specialist (£30k+))',
    ],
    similarCareers: [
      170,
      168,
    ],
    matchedSubjects: [
      'nvq-catering-professional-cookery',
      'tlevel-craft-design',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Craft / On-the-Job Route',
        duration: 'A few months to build a portfolio',
        cost: 'Low cost - short courses plus practice',
        entryRequirements: 'No formal qualifications required - a strong portfolio matters more',
        subjects: [
          'tlevel-craft-design',
        ],
        description: 'Many cake decorators are self-taught or trained through short specialist courses rather than a formal qualification.',
      },
    ],
  },
  {
    id: 170,
    employmentPercentage: 0.2866, // ~90,000 UK bakers (SOC 5432) - estimate
    category: 'Service & Hospitality',
    title: 'Baker',
    salary: '£19k - £26k',
    description: 'Make bread, cakes and pastries by hand and with catering equipment in bakeries, shops and hotels.',
    requirements: [
      'NVQ in bakery helpful',
      'Baking techniques and quality control',
      'Comfortable with early starts',
      'Physical stamina',
    ],
    supportTags: [],
    dayToDay: [
      'Prepare dough and bake bread, cakes and pastries',
      'Follow recipes and quality standards',
      'Manage stock and ingredient orders',
      'Maintain hygiene standards in the bakery',
    ],
    whereToStudy: [
      { name: 'City & Guilds', url: 'https://www.cityandguilds.com', description: 'Catering and hospitality qualifications' },
    ],
    progression: [
      'Baker (Entry (£18k-£21k))',
      'Senior Baker (Mid-level (£21k-£24k))',
      'Bakery Supervisor (Senior (£24k-£28k))',
      'Bakery Manager (Lead / Specialist (£28k+))',
    ],
    similarCareers: [
      169,
      168,
    ],
    matchedSubjects: [
      'nvq-catering-professional-cookery',
      'chef-apprenticeship',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / NVQ Route',
        duration: '1-2 years',
        cost: 'Low cost - paid apprenticeship wage while training',
        entryRequirements: 'No formal qualifications required',
        subjects: [
          'nvq-catering-professional-cookery',
        ],
        description: 'Most bakers train on the job at a bakery, supermarket bakery or hotel, with an NVQ alongside.',
      },
    ],
  },
  {
    id: 171,
    employmentPercentage: 0.3503, // ~110,000 UK restaurant managers (SOC 1223) - estimate
    category: 'Service & Hospitality',
    title: 'Restaurant Manager',
    salary: '£26k - £40k',
    description: "Organise a venue's day-to-day running, manage staff, ensure customer satisfaction and handle budgets.",
    requirements: [
      'Leadership and budgeting skills',
      'Customer service and problem-solving',
      'Experience required',
      'Hospitality management degree or apprenticeship helpful',
    ],
    supportTags: [],
    dayToDay: [
      'Oversee daily front-of-house and kitchen coordination',
      'Manage rotas, hire and train staff',
      'Handle customer complaints and feedback',
      'Monitor budgets, stock and supplier orders',
    ],
    whereToStudy: [
      { name: 'Institute of Hospitality', url: 'https://www.instituteofhospitality.org', description: 'Hospitality management training and qualifications' },
    ],
    progression: [
      'Assistant Manager (Entry (£22k-£27k))',
      'Restaurant Manager (Mid-level (£27k-£36k))',
      'Area Manager (Senior (£36k-£48k))',
      'Operations Director (Lead / Specialist (£48k+))',
    ],
    similarCareers: [
      159,
      174,
    ],
    matchedSubjects: [
      'gcse-business-studies',
      'btec-hospitality',
      'hotel-hospitality-management-ba',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Experience / Apprenticeship Route',
        duration: '2-4 years, building from a front-of-house role',
        cost: 'Low cost - typically progressed into on the job',
        entryRequirements: 'No formal qualifications required - experience matters most',
        subjects: [
          'hotel-management-apprenticeship',
        ],
        description: 'Most restaurant managers work their way up from waiting, bar or kitchen roles rather than starting in management.',
      },
    ],
  },
  {
    id: 172,
    employmentPercentage: 0.1752, // ~55,000 UK hotel managers (SOC 1221) - estimate
    category: 'Service & Hospitality',
    title: 'Hotel Manager',
    salary: '£28k - £50k+',
    description: 'Manage all hotel operations, staff, budgets, guest satisfaction and marketing.',
    requirements: [
      'Degree in hospitality management or advanced apprenticeship',
      'Leadership and financial management',
      'Strategic planning and communication',
      'Significant hospitality experience',
    ],
    supportTags: [],
    dayToDay: [
      'Oversee all hotel departments and staff',
      'Manage budgets, occupancy and revenue targets',
      'Handle guest satisfaction and escalated complaints',
      'Coordinate marketing and local partnerships',
    ],
    whereToStudy: [
      { name: 'Institute of Hospitality', url: 'https://www.instituteofhospitality.org', description: 'Hospitality management training and qualifications' },
    ],
    progression: [
      'Assistant Manager (Entry (£24k-£30k))',
      'Deputy Manager (Mid-level (£30k-£40k))',
      'Hotel Manager (Senior (£40k-£55k))',
      'Regional / Group Operations Director (Lead / Specialist (£60k+))',
    ],
    similarCareers: [
      163,
      171,
    ],
    matchedSubjects: [
      'gcse-business-studies',
      'hotel-hospitality-management-ba',
      'hotel-management-apprenticeship',
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years degree + significant experience',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels or BTEC Level 3 - typical offer varies by university',
        subjects: [
          'hotel-hospitality-management-ba',
        ],
        description: 'A hospitality management degree is common for larger hotel groups, though many managers also progress entirely through experience.',
      },
    ],
  },
  {
    id: 173,
    employmentPercentage: 0.2229, // ~70,000 UK pub/bar managers (SOC 1222) - estimate
    category: 'Service & Hospitality',
    title: 'Pub / Bar Manager',
    salary: '£24k - £40k',
    description: 'Manage licensed premises, staff, stock, finances, compliance and customer experience.',
    requirements: [
      'Personal licence needed',
      'Leadership and stock management',
      'Financial control and licensing law knowledge',
      'Experience required',
    ],
    supportTags: [],
    dayToDay: [
      'Manage bar staff rotas and training',
      'Order stock and control costs',
      'Ensure licensing and compliance standards are met',
      'Oversee events, promotions and customer experience',
    ],
    whereToStudy: [
      { name: 'British Institute of Innkeeping', url: 'https://www.bii.org', description: 'Licensed trade training and personal licence qualifications' },
    ],
    progression: [
      'Assistant Manager (Entry (£21k-£26k))',
      'Pub / Bar Manager (Mid-level (£26k-£36k))',
      'Area Manager (Senior (£36k-£48k))',
      'Regional Director (Lead / Specialist (£48k+))',
    ],
    similarCareers: [
      160,
      171,
    ],
    matchedSubjects: [
      'gcse-business-studies',
      'btec-hospitality',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Experience Route',
        duration: '1-3 years, building from a bar role',
        cost: 'Low to moderate cost - personal licence qualification required',
        entryRequirements: 'No formal qualifications required - a personal licence and experience are essential',
        subjects: [
          'btec-hospitality',
        ],
        description: 'Almost always reached by progressing up from bar staff, with a personal licence qualification along the way.',
      },
    ],
  },
  {
    id: 174,
    employmentPercentage: 0.1911, // ~60,000 UK catering managers (SOC 5436) - estimate
    category: 'Service & Hospitality',
    title: 'Catering Manager',
    salary: '£20k - £34k',
    description: 'Run food service for organisations including restaurants, bars, schools, colleges and outside suppliers.',
    requirements: [
      'Experience in catering',
      'NVQ/degree in hospitality management helpful',
      'Organisation and budgeting',
      'Menu planning and hygiene compliance',
    ],
    supportTags: [],
    dayToDay: [
      'Plan menus and manage food budgets',
      'Recruit, train and manage catering staff',
      'Ensure hygiene and food safety compliance',
      'Liaise with clients on events and contracts',
    ],
    whereToStudy: [
      { name: 'Institute of Hospitality', url: 'https://www.instituteofhospitality.org', description: 'Hospitality management training and qualifications' },
    ],
    progression: [
      'Assistant Catering Manager (Entry (£19k-£23k))',
      'Catering Manager (Mid-level (£23k-£30k))',
      'Senior Catering Manager (Senior (£30k-£36k))',
      'Food and Beverage Director (Lead / Specialist (£36k+))',
    ],
    similarCareers: [
      171,
      86,
    ],
    matchedSubjects: [
      'gcse-business-studies',
      'nvq-catering-professional-cookery',
      'hotel-hospitality-management-ba',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Experience / NVQ Route',
        duration: '1-3 years',
        cost: 'Low to moderate cost - NVQ courses plus on-the-job experience',
        entryRequirements: 'No formal qualifications required - catering experience essential',
        subjects: [
          'nvq-catering-professional-cookery',
        ],
        description: 'Most catering managers progress from kitchen or front-of-house roles into contract catering.',
      },
    ],
  },
  {
    id: 175,
    employmentPercentage: 0.0637, // ~20,000 UK accommodation wardens - estimate
    category: 'Service & Hospitality',
    title: 'Accommodation Warden',
    salary: '£24k - £28k',
    description: 'Manage the day-to-day running of services like sheltered housing, hostels and student flats.',
    requirements: [
      'Organisation and communication',
      'Problem-solving and empathy',
      'No formal qualifications required',
      'Management experience helpful',
    ],
    supportTags: [
      'Flexible hours',
    ],
    dayToDay: [
      'Oversee the day-to-day running of accommodation',
      'Support residents with queries and issues',
      'Coordinate maintenance and safety checks',
      'Handle administration and record-keeping',
    ],
    whereToStudy: [
      { name: 'Institute of Hospitality', url: 'https://www.instituteofhospitality.org', description: 'Hospitality and accommodation management training' },
    ],
    progression: [
      'Accommodation Warden (Entry (£22k-£25k))',
      'Senior Warden (Mid-level (£25k-£28k))',
      'Accommodation Manager (Senior (£28k-£34k))',
      'Housing Services Manager (Lead / Specialist (£34k+))',
    ],
    similarCareers: [
      165,
      163,
    ],
    matchedSubjects: [
      'gcse-english',
      'btec-hospitality',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Experience Route',
        duration: 'Builds from customer-facing or care experience',
        cost: 'Low cost - typically progressed into rather than trained for directly',
        entryRequirements: 'No formal qualifications required - management experience helpful',
        subjects: [
          'btec-hospitality',
        ],
        description: 'A role usually reached through experience in housing, hospitality or care rather than a specific qualification.',
      },
    ],
  },
  {
    id: 176,
    employmentPercentage: 0.0637, // ~20,000 UK sommelier / wine service roles - broader definition (formally WSET-certified sommeliers alone number in the low thousands; SOC has no dedicated unit group)
    category: 'Service & Hospitality',
    title: 'Sommelier',
    salary: '£22k - £40k+',
    description: 'Curate wine lists, advise guests on wine pairings, and manage wine stock and cellar.',
    requirements: [
      'WSET qualifications (Level 2-4)',
      'Extensive wine knowledge and palate',
      'Customer service and sales skills',
      'Organisation',
    ],
    supportTags: [],
    dayToDay: [
      'Curate and update the wine list',
      'Advise guests on wine and food pairings',
      'Manage wine stock, cellar conditions and ordering',
      'Train front-of-house staff on wine knowledge',
    ],
    whereToStudy: [
      { name: 'WSET', url: 'https://www.wsetglobal.com', description: 'Wine & Spirit Education Trust qualifications' },
    ],
    progression: [
      'Junior Sommelier (Entry (£22k-£27k))',
      'Sommelier (Mid-level (£27k-£35k))',
      'Head Sommelier (Senior (£35k-£45k))',
      'Wine Director (Lead / Specialist (£45k+))',
    ],
    similarCareers: [
      159,
      86,
    ],
    matchedSubjects: [
      'gcse-english',
      'btec-hospitality',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'WSET Qualification Route',
        duration: '1-2 years alongside restaurant work',
        cost: 'Moderate cost - WSET course fees, often part-funded by an employer',
        entryRequirements: 'No formal qualifications required to start - WSET Level 2 is the usual first step',
        subjects: [],
        description: 'Almost always built up while working front-of-house, studying WSET levels alongside the job.',
      },
    ],
  },
  {
    id: 177,
    employmentPercentage: 0.0701, // ~22,000 UK food safety officers / hygiene inspectors (across the whole food industry, not just hospitality) - estimate
    category: 'Service & Hospitality',
    title: 'Food Safety Officer / Hygiene Inspector',
    salary: '£22k - £32k',
    description: 'Ensure food businesses comply with hygiene and safety regulations.',
    requirements: [
      'Food safety qualification (Level 3/4)',
      'Attention to detail',
      'Knowledge of regulations',
      'Environmental health background helpful',
    ],
    supportTags: [],
    dayToDay: [
      'Inspect food premises for hygiene and safety compliance',
      'Advise businesses on meeting regulations',
      'Write inspection reports and ratings',
      'Investigate complaints and food safety incidents',
    ],
    whereToStudy: [
      { name: 'Chartered Institute of Environmental Health', url: 'https://www.cieh.org', description: 'Environmental health and food safety qualifications' },
    ],
    progression: [
      'Trainee Inspector (Entry (£20k-£24k))',
      'Food Safety Officer (Mid-level (£24k-£29k))',
      'Senior Inspector / Team Leader (Senior (£29k-£36k))',
      'Environmental Health Manager (Lead / Specialist (£36k+))',
    ],
    similarCareers: [
      86,
      174,
    ],
    matchedSubjects: [
      'gcse-science-combined',
      'nvq-catering-professional-cookery',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Food Safety Qualification Route',
        duration: '6-12 months training',
        cost: 'Low to moderate cost - Level 3/4 food safety course',
        entryRequirements: 'No degree required - a food safety qualification and attention to detail matter most',
        subjects: [
          'gcse-science-combined',
        ],
        description: 'Often a route in from kitchen or catering experience, formalised with a recognised food safety qualification.',
      },
    ],
  },
  {
    id: 178,
    employmentPercentage: 0.0701, // ~22,000 UK menu/food product developers - estimate, includes food manufacturing NPD roles
    category: 'Service & Hospitality',
    title: 'Menu Developer / Food Product Developer',
    salary: '£25k - £40k',
    description: 'Create new dishes, develop menus, test recipes, and analyse food trends and costs.',
    requirements: [
      'Degree in food science or culinary arts',
      'Kitchen experience',
      'Creativity and nutrition understanding',
      'Cost analysis and trend awareness',
    ],
    supportTags: [],
    dayToDay: [
      'Develop and test new recipes and dishes',
      'Analyse food trends, nutrition and cost',
      'Work with chefs and suppliers on new menu items',
      'Document recipes and standardise portions',
    ],
    whereToStudy: [
      { name: 'Institute of Hospitality', url: 'https://www.instituteofhospitality.org', description: 'Hospitality and culinary industry training' },
    ],
    progression: [
      'Junior Developer (Entry (£23k-£28k))',
      'Menu / Food Product Developer (Mid-level (£28k-£36k))',
      'Senior Developer (Senior (£36k-£45k))',
      'Head of Food Development (Lead / Specialist (£45k+))',
    ],
    similarCareers: [
      86,
      168,
    ],
    matchedSubjects: [
      'gcse-science-combined',
      'culinary-arts-ba',
    ],
    backtrackPathways: [
      {
        type: 'university',
        name: 'University / Degree Route',
        duration: '3-4 years degree + kitchen experience',
        cost: 'Higher cost - tuition fees apply (student finance available)',
        entryRequirements: 'A-Levels including Science - typical offer varies by university',
        subjects: [
          'culinary-arts-ba',
        ],
        description: 'A food science or culinary arts degree combined with real kitchen experience is the typical route in.',
      },
    ],
  },
  {
    id: 179,
    employmentPercentage: 0.0701, // ~22,000 UK tour managers - estimate
    category: 'Service & Hospitality',
    title: 'Tour Manager',
    salary: '£20k - £35k',
    description: 'Manage travel arrangements of holidaymakers and business clients to ensure trips run smoothly.',
    requirements: [
      'Organisation and communication',
      'Problem-solving',
      'Languages and cultural awareness a bonus',
      'No formal qualifications required',
    ],
    supportTags: [
      'Flexible hours',
    ],
    dayToDay: [
      'Coordinate itineraries, transport and accommodation',
      'Lead groups and resolve issues on the road',
      'Liaise with local guides and suppliers',
      'Manage budgets for the tour',
    ],
    whereToStudy: [
      { name: 'ABTA', url: 'https://abta.com', description: 'Travel industry training and standards' },
    ],
    progression: [
      'Tour Guide (Entry (£18k-£22k))',
      'Tour Manager (Mid-level (£22k-£30k))',
      'Operations Manager (Senior (£30k-£38k))',
      'Travel Director (Lead / Specialist (£38k+))',
    ],
    similarCareers: [
      180,
      136,
    ],
    matchedSubjects: [
      'btec-travel-tourism',
      'tourism-management-ba',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Travel & Tourism Route',
        duration: '1-2 years',
        cost: 'Low to moderate cost - college course or on-the-job training',
        entryRequirements: 'No formal qualifications required - a travel/tourism qualification helps',
        subjects: [
          'btec-travel-tourism',
        ],
        description: 'Often starts as a tour guide before progressing to managing full itineraries and groups.',
      },
    ],
  },
  {
    id: 180,
    employmentPercentage: 0.0637, // ~20,000 UK resort representatives - estimate, seasonal + full-time
    category: 'Service & Hospitality',
    title: 'Resort Representative',
    salary: '£18k - £25k',
    description: "Ensure holidaymakers enjoy their vacation - plan trips, organise activities and deal with issues.",
    requirements: [
      'Communication and problem-solving',
      'Organisation and customer service',
      'Languages a bonus',
      'No formal qualifications required',
    ],
    supportTags: [
      'Flexible hours',
    ],
    dayToDay: [
      'Welcome holidaymakers and run welcome meetings',
      'Sell and organise excursions and activities',
      'Resolve guest issues and emergencies',
      'Liaise with hotels and local suppliers',
    ],
    whereToStudy: [
      { name: 'ABTA', url: 'https://abta.com', description: 'Travel industry training and standards' },
    ],
    progression: [
      'Resort Representative (Entry (£17k-£21k))',
      'Senior Representative (Mid-level (£21k-£25k))',
      'Resort Manager (Senior (£25k-£32k))',
      'Area Manager (Lead / Specialist (£32k+))',
    ],
    similarCareers: [
      179,
      136,
    ],
    matchedSubjects: [
      'btec-travel-tourism',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Travel & Tourism Route',
        duration: 'Immediate start, trained on the job',
        cost: 'Low cost - often includes accommodation as part of the role',
        entryRequirements: 'No formal qualifications required',
        subjects: [
          'btec-travel-tourism',
        ],
        description: 'A common seasonal entry point into the travel industry, often leading to resort or area management.',
      },
    ],
  },
  {
    id: 181,
    employmentPercentage: 0.1115, // ~35,000 UK cinema/theatre attendants - estimate
    category: 'Service & Hospitality',
    title: 'Cinema / Theatre Attendant',
    salary: '£18k - £22k',
    description: "Check customers' tickets, direct them to seats, and sell refreshments.",
    requirements: [
      'Customer service and communication',
      'Cash handling',
      'No formal qualifications required',
      'Reliability',
    ],
    supportTags: [
      'Flexible hours',
      'Part-time available',
    ],
    dayToDay: [
      'Check tickets and direct customers to seats',
      'Sell food, drinks and merchandise',
      'Keep the venue clean between showings/performances',
      'Assist with customer queries and accessibility needs',
    ],
    whereToStudy: [
      { name: 'Institute of Hospitality', url: 'https://www.instituteofhospitality.org', description: 'Customer service and hospitality training' },
    ],
    progression: [
      'Attendant (Entry (£17k-£19k))',
      'Supervisor (Mid-level (£19k-£23k))',
      'Duty Manager (Senior (£23k-£27k))',
      'Venue Manager (Lead / Specialist (£27k+))',
    ],
    similarCareers: [
      182,
      159,
    ],
    matchedSubjects: [
      'gcse-english',
      'customer-service-apprenticeship',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job Route',
        duration: 'Immediate start, trained on the job',
        cost: 'Low cost - paid from day one',
        entryRequirements: 'No formal qualifications required',
        subjects: [
          'customer-service-apprenticeship',
        ],
        description: 'A common part-time or first job, with clear progression into duty and venue management.',
      },
    ],
  },
  {
    id: 182,
    employmentPercentage: 0.1433, // ~45,000 UK leisure centre assistants - estimate
    category: 'Service & Hospitality',
    title: 'Leisure Centre Assistant',
    salary: '£18k - £24k',
    description: 'Assist with gym operations, pool supervision, customer enquiries and facility maintenance.',
    requirements: [
      'Customer service skills',
      'Basic fitness knowledge',
      'First aid certificate',
      'Sports qualification helpful',
    ],
    supportTags: [
      'Flexible hours',
      'Part-time available',
    ],
    dayToDay: [
      'Supervise the gym floor and swimming pool',
      'Handle customer enquiries and bookings',
      'Carry out routine facility checks and light maintenance',
      'Respond to first aid and emergency situations',
    ],
    whereToStudy: [
      { name: 'CIMSPA', url: 'https://www.cimspa.co.uk', description: 'Sport and leisure industry qualifications' },
    ],
    progression: [
      'Leisure Assistant (Entry (£17k-£20k))',
      'Senior Assistant (Mid-level (£20k-£24k))',
      'Duty Manager (Senior (£24k-£29k))',
      'Centre Manager (Lead / Specialist (£29k+))',
    ],
    similarCareers: [
      152,
      181,
    ],
    matchedSubjects: [
      'gcse-pe',
      'customer-service-apprenticeship',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job Route',
        duration: 'Immediate start, trained on the job',
        cost: 'Low cost - paid from day one, first aid training usually provided',
        entryRequirements: 'No formal qualifications required - a sports qualification helps',
        subjects: [
          'gcse-pe',
        ],
        description: 'A common first job for anyone into sport and fitness, with a clear route into duty and centre management.',
      },
    ],
  },
  {
    id: 183,
    employmentPercentage: 0.4777, // ~150,000 UK food delivery drivers - estimate, gig-economy platforms
    category: 'Service & Hospitality',
    title: 'Food Delivery Driver',
    salary: '£18k - £25k',
    description: 'Deliver food orders from restaurants and takeaways to customers, usually via an app-based platform.',
    requirements: [
      'UK driving licence (or valid bike/e-bike)',
      'Reliability and time management',
      'No formal qualifications required',
      'Comfortable navigating local areas',
    ],
    supportTags: [
      'Flexible hours',
      'Part-time available',
    ],
    dayToDay: [
      'Accept and collect food orders from restaurants',
      'Navigate to customer addresses efficiently',
      'Handle food safely and on time',
      'Manage own schedule via a delivery app',
    ],
    whereToStudy: [
      { name: 'National Careers Service', url: 'https://nationalcareers.service.gov.uk', description: 'UK careers guidance and job profiles' },
    ],
    progression: [
      'Delivery Driver (Entry (£18k-£21k))',
      'Experienced Driver, peak-time earnings (Mid-level (£21k-£25k))',
      'Fleet / Local Area Coordinator (Senior (£25k-£30k))',
      'Operations Manager (Lead / Specialist (£30k+))',
    ],
    similarCareers: [
      184,
      158,
    ],
    matchedSubjects: [],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job Route',
        duration: 'Immediate start',
        cost: 'Low cost - own vehicle/bike required, flexible gig-based pay',
        entryRequirements: 'A driving licence (or bike) and right to work in the UK',
        subjects: [],
        description: 'One of the fastest-growing entry points into the sector, driven by app-based platforms and flexible hours.',
      },
    ],
  },
  {
    id: 184,
    employmentPercentage: 0.9554, // ~300,000 UK fast food crew members - estimate, major chains
    category: 'Service & Hospitality',
    title: 'Fast Food Crew Member',
    salary: '£18k - £22k',
    description: 'Prepare and serve food quickly and consistently in a fast food or quick-service restaurant.',
    requirements: [
      'Teamwork and reliability',
      'No formal qualifications required',
      'Comfort working at speed',
      'Structured training provided',
    ],
    supportTags: [
      'Flexible hours',
      'Part-time available',
    ],
    dayToDay: [
      'Prepare food to brand standards and speed targets',
      'Take orders at the till or drive-through',
      'Keep the kitchen and service area clean',
      'Work as part of a fast-paced team',
    ],
    whereToStudy: [
      { name: 'National Careers Service', url: 'https://nationalcareers.service.gov.uk', description: 'UK careers guidance and job profiles' },
    ],
    progression: [
      'Crew Member (Entry (£17k-£19k))',
      'Shift Leader (Mid-level (£19k-£23k))',
      'Assistant Manager (Senior (£23k-£28k))',
      'Restaurant Manager (Lead / Specialist (£28k+))',
    ],
    similarCareers: [
      159,
      167,
    ],
    matchedSubjects: [
      'customer-service-apprenticeship',
    ],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job Route',
        duration: 'Immediate start, structured training provided',
        cost: 'Low cost - paid from day one',
        entryRequirements: 'No formal qualifications required',
        subjects: [
          'customer-service-apprenticeship',
        ],
        description: 'Major chains are consistently hiring, with structured in-house training and a clear path into shift and restaurant management.',
      },
    ],
  },
  {
    id: 185,
    employmentPercentage: 0.1911, // ~60,000 UK dishwashers/kitchen cleaning staff - estimate
    category: 'Service & Hospitality',
    title: 'Dishwasher',
    salary: '£17k - £21k',
    description: 'Wash dishes, pots and kitchen equipment in restaurants, hotels and catering kitchens.',
    requirements: [
      'No formal qualifications required',
      'Physical stamina',
      'Reliability, especially during service',
      'Teamwork',
    ],
    supportTags: [
      'Flexible hours',
      'Part-time available',
    ],
    dayToDay: [
      'Wash dishes, pots and kitchen equipment',
      'Keep the dishwashing station organised',
      'Support kitchen staff during busy service',
      'Manage waste and recycling',
    ],
    whereToStudy: [
      { name: 'National Careers Service', url: 'https://nationalcareers.service.gov.uk', description: 'UK careers guidance and job profiles' },
    ],
    progression: [
      'Dishwasher (Entry (£17k-£19k))',
      'Kitchen Porter (Mid-level (£19k-£21k))',
      'Commis Chef (Senior (£21k-£25k))',
      'Chef de Partie (Lead / Specialist (£25k+))',
    ],
    similarCareers: [
      167,
      184,
    ],
    matchedSubjects: [],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'On-the-Job Route',
        duration: 'Immediate start, no experience needed',
        cost: 'Low cost - paid from day one',
        entryRequirements: 'No formal qualifications required',
        subjects: [],
        description: 'Every kitchen needs one - the easiest entry point into a kitchen career, with a clear route up to commis chef.',
      },
    ],
  },
  // --- Celestial tier (ids 186-189) ---------------------------------------
  // Exactly 4 careers, reserved for the tier above Mythic (see
  // careerTiers.ts's forcedTier/getCareerTier) - never reachable through
  // the normal weighted roll pool, only through Celestial's own dedicated
  // roll chance. employmentPercentage is still filled in for schema
  // consistency (100 * peopleInRole / 31,412,315, the same UK-workforce
  // denominator every other career uses) but isn't what actually gets
  // shown - rarityLabel below always wins for these 4, using each
  // career's own headline figure as given (President/VP's is a
  // global/US-population comparison, not the UK-workforce one the formula
  // above would produce).
  {
    id: 186,
    employmentPercentage: 0.0000031835, // 1 person nationally - see comment above
    rarityLabel: '1 in every 31,412,315 workers',
    forcedTier: 'celestial',
    category: 'Public Services',
    title: 'Prime Minister',
    salary: '£174,039',
    description:
      "Head of government for the United Kingdom. Only one person holds this role at any time. Statutory entitlement is £174,711, but recent PMs have claimed the lower frozen amount - made up of the MP salary (£98,599) plus a PM ministerial salary (£75,440).",
    requirements: [
      'Elected as a Member of Parliament (MP)',
      'Rise through Cabinet positions',
      'Become leader of a major political party',
      'Win a General Election',
      'Realistically 15-30 years building a political career',
    ],
    dayToDay: [
      'Chair Cabinet meetings and set government policy',
      'Represent the UK at international summits',
      "Answer to Parliament at Prime Minister's Questions",
      'Make final decisions on national emergencies',
    ],
    whereToStudy: [
      { name: 'UK Parliament', url: 'https://www.parliament.uk/get-involved/', description: 'How Parliament and government work' },
    ],
    progression: [
      'Local council / party activism',
      'Member of Parliament',
      'Government minister / Cabinet',
      'Party leader',
      'Prime Minister',
    ],
    similarCareers: [187, 188],
    matchedSubjects: [],
    backtrackPathways: [],
  },
  {
    id: 187,
    employmentPercentage: 0.0000031835, // 1 person - see comment above (this career's own rarityLabel uses a different, global comparison)
    rarityLabel: '1 in every 160,000,000 people',
    forcedTier: 'celestial',
    category: 'Public Services',
    title: 'President',
    // Plain "£Xk" like every other career's salary field, not the dual-
    // currency string this used to hold - that made this the only salary
    // badge in the whole app long enough to squeeze CareerDetailPage's
    // "Similar careers" card layout down to a single-word-per-line column
    // (confirmed via real rendered DOM measurements: a 145px-wide badge
    // left only 73px for the title+description column). The USD figure
    // moved into the description below instead, which has room to wrap.
    salary: '£310k',
    description:
      'Head of state and government, paid $400,000 USD (~£310k) - the most powerful and rarest job on Earth. A US role, shown here as a global ultra-rare comparison rather than a UK pathway. Pay is topped up with a $50,000 expense account, $100,000 travel allowance and $19,000 entertainment budget.',
    requirements: [
      'Build a career as a Governor or Senator',
      'Run a national presidential campaign',
      'Win a national election',
      'Realistically 20-40 years building a political career',
    ],
    dayToDay: [
      'Set national policy and sign or veto legislation',
      'Command the armed forces',
      'Represent the country in international diplomacy',
      'Respond to national emergencies',
    ],
    whereToStudy: [
      { name: 'National Careers Service', url: 'https://nationalcareers.service.gov.uk', description: 'UK careers guidance and job profiles' },
    ],
    progression: ['Local or state political office', 'Governor / Senator', 'National campaign', 'President'],
    similarCareers: [186, 188],
    matchedSubjects: [],
    backtrackPathways: [],
  },
  {
    id: 188,
    employmentPercentage: 0.0000031835, // 1 person - see comment above (this career's own rarityLabel uses a different, global comparison)
    rarityLabel: '1 in every 160,000,000 people',
    forcedTier: 'celestial',
    category: 'Public Services',
    title: 'Vice President',
    // Same fix as President above - plain "£Xk", USD figure moved into
    // the description instead of living in the tight badge slot.
    salary: '£182k',
    description:
      'One heartbeat away from the presidency, paid $235,100 USD (~£182k). Only one person holds this role at any time. A US role, shown here as a global ultra-rare comparison. Pay has been frozen since 2019 - the official rate is $253,100, but only $235,100 is currently payable.',
    requirements: [
      'Build a career in politics',
      'Get selected as a running mate',
      'Win a national election alongside the President',
      'Realistically 15-30 years building a political career',
    ],
    dayToDay: [
      'Deputise for the President when needed',
      'Cast the deciding vote in a tied Senate',
      'Represent the country at official events',
      'Advise on policy and national security',
    ],
    whereToStudy: [
      { name: 'National Careers Service', url: 'https://nationalcareers.service.gov.uk', description: 'UK careers guidance and job profiles' },
    ],
    progression: ['Local or state political office', 'Governor / Senator', 'Selected as running mate', 'Vice President'],
    similarCareers: [186, 187],
    matchedSubjects: [],
    backtrackPathways: [],
  },
  {
    id: 189,
    employmentPercentage: 0.0000159214, // ~5 people nationally - see comment above
    rarityLabel: '1 in every 6,282,463 workers',
    forcedTier: 'celestial',
    category: 'Service & Hospitality',
    title: 'Royal Butler',
    salary: '£75,000 - £120,000+',
    description:
      'Serves the British monarch directly - fewer than 5 people in the entire country hold this role. Pay includes accommodation, meals and a pension; senior royal butlers with years of service sit at the top of the range, and those who move into private households after royal service can earn £100,000+.',
    requirements: [
      'Build a background in hospitality',
      'Gain experience in private household service',
      'Be appointed to the Royal Household',
      'Realistically 10-20 years of hospitality experience',
    ],
    dayToDay: [
      'Manage the household staff and daily schedule',
      'Oversee formal dining and state occasions',
      'Handle logistics for royal travel and events',
      'Maintain absolute discretion',
    ],
    whereToStudy: [
      { name: 'National Careers Service', url: 'https://nationalcareers.service.gov.uk', description: 'UK careers guidance and job profiles' },
    ],
    progression: ['Hospitality / hotel service', 'Private household staff', 'Under-butler', 'Royal Butler'],
    similarCareers: [164],
    matchedSubjects: [],
    backtrackPathways: [],
  },

  // 9 careers originally added to populate the Legendary tier, which came
  // up completely EMPTY (0 real careers) under an EARLIER careerTiers.ts
  // boundary table (Legendary = 1 in 50,001 - 100,000), then only 3 of
  // the 9 stayed Legendary under a second, wider table (Legendary = 1 in
  // 80,001 - 500,000; the other 6 fell to Epic). Under the CURRENT
  // boundaries (careerTiers.ts's third pass, LEGENDARY_MAX_PCT = 1 in
  // 100 - a much LESS strict floor than either earlier table, derived
  // from the real sorted employmentPercentage gaps rather than another
  // round-number guess), all 9 land back in Legendary - every one of
  // them sits between roughly 1 in 48,000 and 1 in 89,749, comfortably
  // inside the new 1-in-100-or-rarer band. Their data wasn't changed for
  // this - the employmentPercentage values below are unchanged, they
  // just land differently against the new cutoff, same as any other
  // career here.
  // employmentPercentage below is each career's real UK headcount
  // (peopleInRole) divided by the same ~31.4M UK workforce total the
  // rest of this file (bar the heritage-craft block above, which uses a
  // different ~34.5M denominator) is expressed against - not the DfE
  // "Occupations in Demand" dataset, since roles this specific (650 MPs,
  // 600 circuit judges, etc.) were never going to get their own
  // SOC-coded row there either. rarityLabel carries the supplied "1 in
  // N" figures verbatim (same reasoning as the heritage-craft block's
  // own rarityLabel comment - a clean, quoted headline number, not
  // always a razor-precise division of employmentPercentage).
  {
    id: 190,
    employmentPercentage: 0.0020701, // 650 MPs of ~31.4M workforce - was nudged rarer to land in Legendary under an earlier boundary table; reverted to the true figure now that it lands Epic either way under the current one (see block comment above)
    rarityLabel: '1 in every 48,327 workers',
    category: 'Public Services',
    title: 'Member of Parliament',
    salary: '£91,346 - £120,000+ (with ministerial roles)',
    description: 'Represents a constituency in the House of Commons, debates and votes on legislation, holds the government to account, and serves on committees. One of only 650 people in the entire country.',
    requirements: [
      'Selection as a parliamentary candidate by a political party',
      'Run and win a constituency election campaign',
      'Win a general election (or by-election) seat',
      'Realistically 10-20 years building a political career',
    ],
    supportTags: [],
    dayToDay: [
      "Represent constituents' interests in the House of Commons",
      'Debate and vote on proposed legislation',
      'Sit on select committees scrutinising government departments',
      'Hold constituency surgeries and casework for local residents',
    ],
    whereToStudy: [
      { name: 'National Careers Service', url: 'https://nationalcareers.service.gov.uk', description: 'UK careers guidance and job profiles' },
    ],
    progression: ['Backbench MP', 'Select Committee Chair', 'Junior Minister', 'Cabinet Minister', 'Prime Minister'],
    similarCareers: [110, 106, 191],
    matchedSubjects: ['gcse-english', 'alevel-politics', 'politics-ba', 'law-llb'],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Party & Campaign Route',
        duration: '10-20 years',
        cost: 'No formal course - built through party activism, council seats and campaign experience',
        entryRequirements: 'Party membership and local activism, then selection as a candidate',
        subjects: ['politics-ba', 'law-llb'],
        description: 'Almost all MPs build a political career through party activism, local council seats or campaign work rather than a dedicated qualification - a degree in politics, law or PPE is common but not required.',
      },
    ],
  },
  {
    id: 191,
    employmentPercentage: 0.0019108, // 600 UK circuit judges of ~31.4M workforce
    rarityLabel: '1 in every 52,354 workers',
    category: 'Public Services',
    title: 'Circuit Judge',
    salary: '£150,000 - £180,000',
    description: 'Sits in Crown and County Courts, presiding over serious criminal trials, complex civil cases, and appeals. Appointed by the Judicial Appointments Commission. One of roughly 600 in the UK.',
    requirements: [
      'Qualify as a solicitor or barrister',
      '7+ years of post-qualification legal experience',
      'Apply for judicial appointment through the Judicial Appointments Commission (JAC)',
      'Realistically 15-25 years of legal practice before appointment',
    ],
    supportTags: [],
    dayToDay: [
      'Preside over Crown and County Court trials and appeals',
      'Direct juries and rule on points of law',
      'Sentence defendants in criminal cases',
      'Manage complex civil case lists and hearings',
    ],
    whereToStudy: [
      { name: 'Judicial Appointments Commission', url: 'https://www.judicialappointments.gov.uk', description: 'Official route and eligibility for judicial roles' },
      { name: 'Law Society', url: 'https://www.lawsociety.org.uk', description: 'Qualifying as a solicitor in England and Wales' },
    ],
    progression: ['Solicitor / Barrister', 'Recorder', 'Circuit Judge', 'High Court Judge', 'Court of Appeal Judge'],
    similarCareers: [110, 196, 190],
    matchedSubjects: ['law-llb', 'gdl-law-conversion', 'sqe-preparation', 'alevel-law'],
    backtrackPathways: [
      {
        type: 'university',
        name: 'Legal Qualification Route',
        duration: '15-25 years total (including PQE)',
        cost: 'Law degree/GDL + SQE/Bar training, then years of practice - JAC appointment itself is free to apply',
        entryRequirements: 'Law degree or GDL conversion, SQE or Bar training, then 7+ years PQE',
        subjects: ['law-llb', 'gdl-law-conversion', 'sqe-preparation'],
        description: 'Judicial appointment is only open to qualified, experienced solicitors and barristers - there is no direct entry route, so this always follows a full legal career first.',
      },
    ],
  },
  {
    id: 192,
    employmentPercentage: 0.0014331, // 450 UK professional jockeys of ~31.4M workforce
    rarityLabel: '1 in every 69,805 workers',
    category: 'Sport & Leisure',
    title: 'Professional Jockey',
    salary: '£20,000 - £150,000+ (prize money and retainers; top jockeys earn £1M+)',
    description: 'Rides racehorses in flat or National Hunt (jump) racing. Must maintain strict weight limits, build relationships with trainers and owners, and make split-second tactical decisions at 40mph. Only ~450 licensed professional jockeys in the UK.',
    requirements: [
      'Complete a British Racing School apprenticeship',
      'Obtain a British Horseracing Authority (BHA) licence',
      'Build a track record of race rides and wins',
      'Realistically 5-10 years to reach professional level',
    ],
    supportTags: [],
    dayToDay: [
      'Ride racehorses in flat or National Hunt (jump) races',
      'Maintain strict weight and fitness through diet and training',
      'Work with trainers and owners on race tactics',
      'Make split-second decisions at racing speed',
    ],
    whereToStudy: [
      { name: 'British Racing School', url: 'https://www.brs.org.uk', description: 'Official jockey apprenticeship and training route' },
      { name: 'British Horseracing Authority', url: 'https://www.britishhorseracing.com', description: 'Licensing body for professional jockeys' },
    ],
    progression: ['Apprentice / Conditional Jockey', 'Professional Jockey', 'Senior Jockey', 'Champion Jockey'],
    similarCareers: [151, 195],
    matchedSubjects: ['gcse-pe', 'btec-sport', 'sports-coaching-apprenticeship', 'personal-training'],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Racing School Apprenticeship',
        duration: '5-10 years',
        cost: 'Low cost - trained through the British Racing School with a wage while riding out for a trainer',
        entryRequirements: 'No formal qualifications - fitness, weight and horsemanship matter most',
        subjects: ['gcse-pe', 'btec-sport'],
        description: 'Only around 450 professional jockeys hold an active licence in the UK - strict weight limits and the physical risk of the sport keep numbers small.',
      },
    ],
  },
  {
    id: 193,
    employmentPercentage: 0.0011146, // 350 UK British Stunt Register members of ~31.4M workforce
    rarityLabel: '1 in every 89,749 workers',
    category: 'Creative & Media',
    title: 'Stunt Performer',
    salary: '£25,000 - £80,000+ (top performers earn £100,000+)',
    description: 'Performs dangerous physical feats for film, television, and theatre - car chases, fights, falls from height, fire burns, and horse riding stunts. Only ~350 people are on the British Stunt Register. Rigorous physical standards and insurance requirements keep numbers tiny.',
    requirements: [
      'Register with the British Stunt Register',
      'Demonstrate proven skill in 6+ disciplines (martial arts, gymnastics, horse riding, driving, diving, climbing)',
      'Complete Joint Industry Stunt Committee (JISC) qualification',
      'Realistically 5-15 years to build a working stunt career',
    ],
    supportTags: [],
    dayToDay: [
      'Perform choreographed fights, falls and car chases on set',
      'Rehearse and safety-check stunt sequences with coordinators',
      'Maintain fitness and skill across multiple physical disciplines',
      'Wear protective rigging and fire-safety equipment for hazardous stunts',
    ],
    whereToStudy: [
      { name: 'British Stunt Register', url: 'https://www.britishstuntregister.com', description: 'Official register and qualification route for UK stunt performers' },
    ],
    progression: ['Trainee', 'Stunt Performer', 'Stunt Coordinator', 'Second Unit Director'],
    similarCareers: [151, 195],
    matchedSubjects: ['gcse-pe', 'btec-performing-arts', 'btec-sport', 'theatre-performance-ba'],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'British Stunt Register Route',
        duration: '5-15 years',
        cost: 'Cost of building skills across multiple disciplines (martial arts, gymnastics, diving, climbing) before registering',
        entryRequirements: 'Proven proficiency in 6+ physical disciplines, then JISC qualification',
        subjects: ['gcse-pe', 'btec-sport'],
        description: 'Only around 350 performers are on the British Stunt Register - rigorous physical standards and insurance requirements keep the register small.',
      },
    ],
  },
  {
    id: 194,
    employmentPercentage: 0.0012739, // 400 UK high-threat EOD operators of ~31.4M workforce
    rarityLabel: '1 in every 78,531 workers',
    category: 'Public Services',
    title: 'Bomb Disposal Expert',
    salary: '£35,000 - £55,000 (military) / £50,000 - £70,000 (civilian police)',
    description: 'Identifies, assesses, and neutralises explosive devices - from World War II ordnance to modern terrorist IEDs. Works under extreme pressure where a single mistake is fatal. Only ~400 qualified operators serve across the Army and civilian police forces.',
    requirements: [
      'Join the British Army',
      'Complete Ammunition Technician training with 11 EOD Regiment',
      'Pass the High-Threat IED course',
      'Realistically 8-12 years of operational experience before senior roles',
    ],
    supportTags: [],
    dayToDay: [
      'Identify and assess suspected explosive devices',
      'Plan and carry out safe render-safe procedures',
      'Operate remote-controlled disposal robots and equipment',
      'Work under extreme time pressure where mistakes are fatal',
    ],
    whereToStudy: [
      { name: 'British Army Careers', url: 'https://apply.army.mod.uk', description: 'Ammunition Technician and EOD training route' },
    ],
    progression: ['Ammunition Technician', 'High-Threat Operator', 'Team Leader', 'Senior Instructor'],
    similarCareers: [147, 90, 106],
    matchedSubjects: ['gcse-chemistry', 'gcse-maths', 'military-apprenticeship', 'mechanical-engineering-apprenticeship'],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Army EOD Route',
        duration: '8-12 years',
        cost: 'No cost - trained and paid throughout Army service',
        entryRequirements: 'British Army service, then Ammunition Technician and High-Threat IED training',
        subjects: ['gcse-chemistry', 'gcse-maths', 'military-apprenticeship'],
        description: 'Only around 400 qualified high-threat operators serve across the Army and civilian police forces in the UK.',
      },
    ],
  },
  {
    id: 195,
    employmentPercentage: 0.0019108, // 600 UK licensed professional boxers of ~31.4M workforce
    rarityLabel: '1 in every 52,354 workers',
    category: 'Sport & Leisure',
    title: 'Professional Boxer',
    salary: '£15,000 - £50,000 (journeyman) / £100,000 - £10M+ (champions)',
    description: 'Competes in sanctioned professional boxing matches, training full-time with strict diet, conditioning, and sparring regimes. Only ~600 hold active professional licences in the UK. The physical toll and financial uncertainty mean most never reach championship level.',
    requirements: [
      'Build an amateur boxing record',
      'Obtain a professional licence from the British Boxing Board of Control (BBBofC)',
      'Sign with a manager and promoter',
      'Realistically 5-10 years to reach contender level',
    ],
    supportTags: [],
    dayToDay: [
      'Train full-time with strict diet, conditioning and sparring',
      'Compete in sanctioned professional bouts',
      'Manage weight cuts ahead of fight nights',
      'Work with a manager and promoter on fight bookings',
    ],
    whereToStudy: [
      { name: 'British Boxing Board of Control', url: 'https://www.bbbofc.com', description: 'Official licensing body for professional boxers in the UK' },
    ],
    progression: ['Novice Pro', 'Journeyman', 'Contender', 'Champion'],
    similarCareers: [151, 192],
    matchedSubjects: ['gcse-pe', 'btec-sport', 'sports-coaching-apprenticeship', 'sports-science-bsc'],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Amateur-to-Professional Route',
        duration: '5-10 years',
        cost: 'Amateur boxing is low-cost via clubs; turning professional requires a BBBofC licence, manager and promoter',
        entryRequirements: 'Amateur boxing record, then professional licence application',
        subjects: ['gcse-pe', 'btec-sport'],
        description: 'Only around 600 boxers hold an active professional licence in the UK - most never reach championship level given the physical toll and financial uncertainty.',
      },
    ],
  },
  {
    id: 196,
    employmentPercentage: 0.0011146, // 350 UK coroners of all grades of ~31.4M workforce
    rarityLabel: '1 in every 89,749 workers',
    category: 'Public Services',
    title: 'Coroner',
    salary: '£90,000 - £130,000',
    description: 'Independent judicial officer who investigates violent, unnatural, or sudden deaths. Determines the cause of death, holds inquests, and protects the legal interests of the deceased. England and Wales are divided into 77 coroner areas with roughly 350 coroners of all grades.',
    requirements: [
      'Qualify as a solicitor, barrister or doctor',
      '5+ years of relevant professional experience',
      'Judicial appointment by the Lord Chancellor',
      'Realistically 15-25 years before appointment',
    ],
    supportTags: [],
    dayToDay: [
      'Investigate violent, unnatural or sudden deaths',
      'Determine cause of death and hold inquests',
      'Work with pathologists, police and medical examiners',
      'Protect the legal interests of the deceased and their families',
    ],
    whereToStudy: [
      { name: 'Judicial Appointments Commission', url: 'https://www.judicialappointments.gov.uk', description: 'Official route and eligibility for coroner appointments' },
    ],
    progression: ['Assistant Deputy Coroner', 'Deputy Coroner', 'Senior Coroner', 'Chief Coroner'],
    similarCareers: [110, 191],
    matchedSubjects: ['law-llb', 'gcse-biology', 'forensic-science-bsc', 'gdl-law-conversion'],
    backtrackPathways: [
      {
        type: 'university',
        name: 'Legal or Medical Qualification Route',
        duration: '15-25 years total (including PQE)',
        cost: 'Law or medical degree, then years of practice - JAC appointment itself is free to apply',
        entryRequirements: 'Qualified solicitor, barrister or doctor with 5+ years experience',
        subjects: ['law-llb', 'gcse-biology'],
        description: 'England and Wales are divided into 77 coroner areas with roughly 350 coroners of all grades in total.',
      },
    ],
  },
  {
    id: 197,
    employmentPercentage: 0.0011146, // 350 UK Guild of Taxidermists active members of ~31.4M workforce
    rarityLabel: '1 in every 89,749 workers',
    category: 'Creative & Media',
    title: 'Taxidermist',
    salary: '£20,000 - £45,000',
    description: 'Preserves and mounts animals for museums, private collections, education, and artistic display. Requires deep anatomical knowledge, sculpting skill, and artistic painting ability. The UK Guild of Taxidermists has roughly 350 active members - a dying craft with almost no new entrants.',
    requirements: [
      'No formal qualifications required',
      'Apprenticeship with an established taxidermist, or specialist short courses',
      'Strong anatomical knowledge and sculpting ability',
      'Realistically 2-5 years to build professional skill',
    ],
    supportTags: [],
    dayToDay: [
      'Preserve and mount animals for museums, collections and education',
      'Sculpt and rebuild forms to lifelike anatomical accuracy',
      'Tan and prepare skins and hides',
      'Paint and finish mounts for realistic colour and detail',
    ],
    whereToStudy: [
      { name: 'UK Guild of Taxidermists', url: 'https://www.taxidermy.org.uk', description: 'Trade body, courses and training routes' },
      { name: 'Heritage Crafts', url: 'https://heritagecrafts.org.uk', description: 'Endangered crafts directory and training routes' },
    ],
    progression: ['Trainee', 'Taxidermist', 'Senior Taxidermist', 'Museum Specialist'],
    similarCareers: [125, 128],
    matchedSubjects: ['gcse-art-design', 'gcse-biology', 'btec-art-design', 'tlevel-craft-design'],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship / Short Course Route',
        duration: '2-5 years',
        cost: 'Low-to-moderate - specialist short courses or direct apprenticeship with a working taxidermist',
        entryRequirements: 'No formal qualifications required - artistic and anatomical aptitude matter most',
        subjects: ['gcse-art-design', 'gcse-biology'],
        description: 'The UK Guild of Taxidermists has roughly 350 active members - a dying craft with almost no new entrants.',
      },
    ],
  },
  {
    id: 198,
    employmentPercentage: 0.0012739, // fewer than 400 working UK silversmiths of ~31.4M workforce
    rarityLabel: '1 in every 78,531 workers',
    category: 'Construction & Trades',
    title: 'Silversmith',
    salary: '£22,000 - £40,000',
    description: "Designs and crafts objects from silver - from cutlery and jewellery to ceremonial pieces and churchware. Uses traditional techniques like raising, planishing, soldering, and engraving. The Goldsmiths' Company estimates fewer than 400 working silversmiths remain in the UK, making it a critically endangered craft.",
    requirements: [
      'Traditional apprenticeship, or a degree in jewellery design and silversmithing',
      'Skill in raising, planishing, soldering and engraving',
      'Strong hand-eye coordination and patience',
      'Realistically 3-5 years to reach working proficiency',
    ],
    supportTags: [],
    dayToDay: [
      'Design and craft silver cutlery, jewellery and ceremonial pieces',
      'Raise and planish sheet silver into shape by hand',
      'Solder, engrave and polish finished pieces',
      'Restore and repair antique silverware',
    ],
    whereToStudy: [
      { name: "The Goldsmiths' Company", url: 'https://www.thegoldsmiths.co.uk', description: 'Trade body, training and craft council for UK silversmiths' },
      { name: 'Birmingham School of Jewellery', url: 'https://www.bcu.ac.uk/jewellery', description: 'Degree and short courses in jewellery and silversmithing' },
    ],
    progression: ['Apprentice', 'Silversmith', 'Senior Silversmith', 'Master Craftsperson'],
    similarCareers: [128, 130, 133],
    matchedSubjects: ['gcse-art-design', 'btec-art-design', 'product-design-ba', 'tlevel-craft-design'],
    backtrackPathways: [
      {
        type: 'vocational',
        name: 'Apprenticeship Route',
        duration: '3-5 years',
        cost: 'Low cost if trained on the job; a BA in jewellery/silversmithing costs standard university tuition',
        entryRequirements: 'No formal qualifications required for apprenticeship - a foundation in art and design helps',
        subjects: ['gcse-art-design', 'btec-art-design'],
        description: "The Goldsmiths' Company estimates fewer than 400 working silversmiths remain in the UK, making it a critically endangered craft.",
      },
    ],
  },
]
// Normalize subject ids to match `subjects.json` ids and fix common typos
const demoCareers = rawDemoCareers.map((career) => ({
  ...career,
  // Default structured fields for the career detail page
  dayToDay: career.dayToDay || [
    `Work on ${career.title.toLowerCase()} tasks and deliverables`,
    'Collaborate with colleagues and stakeholders',
    'Problem-solve and improve existing processes',
    'Learn and adapt to new tools and practices',
  ],
  whereToStudy: career.whereToStudy || [
    { name: 'Udemy', url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(career.title)}`, description: 'Affordable professional courses' },
    { name: 'LinkedIn Learning', url: `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(career.title)}`, description: 'Business & tech skills' },
  ],
  progression: career.progression || [
    `Junior ${career.title} (entry)`,
    `Mid-level ${career.title}`,
    `Senior ${career.title}`,
    `Lead ${career.title} / Management`,
  ],
  similarCareers: career.similarCareers || [],
  matchedSubjects: (career.matchedSubjects || []).map((id) => {
    if (!id || typeof id !== 'string') return id
    return id
      .replace(/a-level-/g, 'alevel-')
      .replace(/a-level/g, 'alevel')
      .replace(/university-data-science/g, 'data-science-bsc')
  }),
}))

export default demoCareers
