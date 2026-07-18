import { ICandidate } from "../models/Candidate";
import { ITimeBlock } from ".";

export interface ICandidateRepository {
  createCandidate(data: { name: string; email: string }): Promise<ICandidate>;

  findById(id: string): Promise<ICandidate | null>;

  updateStatus(
    id: string,
    status: string
  ): Promise<ICandidate | null>;

  addInterviewSlot(
    id: string,
    interviewerId: string,
    timeBlock: ITimeBlock
  ): Promise<ICandidate | null>;

  findOverlappingSlots(
    interviewerId: string,
    timeBlock: ITimeBlock
  ): Promise<ICandidate[]>;

  findAll(): Promise<ICandidate[]>;
}
