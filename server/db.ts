import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  learnerActivityEvents,
  learnerProfiles,
  learningPaths,
  lessonProgress,
  practiceProgress,
  projectSubmissions,
  studentProjects,
  studentResourceSaves,
  studentNotes,
  tutorConversations,
  tutorMessages,
  users,
  workshopEnrollments,
  workspaceDrafts,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { storagePut } from "./storage";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  (["name", "email", "loginMethod"] as const).forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

type LessonContext = {
  courseSlug: string;
  courseTitle: string;
  lessonSlug: string;
  lessonTitle: string;
  totalLessons: number;
};

async function requireDatabase() {
  const db = await getDb();
  if (!db) throw new Error("CodeCraft storage is not available. Please try again shortly.");
  return db;
}

async function ensureLearnerProfile(userId: number, now: number) {
  const db = await requireDatabase();
  await db.insert(learnerProfiles).values({ userId, personalId: `CC-${String(userId).padStart(5, "0")}`, createdAt: now, updatedAt: now }).onDuplicateKeyUpdate({ set: { updatedAt: now } });
  return db;
}

export async function getLearnerProfile(userId: number) {
  const now = Date.now();
  const db = await ensureLearnerProfile(userId, now);
  const rows = await db.select().from(learnerProfiles).where(eq(learnerProfiles.userId, userId)).limit(1);
  return rows[0] ?? null;
}

export async function saveLearnerProfile(userId: number, input: {
  personalId: string;
  phone: string;
  bio: string;
  professionalRole: string;
  education: string;
  learningGoal: string;
  courseSpeed: "Steady" | "Focused" | "Intensive";
}) {
  const now = Date.now();
  const db = await ensureLearnerProfile(userId, now);
  await db.update(learnerProfiles).set({ ...input, updatedAt: now }).where(eq(learnerProfiles.userId, userId));
  return getLearnerProfile(userId);
}

async function ensureLearningPath(userId: number, context: LessonContext, now: number) {
  const db = await requireDatabase();
  await db.insert(learningPaths).values({
    userId,
    courseSlug: context.courseSlug,
    courseTitle: context.courseTitle,
    currentLessonTitle: context.lessonTitle,
    totalLessons: context.totalLessons,
    isActive: 1,
    createdAt: now,
    updatedAt: now,
  }).onDuplicateKeyUpdate({
    set: { currentLessonTitle: context.lessonTitle, totalLessons: context.totalLessons, isActive: 1, updatedAt: now },
  });
}

async function recordActivity(userId: number, eventType: string, description: string, occurredAt: number) {
  const db = await requireDatabase();
  await db.insert(learnerActivityEvents).values({ userId, eventType, description, occurredAt });
}

export async function getCodeCraftDashboard(userId: number) {
  const db = await requireDatabase();
  const [profile, activePath, completedResult, solvedResult, notesResult, activities, recentNotes] = await Promise.all([
    db.select().from(learnerProfiles).where(eq(learnerProfiles.userId, userId)).limit(1).then(rows => rows[0]),
    db.select().from(learningPaths).where(eq(learningPaths.userId, userId)).orderBy(desc(learningPaths.isActive), desc(learningPaths.updatedAt)).limit(1).then(rows => rows[0]),
    db.select({ total: sql<number>`count(*)` }).from(lessonProgress).where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.status, "complete"))),
    db.select({ total: sql<number>`count(*)` }).from(practiceProgress).where(and(eq(practiceProgress.userId, userId), eq(practiceProgress.status, "solved"))),
    db.select({ total: sql<number>`count(*)` }).from(studentNotes).where(eq(studentNotes.userId, userId)),
    db.select().from(learnerActivityEvents).where(eq(learnerActivityEvents.userId, userId)).orderBy(desc(learnerActivityEvents.occurredAt)).limit(4),
    db.select().from(studentNotes).where(eq(studentNotes.userId, userId)).orderBy(desc(studentNotes.updatedAt)).limit(3),
  ]);

  return {
    profile: profile ?? null,
    activePath: activePath ?? null,
    summary: {
      completedLessons: Number(completedResult[0]?.total ?? 0),
      solvedProblems: Number(solvedResult[0]?.total ?? 0),
      notesCount: Number(notesResult[0]?.total ?? 0),
      totalCraftPoints: profile?.totalCraftPoints ?? 0,
    },
    activities,
    recentNotes,
  };
}

export async function getWorkspacePreference(userId: number) {
  const db = await requireDatabase();
  const profiles = await db.select({ selectedTool: learnerProfiles.selectedWorkspaceTool }).from(learnerProfiles).where(eq(learnerProfiles.userId, userId)).limit(1);
  return { selectedTool: profiles[0]?.selectedTool ?? "java" };
}

export async function saveWorkspacePreference(userId: number, selectedTool: string) {
  const now = Date.now();
  const db = await ensureLearnerProfile(userId, now);
  await db.update(learnerProfiles).set({ selectedWorkspaceTool: selectedTool, updatedAt: now }).where(eq(learnerProfiles.userId, userId));
  return { selectedTool };
}

