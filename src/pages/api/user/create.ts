import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import sha256 from "crypto-js/sha256";
import { logger } from "../../../../lib/logger";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    await handlePOST(res, req);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}

const hashPassword = (password: string) => {
  return sha256(password).toString();
};

// POST /api/user
async function handlePOST(res: NextApiResponse, req: NextApiRequest) {
  logger.debug("creating user", {
    ...req.body,
    password: hashPassword(req.body.password),
  });

  // Create a organization, and then a user in that organization
  const organization = await prisma.organization.create({
    data: {
      name: req.body.email,
      description: "testdescription",
      users: {
        create: {
          ...req.body, password: hashPassword(req.body.password)
        }
      }
    },
    include: {
      users: true,
    },
  })

  // Only 1 user is created, so we can just return the first user
  res.json(organization.users[0]);
}
