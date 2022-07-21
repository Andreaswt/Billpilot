import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { logger } from "../../../lib/logger";
import { authenticateJira, billWorklogs, createAndBillWorklogs, getWorklogsThisMonth } from "../../../lib/jira/jira";

export const jiraRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const userId = ctx.session?.user.id;

    if (!userId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, userId } })
  })
  .query("test", {
    async resolve({ ctx }) {
      
      logger.debug("Test:")

      await authenticateJira({ host: "https://atrol21.atlassian.net", username: "atrol21@student.sdu.dk", password: "bhMH87dr3TE7rWF4oepiD912" });

      let worklogs = await getWorklogsThisMonth();

      if (worklogs) {
        await createAndBillWorklogs(worklogs, ctx.userId);
      }

      return "hej";
    },
  });
  // .mutation("createWorklogs", {
  //   input: z
  //     .object({
  //       userId: z.string(),
  //       worklogId: z.string(),
  //       issueId: z.string(),
  //       hours: z.number(),
  //       started: z.date()
  //     }).array(),
  //   async resolve({ input, ctx }) {
  //     return createAndBillWorklogs(input, ctx.userId);
  //   }
  // });
