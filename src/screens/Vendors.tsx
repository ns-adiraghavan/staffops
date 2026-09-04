import { useApp } from '../app-context';
import { useDB, loadDemo } from '../data/store';
import { Topbar, EmptyState } from '../components/ui';
import { VendorForm } from '../components/forms';
import { STAGES, FIT_DOT } from '../lib/constants';

export function Vendors() {
  const { openModal } = useApp();
  const db = useDB();
  const greenCount = db.vendors.filter((v) => v.fit === 'green').length;

  if (db.vendors.length === 0) {
    return (
      <>
        <Topbar title="Vendors" sub="No vendors yet" actions={<button className="btn btn-primary" onClick={() => openModal(<VendorForm />)}>+ Add vendor</button>} />
        <div className="content">
          <EmptyState
            title="No vendors yet"
            sub="Add the recruiting vendors you work with — with behavioural tags and a fit rating — or load the demo dataset with the 11 real NS vendors."
            primary={<button className="btn btn-primary" onClick={() => openModal(<VendorForm />)}>+ Add vendor</button>}
            secondary={<button className="btn btn-ghost" onClick={loadDemo}>▷ Load demo data</button>}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar
        title="Vendors"
        sub={`${db.vendors.length} vendors · ${greenCount} green fit`}
        actions={<button className="btn btn-primary" onClick={() => openModal(<VendorForm />)}>+ Add vendor</button>}
      />
      <div className="content">
        <div className="vgrid">
          {db.vendors.map((v) => {
            const cvs = db.candidates.filter((c) => c.vendor === v.name).length;
            const shortlist = db.candidates.filter((c) => c.vendor === v.name && STAGES.indexOf(c.stage) >= 2 && c.stage !== 'Rejected').length;
            const reqs = db.requirements.filter((r) => r.vendors.includes(v.id)).length;
            return (
              <div className="card vcard" key={v.id}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span className="dot" style={{ background: FIT_DOT[v.fit] }} /><span className="vname">{v.name}</span></div>
                  <span className={'tag tag-' + v.type}>{v.type}</span>
                </div>
                <div className="hint">{v.contact ? v.contact + (v.email ? ' · ' + v.email : '') : 'No contact on file'}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{v.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
                <div className="hint" style={{ background: 'var(--soft)', borderRadius: 6, padding: '8px 11px', lineHeight: 1.5 }}>{v.notes}</div>
                {(() => {
                  const pw = v.paperwork ?? { nda: false, agreement: 'none' as const, note: '' };
                  const green = { background: 'var(--teal-l)', color: 'var(--teal-d)' };
                  const amber = { background: 'var(--amber-bg)', color: 'var(--amber)' };
                  const grey = { background: 'var(--soft)', color: 'var(--muted)' };
                  const agLabel = v.type === 'FTE' ? 'Recruitment' : 'MSA';
                  const agChip = pw.agreement === 'signed' ? { s: green, t: `✓ ${agLabel}` } : pw.agreement === 'pending' ? { s: amber, t: `⧗ ${agLabel} pending` } : { s: grey, t: `— ${agLabel}` };
                  return (
                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        <span className="tag" style={pw.nda ? green : amber}>{pw.nda ? '✓ NDA' : '⚠ NDA'}</span>
                        <span className="tag" style={agChip.s}>{agChip.t}</span>
                      </div>
                      {pw.note && <div className="hint" style={{ marginTop: 6 }}>{pw.note}</div>}
                    </div>
                  );
                })()}
                <div className="vstat">
                  <div><div className="n">{cvs}</div><div className="l">CVs</div></div>
                  <div><div className="n">{shortlist}</div><div className="l">Shortlist+</div></div>
                  <div><div className="n" style={{ textTransform: 'capitalize', fontSize: 13, color: FIT_DOT[v.fit] }}>{v.fit}</div><div className="l">Fit</div></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eef1f7', paddingTop: 11 }}>
                  <span className="badge-info">{reqs} active reqs</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => openModal(<VendorForm existing={v} />)}>Edit</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
