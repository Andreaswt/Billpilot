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
      applyTaxToItems: z.boolean(),
      taxName: z.string(),
      taxAmount: z.number(),
      fixedPriceTimeItems: z.object({
        name: z.string(),
        amount: z.number(),
        applyTax: z.boolean()
      }).array(),
      filters: z.object({
        id: z.string(),
        name: z.string(),
        type: z.string()
      }).array()
    }),
    async resolve({ input, ctx }) {

    }
  });