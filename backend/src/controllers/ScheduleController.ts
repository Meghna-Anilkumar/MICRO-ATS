import { Request, Response } from "express";
import { ICandidateService } from "../interfaces/ICandidateService";
import { isAppError } from "../utils/isAppError";
import InterviewerService from "../services/InterviewerService";

export default class ScheduleController {
  constructor(
    private candidateService: ICandidateService,
    private interviewerService: InterviewerService
  ) { }

  createCandidate = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const candidate = await this.candidateService.createCandidate({ name, email });
    res.status(201).json({ success: true, candidate });
  } catch (error: any) {
    const status = error?.code === 11000 ? 409 : 400;
    res.status(status).json({ success: false, message: error?.code === 11000 ? "A candidate with this email already exists" : error.message });
  }
};

createInterviewer = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const interviewer = await this.interviewerService.createInterviewer({ name, email });
    res.status(201).json({ success: true, interviewer });
  } catch (error: any) {
    const status = error?.code === 11000 ? 409 : 400;
    res.status(status).json({ success: false, message: error?.code === 11000 ? "An interviewer with this email already exists" : error.message });
  }
};

  scheduleInterview = async (req: Request, res: Response) => {

    try {

      const candidate =
        await this.candidateService.scheduleInterview(req.body);

      res.status(201).json(candidate);

    }

    catch (error) {

      if (isAppError(error)) {

        return res
          .status(error.status)
          .json(error);

      }

      console.error("Failed to schedule interview:", error);
      res.status(500).json({
        success: false,
        message: "Unable to schedule the interview. Check the API logs for details."
      });

    }

  }

  getInterviewers = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const interviewers =
        await this.interviewerService.getInterviewers();

      res.status(200).json(interviewers);
    } catch (error: unknown) {
      console.error(error);

      if (isAppError(error)) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

  getCandidates = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const candidates =
        await this.candidateService.getCandidates();

      res.status(200).json(candidates);
    } catch {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };



  getCandidate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = req.params.id as string;

      const candidate =
        await this.candidateService.getCandidate(id);

      res.status(200).json({
        success: true,
        candidate,
      });
    } catch (error: unknown) {
      console.error(error);

      if (isAppError(error)) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

  updateCandidateStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({
          success: false,
          message: "Status is required",
        });
        return;
      }

      const candidate =
        await this.candidateService.updateCandidateStatus(
          id,
          status
        );

      res.status(200).json({
        success: true,
        message: "Candidate status updated successfully",
        candidate,
      });
    } catch (error: unknown) {
      console.error(error);

      if (isAppError(error)) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
}
