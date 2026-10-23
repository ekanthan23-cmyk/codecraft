import { z } from "zod";

const lessonContextInput = z.object({
  courseSlug: z.string().trim().min(1).max(120),
  courseTitle: z.string().trim().min(1).max(180),
  lessonSlug: z.string().trim().min(1).max(150),
  lessonTitle: z.string().trim().min(1).max(180),
  totalLessons: z.number().int().min(1).max(500),
});

export const workspaceDraftInput = lessonContextInput.extend({
  language: z.string().trim().min(1).max(40),
  sourceCode: z.string().min(1).max(100_000),
  outputText: z.string().max(50_000).optional(),
  ranAt: z.number().int().positive().optional(),
});

export const completeLessonInput = lessonContextInput;

export const studentNoteInput = z.object({
  title: z.string().trim().min(1).max(180),
  content: z.string().trim().min(1).max(30_000),
  courseSlug: z.string().trim().max(120).optional(),
  lessonSlug: z.string().trim().max(150).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(12).optional(),
});

export const workspaceToolInput = z.object({
  selectedTool: z.enum(["java", "python", "cpp", "html", "css", "javascript", "react", "sql"]),
});

export const learnerProfileInput = z.object({
  personalId: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(40),
  bio: z.string().trim().max(2_000),
  professionalRole: z.string().trim().min(2).max(160),
  education: z.string().trim().max(180),
  learningGoal: z.string().trim().min(2).max(240),
  courseSpeed: z.enum(["Steady", "Focused", "Intensive"]),
});

const optionalUrl = z.union([z.string().trim().url().max(700), z.literal("")]).optional();

export const studentProjectInput = z.object({
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(10_000).optional(),
  techStack: z.array(z.string().trim().min(1).max(50)).min(1).max(12),
  repositoryUrl: optionalUrl,
  demoUrl: optionalUrl,
});

export const projectIdInput = z.object({ projectId: z.number().int().positive() });

export const projectSubmissionInput = projectIdInput.extend({
  submissionNote: z.string().trim().max(10_000).optional(),
  fileName: z.string().trim().min(1).max(220).optional(),
  fileDataUrl: z.string().max(3_000_000).optional(),
  fileMimeType: z.string().trim().max(120).optional(),
});

export const resourceSaveInput = z.object({ resourceId: z.string().trim().min(1).max(160) });

export const workshopJoinInput = z.object({
  workshopSlug: z.string().trim().min(1).max(160),
  workshopTitle: z.string().trim().min(2).max(220),
  workshopDate: z.number().int().positive(),
});

export const tutorQuestionInput = z.object({
  conversationId: z.number().int().positive().optional(),
  question: z.string().trim().min(2).max(6_000),
  topic: z.enum(["dsa", "java", "python", "cpp", "web", "react", "sql", "project", "general"]).default("general"),
  workspaceTool: z.string().trim().max(40).optional(),
});

export const tutorConversationInput = z.object({ conversationId: z.number().int().positive() });
