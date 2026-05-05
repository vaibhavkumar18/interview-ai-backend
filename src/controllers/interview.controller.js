const pdfParse = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePDF,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Generate an interview report for a candidate based on their resume, self description and job description
 * @param {*} req
 * @param {*} res
 */
async function generateInterviewReportController(req, res) {
  const resumeFile = req.file;
  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(resumeFile.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body;
  const interviewReportByAI = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAI,
  });

  res.status(200).json({
    success: true,
    message: "Interview report generated successfully",
    data: interviewReport,
  });
}

/**
 * @description Get the interview report for a specific interview
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      success: false,
      message: "Interview report not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Interview report retrieved successfully",
    data: interviewReport,
  });
}

/**
 * @description Get all interview reports for the authenticated user
 * @param {*} req
 * @param {*} res
 */

async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -_v -technicalQuestions.answer -behavioralQuestions -behavioralQuestions -skillGaps -preparationPlan ",
    );
  res.status(200).json({
    success: true,
    message: "Interview reports retrieved successfully",
    data: interviewReports,
  });
}

/**
 * @description Generate a resume PDF for a candidate based on their resume, self description and job description
 * @param {*} req
 * @param {*} res
 */
async function generateResumePDFController(req, res) {
  const { interviewReportId } = req.params;
  const interviewReport = await interviewReportModel.findOne({
    _id: interviewReportId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      success: false,
      message: "Interview report not found",
    });
  }
  const { resume, selfDescription, jobDescription } = interviewReport;
  const pdfBuffer = await generateResumePDF({
    resume: resume,
    selfDescription: selfDescription,
    jobDescription: jobDescription,
  });
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="resume_${interviewReportId}.pdf"`,
    "Content-Length": pdfBuffer.length,
  });
  res.status(200).send(pdfBuffer);
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePDFController,
};
