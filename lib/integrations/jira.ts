import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { AgileClient, Version3Client } from 'jira.js';
import { Issues } from 'jira.js/out/version3';
import { Issue, Worklog, SearchResults } from 'jira.js/out/version3/models';
import { prisma } from "../../src/server/db/client";
import { logger } from '../logger';

// Development notes:
// https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/

// Issues
export async function getIssue(id: string, organizationId: string) {
    let client = await getClient(organizationId);

    try {
        let issue = await client.issues.getIssue({ issueIdOrKey: id });
        return issue;
    } catch (error) {
        logger.error(error);
    }
}

export async function searchIssues(searchTerm: string, organizationId: string, issueType?: string,) {
    let client = await getClient(organizationId);

    // TODO: make prettier
    try {
        if (!issueType) {
            if (searchTerm === "") {
                return await client.issueSearch.searchForIssuesUsingJql({ jql: '' });
            }
            else {
                return await client.issueSearch.searchForIssuesUsingJql({ jql: 'summary ~ "' + searchTerm + '"' });
            }
        }
        else {
            if (searchTerm === "") {
                return await client.issueSearch.searchForIssuesUsingJql({ jql: 'issuetype = ' + issueType });
            }
            else {
                return await client.issueSearch.searchForIssuesUsingJql({ jql: 'issuetype = ' + issueType + ' AND summary ~ "' + searchTerm + '"' });
            }
        }
    } catch (error) {
        logger.error(error);
    }
}

export async function getHoursForIssues(issueIds: string[], organizationId: string) {
    let client = await getClient(organizationId);

    // Get all projects from our database, so we know which ones are billable
    let projects = await prisma.project.findMany({
        select: {
            key: true,
        },
        where: {
            organizationId: organizationId,
            billable: true,
        }
    })

    let projectKeys = projects.map(project => project.key);

    let hours = 0;
    try {
        for (let i = 0; i < issueIds.length; i++) {
            let issue = await client.issues.getIssue({ issueIdOrKey: issueIds[i] });

            if (projectKeys.indexOf(issue.fields.project.key) !== -1) {
                return;
            }

            hours += issue.fields.timespent! / 3600;
        }

        return hours;
    } catch (error) {
        logger.error(error);
    }
}

// Worklogs
export async function getTotalHoursThisMonth(organizationId: string) {
    let worklogs = await getWorklogsThisMonth(organizationId);

    let hours = 0;
    worklogs!.forEach(worklog => {
        hours += worklog.timeSpentSeconds! / 3600;
    });

    return hours;
}

export async function getBillableHoursThisMonth(organizationId: string) {
    let client = await getClient(organizationId);

    let worklogs = await getWorklogsThisMonth(organizationId);

    let billableHours = 0;
    worklogs!.forEach(worklog => {
        billableHours += worklog.timeSpentSeconds! / 3600;
    });

    return billableHours;
}

export async function getNonBillableHoursThisMonth(organizationId: string) {
    let client = await getClient(organizationId);

    let billableHours = await getBillableHoursThisMonth(organizationId);
    let totalTime = await getTotalHoursThisMonth(organizationId);

    return totalTime - billableHours; // = non-billable hours
}

export async function getUninvoicedHoursThisMonth(organizationId: string) {
    let client = await getClient(organizationId);

    // Get total hours this month
    let totalHoursThisMonth = await getTotalHoursThisMonth(organizationId);

    let [firstDay, lastDay] = firstAndLastDayOfThisMonth()

    // get date an hour ago
    firstDay = new Date();
    firstDay.setHours(firstDay.getHours() - 1);

    // Find all billed hours this month and deduct from total hours for billable hours this month
    let billedWorklogs = await prisma?.worklog.findMany({
        select: {
            hours: true,
        },
        where: {
            organizationId: organizationId,
            started: {
                lte: firstDay,
                gte: lastDay,
            },
        }
    });

    let billedTime = 0;
    billedWorklogs!.forEach(worklog => {
        billedTime += new Prisma.Decimal(worklog.hours).toNumber();
    })

    return totalHoursThisMonth - billedTime;
}

