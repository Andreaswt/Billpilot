import { ClientStatus, Currency } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { mapRoundingScheme, mapStatus } from "../../../lib/helpers/invoices";
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
  .query("getClients", {
    input: z.object({
      status: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.client.findMany({
        where: {
          organizationId: ctx.organizationId,
          ...(input.status ? { status: mapStatus(input.status)} : {}) 
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          latestBill: true,
          status: true
        }
      })

    }
  })
  .mutation("deleteClient", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      await ctx.prisma.client.delete({
        where: {
          organizationsClient: {
            organizationId: ctx.organizationId,
            id: input.id
          }
        },
      })
    }
  })
  .mutation("createClient", {
    input: z.object({
      clientInformation: z.object({
        name: z.string(),
        currency: z.string(),
        roundingScheme: z.string(),
        pricePerHour: z.number(),
      }),
      economicOptions: z.object({
        customer: z.string(),
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
      await ctx.prisma.client.create({
        data: {
          name: input.clientInformation.name,
          currency: <Currency>input.clientInformation.currency,
          roundingScheme: mapRoundingScheme(input.clientInformation.roundingScheme),
          organizationId: ctx.organizationId,
          economicOptions: {
            create: {
              customer: input.economicOptions.customer,
              text1: input.economicOptions.ourReference,
              ourReference: input.economicOptions.ourReference,
              customerContact: input.economicOptions.customerContact,
              unit: input.economicOptions.unit,
              layout: input.economicOptions.layout,
              vatZone: input.economicOptions.vatZone,
              paymentTerms: input.economicOptions.paymentTerms,
              product: input.economicOptions.product,
              organization: {
                connect: {
                  id: ctx.organizationId
                }
              },
            }
          }
        }
      })
    }
  });