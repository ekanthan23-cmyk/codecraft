import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  getCodeCraftDashboard: vi.fn(),
  getWorkspaceDraft: vi.fn(),
  saveWorkspaceDraft: vi.fn(),
  completeLesson: vi.fn(),
  createStudentNote: vi.fn(),
  getWorkspacePreference: vi.fn(),
  saveWorkspacePreference: vi.fn(),
  listStudentProjects: vi.fn(),
  createStudentProject: vi.fn(),
  submitStudentProject: vi.fn(),
  publishStudentProject: vi.fn(),
  getSavedResourceIds: vi.fn(),
  saveStudentResource: vi.fn(),
  listStudentWorkshops: vi.fn(),
  joinStudentWorkshop: vi.fn(),
  listTutorConversations: vi.fn(),
  getTutorConversation: vi.fn(),
}));

const tutorMocks = vi.hoisted(() => ({ askCodeCraftTutor: vi.fn() }));

vi.mock("./db", () => dbMocks);
vi.mock("./tutor", () => tutorMocks);

import { appRouter } from "./routers";

const lesson = {
  courseSlug: "java-full-stack",
  courseTitle: "Java Full Stack",
  lessonSlug: "java-classes-objects",
  lessonTitle: "Classes & Objects",
  totalLessons: 50,
};

