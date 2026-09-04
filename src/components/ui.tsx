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

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="field" style={{ marginBottom: 0 }}>
      <label className="lbl">{label}</label>
      {children}
    </div>
  );
}
