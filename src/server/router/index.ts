// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { apiKeysRouter } from "./api-keys";
import { jiraRouter } from "./jira";
import { invoicesRouter } from "./invoices";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("apikeys.", apiKeysRouter)
  .merge("invoices.", invoicesRouter)
  .merge("jira.", jiraRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
