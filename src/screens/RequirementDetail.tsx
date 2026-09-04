import { useState } from 'react';
import { useApp } from '../app-context';
import { useDB, reqById, candsFor, vendorById, setStage, setReqNote, updateRequirement } from '../data/store';
import { Topbar } from '../components/ui';
import { RequirementForm, CandidateForm } from '../components/forms';
import { STAGES, STAGE_LABEL, STATUS_CLASS, FIT_LABEL, initials, stageLabel } from '../lib/constants';
import { fileUrl } from '../lib/api';
import type { Stage } from '../types';

export function RequirementDetail() {
  const { route, navigate, openModal, toast, setIntent } = useApp();
  const db = useDB();
  const r = reqById(route.param || '');
  const [note, setNote] = useState(r?.notes ?? '');

  if (!r) {
    navigate('requirements');
    return null;
  }

  const cands = candsFor(r.id).slice().sort((a, b) => STAGES.indexOf(b.stage) - STAGES.indexOf(a.stage));

  const goPackage = () => { setIntent('pkgReq', r.id); navigate('generate'); };
  const goAnon = () => { navigate('generate'); toast('Paste a shortlisted CV to anonymise'); };

  return (
    <>
      <Topbar
        title={r.role}
        sub={`${r.id} · ${r.client} · raised by ${r.raisedBy}`}
        actions={
          <>
            <button className="btn btn-plain btn-sm" onClick={() => navigate('requirements')}>← Requirements</button>
            <button className="btn btn-navy btn-sm" onClick={() => openModal(<RequirementForm existing={r} />)}>Edit</button>
            <button className="btn btn-primary btn-sm" onClick={goPackage}>Build client package</button>
          </>
        }
      />
      <div className="content">
        <div className="split">
          <div className="col">
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-hd">
                <span className="h">Candidates <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({cands.length})</span></span>
                <button className="btn btn-navy btn-sm" onClick={() => openModal(<CandidateForm reqId={r.id} />)}>+ Add candidate</button>
              </div>
              {cands.length ? cands.map((c) => (
                <div className="cand-row" key={c.id}>
                  <div className="cand-av">{initials(c.name)}</div>
                  <div style={{ minWidth: 0 }}>
                    <div className="cand-nm">{c.name}</div>
                    <div className="cand-mt">{c.exp} yrs · {c.location} · {c.ctc}→{c.ectc} · {c.notice} · via {c.vendor}{c.resumeName ? (c.resumeFileId ? <> · <a href={fileUrl(c.resumeFileId)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>CV</a></> : ' · CV attached') : ''}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span className={'fit fit-' + (c.fit || 'none')}>{FIT_LABEL[c.fit || '']}</span>
                    <select value={c.stage} onChange={(e) => setStage(c.id, e.target.value as Stage, stageLabel)} style={{ width: 'auto', fontSize: 12, fontWeight: 600, padding: '5px 8px' }}>
                      {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
                    </select>
                    <button className="btn btn-ghost btn-sm" onClick={() => openModal(<CandidateForm reqId={r.id} existing={c} />)}>Details</button>
                  </div>
                </div>
              )) : <div className="empty">No candidates yet — add one manually or share a vendor upload link</div>}
              <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-ghost btn-sm" onClick={goPackage}>Build client package</button>
                <button className="btn btn-ghost btn-sm" onClick={goAnon}>Anonymise shortlisted</button>
              </div>
            </div>
            <div className="card card-bd">
              <div className="lbl">Job Description</div>
              <div style={{ fontSize: 13, lineHeight: 1.65 }}>{r.jd}</div>
            </div>
          </div>

          <div className="col">
            <div className="card card-bd">
              <div className="lbl">Details</div>
              {([
                ['Client', r.client], ['Level', r.level], ['Experience', `${r.expMin}–${r.expMax} yrs`],
                ['Location', r.location], ['Target start', r.start],
              ] as [string, string][]).map(([k, v]) => (
                <div className="info-row" key={k}><span className="info-k">{k}</span><span className="info-v">{v}</span></div>
              ))}
              <div className="info-row"><span className="info-k">Type</span><span className="info-v"><span className={'tag tag-' + r.type}>{r.type}</span></span></div>
              <div className="info-row"><span className="info-k">Priority</span><span className="info-v"><span className={'pill p-' + r.priority}>{r.priority}</span></span></div>
              <div className="info-row"><span className="info-k">Status</span><span className="info-v"><span className={'pill ' + STATUS_CLASS[r.status]}>{r.status}</span></span></div>
              <div className="info-row"><span className="info-k">Rate card</span><span className="info-v" style={{ color: r.rateCard === 'Ready' ? 'var(--teal-d)' : 'var(--amber-a)' }}>{r.rateCard}</span></div>
              <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 12 }} onClick={() => { setIntent('rcClient', r.client); navigate('ratecard'); }}>
                {r.rateCard === 'Ready' ? 'Open rate card →' : 'Build rate card →'}
              </button>
            </div>

            <div className="card card-bd">
              <div className="lbl">Vendor upload links</div>
              {r.vendors.length ? r.vendors.map((vid) => {
                const v = vendorById(vid);
                if (!v) return null;
                const subs = db.candidates.filter((c) => c.reqId === r.id && c.vendor === v.name).length;
                return (
                  <div className="info-row" key={vid}>
                    <div><div style={{ fontWeight: 600, fontSize: 12.5 }}>{v.name}</div><div className="mono" style={{ fontSize: 10.5, color: 'var(--teal-d)' }}>staffops.ns.in/u/{v.id}{r.id.replace(/\D/g, '')}…</div></div>
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: 11, fontWeight: 600, color: subs ? 'var(--teal-d)' : 'var(--muted)' }}>{subs ? '✓ ' + subs + ' sub' : 'Not sent'}</div></div>
                  </div>
                );
              }) : <div className="hint">No vendors assigned yet.</div>}
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 10 }} onClick={() => openModal(<RequirementForm existing={r} />)}>Assign vendors</button>
              <button className="btn btn-plain btn-sm" style={{ width: '100%', marginTop: 6 }} onClick={() => navigate('upload')}>Preview vendor upload page →</button>
            </div>

            <div className="card card-bd">
              <div className="lbl">Internal notes</div>
              <textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} style={{ resize: 'vertical' }} />
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 8 }} onClick={() => { setReqNote(r.id, note); toast('Note saved'); }}>Save note</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
