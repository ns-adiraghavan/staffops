export type ReqStatus =
  | 'Open'
  | 'Rate Card Ready'
  | 'Vendors Contacted'
  | 'Candidates Received'
  | 'On Hold'
  | 'Filled'
  | 'Closed';

export type Stage =
  | 'Received'
  | 'Reviewed'
  | 'Shortlisted'
  | 'Interview'
  | 'Report'
  | 'Accepted'
  | 'Rejected';

export type Priority = 'High' | 'Medium' | 'Low';
export type EngType = 'Contract' | 'FTE';
export type VendorType = 'Contract' | 'FTE' | 'Mixed';
export type Fit = 'green' | 'amber' | 'red' | '';

export interface Requirement {
  id: string;
  role: string;
  client: string;
  level: string;
  expMin: number;
  expMax: number;
  type: EngType;
  priority: Priority;
  status: ReqStatus;
  rateCard: 'Pending' | 'Ready';
  assigned: string;
  raisedBy: string;
  location: string;
  start: string;
  vendors: string[]; // vendor ids
  jd: string;
  notes: string;
  benchmarkId?: string; // correlated Cost Benchmarking designation (closest / custom match)
  createdAt: number;
}

export interface Candidate {
  id: string;
  reqId: string;
  name: string;
  vendor: string; // vendor display name
  exp: number;
  location: string;
  ctc: string;
  ectc: string;
  notice: string;
  stage: Stage;
  fit: Fit;
  interviewRef: string;
  comment: string;
  resumeName?: string; // attached résumé filename
  resumeFileId?: string; // storage id when uploaded to the backend (Drive/file)
  createdAt: number;
}

// Paperwork status per vendor. The NDA applies to everyone; the "agreement"
// is the MSA / Vendor Agreement (C2H agreement for contract vendors,
// Recruitment agreement for FTE vendors — which template is chosen by type).
export type AgreementStatus = 'signed' | 'pending' | 'none';
export interface Paperwork {
  nda: boolean;
  agreement: AgreementStatus;
  note: string; // free-text detail, e.g. "Executed Aug 7, 2026"
}

export interface Vendor {
  id: string;
  name: string;
  type: VendorType;
  fit: Exclude<Fit, ''>;
  contact: string;
  email: string;
  tags: string[];
  notes: string;
  paperwork?: Paperwork;
}

export interface Activity {
  t: string;
  d: string;
  dot: string;
  at: number;
}

export interface DB {
  requirements: Requirement[];
  vendors: Vendor[];
  candidates: Candidate[];
  activity: Activity[];
}
