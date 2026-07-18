export interface ITimeBlock {
  start: Date;
  end: Date;
}

export interface IScheduleRequest {
  candidateId: string;
  interviewerId: string;
  timeBlock: ITimeBlock;
  status?: 'Applied' | 'Technical Round' | 'Offered';
}

export interface IConflict {
  candidateName: string;
  timeBlock: ITimeBlock;
}