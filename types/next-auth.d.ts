import { JWT } from "next-auth/jwt"

// Setup:
// Default user from next-auth is used, but custom properties are added through the CustomUser interface
// The properties in the CustomerInterface should be returned in check-credentials, when the user is authenticated

interface CustomUser {
  id: string,
  role: string,
  organizationId: string
}

import NextAuth, { DefaultSession } from "next-auth"
declare module "next-auth" {
  interface User extends CustomUser {

  }

  interface Session {
    user: {
    } & CustomUser & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
    } & CustomUser & DefaultSession["user"]
  }
}
