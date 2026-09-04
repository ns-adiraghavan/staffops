import { useEffect, useState } from 'react';
import { useApp } from '../app-context';
import { useDB, candsFor } from '../data/store';
import { Topbar } from '../components/ui';
import { generateJD, type JDInput } from '../lib/jd';
import { redact, generateAnonDocx, type RedactKey } from '../lib/anonymise';
import { saveBlob, copyRichTable } from '../lib/download';
import { STAGES, STAGE_LABEL } from '../lib/constants';

const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);
const csv = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

export function Generate() {
  const { intent, clearIntent } = useApp();
  return (
    <>
      <Topbar title="Generate" sub="JD drafting, resume anonymisation, client packages" />
      <div className="content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 18, alignItems: 'start' }}>
          <JDTool />
          <AnonTool />
          <PackageTool intent={intent} clearIntent={clearIntent} />
        </div>
      </div>
    </>
  );
}

function CardHead({ code, title, sub }: { code: string; title: string; sub: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <div style={{ width: 40, height: 40, borderRadius: 9, background: 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--navy)', fontSize: code.length > 2 ? 11 : 12 }}>{code}</div>
      <div><div style={{ fontWeight: 700, fontSize: 14.5 }}>{title}</div><div className="hint">{sub}</div></div>
    </div>
  );
}

/* ---------- JD ---------- */
function JDTool() {
  const { toast } = useApp();
  const [f, setF] = useState({ role: '', level: '', loc: '', eng: 'Contract', fmt: 'A' as 'A' | 'B', skills: '', resp: '', overview: '', required: '' });
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!f.role.trim()) return toast('Enter a role title');
    setBusy(true);
    try {
      const jd: JDInput = {
        role: f.role.trim(), level: f.level.trim(), functionPillar: 'Engineering & Innovation',
        location: f.loc.trim(), experience: '', employmentType: f.eng === 'FTE' ? 'Full-time, Permanent' : 'Contract',
        overview: f.overview.trim(), responsibilities: lines(f.resp), required: lines(f.required),
        preferred: [], offers: [], skills: csv(f.skills), niceToHave: [], whatSuccess: [],
      };
      const blob = await generateJD(f.fmt, jd);
      saveBlob(blob, `NS_JD_${f.role.replace(/\s+/g, '_')}_Format${f.fmt}.docx`);
      toast('JD .docx generated');
    } catch (e) {
      toast('JD generation failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card card-bd" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CardHead code="JD" title="Job Description" sub="Real Format A / B .docx · no AI" />
      <div className="grid2">
        <div className="field" style={{ margin: 0 }}><div className="lbl">Role title</div><input value={f.role} onChange={(e) => set('role', e.target.value)} placeholder="e.g. Data Engineer" /></div>
        <div className="field" style={{ margin: 0 }}><div className="lbl">Level</div><input value={f.level} onChange={(e) => set('level', e.target.value)} placeholder="e.g. Lead" /></div>
      </div>
      <div className="grid2">
        <div className="field" style={{ margin: 0 }}><div className="lbl">Location</div><input value={f.loc} onChange={(e) => set('loc', e.target.value)} placeholder="e.g. Mumbai / Hybrid" /></div>
        <div className="field" style={{ margin: 0 }}><div className="lbl">Engagement</div><select value={f.eng} onChange={(e) => set('eng', e.target.value)}><option>Contract</option><option>FTE</option></select></div>
      </div>
      <div className="field" style={{ margin: 0 }}><div className="lbl">Format</div><select value={f.fmt} onChange={(e) => set('fmt', e.target.value)}><option value="A">Format A — Branded external</option><option value="B">Format B — Agency mandate</option></select></div>
      <div className="field" style={{ margin: 0 }}><div className="lbl">Role overview (one paragraph per line)</div><textarea rows={2} value={f.overview} onChange={(e) => set('overview', e.target.value)} placeholder="Short prose overview of the role" /></div>
      <div className="field" style={{ margin: 0 }}><div className="lbl">Key responsibilities (one per line)</div><textarea rows={3} value={f.resp} onChange={(e) => set('resp', e.target.value)} placeholder={'Technical leadership: own the data platform\nBuild and maintain ETL pipelines'} /></div>
      <div className="field" style={{ margin: 0 }}><div className="lbl">Required qualifications (one per line)</div><textarea rows={2} value={f.required} onChange={(e) => set('required', e.target.value)} placeholder={'8+ years in data engineering\nStrong Python and PySpark'} /></div>
      <div className="field" style={{ margin: 0 }}><div className="lbl">Must-have skills (comma-separated)</div><input value={f.skills} onChange={(e) => set('skills', e.target.value)} placeholder="Python, PySpark, Airflow, AWS" /></div>
      <button className="btn btn-primary" disabled={busy} onClick={run}>{busy ? 'Generating…' : 'Generate JD (.docx)'}</button>
    </div>
  );
}

/* ---------- Anonymiser ---------- */
const REDACT_OPTS: [RedactKey, string][] = [
  ['name', 'Candidate name'],
  ['email', 'Email addresses'],
  ['phone', 'Phone numbers'],
  ['company', 'Company / employer names'],
  ['links', 'Links & URLs'],
  ['address', 'Street address'],
];
function AnonTool() {
  const { toast } = useApp();
  const [name, setName] = useState('');
  const [companies, setCompanies] = useState('');
  const [text, setText] = useState('');
  const [strip, setStrip] = useState<Record<RedactKey, boolean>>({ name: true, email: true, phone: true, company: true, links: true, address: true });
  const [result, setResult] = useState<{ text: string; count: number } | null>(null);

  const run = () => {
    if (!text.trim()) return toast('Paste some CV text first');
    const r = redact(text, { name, companies: csv(companies), strip });
    setResult(r);
    toast(`${r.count} item${r.count === 1 ? '' : 's'} redacted`);
  };
  const dl = async () => {
    if (!result) return;
    const blob = await generateAnonDocx(result.text, []);
    saveBlob(blob, 'NS_Candidate_anon.docx');
    toast('Anonymised .docx downloaded');
  };

  return (
    <div className="card card-bd" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CardHead code="CV" title="Anonymise CV" sub="Rules-based · you choose what to strip" />
      <div className="field" style={{ margin: 0 }}><div className="lbl">Candidate name (helps redaction)</div><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahul Sharma" /></div>
      <div className="field" style={{ margin: 0 }}><div className="lbl">Company names to strip (comma-separated, optional)</div><input value={companies} onChange={(e) => setCompanies(e.target.value)} placeholder="Infosys, TCS, Barclays" /></div>
      <div className="field" style={{ margin: 0 }}><div className="lbl">Paste CV text</div><textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the resume text here…" /></div>
      <div>
        <div className="lbl">Redact these details</div>
        {REDACT_OPTS.map(([k, label]) => (
          <label className="chk" key={k}><input type="checkbox" checked={strip[k]} onChange={(e) => setStrip((s) => ({ ...s, [k]: e.target.checked }))} /> {label}</label>
        ))}
      </div>
      <button className="btn btn-primary" onClick={run}>Run anonymiser</button>
      {result && (
        <div>
          <div className="out">{result.text}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(result.text).then(() => toast('Copied'), () => toast('Copy failed'))}>Copy text</button>
            <button className="btn btn-ghost btn-sm" onClick={dl}>Download .docx</button>
            <span className="hint">{result.count} redacted</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Client package ---------- */
function PackageTool({ intent, clearIntent }: { intent: { key: string; value: string } | null; clearIntent: () => void }) {
  const { toast } = useApp();
  const db = useDB();
  const [reqId, setReqId] = useState(db.requirements[0]?.id ?? '');
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [built, setBuilt] = useState<string | null>(null);

  useEffect(() => {
    if (intent?.key === 'pkgReq') { setReqId(intent.value); clearIntent(); }
  }, [intent, clearIntent]);

  const cands = candsFor(reqId);
  useEffect(() => {
    const init: Record<string, boolean> = {};
    cands.forEach((c) => { init[c.id] = STAGES.indexOf(c.stage) >= 2 && c.stage !== 'Rejected'; });
    setPicked(init);
  }, [reqId]); // eslint-disable-line

  const build = () => {
    const chosen = cands.filter((c) => picked[c.id]);
    if (!chosen.length) return toast('Select at least one candidate');
    const r = db.requirements.find((x) => x.id === reqId)!;
    let rows = '';
    chosen.forEach((c, i) => {
      const bg = i % 2 ? '#f4f6fb' : '#fff';
      rows += `<tr style="background:${bg}"><td style="padding:8px 12px;border:1px solid #e3e7ef;font-weight:600;color:#1B3A6B">Candidate ${String.fromCharCode(65 + i)}</td><td style="padding:8px 12px;border:1px solid #e3e7ef">${c.exp} yrs</td><td style="padding:8px 12px;border:1px solid #e3e7ef">${c.location}</td><td style="padding:8px 12px;border:1px solid #e3e7ef">${c.notice}</td><td style="padding:8px 12px;border:1px solid #e3e7ef">${c.ectc}</td></tr>`;
    });
    const table = `<table style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif;font-size:13px"><thead><tr><td colspan="5" style="background:#1B3A6B;color:#fff;padding:10px 12px;font-weight:bold">NS Staff Augmentation — ${r.role} · shortlist</td></tr><tr>${['Profile', 'Experience', 'Location', 'Notice', 'Expected'].map((h) => `<th style="background:#234a86;color:#fff;padding:7px 12px;border:1px solid #142d54;text-align:left;font-size:11px;text-transform:uppercase">${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>`;
    setBuilt(table);
    toast(`Package built — ${chosen.length} candidate${chosen.length > 1 ? 's' : ''}, names hidden`);
  };

  const copy = async () => {
    if (!built) return;
    toast((await copyRichTable(built, built.replace(/<[^>]+>/g, ' '))) ? 'Summary table copied — paste into Outlook' : 'Copy failed');
  };

  return (
    <div className="card card-bd" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CardHead code="PKG" title="Client package" sub="Anonymised summary table for email" />
      <div className="field" style={{ margin: 0 }}><div className="lbl">Requirement</div><select value={reqId} onChange={(e) => setReqId(e.target.value)}>{db.requirements.map((r) => <option key={r.id} value={r.id}>{r.id} · {r.role}</option>)}</select></div>
      <div>
        <div className="lbl">Candidates</div>
        {cands.length ? cands.map((c) => (
          <label className="chk" key={c.id}><input type="checkbox" checked={!!picked[c.id]} onChange={(e) => setPicked((p) => ({ ...p, [c.id]: e.target.checked }))} /> {c.name} <span className="hint">· {STAGE_LABEL[c.stage]} · {c.vendor}</span></label>
        )) : <div className="hint">No candidates on this requirement.</div>}
      </div>
      <button className="btn btn-primary" onClick={build}>Build summary table</button>
      {built && (
        <div>
          <div style={{ overflowX: 'auto', border: '1px solid var(--line)', borderRadius: 8 }} dangerouslySetInnerHTML={{ __html: built }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><button className="btn btn-ghost btn-sm" onClick={copy}>Copy table for email</button></div>
        </div>
      )}
    </div>
  );
}
