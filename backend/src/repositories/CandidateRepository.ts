import Candidate, { ICandidate } from "../models/Candidate";
import BaseRepository from "./BaseRepository";
import { ICandidateRepository } from "../interfaces/ICandidateRepository";
import { ITimeBlock } from "../interfaces";

class CandidateRepository
  extends BaseRepository<ICandidate>
  implements ICandidateRepository {
  constructor() {
    super(Candidate);
  }

  async createCandidate(data: { name: string; email: string }): Promise<ICandidate> {
    return this.create(data);
  }

  async findAll() {
    return this.model
      .find()
      .populate("interviewSlots.interviewerId");
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async addInterviewSlot(
    candidateId: string,
    interviewerId: string,
    timeBlock: ITimeBlock
  ) {

    return this.model.findByIdAndUpdate(
      candidateId,
      {
        $push: {
          interviewSlots: {
            interviewerId,
            timeBlock
          }
        }
      },
      {
        new: true
      }
    );
  }

  async updateStatus(
    candidateId: string,
    status: string
  ) {
    return this.model.findByIdAndUpdate(
      candidateId,
      {
        status
      },
      {
        new: true
      }
    );
  }

  async findOverlappingSlots(
    interviewerId: string,
    timeBlock: ITimeBlock
  ) {

    return this.model.find({

      interviewSlots: {

        $elemMatch: {

          interviewerId,

          "timeBlock.start": {
            $lt: timeBlock.end
          },

          "timeBlock.end": {
            $gt: timeBlock.start
          }

        }

      }

    });

  }


}

export default CandidateRepository;
