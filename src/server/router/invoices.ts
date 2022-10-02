import { ApiKeyProvider, Currency, RoundingScheme } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createInvoiceDraft, getAllCustomers, getAllEmployees, getCustomerContacts } from "../../../lib/integrations/e-conomic";
import { getInvoice } from "../../../lib/invoice";
import { createRouter } from "./context";

export const invoicesRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const organizationId = ctx.session?.user.organizationId;

    if (!organizationId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, organizationId } })
  })
  .query("getInvoiceOptions", {
    async resolve({ ctx }) {
      const organisation = await ctx.prisma.organization.findUniqueOrThrow({
        where: {
          id: ctx.organizationId
        },
        select: {
          currency: true,
          clients: {
            select: {
              name: true
            }
          },
          invoiceLayouts: {
            select: {
              name: true
            }
          }
        }
      })

      const clients = organisation.clients.map(x => x.name)
      const statuses = ["DRAFT", "SENT", "PAID", "NOCHARGE"]
      const currencies = ["USD", "DKK"]
      const roundingSchemes = ["1. Decimal", "2. Decimals", "3. Decimals"]
      const invoiceLayouts = organisation.invoiceLayouts.map(x => x.name)

      // Get active integration, so only options for active integrations are shown
      // Get optional data for integrations, if integrated
      const activeIntegrationsResponse: { [provider: string]: boolean } = {}
      let activeIntegrations = await ctx.prisma.apiKey.findMany({
        select: {
          provider: true,
          key: true
        }
      })

      // E-conomic
      let economicCustomers: { customerNumber: number, name: string }[] = []
      if (activeIntegrations.find(x => x.provider === ApiKeyProvider.ECONOMIC)) {
        const economicCustomersCollection = await getAllCustomers(ctx.organizationId)
        economicCustomers = economicCustomersCollection.collection.map(x => ({ customerNumber: x.customerNumber, name: x.name }))

        activeIntegrationsResponse[ApiKeyProvider.ECONOMIC.toString()] = true
      }

      const response = {
        statuses: statuses,
        currencies: currencies,
        clients: clients,
        defaultCurrency: organisation.currency,
        invoiceLayouts: invoiceLayouts,
        roundingScheme: roundingSchemes,
        economicCustomers: economicCustomers,
        activeIntegrations: activeIntegrationsResponse
      }

      return response
    },
  })
  .query("getEconomicOptions", {
    input: z
      .object({
        customerNumber: z.number(),
      }),
    async resolve({ ctx, input }) {
      // E-conomic options
      const ourReferencesCollection = await getAllEmployees(ctx.organizationId)
      const ourReferences: { employeeNumber: number, name: string }[] = ourReferencesCollection.collection.map(x => ({ employeeNumber: x.employeeNumber, name: x.name }))

      const customerContactsCollection = await getCustomerContacts(ctx.organizationId, input.customerNumber)
      const customerContacts: { customerContactNumber: number, name: string }[] = customerContactsCollection.collection.map(x => ({ customerContactNumber: x.customerContactNumber, name: x.name }))

      const response = {
        ourReferences: ourReferences,
        customerContacts: customerContacts
      }

      return await response
    },
  })
  .query("getInvoice", {
    input: z
      .object({
        invoiceId: z.string(),
      }),
    async resolve({ ctx, input }) {
      return await getInvoice(input.invoiceId, ctx.organizationId);
    },
  })
  .mutation("createIssueInvoice", {
    input: z.object({
      invoiceInformation: z.object({
        title: z.string(),
        currency: z.string(),
        dueDate: z.string(),
        roundingScheme: z.string(),
      }),
      pickedIssues: z.object({
        jiraId: z.string(),
        jiraKey: z.string(),
        name: z.string(),
        hoursSpent: z.number(),
        updatedHoursSpent: z.number(),
        discountPercentage: z.number(),
      }).array(),
      economicOptions: z.object({
        exportToEconomic: z.boolean(),
        customer: z.string(),
        customerName: z.string(),
        customerPrice: z.number(),
        text1: z.string(),
        ourReference: z.string(),
        customerContact: z.string(),
      })
    }),
    async resolve({ ctx, input }) {
      let roundingScheme: RoundingScheme = mapRoundingScheme(input.invoiceInformation.roundingScheme)

      const invoice = await ctx.prisma.generalInvoice.create({
        data: {
          title: input.invoiceInformation.title,
          currency: <Currency>input.invoiceInformation.currency,
          dueDate: new Date(input.invoiceInformation.dueDate),
          description: "",
          roundingScheme: roundingScheme,
          organizationId: ctx.organizationId,
          economicOptions: {
            create: {
              customer: input.economicOptions.customer,
              customerPrice: input.economicOptions.customerPrice,
              text1: input.economicOptions.text1,
              ourReference: input.economicOptions.ourReference,
              customerContact: input.economicOptions.customerContact,
              organizationId: ctx.organizationId,
            }
          },
          invoiceLines: {
            create: input.pickedIssues.map(line => {
              return ({
                title: line.name,
                hours: line.hoursSpent,
                pricePerHour: input.economicOptions.customerPrice,
                updatedHoursSpent: line.updatedHoursSpent ?? 0,
                discountPercentage: line.discountPercentage ?? 0,
                organizationId: ctx.organizationId
              })
            })
          }
        }
      })

      if (input.economicOptions.exportToEconomic) {
        createInvoiceDraft(invoice.id, ctx.organizationId)
      }
    }
  })
  .mutation("createHubspotTicketInvoice", {
    input: z.object({
      invoiceInformation: z.object({
        title: z.string(),
        currency: z.string(),
        dueDate: z.string(),
        roundingScheme: z.string(),
      }),
      pickedTickets: z.object({
        id: z.string(),
        subject: z.string(),
        content: z.string(),
        lastModified: z.string(),
        updatedHoursSpent: z.number(),
        discountPercentage: z.number(),
      }).array(),
      economicOptions: z.object({
        exportToEconomic: z.boolean(),
        customer: z.string(),
        customerName: z.string(),
        customerPrice: z.number(),
        text1: z.string(),
        ourReference: z.string(),
        customerContact: z.string(),
      })
    }),
    async resolve({ ctx, input }) {
      let roundingScheme: RoundingScheme = mapRoundingScheme(input.invoiceInformation.roundingScheme)

      const invoice = await ctx.prisma.generalInvoice.create({
        data: {
          title: input.invoiceInformation.title,
          currency: <Currency>input.invoiceInformation.currency,
          dueDate: new Date(input.invoiceInformation.dueDate),
          description: "",
          roundingScheme: roundingScheme,
          organizationId: ctx.organizationId,
          economicOptions: {
            create: {
              customer: input.economicOptions.customer,
              customerPrice: input.economicOptions.customerPrice,
              text1: input.economicOptions.text1,
              ourReference: input.economicOptions.ourReference,
              customerContact: input.economicOptions.customerContact,
              organizationId: ctx.organizationId,
            }
          },
          invoiceLines: {
            create: input.pickedTickets.map(line => {
              return ({
                title: line.subject,
                hours: 0,
                pricePerHour: input.economicOptions.customerPrice,
                updatedHoursSpent: line.updatedHoursSpent,
                discountPercentage: line.discountPercentage,
                organizationId: ctx.organizationId
              })
            })
          }
        }
      })

      if (input.economicOptions.exportToEconomic) {
        createInvoiceDraft(invoice.id, ctx.organizationId)
      }
    }
  });


//==========================================//
//   Helpers and Mappers                    //
//==========================================//
const mapRoundingScheme = (roundingSchemeString: string) => {
  let roundingScheme: RoundingScheme = RoundingScheme.POINTPOINT
  if (roundingSchemeString === "1. Decimal") roundingScheme = RoundingScheme.POINT
  if (roundingSchemeString === "2. Decimals") roundingScheme = RoundingScheme.POINTPOINT
  if (roundingSchemeString === "3. Decimals") roundingScheme = RoundingScheme.POINTPOINTPOINT
  return roundingScheme
}