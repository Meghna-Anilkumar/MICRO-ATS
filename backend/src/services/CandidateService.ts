import { ICandidate } from "../models/Candidate";
import mongoose from "mongoose";
import { ICandidateRepository } from "../interfaces/ICandidateRepository";
import { IInterviewerRepository } from "../interfaces/IInterviewerRepository";
import { ICandidateService } from "../interfaces/ICandidateService";
import {
    IConflict,
    IScheduleRequest,
} from "../interfaces";

export default class CandidateService
    implements ICandidateService {
    constructor(
        private candidateRepository: ICandidateRepository,
        private interviewerRepository: IInterviewerRepository
    ) { }

    async createCandidate(data: { name: string; email: string }) {
        if (!data.name?.trim() || !data.email?.trim()) {
            throw new Error("Name and email are required");
        }
        return this.candidateRepository.create({
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
        });
    }

    async scheduleInterview(
        data: IScheduleRequest
    ): Promise<ICandidate> {
        const start = new Date(data.timeBlock?.start);
        const end = new Date(data.timeBlock?.end);

        if (
            !data.candidateId ||
            !data.interviewerId ||
            !mongoose.isObjectIdOrHexString(data.candidateId) ||
            !mongoose.isObjectIdOrHexString(data.interviewerId) ||
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            start >= end
        ) {
            throw { status: 400, success: false, message: "Provide a candidate, interviewer, and a valid time range" };
        }

        data.timeBlock = { start, end };
        const candidateExists = await this.candidateRepository.findById(data.candidateId);
        if (!candidateExists) {
            throw { status: 404, success: false, message: "Candidate not found" };
        }

        const interviewerExists = await this.interviewerRepository.findById(data.interviewerId);
        if (!interviewerExists) {
            throw { status: 404, success: false, message: "Interviewer not found" };
        }

        const overlap =
            await this.candidateRepository.findOverlappingSlots(
                data.interviewerId,
                data.timeBlock
            );

        if (overlap.length > 0) {
            const conflictingSlot = overlap[0].interviewSlots.find((slot) =>
                String(slot.interviewerId ?? "") === data.interviewerId &&
                slot.timeBlock.start < end && slot.timeBlock.end > start
            );

            if (conflictingSlot) {
                const conflict: IConflict = {
                    candidateName: overlap[0].name,
                    timeBlock: conflictingSlot.timeBlock,
                };

                throw {
                    status: 409,
                    success: false,
                    message: "Interviewer already booked",
                    conflict,
                };
            }
        }

        // This conditional update is an atomic lock for this interviewer. It closes
        // the race where two requests pass the overlap read at the same time.
        const reservation = await this.interviewerRepository.reserveTimeBlock(
            data.interviewerId,
            data.timeBlock
        );

        if (!reservation) {
            const conflicts = await this.candidateRepository.findOverlappingSlots(
                data.interviewerId,
                data.timeBlock
            );
            const conflictingCandidate = conflicts[0];
            const conflictingSlot = conflictingCandidate?.interviewSlots.find((slot) =>
                String(slot.interviewerId ?? "") === data.interviewerId &&
                slot.timeBlock.start < end && slot.timeBlock.end > start
            );

            throw {
                status: 409,
                success: false,
                message: "Interviewer already booked",
                conflict: conflictingCandidate && conflictingSlot ? {
                    candidateName: conflictingCandidate.name,
                    timeBlock: conflictingSlot.timeBlock,
                } : undefined,
            };
        }

        let candidate: ICandidate | null;
        try {
            candidate = await this.candidateRepository.addInterviewSlot(
                data.candidateId,
                data.interviewerId,
                data.timeBlock
            );
        } catch (error) {
            await this.interviewerRepository.releaseTimeBlock(data.interviewerId, data.timeBlock);
            throw error;
        }

        if (!candidate) {
            await this.interviewerRepository.releaseTimeBlock(data.interviewerId, data.timeBlock);
            throw {
                status: 404,
                success: false,
                message: "Candidate not found",
            };
        }

        return candidate;
    }

    async getCandidate(id: string): Promise<ICandidate> {
        const candidate =
            await this.candidateRepository.findById(id);

        if (!candidate) {
            throw {
                status: 404,
                success: false,
                message: "Candidate not found",
            };
        }

        return candidate;
    }

    async updateCandidateStatus(
        id: string,
        status: string
    ): Promise<ICandidate> {
        const allowedStatuses = ["Applied", "Technical Round", "Offered"] as const;
        if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
            throw { status: 400, success: false, message: "Invalid candidate status" };
        }

        const candidate = await this.candidateRepository.update(id, {
            status: status as ICandidate["status"],
        });

        if (!candidate) {
            throw {
                status: 404,
                success: false,
                message: "Candidate not found",
            };
        }

        return candidate;
    }

    async getCandidates(): Promise<ICandidate[]> {
        return this.candidateRepository.findAllWithInterviewers();
    }
}
