import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { logger } from "../../../lib/logger";
import { prisma } from "../db/client";
import sha256 from "crypto-js/sha256";
import { json } from "stream/consumers";
import { omit } from "lodash";
import { signUpSchema } from "../../common/validation/auth";

export const usersRouter = createRouter()
  .mutation("create", {
    input: signUpSchema,
    async resolve({ ctx, input }) {
      const { name, email, password } = input;

      const exists = await ctx.prisma.user.findFirst({
        where: { email },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }

      let hashedPassword = sha256(password).toString();

      const organization = await prisma.organization.create({
        data: {
          users: {
            create: {
              name: name,
              email: email,
              password: hashedPassword
            }
          }
        },
        include: {
          users: true,
        },
      })

      return { 
        status: 201,
        message: "Account created successfully",
        result: organization.users[0]
      };
    },
  })
  .mutation("check-credentials", {
    input: z
      .object({
        email: z.string(),
        password: z.string(),
      }),
    async resolve({ input }) {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          password: true,
          role: true,
          organizationId: true
        },
      });
      if (user && user.password == sha256(input.password).toString()) {
        JSON.stringify(omit(user, "password"));
      } else {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }
    }
  });
