// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { apiKeysRouter } from "./api-keys";
import { jiraRouter } from "./jira";
import { invoicesRouter } from "./invoices";
import { usersRouter } from "./users";
import { integrationsRouter } from "./integrations";
import { contactRouter} from "./contactrouter"

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("apikeys.", apiKeysRouter)
  .merge("invoices.", invoicesRouter)
  .merge("jira.", jiraRouter)
  .merge("users.", usersRouter)
  .merge("integrations.", integrationsRouter)
  .merge("contact.", contactRouter);
// export type definition of API

export type AppRouter = typeof appRouter;
