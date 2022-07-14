import { createRouter } from "./context";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const select = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  image: true,
  password: true
})

export const exampleRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany();
    },
  })
  .query("getSingle", {
    input: z
    .object({
      id: z.string(),
    })
    .nullish(),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input?.id },
        select: select
      });

      return {
        greeting: `Hello ${input?.id ?? "world"}`,
      };
    },
  });
