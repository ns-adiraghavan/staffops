import { useApp } from '../app-context';
import { useDB } from '../data/store';
import { Topbar } from '../components/ui';
import { VendorForm } from '../components/forms';
import { STAGES, FIT_DOT } from '../lib/constants';

export function Vendors() {
  const { openModal } = useApp();
  const db = useDB();
  const greenCount = db.vendors.filter((v) => v.fit === 'green').length;

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
