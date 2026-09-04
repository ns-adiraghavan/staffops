import type { DB } from '../types';

const day = 864e5;

// Real NS vendor list + representative requirements/candidates from the PRD
// and prototype. This is demo data — the "Reset demo data" control in the
// sidebar restores it.
export function seed(): DB {
  const now = Date.now();
  const vendors: DB['vendors'] = [
    { id: 'v1', name: 'Endeavour', type: 'Mixed', fit: 'green', contact: 'Rajan Seth', email: 'rajan@endeavour.co.in', tags: ['Fast turnaround', 'BFSI'], notes: 'Actively engaged. Very responsive, goes above and beyond on shortlisting. Best for urgent contract roles.' },
    { id: 'v2', name: 'CodersBrain', type: 'Contract', fit: 'amber', contact: 'Anita Rao', email: 'anita@codersbrain.com', tags: ['High volume', 'Screen carefully'], notes: 'Contract-heavy. Good bench for standard roles. Volume submissions — screen carefully. Weaker on niche.' },
    { id: 'v3', name: 'NS Global Corporation', type: 'Mixed', fit: 'green', contact: 'Sameer Walia', email: 'swalia@nsglobal.co', tags: ['Reliable', 'Owned entity'], notes: 'Actively engaged. Solid across most requirements. Better for standard roles; check quality on niche.' },
    { id: 'v4', name: 'Antal International', type: 'FTE', fit: 'green', contact: 'Priya Khanna', email: 'priya@antal.com', tags: ['Senior / Lead', 'FTE only'], notes: 'Strong mid-senior FTE search. Does not do contract. Good network in BFSI and tech leadership.' },
    { id: 'v5', name: 'Michael Page', type: 'FTE', fit: 'green', contact: 'Deepa Iyer', email: 'deepa.iyer@michaelpage.in', tags: ['Senior FTE', 'Leadership'], notes: 'Mid-senior FTE only. Expensive but high quality. Good for leadership and practice-lead roles.' },
    { id: 'v6', name: 'Supersourcing', type: 'Mixed', fit: 'green', contact: 'Karan Bali', email: 'karan@supersourcing.com', tags: ['Fast turnaround', 'Startups'], notes: 'Actively engaged. Fast on standard tech contract roles.' },
    { id: 'v7', name: 'NR Consulting', type: 'Contract', fit: 'green', contact: '', email: '', tags: ['Contract'], notes: 'Actively engaged.' },
    { id: 'v8', name: 'Nexthire', type: 'Mixed', fit: 'amber', contact: '', email: '', tags: ['Not for niche'], notes: 'No evident Salesforce capability. Better for general tech contract roles. Avoid for niche functional.' },
    { id: 'v9', name: 'Careernet', type: 'FTE', fit: 'green', contact: '', email: '', tags: ['Tech FTE'], notes: 'Strong in tech FTE.' },
    { id: 'v10', name: 'Cresendo', type: 'FTE', fit: 'green', contact: '', email: '', tags: ['Tech', 'BFSI'], notes: 'Tech & BFSI FTE.' },
    { id: 'v11', name: 'CIEL HR Services', type: 'FTE', fit: 'green', contact: '', email: '', tags: ['FTE'], notes: 'FTE, actively engaged.' },
  ];
  const requirements: DB['requirements'] = [
    { id: 'REQ-042', role: 'Security Lead', client: 'Parameta Solutions', level: 'Lead', expMin: 8, expMax: 12, type: 'Contract', priority: 'High', status: 'Open', rateCard: 'Pending', assigned: 'Adi R.', raisedBy: 'Nistha Singh', location: 'Mumbai / Hybrid', start: 'Oct 2026', vendors: ['v1', 'v2', 'v3'],
      jd: "Seeking an experienced Security Lead with hands-on expertise in enterprise security architecture, threat modelling, and compliance frameworks (ISO 27001, SOC 2). Responsible for defining security policies, leading a small security engineering team, and acting as primary liaison with the client's CISO office. Must have demonstrated experience with cloud security (AWS or Azure), IAM architecture, and vulnerability management at scale.",
      notes: 'Client wants someone who can interface with the CISO directly. Push strong candidates to interview ASAP. Avoid candidates with gaps > 6 months.', createdAt: now - 13 * day },
    { id: 'REQ-041', role: 'Data Engineer (Spark/Databricks)', client: 'Confidential', level: 'Senior', expMin: 4, expMax: 8, type: 'Contract', priority: 'High', status: 'Rate Card Ready', rateCard: 'Ready', assigned: 'Priya M.', raisedBy: 'Adi R.', location: 'Bengaluru / Remote', start: 'Sep 2026', vendors: ['v1', 'v3', 'v6'],
      jd: 'Design and build scalable ETL pipelines on Spark / Databricks. Own data models across the lakehouse, mentor a pod of 3, and partner with risk-analytics on regulatory reporting. Must have: Python, PySpark, Airflow, AWS. Nice: Scala, dbt.',
      notes: '', createdAt: now - 6 * day },
    { id: 'REQ-040', role: 'Workday AMS L1/L2', client: 'TP ICAP', level: 'Standard', expMin: 2, expMax: 4, type: 'FTE', priority: 'Medium', status: 'On Hold', rateCard: 'Pending', assigned: 'Neha K.', raisedBy: 'Neha K.', location: 'Pune', start: 'Nov 2026', vendors: ['v4', 'v9'],
      jd: 'Provide L1/L2 application management support for Workday HCM. Handle tickets, config changes, and integrations monitoring.', notes: 'On hold pending client budget sign-off.', createdAt: now - 21 * day },
    { id: 'REQ-039', role: 'GenAI Engineer', client: 'Cummins', level: 'Senior', expMin: 5, expMax: 9, type: 'Contract', priority: 'High', status: 'Candidates Received', rateCard: 'Ready', assigned: 'Rahul S.', raisedBy: 'Adi R.', location: 'Remote', start: 'Sep 2026', vendors: ['v2', 'v6'],
      jd: 'Build and deploy GenAI applications — RAG pipelines, LLM orchestration, evaluation harnesses. Python, LangChain, vector DBs, cloud (AWS/Azure). Niche premium role.', notes: 'Hot skill — move fast on shortlist.', createdAt: now - 4 * day },
    { id: 'REQ-038', role: 'Salesforce Practice Lead', client: 'Internal NS', level: 'Lead', expMin: 10, expMax: 14, type: 'FTE', priority: 'Medium', status: 'Open', rateCard: 'Pending', assigned: 'Adi R.', raisedBy: 'Leadership', location: 'Bengaluru', start: 'Q4 2026', vendors: ['v5'],
      jd: 'Lead the Salesforce practice — pre-sales, delivery oversight, and team building. Deep Salesforce platform expertise plus people leadership.', notes: '', createdAt: now - 16 * day },
  ];
  const candidates: DB['candidates'] = [
    { id: 'c1', reqId: 'REQ-042', name: 'Vikram Nair', vendor: 'Endeavour', exp: 8, location: 'Mumbai', ctc: '24 LPA', ectc: '28–30 LPA', notice: '30 days', stage: 'Interview', fit: 'green', interviewRef: 'IV-2261', comment: 'Strong architecture background, direct CISO exposure. Push to interview.', createdAt: now - 3 * day },
    { id: 'c2', reqId: 'REQ-042', name: 'Reema Shah', vendor: 'CodersBrain', exp: 7, location: 'Bengaluru', ctc: '21 LPA', ectc: '26 LPA', notice: '45 days', stage: 'Shortlisted', fit: 'amber', interviewRef: '', comment: 'Solid but less client-facing exposure.', createdAt: now - 3 * day },
    { id: 'c3', reqId: 'REQ-042', name: 'Aarav Kapoor', vendor: 'NS Global Corporation', exp: 9, location: 'Hyderabad', ctc: '26 LPA', ectc: '32 LPA', notice: '60 days', stage: 'Reviewed', fit: '', interviewRef: '', comment: 'Long notice period — flag to client.', createdAt: now - 2 * day },
    { id: 'c4', reqId: 'REQ-042', name: 'Priya Menon', vendor: 'Endeavour', exp: 6, location: 'Pune', ctc: '18 LPA', ectc: '24 LPA', notice: 'Immediate', stage: 'Received', fit: '', interviewRef: '', comment: '', createdAt: now - 1 * day },
    { id: 'c5', reqId: 'REQ-039', name: 'Sneha Iyer', vendor: 'CodersBrain', exp: 8, location: 'Bengaluru', ctc: '22 LPA', ectc: '30 LPA', notice: '60 days', stage: 'Shortlisted', fit: 'green', interviewRef: '', comment: 'Great RAG portfolio.', createdAt: now - 1 * day },
    { id: 'c6', reqId: 'REQ-039', name: 'Karan Malhotra', vendor: 'Supersourcing', exp: 7, location: 'Gurugram', ctc: '20 LPA', ectc: '27 LPA', notice: '90 days', stage: 'Received', fit: '', interviewRef: '', comment: '', createdAt: now - 0.5 * day },
    { id: 'c7', reqId: 'REQ-041', name: 'Arjun Mehta', vendor: 'Endeavour', exp: 9, location: 'Pune', ctc: '28.5 LPA', ectc: '34 LPA', notice: '30 days', stage: 'Shortlisted', fit: 'green', interviewRef: '', comment: 'Databricks certified.', createdAt: now - 2 * day },
  ];
  const activity: DB['activity'] = [
    { t: '3 CVs uploaded', d: 'REQ-039 · GenAI Engineer', dot: '#1D9E75', at: now - 20 * 6e4 },
    { t: 'Rate card ready', d: 'REQ-041 · Data Engineer', dot: '#234a86', at: now - 60 * 6e4 },
    { t: 'Requirement raised', d: 'REQ-038 · Salesforce Practice Lead', dot: '#6d5cc4', at: now - 3 * 36e5 },
    { t: 'Shortlist updated', d: 'REQ-042 · Security Lead', dot: '#1D9E75', at: now - 5 * 36e5 },
  ];
  return { requirements, vendors, candidates, activity };
}
