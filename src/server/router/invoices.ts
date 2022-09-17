import { createRouter } from "./context";
import { TRPCError } from "@trpc/server";
import { createInvoice, createIssueInvoice, getInvoice, ICreateIssueInvoice } from "../../../lib/invoice";
import { z } from "zod";
import { Currency, Invoice, InvoiceStatus, RoundingScheme } from "@prisma/client";
import { getAllCustomers, getAllEmployees, getCustomerContacts, test } from "../../../lib/integrations/e-conomic";
import { TbRuler2 } from "react-icons/tb";

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
      const roundingSchemes = ["POINT", "POINTPOINT", "POINTPOINTPOINT"]
      const invoiceLayouts = organisation.invoiceLayouts.map(x => x.name)

      const economicCustomersCollection = await getAllCustomers(ctx.organizationId)
      const economicCustomers: { customerNumber: number, name: string }[] = economicCustomersCollection.collection.map(x => ({ customerNumber: x.customerNumber, name: x.name }))

      const response = {
        statuses: statuses,
        currencies: currencies,
        clients: clients,
        defaultCurrency: organisation.currency,
        invoiceLayouts: invoiceLayouts,
        roundingScheme: roundingSchemes,
        economicCustomers: economicCustomers
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
      const createInvoiceInput: ICreateIssueInvoice = {
        title: input.invoiceInformation.title,
        currency: input.invoiceInformation.currency,
        dueDate: new Date(input.invoiceInformation.dueDate),
        roundingScheme: <RoundingScheme>input.invoiceInformation.roundingScheme,
        exportToEconomic: input.economicOptions.exportToEconomic,
        economicCustomer: input.economicOptions.customer,
        economicCustomerPrice: input.economicOptions.customerPrice,
        economicText1: input.economicOptions.text1,
        economicOurReference: input.economicOptions.ourReference,
        economicCustomerContact: input.economicOptions.customerContact,
        issueTimeItems: input.pickedIssues.map(item => ({
          jiraId: item.jiraId,
          jiraKey: item.jiraKey,
          name: item.name,
          hours: item.hoursSpent,
          updatedHoursSpent: item.updatedHoursSpent ?? 0,
          discountPercentage: item.discountPercentage ?? 0,
        }))
      }

      return await createIssueInvoice(createInvoiceInput, ctx.organizationId)
    }
  });
