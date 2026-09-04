import { useState } from 'react';
import { useApp } from '../app-context';
import { Modal, Field, FilePick } from './ui';
import { getDB, addRequirement, updateRequirement, addCandidate, updateCandidate, deleteCandidate, addVendor, updateVendor } from '../data/store';
import { LEVELS, STATUSES, STAGES, STAGE_LABEL } from '../lib/constants';
import type { Requirement, Candidate, Vendor, EngType, Priority, ReqStatus, Stage, Fit, VendorType, AgreementStatus } from '../types';
import { API_ON, uploadFile, fileUrl } from '../lib/api';

/* ---------- Requirement ---------- */
export function RequirementForm({ existing }: { existing?: Requirement }) {
  const { closeModal, toast, navigate } = useApp();
  const db = getDB();
  const [f, setF] = useState({
    role: existing?.role ?? '',
    client: existing?.client ?? '',
    level: existing?.level ?? 'Standard',
    expMin: existing?.expMin ?? 2,
    expMax: existing?.expMax ?? 5,
    type: (existing?.type ?? 'Contract') as EngType,
    priority: (existing?.priority ?? 'Medium') as Priority,
    status: (existing?.status ?? 'Open') as ReqStatus,
    rateCard: (existing?.rateCard ?? 'Pending') as 'Pending' | 'Ready',
    assigned: existing?.assigned ?? 'Adi R.',
    raisedBy: existing?.raisedBy ?? 'Adi R.',
    location: existing?.location ?? '',
    start: existing?.start ?? '',
    vendors: existing?.vendors ?? [],
    jd: existing?.jd ?? '',
  });
  const set = (k: string, v: unknown) => setF((s) => ({ ...s, [k]: v }));
  const toggleV = (id: string) => set('vendors', f.vendors.includes(id) ? f.vendors.filter((x) => x !== id) : [...f.vendors, id]);

  const save = () => {
    if (!f.role.trim() || !f.client.trim()) return toast('Role and client are required');
    const data = { ...f, role: f.role.trim(), client: f.client.trim(), expMin: +f.expMin, expMax: +f.expMax };
    if (existing) {
      updateRequirement(existing.id, data);
      closeModal();
      navigate('reqDetail', existing.id);
      toast('Requirement updated');
    } else {
      const id = addRequirement(data);
      closeModal();
      navigate('reqDetail', id);
      toast(id + ' created');
    }
  };

  return (
    <Modal
      title={existing ? 'Edit ' + existing.id : 'New requirement'}
      footer={
        <>
          <button className="btn btn-plain" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>{existing ? 'Save changes' : 'Create requirement'}</button>
        </>
      }
    >
      <div className="grid2" style={{ marginBottom: 14 }}>
        <Field label="Role title *"><input value={f.role} onChange={(e) => set('role', e.target.value)} /></Field>
        <Field label="Client *"><input value={f.client} onChange={(e) => set('client', e.target.value)} /></Field>
      </div>
      <div className="grid3" style={{ marginBottom: 14 }}>
        <Field label="Level"><select value={f.level} onChange={(e) => set('level', e.target.value)}>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select></Field>
        <Field label="Exp min"><input type="number" value={f.expMin} onChange={(e) => set('expMin', e.target.value)} /></Field>
        <Field label="Exp max"><input type="number" value={f.expMax} onChange={(e) => set('expMax', e.target.value)} /></Field>
      </div>
      <div className="grid3" style={{ marginBottom: 14 }}>
        <Field label="Type"><select value={f.type} onChange={(e) => set('type', e.target.value)}><option>Contract</option><option>FTE</option></select></Field>
        <Field label="Priority"><select value={f.priority} onChange={(e) => set('priority', e.target.value)}>{['High', 'Medium', 'Low'].map((p) => <option key={p}>{p}</option>)}</select></Field>
        <Field label="Status"><select value={f.status} onChange={(e) => set('status', e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></Field>
      </div>
      <div className="grid3" style={{ marginBottom: 14 }}>
        <Field label="Assigned to"><input value={f.assigned} onChange={(e) => set('assigned', e.target.value)} /></Field>
        <Field label="Raised by"><input value={f.raisedBy} onChange={(e) => set('raisedBy', e.target.value)} /></Field>
        <Field label="Rate card"><select value={f.rateCard} onChange={(e) => set('rateCard', e.target.value)}><option>Pending</option><option>Ready</option></select></Field>
      </div>
      <div className="grid2" style={{ marginBottom: 14 }}>
        <Field label="Location"><input value={f.location} onChange={(e) => set('location', e.target.value)} /></Field>
        <Field label="Target start"><input value={f.start} onChange={(e) => set('start', e.target.value)} /></Field>
      </div>
      <div className="field">
        <label className="lbl">Assign vendors</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: 120, overflow: 'auto', border: '1px solid var(--line)', borderRadius: 8, padding: 10 }}>
          {db.vendors.map((v) => (
            <label className="chk" key={v.id} style={{ padding: 0, width: 'calc(50% - 4px)' }}>
              <input type="checkbox" checked={f.vendors.includes(v.id)} onChange={() => toggleV(v.id)} /> {v.name}
            </label>
          ))}
        </div>
      </div>
      <Field label="Job description"><textarea rows={3} value={f.jd} onChange={(e) => set('jd', e.target.value)} /></Field>
    </Modal>
  );
}

