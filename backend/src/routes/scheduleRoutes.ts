import { Router } from "express";
import ScheduleController from "../controllers/ScheduleController";
import CandidateRepository from "../repositories/CandidateRepository";
import CandidateService from "../services/CandidateService";
import InterviewerRepository from "../repositories/InterviewerRepository";
import InterviewerService from "../services/InterviewerService";

const router = Router();

const candidateRepository =
    new CandidateRepository();

const interviewerRepository =
    new InterviewerRepository();

const candidateService =
    new CandidateService(candidateRepository, interviewerRepository);

const interviewerService =
    new InterviewerService(interviewerRepository);

const scheduleController =
    new ScheduleController(
        candidateService,
        interviewerService
    );

router.get(
  "/candidates",
  scheduleController.getCandidates
);

router.get(
  "/interviewers",
  scheduleController.getInterviewers
);

router.get(
  "/candidates/:id",
  scheduleController.getCandidate
);

router.post(
  "/schedule",
  scheduleController.scheduleInterview
);

router.patch(
  "/candidates/:id/status",
  scheduleController.updateCandidateStatus
);

router.post("/candidates", scheduleController.createCandidate);
router.post("/interviewers", scheduleController.createInterviewer);
export default router;
