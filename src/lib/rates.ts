// NS benchmarked rate card. Prices from the NS "Final-last shared" rate
// sheet; costs from the NS Rate Calculator (CTC-based, INR/USD = 90,
// 20 working days/month, 8 hrs/day). Margin = (Price − Cost) ÷ Price.
export interface Band {
  label: string;
  hr: number;
  mo: number;
  yr: number;
}
export type RateGroup = Record<string, Band>;

export const INR_RATE = 90;
export const BANDS = ['0-2', '2-4', '5-7', '8-10', '10-12', '12+'] as const;

export const RATE_DATA: Record<string, RateGroup> = {
  'Application Support': { '0-2': { label: 'Junior', hr: 15, mo: 2500, yr: 26250 }, '2-4': { label: 'Standard', hr: 20, mo: 3500, yr: 35000 }, '5-7': { label: 'Specialist', hr: 30, mo: 4500, yr: 52750 }, '8-10': { label: 'Lead', hr: 35, mo: 5500, yr: 61500 }, '10-12': { label: 'Principal', hr: 40, mo: 6500, yr: 70250 }, '12+': { label: 'Director', hr: 50, mo: 8200, yr: 88000 } },
  'Architecture & Design': { '0-2': { label: 'Junior', hr: 20, mo: 3500, yr: 35000 }, '2-4': { label: 'Standard', hr: 35, mo: 5500, yr: 61500 }, '5-7': { label: 'Specialist', hr: 45, mo: 7000, yr: 79000 }, '8-10': { label: 'Lead', hr: 50, mo: 8000, yr: 88000 }, '10-12': { label: 'Principal', hr: 60, mo: 9500, yr: 105500 }, '12+': { label: 'Director', hr: 80, mo: 12000, yr: 140750 } },
  'Automation': { '0-2': { label: 'Junior', hr: 15, mo: 2500, yr: 26250 }, '2-4': { label: 'Standard', hr: 20, mo: 3000, yr: 35000 }, '5-7': { label: 'Specialist', hr: 30, mo: 5000, yr: 52750 }, '8-10': { label: 'Lead', hr: 40, mo: 6500, yr: 70250 }, '10-12': { label: 'Principal', hr: 50, mo: 7500, yr: 88000 }, '12+': { label: 'Director', hr: 60, mo: 9500, yr: 105500 } },
  'Business Analysis': { '0-2': { label: 'Junior', hr: 15, mo: 2500, yr: 26250 }, '2-4': { label: 'Standard', hr: 20, mo: 3000, yr: 35000 }, '5-7': { label: 'Specialist', hr: 25, mo: 4000, yr: 44000 }, '8-10': { label: 'Lead', hr: 30, mo: 5200, yr: 52750 }, '10-12': { label: 'Principal', hr: 40, mo: 6500, yr: 70250 }, '12+': { label: 'Director', hr: 60, mo: 9000, yr: 105500 } },
  'Business Change Management': { '0-2': { label: 'Junior', hr: 15, mo: 2300, yr: 26250 }, '2-4': { label: 'Standard', hr: 15, mo: 2800, yr: 26250 }, '5-7': { label: 'Specialist', hr: 25, mo: 3800, yr: 44000 }, '8-10': { label: 'Lead', hr: 30, mo: 5000, yr: 52750 }, '10-12': { label: 'Principal', hr: 40, mo: 6000, yr: 70250 }, '12+': { label: 'Director', hr: 50, mo: 8000, yr: 88000 } },
  'Data & Analytics Strategy': { '0-2': { label: 'Junior', hr: 25, mo: 4000, yr: 44000 }, '2-4': { label: 'Standard', hr: 30, mo: 5000, yr: 52750 }, '5-7': { label: 'Specialist', hr: 40, mo: 6200, yr: 70250 }, '8-10': { label: 'Lead', hr: 55, mo: 8500, yr: 96750 }, '10-12': { label: 'Principal', hr: 65, mo: 10000, yr: 114250 }, '12+': { label: 'Director', hr: 90, mo: 14000, yr: 158250 } },
  'Data Engineering': { '0-2': { label: 'Junior', hr: 25, mo: 4000, yr: 44000 }, '2-4': { label: 'Standard', hr: 30, mo: 5200, yr: 52750 }, '5-7': { label: 'Specialist', hr: 40, mo: 6000, yr: 70250 }, '8-10': { label: 'Lead', hr: 60, mo: 9000, yr: 105500 }, '10-12': { label: 'Principal', hr: 70, mo: 11000, yr: 123000 }, '12+': { label: 'Director', hr: 90, mo: 14000, yr: 158250 } },
  'Development': { '0-2': { label: 'Junior', hr: 15, mo: 2500, yr: 26250 }, '2-4': { label: 'Standard', hr: 25, mo: 3750, yr: 44000 }, '5-7': { label: 'Specialist', hr: 35, mo: 5500, yr: 61500 }, '8-10': { label: 'Lead', hr: 40, mo: 6250, yr: 70250 }, '10-12': { label: 'Principal', hr: 45, mo: 7250, yr: 79000 }, '12+': { label: 'Director', hr: 70, mo: 11000, yr: 123000 } },
  'Information Security': { '0-2': { label: 'Junior', hr: 20, mo: 3000, yr: 35000 }, '2-4': { label: 'Standard', hr: 35, mo: 5500, yr: 61500 }, '5-7': { label: 'Specialist', hr: 45, mo: 7000, yr: 79000 }, '8-10': { label: 'Lead', hr: 55, mo: 8500, yr: 96750 }, '10-12': { label: 'Principal', hr: 70, mo: 11000, yr: 123000 }, '12+': { label: 'Director', hr: 90, mo: 14000, yr: 158250 } },
  'IT Strategy': { '0-2': { label: 'Junior', hr: 20, mo: 3200, yr: 35000 }, '2-4': { label: 'Standard', hr: 30, mo: 4750, yr: 52750 }, '5-7': { label: 'Specialist', hr: 45, mo: 7200, yr: 79000 }, '8-10': { label: 'Lead', hr: 50, mo: 8000, yr: 88000 }, '10-12': { label: 'Principal', hr: 65, mo: 10000, yr: 114250 }, '12+': { label: 'Director', hr: 90, mo: 13500, yr: 158250 } },
  'Programme / PM': { '0-2': { label: 'Junior', hr: 15, mo: 2750, yr: 26250 }, '2-4': { label: 'Standard', hr: 30, mo: 4500, yr: 52750 }, '5-7': { label: 'Specialist', hr: 35, mo: 5800, yr: 61500 }, '8-10': { label: 'Lead', hr: 45, mo: 7000, yr: 79000 }, '10-12': { label: 'Principal', hr: 60, mo: 9000, yr: 105500 }, '12+': { label: 'Director', hr: 70, mo: 11000, yr: 123000 } },
  'Testing / QA': { '0-2': { label: 'Junior', hr: 15, mo: 2500, yr: 26250 }, '2-4': { label: 'Standard', hr: 20, mo: 3500, yr: 35000 }, '5-7': { label: 'Specialist', hr: 25, mo: 4000, yr: 44000 }, '8-10': { label: 'Lead', hr: 25, mo: 4000, yr: 44000 }, '10-12': { label: 'Principal', hr: 35, mo: 5500, yr: 61500 }, '12+': { label: 'Director', hr: 60, mo: 9000, yr: 105500 } },
  'UI / UX': { '0-2': { label: 'Junior', hr: 15, mo: 2500, yr: 26250 }, '2-4': { label: 'Standard', hr: 20, mo: 3500, yr: 35000 }, '5-7': { label: 'Specialist', hr: 30, mo: 5000, yr: 52750 }, '8-10': { label: 'Lead', hr: 40, mo: 6500, yr: 70250 }, '10-12': { label: 'Principal', hr: 50, mo: 8000, yr: 88000 }, '12+': { label: 'Director', hr: 70, mo: 11000, yr: 123000 } },
  'Workday / ERP': { '2-4': { label: 'Standard', hr: 20, mo: 3500, yr: 35000 }, '5-7': { label: 'Specialist', hr: 40, mo: 6000, yr: 70250 }, '8-10': { label: 'Lead', hr: 50, mo: 7800, yr: 88000 }, '10-12': { label: 'Principal', hr: 55, mo: 8500, yr: 96750 } },
  'Infrastructure Support': { '0-2': { label: 'Junior', hr: 15, mo: 2500, yr: 26250 }, '2-4': { label: 'Standard', hr: 25, mo: 4000, yr: 44000 }, '5-7': { label: 'Specialist', hr: 35, mo: 5500, yr: 61500 }, '8-10': { label: 'Lead', hr: 45, mo: 7000, yr: 79000 }, '10-12': { label: 'Principal', hr: 55, mo: 8500, yr: 96750 }, '12+': { label: 'Director', hr: 70, mo: 10500, yr: 123000 } },
  'Infrastructure Architecture': { '0-2': { label: 'Junior', hr: 25, mo: 4000, yr: 44000 }, '2-4': { label: 'Standard', hr: 40, mo: 6500, yr: 70250 }, '5-7': { label: 'Specialist', hr: 50, mo: 8000, yr: 88000 }, '8-10': { label: 'Lead', hr: 65, mo: 10000, yr: 114250 }, '10-12': { label: 'Principal', hr: 80, mo: 12000, yr: 140750 }, '12+': { label: 'Director', hr: 100, mo: 15000, yr: 176000 } },
  'Infrastructure Change': { '0-2': { label: 'Junior', hr: 15, mo: 2500, yr: 26250 }, '2-4': { label: 'Standard', hr: 25, mo: 4000, yr: 44000 }, '5-7': { label: 'Specialist', hr: 35, mo: 5500, yr: 61500 }, '8-10': { label: 'Lead', hr: 45, mo: 7000, yr: 79000 }, '10-12': { label: 'Principal', hr: 50, mo: 8000, yr: 88000 }, '12+': { label: 'Director', hr: 70, mo: 11000, yr: 123000 } },
};

