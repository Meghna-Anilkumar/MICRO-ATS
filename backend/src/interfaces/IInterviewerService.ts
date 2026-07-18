import { IInterviewer } from "../models/Interviewer";

export interface IInterviewerService {
  getInterviewers(): Promise<IInterviewer[]>;

  createInterviewer(data: { name: string; email: string }): Promise<IInterviewer>;
}
