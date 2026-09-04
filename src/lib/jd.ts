// JD DOCX generation — follows ns_jd_format_guide.md.
// Format A = branded external JD; Format B = confidential agency mandate (lite).
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  BorderStyle, ShadingType, AlignmentType, Footer, PageNumber, TabStopType,
  TabStopPosition, convertMillimetersToTwip,
} from 'docx';

const NAVY = '1A3C5E'; // branded header
const TEAL = '2E7D5E'; // section headings
const GREY = 'CCCCCC';
const FONT = 'Arial';

export interface JDInput {
  role: string;
  level: string;
  functionPillar: string;
  location: string;
  experience: string;
  employmentType: string; // "Full-time, Permanent" | "Contract"
  overview: string;
  responsibilities: string[];
  required: string[];
  preferred: string[];
  offers: string[];
  skills: string[];
  niceToHave: string[];
  whatSuccess: string[];
}

const ABOUT_NS_P1 =
  "Netscribes is a global data and insights firm that helps the world's leading organizations stay ahead of disruption. For over 20 years we have partnered with more than 544 brands across automotive and manufacturing, retail and logistics, life sciences and healthcare, ICT and media, and banking and insurance — delivering more than 3,500 projects through our three integrated pillars of Insights, Engineering, and Innovation.";
const ABOUT_NS_P2 =
  'Our Engineering practice builds the data platforms, cloud foundations, and AI systems that turn research and analytics into production-grade products for our clients. As an ISO 9001 and ISO 27001 certified organization, we pair deep domain expertise with modern engineering to help firms reinvent their future.';
const EEO_P1 =
  'Netscribes is an equal opportunity employer. We celebrate diversity and are committed to building an inclusive workplace where talented people can do their best work, regardless of gender, age, ethnicity, religion, disability, or background.';

const body = (text: string, opts: { bold?: boolean; size?: number } = {}) =>
  new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, font: FONT, size: opts.size ?? 22, bold: opts.bold })] });

// Teal section heading with a bottom rule in the same colour.
const heading = (text: string) =>
  new Paragraph({
    spacing: { before: 240, after: 120 },
    border: { bottom: { color: TEAL, space: 2, style: BorderStyle.SINGLE, size: 6 } },
    children: [new TextRun({ text, font: FONT, size: 24, bold: true, color: TEAL })],
  });

// Bullet with optional bold lead-in ("Lead phrase: rest").
function bullet(text: string, boldLeadIn: boolean): Paragraph {
  const runs: TextRun[] = [];
  const idx = boldLeadIn ? text.indexOf(':') : -1;
  if (idx > 0) {
    runs.push(new TextRun({ text: text.slice(0, idx + 1), font: FONT, size: 22, bold: true }));
    runs.push(new TextRun({ text: text.slice(idx + 1), font: FONT, size: 22 }));
  } else {
    runs.push(new TextRun({ text, font: FONT, size: 22 }));
  }
  return new Paragraph({ bullet: { level: 0 }, spacing: { after: 80 }, children: runs });
}

function metaTable(rows: [string, string][]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: GREY },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: GREY },
      left: { style: BorderStyle.SINGLE, size: 2, color: GREY },
      right: { style: BorderStyle.SINGLE, size: 2, color: GREY },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: GREY },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: GREY },
    },
    rows: rows.map(
      ([k, v]) =>
        new TableRow({
          children: [
            new TableCell({ width: { size: 32, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' }, children: [body(k, { bold: true })] }),
            new TableCell({ width: { size: 68, type: WidthType.PERCENTAGE }, children: [body(v)] }),
          ],
        })
    ),
  });
}

function bandedHeader(role: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: NAVY },
      bottom: { style: BorderStyle.NONE, size: 0, color: NAVY },
      left: { style: BorderStyle.NONE, size: 0, color: NAVY },
      right: { style: BorderStyle.NONE, size: 0, color: NAVY },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: NAVY },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: NAVY },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: NAVY },
            margins: { top: 160, bottom: 160, left: 200, right: 200 },
            children: [
              new Paragraph({ children: [new TextRun({ text: 'JOB DESCRIPTION', font: FONT, size: 18, bold: true, color: 'FFFFFF', characterSpacing: 30 })] }),
              new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: role, font: FONT, size: 34, bold: true, color: 'FFFFFF' })] }),
            ],
          }),
        ],
      }),
    ],
  });
}

const pageFooter = (label: string) =>
  new Footer({
    children: [
      new Paragraph({
        border: { top: { color: GREY, space: 4, style: BorderStyle.SINGLE, size: 4 } },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({ text: label, font: FONT, size: 16, color: '808080' }),
          new TextRun({ text: '\tPage ', font: FONT, size: 16, color: '808080' }),
          new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: '808080' }),
          new TextRun({ text: ' of ', font: FONT, size: 16, color: '808080' }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: '808080' }),
        ],
      }),
    ],
  });

const A4 = { size: { width: convertMillimetersToTwip(210), height: convertMillimetersToTwip(297) } };

