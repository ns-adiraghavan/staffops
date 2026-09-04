import { useState } from 'react';
import { useApp } from '../app-context';
import { useDB, reqById, vendorById, addCandidate } from '../data/store';
import { Topbar } from '../components/ui';

// Preview of the token-based vendor upload page. Submitting adds a real
// candidate to the selected requirement (marked as vendor-submitted).
export function VendorUpload() {
  const { toast } = useApp();
  const db = useDB();
  const [reqId, setReqId] = useState(db.requirements[0]?.id ?? '');
  const [vendorId, setVendorId] = useState(db.vendors[0]?.id ?? '');
  const [form, setForm] = useState({ name: '', exp: '', loc: '', ctc: '', ectc: '', notice: '' });
  const set = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const r = reqById(reqId) || db.requirements[0];
  const v = vendorById(vendorId) || db.vendors[0];

  const submit = () => {
    if (!form.name.trim()) return toast('Enter a candidate name');
    addCandidate(
      r.id,
      { name: form.name.trim(), vendor: v.name, exp: +form.exp || 0, location: form.loc.trim() || '—', ctc: form.ctc.trim() || '—', ectc: form.ectc.trim() || '—', notice: form.notice.trim() || '—', stage: 'Received', fit: '', interviewRef: '', comment: '' },
      { fromVendor: true }
    );
    toast(`${form.name.trim()} submitted to ${r.id}`);
    setForm({ name: '', exp: '', loc: '', ctc: '', ectc: '', notice: '' });
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
              <div className="field"><label className="lbl">Resume / CV</label><div className="dropzone">Click to upload PDF or DOCX<br /><span style={{ fontSize: 11 }}>or drag and drop</span></div></div>
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
      </div>
    </>
  );
}
