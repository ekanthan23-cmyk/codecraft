import { describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  createTutorConversation: vi.fn(),
  getTutorConversation: vi.fn(),
  addTutorMessage: vi.fn(),
}));
const llmMocks = vi.hoisted(() => ({
  listLLMModels: vi.fn(),
  invokeLLM: vi.fn(),
}));

vi.mock("./db", () => dbMocks);
vi.mock("./_core/llm", () => llmMocks);

import { askCodeCraftTutor, previewCodeCraftTutor } from "./tutor";

describe("CodeCraft Tutor", () => {
  it("returns a guest tutor answer without creating any private history", async () => {
    llmMocks.listLLMModels.mockResolvedValue({ data: [{ id: "gpt-5-mini" }] });
    llmMocks.invokeLLM.mockResolvedValue({ choices: [{ message: { content: "**Idea**\nUse two pointers." } }] });

    await expect(previewCodeCraftTutor({ question: "Explain two pointers", topic: "dsa" })).resolves.toEqual({ answer: "**Idea**\nUse two pointers." });
    expect(dbMocks.createTutorConversation).not.toHaveBeenCalled();
    expect(llmMocks.invokeLLM).toHaveBeenCalledWith(expect.objectContaining({ model: "gpt-5-mini" }));
  });

  it("stores both sides of a signed-in student tutor conversation", async () => {
    dbMocks.createTutorConversation.mockResolvedValue({ conversationId: 9 });
    llmMocks.invokeLLM.mockResolvedValue({ choices: [{ message: { content: "**Solution**\nUse a hash map." } }] });

    await expect(askCodeCraftTutor(42, { question: "Solve Two Sum", topic: "dsa", workspaceTool: "python" })).resolves.toEqual({ conversationId: 9, answer: "**Solution**\nUse a hash map." });
    expect(dbMocks.createTutorConversation).toHaveBeenCalledWith(42, expect.objectContaining({ topic: "dsa" }));
    expect(dbMocks.addTutorMessage).toHaveBeenNthCalledWith(1, 42, expect.objectContaining({ role: "student" }));
    expect(dbMocks.addTutorMessage).toHaveBeenNthCalledWith(2, 42, expect.objectContaining({ role: "assistant", content: "**Solution**\nUse a hash map." }));
  });
});
