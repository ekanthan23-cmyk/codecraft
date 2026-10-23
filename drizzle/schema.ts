import { bigint, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/** Core user identity created through Manus OAuth. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/** Learner-owned aggregate information, separate from authentication identity. */
export const learnerProfiles = mysqlTable("learnerProfiles", {
  userId: int("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  personalId: varchar("personalId", { length: 80 }),
  phone: varchar("phone", { length: 40 }),
  bio: text("bio"),
  professionalRole: varchar("professionalRole", { length: 160 }),
  education: varchar("education", { length: 180 }),
  learningGoal: varchar("learningGoal", { length: 240 }),
  courseSpeed: varchar("courseSpeed", { length: 40 }),
  targetRole: varchar("targetRole", { length: 120 }),
  selectedWorkspaceTool: varchar("selectedWorkspaceTool", { length: 40 }).notNull().default("java"),
  learningStreak: int("learningStreak").notNull().default(0),
  totalCraftPoints: int("totalCraftPoints").notNull().default(0),
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
});

/** A learning path a learner has explicitly started. */
export const learningPaths = mysqlTable("learningPaths", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  courseTitle: varchar("courseTitle", { length: 180 }).notNull(),
  currentLessonTitle: varchar("currentLessonTitle", { length: 180 }),
  completedLessons: int("completedLessons").notNull().default(0),
  totalLessons: int("totalLessons").notNull().default(0),
  progressPercent: int("progressPercent").notNull().default(0),
  isActive: int("isActive").notNull().default(1),
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
}, table => [
  uniqueIndex("learning_paths_user_course_unique").on(table.userId, table.courseSlug),
  index("learning_paths_user_updated_idx").on(table.userId, table.updatedAt),
]);

/** Per-lesson progress allows completion metrics to be derived from real learner activity. */
export const lessonProgress = mysqlTable("lessonProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseSlug: varchar("courseSlug", { length: 120 }).notNull(),
  lessonSlug: varchar("lessonSlug", { length: 150 }).notNull(),
  lessonTitle: varchar("lessonTitle", { length: 180 }).notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "complete"]).notNull().default("not_started"),
  progressPercent: int("progressPercent").notNull().default(0),
  completedAt: bigint("completedAt", { mode: "number" }),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
}, table => [
  uniqueIndex("lesson_progress_user_lesson_unique").on(table.userId, table.lessonSlug),
  index("lesson_progress_user_course_idx").on(table.userId, table.courseSlug),
]);

/** Personal notes are private to the learner who created them. */
export const studentNotes = mysqlTable("studentNotes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 180 }).notNull(),
  content: text("content").notNull(),
  courseSlug: varchar("courseSlug", { length: 120 }),
  lessonSlug: varchar("lessonSlug", { length: 150 }),
  tagsJson: text("tagsJson"),
  isPinned: int("isPinned").notNull().default(0),
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
}, table => [
  index("student_notes_user_updated_idx").on(table.userId, table.updatedAt),
]);

/** Learner-owned outcomes for coding-practice problems. */
export const practiceProgress = mysqlTable("practiceProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  problemSlug: varchar("problemSlug", { length: 160 }).notNull(),
  problemTitle: varchar("problemTitle", { length: 220 }).notNull(),
  topic: varchar("topic", { length: 80 }),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).notNull().default("easy"),
  status: mysqlEnum("status", ["attempted", "solved"]).notNull().default("attempted"),
  attempts: int("attempts").notNull().default(0),
  solvedAt: bigint("solvedAt", { mode: "number" }),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
}, table => [
  uniqueIndex("practice_progress_user_problem_unique").on(table.userId, table.problemSlug),
  index("practice_progress_user_status_idx").on(table.userId, table.status),
]);

/** The latest editable source and output for a learner's lesson workspace. */
export const workspaceDrafts = mysqlTable("workspaceDrafts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  lessonSlug: varchar("lessonSlug", { length: 150 }).notNull(),
  language: varchar("language", { length: 40 }).notNull(),
  sourceCode: text("sourceCode").notNull(),
  outputText: text("outputText"),
  lastRunAt: bigint("lastRunAt", { mode: "number" }),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
}, table => [
  uniqueIndex("workspace_drafts_user_lesson_unique").on(table.userId, table.lessonSlug),
  index("workspace_drafts_user_updated_idx").on(table.userId, table.updatedAt),
]);

