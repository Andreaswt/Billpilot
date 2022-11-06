import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { useInputGroupStyles } from "@chakra-ui/react";
import { logger } from "../../../lib/logger";
import { ApiKeyName, ApiKeyProvider } from "@prisma/client";

export const apiKeysRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const organizationId = ctx.session?.user.organizationId;

    if (!organizationId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, organizationId } })
  })
  .query("getAllKeysAndValues", {
    async resolve({ ctx }) {
      return await ctx.prisma.apiKey.findMany(
        {
          where: {
            organizationId: ctx.organizationId
          },
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
          organizationId: ctx.organizationId,
          provider: <ApiKeyProvider> input.provider,
          key: <ApiKeyName> input.key,
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
          organizationsApiKey: {
            provider: <ApiKeyProvider> input.provider,
            key: <ApiKeyName> input.key,
            organizationId: ctx.organizationId,
          }
        },
        update: {
          value: input.value,
        },
        create: {
          organizationId: ctx.organizationId,
          provider: <ApiKeyProvider> input.provider,
          key: <ApiKeyName> input.key,
          value: input.value,
        },
      })
      return {
        apiKey: apiKeyResult
      }
    }
  });
