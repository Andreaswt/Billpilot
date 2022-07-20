import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import JiraApi from 'jira-client';
import { Version3Client } from 'jira.js';
import { Worklog } from 'jira.js/out/version3/models';
// import {  } from 'jira.js/out/version2/models';
import { logger } from '../logger';

// Development notes:
//https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/



let jira: JiraApi;
let client: Version3Client;

export async function authenticateJira(connectionsDetails: {host: string, username: string, password: string}) {
    jira = new JiraApi({
        protocol: 'https',
        host: connectionsDetails.host,
        username: connectionsDetails.username,
        password: connectionsDetails.password,
        apiVersion: '3',
        strictSSL: true
    });

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
    
    // TODO: handle jira authentication errors
}

// Issues
export async function findIssue(id: string) {
    try {
        let issue = await jira.findIssue("TES-1");
        return issue;
    } catch (error) {
        logger.error(error);
    }
}

export async function getAllIssues() {
    try {
        let issues = await jira.findIssue("TES-1");

        return issues;
    } catch (error) {
        logger.error(error);
    }
}

// Worklogs
export async function getTotalHoursThisMonth() {
    let worklogs = await getWorklogsThisMonth();
    console.log(worklogs);

    let hours = 0;
    worklogs!.forEach(worklog => {
        hours += worklog.timeSpentSeconds! / 3600;
    });

    return hours;
}

export async function getBillableHoursThisMonth() {
    // Get total hours this month
    let totalHoursThisMonth = await getTotalHoursThisMonth();

    let [firstDay, lastDay] = firstAndLastDayOfThisMonth()

    // get date an hour ago
    firstDay = new Date();
    firstDay.setHours(firstDay.getHours() - 1);
    
    // Find all billed hours this month and deduct from total hours for billable hours this month
    let billedWorklogs = await prisma?.worklog.findMany({
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


async function getWorklogsThisMonth() {
    try {
        // Get all issues with worklogs between start and end date of month
        let response = await client.issueSearch.searchForIssuesUsingJql({jql: "worklogDate >= startOfMonth() and worklogDate <= endOfMonth()", fields: ["worklog"]});
        
        let [firstDay, lastDay] = firstAndLastDayOfThisMonth()

        // Create array to contain worklogs
        let worklogs: Worklog[] = [];

        // Loop through all issues from search if objects exist
        response!.issues!.forEach(issue => {
            
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

function firstAndLastDayOfThisMonth() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    return [firstDay, lastDay];
}