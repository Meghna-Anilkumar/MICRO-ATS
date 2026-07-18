import { IInterviewer } from "../models/Interviewer";
import { IInterviewerRepository } from "../interfaces/IInterviewerRepository";

export default class InterviewerService {

    constructor(
        private interviewerRepository: IInterviewerRepository
    ) {}

    async getInterviewers(): Promise<IInterviewer[]> {

        return this.interviewerRepository.findAll();

    }

    async createInterviewer(data: { name: string; email: string }): Promise<IInterviewer> {
        if (!data.name?.trim() || !data.email?.trim()) {
            throw new Error("Name and email are required");
        }

        return this.interviewerRepository.createInterviewer({
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
        });
    }

}
