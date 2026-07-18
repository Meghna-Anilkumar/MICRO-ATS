import { IInterviewer } from "../models/Interviewer";
import { IInterviewerRepository } from "../interfaces/IInterviewerRepository";
import { IInterviewerService } from "../interfaces/IInterviewerService";

export default class InterviewerService implements IInterviewerService {

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

        return this.interviewerRepository.create({
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
        });
    }

}
