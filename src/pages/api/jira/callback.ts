// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { saveAgreementGrantToken } from "../../../../lib/integrations/e-conomic";
import { JiraRotateTokenResponse, saveJiraTokens } from "../../../../lib/integrations/jira";
import { authOptions as nextAuthOptions } from "../auth/[...nextauth]";

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, nextAuthOptions);

    if (session) {
        let organizationId = session.user.organizationId;
        if (!organizationId) throw new Error("No organization found");

        let code = req.query["code"]
        if (!code || typeof (code) != 'string') throw new Error("No code received");

        // Get access token
        fetch("https://auth.atlassian.com/oauth/token", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(
                {
                    grant_type: "authorization_code",
                    client_id: process.env.JIRA_CLIENT_ID,
                    client_secret: process.env.JIRA_CLIENT_SECRET,
                    code: code,
                    redirect_uri: "http://localhost:3000/api/jira/callback"
                }
            )
        })
            .then(async response => {
                return response.json() as Promise<JiraRotateTokenResponse>
            })
            .then(data => {
                // Get cloudid for site
                fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
                    headers: {
                        'Accept': 'application/json',
                        "Authorization": "Bearer " + data.access_token
                    },
                    method: "GET",
                })
                    .then(async response => {
                        return response.json() as Promise<{ id: string }[]>
                    })
                    .then(cloudIdResponse => {
                        if (!cloudIdResponse[0].id) throw new Error("Cloud id missing")
                        if (!data.access_token && !data.refresh_token) throw new Error("Token missing")

                        const requestUrl = "https://api.atlassian.com/ex/jira/" + cloudIdResponse[0].id
                        
                        // Finally save tokens
                        saveJiraTokens(data, requestUrl, organizationId)
                    })
            })


        res.redirect("/dashboard/integrations")
    }
};

export default callback;
