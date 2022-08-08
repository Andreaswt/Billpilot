import { createRouter } from "./context";
import { TRPCError } from "@trpc/server";
import { logger } from "../../../lib/logger";
import { getEmployees, getHoursForEmployee, getHoursForIssues, getHoursForProject, getProjects, getTotalHoursThisMonth, getWorklogsThisMonth, importJiraTime, searchEpics, searchIssues, searchProjects } from "../../../lib/integrations/jira";
import { z } from "zod";
import { Epic } from "jira.js/out/agile/models/epic";

export const jiraRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const organizationId = ctx.session?.user.organizationId;

    if (!organizationId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, organizationId } })
  })
  .query("searchProjects", {
    input: z
      .object({
        searchTerm: z.string(),
      }),
    async resolve({ input, ctx }) {
      let projects = await searchProjects(input.searchTerm, ctx.organizationId);
      let tableFormatProjects: { 
        type: string, 
        key: string, 
        importTimeId: string, 
        name: string 
      }[] = [];

      projects?.values!.forEach((project) => {
        tableFormatProjects.push({
          type: "Project",
          importTimeId: project.key,
          key: project.key,
          name: project.name,
        });
      })

      let searchResult: {
        amount: number,
        total: number,
        tableFormatProjects: {
          type: string,
          importTimeId: string,
          key: string,
          name: string
        }[]
      } = {
        amount: projects?.values.length || 0,
        total: projects?.total || 0,
        tableFormatProjects: tableFormatProjects
      };

      return searchResult;
    },
  })
  .query("getEmployees", {
    input: z
    .object({
      searchTerm: z.string(),
    }),
    async resolve({ input, ctx }) {
      let employees = await getEmployees(input.searchTerm, ctx.organizationId);
      let tableFormatEmployees: { 
        type: string, 
        importTimeId: string,
        key: string, 
        name: string 
      }[] = [];

      employees?.forEach((employee) => {
        tableFormatEmployees.push({
          type: "Employee",
          importTimeId: employee.accountId,
          key: employee.accountId,
          name: employee.displayName!
        })
      })

      let searchResult: {
        amount: number,
        total: number,
        tableFormatEmployees: {
          type: string,
          importTimeId: string
          key: string,
          name: string
        }[]
      } = {
        amount: employees?.length || 0,
        total: employees?.length || 0,
        tableFormatEmployees: tableFormatEmployees
      };

      return searchResult;
    },
  })
  .query("searchIssues", {
    input: z
      .object({
        searchTerm: z.string(),
      }),
    async resolve({ input, ctx }) {
      let issues = await searchIssues(input.searchTerm, ctx.organizationId);

      let tableFormatIssues: {
        type: string,
        issueType: string,
        key: string,
        importTimeId: string,
        name: string
      }[] = [];

      issues?.issues?.forEach((issue) => {
        tableFormatIssues.push({
          type: "Issue",
          issueType: issue.fields.issuetype?.name!,
          importTimeId: issue.id,
          key: issue.key,
          name: issue.fields.summary
        })
      })

      let searchResult: {
        amount: number,
        total: number,
        tableFormatIssues: {
          type: string,
          issueType: string,
          importTimeId: string,
          key: string,
          name: string
        }[]
      } = {
        amount: issues?.issues?.length || 0,
        total: issues?.total || 0,
        tableFormatIssues: tableFormatIssues
      };

      return searchResult;
    },
  })
  .query("searchEpics", {
    input: z
      .object({
        searchTerm: z.string(),
      }),
    async resolve({ input, ctx }) {
      let epics = await searchEpics(input.searchTerm, ctx.organizationId);
      let tableFormatEpics: { 
        type: string, 
        issueType: string, 
        importTimeId: string, 
        key: string, 
        name: string 
      }[] = [];

      epics?.issues?.forEach((epic) => {
        tableFormatEpics.push({
          type: "Issue",
          issueType: epic.fields.issuetype?.name!,
          importTimeId: epic.key,
          key: epic.key,
          name: epic.fields.summary
        })
      })

      let searchResult: {
        amount: number,
        total: number,
        tableFormatIssues: {
          type: string,
          issueType: string,
          importTimeId: string
          key: string,
          name: string
        }[]
      } = {
        amount: epics?.issues?.length || 0,
        total: epics?.total || 0,
        tableFormatIssues: tableFormatEpics
      };

      return searchResult;
    },
  })
  .query("importJiraTime", {
    input: z
      .object({
        accountIds: z.string().array(),
        issueIds: z.string().array(),
        projectKeys: z.string().array(),
      }),
      async resolve({ input, ctx }) {
        return await importJiraTime(input.accountIds, input.issueIds, input.projectKeys, ctx.organizationId);
      }
  });
