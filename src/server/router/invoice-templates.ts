import { InvoiceTemplateFilterTypes } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const invoiceTemplatesRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const organizationId = ctx.session?.user.organizationId;

    if (!organizationId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, organizationId } })
  })
  .mutation("create", {
    input: z.object({
      clientId: z.string(),
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
          active: input.active,
          client: {
            connect: {
              id: input.clientId
            }
          },
          filters: {
            create: [
              ...input.filters.map(x => {
                return {
                  filterId: x.id,
                  name: x.name,
                  type: <InvoiceTemplateFilterTypes>x.provider,
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
                }
              }),
            ]
          },
        },
      });
    }
  });