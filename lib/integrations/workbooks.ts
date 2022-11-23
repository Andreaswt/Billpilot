import { ApiKeyName, ApiKeyProvider } from "@prisma/client";
import { prisma } from "../../src/server/db/client";
import { logger } from "../logger";

//==========================================//
//   Methods                                //
//==========================================//
export async function test(organizationId: string) {

}


//==========================================//
//   Private Methods                        //
//==========================================//

enum httpMethod {
    get = 'GET',
    post = 'POST',
    put = 'PUT',
}

var baseApiPath = "https://secure.workbooks.com";

async function getApiKeyAndSessionId(organizationId: string) {
    let keys = await prisma.apiKey.findMany({
        where: {
            organizationId: organizationId,
            provider: ApiKeyProvider.WORKBOOKS,
        },
        select: {
            key: true,
            value: true
        }
    })

    const apiKey = keys.find(k => k.key === ApiKeyName.WORKBOOKSAPIKEY)?.value;
    const sessionId = keys.find(k => k.key === ApiKeyName.WORKBOOKSSESSIONID)?.value;

    if (!apiKey) {
        throw new Error("Missing Workbooks API Key in database");
    }

    return { apiKey: apiKey, sessionId: sessionId };
}

async function sendLoginRequest(organizationId: string, sessionExpired: boolean) {
    let keys = await getApiKeyAndSessionId(organizationId);

    const response = await fetch(baseApiPath + "/login.api", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'api_key': keys.apiKey,
            ...(keys.sessionId && !sessionExpired ? { 'session_id': keys.sessionId } : {}),
            'client': "api",
            'api_version': "1",
            'json': "pretty",
        }),
    });

    return response;
}

async function login(organizationId: string) {
    let response = await sendLoginRequest(organizationId, false);
    let responseJson = await response.json();

    const sessionId = responseJson.session_id;
    if (!sessionId) throw new Error("No session id returned from Workbooks login");

    // If the session was expired, we need to login again without the session key
    if (response.status === 401) {
        response = await sendLoginRequest(organizationId, true);
        responseJson = await response.json();
    }

    // If its the first time the session is created, save the session id in the database
    // Otherwise the session id from the database is passed along in the request
    await prisma.apiKey.upsert({
        where: {
            organizationsApiKey: {
                organizationId: organizationId,
                provider: ApiKeyProvider.WORKBOOKS,
                key: ApiKeyName.WORKBOOKSSESSIONID
            }
        },
        update: {
            value: sessionId
        },
        create: {
            organizationId: organizationId,
            provider: ApiKeyProvider.WORKBOOKS,
            key: ApiKeyName.WORKBOOKSSESSIONID,
            value: sessionId
        }
    });

    if (!response.ok) {
        logger.error(JSON.stringify(responseJson));

        throw new Error(JSON.stringify(responseJson))
    }

    return sessionId
}

async function request<T>(endpoint: string, method: httpMethod, organizationId: string, body: any = {}): Promise<T> {
    const sessionId = login(organizationId);

    const response = await fetch(baseApiPath + "/login.api", {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'cookie': `Workbooks-Session=${sessionId}`
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        let errorMsg = await response.json();

        logger.error(JSON.stringify(errorMsg));

        throw new Error(JSON.stringify(errorMsg))
    }

    return await response.json() as Promise<T>
}