function buildFormatA(jd: JDInput): Document {
  const title = jd.level ? `${jd.role}, ${jd.level}` : jd.role;
  const children: (Paragraph | Table)[] = [];
  children.push(bandedHeader(title), new Paragraph({ text: '' }));

  children.push(heading('Role Snapshot'));
  const meta: [string, string][] = [
    ['JOB TITLE', title],
    ['FUNCTION / PILLAR', jd.functionPillar || 'Engineering & Innovation'],
    ['LOCATION', jd.location || '—'],
    ['EXPERIENCE', jd.experience || '—'],
    ['EMPLOYMENT TYPE', jd.employmentType || 'Full-time, Permanent'],
  ];
  children.push(metaTable(meta), new Paragraph({ text: '' }));

  children.push(heading('About Netscribes'), body(ABOUT_NS_P1), body(ABOUT_NS_P2));

  children.push(heading('Role Overview'));
  (jd.overview ? jd.overview.split('\n').filter((s) => s.trim()) : ['[Add a 2–3 paragraph role overview.]']).forEach((p) => children.push(body(p)));

  children.push(heading('Key Responsibilities'));
  (jd.responsibilities.length ? jd.responsibilities : ['[Add key responsibilities, one per line.]']).forEach((r) => children.push(bullet(r, true)));

  children.push(heading('Required Qualifications'));
  (jd.required.length ? jd.required : ['[Add required qualifications.]']).forEach((r) => children.push(bullet(r, false)));

  if (jd.preferred.length) {
    children.push(heading('Preferred Qualifications'));
    jd.preferred.forEach((r) => children.push(bullet(r, false)));
  }

  children.push(heading('What We Offer'));
  (jd.offers.length ? jd.offers : ['Competitive compensation and a modern engineering environment.', 'A role with direct client impact across global brands.', 'Learning budget and clear growth paths.']).forEach((r) => children.push(bullet(r, false)));

  children.push(heading('Equal Opportunity & How to Apply'), body(EEO_P1));
  children.push(
    new Paragraph({ spacing: { after: 120 }, children: [
      new TextRun({ text: 'To apply: ', font: FONT, size: 22, bold: true }),
      new TextRun({ text: 'Share your updated CV with sandhya.ramchandran@netscribes.com.', font: FONT, size: 22 }),
    ] })
  );

  return new Document({
    sections: [{
      properties: { page: { ...A4, margin: { top: 1440, bottom: 1440, left: 1080, right: 1080 } } },
      footers: { default: pageFooter('Netscribes — data and insights that move you forward') },
      children,
    }],
  });
}

function buildFormatB(jd: JDInput): Document {
  const title = jd.level ? `${jd.role} — ${jd.level}` : jd.role;
  const children: (Paragraph | Table)[] = [];

  children.push(new Paragraph({ children: [new TextRun({ text: 'Netscribes — Hiring Mandate (Confidential)', font: FONT, size: 20, bold: true, color: NAVY })] }));
  children.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: 'Recruitment-ready. Client details are confidential. For internal distribution only.', font: FONT, size: 18, italics: true, color: '808080' })] }));

  // Inline header/metadata table.
  children.push(metaTable([
    ['Role', title],
    ['Openings', '1'],
    ['Minimum Experience', jd.experience || '—'],
    ['Qualification', "Bachelor's degree in a relevant field (or equivalent experience)"],
    ['Employment Type', jd.employmentType || 'Contract'],
    ['Location', jd.location || '—'],
  ]));
  children.push(new Paragraph({ text: '' }));

  children.push(heading('About the Role'));
  (jd.overview ? jd.overview.split('\n').filter((s) => s.trim()) : ['[Add a 2–4 sentence role summary.]']).forEach((p) => children.push(body(p)));

  children.push(heading('Key Responsibilities'));
  (jd.responsibilities.length ? jd.responsibilities : ['[Add key responsibilities, one per line.]']).forEach((r) => children.push(bullet(r, false)));

  children.push(heading('Required Skills & Experience'));
  if (jd.skills.length) children.push(body(jd.skills.join(', ')));
  (jd.required.length ? jd.required : []).forEach((r) => children.push(bullet(r, false)));

  if (jd.niceToHave.length) {
    children.push(heading('Nice to Have'));
    jd.niceToHave.forEach((r) => children.push(bullet(r, false)));
  }

  if (jd.whatSuccess.length) {
    children.push(heading('What Success Looks Like'));
    jd.whatSuccess.slice(0, 3).forEach((r) => children.push(bullet(r, false)));
  }

  return new Document({
    sections: [{
      properties: { page: { ...A4, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
      footers: { default: pageFooter('Netscribes – Confidential | Hiring Mandate') },
      children,
    }],
  });
}

export async function generateJD(format: 'A' | 'B', jd: JDInput): Promise<Blob> {
  const doc = format === 'A' ? buildFormatA(jd) : buildFormatB(jd);
  return Packer.toBlob(doc);
}
