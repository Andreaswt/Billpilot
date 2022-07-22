import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { logger } from "../../../lib/logger";
import { authenticateJira, createAndBillWorklogs, getProjects, getTotalHoursThisMonth, getWorklogsThisMonth } from "../../../lib/integrations/jira";
import { createRole } from "../../../lib/role";
import { addRolesToPricelist, createPricelist } from "../../../lib/pricelist";
import { createProjectsInDatabase } from "../../../lib/project";

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

      await authenticateJira({ host: "https://atrol21.atlassian.net", username: "atrol21@student.sdu.dk", password: "bhMH87dr3TE7rWF4oepiD912" });

      // let projects = await getProjects();
      // if (projects) {
      //   await createProjectsInDatabase(projects, ctx.organizationId);
      // }

      console.log(await getTotalHoursThisMonth());

      return "hej";
    },
  });