export async function getWorklogsThisMonth(organizationId: string, project?: string, onlyBillable: boolean = false) {
    let client = await getClient(organizationId);

    try {
        let startAt = 0;
        let total = 1;
        let maxResults = 100;
        let jql = project ? "worklogDate >= startOfMonth() and worklogDate <= endOfMonth() and project = " + project : "worklogDate >= startOfMonth() and worklogDate <= endOfMonth()";

        let issues: Issue[] = [];
        while (startAt <= total) {
            // Get all issues with worklogs between start and end date of month
            // Results are paginated, so we need to loop through all pages
            let response = await client.issueSearch.searchForIssuesUsingJql({ jql: jql, startAt: startAt, maxResults: maxResults, fields: ["worklog", "project"] });

            issues.push(...response.issues!)
            startAt += maxResults
            total = response.total!;
        }

        // Create array to contain worklogs
        let worklogs: Worklog[] = [];

        // Get all projects from our database, so we know which ones are billable
        let projects = await prisma.project.findMany({
            select: {
                key: true,
            },
            where: {
                organizationId: organizationId,
                billable: false,
            }
        })

        let projectKeys = projects.map(projectDb => projectDb.key);

        // Loop through all issues from search if objects exist
        issues.forEach(issue => {

            if (onlyBillable) {
                // Only summarize time for worklogs in issues, that isn't contained in projects that aren't billable
                if (projectKeys.indexOf(issue.fields.project.key) !== -1) {
                    return;
                }
            }

            // Loop through all worklogs
            issue.fields.worklog.worklogs.forEach(worklog => {
                worklogs.push(worklog);
            })
        });

        return worklogs;

    } catch (error) {
        logger.error(error);
    }
}

export async function createAndBillWorklogs(worklogs: Worklog[], organizationId: string) {
    let client = await getClient(organizationId);

    let mappedWorklog = worklogs.map(w =>
    ({
        worklogId: w.id!,
        issueId: w.issueId!,
        hours: w.timeSpentSeconds! / 3600,
        started: new Date(w.started!).toISOString(),
        organizationId: organizationId,
        billed: true,
        billedDate: new Date().toISOString()
    }));

    const worklogsResult = await prisma.worklog.createMany({
        data: mappedWorklog,
    })

    return {
        worklogs: worklogsResult
    }
}

export async function billWorklogs(worklogIds: string[], organizationId: string) {
    let client = await getClient(organizationId);

    const worklogsResult = await prisma.worklog.updateMany({
        where: {
            worklogId: {
                in: worklogIds.map(w => w)
            },
            organizationId: {
                in: organizationId
            }
        },
        data: worklogIds.map(w => ({ billed: true, billedDate: Date.now() }))
    })

    return {
        worklogs: worklogsResult
    }
}

// Projects
export async function getProjects(organizationId: string) {
    let client = await getClient(organizationId);

    try {
        let projects = await client.projects.getAllProjects();
        return projects;
    } catch (error) {
        logger.error(error);
    }
}

export async function searchProjects(searchTerm: string, organizationId: string) {
    let client = await getClient(organizationId);

    try {
        let projects = await client.projects.searchProjects({ query: searchTerm });
        return projects;
    } catch (error) {
        logger.error(error);
    }
}

export async function getHoursForProject(projectsKey: string, organizationId: string) {
    let worklogs = await getWorklogsThisMonth(organizationId, projectsKey, true);

    let hours = 0;
    try {
        worklogs!.forEach(worklog => {
            hours += new Prisma.Decimal(worklog.timeSpentSeconds!).toNumber() / 3600;
        })
        
        return hours;
    } catch (error) {
        logger.error(error);
    }
}

// Employees
export async function getEmployees(searchTerm: string, organizationId: string) {
    let client = await getClient(organizationId);

    try {
        // let employees = await client.users.getAllUsers();
        // 'summary ~ "' + searchTerm + '"'
        let employees = await client.userSearch.findUsers({ query: searchTerm });
        return employees;
    } catch (error) {
        logger.error(error);
    }
}

