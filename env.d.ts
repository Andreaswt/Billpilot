declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL: string
        NEXTAUTH_SECRET: string
        NEXTAUTH_URL: string
        AUTH0_ID: string
        AUTH0_SECRET: string
        AUTH0_ISSUER: string
    }
  }