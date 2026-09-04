import { useApp, type RouteName } from '../app-context';
import { useDB, loadDemo, clearAll } from '../data/store';
import { ACTIVE_STATUSES } from '../lib/constants';

const NAV: ({ sec: string } | { code: string; label: string; route: RouteName; badge?: boolean })[] = [
  { sec: 'Main' },
  { code: 'DB', label: 'Dashboard', route: 'dashboard' },
  { code: 'REQ', label: 'Requirements', route: 'requirements', badge: true },
  { sec: 'Vendors' },
  { code: 'VND', label: 'Vendors', route: 'vendors' },
  { code: 'PRV', label: 'Vendor View', route: 'upload' },
  { sec: 'Tools' },
  { code: 'RC', label: 'Rate Card', route: 'ratecard' },
  { code: 'GEN', label: 'Generate', route: 'generate' },
  { code: 'DOC', label: 'Documents', route: 'documents' },
];

export function Sidebar() {
  const { route, navigate } = useApp();
  const db = useDB();
  const activeCount = db.requirements.filter((r) => ACTIVE_STATUSES.includes(r.status)).length;
  const empty = db.requirements.length === 0 && db.vendors.length === 0 && db.candidates.length === 0;

  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="brand">NS StaffOps</div>
        <div className="sub">Managed Delivery</div>
      </div>
      <nav className="sb-nav">
        {NAV.map((n, i) =>
          'sec' in n ? (
            <div className="sb-sec" key={i}>{n.sec}</div>
          ) : (
            <button
              key={n.route}
              className={'nav-item' + ((route.name === n.route || (n.route === 'requirements' && route.name === 'reqDetail')) ? ' on' : '')}
              onClick={() => navigate(n.route)}
            >
              <span className="ic">{n.code}</span>
              {n.label}
              {n.badge && activeCount > 0 && <span className="nav-badge">{activeCount}</span>}
            </button>
          )
        )}
        <div style={{ marginTop: 'auto', paddingTop: 12 }}>
          {empty ? (
            <button className="nav-item" style={{ background: 'rgba(29,158,117,.18)', color: '#8fe3c4', fontWeight: 600 }} onClick={loadDemo}>
              <span className="ic">▷</span> Load demo data
            </button>
          ) : (
            <button className="nav-item" onClick={() => { if (confirm('Clear all data and return to a blank slate?')) clearAll(); }}>
              <span className="ic">✕</span> Clear data
            </button>
          )}
        </div>
      </nav>
      <div className="sb-user">
        <div className="av">AR</div>
        <div style={{ minWidth: 0 }}>
          <div className="nm">Adi Raghavan</div>
          <div className="rl">Admin · Delivery</div>
        </div>
      </div>
    </aside>
  );
}
