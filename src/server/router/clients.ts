import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { searchCompanies, searchTickets } from "../../../lib/integrations/hubspot";
import { getEmployees, importJiraTime, searchEpics, searchIssues, searchProjectIssues, searchProjects } from "../../../lib/integrations/jira";
import { createRouter } from "./context";


export const clientsRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const organizationId = ctx.session?.user.organizationId;

    if (!organizationId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, organizationId } })
  })
  .query("getClient", {
      async resolve({ ctx }) {
        const clients = [
          {
            name: "Carl",
            createdAt: new Date(),
            type: "Customer",
            status: "Billed"
          },
          {
            name: "Larsen",
            createdAt: new Date(),
            type: "Customer",
            status: "Billed"
          },
          {
            name: "Daniel",
            createdAt: new Date(),
            type: "Customer",
            status: "Billed"
          },
          {
            name: "Holler",
            createdAt: new Date(),
            type: "Customer",
            status: "Billed"
          }
        ]
        return clients;
      }
  });
