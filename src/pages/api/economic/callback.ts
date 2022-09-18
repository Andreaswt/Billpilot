// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { saveAgreementGrantToken } from "../../../../lib/integrations/e-conomic";
import { authOptions as nextAuthOptions } from "../auth/[...nextauth]";

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, nextAuthOptions);

    if (session) {
        let organizationId = session.user.organizationId;
        if (!organizationId) throw new Error("No organization found");

        let agreementGrantToken = req.query["token"]
        if (!agreementGrantToken || typeof(agreementGrantToken) != 'string') throw new Error("No token received");
        
        await saveAgreementGrantToken(agreementGrantToken, organizationId);

        res.redirect("/dashboard/integrations")
    }
};

export default callback;
