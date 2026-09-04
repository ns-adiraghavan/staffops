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
  createdAt: number;
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
