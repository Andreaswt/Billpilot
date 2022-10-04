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
    input: z.object({
      status: z.string(),
    }),
    async resolve({ input, ctx }) {
      const clients = [
        {
          name: "Daniel",
          invoiced: "100 USD",
          createdAt: new Date(),
          latestBill: new Date(),
          status: "billed"
        },
        {
          name: "Carl",
          invoiced: "200 USD",
          createdAt: new Date(),
          latestBill: new Date(),
          status: "notBilled"
        },
        {
          name: "Holler",
          invoiced: "300 USD",
          createdAt: new Date(),
          latestBill: new Date(),
          status: "billed"
        },
        {
          name: "Larsen",
          invoiced: "400 USD",
          createdAt: new Date(),
          latestBill: new Date(),
          status: "notBilled"
        },
        {
          name: "Henry",
          invoiced: "500 USD",
          createdAt: new Date(),
          latestBill: new Date(),
          status: "billed"
        },
      ]
      return clients;
    }
  })
  .mutation("createClient", {
    input: z.object({
      clientInformation: z.object({
        name: z.string(),
        currency: z.string(),
        roundingScheme: z.string(),
      }),
      economicOptions: z.object({
        customer: z.string(),
        customerPrice: z.number(),
        text1: z.string(),
        ourReference: z.string(),
        customerContact: z.string(),
        unit: z.string(),
        layout: z.string(),
        vatZone: z.string(),
        paymentTerms: z.string(),
        product: z.string(),
      })
    }),
    async resolve({ input, ctx }) {
      
    
    }
  });