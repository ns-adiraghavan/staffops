import { useApp, type RouteName } from '../app-context';
import { useDB, resetDemo } from '../data/store';
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
];

export function Sidebar() {
  const { route, navigate } = useApp();
  const db = useDB();
  const activeCount = db.requirements.filter((r) => ACTIVE_STATUSES.includes(r.status)).length;

  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="brand">NS StaffOps</div>
        <div className="sub">Staff Augmentation</div>
      </div>
      <nav className="sb-nav">
        {NAV.map((n, i) =>
          'sec' in n ? (
            <div className="sb-sec" key={i}>
              {n.sec}
            </div>
          ) : (
            <button
              key={n.route}
              className={'nav-item' + ((route.name === n.route || (n.route === 'requirements' && route.name === 'reqDetail')) ? ' on' : '')}
              onClick={() => navigate(n.route)}
            >
              <span className="ic">{n.code}</span>
              {n.label}
              {n.badge && <span className="nav-badge">{activeCount}</span>}
            </button>
          )
        )}
      </nav>
      <div className="sb-user">
        <div className="av">AR</div>
        <div style={{ minWidth: 0 }}>
          <div className="nm">Adi Raghavan</div>
          <div className="rl">Admin · Staffing</div>
        </div>
        <button
          className="sb-reset"
          title="Reset demo data"
          onClick={() => {
            if (confirm('Reset all data back to the seeded demo set? Anything you added will be lost.')) resetDemo();
          }}
        >
          ⟲
        </button>
      </div>
    </aside>
  );
}
