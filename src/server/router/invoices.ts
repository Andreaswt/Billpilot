import { createRouter } from "./context";
import { TRPCError } from "@trpc/server";
import { createInvoice, getInvoice } from "../../../lib/invoice";
import { z } from "zod";
import { Invoice } from "@prisma/client";

export const invoicesRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const organizationId = ctx.session?.user.organizationId;

    if (!organizationId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, organizationId } })
  })
  .query("test", {
    async resolve({ ctx }) {
      
      // console.log(await createInvoice(invoice, ctx.organizationId));

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
  .mutation("createInvoice", {
    input: z.object({
      name: z.string(),
      status: z.string(),
      invoiceNumber: z.number(),
      currencyName: z.string(),
      invoicedFrom: z.date(),
      invoicedTo: z.date(),
      issueDate: z.date(),
      dueDate: z.date(),
      clientName: z.string(),
      notesForClient: z.string(),
      organizationId: z.string()
    }),
    async resolve({ ctx, input }) {
      return await createInvoice(input, ctx.organizationId);
    }
  });
