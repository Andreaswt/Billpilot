// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";

const redirect = async (req: NextApiRequest, res: NextApiResponse) => {
    res.redirect(process.env.JIRA_REDIRECT_URL);
};

export default redirect;
