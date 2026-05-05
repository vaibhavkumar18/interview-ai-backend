const mongoose = require("mongoose");
const interviewRouter = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const generateInterviewReport = require("../services/ai.service");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middleware/file.middleware");

/**
 * @route POST /api/interview/generate-report
 * @desc Generate an interview report for a candidate based on their resume, self description and job description
 * @access Private
 */
interviewRouter.post(
  "/",
  authMiddleware.authUserMiddleware,
  upload.single("resume"),
  interviewController.generateInterviewReportController,
);

/**
 * @route GET /api/interview/report/:interviewId
 * @desc Get the interview report for a specific interview
 * @access Private
 */
interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUserMiddleware,
  interviewController.getInterviewReportByIdController,
);

/**
 * @route GET /api/interview/
 * @desc Get all interview reports for the authenticated user
 * @access Private
 */
interviewRouter.get(
  "/",
  authMiddleware.authUserMiddleware,
  interviewController.getAllInterviewReportsController,
);

/**
 * @route GET /api/interview/resume/pdf/:interviewReportId
 * @desc Generate a PDF version of the resume based on the interview report
 * @access Private
 */
interviewRouter.get(
  "/resume/pdf/:interviewReportId",
  authMiddleware.authUserMiddleware,
  interviewController.generateResumePDFController,
);

module.exports = interviewRouter;
