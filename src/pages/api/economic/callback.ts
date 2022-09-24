// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { saveAgreementGrantToken } from "../../../../lib/integrations/e-conomic";
import { authOptions as nextAuthOptions } from "../auth/[...nextauth]";

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, nextAuthOptions);

    if (session) {
        try {
            let organizationId = session.user.organizationId;
            if (!organizationId) throw new Error("No organization found");
    
            let agreementGrantToken = req.query["token"]
            if (!agreementGrantToken || typeof(agreementGrantToken) != 'string') throw new Error("No token received");
            
            await saveAgreementGrantToken(agreementGrantToken, organizationId);
    
            const successMessage = encodeURIComponent('Economic integration was successfully set up.')
            res.redirect("/dashboard/integrations?success=true&message=" + successMessage)
        }
        catch (e: any) {
            const errorMessage = encodeURIComponent('Error happened during Economic Integration.')
            res.redirect("/dashboard/integrations?error=true&message=" + errorMessage)
        }
    }
};

export default callback;
