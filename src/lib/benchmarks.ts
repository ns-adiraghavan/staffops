// Cost Benchmarking — market-validated CTC bands (source: NS 'Cost Benchmarking'
// sheet, external market validation). Used to sanity-check COST, never price.
// Market band converted to Rs/month (LPA x 100000 / 12). Each designation is
// mapped to a rate-card skill group + experience band (band = closest match;
// override on a requirement if needed).
export interface Benchmark {
  id: string;
  designation: string;
  group: string; // rate-card skill group
  band: string;  // rate-card experience band key
  level: string;
  exp: string;
  marketValidated: string; // e.g. "8 - 14" (LPA), or "" when not market-validated
  mktLowMo: number | null;  // Rs/month
  mktHighMo: number | null; // Rs/month
}

export const BENCHMARKS: Benchmark[] = [
  { id: 'work-workday-financials-l1', designation: 'Workday Financials-L1', group: 'Workday / ERP', band: '2-4', level: 'Standard', exp: '3-4', marketValidated: '8 - 14', mktLowMo: 66667, mktHighMo: 116667 },
  { id: 'work-workday-financials-l2', designation: 'Workday Financials- L2', group: 'Workday / ERP', band: '5-7', level: 'Specialist', exp: '5-8', marketValidated: '14 - 21', mktLowMo: 116667, mktHighMo: 175000 },
  { id: 'work-workday-financials-l3', designation: 'Workday Financials- L3', group: 'Workday / ERP', band: '8-10', level: 'Lead', exp: '8-10', marketValidated: '21 - 31', mktLowMo: 175000, mktHighMo: 258333 },
  { id: 'work-workday-financials-l3-2', designation: 'Workday Financials- L3+', group: 'Workday / ERP', band: '10-12', level: 'Principal', exp: '10+', marketValidated: '33 - 45', mktLowMo: 275000, mktHighMo: 375000 },
  { id: 'appl-associate-application-support-engineer', designation: 'Associate Application Support Engineer', group: 'Application Support', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '6 - 8', mktLowMo: 50000, mktHighMo: 66667 },
  { id: 'appl-application-support-engineer', designation: 'Application Support Engineer', group: 'Application Support', band: '2-4', level: 'Standard', exp: '2-4', marketValidated: '8 - 12', mktLowMo: 66667, mktHighMo: 100000 },
  { id: 'appl-senior-application-support-engineer', designation: 'Senior Application Support Engineer', group: 'Application Support', band: '5-7', level: 'Specialist', exp: '5-7', marketValidated: '10 - 16', mktLowMo: 83333, mktHighMo: 133333 },
  { id: 'appl-lead-application-support-engineer', designation: 'Lead Application Support Engineer', group: 'Application Support', band: '8-10', level: 'Lead/Principal', exp: '7-12', marketValidated: '15 - 25', mktLowMo: 125000, mktHighMo: 208333 },
  { id: 'appl-director-of-application-support', designation: 'Director of Application Support', group: 'Application Support', band: '12+', level: 'Director', exp: '12+', marketValidated: '25 - 35', mktLowMo: 208333, mktHighMo: 291667 },
  { id: 'arch-associate-solution-architect', designation: 'Associate Solution Architect', group: 'Architecture & Design', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '10 - 12.4', mktLowMo: 83333, mktHighMo: 103333 },
  { id: 'arch-solution-architect', designation: 'Solution Architect', group: 'Architecture & Design', band: '2-4', level: 'Standard', exp: '3-5', marketValidated: '14.1 - 24.5', mktLowMo: 117500, mktHighMo: 204167 },
  { id: 'arch-senior-solution-architect', designation: 'Senior Solution Architect', group: 'Architecture & Design', band: '5-7', level: 'Specialist', exp: '6-8', marketValidated: '19 - 28', mktLowMo: 158333, mktHighMo: 233333 },
  { id: 'arch-lead-solution-architect', designation: 'Lead Solution Architect', group: 'Architecture & Design', band: '8-10', level: 'Lead/Principal', exp: '8-12', marketValidated: '18.5 - 25', mktLowMo: 154167, mktHighMo: 208333 },
  { id: 'arch-director-of-architecture-design', designation: 'Director of Architecture & Design', group: 'Architecture & Design', band: '12+', level: 'Director', exp: '13+', marketValidated: '29.6 - 45', mktLowMo: 246667, mktHighMo: 375000 },
  { id: 'auto-associate-automation-engineer', designation: 'Associate Automation Engineer', group: 'Automation', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '4 - 5', mktLowMo: 33333, mktHighMo: 41667 },
  { id: 'auto-automation-engineer', designation: 'Automation Engineer', group: 'Automation', band: '2-4', level: 'Standard', exp: '2-4', marketValidated: '4 - 8', mktLowMo: 33333, mktHighMo: 66667 },
  { id: 'auto-senior-automation-engineer', designation: 'Senior Automation Engineer', group: 'Automation', band: '5-7', level: 'Specialist', exp: '5-7', marketValidated: '11.5 - 12', mktLowMo: 95833, mktHighMo: 100000 },
  { id: 'auto-lead-automation-engineer', designation: 'Lead Automation Engineer', group: 'Automation', band: '8-10', level: 'Lead/Principal', exp: '7-12', marketValidated: '15 - 25', mktLowMo: 125000, mktHighMo: 208333 },
  { id: 'auto-director-of-automation', designation: 'Director of Automation', group: 'Automation', band: '12+', level: 'Director', exp: '12-15+', marketValidated: '26 - 40', mktLowMo: 216667, mktHighMo: 333333 },
  { id: 'busi-associate-business-analyst', designation: 'Associate Business Analyst', group: 'Business Analysis', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '5 - 9', mktLowMo: 41667, mktHighMo: 75000 },
  { id: 'busi-business-analyst', designation: 'Business Analyst', group: 'Business Analysis', band: '2-4', level: 'Standard', exp: '2-4', marketValidated: '6 - 10', mktLowMo: 50000, mktHighMo: 83333 },
  { id: 'busi-senior-business-analyst', designation: 'Senior Business Analyst', group: 'Business Analysis', band: '5-7', level: 'Specialist', exp: '4-6', marketValidated: '8 - 14.3', mktLowMo: 66667, mktHighMo: 119167 },
  { id: 'busi-lead-business-analyst', designation: 'Lead Business Analyst', group: 'Business Analysis', band: '8-10', level: 'Lead/Principal', exp: '6-10', marketValidated: '15 - 20', mktLowMo: 125000, mktHighMo: 166667 },
  { id: 'busi-director-of-business-analytics', designation: 'Director of Business Analytics', group: 'Business Analysis', band: '12+', level: 'Director', exp: '10+', marketValidated: '24 - 40', mktLowMo: 200000, mktHighMo: 333333 },
  { id: 'busi-associate-change-analyst', designation: 'Associate Change Analyst', group: 'Business Change Management', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '5 - 7', mktLowMo: 41667, mktHighMo: 58333 },
  { id: 'busi-change-analyst', designation: 'Change Analyst', group: 'Business Change Management', band: '2-4', level: 'Standard', exp: '2-3', marketValidated: '6.3 - 7.6', mktLowMo: 52500, mktHighMo: 63333 },
  { id: 'busi-senior-change-analyst', designation: 'Senior Change Analyst', group: 'Business Change Management', band: '5-7', level: 'Specialist', exp: '3-5', marketValidated: '8 - 12', mktLowMo: 66667, mktHighMo: 100000 },
  { id: 'busi-manager-change-management', designation: 'Manager, Change Management', group: 'Business Change Management', band: '8-10', level: 'Lead/Principal', exp: '6-8', marketValidated: '12 - 20', mktLowMo: 100000, mktHighMo: 166667 },
  { id: 'busi-director-of-change-management', designation: 'Director of Change Management', group: 'Business Change Management', band: '12+', level: 'Director', exp: '9+', marketValidated: '20 - 35', mktLowMo: 166667, mktHighMo: 291667 },
  { id: 'data-associate-data-strategy-consultant', designation: 'Associate Data Strategy Consultant', group: 'Data & Analytics Strategy', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '5 - 8', mktLowMo: 41667, mktHighMo: 66667 },
  { id: 'data-data-strategy-consultant', designation: 'Data Strategy Consultant', group: 'Data & Analytics Strategy', band: '2-4', level: 'Standard', exp: '2-4', marketValidated: '8 - 12', mktLowMo: 66667, mktHighMo: 100000 },
  { id: 'data-senior-data-strategy-consultant', designation: 'Senior Data Strategy Consultant', group: 'Data & Analytics Strategy', band: '5-7', level: 'Specialist', exp: '5-7', marketValidated: '14 - 20', mktLowMo: 116667, mktHighMo: 166667 },
  { id: 'data-lead-data-strategy-consultant', designation: 'Lead Data Strategy Consultant', group: 'Data & Analytics Strategy', band: '8-10', level: 'Lead/Principal', exp: '7-10', marketValidated: '20 - 32', mktLowMo: 166667, mktHighMo: 266667 },
  { id: 'data-director-of-data-analytics-strategy', designation: 'Director of Data & Analytics Strategy', group: 'Data & Analytics Strategy', band: '12+', level: 'Director', exp: '11-13+', marketValidated: '30 - 50', mktLowMo: 250000, mktHighMo: 416667 },
  { id: 'data-associate-data-engineer', designation: 'Associate Data Engineer', group: 'Data Engineering', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '4 - 8', mktLowMo: 33333, mktHighMo: 66667 },
  { id: 'data-data-engineer', designation: 'Data Engineer', group: 'Data Engineering', band: '2-4', level: 'Standard', exp: '2-4', marketValidated: '8 - 14', mktLowMo: 66667, mktHighMo: 116667 },
  { id: 'data-senior-data-engineer', designation: 'Senior Data Engineer', group: 'Data Engineering', band: '5-7', level: 'Specialist', exp: '4-6', marketValidated: '12 - 25', mktLowMo: 100000, mktHighMo: 208333 },
  { id: 'data-lead-data-engineer', designation: 'Lead Data Engineer', group: 'Data Engineering', band: '8-10', level: 'Lead/Principal', exp: '7-12', marketValidated: '24 - 39', mktLowMo: 200000, mktHighMo: 325000 },
  { id: 'data-director-of-data-engineering', designation: 'Director of Data Engineering', group: 'Data Engineering', band: '12+', level: 'Director', exp: '12+', marketValidated: '35 - 50', mktLowMo: 291667, mktHighMo: 416667 },
  { id: 'deve-software-engineer', designation: 'Software Engineer', group: 'Development', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '6 - 10', mktLowMo: 50000, mktHighMo: 83333 },
  { id: 'deve-software-engineer-2', designation: 'Software Engineer 2', group: 'Development', band: '2-4', level: 'Standard', exp: '2-4', marketValidated: '12 - 16', mktLowMo: 100000, mktHighMo: 133333 },
  { id: 'deve-software-engineer-3', designation: 'Software Engineer 3', group: 'Development', band: '5-7', level: 'Specialist', exp: '4-6', marketValidated: '15 - 25', mktLowMo: 125000, mktHighMo: 208333 },
  { id: 'deve-senior-software-engineer', designation: 'Senior Software Engineer', group: 'Development', band: '8-10', level: 'Lead', exp: '6-8', marketValidated: '20 - 35', mktLowMo: 166667, mktHighMo: 291667 },
  { id: 'deve-principal-software-engineer', designation: 'Principal Software Engineer', group: 'Development', band: '10-12', level: 'Principal', exp: '8-10', marketValidated: '25 - 40', mktLowMo: 208333, mktHighMo: 333333 },
  { id: 'deve-director-of-software-engineering', designation: 'Director of Software Engineering', group: 'Development', band: '12+', level: 'Director', exp: '12-15+', marketValidated: '35 - 60', mktLowMo: 291667, mktHighMo: 500000 },
  { id: 'info-junior-information-security-analyst', designation: 'Junior Information Security Analyst', group: 'Information Security', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '6 - 10', mktLowMo: 50000, mktHighMo: 83333 },
  { id: 'info-information-security-analyst', designation: 'Information Security Analyst', group: 'Information Security', band: '2-4', level: 'Standard', exp: '2-4', marketValidated: '10 - 15', mktLowMo: 83333, mktHighMo: 125000 },
  { id: 'info-senior-information-security-analyst', designation: 'Senior Information Security Analyst', group: 'Information Security', band: '5-7', level: 'Specialist', exp: '5-7', marketValidated: '15 - 25', mktLowMo: 125000, mktHighMo: 208333 },
  { id: 'info-lead-information-security-engineer', designation: 'Lead Information Security Engineer', group: 'Information Security', band: '8-10', level: 'Lead/Principal', exp: '7-12', marketValidated: '20 - 35', mktLowMo: 166667, mktHighMo: 291667 },
  { id: 'info-director-of-information-security', designation: 'Director of Information Security', group: 'Information Security', band: '12+', level: 'Director', exp: '12-15+', marketValidated: '32 - 55', mktLowMo: 266667, mktHighMo: 458333 },
  { id: 'it-s-associate-it-strategy-consultant', designation: 'Associate IT Strategy Consultant', group: 'IT Strategy', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '6 - 10', mktLowMo: 50000, mktHighMo: 83333 },
  { id: 'it-s-it-strategy-consultant', designation: 'IT Strategy Consultant', group: 'IT Strategy', band: '2-4', level: 'Standard', exp: '2-4', marketValidated: '10 - 15', mktLowMo: 83333, mktHighMo: 125000 },
  { id: 'it-s-senior-it-strategy-consultant', designation: 'Senior IT Strategy Consultant', group: 'IT Strategy', band: '5-7', level: 'Specialist', exp: '5-7', marketValidated: '15 - 25', mktLowMo: 125000, mktHighMo: 208333 },
  { id: 'it-s-lead-it-strategy-consultant', designation: 'Lead IT Strategy Consultant', group: 'IT Strategy', band: '8-10', level: 'Lead/Principal', exp: '7-12', marketValidated: '20 - 40', mktLowMo: 166667, mktHighMo: 333333 },
  { id: 'it-s-director-of-it-strategy', designation: 'Director of IT Strategy', group: 'IT Strategy', band: '12+', level: 'Director', exp: '12-15+', marketValidated: '35 - 55', mktLowMo: 291667, mktHighMo: 458333 },
  { id: 'prog-associate-project-manager', designation: 'Associate Project Manager', group: 'Programme / PM', band: '0-2', level: 'Junior', exp: '1-2', marketValidated: '5 - 12.8', mktLowMo: 41667, mktHighMo: 106667 },
  { id: 'prog-project-manager', designation: 'Project Manager', group: 'Programme / PM', band: '2-4', level: 'Standard', exp: '2-4', marketValidated: '6 - 15', mktLowMo: 50000, mktHighMo: 125000 },
  { id: 'prog-senior-project-manager', designation: 'Senior Project Manager', group: 'Programme / PM', band: '5-7', level: 'Specialist', exp: '4-7', marketValidated: '10 - 18', mktLowMo: 83333, mktHighMo: 150000 },
  { id: 'prog-programme-manager', designation: 'Programme Manager', group: 'Programme / PM', band: '8-10', level: 'Lead/Principal', exp: '7-10', marketValidated: '12 - 25', mktLowMo: 100000, mktHighMo: 208333 },
  { id: 'prog-director-of-program-management', designation: 'Director of Program Management', group: 'Programme / PM', band: '12+', level: 'Director', exp: '10-12+', marketValidated: '28 - 50', mktLowMo: 233333, mktHighMo: 416667 },
  { id: 'test-associate-qa-engineer', designation: 'Associate QA Engineer', group: 'Testing / QA', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '3 - 7', mktLowMo: 25000, mktHighMo: 58333 },
  { id: 'test-qa-engineer', designation: 'QA Engineer', group: 'Testing / QA', band: '2-4', level: 'Standard', exp: '2-4', marketValidated: '4 - 8', mktLowMo: 33333, mktHighMo: 66667 },
  { id: 'test-senior-qa-engineer', designation: 'Senior QA Engineer', group: 'Testing / QA', band: '5-7', level: 'Specialist', exp: '4-7', marketValidated: '5 - 10.5', mktLowMo: 41667, mktHighMo: 87500 },
  { id: 'test-lead-qa-engineer', designation: 'Lead QA Engineer', group: 'Testing / QA', band: '8-10', level: 'Lead/Principal', exp: '7-10', marketValidated: '15 - 25', mktLowMo: 125000, mktHighMo: 208333 },
  { id: 'test-director-of-quality-assurance', designation: 'Director of Quality Assurance', group: 'Testing / QA', band: '12+', level: 'Director', exp: '12+', marketValidated: '25 - 40', mktLowMo: 208333, mktHighMo: 333333 },
  { id: 'ui-associate-ui-ux-designer', designation: 'Associate UI/UX Designer', group: 'UI / UX', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '3 - 7', mktLowMo: 25000, mktHighMo: 58333 },
  { id: 'ui-ui-ux-designer', designation: 'UI/UX Designer', group: 'UI / UX', band: '2-4', level: 'Standard', exp: '2-4', marketValidated: '7 - 12', mktLowMo: 58333, mktHighMo: 100000 },
  { id: 'ui-senior-ui-ux-designer', designation: 'Senior UI/UX Designer', group: 'UI / UX', band: '5-7', level: 'Specialist', exp: '4-7', marketValidated: '12 - 20', mktLowMo: 100000, mktHighMo: 166667 },
  { id: 'ui-lead-product-designer', designation: 'Lead Product Designer', group: 'UI / UX', band: '8-10', level: 'Lead/Principal', exp: '7-10', marketValidated: '15 - 30', mktLowMo: 125000, mktHighMo: 250000 },
  { id: 'ui-vp-of-design', designation: 'VP of Design', group: 'UI / UX', band: '12+', level: 'Director', exp: '12+', marketValidated: '30 - 50', mktLowMo: 250000, mktHighMo: 416667 },
  { id: 'infr-associate-infrastructure-support-engineer', designation: 'Associate Infrastructure Support Engineer', group: 'Infrastructure Support', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '2 - 5', mktLowMo: 16667, mktHighMo: 41667 },
  { id: 'infr-infrastructure-support-engineer', designation: 'Infrastructure Support Engineer', group: 'Infrastructure Support', band: '2-4', level: 'Standard', exp: '2-4', marketValidated: '5 - 8', mktLowMo: 41667, mktHighMo: 66667 },
  { id: 'infr-senior-infrastructure-support-engineer', designation: 'Senior Infrastructure Support Engineer', group: 'Infrastructure Support', band: '5-7', level: 'Specialist', exp: '4-7', marketValidated: '7.5 - 14', mktLowMo: 62500, mktHighMo: 116667 },
  { id: 'infr-lead-infrastructure-support-engineer', designation: 'Lead Infrastructure Support Engineer', group: 'Infrastructure Support', band: '8-10', level: 'Lead/Principal', exp: '7-10', marketValidated: '12 - 20', mktLowMo: 100000, mktHighMo: 166667 },
  { id: 'infr-director-of-infrastructure-support', designation: 'Director of Infrastructure Support', group: 'Infrastructure Support', band: '12+', level: 'Director', exp: '10-12+', marketValidated: '20 - 35', mktLowMo: 166667, mktHighMo: 291667 },
  { id: 'infr-associate-infrastructure-architect', designation: 'Associate Infrastructure Architect', group: 'Infrastructure Architecture', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '–', mktLowMo: null, mktHighMo: null },
  { id: 'infr-infrastructure-architect', designation: 'Infrastructure Architect', group: 'Infrastructure Architecture', band: '2-4', level: 'Standard', exp: '3-5', marketValidated: '–', mktLowMo: null, mktHighMo: null },
  { id: 'infr-senior-infrastructure-architect', designation: 'Senior Infrastructure Architect', group: 'Infrastructure Architecture', band: '5-7', level: 'Specialist', exp: '6-8', marketValidated: '–', mktLowMo: null, mktHighMo: null },
  { id: 'infr-lead-infrastructure-architect', designation: 'Lead Infrastructure Architect', group: 'Infrastructure Architecture', band: '8-10', level: 'Lead', exp: '8-10', marketValidated: '–', mktLowMo: null, mktHighMo: null },
  { id: 'infr-principal-infrastructure-architect', designation: 'Principal Infrastructure Architect', group: 'Infrastructure Architecture', band: '10-12', level: 'Principal', exp: '10-15', marketValidated: '–', mktLowMo: null, mktHighMo: null },
  { id: 'infr-director-of-infrastructure-architecture', designation: 'Director of Infrastructure Architecture', group: 'Infrastructure Architecture', band: '12+', level: 'Director', exp: '15+', marketValidated: '–', mktLowMo: null, mktHighMo: null },
  { id: 'infr-associate-change-analyst-infra', designation: 'Associate Change Analyst (Infra)', group: 'Infrastructure Change', band: '0-2', level: 'Junior', exp: '0-2', marketValidated: '–', mktLowMo: null, mktHighMo: null },
  { id: 'infr-infrastructure-change-analyst', designation: 'Infrastructure Change Analyst', group: 'Infrastructure Change', band: '2-4', level: 'Standard', exp: '2-4', marketValidated: '–', mktLowMo: null, mktHighMo: null },
  { id: 'infr-senior-infrastructure-change-manager', designation: 'Senior Infrastructure Change Manager', group: 'Infrastructure Change', band: '5-7', level: 'Specialist', exp: '5-7', marketValidated: '–', mktLowMo: null, mktHighMo: null },
  { id: 'infr-lead-infrastructure-change-manager', designation: 'Lead Infrastructure Change Manager', group: 'Infrastructure Change', band: '8-10', level: 'Lead/Principal', exp: '7-12', marketValidated: '–', mktLowMo: null, mktHighMo: null },
  { id: 'infr-director-of-infrastructure-change', designation: 'Director of Infrastructure Change', group: 'Infrastructure Change', band: '12+', level: 'Director', exp: '12-15+', marketValidated: '–', mktLowMo: null, mktHighMo: null },
];

// Average expected market cost (Rs/month), midpoint of the validated band.
export const avgMo = (b: Benchmark): number | null =>
  b.mktLowMo != null && b.mktHighMo != null ? Math.round((b.mktLowMo + b.mktHighMo) / 2) : null;

// Parse a candidate CTC string ("24 LPA", "28-30 LPA", "Rs 22") to Rs/month,
// averaging a range. Returns null when nothing parses.
export function ctcToMonthly(ctc: string): number | null {
  if (!ctc) return null;
  const nums = (ctc.match(/\d+(?:\.\d+)?/g) || []).map(Number).filter((n) => n > 0 && n < 200);
  if (!nums.length) return null;
  const avgLpa = nums.reduce((a, b) => a + b, 0) / nums.length;
  return Math.round((avgLpa * 100000) / 12);
}

export const groupsWithBenchmarks = (): string[] => Array.from(new Set(BENCHMARKS.map((b) => b.group)));
