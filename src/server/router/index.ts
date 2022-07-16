// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { apiKeysRouter } from "./api-keys";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("auth.", authRouter)
  .merge("apiKeys.", apiKeysRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
