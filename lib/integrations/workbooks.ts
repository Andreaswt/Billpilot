import { ApiKeyName, ApiKeyProvider } from "@prisma/client";
import { prisma } from "../../src/server/db/client";
import { Activity, ActivityLink, Response } from "../../types/integrations/workbooks";
import { logger } from "../logger";

//==========================================//
//   Methods                                //
//==========================================//
export async function test(organizationId: string) {
    return await request("/crm/people", httpMethod.get, organizationId)
}

export async function metadata(organizationId: string) {
    return await request("/metadata/types", httpMethod.get, organizationId)
}

export async function organisations(organizationId: string) {
    return await request("/crm/organisations", httpMethod.get, organizationId, "?_limit=1")
}

export async function tasks(organizationId: string) {
    return await request("/activity/tasks", httpMethod.get, organizationId)
}

export async function activities(organizationId: string) {
    return await request("/activity/activities", httpMethod.get, organizationId)
}

export async function activityLinks(organizationId: string) {
    return await request("/activity/activity_links", httpMethod.get, organizationId)
}

export async function organizationsActivities(organizationId: string, id: number) {
    var activityLinkResponse = await request<Response<ActivityLink>>("/activity/activity_links", httpMethod.get, organizationId, `?_ff[]=id&_ft[]=eq&_fc[]=${id}`)
    if (!activityLinkResponse.success) throw new Error("Failed to get activity link")
    var activityLinks = activityLinkResponse.data.map(x => x.activity_id)

    var queryString = "?" + activityLinks.map(x => `_ff[]=id&_ft[]=eq&_fc[]=${x}`).join("&")
    var activityResponse = await request<Response<Activity>>("/activity/activities", httpMethod.get, organizationId, queryString)
    if (!activityResponse.success) throw new Error("Failed to get activities");
    
    return activityResponse.data[0]
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

    const sessionId = responseJson.session_id as string;
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

async function request<T>(endpoint: string, method: httpMethod, organizationId: string, queryString: string = "", body: any = {}): Promise<T> {
    const sessionId = await login(organizationId);

    const response = await fetch(baseApiPath + endpoint + ".api" + queryString, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'cookie': `Workbooks-Session=${sessionId}`
        },
        ...(method !== httpMethod.get ? { body: JSON.stringify(body) } : {})
    });

    // console.log("hehhs")
    // console.log(response)

    if (!response.ok) {
        let errorMsg = await response.json();

        logger.error(JSON.stringify(errorMsg));

        throw new Error(JSON.stringify(errorMsg))
    }

    return await response.json() as Promise<T>
}