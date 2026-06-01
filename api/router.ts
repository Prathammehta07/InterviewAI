import { authRouter } from "./auth-router";
import { interviewRouter } from "./interview-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  interview: interviewRouter,
});

export type AppRouter = typeof appRouter;
