import { TRPCError } from "@trpc/server";
import sha256 from "crypto-js/sha256";
import { omit } from "lodash";
import * as nodemailer from 'nodemailer';
import { z } from "zod";
import { signUpInvitedUserSchema, signUpSchema } from "../../common/validation/auth";
import { prisma } from "../db/client";
import { createRouter } from "./context";

export const usersRouter = createRouter()
  .mutation("create", {
    input: signUpSchema,
    async resolve({ ctx, input }) {
      const { name, email, password, organizationName } = input;

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
          name: organizationName,
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
  })
  .query("getInvitation", {
    input: z
      .object({
        id: z.string(),
      }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.userInvitation.findUniqueOrThrow({
        where: {
          id: input.id
        },
        select: {
          email: true,
          organization: {
            select: {
              name: true,
            }
          }
        }
      })
    },
  })
  .mutation("createInvitedUser", {
    input: signUpInvitedUserSchema,
    async resolve({ ctx, input }) {
      const { name, email, password, organizationId } = input;

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

      const organization = await prisma.organization.findUniqueOrThrow({
        where: {
          id: organizationId
        }
      })

      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          organizationId: organization.id
        },
      })

      return {
        status: 201,
        message: "Account created successfully",
        result: user
      };
    },
  })
  .middleware(async ({ ctx, next }) => {
    const organizationId = ctx.session?.user.organizationId;

    if (!organizationId) {
      throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, organizationId } })
  })
  .mutation("inviteUsers", {
    input: z
      .object({
        email: z.string(),
      }),
    async resolve({ ctx, input }) {
      const existingUser = await prisma.user.findFirst({
        where: { email: { in: input.email } },
        select: {
          email: true,
        },
      });

      const existingInvitation = await prisma.userInvitation.findFirst({
        where: { email: { in: input.email } },
        select: {
          email: true,
        },
      });

      if (existingInvitation) {
        return { success: false, message: "User already invited" }
      }

      if (existingUser) {
        return { success: false, message: "User with email already exists: " + existingUser.email }
      }

      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const userInvitation = await prisma.userInvitation.create({
        data: { email: input.email, organizationId: ctx.organizationId, expires: tomorrow },
        select: {
          id: true,
          organization: {
            select: {
              name: true,
            }
          }
        }
      })

      var transporter = nodemailer.createTransport({
        host: 'mail.privateemail.com',
        port: 465,
        auth: {
          user: 'contact@billpilot.io',
          pass: 'z@uZeNvWj.BX7P9'
        },
        secure: true,
      });

      const signupLink = process.env.HOST + "/invitation/signup?id=" + userInvitation.id

      var mailOptions = {
        from: 'contact@billpilot.io',
        to: input.email,
        subject: 'Invitation to Billpilot.io',
        text: `You have been invited to join the organization ${userInvitation.organization.name} on Billpilot.io.\nGo to this link to sign up: ${signupLink}\n`
      };

      transporter.sendMail(mailOptions, function (error: any, info: { response: string; }) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
  });