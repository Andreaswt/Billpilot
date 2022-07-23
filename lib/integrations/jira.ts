import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Version3Client } from 'jira.js';
import { Worklog } from 'jira.js/out/version3/models';
import { prisma } from "../../src/server/db/client";
import { logger } from '../logger';

// Development notes:
// https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/

let client: Version3Client;

export async function authenticateJira(connectionsDetails: { host: string, username: string, password: string }) {
    client = new Version3Client({
        newErrorHandling: true,
        host: connectionsDetails.host,
        authentication: {
            basic: {
                email: connectionsDetails.username,
                apiToken: connectionsDetails.password,
            },
        },
    })
}

function isAuthenticated() {
    if (!client) {
        throw new Error("Jira client not authenticated");
    }
}

// Issues
export async function getIssue(id: string) {
    isAuthenticated();

    try {
        let issue = await client.issues.getIssue({ issueIdOrKey: id });
        return issue;
    } catch (error) {
        logger.error(error);
    }
}

// Worklogs
export async function getTotalHoursThisMonth() {
    isAuthenticated();

    let worklogs = await getWorklogsThisMonth();

    let hours = 0;
    worklogs!.forEach(worklog => {
        hours += worklog.timeSpentSeconds! / 3600;
    });

    return hours;
}

export async function getBillableHoursThisMonth() {
    isAuthenticated();

    let worklogs = await getWorklogsThisMonth();

    let billableHours = 0;
    worklogs!.forEach(worklog => {
        billableHours += worklog.timeSpentSeconds! / 3600;
    });

    return billableHours;
}

export async function getNonBillableHoursThisMonth() {
    isAuthenticated();

    let billableHours = await getBillableHoursThisMonth();
    let totalTime = await getTotalHoursThisMonth();

    return totalTime - billableHours; // = non-billable hours
}

export async function getUninvoicedHoursThisMonth() {
    isAuthenticated();

    // Get total hours this month
    let totalHoursThisMonth = await getTotalHoursThisMonth();

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

export async function getWorklogsThisMonth(onlyBillable: boolean = false) {
    isAuthenticated();

    try {
        // Get all issues with worklogs between start and end date of month
        let response = await client.issueSearch.searchForIssuesUsingJql({ jql: "worklogDate >= startOfMonth() and worklogDate <= endOfMonth()", fields: ["worklog"] });

        let [firstDay, lastDay] = firstAndLastDayOfThisMonth()

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
    isAuthenticated();

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
    isAuthenticated();

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
export async function getProjects() {
    isAuthenticated();

    try {
        let projects = await client.projects.getAllProjects();
        return projects;
    } catch (error) {
        logger.error(error);
    }
}

// Employees
export async function getEmployees() {
    isAuthenticated();

    try {
        let employees = await client.users.getAllUsers();
        return employees;
    } catch (error) {
        logger.error(error);
    }
}

export async function rebuildReport() {
    isAuthenticated();

    let uninvoicedTime = await getUninvoicedHoursThisMonth();
    let billableTime = await getBillableHoursThisMonth();
    let totalTime = await getTotalHoursThisMonth();
    let nonBillableTime = await getNonBillableHoursThisMonth();

    return {uninvoicedTime: uninvoicedTime, billableTime: billableTime, totalTime: totalTime, nonBillableTime: nonBillableTime};
}

function firstAndLastDayOfThisMonth() {
    isAuthenticated();

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    return [firstDay, lastDay];
}