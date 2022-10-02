// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { apiKeysRouter } from "./api-keys";
import { jiraRouter } from "./jira";
import { invoicesRouter } from "./invoices";
import { usersRouter } from "./users";
import { integrationsRouter } from "./integrations";
import { accountRouter } from "./account";
import { contactRouter} from "./contactrouter";
import { hubspotRouter } from "./hubspot";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("apikeys.", apiKeysRouter)
  .merge("invoices.", invoicesRouter)
  .merge("jira.", jiraRouter)
  .merge("users.", usersRouter)
  .merge("integrations.", integrationsRouter)
  .merge("account.", accountRouter)
  .merge("hubspot.", hubspotRouter)
  .merge("contact.", contactRouter);

export type AppRouter = typeof appRouter;