function createAuthenticatedContext(): TrpcContext {
  return {
    user: {
      id: 42,
      openId: "test-learner",
      email: "learner@example.test",
      name: "Test Learner",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("CodeCraft authenticated persistence router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("routes a workspace save to the current learner only", async () => {
    dbMocks.saveWorkspaceDraft.mockResolvedValue({ savedAt: 123 });
    const caller = appRouter.createCaller(createAuthenticatedContext());

    await expect(caller.codecraft.workspace.saveDraft({ ...lesson, language: "java", sourceCode: "class Main {}", outputText: "Adam" })).resolves.toEqual({ savedAt: 123 });
    expect(dbMocks.saveWorkspaceDraft).toHaveBeenCalledWith(42, expect.objectContaining({ lessonSlug: "java-classes-objects", sourceCode: "class Main {}" }));
  });

  it("routes completion and note creation to the current learner only", async () => {
    dbMocks.completeLesson.mockResolvedValue({ wasAlreadyComplete: false });
    dbMocks.createStudentNote.mockResolvedValue({ savedAt: 456 });
    const caller = appRouter.createCaller(createAuthenticatedContext());

    await expect(caller.codecraft.workspace.completeLesson(lesson)).resolves.toEqual({ wasAlreadyComplete: false });
    await expect(caller.codecraft.notes.create({ title: "Constructor reminder", content: "Store received values on the new object.", tags: ["java"] })).resolves.toEqual({ savedAt: 456 });
    expect(dbMocks.completeLesson).toHaveBeenCalledWith(42, lesson);
    expect(dbMocks.createStudentNote).toHaveBeenCalledWith(42, expect.objectContaining({ title: "Constructor reminder" }));
  });

  it("returns the current learner dashboard data", async () => {
    dbMocks.getCodeCraftDashboard.mockResolvedValue({ summary: { completedLessons: 1 } });
    const caller = appRouter.createCaller(createAuthenticatedContext());

    await expect(caller.codecraft.dashboard()).resolves.toEqual({ summary: { completedLessons: 1 } });
    expect(dbMocks.getCodeCraftDashboard).toHaveBeenCalledWith(42);
  });

  it("keeps the selected workspace tool scoped to the current learner", async () => {
    dbMocks.getWorkspacePreference.mockResolvedValue({ selectedTool: "java" });
    dbMocks.saveWorkspacePreference.mockResolvedValue({ selectedTool: "python" });
    const caller = appRouter.createCaller(createAuthenticatedContext());

    await expect(caller.codecraft.preferences.workspace()).resolves.toEqual({ selectedTool: "java" });
    await expect(caller.codecraft.preferences.selectWorkspaceTool({ selectedTool: "python" })).resolves.toEqual({ selectedTool: "python" });
    expect(dbMocks.getWorkspacePreference).toHaveBeenCalledWith(42);
    expect(dbMocks.saveWorkspacePreference).toHaveBeenCalledWith(42, "python");
  });

  it("routes student project, workshop, resource, and tutor requests to the current learner", async () => {
    dbMocks.createStudentProject.mockResolvedValue({ projectId: 9, createdAt: 123 });
    dbMocks.joinStudentWorkshop.mockResolvedValue({ joinedAt: 124 });
    dbMocks.saveStudentResource.mockResolvedValue({ savedAt: 125 });
    tutorMocks.askCodeCraftTutor.mockResolvedValue({ conversationId: 8, answer: "Start by tracking two pointers." });
    const caller = appRouter.createCaller(createAuthenticatedContext());

    await expect(caller.codecraft.projects.create({ title: "Weather desk", techStack: ["React"] })).resolves.toEqual({ projectId: 9, createdAt: 123 });
    await expect(caller.codecraft.workshops.join({ workshopSlug: "daily-arrays", workshopTitle: "Arrays in 25 minutes", workshopDate: 1_700_000_000_000 })).resolves.toEqual({ joinedAt: 124 });
    await expect(caller.codecraft.resources.save({ resourceId: "python-tutorial" })).resolves.toEqual({ savedAt: 125 });
    await expect(caller.codecraft.tutor.ask({ question: "Explain two pointers", topic: "dsa" })).resolves.toEqual({ conversationId: 8, answer: "Start by tracking two pointers." });
    expect(dbMocks.createStudentProject).toHaveBeenCalledWith(42, expect.objectContaining({ title: "Weather desk" }));
    expect(dbMocks.joinStudentWorkshop).toHaveBeenCalledWith(42, expect.objectContaining({ workshopSlug: "daily-arrays" }));
    expect(dbMocks.saveStudentResource).toHaveBeenCalledWith(42, "python-tutorial");
    expect(tutorMocks.askCodeCraftTutor).toHaveBeenCalledWith(42, expect.objectContaining({ topic: "dsa" }));
  });

  it("submits a project and restores the current learner's saved student state", async () => {
    const savedProjects = [{ id: 9, title: "Weather desk", status: "submitted" }];
    const joinedWorkshops = [{ workshopSlug: "daily-arrays", workshopTitle: "Arrays in 25 minutes" }];
    dbMocks.submitStudentProject.mockResolvedValue({ submissionId: 15, submittedAt: 555 });
    dbMocks.listStudentProjects.mockResolvedValue(savedProjects);
    dbMocks.getSavedResourceIds.mockResolvedValue(["python-tutorial"]);
    dbMocks.listStudentWorkshops.mockResolvedValue(joinedWorkshops);
    const caller = appRouter.createCaller(createAuthenticatedContext());

    await expect(caller.codecraft.projects.submit({ projectId: 9, submissionNote: "First working version." })).resolves.toEqual({ submissionId: 15, submittedAt: 555 });
    await expect(caller.codecraft.projects.list()).resolves.toEqual(savedProjects);
    await expect(caller.codecraft.resources.savedIds()).resolves.toEqual(["python-tutorial"]);
    await expect(caller.codecraft.workshops.listJoined()).resolves.toEqual(joinedWorkshops);
    expect(dbMocks.submitStudentProject).toHaveBeenCalledWith(42, expect.objectContaining({ projectId: 9, submissionNote: "First working version." }));
    expect(dbMocks.listStudentProjects).toHaveBeenCalledWith(42);
    expect(dbMocks.getSavedResourceIds).toHaveBeenCalledWith(42);
    expect(dbMocks.listStudentWorkshops).toHaveBeenCalledWith(42);
  });
});
