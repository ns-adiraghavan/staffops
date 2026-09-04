import { useApp } from '../app-context';
import { useDB, candsFor, reqById, loadDemo } from '../data/store';
import { Topbar, EmptyState } from '../components/ui';
import { RequirementForm } from '../components/forms';
import { ACTIVE_STATUSES, STATUS_CLASS, ago } from '../lib/constants';

export function Dashboard() {
  const { navigate, openModal } = useApp();
  const db = useDB();
  const blank = db.requirements.length === 0 && db.vendors.length === 0 && db.candidates.length === 0;

  if (blank) {
    return (
      <>
        <Topbar title="Dashboard" sub="Netscribes Tech Staffing · Internal" />
        <div className="content">
          <EmptyState
            title="Welcome to NS StaffOps"
            sub="You're starting on a blank slate. Load the demo dataset to explore with real NS vendors and sample requirements, or start adding your own."
            primary={<button className="btn btn-primary" onClick={loadDemo}>▷ Load demo data</button>}
            secondary={<button className="btn btn-ghost" onClick={() => openModal(<RequirementForm />)}>+ New requirement</button>}
          />
        </div>
      </>
    );
  }

  const active = db.requirements.filter((r) => ACTIVE_STATUSES.includes(r.status));
  const pendingRC = active.filter((r) => r.rateCard === 'Pending').length;
  const cvsMonth = db.candidates.filter((c) => c.createdAt > Date.now() - 30 * 864e5).length;
  const engaged = new Set<string>();
  db.candidates.forEach((c) => { if (ACTIVE_STATUSES.includes(reqById(c.reqId)?.status as any)) engaged.add(c.vendor); });

  const kpis = [
    { n: active.length, l: 'Active requirements', c: 'var(--teal)', d: '' },
    { n: pendingRC, l: 'Rate cards pending', c: 'var(--amber-a)', d: 'Awaiting staffing', dc: 'var(--amber-a)' },
    { n: cvsMonth, l: 'CVs received (30d)', c: 'var(--purple)', d: '' },
    { n: engaged.size, l: 'Vendors engaged', c: 'var(--navy)', d: 'Across active reqs' },
  ];

  return (
    <>
      <Topbar
        title="Dashboard"
        sub={`Week of ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
        actions={<button className="btn btn-primary" onClick={() => openModal(<RequirementForm />)}>+ New requirement</button>}
      />
      <div className="content">
        <div className="kpis">
          {kpis.map((k, i) => (
            <div className="kpi" style={{ borderTopColor: k.c }} key={i}>
              <div className="n">{k.n}</div>
              <div className="l">{k.l}</div>
              {k.d && <div className="d" style={{ color: (k as any).dc || 'var(--muted)' }}>{k.d}</div>}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '60fr 40fr', gap: 20, alignItems: 'start' }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-hd"><span className="h">Requirements</span><button className="link" onClick={() => navigate('requirements')}>View all</button></div>
            <table>
              <thead className="navy"><tr><th>Client</th><th>Role</th><th>Band</th><th>Status</th><th>Priority</th><th>Assigned</th><th className="num">CVs</th></tr></thead>
              <tbody>
                {db.requirements.map((r, i) => (
                  <tr key={r.id} className={'clickable' + (i % 2 ? ' tr-alt' : '')} onClick={() => navigate('reqDetail', r.id)}>
                    <td style={{ fontWeight: 600 }}>{r.client}</td>
                    <td>{r.role}</td>
                    <td style={{ color: 'var(--muted)' }}>{r.level} · {r.expMin}–{r.expMax}y</td>
                    <td><span className={'pill ' + STATUS_CLASS[r.status]}>{r.status}</span></td>
                    <td><span className={'pill p-' + r.priority}>{r.priority}</span></td>
                    <td style={{ color: 'var(--muted)' }}>{r.assigned}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{candsFor(r.id).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-hd"><span className="h">Recent activity</span></div>
            <div className="card-bd" style={{ padding: '6px 18px 14px' }}>
              {db.activity.length ? db.activity.map((a, i, arr) => (
                <div className="tl-item" key={i}>
                  <div className="tl-rail"><div className="d" style={{ background: a.dot }} />{i < arr.length - 1 && <div className="l" />}</div>
                  <div style={{ minWidth: 0 }}><div className="tl-t"><b>{a.t}</b> · {a.d}</div><div className="tl-time">{ago(a.at)}</div></div>
                </div>
              )) : <div className="empty">No activity yet</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