export async function getWorkspaceDraft(userId: number, lessonSlug: string) {
  const db = await requireDatabase();
  const rows = await db.select().from(workspaceDrafts).where(and(eq(workspaceDrafts.userId, userId), eq(workspaceDrafts.lessonSlug, lessonSlug))).limit(1);
  return rows[0] ?? null;
}

export async function saveWorkspaceDraft(userId: number, payload: LessonContext & { language: string; sourceCode: string; outputText?: string; ranAt?: number }) {
  const now = Date.now();
  const db = await ensureLearnerProfile(userId, now);
  await ensureLearningPath(userId, payload, now);
  await db.insert(workspaceDrafts).values({
    userId,
    lessonSlug: payload.lessonSlug,
    language: payload.language,
    sourceCode: payload.sourceCode,
    outputText: payload.outputText ?? null,
    lastRunAt: payload.ranAt ?? null,
    updatedAt: now,
  }).onDuplicateKeyUpdate({
    set: { language: payload.language, sourceCode: payload.sourceCode, outputText: payload.outputText ?? null, lastRunAt: payload.ranAt ?? null, updatedAt: now },
  });
  await recordActivity(userId, "workspace_saved", `Saved a ${payload.language} draft for ${payload.lessonTitle}`, now);
  return { savedAt: now };
}

export async function completeLesson(userId: number, payload: LessonContext) {
  const now = Date.now();
  const db = await ensureLearnerProfile(userId, now);
  await ensureLearningPath(userId, payload, now);
  const existing = await db.select().from(lessonProgress).where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonSlug, payload.lessonSlug))).limit(1);
  const wasAlreadyComplete = existing[0]?.status === "complete";

  await db.insert(lessonProgress).values({
    userId,
    courseSlug: payload.courseSlug,
    lessonSlug: payload.lessonSlug,
    lessonTitle: payload.lessonTitle,
    status: "complete",
    progressPercent: 100,
    completedAt: now,
    updatedAt: now,
  }).onDuplicateKeyUpdate({ set: { status: "complete", progressPercent: 100, completedAt: now, updatedAt: now } });

  if (!wasAlreadyComplete) {
    const path = await db.select().from(learningPaths).where(and(eq(learningPaths.userId, userId), eq(learningPaths.courseSlug, payload.courseSlug))).limit(1);
    const completedLessons = Math.min((path[0]?.completedLessons ?? 0) + 1, payload.totalLessons);
    const progressPercent = Math.round((completedLessons / payload.totalLessons) * 100);
    await db.update(learningPaths).set({ completedLessons, progressPercent, updatedAt: now }).where(and(eq(learningPaths.userId, userId), eq(learningPaths.courseSlug, payload.courseSlug)));
    await db.update(learnerProfiles).set({ totalCraftPoints: sql`${learnerProfiles.totalCraftPoints} + 100`, updatedAt: now }).where(eq(learnerProfiles.userId, userId));
    await recordActivity(userId, "lesson_completed", `Completed ${payload.lessonTitle}`, now);
  }
  return { wasAlreadyComplete };
}

export async function createStudentNote(userId: number, input: { title: string; content: string; courseSlug?: string; lessonSlug?: string; tags?: string[] }) {
  const now = Date.now();
  const db = await ensureLearnerProfile(userId, now);
  await db.insert(studentNotes).values({
    userId,
    title: input.title,
    content: input.content,
    courseSlug: input.courseSlug ?? null,
    lessonSlug: input.lessonSlug ?? null,
    tagsJson: input.tags?.length ? JSON.stringify(input.tags) : null,
    createdAt: now,
    updatedAt: now,
  });
  await recordActivity(userId, "note_created", `Saved a note: ${input.title}`, now);
  return { savedAt: now };
}

export async function listStudentProjects(userId: number) {
  const db = await requireDatabase();
  return db.select().from(studentProjects).where(eq(studentProjects.userId, userId)).orderBy(desc(studentProjects.updatedAt));
}

export async function createStudentProject(userId: number, input: { title: string; description?: string; techStack: string[]; repositoryUrl?: string; demoUrl?: string }) {
  const now = Date.now();
  const db = await ensureLearnerProfile(userId, now);
  const result = await db.insert(studentProjects).values({
    userId,
    title: input.title,
    description: input.description || null,
    techStackJson: JSON.stringify(input.techStack),
    repositoryUrl: input.repositoryUrl || null,
    demoUrl: input.demoUrl || null,
    createdAt: now,
    updatedAt: now,
  });
  const projectId = Number(result[0].insertId);
  await recordActivity(userId, "project_created", `Created project: ${input.title}`, now);
  return { projectId, createdAt: now };
}

async function requireOwnedProject(userId: number, projectId: number) {
  const db = await requireDatabase();
  const rows = await db.select().from(studentProjects).where(and(eq(studentProjects.id, projectId), eq(studentProjects.userId, userId))).limit(1);
  if (!rows[0]) throw new Error("This project was not found in your workspace.");
  return { db, project: rows[0] };
}

function parseDataUrl(dataUrl: string) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("The uploaded file format was not recognised.");
  return { mimeType: match[1], bytes: Buffer.from(match[2], "base64") };
}

function safeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(-180) || "submission-file";
}

export async function submitStudentProject(userId: number, input: { projectId: number; submissionNote?: string; fileName?: string; fileDataUrl?: string; fileMimeType?: string }) {
  const now = Date.now();
  const { db, project } = await requireOwnedProject(userId, input.projectId);
  let attachmentKey: string | null = null;
  let attachmentUrl: string | null = null;
  let attachmentName: string | null = null;

  if (input.fileDataUrl && input.fileName) {
    const parsed = parseDataUrl(input.fileDataUrl);
    if (parsed.bytes.byteLength > 2_000_000) throw new Error("Please upload a file smaller than 2 MB.");
    attachmentName = safeFileName(input.fileName);
    const upload = await storagePut(`students/${userId}/projects/${project.id}/${now}-${attachmentName}`, parsed.bytes, input.fileMimeType || parsed.mimeType);
    attachmentKey = upload.key;
    attachmentUrl = upload.url;
  }

  await db.insert(projectSubmissions).values({
    projectId: project.id,
    userId,
    submissionNote: input.submissionNote || null,
    attachmentKey,
    attachmentUrl,
    attachmentName,
    submittedAt: now,
  });
  await db.update(studentProjects).set({ status: "submitted", submittedAt: now, updatedAt: now }).where(eq(studentProjects.id, project.id));
  await recordActivity(userId, "project_submitted", `Submitted project: ${project.title}`, now);
  return { submittedAt: now, attachmentUrl };
}

export async function publishStudentProject(userId: number, projectId: number) {
  const now = Date.now();
  const { db, project } = await requireOwnedProject(userId, projectId);
  await db.update(studentProjects).set({ status: "published", publishedAt: now, updatedAt: now }).where(eq(studentProjects.id, project.id));
  await recordActivity(userId, "project_published", `Marked project ready to publish: ${project.title}`, now);
  return { publishedAt: now };
}

export async function getSavedResourceIds(userId: number) {
  const db = await requireDatabase();
  const saved = await db.select({ resourceId: studentResourceSaves.resourceId }).from(studentResourceSaves).where(eq(studentResourceSaves.userId, userId));
  return saved.map(row => row.resourceId);
}

export async function saveStudentResource(userId: number, resourceId: string) {
  const now = Date.now();
  const db = await ensureLearnerProfile(userId, now);
  await db.insert(studentResourceSaves).values({ userId, resourceId, savedAt: now }).onDuplicateKeyUpdate({ set: { savedAt: now } });
  await recordActivity(userId, "resource_saved", "Saved a study resource to the library", now);
  return { savedAt: now };
}

export async function joinStudentWorkshop(userId: number, input: { workshopSlug: string; workshopTitle: string; workshopDate: number }) {
  const now = Date.now();
  const db = await ensureLearnerProfile(userId, now);
  await db.insert(workshopEnrollments).values({ userId, ...input, joinedAt: now }).onDuplicateKeyUpdate({ set: { joinedAt: now } });
  await recordActivity(userId, "workshop_joined", `Joined free workshop: ${input.workshopTitle}`, now);
  return { joinedAt: now };
}

export async function listStudentWorkshops(userId: number) {
  const db = await requireDatabase();
  return db.select().from(workshopEnrollments).where(eq(workshopEnrollments.userId, userId)).orderBy(desc(workshopEnrollments.workshopDate));
}

export async function listTutorConversations(userId: number) {
  const db = await requireDatabase();
  return db.select().from(tutorConversations).where(eq(tutorConversations.userId, userId)).orderBy(desc(tutorConversations.updatedAt)).limit(12);
}

export async function getTutorConversation(userId: number, conversationId: number) {
  const db = await requireDatabase();
  const conversationRows = await db.select().from(tutorConversations).where(and(eq(tutorConversations.id, conversationId), eq(tutorConversations.userId, userId))).limit(1);
  if (!conversationRows[0]) throw new Error("This tutor conversation was not found in your study space.");
  const messages = await db.select().from(tutorMessages).where(and(eq(tutorMessages.conversationId, conversationId), eq(tutorMessages.userId, userId))).orderBy(tutorMessages.createdAt);
  return { conversation: conversationRows[0], messages };
}

export async function createTutorConversation(userId: number, input: { title: string; topic: string; workspaceTool?: string }) {
  const now = Date.now();
  const db = await ensureLearnerProfile(userId, now);
  const result = await db.insert(tutorConversations).values({ userId, title: input.title, topic: input.topic, workspaceTool: input.workspaceTool || null, createdAt: now, updatedAt: now });
  return { conversationId: Number(result[0].insertId), createdAt: now };
}

export async function addTutorMessage(userId: number, input: { conversationId: number; role: "student" | "assistant"; content: string }) {
  const now = Date.now();
  await getTutorConversation(userId, input.conversationId);
  const db = await requireDatabase();
  await db.insert(tutorMessages).values({ userId, ...input, createdAt: now });
  await db.update(tutorConversations).set({ updatedAt: now }).where(eq(tutorConversations.id, input.conversationId));
  return { createdAt: now };
}
