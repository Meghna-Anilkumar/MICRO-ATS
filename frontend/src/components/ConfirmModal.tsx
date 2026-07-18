import type { ReactNode } from "react";

type Props = {
  title: string;
  description: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
};

export function ConfirmModal({ title, description, confirmLabel, onConfirm, onCancel, busy }: Props) {
  return <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-700">?</div>
      <h2 id="confirmation-title" className="mt-4 text-xl font-bold text-slate-950">{title}</h2>
      <div className="mt-2 text-sm leading-6 text-slate-600">{description}</div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onCancel} disabled={busy} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50">Cancel</button>
        <button type="button" onClick={onConfirm} disabled={busy} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60">{busy ? "Working…" : confirmLabel}</button>
      </div>
    </div>
  </div>;
}
