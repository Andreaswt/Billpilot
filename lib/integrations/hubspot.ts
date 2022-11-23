//==========================================//
//   Exchanging Proof for an Access Token   //
//==========================================//

import { Client } from "@hubspot/api-client";
import { Filter, FilterGroup, PublicObjectSearchRequest } from "@hubspot/api-client/lib/codegen/crm/tickets";
import { ApiKeyName, ApiKeyProvider } from "@prisma/client";
import { prisma } from "../../src/server/db/client";
import { logger } from "../logger";

export const exchangeForTokens = async (organizationId: string, code: string, refreshToken: boolean = false) => {
    const authCodeProof = {
        grant_type: 'authorization_code',
        client_id: process.env.HUBSPOT_CLIENT_ID,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET,
        redirect_uri: process.env.HUBSPOT_CALLBACK_URL,
        code: code,
    }

    const refreshTokenProof = {
        grant_type: 'refresh_token',
        client_id: process.env.HUBSPOT_CLIENT_ID,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET,
        redirect_uri: process.env.HUBSPOT_CALLBACK_URL,
        refresh_token: code
    }

    const response = await fetch("https://api.hubapi.com/oauth/v1/token", {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        body: new URLSearchParams(refreshToken ? refreshTokenProof : authCodeProof)
    })

    // If Jira reports and error back, redirect to integration page with error parameter, so error can be shown
    if (!response.ok) throw new Error("Faulty response during hubspot token exchange")
    const jsonResponse = await response.json() as { refresh_token: string, access_token: string, expires_in: number }


    var accessTokenExpirationDate = new Date()
    accessTokenExpirationDate.setSeconds(accessTokenExpirationDate.getSeconds() + Math.round(jsonResponse.expires_in * 0.75))

    const newAccessToken = await prisma.apiKey.upsert({
        where: {
            organizationsApiKey: {
                organizationId: organizationId,
                provider: ApiKeyProvider.HUBSPOT,
                key: ApiKeyName.HUBSPOTACCESSTOKEN,
            }
        },
        create: {
            provider: ApiKeyProvider.HUBSPOT,
            key: ApiKeyName.HUBSPOTACCESSTOKEN,
            value: jsonResponse.access_token,
            expires: accessTokenExpirationDate,
            organizationId: organizationId
        },
        update: {
            value: jsonResponse.access_token,
            expires: accessTokenExpirationDate,
        }
    })

    await prisma.apiKey.upsert({
        where: {
            organizationsApiKey: {
                provider: ApiKeyProvider.HUBSPOT,
                key: ApiKeyName.HUBSPOTREFRESHTOKEN,
                organizationId: organizationId
            }
        },
        create: {
            provider: ApiKeyProvider.HUBSPOT,
            key: ApiKeyName.HUBSPOTREFRESHTOKEN,
            value: jsonResponse.refresh_token,
            expires: null,
            organizationId: organizationId
        },
        update: {
            value: jsonResponse.refresh_token,
            expires: null,
        }
    })

    return newAccessToken.value
};

const refreshAccessToken = async (organizationId: string) => {
    const refreshToken = await prisma.apiKey.findUniqueOrThrow({
        where: {
            organizationsApiKey: {
                provider: ApiKeyProvider.HUBSPOT,
                key: ApiKeyName.HUBSPOTREFRESHTOKEN,
                organizationId: organizationId
            }
        },
        select: {
            value: true
        }
    })

    return await exchangeForTokens(organizationId, refreshToken.value, true);
};

const getClient = async (organizationId: string) => {
    const accessToken = await prisma.apiKey.findUniqueOrThrow({
        where: {
            organizationsApiKey: {
                provider: ApiKeyProvider.HUBSPOT,
                key: ApiKeyName.HUBSPOTACCESSTOKEN,
                organizationId: organizationId
            }
        },
        select: {
            expires: true,
            value: true
        }
    })

    // If the access token has expired, retrieve
    // a new one using the refresh token
    if (!accessToken.expires) throw new Error("Expiry date not set for Hubspot access token")
    if (accessToken.expires < new Date()) {
        const refreshedToken = await refreshAccessToken(organizationId);
        if (typeof (refreshedToken) !== 'string') throw new Error("Hubspot access token not string")

        return new Client({ accessToken: refreshedToken })
    }

    return new Client({ accessToken: accessToken.value })
};

