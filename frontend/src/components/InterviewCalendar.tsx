import type { Candidate, InterviewSlot } from "../types";

type Entry = InterviewSlot & { candidate: Candidate };
type Props = { entries: Entry[]; hasInterviewer: boolean; timeZone: string };

export function InterviewCalendar({ entries, hasInterviewer, timeZone }: Props) {
  const format = (value: string) => new Date(value).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  return <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-3"><div className="flex flex-wrap items-baseline justify-between gap-2"><div><p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Calendar</p><h2 className="mt-1 text-xl font-bold text-slate-950">Interviewer schedule</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">{timeZone}</span></div>
    {!hasInterviewer ? <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Select an interviewer to see their calendar.</p> : entries.length === 0 ? <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No interviews are booked for this interviewer.</p> : <div className="mt-5 space-y-3">{entries.map((entry) => <article key={`${entry.candidate._id}-${entry.timeBlock.start}`} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"><div><p className="font-bold text-slate-900">{entry.candidate.name}</p><p className="mt-1 text-sm text-slate-500">{entry.candidate.email}</p><span className="mt-3 inline-block rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">{entry.candidate.status}</span></div><p className="text-right text-sm font-semibold leading-6 text-blue-700">{format(entry.timeBlock.start)}<br /><span className="font-normal text-slate-500">to {new Date(entry.timeBlock.end).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span></p></article>)}</div>}
  </section>;
}
