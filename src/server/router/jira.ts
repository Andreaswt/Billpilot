import { createRouter } from "./context";
import { TRPCError } from "@trpc/server";
import { logger } from "../../../lib/logger";
import { authenticateJira, getEmployees, getTotalHoursThisMonth } from "../../../lib/integrations/jira";
import { createRole } from "../../../lib/role";
import { createTeamScheme } from "../../../lib/team-schemes";

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

      // let role = await createRole("Test role", ctx.organizationId);

      // let employees = await getEmployees();

      // if (employees) {
      //   let res = await createTeamScheme({
      //     name: "testscheme",
      //     organizationId: ctx.organizationId,
      //     jiraEmployeesInRoles: [
      //       {
      //         role: role,
      //         jiraEmployees: employees
      //       }
      //     ]
      //   });

      // //   console.log(await getTotalHoursThisMonth());
      // }

      return "hej";
    },
  });
