// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { apiKeysRouter } from "./api-keys";
import { jiraRouter } from "./jira";
import { invoicesRouter } from "./invoices";
import { usersRouter } from "./users";
import { integrationsRouter } from "./integrations";
import { hubspotRouter } from "./hubspot";
import { contactRouter} from "./contact"
import { accountRouter } from "./account";
import { clientsRouter } from "./clients";
import { invoiceTemplatesRouter } from "./invoice-templates";
import { dashboardRouter } from "./dashboard";
import { workbooksRouter } from "./workbooks";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("apikeys.", apiKeysRouter)
  .merge("invoices.", invoicesRouter)
  .merge("jira.", jiraRouter)
  .merge("users.", usersRouter)
  .merge("integrations.", integrationsRouter)
  .merge("hubspot.", hubspotRouter)
  .merge("contact.", contactRouter)
  .merge("account.", accountRouter)
  .merge("invoiceTemplates.", invoiceTemplatesRouter)
  .merge("dashboard.", dashboardRouter)
  .merge("clients.", clientsRouter)
  .merge("workbooks.", workbooksRouter);

// export type definition of API

export type AppRouter = typeof appRouter;
