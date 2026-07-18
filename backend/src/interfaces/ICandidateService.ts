import { IScheduleRequest } from ".";
import { ICandidate } from "../models/Candidate";

export interface ICandidateService {
  createCandidate(data: { name: string; email: string }): Promise<ICandidate>;

  scheduleInterview(
    data: IScheduleRequest
  ): Promise<ICandidate>;

  getCandidate(
    id: string
  ): Promise<ICandidate>;

  updateCandidateStatus(
    id: string,
    status: string
  ): Promise<ICandidate>;

  getCandidates(): Promise<ICandidate[]>;
}
