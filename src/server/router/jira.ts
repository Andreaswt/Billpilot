import { createRouter } from "./context";
import { TRPCError } from "@trpc/server";
import { logger } from "../../../lib/logger";
import { getTotalHoursThisMonth } from "../../../lib/integrations/jira";

export const jiraRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const organizationId = ctx.session?.user.organizationId;

    if (!organizationId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, organizationId } })
  })
  .query("test", {
    async resolve({ ctx }) {

      logger.debug("Test:")

      // host: "https://atrol21.atlassian.net", username: "atrol21@student.sdu.dk", password: "bhMH87dr3TE7rWF4oepiD912"

      // console.log(await getTotalHoursThisMonth(ctx.organizationId));

      return "hej";
    },
  });
