import { InvoiceTemplateFilterTypes } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { parseNumberToHours, searchCompanies, searchTickets, validateTimeSetForTickets } from "../../../lib/integrations/hubspot";
import { createRouter } from "./context";


export const hubspotRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const organizationId = ctx.session?.user.organizationId;

    if (!organizationId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, organizationId } })
  })
  .query("searchCompanies", {
    input: z
      .object({
        searchTerm: z.string(),
      }),
    async resolve({ input, ctx }) {
      let companies = await searchCompanies(ctx.organizationId, input.searchTerm);

      let tableFormatCompanies: {
        id: string,
        name: string,
        domain: string,
        city: string
      }[] = [];

      companies.results.forEach((company) => {
        tableFormatCompanies.push({
          id: company.id,
          name: company.properties["name"],
          domain: company.properties["domain"],
          city: company.properties["city"],
        });
      })

      let searchResult: {
        amount: number,
        total: number,
        companies: {
          id: string,
          name: string,
          domain: string,
          city: string
        }[]
      } = {
        amount: companies.results.length,
        total: companies.total,
        companies: tableFormatCompanies
      };

      return searchResult;
    },
  })
  .query("searchTickets", {
    input: z
      .object({
        companyId: z.string(),
        searchTerm: z.string(),
      }),
    async resolve({ input, ctx }) {
      let tickets = await searchTickets(ctx.organizationId, input.companyId, input.searchTerm)

      let response: {
        id: string
        subject: string
        hoursSpent: number | null
        lastModified: string
      }[] = [];

      tickets.results.forEach((ticket) => {
        response.push({
          id: ticket.properties["hs_object_id"],
          subject: ticket.properties["subject"],
          hoursSpent: parseNumberToHours(ticket.properties["content"]),
          lastModified: new Date(ticket.properties["hs_lastmodifieddate"]).toUTCString()
        })
      })

      let searchResult: {
        amount: number,
        total: number,
        tickets: {
          id: string
          subject: string
          hoursSpent: number | null
          lastModified: string
        }[]
      } = {
        amount: tickets.results.length || 0,
        total: tickets.total || 0,
        tickets: response
      };

      return searchResult;
    },
  })
  .mutation("validateTimeSetForTickets", {
    input: z.object({
      invoiceTemplateIds: z.string().array()
    }),
    async resolve({ input, ctx }) {
      // Hubspot ticket time values might not be set
      // Validate that they are set before generating invoices
      let companyIds: string[] = []

      for (let invoiceTemplateId of input.invoiceTemplateIds) {
        const templates = await ctx.prisma.invoiceTemplate.findUniqueOrThrow({
          where: {
            id: invoiceTemplateId
          },
          include: {
            filters: true,
          }
        })

        templates.filters.forEach((filter) => {
          if (filter.type === InvoiceTemplateFilterTypes.HUBSPOTCOMPANY) {
            companyIds.push(filter.filterId)
          }
        })
      }

      return validateTimeSetForTickets(ctx.organizationId, companyIds)
    }
  });