export async function getHoursForEmployee(accountId: string, organizationId: string) {
    let worklogs = await getWorklogsThisMonth(organizationId, undefined, true);

    let hours = 0;
    try {
        worklogs!.forEach(worklog => {
            if (worklog.author!.accountId === accountId) {
                hours += new Prisma.Decimal(worklog.timeSpentSeconds!).toNumber() / 3600;
            }
        })
        
        return hours;
    } catch (error) {
        logger.error(error);
    }
}

export async function rebuildReport(organizationId: string) {
    let client = await getClient(organizationId);

    let uninvoicedTime = await getUninvoicedHoursThisMonth(organizationId);
    let billableTime = await getBillableHoursThisMonth(organizationId);
    let totalTime = await getTotalHoursThisMonth(organizationId);
    let nonBillableTime = await getNonBillableHoursThisMonth(organizationId);

    return { uninvoicedTime: uninvoicedTime, billableTime: billableTime, totalTime: totalTime, nonBillableTime: nonBillableTime };
}

// Epics
export async function searchEpics(searchTerm: string, organizationId: string) {
    return await searchIssues(searchTerm, organizationId, "Epic");
}

// Helpers for invoice creator
export async function importJiraTime(accountIds: string[], issueIds: string[], projectsKeys: string[], organizationId: string) {
    // We want to avoid duplicate time being imported
    // We keep track of the id's of all worklogs that have been imported, and can check for duplicates during imports
    let hours = 0;
    let importedWorklogs: string[] = [];

    /* ------------ Import employee and issue hours ------------ */
    let worklogs = await getWorklogsThisMonth(organizationId, undefined, true);

    worklogs!.forEach(worklog => {
        if (importedWorklogs.includes(worklog.id!)) return;
        
        // Employee Hours and Issue Hours
        if (accountIds.includes(worklog.author!.accountId!) || issueIds.includes(worklog.issueId!)) {
            hours += new Prisma.Decimal(worklog.timeSpentSeconds!).toNumber() / 3600;
            importedWorklogs.push(worklog.id!);
            return;
        }
    })

    /* ------------ Import project hours ------------ */
    projectsKeys.forEach(async projectKey => {
        let projectWorklogs = await getWorklogsThisMonth(organizationId, projectKey, true);

        projectWorklogs!.forEach(worklog => {
            if (importedWorklogs.includes(worklog.id!)) return;

            if (!importedWorklogs.includes(worklog.id!)) {
                hours += new Prisma.Decimal(worklog.timeSpentSeconds!).toNumber() / 3600;
                importedWorklogs.push(worklog.id!);
                return;
            }
        })
    })

    return hours;
}

async function getApiKeys(organizationId: string) {
    // Get api keys from database, and authenticate with them
    let apikeys = await prisma.apiKey.findMany({
        where: {
            organizationId: organizationId,
            provider: "Jira",
            key: { in: ["Your Jira Website Link", "Username", "Password"] }
        },
        select: {
            key: true,
            value: true
        }
    })

    if (!apikeys.find(x => x.key === "Your Jira Website Link")) {
        throw new Error("No Jira website link found");
    }

    if (!apikeys.find(x => x.key === "Username")) {
        throw new Error("No Jira username found");
    }

    if (!apikeys.find(x => x.key === "Password")) {
        throw new Error("No Jira password found");
    }

    let jiraWebsiteLink = apikeys.find(x => x.key === "Your Jira Website Link")!.value;
    let username = apikeys.find(x => x.key === "Username")!.value;
    let password = apikeys.find(x => x.key === "Password")!.value;

    return [jiraWebsiteLink, username, password];
}

async function getClient(organizationId: string) {
    let [jiraWebsiteLink, username, password] = await getApiKeys(organizationId);

    return new Version3Client({
        newErrorHandling: true,
        host: jiraWebsiteLink,
        authentication: {
            basic: {
                email: username,
                apiToken: password,
            },
        },
    })
}

function firstAndLastDayOfThisMonth() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    return [firstDay, lastDay];
}