/* ---------- Candidate ---------- */
export function CandidateForm({ reqId, existing }: { reqId: string; existing?: Candidate }) {
  const { closeModal, toast, navigate } = useApp();
  const db = getDB();
  const [f, setF] = useState({
    name: existing?.name ?? '',
    vendor: existing?.vendor ?? db.vendors[0]?.name ?? '',
    exp: existing?.exp ?? 0,
    location: existing?.location ?? '',
    ctc: existing?.ctc ?? '',
    ectc: existing?.ectc ?? '',
    notice: existing?.notice ?? '',
    stage: (existing?.stage ?? 'Received') as Stage,
    fit: (existing?.fit ?? '') as Fit,
    interviewRef: existing?.interviewRef ?? '',
    comment: existing?.comment ?? '',
  });
  const [file, setFile] = useState<File | null>(null);
  const set = (k: string, v: unknown) => setF((s) => ({ ...s, [k]: v }));

  const save = async () => {
    if (!f.name.trim()) return toast('Name is required');
    let resumeFileId = existing?.resumeFileId;
    if (file && API_ON) {
      const up = await uploadFile(file);
      if (up) resumeFileId = up.id;
    }
    const data = { ...f, name: f.name.trim(), exp: +f.exp, location: f.location.trim() || '—', ctc: f.ctc.trim() || '—', ectc: f.ectc.trim() || '—', notice: f.notice.trim() || '—', resumeName: file?.name ?? existing?.resumeName, resumeFileId };
    if (existing) updateCandidate(existing.id, data);
    else addCandidate(reqId, data);
    closeModal();
    navigate('reqDetail', reqId);
    toast(existing ? 'Candidate updated' : f.name + ' added');
  };

  return (
    <Modal
      title={existing ? 'Edit candidate' : 'Add candidate'}
      footer={
        <>
          {existing && (
            <button className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={() => { deleteCandidate(existing.id); closeModal(); navigate('reqDetail', reqId); toast('Candidate removed'); }}>Delete</button>
          )}
          <button className="btn btn-plain" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>{existing ? 'Save' : 'Add candidate'}</button>
        </>
      }
    >
      <div className="grid2" style={{ marginBottom: 14 }}>
        <Field label="Name *"><input value={f.name} onChange={(e) => set('name', e.target.value)} /></Field>
        <Field label="Vendor"><input list="vendor-names" value={f.vendor} onChange={(e) => set('vendor', e.target.value)} placeholder="Vendor name" /><datalist id="vendor-names">{db.vendors.map((v) => <option key={v.id} value={v.name} />)}</datalist></Field>
      </div>
      <div className="field" style={{ marginBottom: 14 }}>
        <label className="lbl">Résumé / CV</label>
        <FilePick file={file} onPick={setFile} />
        {!file && existing?.resumeName && (
          <div className="hint" style={{ marginTop: 6 }}>
            Current: {existing.resumeName}
            {existing.resumeFileId && <> · <a href={fileUrl(existing.resumeFileId)} target="_blank" rel="noreferrer">download</a></>}
          </div>
        )}
      </div>
      <div className="grid3" style={{ marginBottom: 14 }}>
        <Field label="Experience (yrs)"><input type="number" value={f.exp} onChange={(e) => set('exp', e.target.value)} /></Field>
        <Field label="Location"><input value={f.location} onChange={(e) => set('location', e.target.value)} /></Field>
        <Field label="Notice"><input value={f.notice} onChange={(e) => set('notice', e.target.value)} /></Field>
      </div>
      <div className="grid2" style={{ marginBottom: 14 }}>
        <Field label="Current CTC"><input value={f.ctc} onChange={(e) => set('ctc', e.target.value)} /></Field>
        <Field label="Expected CTC"><input value={f.ectc} onChange={(e) => set('ectc', e.target.value)} /></Field>
      </div>
      <div className="grid3" style={{ marginBottom: 14 }}>
        <Field label="Stage"><select value={f.stage} onChange={(e) => set('stage', e.target.value)}>{STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}</select></Field>
        <Field label="Fit flag"><select value={f.fit} onChange={(e) => set('fit', e.target.value)}><option value="">Unrated</option><option value="green">Strong</option><option value="amber">Possible</option></select></Field>
        <Field label="Interview ref"><input value={f.interviewRef} onChange={(e) => set('interviewRef', e.target.value)} /></Field>
      </div>
      <Field label="Internal comment (never shown to vendor)"><textarea rows={2} value={f.comment} onChange={(e) => set('comment', e.target.value)} /></Field>
    </Modal>
  );
}

