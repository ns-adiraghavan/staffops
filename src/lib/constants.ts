import type { ReqStatus, Stage } from '../types';

export const ACTIVE_STATUSES: ReqStatus[] = ['Open', 'Rate Card Ready', 'Vendors Contacted', 'Candidates Received'];
export const STATUSES: ReqStatus[] = ['Open', 'Rate Card Ready', 'Vendors Contacted', 'Candidates Received', 'On Hold', 'Filled', 'Closed'];
export const LEVELS = ['Junior', 'Standard', 'Specialist', 'Senior', 'Lead', 'Principal', 'Director'];

export const STAGES: Stage[] = ['Received', 'Reviewed', 'Shortlisted', 'Interview', 'Report', 'Accepted', 'Rejected'];
export const STAGE_LABEL: Record<Stage, string> = {
  Received: 'Received',
  Reviewed: 'Reviewed',
  Shortlisted: 'Shortlisted',
  Interview: 'Interview Sent',
  Report: 'Report Received',
  Accepted: 'Accepted',
  Rejected: 'Rejected',
};
export const stageLabel = (s: Stage) => STAGE_LABEL[s];

export const STATUS_CLASS: Record<ReqStatus, string> = {
  'Open': 's-open',
  'Rate Card Ready': 's-rcr',
  'Vendors Contacted': 's-vc',
  'Candidates Received': 's-cr',
  'On Hold': 's-hold',
  'Filled': 's-filled',
  'Closed': 's-closed',
};

export const FIT_LABEL: Record<string, string> = { green: '● Strong fit', amber: '● Possible', '': '○ Unrated' };
export const FIT_DOT: Record<string, string> = { green: 'var(--teal)', amber: 'var(--amber-a)', red: 'var(--red)' };

export const initials = (n: string) =>
  (n || '?')
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export function ago(ms: number): string {
  const s = (Date.now() - ms) / 1000;
  if (s < 3600) return Math.max(1, Math.round(s / 60)) + ' min ago';
  if (s < 86400) return Math.round(s / 3600) + ' h ago';
  const d = Math.round(s / 86400);
  return d === 1 ? 'Yesterday' : d + ' d ago';
}

export const fmtDate = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