/** A compact, durable activity log that powers the learner's own dashboard timeline. */
export const learnerActivityEvents = mysqlTable("learnerActivityEvents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  eventType: varchar("eventType", { length: 60 }).notNull(),
  description: varchar("description", { length: 240 }).notNull(),
  occurredAt: bigint("occurredAt", { mode: "number" }).notNull(),
}, table => [
  index("learner_activity_user_time_idx").on(table.userId, table.occurredAt),
]);

/** Student projects are private to their owner until explicitly published. */
export const studentProjects = mysqlTable("studentProjects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description"),
  techStackJson: text("techStackJson"),
  repositoryUrl: varchar("repositoryUrl", { length: 700 }),
  demoUrl: varchar("demoUrl", { length: 700 }),
  status: mysqlEnum("status", ["draft", "submitted", "published"]).notNull().default("draft"),
  submittedAt: bigint("submittedAt", { mode: "number" }),
  publishedAt: bigint("publishedAt", { mode: "number" }),
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
}, table => [
  index("student_projects_user_updated_idx").on(table.userId, table.updatedAt),
  index("student_projects_user_status_idx").on(table.userId, table.status),
]);

/** Each student project may retain a dated submission snapshot with optional file metadata. */
export const projectSubmissions = mysqlTable("projectSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => studentProjects.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  submissionNote: text("submissionNote"),
  attachmentKey: varchar("attachmentKey", { length: 800 }),
  attachmentUrl: varchar("attachmentUrl", { length: 1000 }),
  attachmentName: varchar("attachmentName", { length: 260 }),
  submittedAt: bigint("submittedAt", { mode: "number" }).notNull(),
}, table => [
  index("project_submissions_project_time_idx").on(table.projectId, table.submittedAt),
  index("project_submissions_user_time_idx").on(table.userId, table.submittedAt),
]);

/** Resource saves create a private reading list without duplicating resource content. */
export const studentResourceSaves = mysqlTable("studentResourceSaves", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  resourceId: varchar("resourceId", { length: 160 }).notNull(),
  savedAt: bigint("savedAt", { mode: "number" }).notNull(),
}, table => [
  uniqueIndex("student_resource_saves_user_resource_unique").on(table.userId, table.resourceId),
  index("student_resource_saves_user_time_idx").on(table.userId, table.savedAt),
]);

/** Attendance and reminders for CodeCraft’s free daily workshops. */
export const workshopEnrollments = mysqlTable("workshopEnrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  workshopSlug: varchar("workshopSlug", { length: 160 }).notNull(),
  workshopTitle: varchar("workshopTitle", { length: 220 }).notNull(),
  workshopDate: bigint("workshopDate", { mode: "number" }).notNull(),
  joinedAt: bigint("joinedAt", { mode: "number" }).notNull(),
}, table => [
  uniqueIndex("workshop_enrollments_user_workshop_unique").on(table.userId, table.workshopSlug),
  index("workshop_enrollments_user_date_idx").on(table.userId, table.workshopDate),
]);

/** Conversation-level storage gives each student a private AI tutor history. */
export const tutorConversations = mysqlTable("tutorConversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 180 }).notNull(),
  topic: varchar("topic", { length: 80 }).notNull().default("general"),
  workspaceTool: varchar("workspaceTool", { length: 40 }),
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
}, table => [
  index("tutor_conversations_user_updated_idx").on(table.userId, table.updatedAt),
]);

/** Tutor messages remain scoped to the conversation owner and are never shared across students. */
export const tutorMessages = mysqlTable("tutorMessages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull().references(() => tutorConversations.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: mysqlEnum("role", ["student", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
}, table => [
  index("tutor_messages_conversation_time_idx").on(table.conversationId, table.createdAt),
  index("tutor_messages_user_time_idx").on(table.userId, table.createdAt),
]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
