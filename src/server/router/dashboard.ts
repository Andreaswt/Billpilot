import { ApiKeyProvider } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";
import { z } from "zod";

export const dashboardRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        const organizationId = ctx.session?.user.organizationId;

        if (!organizationId) {
            throw new TRPCError({ message: "User not found", code: "UNAUTHORIZED" });
        }
        return next({ ctx: { ...ctx, organizationId } })
    })
    .query("getDashboard", {
        async resolve({ ctx }) {
            let apiKeys = await ctx.prisma.apiKey.findMany({
                select: {
                    provider: true,
                    key: true
                }
            })

            const today = new Date()

            let invoices = await ctx.prisma.generalInvoice.findMany({
                select: {
                    id: true,
                    title: true,
                    invoicedFrom: true,
                    invoicedTo: true,
                    currency: true
                },
            })

            const recentInvoices = invoices.map(item => {
                return {
                    id: item.id,
                    title: item.title, 
                    invoicedDates: item.invoicedFrom && item.invoicedTo ? item.invoicedFrom?.toDateString() + " - " + item.invoicedTo?.toDateString() : "-",
                    total: "100 " + item.currency }
            })

            const clients = [
                {
                    id: '',
                    company: 'Digital Designer APS',
                    billed: 108630,
                    notBilled: 148630,
                    latestBill: "12/12/2022",
                  },
                  {
                    id: '',
                    company: 'Marketing Specialists LTD',
                    billed: 108630,
                    notBilled: 195785,
                    latestBill: "12/12/2022",
                  },
                  {
                    id: '',
                    company: 'Specialists Agency',
                    billed: 188630,
                    notBilled: 295785,
                    latestBill: "12/12/2022",
                  },
                  {
                    id: '',
                    company: 'Outsourcing Co',
                    billed: 12785,
                    notBilled: 15785,
                    latestBill: "12/12/2022",
                  },
            ]

            const response = {
                month: toMonthName(today.getMonth()),
                year: today.getFullYear(),
                totalHoursBilled: String(200),
                totalHoursBilledChange: 20,
                totalBillableHours: String(375),
                totalHoursDue: String(110),
                totalDue: String(110000),
                recentInvoices: recentInvoices,
                clients: clients,
            }

            return response;
        },
    });

function toMonthName(monthNumber: number) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    const lowercaseDate = date.toLocaleString([], {
        month: 'long',
    });

    return lowercaseDate.charAt(0).toUpperCase() + lowercaseDate.slice(1)
}