//==========================================//
//   Methods                                //
//==========================================//

export const searchCompanies = async (organizationId: string, searchString: string = "") => {
    try {
        const client = await getClient(organizationId)

        const publicObjectSearchRequest = {
            filterGroups: [],
            sorts: [],
            query: searchString,
            properties: ['name', 'domain', 'city'],
            limit: 100,
            after: 0,
        }

        return await client.crm.companies.searchApi.doSearch(publicObjectSearchRequest)
    } catch (e) {
        logger.error(e)
        throw new Error("Error fetching companies")
    }
}

export const searchTickets = async (organizationId: string, companyId: string, searchString: string = "") => {
    try {
        if (!companyId) throw new Error("Empty companyId")

        const client = await getClient(organizationId)

        const filter: Filter = { propertyName: 'associations.company', operator: "EQ", value: companyId }
        const filterGroup: FilterGroup = { filters: [filter] }

        const publicObjectSearchRequest: PublicObjectSearchRequest = {
            filterGroups: [filterGroup],
            sorts: [],
            query: searchString,
            properties: ['subject', 'content', 'hs_lastmodifieddate', 'hs_object_id'],
            limit: 100,
            after: 0,
        }

        return await client.crm.tickets.searchApi.doSearch(publicObjectSearchRequest)
    } catch (e) {
        logger.error(e)
        throw new Error("Error fetching companies")
    }
}

export const importTicketsFromFilters = async (organizationId: string, companyIds: string[]) => {
    try {
        const client = await getClient(organizationId)
        let totalTime = 0

        const filter: Filter = { propertyName: 'associations.company', operator: "IN", values: companyIds }
        const filterGroup: FilterGroup = { filters: [filter] }

        const publicObjectSearchRequest: PublicObjectSearchRequest = {
            filterGroups: [filterGroup],
            sorts: [],
            properties: ['content'],
            limit: 100,
            after: 0,
        }

        const tickets = await client.crm.tickets.searchApi.doSearch(publicObjectSearchRequest)

        tickets.results.forEach(ticket => {
            const ticketTime = parseNumberToHours(ticket.properties["content"])
            totalTime += ticketTime ?? 0
        })

        return Math.round(totalTime * 100) / 100

    } catch (e) {
        logger.error(e)
        throw new Error("Error importing time from hubspot filters")
    }
}

export const validateTimeSetForTickets = async (organizationId: string, companyIds: string[]) => {
    try {
        if (companyIds.length === 0) {
            return {}
        }

        const client = await getClient(organizationId)

        let response: { [ticketId: string]: { subject: string } } = {}

        const filter: Filter = { propertyName: 'associations.company', operator: "IN", values: companyIds }
        const filterGroup: FilterGroup = { filters: [filter] }

        const publicObjectSearchRequest: PublicObjectSearchRequest = {
            filterGroups: [filterGroup],
            sorts: [],
            properties: ['subject', 'content', 'hs_object_id'],
            limit: 100,
            after: 0,
        }

        const tickets = await client.crm.tickets.searchApi.doSearch(publicObjectSearchRequest)

        tickets.results.forEach(ticket => {
            const ticketTime = parseNumberToHours(ticket.properties["content"])

            if (!ticketTime) {
                response[ticket.id] = { subject: ticket.properties["subject"] }
            }
        })

        return response

    } catch (e) {
        logger.error(e)
        throw new Error("Error importing time from hubspot filters")
    }
}

//==========================================//
//   Private methods                        //
//==========================================//
export const parseNumberToHours = (hoursAsString: string) => {
    if (hoursAsString === "") {
        return 0
    }

    if (isNaN(Number(hoursAsString))) {
        return null
    }

    return parseFloat(hoursAsString)
}