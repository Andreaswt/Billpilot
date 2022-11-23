import { TRPCError } from "@trpc/server";
import { test } from "../../../lib/integrations/workbooks";
import { createRouter } from "./context";

export const workbooksRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const organizationId = ctx.session?.user.organizationId;

    if (!organizationId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, organizationId } })
  })
  .query("test", {
    async resolve({ input, ctx }) {
      console.log(JSON.stringify(await test(ctx.organizationId)))
    },
  });