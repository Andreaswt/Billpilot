import { ApiKeyProvider, Currency, RoundingScheme } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { mapRoundingScheme } from "../../../lib/helpers/invoices";
import { createInvoiceDraft, getAllCustomers, getAllEmployees, getAllLayouts, getAllPaymentTerms, getAllProducts, getAllUnits, getAllVatZones, getCustomerContacts } from "../../../lib/integrations/e-conomic";
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
        }
      })

      const clients = organisation.clients.map(x => x.name)
      const statuses = ["DRAFT", "SENT", "PAID", "NOCHARGE"]
      const currencies = ["USD", "DKK"]
      const roundingSchemes = ["1. Decimal", "2. Decimals", "3. Decimals"]

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
        economicCustomers = economicCustomersCollection.map(x => ({ customerNumber: x.customerNumber, name: x.name }))

        activeIntegrationsResponse[ApiKeyProvider.ECONOMIC.toString()] = true
      }

      const response = {
        statuses: statuses,
        currencies: currencies,
        clients: clients,
        defaultCurrency: organisation.currency,
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
      const ourReferences: { employeeNumber: number, name: string }[] = ourReferencesCollection.map(x => ({ employeeNumber: x.employeeNumber, name: x.name }))

      const customerContactsCollection = await getCustomerContacts(ctx.organizationId, input.customerNumber)
      const customerContacts: { customerContactNumber: number, name: string }[] = customerContactsCollection.map(x => ({ customerContactNumber: x.customerContactNumber, name: x.name }))

      const unitsCollection = await getAllUnits(ctx.organizationId)
      const units: { unitNumber: number, name: string }[] = unitsCollection.map(x => ({ unitNumber: x.unitNumber, name: x.name }))

      const layoutsCollection = await getAllLayouts(ctx.organizationId)
      const layouts: { layoutNumber: number, name: string }[] = layoutsCollection.map(x => ({ layoutNumber: x.layoutNumber, name: x.name }))

      const vatZonesCollection = await getAllVatZones(ctx.organizationId)
      const vatZones: { vatZoneNumber: number, name: string }[] = vatZonesCollection.map(x => ({ vatZoneNumber: x.vatZoneNumber, name: x.name }))

      const paymentTermsCollection = await getAllPaymentTerms(ctx.organizationId)
      const paymentTerms: { paymentTermNumber: number, name: string }[] = paymentTermsCollection.map(x => ({ paymentTermNumber: x.paymentTermsNumber, name: x.name }))

      const productsCollection = await getAllProducts(ctx.organizationId)
      const products: { productNumber: number, name: string }[] = productsCollection.map(x => ({ productNumber: x.productNumber, name: x.name }))

      const response = {
        ourReferences: ourReferences,
        customerContacts: customerContacts,
        units: units,
        layouts: layouts,
        vatZones: vatZones,
        paymentTerms: paymentTerms,
        products: products
      }

      return response
    },
  })
  .query("getInvoice", {
    input: z
      .object({
        invoiceId: z.string(),
      }),
    async resolve({ ctx, input }) {
      
    },
  })
  .mutation("createIssueInvoice", {
    input: z.object({
      invoiceInformation: z.object({
        title: z.string(),
        description: z.string(),
        currency: z.string(),
        dueDate: z.string(),
        roundingScheme: z.string(),
        pricePerHour: z.number(),
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
    async resolve({ ctx, input }) {
      let roundingScheme: RoundingScheme = mapRoundingScheme(input.invoiceInformation.roundingScheme)

      const invoice = await ctx.prisma.generalInvoice.create({
        data: {
          title: input.invoiceInformation.title,
          description: input.invoiceInformation.description,
          currency: <Currency> input.invoiceInformation.currency,
          dueDate: new Date(input.invoiceInformation.dueDate),
          roundingScheme: roundingScheme,
          pricePerHour: input.invoiceInformation.pricePerHour,
          organizationId: ctx.organizationId,
          economicOptions: {
            create: {
              customer: input.economicOptions.customer,
              text1: input.economicOptions.text1,
              ourReference: input.economicOptions.ourReference,
              customerContact: input.economicOptions.customerContact,
              unit: input.economicOptions.unit,
              layout: input.economicOptions.layout,
              vatZone: input.economicOptions.vatZone,
              paymentTerms: input.economicOptions.paymentTerms,
              product: input.economicOptions.product,
              organizationId: ctx.organizationId
            }
          },
          invoiceLines: {
            create: input.pickedIssues.map(line => {
              return ({
                title: line.name,
                hours: line.hoursSpent,
                pricePerHour: input.invoiceInformation.pricePerHour,
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
        description: z.string(),
        currency: z.string(),
        dueDate: z.string(),
        roundingScheme: z.string(),
        pricePerHour: z.number(),
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
    async resolve({ ctx, input }) {
      let roundingScheme: RoundingScheme = mapRoundingScheme(input.invoiceInformation.roundingScheme)

      const invoice = await ctx.prisma.generalInvoice.create({
        data: {
          title: input.invoiceInformation.title,
          description: input.invoiceInformation.description,
          currency: <Currency>input.invoiceInformation.currency,
          dueDate: new Date(input.invoiceInformation.dueDate),
          roundingScheme: roundingScheme,
          pricePerHour: input.invoiceInformation.pricePerHour,
          organizationId: ctx.organizationId,
          economicOptions: {
            create: {
              customer: input.economicOptions.customer,
              text1: input.economicOptions.text1,
              ourReference: input.economicOptions.ourReference,
              customerContact: input.economicOptions.customerContact,
              unit: input.economicOptions.unit,
              layout: input.economicOptions.layout,
              vatZone: input.economicOptions.vatZone,
              paymentTerms: input.economicOptions.paymentTerms,
              product: input.economicOptions.product,
              organizationId: ctx.organizationId,
            }
          },
          invoiceLines: {
            create: input.pickedTickets.map(line => {
              return ({
                title: line.subject,
                hours: 0,
                pricePerHour: input.invoiceInformation.pricePerHour,
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
