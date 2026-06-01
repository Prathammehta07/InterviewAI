import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { interviewSessions, questions, responses, skillScores } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";
import {
  extractSkills,
  extractRole,
  generateQuestions,
  evaluateResponse,
  adaptDifficulty,
  shouldTerminateEarly,
  calculateReadinessScore,
  generateActionableFeedback,
} from "./lib/interview-ai";

export const interviewRouter = createRouter({
  // Create a new interview session
  createSession: authedQuery
    .input(
      z.object({
        title: z.string().min(1).max(255),
        resumeText: z.string().min(10),
        jobDescription: z.string().min(10),
        difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
        totalQuestions: z.number().min(5).max(20).default(10),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const skills = extractSkills(input.resumeText);
      const role = extractRole(input.jobDescription);

      // Create session
      const [session] = await db.insert(interviewSessions).values({
        userId: ctx.user.id,
        title: input.title,
        role,
        difficulty: input.difficulty,
        status: "pending",
        totalQuestions: input.totalQuestions,
        currentQuestionIndex: 0,
        resumeText: input.resumeText,
        jobDescription: input.jobDescription,
        extractedSkills: skills,
      });

      const sessionId = Number(session.insertId);

      // Generate questions
      const generatedQuestions = generateQuestions(role, skills, input.difficulty, input.totalQuestions);

      // Insert questions into DB
      for (let i = 0; i < generatedQuestions.length; i++) {
        const q = generatedQuestions[i];
        await db.insert(questions).values({
          sessionId,
          questionText: q.questionText,
          questionType: q.questionType,
          difficulty: q.difficulty,
          category: q.category,
          expectedAnswer: q.expectedAnswer,
          orderIndex: i,
          timeLimit: q.timeLimit,
        });
      }

      return {
        sessionId,
        role,
        skills,
        totalQuestions: generatedQuestions.length,
      };
    }),

  // Get session details with questions
  getSession: authedQuery
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const session = await db.select().from(interviewSessions).where(eq(interviewSessions.id, input.sessionId)).limit(1);
      if (!session[0]) return null;

      const sessionQuestions = await db
        .select()
        .from(questions)
        .where(eq(questions.sessionId, input.sessionId))
        .orderBy(questions.orderIndex);

      const sessionResponses = await db
        .select()
        .from(responses)
        .where(eq(responses.sessionId, input.sessionId));

      return {
        session: session[0],
        questions: sessionQuestions,
        responses: sessionResponses,
      };
    }),

  // Get user's interview sessions
  getUserSessions: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const sessions = await db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.userId, ctx.user.id))
      .orderBy(desc(interviewSessions.createdAt));
    return sessions;
  }),

  // Start interview
  startInterview: authedQuery
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(interviewSessions)
        .set({ status: "in_progress" })
        .where(eq(interviewSessions.id, input.sessionId));
      return { success: true };
    }),

  // Submit response and get next question
  submitResponse: authedQuery
    .input(
      z.object({
        sessionId: z.number(),
        questionId: z.number(),
        responseText: z.string().min(1),
        responseTime: z.number(), // in seconds
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Get session and question
      const session = await db.select().from(interviewSessions).where(eq(interviewSessions.id, input.sessionId)).limit(1);
      const question = await db.select().from(questions).where(eq(questions.id, input.questionId)).limit(1);

      if (!session[0] || !question[0]) {
        throw new Error("Session or question not found");
      }

      // Evaluate response
      const { scores, feedback, aiEvaluation } = evaluateResponse(
        {
          questionText: question[0].questionText,
          questionType: question[0].questionType,
          difficulty: question[0].difficulty,
          category: question[0].category,
          expectedAnswer: question[0].expectedAnswer || "",
          timeLimit: question[0].timeLimit,
        },
        input.responseText,
        input.responseTime,
      );

      // Save response
      await db.insert(responses).values({
        sessionId: input.sessionId,
        questionId: input.questionId,
        responseText: input.responseText,
        accuracyScore: scores.accuracy,
        clarityScore: scores.clarity,
        depthScore: scores.depth,
        relevanceScore: scores.relevance,
        timeEfficiencyScore: scores.timeEfficiency,
        overallScore: scores.overall,
        feedback,
        responseTime: input.responseTime,
        aiEvaluation,
      });

      // Get all responses for this session to check adaptation
      const allResponses = await db
        .select()
        .from(responses)
        .where(eq(responses.sessionId, input.sessionId));

      const responseScores = allResponses.map((r) => r.overallScore);
      const currentQuestion = session[0].currentQuestionIndex;
      const nextQuestionIndex = currentQuestion + 1;

      // Check for early termination
      const terminationCheck = shouldTerminateEarly(responseScores, allResponses.length);

      if (terminationCheck.shouldTerminate) {
        await db
          .update(interviewSessions)
          .set({
            status: "terminated",
            currentQuestionIndex: nextQuestionIndex,
            terminationReason: terminationCheck.reason,
          })
          .where(eq(interviewSessions.id, input.sessionId));

        return {
          terminated: true,
          reason: terminationCheck.reason,
          scores,
          feedback,
          aiEvaluation,
        };
      }

      // Check if interview is complete
      if (nextQuestionIndex >= session[0].totalQuestions) {
        // Calculate final scores
        const allSessionResponses = await db
          .select()
          .from(responses)
          .where(eq(responses.sessionId, input.sessionId));

        const allScores = allSessionResponses.map((r) => ({
          accuracy: r.accuracyScore,
          clarity: r.clarityScore,
          depth: r.depthScore,
          relevance: r.relevanceScore,
          timeEfficiency: r.timeEfficiencyScore,
          overall: r.overallScore,
        }));

        const result = calculateReadinessScore(allScores);

        // Save skill scores
        for (const skill of result.skillAreas) {
          await db.insert(skillScores).values({
            sessionId: input.sessionId,
            skillName: skill.name,
            score: skill.score,
            maxScore: skill.maxScore,
            category: skill.name,
          });
        }

        await db
          .update(interviewSessions)
          .set({
            status: "completed",
            currentQuestionIndex: nextQuestionIndex,
            overallScore: result.readinessScore.toString(),
            readinessScore: result.readinessScore,
            category: result.category,
            feedback: result.summary,
            strengths: result.strengths,
            weaknesses: result.weaknesses,
            completedAt: new Date(),
          })
          .where(eq(interviewSessions.id, input.sessionId));

        return {
          terminated: false,
          completed: true,
          scores,
          feedback,
          aiEvaluation,
          readinessScore: result.readinessScore,
          category: result.category,
        };
      }

      // Update current question index
      await db
        .update(interviewSessions)
        .set({ currentQuestionIndex: nextQuestionIndex })
        .where(eq(interviewSessions.id, input.sessionId));

      return {
        terminated: false,
        completed: false,
        nextQuestionIndex,
        scores,
        feedback,
        aiEvaluation,
      };
    }),

  // Get final report
  getReport: authedQuery
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const session = await db.select().from(interviewSessions).where(eq(interviewSessions.id, input.sessionId)).limit(1);
      if (!session[0]) return null;

      const sessionQuestions = await db
        .select()
        .from(questions)
        .where(eq(questions.sessionId, input.sessionId))
        .orderBy(questions.orderIndex);

      const sessionResponses = await db
        .select()
        .from(responses)
        .where(eq(responses.sessionId, input.sessionId));

      const sessionSkillScores = await db
        .select()
        .from(skillScores)
        .where(eq(skillScores.sessionId, input.sessionId));

      const weaknesses = (session[0].weaknesses as string[]) || [];
      const actionableFeedback = generateActionableFeedback(weaknesses);

      return {
        session: session[0],
        questions: sessionQuestions,
        responses: sessionResponses,
        skillScores: sessionSkillScores,
        actionableFeedback,
      };
    }),

  // Delete session
  deleteSession: authedQuery
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(responses).where(eq(responses.sessionId, input.sessionId));
      await db.delete(questions).where(eq(questions.sessionId, input.sessionId));
      await db.delete(skillScores).where(eq(skillScores.sessionId, input.sessionId));
      await db.delete(interviewSessions).where(eq(interviewSessions.id, input.sessionId));
      return { success: true };
    }),
});
