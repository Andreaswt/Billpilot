import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { useInputGroupStyles } from "@chakra-ui/react";
import { logger } from "../../../lib/logger";

export const apiKeysRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const userId = ctx.session?.user.id;

    if (!userId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, userId } })
  })
  .query("getAllKeysAndValues", {
    async resolve({ ctx }) {
      return await ctx.prisma.apiKey.findMany(
        {
          select: {
            key: true,
            value: true,
          }
        })
    },
  })
  .query("newKeyAndValue", {
    input: z
      .object({
        provider: z.string(),
        key: z.string(),
        value: z.string(),
      }),
    async resolve({ input, ctx }) {
      await ctx.prisma.apiKey.create({
        data: {
          userId: ctx.userId,
          provider: input.provider,
          key: input.key,
          value: input.value,
        }
      });
      return {
        apiKey: input
      };
    },
  })
  .mutation("upsertApiKey", {
    input: z
      .object({
        provider: z.string(),
        key: z.string(),
        value: z.string(),
      }),
    async resolve({ input, ctx }) {
      const apiKeyResult = await ctx.prisma.apiKey.upsert({
        where: {
          usersApiKey: {
            key: input.key,
            userId: ctx.userId,
          }
        },
        update: {
          value: input.value,
        },
        create: {
          userId: ctx.userId,
          provider: input.provider,
          key: input.key,
          value: input.value,
        },
      })
      return {
        apiKey: apiKeyResult
      }
    }
  });
