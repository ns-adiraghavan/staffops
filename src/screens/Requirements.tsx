import { useState } from 'react';
import { useApp } from '../app-context';
import { useDB, candsFor, loadDemo } from '../data/store';
import { Topbar, EmptyState } from '../components/ui';
import { RequirementForm } from '../components/forms';
import { ACTIVE_STATUSES, STATUS_CLASS } from '../lib/constants';

export function Requirements() {
  const { navigate, openModal } = useApp();
  const db = useDB();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  if (db.requirements.length === 0) {
    return (
      <>
        <Topbar title="Requirements" sub="No requirements yet" actions={<button className="btn btn-primary" onClick={() => openModal(<RequirementForm />)}>+ New requirement</button>} />
        <div className="content">
          <EmptyState
            title="No requirements yet"
            sub="Raise your first requirement — paste a client JD or MOM and fill the fields — or load the demo dataset to see the full flow."
            primary={<button className="btn btn-primary" onClick={() => openModal(<RequirementForm />)}>+ New requirement</button>}
            secondary={<button className="btn btn-ghost" onClick={loadDemo}>▷ Load demo data</button>}
          />
        </div>
      </>
    );
  }

  const active = db.requirements.filter((r) => ACTIVE_STATUSES.includes(r.status)).length;
  const pending = db.requirements.filter((r) => r.rateCard === 'Pending' && ACTIVE_STATUSES.includes(r.status)).length;
  const ql = q.toLowerCase();
  const list = db.requirements.filter(
    (r) => (!ql || `${r.role} ${r.client} ${r.id}`.toLowerCase().includes(ql)) && (!status || r.status === status) && (!type || r.type === type)
  );

  return (
    <>
      <Topbar
        title="Requirements"
        sub={`${active} active · ${pending} pending rate card`}
        actions={<button className="btn btn-primary" onClick={() => openModal(<RequirementForm />)}>+ New requirement</button>}
      />
      <div className="content">
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-hd">
            <input placeholder="Search requirements…" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 240 }} />
            <div className="toolbar" style={{ marginLeft: 'auto' }}>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: 'auto' }}>
                {['', 'Open', 'Rate Card Ready', 'Vendors Contacted', 'Candidates Received', 'On Hold', 'Filled', 'Closed'].map((s) => <option key={s} value={s}>{s || 'All status'}</option>)}
              </select>
              <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: 'auto' }}>
                {['', 'Contract', 'FTE'].map((s) => <option key={s} value={s}>{s || 'All types'}</option>)}
              </select>
            </div>
          </div>
          <table>
            <thead className="navy"><tr><th>Requirement</th><th>Client</th><th>Type</th><th>Priority</th><th>Status</th><th className="num">Vendors</th><th className="num">CVs</th><th></th></tr></thead>
            <tbody>
              {list.length ? list.map((r, i) => (
                <tr key={r.id} className={'clickable' + (i % 2 ? ' tr-alt' : '')} onClick={() => navigate('reqDetail', r.id)}>
                  <td><div style={{ fontWeight: 600 }}>{r.role}</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>{r.id} · {r.level} · {r.expMin}–{r.expMax} yrs</div></td>
                  <td>{r.client}</td>
                  <td><span className={'tag tag-' + r.type}>{r.type}</span></td>
                  <td><span className={'pill p-' + r.priority}>{r.priority}</span></td>
                  <td><span className={'pill ' + STATUS_CLASS[r.status]}>{r.status}</span></td>
                  <td className="num">{r.vendors.length}</td>
                  <td className="num" style={{ fontWeight: 600 }}>{candsFor(r.id).length}</td>
                  <td className="num"><button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); navigate('reqDetail', r.id); }}>View →</button></td>
                </tr>
              )) : <tr><td colSpan={8}><div className="empty">No requirements match your filters</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
