// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getXeroClient } from "../../../../lib/integrations/xero";

const redirect = async (req: NextApiRequest, res: NextApiResponse) => {
    let xero = await getXeroClient();

    let consentUrl = await xero.buildConsentUrl();
    
    res.redirect(consentUrl);
};

export default redirect;
