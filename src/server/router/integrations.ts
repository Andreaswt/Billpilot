import { ApiKeyProvider } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";
import { z } from "zod";

export const integrationsRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        const organizationId = ctx.session?.user.organizationId;

        if (!organizationId) {
            throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
        }
        return next({ ctx: { ...ctx, organizationId } })
    })
    .query("getActiveIntegrations", {
        async resolve({ ctx }) {
            let apiKeys = await ctx.prisma.apiKey.findMany({
                select: {
                    provider: true,
                    key: true
                }
            })

            const response: { [provider: string]: boolean } = {}

            // TODO: switch
            if (apiKeys.find(x => x.provider === ApiKeyProvider.JIRA)) {
                response[ApiKeyProvider.JIRA.toString()] = true
            }

            if (apiKeys.find(x => x.provider === ApiKeyProvider.ECONOMIC)) {
                response[ApiKeyProvider.ECONOMIC.toString()] = true
            }

            if (apiKeys.find(x => x.provider === ApiKeyProvider.XERO)) {
                response[ApiKeyProvider.XERO.toString()] = true
            }

            if (apiKeys.find(x => x.provider === ApiKeyProvider.ASANA)) {
                response[ApiKeyProvider.ASANA.toString()] = true
            }

            if (apiKeys.find(x => x.provider === ApiKeyProvider.QUICKBOOKS)) {
                response[ApiKeyProvider.QUICKBOOKS.toString()] = true
            }

            return response
        },
    })
    .mutation("signout", {
        input: z.object({
            provider: z.string(),
        }),
        async resolve({ input, ctx }) {
            const provider: ApiKeyProvider = <ApiKeyProvider>input.provider
            if (!provider) throw new Error("Provider not known")

            await ctx.prisma.apiKey.deleteMany({
                where: {
                    provider: provider,
                    organizationId: ctx.organizationId
                }
            })
        },
    });
