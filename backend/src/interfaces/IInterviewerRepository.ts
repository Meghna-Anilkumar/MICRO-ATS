import { IInterviewer } from "../models/Interviewer";
import { ITimeBlock } from ".";

export interface IInterviewerRepository {

    findAll(): Promise<IInterviewer[]>;

    findById(id: string): Promise<IInterviewer | null>;

    createInterviewer(data: { name: string; email: string }): Promise<IInterviewer>;

    reserveTimeBlock(id: string, timeBlock: ITimeBlock): Promise<IInterviewer | null>;

    releaseTimeBlock(id: string, timeBlock: ITimeBlock): Promise<void>;

}
