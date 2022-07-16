import { createRouter } from "./context";
import { z } from "zod";

export const apiKeysRouter = createRouter()
  .query("newKey", {
    input: z
      .object({
        key: z.string(),
        value: z.string(),
      }),
    async resolve({ input, ctx }) {
      await ctx.prisma.apiKey.create({
        data: {
          key: input.key,
          value: input.value,
        }
      });
      return {
        apiKey: input
      };
    },
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
  });
