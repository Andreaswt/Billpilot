// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import { ModalsProvider, NProgressNextRouter, SaasProvider } from '@saas-ui/react'
import { useRouter } from "next/router";
import landingPageTheme from '../styles/index';
import { AppLayout } from "../components/layout/layouts/app-layout";
import type { AppType } from "next/app";
import type { AppRouter } from "../server/router";
import type { Session } from "next-auth";
import '@fontsource/inter/variable.css'
import Link from "next/link";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  return (
    <SaasProvider linkComponent={Link} theme={landingPageTheme}>
      <SessionProvider session={session} refetchInterval={0}>
        <ModalsProvider>
          <AppLayout>
            <NProgressNextRouter router={router} />
            <Component {...pageProps} />
          </AppLayout>
        </ModalsProvider>
      </SessionProvider>
    </SaasProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.browser) return ""; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
