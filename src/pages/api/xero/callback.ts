// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../auth/[...nextauth]";
import { getXeroClient, saveTokenset } from "../../../../lib/integrations/xero";

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, nextAuthOptions);

    if (session) {
        let organizationId = session.user.organizationId;
        if (!organizationId) throw new Error("No organization found");

        let xero = await getXeroClient();
        const tokenSet = await xero.apiCallback(req.url!);
        
        await saveTokenset(tokenSet, organizationId);

        res.redirect("/dashboard");
    }
};

export default callback;
