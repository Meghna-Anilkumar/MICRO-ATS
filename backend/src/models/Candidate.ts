import mongoose, { Schema, Document } from "mongoose";

export interface ICandidate extends Document {
  name: string;
  email: string;
  status: "Applied" | "Technical Round" | "Offered";

  interviewSlots: {
    interviewerId: mongoose.Types.ObjectId;

    timeBlock: {
      start: Date;
      end: Date;
    };
  }[];
}

const CandidateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Technical Round",
        "Offered",
      ],
      default: "Applied",
    },

    interviewSlots: [
      {
        interviewerId: {
          type: Schema.Types.ObjectId,
          ref: "Interviewer",
          required: true,
        },

        timeBlock: {
          start: Date,
          end: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICandidate>(
  "Candidate",
  CandidateSchema
);