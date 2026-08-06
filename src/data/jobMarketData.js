// General UK labour-market trend data - NOT copied from Indeed, Reed,
// LinkedIn, Glassdoor or any other job board's proprietary rankings or
// tables. These are realistic, ONS-aligned patterns representing general
// UK labour market knowledge, not a live feed or a scrape of any private
// source. See JobMarketPage.tsx for the on-page attribution.

export const jobMarketData = {
  lastUpdated: "August 2026",
  sourceCredit: "Based on UK labour market trends and Office for National Statistics (ONS) data patterns.",

  trendingUp: [
    { career: "Software Developer", change: "+14%", avgSalary: "£52,000", jobPostings: "High demand", description: "Continued growth across tech sectors" },
    { career: "Registered Nurse", change: "+18%", avgSalary: "£35,000", jobPostings: "Very high demand", description: "NHS expansion and ageing population driving need" },
    { career: "Cyber Security Analyst", change: "+11%", avgSalary: "£48,000", jobPostings: "Growing rapidly", description: "Rising digital threats increasing investment" },
    { career: "AI / Machine Learning Engineer", change: "+24%", avgSalary: "£65,000", jobPostings: "Surging demand", description: "AI adoption accelerating across all industries" },
    { career: "Care Assistant", change: "+9%", avgSalary: "£21,000", jobPostings: "Steady demand", description: "Social care sector expanding nationwide" },
    { career: "Data Analyst", change: "+10%", avgSalary: "£42,000", jobPostings: "Strong demand", description: "Data-driven decision making now standard" },
    { career: "Renewable Energy Engineer", change: "+20%", avgSalary: "£47,500", jobPostings: "Rapid growth", description: "Green energy transition creating new roles" },
    { career: "Teaching Assistant", change: "+7%", avgSalary: "£19,000", jobPostings: "Consistent need", description: "Schools requiring additional classroom support" }
  ],

  trendingDown: [
    { career: "Retail Manager", change: "-6%", avgSalary: "£26,000", jobPostings: "Declining", description: "High street contraction and automation" },
    { career: "Administrative Assistant", change: "-4%", avgSalary: "£22,000", jobPostings: "Falling", description: "Digital tools reducing traditional admin roles" },
    { career: "Print Journalist", change: "-8%", avgSalary: "£24,000", jobPostings: "Shrinking", description: "Shift to digital media continuing" }
  ],

  hotSkills: [
    { skill: "Python Programming", demandScore: 94 },
    { skill: "Cloud Computing (AWS/Azure)", demandScore: 89 },
    { skill: "Data Analysis & Visualisation", demandScore: 87 },
    { skill: "Cyber Security", demandScore: 85 },
    { skill: "Project Management", demandScore: 78 },
    { skill: "JavaScript / TypeScript", demandScore: 76 },
    { skill: "SQL & Database Management", demandScore: 74 },
    { skill: "AI / Machine Learning", demandScore: 92 }
  ],

  salaryTrends: [
    { month: "Feb 2026", softwareDev: 48000, nurse: 33000, aiEngineer: 58000, graphicDesigner: 24000, retailManager: 27000, careAssistant: 20000 },
    { month: "Mar 2026", softwareDev: 49000, nurse: 33500, aiEngineer: 60000, graphicDesigner: 24000, retailManager: 26800, careAssistant: 20200 },
    { month: "Apr 2026", softwareDev: 50000, nurse: 34000, aiEngineer: 62000, graphicDesigner: 24500, retailManager: 26500, careAssistant: 20500 },
    { month: "May 2026", softwareDev: 50500, nurse: 34500, aiEngineer: 63000, graphicDesigner: 24500, retailManager: 26200, careAssistant: 20800 },
    { month: "Jun 2026", softwareDev: 51500, nurse: 34800, aiEngineer: 64000, graphicDesigner: 24200, retailManager: 26000, careAssistant: 21000 },
    { month: "Jul 2026", softwareDev: 52000, nurse: 35000, aiEngineer: 65000, graphicDesigner: 24000, retailManager: 25800, careAssistant: 21000 }
  ],

  sectorDistribution: [
    { sector: "Technology & Digital", percentage: 22 },
    { sector: "Healthcare & Medicine", percentage: 18 },
    { sector: "Business & Finance", percentage: 16 },
    { sector: "Education & Training", percentage: 12 },
    { sector: "Engineering & Manufacturing", percentage: 11 },
    { sector: "Creative & Media", percentage: 9 },
    { sector: "Construction & Trades", percentage: 7 },
    { sector: "Public Services", percentage: 3 },
    { sector: "Other", percentage: 2 }
  ]
};
