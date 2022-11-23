import type { NextApiRequest, NextApiResponse } from "next";

const redirect = async (req: NextApiRequest, res: NextApiResponse) => {    
    res.redirect(process.env.ECONOMIC_REDIRECT_URL);
};

export default redirect;
