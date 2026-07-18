import mongoose, { Schema, Document } from 'mongoose';

export interface IInterviewer extends Document {
  name: string;
  email: string;
  availability: Array<{
    start: Date;
    end: Date;
  }>;
}

const InterviewerSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  availability: [{
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  }]
});

export default mongoose.model<IInterviewer>('Interviewer', InterviewerSchema);