/* ---------- Vendor ---------- */
export function VendorForm({ existing }: { existing?: Vendor }) {
  const { closeModal, toast, navigate } = useApp();
  const [f, setF] = useState({
    name: existing?.name ?? '',
    type: (existing?.type ?? 'Mixed') as VendorType,
    contact: existing?.contact ?? '',
    email: existing?.email ?? '',
    fit: (existing?.fit ?? 'green') as Exclude<Fit, ''>,
    tags: (existing?.tags ?? []).join(', '),
    notes: existing?.notes ?? '',
  });
  const [pw, setPw] = useState<{ nda: boolean; agreement: AgreementStatus; note: string }>({
    nda: existing?.paperwork?.nda ?? false,
    agreement: existing?.paperwork?.agreement ?? 'none',
    note: existing?.paperwork?.note ?? '',
  });
  const set = (k: string, v: unknown) => setF((s) => ({ ...s, [k]: v }));
  const setP = (k: 'nda' | 'agreement' | 'note', v: unknown) => setPw((s) => ({ ...s, [k]: v }));

  const save = () => {
    if (!f.name.trim()) return toast('Vendor name is required');
    const data = { name: f.name.trim(), type: f.type, contact: f.contact.trim(), email: f.email.trim(), fit: f.fit, tags: f.tags.split(',').map((s) => s.trim()).filter(Boolean), notes: f.notes.trim(), paperwork: pw };
    if (existing) updateVendor(existing.id, data);
    else addVendor(data);
    closeModal();
    navigate('vendors');
    toast(existing ? 'Vendor updated' : f.name + ' added');
  };

  return (
    <Modal
      title={existing ? 'Edit ' + existing.name : 'Add vendor'}
      footer={
        <>
          <button className="btn btn-plain" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>{existing ? 'Save' : 'Add vendor'}</button>
        </>
      }
    >
      <div className="grid2" style={{ marginBottom: 14 }}>
        <Field label="Vendor name *"><input value={f.name} onChange={(e) => set('name', e.target.value)} /></Field>
        <Field label="Type"><select value={f.type} onChange={(e) => set('type', e.target.value)}>{['Mixed', 'Contract', 'FTE'].map((t) => <option key={t}>{t}</option>)}</select></Field>
      </div>
      <div className="grid2" style={{ marginBottom: 14 }}>
        <Field label="Contact person"><input value={f.contact} onChange={(e) => set('contact', e.target.value)} /></Field>
        <Field label="Email"><input value={f.email} onChange={(e) => set('email', e.target.value)} /></Field>
      </div>
      <div className="grid2" style={{ marginBottom: 14 }}>
        <Field label="Fit"><select value={f.fit} onChange={(e) => set('fit', e.target.value)}>{['green', 'amber', 'red'].map((x) => <option key={x} value={x}>{x[0].toUpperCase() + x.slice(1)}</option>)}</select></Field>
        <Field label="Tags (comma-separated)"><input value={f.tags} onChange={(e) => set('tags', e.target.value)} /></Field>
      </div>
      <Field label="Engagement notes"><textarea rows={3} value={f.notes} onChange={(e) => set('notes', e.target.value)} /></Field>
      <div style={{ marginTop: 14 }}>
        <label className="lbl">Paperwork status</label>
        <label className="chk"><input type="checkbox" checked={pw.nda} onChange={() => setP('nda', !pw.nda)} /> Vendor NDA signed</label>
        <div className="grid2" style={{ marginTop: 8 }}>
          <Field label={f.type === 'FTE' ? 'Recruitment agreement' : 'MSA / vendor agreement'}>
            <select value={pw.agreement} onChange={(e) => setP('agreement', e.target.value as AgreementStatus)}>
              <option value="signed">Signed</option>
              <option value="pending">Pending</option>
              <option value="none">None on record</option>
            </select>
          </Field>
          <Field label="Status note"><input value={pw.note} onChange={(e) => setP('note', e.target.value)} placeholder="e.g. Executed Aug 7, 2026" /></Field>
        </div>
      </div>
    </Modal>
  );
}
