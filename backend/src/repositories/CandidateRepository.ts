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

  async findAllWithInterviewers(): Promise<ICandidate[]> {
    return this.model
      .find()
      .populate("interviewSlots.interviewerId");
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
