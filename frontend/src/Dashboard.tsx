import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import type { Candidate, Interviewer, PersonDraft, PersonKind, ScheduleDraft } from "./types";
import { ConfirmModal } from "./components/ConfirmModal";
import { PersonModal } from "./components/PersonModal";
import { ScheduleForm } from "./components/ScheduleForm";
import { InterviewCalendar } from "./components/InterviewCalendar";
import { CandidatePipeline } from "./components/CandidatePipeline";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const emptyDraft: PersonDraft = { name: "", email: "" };
type Confirmation = { type: "schedule"; draft: ScheduleDraft } | { type: "person"; kind: PersonKind; draft: PersonDraft } | { type: "status"; candidate: Candidate; status: string };
const getError = (error: unknown) => axios.isAxiosError(error) ? error.response?.data?.message || "The request could not be completed." : "The request could not be completed.";

export default function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [selectedInterviewerId, setSelectedInterviewerId] = useState("");
  const [times, setTimes] = useState({ start: "", end: "" });
  const [personKind, setPersonKind] = useState<PersonKind | null>(null);
  const [personDraft, setPersonDraft] = useState<PersonDraft>(emptyDraft);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [busy, setBusy] = useState(false);
  const load = async () => { try { const [candidateResponse, interviewerResponse] = await Promise.all([axios.get<Candidate[]>(`${API}/candidates`), axios.get<Interviewer[]>(`${API}/interviewers`)]); setCandidates(candidateResponse.data); setInterviewers(interviewerResponse.data); setSelectedInterviewerId((current) => current || interviewerResponse.data[0]?._id || ""); } catch { toast.error("Unable to load ATS data. Check that the API is running."); } };
  useEffect(() => { void load(); }, []);
  const entries = useMemo(() => candidates.flatMap((candidate) => candidate.interviewSlots.filter((slot) => (typeof slot.interviewerId === "string" ? slot.interviewerId : slot.interviewerId._id) === selectedInterviewerId && Boolean(slot.timeBlock.start && slot.timeBlock.end)).map((slot) => ({ ...slot, candidate }))).sort((a, b) => new Date(a.timeBlock.start).getTime() - new Date(b.timeBlock.start).getTime()), [candidates, selectedInterviewerId]);
  const createPerson = async (kind: PersonKind, draft: PersonDraft) => { const response = await axios.post(`${API}/${kind === "candidate" ? "candidates" : "interviewers"}`, draft); const person = response.data[kind]; if (kind === "candidate") { setCandidates((items) => [...items, person]); setSelectedCandidateId(person._id); } else { setInterviewers((items) => [...items, person]); setSelectedInterviewerId(person._id); } toast.success(`${person.name} was added and selected.`); };
  const schedule = async (draft: ScheduleDraft) => { await axios.post(`${API}/schedule`, draft); setTimes({ start: "", end: "" }); toast.success("Interview scheduled successfully."); await load(); };
  const updateStatus = async (candidate: Candidate, status: string) => { const response = await axios.patch(`${API}/candidates/${candidate._id}/status`, { status }); setCandidates((items) => items.map((item) => item._id === candidate._id ? response.data.candidate : item)); toast.success(`${candidate.name} moved to ${status}.`); };
  const confirm = async () => { if (!confirmation) return; setBusy(true); try { if (confirmation.type === "schedule") await schedule(confirmation.draft); if (confirmation.type === "person") { await createPerson(confirmation.kind, confirmation.draft); setPersonKind(null); setPersonDraft(emptyDraft); } if (confirmation.type === "status") await updateStatus(confirmation.candidate, confirmation.status); setConfirmation(null); } catch (error) { toast.error(getError(error)); } finally { setBusy(false); } };
  const details = !confirmation ? null : confirmation.type === "person" ? { title: `Create ${confirmation.kind}?`, label: "Create record", description: <><strong>{confirmation.draft.name}</strong><br />{confirmation.draft.email}</> } : confirmation.type === "status" ? { title: "Update candidate status?", label: "Update status", description: <>Move <strong>{confirmation.candidate.name}</strong> to <strong>{confirmation.status}</strong>?</> } : (() => { const candidate = candidates.find((item) => item._id === confirmation.draft.candidateId); const interviewer = interviewers.find((item) => item._id === confirmation.draft.interviewerId); return { title: "Confirm interview booking", label: "Schedule interview", description: <><strong>{candidate?.name}</strong> with <strong>{interviewer?.name}</strong><br />{new Date(confirmation.draft.timeBlock.start).toLocaleString()} – {new Date(confirmation.draft.timeBlock.end).toLocaleString()}</> }; })();
  return <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-800 sm:px-8"><div className="mx-auto max-w-6xl space-y-6"><header className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 px-6 py-8 text-white shadow-lg"><p className="text-sm font-semibold uppercase tracking-widest text-blue-300">Micro ATS</p><h1 className="mt-2 text-3xl font-bold">Interview scheduling dashboard</h1><p className="mt-2 max-w-2xl text-slate-300">Plan interviews confidently. Overlapping interviewer availability is blocked at the API.</p></header><ScheduleForm candidates={candidates} interviewers={interviewers} selectedCandidateId={selectedCandidateId} selectedInterviewerId={selectedInterviewerId} start={times.start} end={times.end} onCandidateChange={setSelectedCandidateId} onInterviewerChange={setSelectedInterviewerId} onTimesChange={setTimes} onAddPerson={(kind) => { setPersonDraft(emptyDraft); setPersonKind(kind); }} onSubmit={(draft) => setConfirmation({ type: "schedule", draft })} /><section className="grid gap-6 lg:grid-cols-5"><InterviewCalendar entries={entries} hasInterviewer={Boolean(selectedInterviewerId)} timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone} /><CandidatePipeline candidates={candidates} onStatusChange={(candidate, status) => setConfirmation({ type: "status", candidate, status })} /></section></div>{personKind && <PersonModal kind={personKind} draft={personDraft} onChange={setPersonDraft} onContinue={() => setConfirmation({ type: "person", kind: personKind, draft: personDraft })} onClose={() => setPersonKind(null)} />}{confirmation && details && <ConfirmModal title={details.title} description={details.description} confirmLabel={details.label} onConfirm={() => void confirm()} onCancel={() => setConfirmation(null)} busy={busy} />}</main>;
}
