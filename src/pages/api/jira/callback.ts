// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { saveAgreementGrantToken } from "../../../../lib/integrations/e-conomic";
import { JiraRotateTokenResponse, saveJiraTokens } from "../../../../lib/integrations/jira";
import { logger } from "../../../../lib/logger";
import { authOptions as nextAuthOptions } from "../auth/[...nextauth]";

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, nextAuthOptions);

    if (session) {
        let organizationId = session.user.organizationId;
        if (!organizationId) throw new Error("No organization found");

                // If Jira authorization was aborted Jira will return an error in the query
                if (req.query["error"] && req.query["error_description"] && typeof(req.query["error_description"]) === 'string') {
                    const errorMessage = encodeURIComponent(req.query["error_description"])
                    res.redirect("/dashboard/integrations?error=true&message=" + errorMessage)
                }

        if (!req.query["code"] || typeof (req.query["code"]) != 'string') throw new Error("No code received");

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
                    code: req.query["code"],
                    redirect_uri: process.env.JIRA_CALLBACK_URL
                }
            )
        })
            .then(async response => {
                // If Jira reports and error back, redirect to integration page with error parameter, so error can be shown
                if (!response.ok) {
                    const errorMessage = encodeURIComponent('Error happened during Jira Integration')
                    res.redirect("/dashboard/integrations?error=true&message=" + errorMessage)
                }
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
                    .then(async cloudIdResponse => {
                        if (!cloudIdResponse[0].id) throw new Error("Cloud id missing")
                        if (!data.access_token && !data.refresh_token) throw new Error("Token missing")

                        const requestUrl = "https://api.atlassian.com/ex/jira/" + cloudIdResponse[0].id

                        // Finally save tokens
                        saveJiraTokens(data, requestUrl, organizationId).then(() => {
                            const successMessage = encodeURIComponent('Jira integration was successfully set up.')
                            res.redirect("/dashboard/integrations?success=true&message=" + successMessage)
                        })
                    })
            })
    }
};

export default callback;
