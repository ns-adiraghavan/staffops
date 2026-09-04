// Rules-based CV anonymiser. No AI — regex + caller-supplied names.
// The operator chooses which categories to strip (see RedactOpts).
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle,
} from 'docx';

export type RedactKey = 'name' | 'email' | 'phone' | 'company' | 'links' | 'address';

export interface RedactOpts {
  name: string;
  companies: string[];
  strip: Record<RedactKey, boolean>;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function redact(text: string, opts: RedactOpts): { text: string; count: number } {
  let count = 0;
  const bump = (re: RegExp, rep: string) => {
    text = text.replace(re, () => {
      count++;
      return rep;
    });
  };
  if (opts.strip.email) bump(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[EMAIL]');
  if (opts.strip.phone) bump(/(\+?\d[\d\s().-]{7,}\d)/g, '[PHONE]');
  if (opts.strip.links) bump(/\b((https?:\/\/|www\.)[^\s]+|(linkedin|github)\.com\/[^\s]+)/gi, '[LINK]');
  if (opts.strip.name && opts.name.trim()) {
    opts.name
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 1)
      .forEach((w) => bump(new RegExp('\\b' + escapeRe(w) + '\\b', 'gi'), '[CANDIDATE]'));
  }
  if (opts.strip.company) {
    opts.companies.filter(Boolean).forEach((c) => bump(new RegExp('\\b' + escapeRe(c) + '\\b', 'gi'), '[COMPANY]'));
  }
  if (opts.strip.address) {
    bump(/\b\d{1,4}[\w\s.,#-]{0,40}\b(Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Nagar|Colony|Sector|Block)\b[^\n,]*/gi, '[ADDRESS]');
  }
  return { text, count };
}

// Emits a DOCX in the NS anonymised-resume two-column layout:
// left = CONTACT [n/a] + KEY EXPERTISE, right = PROFILE + EDUCATION + WORK EXPERIENCE.
export async function generateAnonDocx(redactedText: string, keyExpertise: string[]): Promise<Blob> {
  const FONT = 'Arial';
  const label = (t: string) => new Paragraph({ spacing: { before: 120, after: 60 }, children: [new TextRun({ text: t, font: FONT, size: 20, bold: true, color: '1A3C5E' })] });
  const line = (t: string) => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: t, font: FONT, size: 20 })] });

  const leftCells: Paragraph[] = [label('CONTACT'), line('[n/a]'), label('KEY EXPERTISE')];
  (keyExpertise.length ? keyExpertise : ['[List key skills]']).forEach((k, i) => leftCells.push(line(`${i + 1}. ${k}`)));

  const rightCells: Paragraph[] = [label('PROFILE')];
  redactedText.split('\n').forEach((p) => rightCells.push(line(p)));
  rightCells.push(label('EDUCATION HISTORY'), line('[Degree, institution — years]'));
  rightCells.push(label('WORK EXPERIENCE'), line('[Title — Organization: [COMPANY] — Duration:]'));

  const noBorder = { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' };
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder },
    rows: [
      new TableRow({
        children: [
          new TableCell({ width: { size: 32, type: WidthType.PERCENTAGE }, children: leftCells }),
          new TableCell({ width: { size: 68, type: WidthType.PERCENTAGE }, children: rightCells }),
        ],
      }),
    ],
  });

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ children: [new TextRun({ text: '[CANDIDATE]', font: FONT, size: 32, bold: true })] }),
        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: 'Anonymised profile · prepared by NS StaffOps', font: FONT, size: 18, italics: true, color: '808080' })] }),
        table,
      ],
    }],
  });
  return Packer.toBlob(doc);
}
