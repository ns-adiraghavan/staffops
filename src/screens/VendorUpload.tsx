import { useState } from 'react';
import { useApp } from '../app-context';
import { useDB, reqById, vendorById, addCandidate, loadDemo } from '../data/store';
import { Topbar, EmptyState, FilePick } from '../components/ui';
import { API_ON, uploadFile } from '../lib/api';

// Preview of the token-based vendor upload page — this is exactly what a
// vendor sees at their unique link. Submitting adds a real candidate to the
// selected requirement (marked as vendor-submitted).
export function VendorUpload() {
  const { toast, openModal } = useApp();
  const db = useDB();
  const [reqId, setReqId] = useState(db.requirements[0]?.id ?? '');
  const [vendorId, setVendorId] = useState(db.vendors[0]?.id ?? '');
  const [form, setForm] = useState({ name: '', exp: '', loc: '', ctc: '', ectc: '', notice: '' });
  const [file, setFile] = useState<File | null>(null);
  const set = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  if (db.requirements.length === 0 || db.vendors.length === 0) {
    return (
      <>
        <Topbar title="Vendor Upload Page" sub="What a vendor sees at their unique link" />
        <div className="content">
          <EmptyState
            title="Add a requirement and a vendor first"
            sub="The vendor view is generated per requirement × vendor pair, so you need at least one of each. Load the demo dataset to preview it instantly."
            primary={<button className="btn btn-primary" onClick={loadDemo}>▷ Load demo data</button>}
          />
        </div>
      </>
    );
  }

  const r = reqById(reqId) || db.requirements[0];
  const v = vendorById(vendorId) || db.vendors[0];

  const submit = async () => {
    if (!form.name.trim()) return toast('Enter a candidate name');
    let resumeFileId: string | undefined;
    if (file && API_ON) {
      const up = await uploadFile(file);
      if (up) resumeFileId = up.id;
    }
    addCandidate(
      r.id,
      { name: form.name.trim(), vendor: v.name, exp: +form.exp || 0, location: form.loc.trim() || '—', ctc: form.ctc.trim() || '—', ectc: form.ectc.trim() || '—', notice: form.notice.trim() || '—', stage: 'Received', fit: '', interviewRef: '', comment: '', resumeName: file?.name, resumeFileId },
      { fromVendor: true }
    );
    toast(`${form.name.trim()} submitted to ${r.id}`);
    setForm({ name: '', exp: '', loc: '', ctc: '', ectc: '', notice: '' });
    setFile(null);
  };

  return (
    <>
      <Topbar title="Vendor Upload Page" sub="What a vendor sees at their unique link — no login" />
      <div className="content">
        <div className="card card-bd" style={{ marginBottom: 18 }}>
          <div className="lbl">Preview as</div>
          <div className="toolbar">
            <div className="grow"><select value={reqId} onChange={(e) => setReqId(e.target.value)}>{db.requirements.map((x) => <option key={x.id} value={x.id}>{x.id} · {x.role}</option>)}</select></div>
            <div className="grow"><select value={vendorId} onChange={(e) => setVendorId(e.target.value)}>{db.vendors.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
          </div>
          <div className="hint" style={{ marginTop: 10 }}>
            Each requirement × vendor pair gets its own unguessable link. A vendor opens it with no login and can submit — but can never read back or list any submission, not even their own. Submitting below adds a real candidate to <b>{r.id}</b>.
          </div>
        </div>
        <div className="upload-shell">
          <div className="upload-card">
            <div className="upload-hd">
              <div className="eyebrow">NS StaffOps · Candidate Submission</div>
              <h2>{r.role} — profiles</h2>
              <p>{r.id} · Submitted by: {v.name}</p>
            </div>
            <div className="card-bd">
              <div className="warn" style={{ marginBottom: 16 }}>Submit one candidate at a time. Use the same link to submit more. You can only see your own submissions.</div>
              <div className="field"><label className="lbl">Candidate full name</label><input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Rahul Sharma" /></div>
              <div className="field"><label className="lbl">Résumé / CV</label><FilePick file={file} onPick={setFile} /></div>
              <div className="grid2">
                <div className="field"><label className="lbl">Years of experience</label><input type="number" value={form.exp} onChange={(e) => set('exp', e.target.value)} placeholder="e.g. 6" /></div>
                <div className="field"><label className="lbl">Location</label><input value={form.loc} onChange={(e) => set('loc', e.target.value)} placeholder="e.g. Bengaluru" /></div>
              </div>
              <div className="grid2">
                <div className="field"><label className="lbl">Current CTC (LPA)</label><input value={form.ctc} onChange={(e) => set('ctc', e.target.value)} placeholder="e.g. 22 LPA" /></div>
                <div className="field"><label className="lbl">Expected CTC (LPA)</label><input value={form.ectc} onChange={(e) => set('ectc', e.target.value)} placeholder="e.g. 30 LPA" /></div>
              </div>
              <div className="grid2">
                <div className="field"><label className="lbl">Notice period</label><input value={form.notice} onChange={(e) => set('notice', e.target.value)} placeholder="e.g. 30 days" /></div>
                <div className="field"><label className="lbl">Your firm</label><input value={v.name} readOnly style={{ background: 'var(--soft)', color: 'var(--muted)' }} /></div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', height: 42 }} onClick={submit}>Submit candidate →</button>
              <p className="hint" style={{ textAlign: 'center', marginTop: 12 }}>Powered by NS StaffOps · staffing@netscribes.com</p>
            </div>
          </div>
        </div>
        <div className="hint" style={{ marginTop: 14, maxWidth: 640 }}>
          Note: résumé files aren’t stored yet in this beta — the filename is captured and the candidate is created. File bytes attach to the requirement’s Drive folder once the storage backend lands.
        </div>
      </div>
    </>
  );
}
