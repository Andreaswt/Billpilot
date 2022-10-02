import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { searchCompanies, searchTickets } from "../../../lib/integrations/hubspot";
import { getEmployees, importJiraTime, searchEpics, searchIssues, searchProjectIssues, searchProjects } from "../../../lib/integrations/jira";
import { createRouter } from "./context";


export const hubspotRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const organizationId = ctx.session?.user.organizationId;

    if (!organizationId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, organizationId } })
  })
  .query("searchCompanies", {
    input: z
      .object({
        searchTerm: z.string(),
      }),
    async resolve({ input, ctx }) {
      let companies = await searchCompanies(ctx.organizationId, input.searchTerm);
      
      let tableFormatCompanies: { 
        id: string, 
        name: string, 
        domain: string, 
        city: string 
      }[] = [];

      companies.results.forEach((company) => {
        tableFormatCompanies.push({
          id: company.id,
          name: company.properties["name"],
          domain: company.properties["domain"],
          city: company.properties["city"],
        });
      })

      let searchResult: {
        amount: number,
        total: number,
        companies: {
          id: string, 
          name: string, 
          domain: string, 
          city: string 
        }[]
      } = {
        amount: companies.results.length,
        total: companies.total,
        companies: tableFormatCompanies
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
  .query("searchTickets", {
    input: z
      .object({
        companyId: z.string(),
        searchTerm: z.string(),
      }),
    async resolve({ input, ctx }) {
      let tickets = await searchTickets(ctx.organizationId, input.companyId, input.searchTerm)
      let response: {
        id: string
        subject: string
        content: string
        lastModified: string
      }[] = [];

      tickets.results.forEach((ticket) => {
        response.push({
          id: ticket.properties["hs_object_id"],
          subject: ticket.properties["subject"],
          content: ticket.properties["content"],
          lastModified: new Date(ticket.properties["hs_lastmodifieddate"]).toUTCString()
        })
      })

      let searchResult: {
        amount: number,
        total: number,
        tickets: {
          id: string
          subject: string
          content: string
          lastModified: string
        }[]
      } = {
        amount: tickets.results.length || 0,
        total: tickets.total || 0,
        tickets: response
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
