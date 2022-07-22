import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { logger } from "../../../lib/logger";
import { authenticateJira, createAndBillWorklogs, getWorklogsThisMonth } from "../../../lib/jira";
import { createRole } from "../../../lib/role";
import { addRolesToPricelist, createPricelist } from "../../../lib/pricelist";

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

      // let role1 = await createRole("rolle1", "cl5v4tc510000ut0g4bdvj8jf");
      // let role2 = await createRole("rolle2", "cl5v4tc510000ut0g4bdvj8jf");

      // let pl = await createPricelist("pricelist1", "cl5v4tc510000ut0g4bdvj8jf");
      // let ropl = await addRolesToPricelist("pricelist1", [{ rolename: "rolle1", hourlyRate: 100 }, { rolename: "rolle2", hourlyRate: 200 }]);

      // console.log(ropl);

      return "hej";
    },
  });
