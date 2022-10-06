import { ClientStatus, Currency } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { mapRoundingScheme, mapRoundingSchemeToString, mapStatus, mapStatusToString } from "../../../lib/helpers/invoices";
import { getAllEmployees, getAllLayouts, getAllPaymentTerms, getAllProducts, getAllUnits, getAllVatZones, getCustomer, getCustomerContact, getCustomerContacts, getEmployee, getLayout, getPaymentTerm, getProduct, getUnit, getVatZone, getVatZones } from "../../../lib/integrations/e-conomic";
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
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.client.findUniqueOrThrow({
        where: {
          organizationsClient: {
            organizationId: ctx.organizationId,
            id: input.id
          },
        },
        include: {
          economicOptions: true
        }
      })
    }
  })
  .query("getReadableClient", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const client = await ctx.prisma.client.findUniqueOrThrow({
        where: {
          organizationsClient: {
            organizationId: ctx.organizationId,
            id: input.id
          },
        },
        include: {
          economicOptions: true
        }
      })

      return {
        ...client,
        roundingScheme: mapRoundingSchemeToString(client.roundingScheme),
        status: mapStatusToString(client.status),
        ...(client.economicOptions
          ? {
            economicOptions: {
              layout: (await getLayout(ctx.organizationId, client.economicOptions.layout)).name,
              customer: (await getCustomer(ctx.organizationId, client.economicOptions.customer)).name,
              text1: client.economicOptions.text1 ?? "-",
              ourReference: (await getEmployee(ctx.organizationId, client.economicOptions.ourReference)).name,
              customerContact: (await getCustomerContact(ctx.organizationId, client.economicOptions.customer, client.economicOptions.customerContact)).name,
              unit: (await getUnit(ctx.organizationId, client.economicOptions.unit)).name,
              vatZone: (await getVatZone(ctx.organizationId, client.economicOptions.vatZone)).name,
              paymentTerms: (await getPaymentTerm(ctx.organizationId, client.economicOptions.paymentTerms)).name,
              product: (await getProduct(ctx.organizationId, client.economicOptions.product)).name,
            }
          }
          : null),
      }
    }
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
  .mutation("updateClient", {
    input: z.object({
      id: z.string(),
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
      await ctx.prisma.client.update({
        where: {
          organizationsClient: {
            organizationId: ctx.organizationId,
            id: input.id
          }
        },
        data: {
          name: input.clientInformation.name,
          currency: <Currency>input.clientInformation.currency,
          roundingScheme: mapRoundingScheme(input.clientInformation.roundingScheme),
          pricePerHour: input.clientInformation.pricePerHour,
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
          pricePerHour: input.clientInformation.pricePerHour,
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