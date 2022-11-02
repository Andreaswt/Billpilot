import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { logger } from "../../../lib/logger";
import { prisma } from "../db/client";
import sha256 from "crypto-js/sha256";
import { json } from "stream/consumers";
import { omit } from "lodash";
import { signUpSchema } from "../../common/validation/auth";
import { signOut } from "next-auth/react";

export const accountRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const organizationId = ctx.session?.user.organizationId;
    const userId = ctx.session?.user.id;

    if (!organizationId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, organizationId, userId } })
  })
  .query("getUser", {
    async resolve({ ctx }) {
      return await prisma.user.findUniqueOrThrow({
        where: {
          id: ctx.userId
        },
        select: {
          name: true,
          email: true,
          createdAt: true
        }
      })
    }
  })
  .mutation("deleteProfile", {
    async resolve({ ctx }) {
      await prisma.organization.delete({
        where: {
          id: ctx.organizationId
        }
      })
    }
  });
