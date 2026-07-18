import { IInterviewer } from "../models/Interviewer";
import { ITimeBlock } from ".";
import { IBaseRepository } from "./IBaseRepository";

export interface IInterviewerRepository extends IBaseRepository<IInterviewer> {

    reserveTimeBlock(id: string, timeBlock: ITimeBlock): Promise<IInterviewer | null>;

    releaseTimeBlock(id: string, timeBlock: ITimeBlock): Promise<void>;

}
