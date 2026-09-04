import { useSyncExternalStore } from 'react';
import type { DB, Requirement, Candidate, Vendor, Stage } from '../types';
import { seed } from './seed';

/*
 * Storage layer.
 *
 * The whole app reads through `useDB()` and writes through the mutation
 * helpers below. Today that's backed by localStorage. When the Phase-1
 * backend lands (Express API + Google Drive JSON per the PRD), this is the
 * ONE file to change: keep the same exported functions, but have them call
 * the API and refresh `db` from the server response. No screen imports
 * localStorage directly, so the UI does not change.
 */

const KEY = 'ns_staffops_beta_v1';

let db: DB = load();
const listeners = new Set<() => void>();

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DB;
  } catch {
    /* ignore */
  }
  const fresh = seed();
  persist(fresh);
  return fresh;
}

function persist(next: DB) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage may be unavailable; state still lives in memory this session */
  }
}

function commit(mutate: (draft: DB) => void) {
  // Clone-on-write keeps React's identity checks honest.
  const next: DB = JSON.parse(JSON.stringify(db));
  mutate(next);
  db = next;
  persist(next);
  listeners.forEach((l) => l());
}

/* ---- read ---- */
export function useDB(): DB {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => db
  );
}
export const getDB = () => db;
export const reqById = (id: string) => db.requirements.find((r) => r.id === id);
export const vendorById = (id: string) => db.vendors.find((v) => v.id === id);
export const candsFor = (id: string) => db.candidates.filter((c) => c.reqId === id);

/* ---- ids & activity ---- */
export function nextReqId(): string {
  let max = 0;
  db.requirements.forEach((r) => {
    const n = parseInt(String(r.id).replace(/\D/g, ''), 10);
    if (n > max) max = n;
  });
  return 'REQ-' + String(max + 1).padStart(3, '0');
}
function log(draft: DB, t: string, d: string, dot = '#6b7588') {
  draft.activity.unshift({ t, d, dot, at: Date.now() });
  draft.activity = draft.activity.slice(0, 30);
}

/* ---- requirements ---- */
export function addRequirement(data: Omit<Requirement, 'id' | 'notes' | 'createdAt'>): string {
  const id = nextReqId();
  commit((d) => {
    d.requirements.unshift({ ...data, id, notes: '', createdAt: Date.now() });
    log(d, 'Requirement raised', `${id} · ${data.role}`, '#6d5cc4');
  });
  return id;
}
export function updateRequirement(id: string, patch: Partial<Requirement>) {
  commit((d) => {
    const r = d.requirements.find((x) => x.id === id);
    if (r) Object.assign(r, patch);
  });
}
export function setReqNote(id: string, notes: string) {
  updateRequirement(id, { notes });
}

/* ---- candidates ---- */
export function addCandidate(reqId: string, data: Omit<Candidate, 'id' | 'reqId' | 'createdAt'>, opts?: { fromVendor?: boolean }) {
  commit((d) => {
    d.candidates.push({ ...data, id: 'c' + Date.now(), reqId, createdAt: Date.now() });
    const v = d.vendors.find((x) => x.name === data.vendor);
    const r = d.requirements.find((x) => x.id === reqId);
    if (r && v && !r.vendors.includes(v.id)) r.vendors.push(v.id);
    if (r && opts?.fromVendor && r.status === 'Open') r.status = 'Candidates Received';
    log(d, opts?.fromVendor ? 'CV submitted' : 'Candidate added', `${reqId} · ${data.name}${opts?.fromVendor ? ' via ' + data.vendor : ''}`, '#1D9E75');
  });
}
export function updateCandidate(id: string, patch: Partial<Candidate>) {
  commit((d) => {
    const c = d.candidates.find((x) => x.id === id);
    if (c) Object.assign(c, patch);
  });
}
export function setStage(id: string, stage: Stage, label: (s: Stage) => string) {
  commit((d) => {
    const c = d.candidates.find((x) => x.id === id);
    if (!c) return;
    const old = c.stage;
    c.stage = stage;
    log(d, 'Stage changed', `${c.name} · ${label(old)} → ${label(stage)}`, '#234a86');
  });
}
export function deleteCandidate(id: string) {
  commit((d) => {
    d.candidates = d.candidates.filter((x) => x.id !== id);
  });
}

/* ---- vendors ---- */
export function addVendor(data: Omit<Vendor, 'id'>) {
  commit((d) => {
    d.vendors.push({ ...data, id: 'v' + Date.now() });
    log(d, 'Vendor added', `${data.name} · ${data.type}`, '#d97706');
  });
}
export function updateVendor(id: string, patch: Partial<Vendor>) {
  commit((d) => {
    const v = d.vendors.find((x) => x.id === id);
    if (v) Object.assign(v, patch);
  });
}

/* ---- reset ---- */
export function resetDemo() {
  commit((d) => {
    const s = seed();
    d.requirements = s.requirements;
    d.vendors = s.vendors;
    d.candidates = s.candidates;
    d.activity = s.activity;
  });
}
