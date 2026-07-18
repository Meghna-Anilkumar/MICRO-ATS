import type { Candidate, Interviewer, ScheduleDraft } from "../types";
import { SelectField } from "./SelectField";

type Props = {
  candidates: Candidate[];
  interviewers: Interviewer[];
  selectedCandidateId: string;
  selectedInterviewerId: string;
  start: string;
  end: string;
  onCandidateChange: (id: string) => void;
  onInterviewerChange: (id: string) => void;
  onTimesChange: (times: { start: string; end: string }) => void;
  onAddPerson: (kind: "candidate" | "interviewer") => void;
  onSubmit: (draft: ScheduleDraft) => void;
};

export function ScheduleForm(props: Props) {
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!props.selectedCandidateId || !props.selectedInterviewerId || !props.start || !props.end) return;
    props.onSubmit({ candidateId: props.selectedCandidateId, interviewerId: props.selectedInterviewerId, timeBlock: { start: new Date(props.start).toISOString(), end: new Date(props.end).toISOString() } });
  };
  return <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <div><p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Booking</p><h2 className="mt-1 text-xl font-bold text-slate-950">Schedule an interview</h2><p className="mt-1 text-sm text-slate-500">Conflicting times are blocked automatically.</p></div>
    <form onSubmit={submit} className="mt-6 grid gap-5 md:grid-cols-2">
      <SelectField label="Interviewer" value={props.selectedInterviewerId} placeholder="Choose an interviewer" options={props.interviewers.map((person) => ({ value: person._id, label: `${person.name} · ${person.email}` }))} onChange={props.onInterviewerChange} onAdd={() => props.onAddPerson("interviewer")} />
      <SelectField label="Candidate" value={props.selectedCandidateId} placeholder="Choose a candidate" options={props.candidates.map((person) => ({ value: person._id, label: `${person.name} · ${person.email}` }))} onChange={props.onCandidateChange} onAdd={() => props.onAddPerson("candidate")} />
      <label className="block text-sm font-semibold text-slate-700">Start time<input required type="datetime-local" value={props.start} onChange={(event) => props.onTimesChange({ start: event.target.value, end: props.end })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>
      <label className="block text-sm font-semibold text-slate-700">End time<input required type="datetime-local" value={props.end} onChange={(event) => props.onTimesChange({ start: props.start, end: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>
      <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 md:col-span-2">Review interview booking</button>
    </form>
  </section>;
}
