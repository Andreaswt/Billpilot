import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Version3Client } from 'jira.js';
import { Worklog } from 'jira.js/out/version3/models';
import { prisma } from "../../src/server/db/client";
import { logger } from '../logger';

// Development notes:
// https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/

let client: Version3Client;

export async function isAuthenticated(organizationId: string) {
    // Get api keys from database, and authenticate with them
    let apikeys = await prisma.apiKey.findMany({
        where: {
            organizationId: organizationId,
            provider: "Jira",
            key: { in: ["Your Jira Website Link", "Username", "Password" ] }
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

    client = new Version3Client({
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

// Issues
export async function getIssue(id: string, organizationId: string) {
    isAuthenticated(organizationId);

    try {
        let issue = await client.issues.getIssue({ issueIdOrKey: id });
        return issue;
    } catch (error) {
        logger.error(error);
    }
}

// Worklogs
export async function getTotalHoursThisMonth(organizationId: string) {
    isAuthenticated(organizationId);

    let worklogs = await getWorklogsThisMonth(organizationId);

    let hours = 0;
    worklogs!.forEach(worklog => {
        hours += worklog.timeSpentSeconds! / 3600;
    });

    return hours;
}

export async function getBillableHoursThisMonth(organizationId: string) {
    isAuthenticated(organizationId);

    let worklogs = await getWorklogsThisMonth(organizationId);

    let billableHours = 0;
    worklogs!.forEach(worklog => {
        billableHours += worklog.timeSpentSeconds! / 3600;
    });

    return billableHours;
}

export async function getNonBillableHoursThisMonth(organizationId: string) {
    isAuthenticated(organizationId);

    let billableHours = await getBillableHoursThisMonth(organizationId);
    let totalTime = await getTotalHoursThisMonth(organizationId);

    return totalTime - billableHours; // = non-billable hours
}

export async function getUninvoicedHoursThisMonth(organizationId: string) {
    isAuthenticated(organizationId);

    // Get total hours this month
    let totalHoursThisMonth = await getTotalHoursThisMonth(organizationId);

    let [firstDay, lastDay] = firstAndLastDayOfThisMonth(organizationId)

    // get date an hour ago
    firstDay = new Date();
    firstDay.setHours(firstDay.getHours() - 1);

    // Find all billed hours this month and deduct from total hours for billable hours this month
    let billedWorklogs = await prisma?.worklog.findMany({
        select: {
            hours: true,
        },
        where: {
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

export async function getWorklogsThisMonth(organizationId: string, onlyBillable: boolean = false) {
    isAuthenticated(organizationId);

    try {
        // Get all issues with worklogs between start and end date of month
        let response = await client.issueSearch.searchForIssuesUsingJql({ jql: "worklogDate >= startOfMonth() and worklogDate <= endOfMonth()", fields: ["worklog"] });

        let [firstDay, lastDay] = firstAndLastDayOfThisMonth(organizationId)

        // Create array to contain worklogs
        let worklogs: Worklog[] = [];

        // Get all projects fomr our database, so we know which ones are billable
        let projects = await prisma.project.findMany({
            select: {
                key: true,
            },
            where: {
                billable: true,
            }
        })

        let projectKeys = projects.map(project => project.key);

        // Loop through all issues from search if objects exist
        response!.issues!.forEach(issue => {

            if (onlyBillable) {
                // Only summarize time for worklogs in issues, that isn't contained in projects that aren't billable
                if (projectKeys.indexOf(issue.key.split('-')[0]!) === -1) {
                    return;
                }
            }

            // Loop through all worklogs
            issue.fields.worklog.worklogs.forEach(worklog => {

                // JS representation of the date, since it's a string from the API
                let date = new Date(worklog.started!);

                // If worklog is between start and end date of month then add to array
                if (date >= firstDay! && date <= lastDay!) {
                    worklogs.push(worklog);
                }
            })
        });

        return worklogs;

    } catch (error) {
        logger.error(error);
    }
}

export async function createAndBillWorklogs(worklogs: Worklog[], organizationId: string) {
    isAuthenticated(organizationId);

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
    isAuthenticated(organizationId);

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
    isAuthenticated(organizationId);

    try {
        let projects = await client.projects.getAllProjects();
        return projects;
    } catch (error) {
        logger.error(error);
    }
}

// Employees
export async function getEmployees(organizationId: string) {
    isAuthenticated(organizationId);

    try {
        let employees = await client.users.getAllUsers();
        return employees;
    } catch (error) {
        logger.error(error);
    }
}

export async function rebuildReport(organizationId: string) {
    isAuthenticated(organizationId);

    let uninvoicedTime = await getUninvoicedHoursThisMonth(organizationId);
    let billableTime = await getBillableHoursThisMonth(organizationId);
    let totalTime = await getTotalHoursThisMonth(organizationId);
    let nonBillableTime = await getNonBillableHoursThisMonth(organizationId);

    return {uninvoicedTime: uninvoicedTime, billableTime: billableTime, totalTime: totalTime, nonBillableTime: nonBillableTime};
}

function firstAndLastDayOfThisMonth(organizationId: string) {
    isAuthenticated(organizationId);

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    return [firstDay, lastDay];
}