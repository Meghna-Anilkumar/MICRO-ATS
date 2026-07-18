import type { PersonDraft, PersonKind } from "../types";

type Props = { kind: PersonKind; draft: PersonDraft; onChange: (draft: PersonDraft) => void; onContinue: () => void; onClose: () => void };

export function PersonModal({ kind, draft, onChange, onContinue, onClose }: Props) {
  const label = kind === "candidate" ? "candidate" : "interviewer";
  return <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="person-modal-title">
    <form onSubmit={(event) => { event.preventDefault(); onContinue(); }} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
      <h2 id="person-modal-title" className="text-xl font-bold text-slate-950">Add a {label}</h2>
      <p className="mt-1 text-sm text-slate-500">Their details can be confirmed before they are created.</p>
      <div className="mt-5 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">Full name<input autoFocus required value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="e.g. Priya Sharma" /></label>
        <label className="block text-sm font-semibold text-slate-700">Email address<input required type="email" value={draft.email} onChange={(event) => onChange({ ...draft, email: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="name@company.com" /></label>
      </div>
      <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Review details</button></div>
    </form>
  </div>;
}
