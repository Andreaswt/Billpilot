import { InvoiceTemplateFilterTypes } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { generateInvoices } from "../../../lib/generator";
import { createRouter } from "./context";

export const invoiceTemplatesRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const organizationId = ctx.session?.user.organizationId;

    if (!organizationId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, organizationId } })
  })
  .query("getInvoiceTemplates", {
    input: z
      .object({
        clientId: z.string(),
      }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.invoiceTemplate.findMany({
        where: {
          organizationId: ctx.organizationId,
          clientId: input.clientId,
        },
        include: {
          filters: true,
          invoiceTemplateFixedPriceTimeItems: true
        }
      })
    },
  })
  .mutation("create", {
    input: z.object({
      clientId: z.string(),
      title: z.string(),
      active: z.boolean(),
      fixedPriceTimeItems: z.object({
        name: z.string(),
        amount: z.number(),
      }).array(),
      filters: z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        provider: z.string()
      }).array()
    }),
    async resolve({ input, ctx }) {
      await ctx.prisma.invoiceTemplate.create({
        data: {
          organization: {
            connect: {
              id: ctx.organizationId
            }
          },
          title: input.title,
          active: input.active,
          client: {
            connect: {
              organizationsClient: {
                id: input.clientId,
                organizationId: ctx.organizationId
              }
            },
          },
          filters: {
            create: [
              ...input.filters.map(x => {
                return {
                  filterId: x.id,
                  name: x.name,
                  type: <InvoiceTemplateFilterTypes>x.provider,
                  organization: {
                    connect: {
                      id: ctx.organizationId
                    }
                  }
                }
              }),
            ]
          },
          invoiceTemplateFixedPriceTimeItems: {
            create: [
              ...input.fixedPriceTimeItems.map(x => {
                return {
                  name: x.name,
                  amount: x.amount,
                  organization: {
                    connect: {
                      id: ctx.organizationId
                    }
                  }
                }
              }),
            ]
          },
        },
      });
    }
  })
  .mutation("changeActiveStatus", {
    input: z.object({
      invoiceTemplateId: z.string(),
      active: z.boolean()
    }),
    async resolve({ input, ctx }) {
      await ctx.prisma.invoiceTemplate.update({
        where: {
          id: input.invoiceTemplateId,
        },
        data: {
          active: !input.active
        }
      })
    }
  })
  .mutation("delete", {
    input: z.object({
      invoiceTemplateId: z.string(),
    }),
    async resolve({ input, ctx }) {
      await ctx.prisma.invoiceTemplate.delete({
        where: {
          id: input.invoiceTemplateId,
        }
      })
    }
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.client.findMany({
        where: {
          organizationId: ctx.organizationId,
        },
        include: {
          invoiceTemplates: true
        }
      })
    }
  })
  .mutation("generateInvoices", {
    input: z.object({
      dateFrom: z.date(),
      dateTo: z.date(),
      invoiceTemplateIds: z.string().array()
    }),
    async resolve({ input, ctx }) {
      return generateInvoices(input.dateFrom, input.dateTo, input.invoiceTemplateIds, ctx.organizationId)
    }
  });