export const COST_DATA: Record<string, Record<string, number>> = {
  'Application Support': { '0-2': 3.47, '2-4': 4.57, '5-7': 7.87, '8-10': 8.68, '10-12': 11.86, '12+': 19.1 },
  'Architecture & Design': { '0-2': 5.67, '2-4': 12.62, '5-7': 15.74, '8-10': 14.47, '10-12': 23.73, '12+': 26.04 },
  'Automation': { '0-2': 2.89, '2-4': 4.63, '5-7': 6.94, '8-10': 11.28, '10-12': 15.91, '12+': 23.15 },
  'Business Analysis': { '0-2': 5.21, '2-4': 5.79, '5-7': 8.28, '8-10': 11.52, '10-12': 14.87, '12+': 23.15 },
  'Business Change Management': { '0-2': 3.59, '2-4': 4.4, '5-7': 6.94, '8-10': 9.2, '10-12': 13.31, '12+': 20.25 },
  'Data & Analytics Strategy': { '0-2': 4.63, '2-4': 6.94, '5-7': 11.57, '8-10': 18.06, '10-12': 26.04, '12+': 28.94 },
  'Data Engineering': { '0-2': 4.63, '2-4': 8.1, '5-7': 14.58, '8-10': 22.57, '10-12': 27.78, '12+': 28.94 },
  'Development': { '0-2': 5.56, '2-4': 9.26, '5-7': 13.89, '8-10': 15.16, '10-12': 22.57, '12+': 35.01 },
  'Information Security': { '0-2': 4.05, '2-4': 7.06, '5-7': 12.73, '8-10': 14.06, '10-12': 16.49, '12+': 31.83 },
  'IT Strategy': { '0-2': 4.69, '2-4': 8.22, '5-7': 13.43, '8-10': 13.48, '10-12': 19.68, '12+': 32.41 },
  'Programme / PM': { '0-2': 4.57, '2-4': 7.99, '5-7': 10.42, '8-10': 14.47, '10-12': 20.83, '12+': 27.78 },
  'Testing / QA': { '0-2': 3.36, '2-4': 4.63, '5-7': 6.08, '8-10': 8.85, '10-12': 12.56, '12+': 23.15 },
  'UI / UX': { '0-2': 3.76, '2-4': 6.31, '5-7': 11.11, '8-10': 12.38, '10-12': 18.52, '12+': 29.22 },
  'Workday / ERP': { '2-4': 8.1, '5-7': 12.15, '8-10': 17.94, '10-12': 26.04 },
  'Infrastructure Support': { '0-2': 2.89, '2-4': 4.69, '5-7': 7.99, '8-10': 9.26, '10-12': 12.44, '12+': 20.25 },
  'Infrastructure Architecture': { '0-2': 5.32, '2-4': 11.69, '5-7': 17.07, '8-10': 22.57, '10-12': 29.22, '12+': 39.06 },
  'Infrastructure Change': { '0-2': 3.47, '2-4': 5.5, '5-7': 9.38, '8-10': 9.9, '10-12': 13.31, '12+': 23.73 },
};

export const marginClass = (m: number) => (m >= 62 ? 'mg-green' : m >= 55 ? 'mg-amber' : 'mg-red');
