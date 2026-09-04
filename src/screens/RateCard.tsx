import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../app-context';
import { Topbar } from '../components/ui';
import { RATE_DATA, COST_DATA, BANDS, INR_RATE, marginClass } from '../lib/rates';
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
<tr><td colspan="${cols}" style="background:#1B3A6B;color:#fff;padding:10px 14px;font-size:14px;font-weight:bold">NS Staff Augmentation — Rate Card: ${meta.client || 'Client'}</td></tr>
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
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>NS Staff Augmentation — Rate Card: <span style={{ opacity: 0.8 }}>{meta.client || 'Client'}</span></div>
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

        <div className="card card-bd">
          <div onClick={() => setRefOpen((v) => !v)} style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-block', transition: 'transform .2s', transform: refOpen ? 'rotate(90deg)' : 'none', fontSize: 10, color: 'var(--muted)' }}>▶</span>
            Reference rate schedule — all skill groups <span className="hint" style={{ fontWeight: 400 }}>Pre-populated NS rates</span>
          </div>
          <div className={'rc-ref' + (refOpen ? ' open' : '')}>
            <div style={{ marginTop: 12, overflowX: 'auto' }}>
              <RefTable sym={sym} toDisp={toDisp} cur={cur} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function RefTable({ sym, toDisp, cur }: { sym: string; toDisp: (u: number) => number; cur: 'USD' | 'INR' }) {
  const labels = ['0–2', '2–4', '5–7', '8–10', '10–12', '12+'];
  return (
    <table style={{ fontSize: 12 }}>
      <thead className="navy"><tr><th>Skill Group</th>{labels.map((b) => <th className="num" key={b}>{b} yrs</th>)}</tr></thead>
      <tbody>
        {GROUPS.map((g, i) => (
          <tr key={g} className={i % 2 ? 'tr-alt' : ''}>
            <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{g}</td>
            {BANDS.map((b) => {
              const r = RATE_DATA[g]?.[b];
              if (!r) return <td className="num" key={b} style={{ color: '#d1d5db' }}>—</td>;
              const hr = Math.round(toDisp(r.hr));
              const mo = cur === 'INR' ? Math.round((r.mo * 90) / 1000) + 'k' : (r.mo / 1000).toFixed(1) + 'k';
              return <td className="num" key={b}><div style={{ fontWeight: 600 }}>{sym}{hr}/hr</div><div className="hint">{sym}{mo}/mo</div></td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
