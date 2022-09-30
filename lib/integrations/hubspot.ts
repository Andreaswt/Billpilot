
//==========================================//
//   Exchanging Proof for an Access Token   //
//==========================================//

import { Client } from "@hubspot/api-client";
import { ApiKeyName, ApiKeyProvider } from "@prisma/client";
import { prisma } from "../../src/server/db/client";

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

    let accessToken = ""

    fetch("https://api.hubapi.com/oauth/v1/token", {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        body: new URLSearchParams(refreshToken ? refreshTokenProof : authCodeProof)
    })
        .then(async response => {
            // If Jira reports and error back, redirect to integration page with error parameter, so error can be shown
            if (!response.ok) throw new Error("Faulty response during hubspot token exchange")
            return response.json() as Promise<{ refresh_token: string, access_token: string, expires_in: number }>
        })
        .then(async data => {
            var accessTokenExpirationDate = new Date()
            accessTokenExpirationDate.setSeconds(accessTokenExpirationDate.getSeconds() + Math.round(data.expires_in * 0.75))

            await prisma.apiKey.createMany({
                data: [{
                    provider: ApiKeyProvider.HUBSPOT,
                    key: ApiKeyName.JIRAACCESSTOKEN,
                    value: data.access_token,
                    expires: null,
                    organizationId: organizationId
                },
                {
                    provider: ApiKeyProvider.HUBSPOT,
                    key: ApiKeyName.HUBSPOTACCESSTOKEN,
                    value: data.refresh_token,
                    expires: accessTokenExpirationDate,
                    organizationId: organizationId
                },
                {
                    provider: ApiKeyProvider.HUBSPOT,
                    key: ApiKeyName.HUBSPOTREFRESHTOKEN,
                    value: data.access_token,
                    expires: null,
                    organizationId: organizationId
                },
                ]
            })

            accessToken = data.access_token;
        })

    return accessToken
};

const refreshAccessToken = async (organizationId: string) => {
    const refreshToken = await prisma.apiKey.findUniqueOrThrow({
        where: {
            organizationsApiKey: {
                provider: ApiKeyProvider.HUBSPOT,
                key: ApiKeyName.JIRAREFRESHTOKEN,
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


const getContact = async (organizationId: string) => {
    try {
        const client = await getClient(organizationId)
        return client.crm.contacts.getAll()
    } catch (e) {
        throw new Error("Error fetching contacts")
    }
};