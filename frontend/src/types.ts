export interface TimeBlock {
  start: string;
  end: string;
}

export interface InterviewSlot {
  interviewerId: string | { _id: string };
  timeBlock: TimeBlock;
}

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  status: string;
  interviewSlots: InterviewSlot[];
}

export interface Interviewer {
  _id: string;
  name: string;
  email: string;
}

export type PersonKind = "candidate" | "interviewer";
export type PersonDraft = { name: string; email: string };
export type ScheduleDraft = { candidateId: string; interviewerId: string; timeBlock: TimeBlock };
