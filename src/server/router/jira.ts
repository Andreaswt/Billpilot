import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { useInputGroupStyles } from "@chakra-ui/react";
import { logger } from "../../../lib/logger";
import { authenticateJira, findIssue, getAllIssues, getWorklogs } from "../../../lib/jira/jira";

export const jiraRouter = createRouter()
  .query("test", {
    async resolve({ ctx }) {
      logger.debug("Test:")
      await authenticateJira({host: "https://atrol21.atlassian.net", username: "atrol21@student.sdu.dk", password: "bhMH87dr3TE7rWF4oepiD912"});
      
      logger.debug(await getWorklogs());

      return "hej";
    },
  });
