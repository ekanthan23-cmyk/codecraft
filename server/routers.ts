import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { completeLessonInput, learnerProfileInput, projectIdInput, projectSubmissionInput, resourceSaveInput, studentNoteInput, studentProjectInput, tutorConversationInput, tutorQuestionInput, workshopJoinInput, workspaceDraftInput, workspaceToolInput } from "./codecraft.inputs";
import * as codecraftDb from "./db";
import { askCodeCraftTutor, previewCodeCraftTutor } from "./tutor";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  codecraft: router({
    dashboard: protectedProcedure.query(({ ctx }) => codecraftDb.getCodeCraftDashboard(ctx.user.id)),
    profile: router({
      get: protectedProcedure.query(({ ctx }) => codecraftDb.getLearnerProfile(ctx.user.id)),
      save: protectedProcedure.input(learnerProfileInput).mutation(({ ctx, input }) => codecraftDb.saveLearnerProfile(ctx.user.id, input)),
    }),
    preferences: router({
      workspace: protectedProcedure.query(({ ctx }) => codecraftDb.getWorkspacePreference(ctx.user.id)),
      selectWorkspaceTool: protectedProcedure.input(workspaceToolInput).mutation(({ ctx, input }) => codecraftDb.saveWorkspacePreference(ctx.user.id, input.selectedTool)),
    }),
    workspace: router({
      getDraft: protectedProcedure.input(z.object({ lessonSlug: z.string().trim().min(1).max(150) })).query(({ ctx, input }) => codecraftDb.getWorkspaceDraft(ctx.user.id, input.lessonSlug)),
      saveDraft: protectedProcedure.input(workspaceDraftInput).mutation(({ ctx, input }) => codecraftDb.saveWorkspaceDraft(ctx.user.id, input)),
      completeLesson: protectedProcedure.input(completeLessonInput).mutation(({ ctx, input }) => codecraftDb.completeLesson(ctx.user.id, input)),
    }),
    notes: router({
      create: protectedProcedure.input(studentNoteInput).mutation(({ ctx, input }) => codecraftDb.createStudentNote(ctx.user.id, input)),
    }),
    projects: router({
      list: protectedProcedure.query(({ ctx }) => codecraftDb.listStudentProjects(ctx.user.id)),
      create: protectedProcedure.input(studentProjectInput).mutation(({ ctx, input }) => codecraftDb.createStudentProject(ctx.user.id, input)),
      submit: protectedProcedure.input(projectSubmissionInput).mutation(({ ctx, input }) => codecraftDb.submitStudentProject(ctx.user.id, input)),
      publish: protectedProcedure.input(projectIdInput).mutation(({ ctx, input }) => codecraftDb.publishStudentProject(ctx.user.id, input.projectId)),
    }),
    resources: router({
      savedIds: protectedProcedure.query(({ ctx }) => codecraftDb.getSavedResourceIds(ctx.user.id)),
      save: protectedProcedure.input(resourceSaveInput).mutation(({ ctx, input }) => codecraftDb.saveStudentResource(ctx.user.id, input.resourceId)),
    }),
    workshops: router({
      listJoined: protectedProcedure.query(({ ctx }) => codecraftDb.listStudentWorkshops(ctx.user.id)),
      join: protectedProcedure.input(workshopJoinInput).mutation(({ ctx, input }) => codecraftDb.joinStudentWorkshop(ctx.user.id, input)),
    }),
    tutor: router({
      preview: publicProcedure.input(tutorQuestionInput).mutation(({ input }) => previewCodeCraftTutor(input)),
      listConversations: protectedProcedure.query(({ ctx }) => codecraftDb.listTutorConversations(ctx.user.id)),
      getConversation: protectedProcedure.input(tutorConversationInput).query(({ ctx, input }) => codecraftDb.getTutorConversation(ctx.user.id, input.conversationId)),
      ask: protectedProcedure.input(tutorQuestionInput).mutation(({ ctx, input }) => askCodeCraftTutor(ctx.user.id, input)),
    }),
  }),
});

export type AppRouter = typeof appRouter;
