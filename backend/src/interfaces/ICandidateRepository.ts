import { ICandidate } from "../models/Candidate";
import { ITimeBlock } from ".";
import { IBaseRepository } from "./IBaseRepository";

export interface ICandidateRepository extends IBaseRepository<ICandidate> {

  addInterviewSlot(
    id: string,
    interviewerId: string,
    timeBlock: ITimeBlock
  ): Promise<ICandidate | null>;

  findOverlappingSlots(
    interviewerId: string,
    timeBlock: ITimeBlock
  ): Promise<ICandidate[]>;

  findAllWithInterviewers(): Promise<ICandidate[]>;
}
