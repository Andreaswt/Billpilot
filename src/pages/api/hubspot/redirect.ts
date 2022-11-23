import type { NextApiRequest, NextApiResponse } from "next";

const redirect = async (req: NextApiRequest, res: NextApiResponse) => {
    res.redirect(process.env.HUBSPOT_REDIRECT_URI);
};

export default redirect;
