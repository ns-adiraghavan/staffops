import type { DB, Vendor } from '../types';

const day = 864e5;

// Real NS vendor list with MSA/NDA paperwork status. Demo requirements and
// candidates ride on top. "Load demo data" / "Clear data" toggle this.
export function seed(): DB {
  const now = Date.now();

  const V = (
    id: string,
    name: string,
    type: Vendor['type'],
    fit: Vendor['fit'],
    contact: string,
    email: string,
    paperwork: Vendor['paperwork'],
    tags: string[] = [],
    notes = ''
  ): Vendor => ({ id, name, type, fit, contact, email, tags, notes, paperwork });

  const vendors: Vendor[] = [
    V('v1', 'Avensys', 'Mixed', 'green', 'Pranay Paradkar, Deepti', 'pranayparadkar@aven-sys.com; deepti@aven-sys.com', { nda: true, agreement: 'signed', note: 'MSA & NDA executed Aug 7, 2026' }),
    V('v2', 'NextHire', 'Mixed', 'amber', 'Shruti Kumari, Parama Chowdhury', 'shruti@nexthireconsulting.com; parama@nexthireconsulting.com', { nda: true, agreement: 'pending', note: 'NDA signed Jun 11, 2026; MSA pending execution' }),
    V('v3', 'NR Consulting', 'Contract', 'green', 'Nitin Arya, Sunny Ahuja', 'nitina@nrconsulting.com; sunnya@nrconsulting.com', { nda: true, agreement: 'signed', note: 'MSA & NDA executed Jun 11, 2026' }),
    V('v4', 'Eminence TechnoSystem', 'Mixed', 'green', 'Amrit, Sasi Kumar, Sudha, Sonia', 'amrit@eminencetechnosystem.com; sasi@eminencetechnosystem.com', { nda: true, agreement: 'signed', note: 'Executed Aug 12, 2026' }),
    V('v5', 'Sriven Technologies', 'Contract', 'green', 'Murli Rao, Ramesh, Prasad', 'murli@sriventech.com; ramesh@sriventech.com; prasad@sriventech.com', { nda: true, agreement: 'signed', note: 'Executed Aug 20, 2026' }),
    V('v6', 'Expert Powerhouse Solutions', 'Mixed', 'amber', '', '', { nda: false, agreement: 'none', note: 'No documentation on record' }),
    V('v7', 'Supersourcing', 'Mixed', 'amber', '', '', { nda: false, agreement: 'none', note: 'No documentation on record' }),
    V('v8', 'Multirecruit', 'Mixed', 'amber', '', '', { nda: false, agreement: 'none', note: 'No documentation on record' }),
    V('v9', 'CodeChavo', 'Mixed', 'amber', '', '', { nda: false, agreement: 'none', note: 'No documentation on record' }),
    V('v10', 'Wiztekit', 'Mixed', 'amber', '', '', { nda: false, agreement: 'none', note: 'No documentation on record' }),
    V('v11', 'QuickXpert Infotech', 'Mixed', 'amber', '', '', { nda: false, agreement: 'none', note: 'No documentation on record' }),
    V('v12', 'Endevour', 'Mixed', 'amber', '', '', { nda: false, agreement: 'none', note: 'No documentation on record' }),
    V('v13', 'Shelby Global', 'Mixed', 'amber', '', '', { nda: false, agreement: 'none', note: 'No documentation on record' }),
    V('v14', 'CLIQHR', 'Mixed', 'amber', '', '', { nda: false, agreement: 'none', note: 'No documentation on record' }),
    V('v15', 'Ciel HR', 'FTE', 'amber', '', '', { nda: false, agreement: 'none', note: 'No documentation on record' }),
    V('v16', 'Codersbrain', 'Contract', 'amber', '', '', { nda: false, agreement: 'none', note: 'No documentation on record' }),
    V('v17', 'Ascenwork', 'Mixed', 'amber', '', '', { nda: false, agreement: 'none', note: 'No documentation on record' }, ['SharePoint']),
    V('v18', 'NS Global Corp', 'Mixed', 'amber', 'Kajal', 'kajal@nsglobalcorporation.com', { nda: false, agreement: 'none', note: 'No documentation on record' }),
    V('v19', 'Epstom', 'Mixed', 'amber', 'Somya Sadh, Subin', 'somya@epstom.com', { nda: false, agreement: 'pending', note: 'MSA process initiated' }, ['SharePoint']),
  ];

  const requirements: DB['requirements'] = [
    { id: 'REQ-042', role: 'Security Lead', client: 'Parameta Solutions', level: 'Lead', expMin: 8, expMax: 12, type: 'Contract', priority: 'High', status: 'Open', rateCard: 'Pending', assigned: 'Adi R.', raisedBy: 'Nistha Singh', location: 'Mumbai / Hybrid', start: 'Oct 2026', vendors: ['v1', 'v2', 'v3'],
      jd: "Seeking an experienced Security Lead with hands-on expertise in enterprise security architecture, threat modelling, and compliance frameworks (ISO 27001, SOC 2). Responsible for defining security policies, leading a small security engineering team, and acting as primary liaison with the client's CISO office. Must have demonstrated experience with cloud security (AWS or Azure), IAM architecture, and vulnerability management at scale.",
      notes: 'Client wants someone who can interface with the CISO directly. Push strong candidates to interview ASAP. Avoid candidates with gaps > 6 months.', benchmarkId: 'info-lead-information-security-engineer', createdAt: now - 13 * day },
    { id: 'REQ-041', role: 'Data Engineer (Spark/Databricks)', client: 'Confidential', level: 'Senior', expMin: 4, expMax: 8, type: 'Contract', priority: 'High', status: 'Rate Card Ready', rateCard: 'Ready', assigned: 'Priya M.', raisedBy: 'Adi R.', location: 'Bengaluru / Remote', start: 'Sep 2026', vendors: ['v1', 'v3', 'v5'],
      jd: 'Design and build scalable ETL pipelines on Spark / Databricks. Own data models across the lakehouse, mentor a pod of 3, and partner with risk-analytics on regulatory reporting. Must have: Python, PySpark, Airflow, AWS. Nice: Scala, dbt.',
      notes: '', benchmarkId: 'data-senior-data-engineer', createdAt: now - 6 * day },
    { id: 'REQ-040', role: 'Workday AMS L1/L2', client: 'TP ICAP', level: 'Standard', expMin: 2, expMax: 4, type: 'FTE', priority: 'Medium', status: 'On Hold', rateCard: 'Pending', assigned: 'Neha K.', raisedBy: 'Neha K.', location: 'Pune', start: 'Nov 2026', vendors: ['v4', 'v15'],
      jd: 'Provide L1/L2 application management support for Workday HCM. Handle tickets, config changes, and integrations monitoring.', notes: 'On hold pending client budget sign-off.', benchmarkId: 'work-workday-financials-l1', createdAt: now - 21 * day },
    { id: 'REQ-039', role: 'GenAI Engineer', client: 'Cummins', level: 'Senior', expMin: 5, expMax: 9, type: 'Contract', priority: 'High', status: 'Candidates Received', rateCard: 'Ready', assigned: 'Rahul S.', raisedBy: 'Adi R.', location: 'Remote', start: 'Sep 2026', vendors: ['v2', 'v7'],
      jd: 'Build and deploy GenAI applications — RAG pipelines, LLM orchestration, evaluation harnesses. Python, LangChain, vector DBs, cloud (AWS/Azure). Niche premium role.', notes: 'Hot skill — move fast on shortlist.', createdAt: now - 4 * day },
    { id: 'REQ-038', role: 'Salesforce Practice Lead', client: 'Internal NS', level: 'Lead', expMin: 10, expMax: 14, type: 'FTE', priority: 'Medium', status: 'Open', rateCard: 'Pending', assigned: 'Adi R.', raisedBy: 'Leadership', location: 'Bengaluru', start: 'Q4 2026', vendors: ['v5'],
      jd: 'Lead the Salesforce practice — pre-sales, delivery oversight, and team building. Deep Salesforce platform expertise plus people leadership.', notes: '', createdAt: now - 16 * day },
  ];

  const candidates: DB['candidates'] = [
    { id: 'c1', reqId: 'REQ-042', name: 'Vikram Nair', vendor: 'Avensys', exp: 8, location: 'Mumbai', ctc: '24 LPA', ectc: '28–30 LPA', notice: '30 days', stage: 'Interview', fit: 'green', interviewRef: 'IV-2261', comment: 'Strong architecture background, direct CISO exposure. Push to interview.', createdAt: now - 3 * day },
    { id: 'c2', reqId: 'REQ-042', name: 'Reema Shah', vendor: 'NextHire', exp: 7, location: 'Bengaluru', ctc: '21 LPA', ectc: '26 LPA', notice: '45 days', stage: 'Shortlisted', fit: 'amber', interviewRef: '', comment: 'Solid but less client-facing exposure.', createdAt: now - 3 * day },
    { id: 'c3', reqId: 'REQ-042', name: 'Aarav Kapoor', vendor: 'NR Consulting', exp: 9, location: 'Hyderabad', ctc: '26 LPA', ectc: '32 LPA', notice: '60 days', stage: 'Reviewed', fit: '', interviewRef: '', comment: 'Long notice period — flag to client.', createdAt: now - 2 * day },
    { id: 'c4', reqId: 'REQ-042', name: 'Priya Menon', vendor: 'Avensys', exp: 6, location: 'Pune', ctc: '18 LPA', ectc: '24 LPA', notice: 'Immediate', stage: 'Received', fit: '', interviewRef: '', comment: '', createdAt: now - 1 * day },
    { id: 'c5', reqId: 'REQ-039', name: 'Sneha Iyer', vendor: 'NextHire', exp: 8, location: 'Bengaluru', ctc: '22 LPA', ectc: '30 LPA', notice: '60 days', stage: 'Shortlisted', fit: 'green', interviewRef: '', comment: 'Great RAG portfolio.', createdAt: now - 1 * day },
    { id: 'c6', reqId: 'REQ-039', name: 'Karan Malhotra', vendor: 'Supersourcing', exp: 7, location: 'Gurugram', ctc: '20 LPA', ectc: '27 LPA', notice: '90 days', stage: 'Received', fit: '', interviewRef: '', comment: '', createdAt: now - 0.5 * day },
    { id: 'c7', reqId: 'REQ-041', name: 'Arjun Mehta', vendor: 'Sriven Technologies', exp: 9, location: 'Pune', ctc: '28.5 LPA', ectc: '34 LPA', notice: '30 days', stage: 'Shortlisted', fit: 'green', interviewRef: '', comment: 'Databricks certified.', createdAt: now - 2 * day },
  ];

  const activity: DB['activity'] = [
    { t: '3 CVs uploaded', d: 'REQ-039 · GenAI Engineer', dot: '#1D9E75', at: now - 20 * 6e4 },
    { t: 'Rate card ready', d: 'REQ-041 · Data Engineer', dot: '#234a86', at: now - 60 * 6e4 },
    { t: 'MSA executed', d: 'Sriven Technologies', dot: '#178a64', at: now - 3 * 36e5 },
    { t: 'Requirement raised', d: 'REQ-038 · Salesforce Practice Lead', dot: '#6d5cc4', at: now - 5 * 36e5 },
  ];

  return { requirements, vendors, candidates, activity };
}
