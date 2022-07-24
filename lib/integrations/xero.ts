import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Version3Client } from 'jira.js';
import { Worklog } from 'jira.js/out/version3/models';
import { prisma } from "../../src/server/db/client";
import { logger } from '../logger';

let client: Version3Client;

export async function authenticateJira(connectionsDetails: { host: string, username: string, password: string }) {
    // Get api keys from database, and authenticate with them
    let apikeys = await prisma.apiKey.findMany({
        where: {
            organizationId: "",
            provider: "jira"
        },
        select: {
            key: true,
            value: true
        }
    })
}