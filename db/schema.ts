import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  json,
  decimal,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const interviewSessions = mysqlTable("interview_sessions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium").notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "terminated"]).default("pending").notNull(),
  totalQuestions: int("totalQuestions").default(10).notNull(),
  currentQuestionIndex: int("currentQuestionIndex").default(0).notNull(),
  overallScore: decimal("overallScore", { precision: 5, scale: 2 }),
  readinessScore: int("readinessScore"),
  category: varchar("category", { length: 100 }),
  feedback: text("feedback"),
  strengths: json("strengths"),
  weaknesses: json("weaknesses"),
  resumeText: text("resumeText"),
  jobDescription: text("jobDescription"),
  extractedSkills: json("extractedSkills"),
  terminationReason: varchar("terminationReason", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  completedAt: timestamp("completedAt"),
});

export type InterviewSession = typeof interviewSessions.$inferSelect;
export type InsertInterviewSession = typeof interviewSessions.$inferInsert;

export const questions = mysqlTable("questions", {
  id: serial("id").primaryKey(),
  sessionId: bigint("sessionId", { mode: "number", unsigned: true }).notNull(),
  questionText: text("questionText").notNull(),
  questionType: mysqlEnum("questionType", [
    "technical",
    "conceptual",
    "behavioral",
    "scenario",
  ]).notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  expectedAnswer: text("expectedAnswer"),
  orderIndex: int("orderIndex").notNull(),
  timeLimit: int("timeLimit").default(120).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

export const responses = mysqlTable("responses", {
  id: serial("id").primaryKey(),
  sessionId: bigint("sessionId", { mode: "number", unsigned: true }).notNull(),
  questionId: bigint("questionId", { mode: "number", unsigned: true }).notNull(),
  responseText: text("responseText").notNull(),
  accuracyScore: int("accuracyScore").default(0).notNull(),
  clarityScore: int("clarityScore").default(0).notNull(),
  depthScore: int("depthScore").default(0).notNull(),
  relevanceScore: int("relevanceScore").default(0).notNull(),
  timeEfficiencyScore: int("timeEfficiencyScore").default(0).notNull(),
  overallScore: int("overallScore").default(0).notNull(),
  feedback: text("feedback"),
  responseTime: int("responseTime"),
  aiEvaluation: text("aiEvaluation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Response = typeof responses.$inferSelect;
export type InsertResponse = typeof responses.$inferInsert;

export const skillScores = mysqlTable("skill_scores", {
  id: serial("id").primaryKey(),
  sessionId: bigint("sessionId", { mode: "number", unsigned: true }).notNull(),
  skillName: varchar("skillName", { length: 100 }).notNull(),
  score: int("score").notNull(),
  maxScore: int("maxScore").default(100).notNull(),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SkillScore = typeof skillScores.$inferSelect;
export type InsertSkillScore = typeof skillScores.$inferInsert;
