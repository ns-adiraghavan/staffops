import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../app-context';
import { Topbar } from '../components/ui';
import { RATE_DATA, COST_DATA, BANDS, INR_RATE, marginClass } from '../lib/rates';
import { BENCHMARKS, avgMo, groupsWithBenchmarks } from '../lib/benchmarks';
import { copyRichTable } from '../lib/download';
import { fmtDate } from '../lib/constants';

interface Row { id: number; sg: string; band: string; level: string; hr: number; mo: number; yr: number; cost: number }
const GROUPS = Object.keys(RATE_DATA);
const LADDER: [string, string, string][] = [
  ['Junior (0–2 yrs)', '70–77%', 'Deep supply, low cost'],
  ['Standard (2–4 yrs)', '60–75%', 'Volume tier'],
  ['Specialist (5–7 yrs)', '55–72%', 'Independent delivery'],
  ['Lead (8–10 yrs)', '55–68%', 'Client-facing, scarcer'],
  ['Principal (10–12 yrs)', '52–65%', 'Strategic'],
  ['Director (12+ yrs)', '48–62%', 'Premium price'],
];
let seq = 0;

export function RateCard() {
  const { intent, clearIntent, toast } = useApp();
  const [cur, setCur] = useState<'USD' | 'INR'>('USD');
  const [internal, setInternal] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [sg, setSg] = useState(GROUPS[0]);
  const [band, setBand] = useState(Object.keys(RATE_DATA[GROUPS[0]])[0]);
  const [meta, setMeta] = useState({ client: '', prepBy: 'Adi Raghavan', date: new Date().toISOString().slice(0, 10), eng: 'Contract' });
  const [refOpen, setRefOpen] = useState(false);
  const [cost, setCost] = useState(2400);
  const [margin, setMargin] = useState(60);
  const [price, setPrice] = useState(6000);

  useEffect(() => {
    if (intent?.key === 'rcClient') { setMeta((m) => ({ ...m, client: intent.value })); clearIntent(); }
  }, [intent, clearIntent]);

  const sym = cur === 'INR' ? '₹' : '$';
  const toDisp = (u: number) => (cur === 'INR' ? Math.round(u * INR_RATE) : u);
  const fmtCost = (u: number) => (cur === 'INR' ? '₹' + Math.round(u * INR_RATE).toLocaleString('en-IN') : '$' + u.toFixed(2));

  const bands = Object.keys(RATE_DATA[sg]);
  useEffect(() => { if (!bands.includes(band)) setBand(bands[0]); }, [sg]); // eslint-disable-line

  const addRow = () => {
    const d = RATE_DATA[sg]?.[band];
    if (!d) return toast('Pick a skill group and band');
    setRows((rs) => [...rs, { id: ++seq, sg, band, level: d.label, hr: d.hr, mo: d.mo, yr: d.yr, cost: COST_DATA[sg]?.[band] || 0 }]);
  };
  const editCell = (id: number, field: 'hr' | 'mo' | 'yr', dispVal: number) => {
    const usd = cur === 'INR' ? dispVal / INR_RATE : dispVal;
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: usd } : r)));
  };
  const rowMargin = (r: Row) => {
    const p = toDisp(r.hr);
    const c = cur === 'INR' ? r.cost * INR_RATE : r.cost;
    return p > 0 ? Math.round(((p - c) / p) * 100) : 0;
  };

  // quick calc
  const setFromCost = (c: number, m: number) => { setCost(c); setMargin(m); setPrice(Math.round(c / (1 - m / 100))); };
  const setFromPrice = (p: number) => { setPrice(p); setCost(Math.round(p * (1 - margin / 100))); };
  const keep = price - cost, mult = cost ? price / cost : 0;

  const copy = async () => {
    if (!rows.length) return toast('Add at least one role first');
    const cols = internal ? 8 : 6;
    const hS = 'background:#1B3A6B;color:#fff;padding:7px 10px;text-align:left;border:1px solid #142d54;font-size:11px;font-weight:600;text-transform:uppercase';
    const hR = hS.replace('text-align:left', 'text-align:right');
    let html = `<table style="border-collapse:collapse;font-family:Calibri,Arial,sans-serif;font-size:12px"><thead>
<tr><td colspan="${cols}" style="background:#1B3A6B;color:#fff;padding:10px 14px;font-size:14px;font-weight:bold">NS Managed Delivery — Rate Card: ${meta.client || 'Client'}</td></tr>
<tr><td colspan="${cols}" style="background:#234a86;color:#a8c0e0;padding:4px 14px;font-size:11px">Prepared by ${meta.prepBy} · ${fmtDate(meta.date)} · ${meta.eng} · All prices in ${cur}</td></tr>
<tr><th style="${hS}">Skill Group</th><th style="${hS}">Exp Band</th><th style="${hS}">Level</th><th style="${hR}">${sym}/hr</th><th style="${hR}">${sym}/month</th><th style="${hR}">${sym}/year</th>${internal ? `<th style="${hR}">Cost ${sym}/hr</th><th style="${hR}">Margin</th>` : ''}</tr></thead><tbody>`;
    let tsv = `Skill Group\tExp Band\tLevel\t${sym}/hr\t${sym}/month\t${sym}/year${internal ? `\tCost ${sym}/hr\tMargin` : ''}`;
    rows.forEach((r, i) => {
      const bg = i % 2 ? '#f4f6fb' : '#fff';
      const td = `padding:7px 10px;border:1px solid #e3e7ef;background:${bg}`;
      const tdr = td + ';text-align:right';
      const hr = Math.round(toDisp(r.hr)), mo = Math.round(toDisp(r.mo)), yr = Math.round(toDisp(r.yr)), m = rowMargin(r);
      html += `<tr><td style="${td};font-weight:600;color:#1B3A6B">${r.sg}</td><td style="${td}">${r.band} yrs</td><td style="${td}">${r.level}</td><td style="${tdr}">${sym}${hr.toLocaleString('en-IN')}</td><td style="${tdr}">${sym}${mo.toLocaleString('en-IN')}</td><td style="${tdr}">${sym}${yr.toLocaleString('en-IN')}</td>${internal ? `<td style="${tdr}">${fmtCost(r.cost)}</td><td style="${tdr};font-weight:700">${m}%</td>` : ''}</tr>`;
      tsv += `\n${r.sg}\t${r.band} yrs\t${r.level}\t${sym}${hr}\t${sym}${mo}\t${sym}${yr}${internal ? `\t${fmtCost(r.cost)}\t${m}%` : ''}`;
    });
    html += '</tbody></table>';
    toast((await copyRichTable(html, tsv)) ? 'Rate card copied — paste into Word, Excel or Outlook' : 'Copy failed');
  };

  return (
    <>
      <Topbar
        title="Rate Card Builder"
        sub="Pre-populated from NS benchmarks · margins auto-calculate"
        actions={
          <>
            <div className="seg">
              <button className={cur === 'USD' ? 'on' : ''} onClick={() => setCur('USD')}>USD</button>
              <button className={cur === 'INR' ? 'on' : ''} onClick={() => setCur('INR')}>INR</button>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setInternal((v) => !v)}>{internal ? 'Client view' : 'Internal view'}</button>
            <button className="btn btn-navy btn-sm" onClick={copy}>Copy table</button>
          </>
        }
      />
      <div className="content">
        <div className="card card-bd" style={{ marginBottom: 16 }}>
          <div className="grid4">
            <div><div className="lbl">Client</div><input value={meta.client} onChange={(e) => setMeta({ ...meta, client: e.target.value })} placeholder="Client name" /></div>
            <div><div className="lbl">Prepared by</div><input value={meta.prepBy} onChange={(e) => setMeta({ ...meta, prepBy: e.target.value })} /></div>
            <div><div className="lbl">Date</div><input type="date" value={meta.date} onChange={(e) => setMeta({ ...meta, date: e.target.value })} /></div>
            <div><div className="lbl">Engagement</div><select value={meta.eng} onChange={(e) => setMeta({ ...meta, eng: e.target.value })}>{['Contract', 'FTE', 'Mixed'].map((o) => <option key={o}>{o}</option>)}</select></div>
          </div>
        </div>

        <div className="card card-bd" style={{ marginBottom: 16 }}>
          <div className="toolbar">
            <div className="grow"><div className="lbl">Skill group</div><select value={sg} onChange={(e) => setSg(e.target.value)}>{GROUPS.map((g) => <option key={g}>{g}</option>)}</select></div>
            <div className="grow"><div className="lbl">Experience band</div><select value={band} onChange={(e) => setBand(e.target.value)}>{bands.map((b) => <option key={b} value={b}>{b} yrs — {RATE_DATA[sg][b].label}</option>)}</select></div>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={addRow}>Add role →</button>
          </div>
        </div>

        <div className="card" style={{ overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ background: 'var(--navy-d)', padding: '12px 18px', cursor: 'pointer' }} onClick={copy} title="Click to copy">
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>NS Managed Delivery — Rate Card: <span style={{ opacity: 0.8 }}>{meta.client || 'Client'}</span></div>
            <div style={{ fontSize: 11, color: '#9db8e6', marginTop: 2 }}>Prepared by {meta.prepBy} · {fmtDate(meta.date)} · {meta.eng} · All prices in {cur}</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead className="navy"><tr>
                <th style={{ minWidth: 150 }}>Skill Group</th><th>Exp Band</th><th>Level</th>
                <th className="num">{sym}/hr</th><th className="num">{sym}/month</th><th className="num">{sym}/year</th>
                {internal && <><th className="num">Cost {sym}/hr</th><th className="num" style={{ textAlign: 'center' }}>Margin</th><th></th></>}
              </tr></thead>
              <tbody>
                {rows.map((r, i) => {
                  const m = rowMargin(r);
                  return (
                    <tr key={r.id} className={i % 2 ? 'tr-alt' : ''}>
                      <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{r.sg}</td>
                      <td style={{ color: 'var(--muted)' }}>{r.band} yrs</td>
                      <td>{r.level}</td>
                      <td className="num"><input className="rc-input" type="number" value={Math.round(toDisp(r.hr))} onChange={(e) => editCell(r.id, 'hr', +e.target.value)} /></td>
                      <td className="num"><input className="rc-input" type="number" value={Math.round(toDisp(r.mo))} onChange={(e) => editCell(r.id, 'mo', +e.target.value)} /></td>
                      <td className="num"><input className="rc-input" type="number" value={Math.round(toDisp(r.yr))} onChange={(e) => editCell(r.id, 'yr', +e.target.value)} /></td>
                      {internal && <>
                        <td className="num" style={{ color: 'var(--muted)' }}>{fmtCost(r.cost)}</td>
                        <td style={{ textAlign: 'center' }}><span className={'mg ' + marginClass(m)}>{m}%</span></td>
                        <td style={{ textAlign: 'center' }}><button className="x" style={{ color: 'var(--red)', fontSize: 16 }} onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}>×</button></td>
                      </>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!rows.length && <div className="empty">No roles added yet — pick a skill group and band above, then Add role.</div>}
        </div>

        <div className="grid2" style={{ alignItems: 'start', marginBottom: 16 }}>
          <div className="card card-bd">
            <div className="h" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Quick margin calculator</div>
            <div className="formula" style={{ marginBottom: 14 }}>Price = Cost ÷ (1 − Margin)</div>
            <div className="grid2">
              <div className="field" style={{ marginBottom: 0 }}><div className="lbl">Monthly cost to NS (USD)</div><input type="number" value={cost} onChange={(e) => setFromCost(+e.target.value, margin)} /></div>
              <div className="field" style={{ marginBottom: 0 }}><div className="lbl">Margin <span style={{ color: 'var(--teal-d)', fontWeight: 700 }}>{margin}%</span></div><input type="range" min={30} max={77} value={margin} onChange={(e) => setFromCost(cost, +e.target.value)} style={{ marginTop: 8 }} /></div>
            </div>
            <div className="field" style={{ marginBottom: 0, marginTop: 14 }}><div className="lbl">Client price (USD/mo) — edit to back-calculate cost</div><input type="number" value={price} onChange={(e) => setFromPrice(+e.target.value)} /></div>
            <div style={{ marginTop: 14, background: 'var(--teal-l)', borderRadius: 8, padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><div className="hint">NS keeps</div><div style={{ fontWeight: 700, fontSize: 18, color: 'var(--navy)' }}>${Math.round(keep).toLocaleString()}</div></div>
              <div><div className="hint">Multiplier</div><div style={{ fontWeight: 700, fontSize: 18, color: 'var(--navy)' }}>{mult.toFixed(2)}×</div></div>
              <div><div className="hint">Hourly (160h)</div><div style={{ fontWeight: 700, color: 'var(--navy)' }}>${(price / 160).toFixed(2)}</div></div>
              <div><div className="hint">Annual value</div><div style={{ fontWeight: 700, color: 'var(--navy)' }}>${Math.round(price * 12).toLocaleString()}</div></div>
            </div>
          </div>
          <div className="card card-bd">
            <div className="h" style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Margin ladder</div>
            <div className="hint" style={{ marginBottom: 12 }}>NS standard margins by level. Apply niche premium on top.</div>
            {LADDER.map((l) => (
              <div className="ladder" key={l[0]}><div><div style={{ fontWeight: 600, color: 'var(--navy)' }}>{l[0]}</div><div className="hint">{l[2]}</div></div><div style={{ fontWeight: 700, color: 'var(--teal-d)' }}>{l[1]}</div></div>
            ))}
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span className="tag" style={{ background: 'var(--purple-bg)', color: 'var(--purple)' }}>Niche +10% (GenAI, SAP, Workday)</span>
              <span className="tag tag-FTE">Green ≥62%</span>
              <span className="tag" style={{ background: 'var(--amber-bg)', color: 'var(--amber)' }}>Amber 55–62%</span>
              <span className="tag" style={{ background: 'var(--red-bg)', color: 'var(--red)' }}>Red &lt;55%</span>
            </div>
          </div>
        </div>

        <FullPreview cur={cur} sym={sym} toDisp={toDisp} fmtCost={fmtCost} open={refOpen} setOpen={setRefOpen} meta={meta} />
        <CostBenchmark cur={cur} sym={sym} />
      </div>
    </>
  );
}

// Cost Benchmarking — market-validated CTC by designation, mapped to the rate
// card. Shows the average expected cost and how NS's internal cost compares.
function CostBenchmark({ cur, sym }: { cur: 'USD' | 'INR'; sym: string }) {
  const { toast } = useApp();
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState('');
  const [q, setQ] = useState('');
  const groups = groupsWithBenchmarks();

  // Market values are ₹/mo; show in the active currency.
  const money = (rsMo: number | null) => {
    if (rsMo == null) return '—';
    const v = cur === 'INR' ? rsMo : Math.round(rsMo / INR_RATE);
    return sym + v.toLocaleString('en-IN');
  };
  // NS internal cost ($/hr) → monthly in the active currency (160 hrs/mo).
  const nsCostMo = (g: string, band: string): number | null => {
    const c = COST_DATA[g]?.[band];
    if (c == null) return null;
    return cur === 'INR' ? Math.round(c * INR_RATE * 160) : Math.round(c * 160);
  };
  const fmtMoney = (v: number | null) => (v == null ? '—' : sym + v.toLocaleString('en-IN'));

  const rows = BENCHMARKS.filter(
    (b) => (!group || b.group === group) && (!q || b.designation.toLowerCase().includes(q.toLowerCase()))
  );

  const copyBench = async () => {
    const hS = 'background:#1B3A6B;color:#fff;padding:6px 10px;text-align:left;border:1px solid #142d54;font-size:11px;font-weight:600;text-transform:uppercase';
    const hR = hS.replace('text-align:left', 'text-align:right');
    let html = `<table style="border-collapse:collapse;font-family:Calibri,Arial,sans-serif;font-size:12px"><thead><tr><td colspan="7" style="background:#1B3A6B;color:#fff;padding:9px 12px;font-size:13px;font-weight:bold">NS Cost Benchmarking — market-validated CTC (${cur}/month)</td></tr><tr><th style="${hS}">Designation</th><th style="${hS}">Group</th><th style="${hS}">Level</th><th style="${hS}">Exp</th><th style="${hS}">Market (LPA)</th><th style="${hR}">Avg mkt/mo</th><th style="${hR}">NS cost/mo</th></tr></thead><tbody>`;
    let tsv = `Designation\tGroup\tLevel\tExp\tMarket (LPA)\tAvg mkt/mo\tNS cost/mo`;
    rows.forEach((b, i) => {
      const bg = i % 2 ? '#f4f6fb' : '#fff';
      const td = `padding:6px 10px;border:1px solid #e3e7ef;background:${bg}`; const tdr = td + ';text-align:right';
      html += `<tr><td style="${td};font-weight:600;color:#1B3A6B">${b.designation}</td><td style="${td}">${b.group}</td><td style="${td}">${b.level}</td><td style="${td}">${b.exp}</td><td style="${td}">${b.marketValidated || '—'}</td><td style="${tdr}">${money(avgMo(b))}</td><td style="${tdr}">${fmtMoney(nsCostMo(b.group, b.band))}</td></tr>`;
      tsv += `\n${b.designation}\t${b.group}\t${b.level}\t${b.exp}\t${b.marketValidated || '—'}\t${money(avgMo(b))}\t${fmtMoney(nsCostMo(b.group, b.band))}`;
    });
    html += '</tbody></table>';
    toast((await copyRichTable(html, tsv)) ? 'Benchmarks copied' : 'Copy failed');
  };

  return (
    <div className="card card-bd">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div onClick={() => setOpen(!open)} style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-block', transition: 'transform .2s', transform: open ? 'rotate(90deg)' : 'none', fontSize: 10, color: 'var(--muted)' }}>▶</span>
          Cost benchmarking — {BENCHMARKS.length} market-validated designations
        </div>
        {open && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input placeholder="Search designation…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 200 }} />
            <select value={group} onChange={(e) => setGroup(e.target.value)} style={{ width: 'auto' }}>
              <option value="">All groups</option>
              {groups.map((g) => <option key={g}>{g}</option>)}
            </select>
            <button className="btn btn-navy btn-sm" onClick={copyBench}>Copy</button>
          </div>
        )}
      </div>
      <div className={'rc-ref' + (open ? ' open' : '')}>
        <div className="hint" style={{ marginTop: 12 }}>External market validation of CTC — used to sanity-check <b>cost</b>, never price. Compare NS cost/mo against the average expected market cost; validate as real profiles come in on each requirement.</div>
        <div style={{ marginTop: 10, overflowX: 'auto', maxHeight: 460, overflowY: 'auto' }}>
          <table style={{ fontSize: 12 }}>
            <thead className="navy" style={{ position: 'sticky', top: 0 }}>
              <tr><th>Designation</th><th>Group</th><th>Level</th><th>Exp</th><th>Market (LPA)</th><th className="num">Market {sym}/mo</th><th className="num">Avg {sym}/mo</th><th className="num">NS cost {sym}/mo</th></tr>
            </thead>
            <tbody>
              {rows.map((b, i) => (
                <tr key={b.id} className={i % 2 ? 'tr-alt' : ''}>
                  <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{b.designation}</td>
                  <td style={{ color: 'var(--muted)' }}>{b.group}</td>
                  <td>{b.level}</td>
                  <td style={{ color: 'var(--muted)' }}>{b.exp}</td>
                  <td>{b.marketValidated || <span style={{ color: '#d1d5db' }}>not validated</span>}</td>
                  <td className="num" style={{ color: 'var(--muted)' }}>{b.mktLowMo != null ? `${money(b.mktLowMo)}–${money(b.mktHighMo)}` : '—'}</td>
                  <td className="num" style={{ fontWeight: 700 }}>{money(avgMo(b))}</td>
                  <td className="num" style={{ color: 'var(--teal-d)' }}>{fmtMoney(nsCostMo(b.group, b.band))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Full rate card — every skill group × band at once. Toggle between the NS
// benchmark prices (margin derived from cost) and a target margin you set
// (price back-solved from cost at that margin, across the whole card). Every
// number is editable; the margin recomputes live from the edited price.
type Override = { hr?: number; mo?: number; yr?: number };
function FullPreview({ cur, sym, toDisp, fmtCost, open, setOpen, meta }: {
  cur: 'USD' | 'INR'; sym: string; toDisp: (u: number) => number; fmtCost: (u: number) => string;
  open: boolean; setOpen: (v: boolean) => void; meta: { client: string; prepBy: string; eng: string };
}) {
  const { toast } = useApp();
  const [mode, setMode] = useState<'benchmark' | 'target'>('benchmark');
  const [target, setTarget] = useState(60);
  const [ov, setOv] = useState<Record<string, Override>>({});

  const key = (g: string, b: string) => g + '|' + b;
  const editCell = (k: string, field: keyof Override, dispVal: number) => {
    const usd = cur === 'INR' ? dispVal / INR_RATE : dispVal;
    setOv((s) => ({ ...s, [k]: { ...s[k], [field]: usd } }));
  };

  interface FR { key: string; group: string; band: string; level: string; hr: number; mo: number; yr: number; cost: number; margin: number; edited: boolean }
  const rows: FR[] = [];
  GROUPS.forEach((g) => BANDS.forEach((b) => {
    const d = RATE_DATA[g]?.[b];
    if (!d) return;
    const cost = COST_DATA[g]?.[b] || 0;
    const k = key(g, b);
    const o = ov[k] || {};
    let baseHr: number, baseMo: number, baseYr: number;
    if (mode === 'target') { baseHr = cost / (1 - target / 100); baseMo = baseHr * 160; baseYr = baseHr * 160 * 12; }
    else { baseHr = d.hr; baseMo = d.mo; baseYr = d.yr; }
    const hr = o.hr ?? baseHr, mo = o.mo ?? baseMo, yr = o.yr ?? baseYr;
    const margin = hr > 0 ? Math.round(((hr - cost) / hr) * 100) : 0;
    rows.push({ key: k, group: g, band: b, level: d.label, hr, mo, yr, cost, margin, edited: o.hr != null || o.mo != null || o.yr != null });
  }));

  const editedCount = Object.keys(ov).length;
  const avgMargin = Math.round(rows.reduce((s, r) => s + r.margin, 0) / rows.length);

  const copyAll = async () => {
    const hS = 'background:#1B3A6B;color:#fff;padding:6px 10px;text-align:left;border:1px solid #142d54;font-size:11px;font-weight:600;text-transform:uppercase';
    const hR = hS.replace('text-align:left', 'text-align:right');
    let html = `<table style="border-collapse:collapse;font-family:Calibri,Arial,sans-serif;font-size:12px"><thead>
<tr><td colspan="8" style="background:#1B3A6B;color:#fff;padding:9px 12px;font-size:13px;font-weight:bold">NS Managed Delivery — Full Rate Card${meta.client ? ' · ' + meta.client : ''} · ${mode === 'target' ? 'target margin ' + target + '%' : 'benchmark prices'} · ${cur}</td></tr>
<tr><th style="${hS}">Skill Group</th><th style="${hS}">Band</th><th style="${hS}">Level</th><th style="${hR}">${sym}/hr</th><th style="${hR}">${sym}/month</th><th style="${hR}">${sym}/year</th><th style="${hR}">Cost ${sym}/hr</th><th style="${hR}">Margin</th></tr></thead><tbody>`;
    let tsv = `Skill Group\tBand\tLevel\t${sym}/hr\t${sym}/month\t${sym}/year\tCost ${sym}/hr\tMargin`;
    rows.forEach((r, i) => {
      const bg = i % 2 ? '#f4f6fb' : '#fff';
      const td = `padding:6px 10px;border:1px solid #e3e7ef;background:${bg}`; const tdr = td + ';text-align:right';
      const hr = Math.round(toDisp(r.hr)), mo = Math.round(toDisp(r.mo)), yr = Math.round(toDisp(r.yr));
      html += `<tr><td style="${td};font-weight:600;color:#1B3A6B">${r.group}</td><td style="${td}">${r.band} yrs</td><td style="${td}">${r.level}</td><td style="${tdr}">${sym}${hr.toLocaleString('en-IN')}</td><td style="${tdr}">${sym}${mo.toLocaleString('en-IN')}</td><td style="${tdr}">${sym}${yr.toLocaleString('en-IN')}</td><td style="${tdr}">${fmtCost(r.cost)}</td><td style="${tdr};font-weight:700">${r.margin}%</td></tr>`;
      tsv += `\n${r.group}\t${r.band} yrs\t${r.level}\t${sym}${hr}\t${sym}${mo}\t${sym}${yr}\t${fmtCost(r.cost)}\t${r.margin}%`;
    });
    html += '</tbody></table>';
    toast((await copyRichTable(html, tsv)) ? 'Full rate card copied' : 'Copy failed');
  };

  return (
    <div className="card card-bd">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div onClick={() => setOpen(!open)} style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-block', transition: 'transform .2s', transform: open ? 'rotate(90deg)' : 'none', fontSize: 10, color: 'var(--muted)' }}>▶</span>
          Full rate card — all {rows.length} roles
        </div>
        {open && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button className={'pillbtn' + (mode === 'benchmark' ? ' on' : '')} onClick={() => setMode('benchmark')}>Benchmark prices</button>
            <button className={'pillbtn' + (mode === 'target' ? ' on' : '')} onClick={() => setMode('target')}>Target margin</button>
            {editedCount > 0 && <button className="btn btn-ghost btn-sm" onClick={() => setOv({})}>Reset {editedCount} edit{editedCount > 1 ? 's' : ''}</button>}
            <button className="btn btn-navy btn-sm" onClick={copyAll}>Copy full card</button>
          </div>
        )}
      </div>

      <div className={'rc-ref' + (open ? ' open' : '')}>
        {mode === 'target' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14, background: 'var(--soft)', borderRadius: 8, padding: '12px 16px', flexWrap: 'wrap' }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)', minWidth: 130 }}>Target margin: <span style={{ color: 'var(--teal-d)' }}>{target}%</span></div>
            <input type="range" min={40} max={80} value={target} onChange={(e) => setTarget(+e.target.value)} style={{ flex: 1, minWidth: 200 }} />
            <div className="hint">Every price back-solved as Cost ÷ (1 − {target}%). Avg margin {avgMargin}%.</div>
          </div>
        )}
        <div style={{ marginTop: 12, overflowX: 'auto', maxHeight: 460, overflowY: 'auto' }}>
          <table style={{ fontSize: 12 }}>
            <thead className="navy" style={{ position: 'sticky', top: 0 }}>
              <tr><th>Skill Group</th><th>Band</th><th>Level</th><th className="num">{sym}/hr</th><th className="num">{sym}/month</th><th className="num">{sym}/year</th><th className="num">Cost {sym}/hr</th><th className="num" style={{ textAlign: 'center' }}>Margin</th></tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.key} className={i % 2 ? 'tr-alt' : ''} style={r.edited ? { background: '#fffdf5' } : undefined}>
                  <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{r.group}</td>
                  <td style={{ color: 'var(--muted)' }}>{r.band} yrs</td>
                  <td>{r.level}</td>
                  <td className="num"><input className="rc-input" type="number" value={Math.round(toDisp(r.hr))} onChange={(e) => editCell(r.key, 'hr', +e.target.value)} /></td>
                  <td className="num"><input className="rc-input" type="number" value={Math.round(toDisp(r.mo))} onChange={(e) => editCell(r.key, 'mo', +e.target.value)} /></td>
                  <td className="num"><input className="rc-input" type="number" value={Math.round(toDisp(r.yr))} onChange={(e) => editCell(r.key, 'yr', +e.target.value)} /></td>
                  <td className="num" style={{ color: 'var(--muted)' }}>{fmtCost(r.cost)}</td>
                  <td style={{ textAlign: 'center' }}><span className={'mg ' + marginClass(r.margin)}>{r.margin}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
