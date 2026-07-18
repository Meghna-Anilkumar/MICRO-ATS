import Interviewer from "../models/Interviewer";
import { IInterviewer } from "../models/Interviewer";
import BaseRepository from "./BaseRepository";
import { ITimeBlock } from "../interfaces";

export default class InterviewerRepository extends BaseRepository<IInterviewer> {

  constructor() {
    super(Interviewer);
  }

  async findAll(): Promise<IInterviewer[]> {
    return this.model.find();
  }

  async findById(id: string): Promise<IInterviewer | null> {
    return this.model.findById(id);
  }

  async createInterviewer(data: { name: string; email: string }): Promise<IInterviewer> {
    return this.create(data);
  }

  async reserveTimeBlock(id: string, timeBlock: ITimeBlock): Promise<IInterviewer | null> {
    return this.model.findOneAndUpdate(
      {
        _id: id,
        availability: {
          $not: {
            $elemMatch: {
              start: { $lt: timeBlock.end },
              end: { $gt: timeBlock.start },
            },
          },
        },
      },
      { $push: { availability: timeBlock } },
      { new: true }
    );
  }

  async releaseTimeBlock(id: string, timeBlock: ITimeBlock): Promise<void> {
    await this.model.updateOne(
      { _id: id },
      { $pull: { availability: { start: timeBlock.start, end: timeBlock.end } } }
    );
  }
}
