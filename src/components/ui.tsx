import type { ReactNode } from 'react';
import { useApp } from '../app-context';

export function Topbar({ title, sub, actions }: { title: string; sub: string; actions?: ReactNode }) {
  return (
    <div className="topbar">
      <div>
        <div className="tt">{title}</div>
        <div className="ts">{sub}</div>
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
}

export function Modal({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const { closeModal } = useApp();
  return (
    <div className="modal">
      <div className="modal-hd">
        <div className="t">{title}</div>
        <button className="x" onClick={closeModal} aria-label="Close">
          ×
        </button>
      </div>
      <div className="modal-bd">{children}</div>
      <div className="modal-ft">{footer}</div>
    </div>
  );
}

export function EmptyState({ title, sub, primary, secondary }: { title: string; sub: string; primary?: ReactNode; secondary?: ReactNode }) {
  return (
    <div className="card">
      <div className="empty-cta">
        <div className="big">{title}</div>
        <div className="sub">{sub}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {primary}
          {secondary}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="field" style={{ marginBottom: 0 }}>
      <label className="lbl">{label}</label>
      {children}
    </div>
  );
}

// Styled résumé file picker. Reports the chosen File; parent decides what to do.
export function FilePick({ file, onPick, accept = '.pdf,.docx,.txt', hint = 'PDF, DOCX or TXT' }: { file: File | null; onPick: (f: File | null) => void; accept?: string; hint?: string }) {
  return (
    <label className={'filepick' + (file ? ' has' : '')}>
      <span className="ic">{file ? '✓' : 'CV'}</span>
      <span style={{ minWidth: 0 }}>
        <span className="t" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file ? file.name : 'Click to upload résumé'}</span>
        <span className="s">{file ? `${Math.round(file.size / 1024)} KB — click to replace` : `or drag and drop · ${hint}`}</span>
      </span>
      <input type="file" accept={accept} style={{ display: 'none' }} onChange={(e) => onPick(e.target.files?.[0] ?? null)} />
    </label>
  );
}
