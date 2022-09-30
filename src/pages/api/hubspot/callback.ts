// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { exchangeForTokens } from "../../../../lib/integrations/hubspot";
import { authOptions as nextAuthOptions } from "../auth/[...nextauth]";

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, nextAuthOptions);
    if (!session || !session.user.organizationId) throw new Error("No organization found");

    if (!req.query["code"] || typeof (req.query["code"]) != 'string') throw new Error("No code received");

    exchangeForTokens(session.user.organizationId, req.query["code"]).then(() => {
        const successMessage = encodeURIComponent('Hubspot integration was successfully set up.')
        res.redirect("/dashboard/integrations?success=true&message=" + successMessage)
    })
        .catch(() => {
            const errorMessage = encodeURIComponent('Error happened during Hubspot Integration')
            res.redirect("/dashboard/integrations?error=true&message=" + errorMessage)
        })
};

export default callback;
