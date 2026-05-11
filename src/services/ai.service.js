const { GoogleGenAI } = require("@google/genai");
const config = require("../config/config");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: config.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["Low", "Medium", "High"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);
}

async function generatePDFfromHTML(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: puppeteer.executablePath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(htmlContent, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}
async function generateResumePDF({ resume, selfDescription, jobDescription }) {
  const resumePDFSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
      ),
  });

  const prompt = `Generate a resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        The format of the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the job description provided, highlighting the relevant skills and experiences of the candidate. The resume should be well-formatted and visually appealing. Use appropriate HTML tags and inline CSS styles to format the resume content.
                        The content of the resume should be not sound like it's generated by AI, it should be natural and human-like. Avoid using generic phrases and buzzwords, instead focus on providing specific details and achievements in the resume. The resume should be concise and to the point, ideally fitting within 1-2 pages when converted to PDF.
                        You can highlight the content using some colors or different font sizes, but avoid making it look too flashy or unprofessional. The resume should have a clean and modern design, with clear sections for experience, education, skills, and other relevant information.
                        The content should ATS friendly, meaning it should be easily parsable by Applicant Tracking Systems used by recruiters. Avoid using complex layouts or graphics that might confuse ATS, and focus on providing clear and structured information in the resume.
                        The resume should not be so lengthy, it should idealy be 1-2 pages long when converted to PDF, so focus on including only the most relevant and impactful information in the resume, and avoid adding unnecessary details or fluff focus on quality over quantity. The resume should be tailored for the specific job description provided, so make sure to highlight the skills and experiences that are most relevant to the job, and downplay or omit information that is not as relevant. The resume should be well-organized and easy to read, with clear headings and sections for different types of information. Use bullet points and concise language to make the resume easy to skim and understand quickly.

                        Additional concise instructions:
                        - Return only valid JSON with a single key named "html".
                        - Keep the HTML compact and well-formed with minimal whitespace, extra blank lines, or unnecessary indentation.
                        - Use semantic HTML and inline CSS only if needed.
                        - Do not include markdown, code fences, comments, or any text outside the JSON object.
                        - Make the HTML self-contained so Puppeteer can parse and render it cleanly.
                        - Prefer a clean, professional layout with short sections, tight spacing, and no fluffy spacing.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePDFSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);
  const pdfBuffer = await generatePDFfromHTML(jsonContent.html);
  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePDF };
