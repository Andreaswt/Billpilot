// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { apiKeysRouter } from "./api-keys";
import { jiraRouter } from "./jira";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("auth.", authRouter)
  .merge("apiKeys.", apiKeysRouter)
  .merge("jira.", jiraRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
