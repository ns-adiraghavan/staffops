import { useApp } from '../app-context';
import { Topbar } from '../components/ui';

// Bundled files live in public/templates and are served at /templates/*.
function download(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

interface DocItem {
  code: string;
  color: string;
  name: string;
  desc: string;
  file: string;
  as: string;
}

const AGREEMENTS: DocItem[] = [
  { code: 'NDA', color: 'var(--navy)', name: 'Vendor NDA', desc: 'Non-disclosure agreement — required for every vendor before sharing requirements.', file: '/templates/Vendor_NDA.dotx', as: 'NDIPL_Vendor_NDA.dotx' },
  { code: 'C2H', color: 'var(--amber-a)', name: 'C2H Vendor Agreement', desc: 'Contract-to-hire terms — for vendors supplying contract / C2H resources.', file: '/templates/C2H_Vendor_Agreement.dotx', as: 'NDIPL_C2H_Vendor_Agreement.dotx' },
  { code: 'FTE', color: 'var(--purple)', name: 'Recruitment Agency Agreement', desc: 'Permanent placement terms — for FTE recruitment agency vendors.', file: '/templates/Recruitment_Agency_Agreement.dotx', as: 'NDIPL_Recruitment_Agency_Agreement.dotx' },
];

const TEMPLATES: DocItem[] = [
  { code: 'DOCX', color: 'var(--teal-d)', name: 'Anonymised Résumé Template', desc: 'The two-column NS layout the anonymiser fills. Editable in Word.', file: '/templates/NS_Anonymised_Resume_Template.docx', as: 'NS_Anonymised_Resume_Template.docx' },
  { code: 'MD', color: 'var(--navy-l)', name: 'JD Format Guide', desc: 'House rules for Format A (branded) and Format B (mandate) job descriptions.', file: '/templates/NS_JD_Format_Guide.md', as: 'NS_JD_Format_Guide.md' },
];

export function Documents() {
  const { navigate, toast } = useApp();

  const Row = ({ d }: { d: DocItem }) => (
    <div className="docrow">
      <div className="badge" style={{ background: d.color }}>{d.code}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="nm">{d.name}</div>
        <div className="ds">{d.desc}</div>
      </div>
      <button className="btn btn-ghost btn-sm" onClick={() => { download(d.file, d.as); toast(`Downloading ${d.as}`); }}>Download</button>
    </div>
  );

  return (
    <>
      <Topbar title="Documents" sub="Vendor agreements, templates and reference material" />
      <div className="content">
        <div className="card" style={{ overflow: 'hidden', maxWidth: 1000, marginBottom: 20 }}>
          <div className="card-hd"><span className="h">Vendor agreements</span><span className="hint">Send the right ones before onboarding a vendor</span></div>
          {AGREEMENTS.map((d) => <Row key={d.name} d={d} />)}
          <div className="hint" style={{ padding: '12px 18px', borderTop: '1px solid #eef1f7' }}>
            Every vendor signs the <b>NDA</b>. Add the <b>C2H</b> agreement for contract / contract-to-hire vendors and the <b>Recruitment Agency</b> agreement for FTE vendors. Mark what’s signed on each vendor’s card (Edit → Paperwork on file).
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start', maxWidth: 1000 }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-hd"><span className="h">Templates & guides</span></div>
            {TEMPLATES.map((d) => <Row key={d.name} d={d} />)}
          </div>
          <div className="card card-bd">
            <div className="lbl">Generate on demand</div>
            <div className="hint" style={{ marginBottom: 12 }}>Job descriptions and anonymised résumés are produced per-role from the Generate screen.</div>
            <button className="btn btn-navy btn-sm" onClick={() => navigate('generate')}>Open Generate →</button>
          </div>
        </div>

        <div className="hint" style={{ marginTop: 16, maxWidth: 1000 }}>
          Files live in <b>public/templates/</b> — drop an updated agreement there and edit <b>src/screens/Documents.tsx</b> to expose it. When the Google Drive backend is on, this list reads from the shared NS StaffOps <b>templates/</b> folder instead.
        </div>
      </div>
    </>
  );
}
