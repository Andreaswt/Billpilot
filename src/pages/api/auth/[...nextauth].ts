import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { NextApiHandler } from "next";
import { logger } from "../../../../lib/logger";
import CredentialsProvider from "next-auth/providers/credentials";
import { trpc } from "../../../utils/trpc";
import { omit } from "lodash";
import sha256 from "crypto-js/sha256";
import { loginSchema } from "../../../common/validation/auth";

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        if (!credentials) return null;
        
        // Check schema for errors
        await loginSchema.parseAsync(credentials);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
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

        if (user && user.password == sha256(credentials.password).toString()) {
          return omit(user, "password");
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/signup"
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error: (code, metadata) => {
      logger.error(code, metadata);
    },
    warn: (code) => {
      // logger.warn(code);
    },
    debug: (code, metadata) => {
      logger.debug(code, metadata);
    },
  },
  // jwt: {
  //   secret: "super-secret",
  //   maxAge: 15 * 24 * 30 * 60, // 15 days
  // },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user._id;
        token.user = user;
      }
      return token;
    },
  },
};

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, authOptions);
export default authHandler;