import { describe, expect, it } from "vitest";
import { completeLessonInput, projectSubmissionInput, resourceSaveInput, studentNoteInput, studentProjectInput, tutorQuestionInput, workshopJoinInput, workspaceDraftInput, workspaceToolInput } from "./codecraft.inputs";

const lesson = {
  courseSlug: "java-full-stack",
  courseTitle: "Java Full Stack",
  lessonSlug: "java-classes-objects",
  lessonTitle: "Classes & Objects",
  totalLessons: 50,
};

describe("CodeCraft persistence inputs", () => {
  it("accepts a bounded workspace draft with its learning context", () => {
    const result = workspaceDraftInput.safeParse({ ...lesson, language: "java", sourceCode: "class Main {}", outputText: "ok", ranAt: Date.now() });
    expect(result.success).toBe(true);
  });

  it("rejects an empty source draft and invalid course total", () => {
    expect(workspaceDraftInput.safeParse({ ...lesson, totalLessons: 0, language: "java", sourceCode: "" }).success).toBe(false);
  });

  it("keeps completion and note payloads user-content bounded", () => {
    expect(completeLessonInput.safeParse(lesson).success).toBe(true);
    expect(studentNoteInput.safeParse({ title: "Constructor reminder", content: "Initialize fields from the constructor.", tags: ["java", "oop"] }).success).toBe(true);
    expect(studentNoteInput.safeParse({ title: "", content: "x" }).success).toBe(false);
  });

  it("only accepts supported workspace tools", () => {
    expect(workspaceToolInput.safeParse({ selectedTool: "python" }).success).toBe(true);
    expect(workspaceToolInput.safeParse({ selectedTool: "rust" }).success).toBe(false);
  });

  it("accepts bounded student project and workshop payloads", () => {
    expect(studentProjectInput.safeParse({ title: "Weather desk", description: "A small dashboard.", techStack: ["React", "CSS"], repositoryUrl: "https://github.com/example/weather", demoUrl: "https://example.com/weather" }).success).toBe(true);
    expect(workshopJoinInput.safeParse({ workshopSlug: "daily-arrays", workshopTitle: "Arrays in 25 minutes", workshopDate: Date.now() }).success).toBe(true);
    expect(resourceSaveInput.safeParse({ resourceId: "python-tutorial" }).success).toBe(true);
  });

  it("limits project attachments and tutor questions to safe request sizes", () => {
    expect(projectSubmissionInput.safeParse({ projectId: 1, fileName: "project.zip", fileDataUrl: "data:application/zip;base64,AA==" }).success).toBe(true);
    expect(projectSubmissionInput.safeParse({ projectId: 0 }).success).toBe(false);
    expect(tutorQuestionInput.safeParse({ question: "Explain BFS in a graph", topic: "dsa", workspaceTool: "cpp" }).success).toBe(true);
    expect(tutorQuestionInput.safeParse({ question: "x" }).success).toBe(false);
  });
});
