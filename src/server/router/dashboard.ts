import { Currency } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";
import * as z from 'zod'


interface DashboardReport {
    month: string
    year: number
    totalHoursBilled: string
    totalHoursBilledChange: number
    totalBillableHours: string
    totalBillableHoursChange: number
    uninvoicedTime: string
    recentInvoices: {
        id: string
        title: string
        invoicedDates: string
        total: string
    }[]
    clients: {
        id: string;
        name: string;
        currency: Currency;
        billed: number;
        notBilled: number;
    }[]
}



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
            const dashboardReport = await ctx.prisma.dashboardIndex.findUniqueOrThrow({
                where: {
                    organizationId: ctx.organizationId
                }
            })

            const dataReport = JSON.parse(dashboardReport.reportJson);

            const dataReportSchema = z.object({
                month: z.string(),
                year: z.number(),
                totalHoursBilled: z.string(),
                totalHoursBilledChange: z.number(),
                totalBillableHours: z.string(),
                totalBillableHoursChange: z.number(),
                uninvoicedTime: z.string(),
                recentInvoices: z.array(z.object({
                    id: z.string(),
                    title: z.string(),
                    invoicedDates: z.string(),
                    total: z.string()
                })),
                clients: z.array(z.object({
                    id: z.string(),
                    name: z.string(),
                    currency: z.nativeEnum(Currency),
                    billed: z.number(),
                    notBilled: z.number(),
                }))
            })

            const dataReportParsed = dataReportSchema.safeParse(dataReport);

            if (!dataReportParsed.success) {
                return null;
            }

            const response = {
                ...dataReportParsed.data,
                updatedAt: dashboardReport.updatedAt
            }

            return response;

        },
    })

    // TODO validate deserialized JSON against interface, and replace column contents with rebuild report if not valid
    .mutation("rebuildReport", {
        async resolve({ ctx }) {
            const today = new Date()

            const invoices = await ctx.prisma.generalInvoice.findMany({
                where: {
                    organizationId: ctx.organizationId,
                },
                select: {
                    id: true,
                    title: true,
                    invoicedFrom: true,
                    invoicedTo: true,
                    currency: true,
                    billed: true,
                    pricePerHour: true,
                    clientId: true,
                    invoiceLines: {
                        select: {
                            hours: true,
                            pricePerHour: true,
                        }
                    },
                },
                orderBy: [
                    {
                        issueDate: 'desc'
                    }
                ]
            })

            const clients = await ctx.prisma.client.findMany({
                where: {
                    organizationId: ctx.organizationId,
                },
                select: {
                    id: true,
                    name: true,
                    currency: true,
                }
            })

            interface IFinalClients {
                [id: string]: {
                    name: string
                    currency: Currency
                    billed: number
                    notBilled: number
                }
            }

            const finalClients: IFinalClients = {};
            clients.forEach((client) => {
                finalClients[client.id] = {
                    ...client,
                    billed: 0,
                    notBilled: 0
                }
            })

            let totalHoursBilled = 0;
            let totalBillableHours = 0;
            let totalBillableAmount = 0;

            invoices.forEach((invoice) => {
                invoice.invoiceLines.forEach((line) => {
                    const hours = line.hours;
                    const pricePerHour = line.pricePerHour;
                    const billableAmount = hours * pricePerHour;

                    if (invoice.billed) {
                        totalHoursBilled += hours;
                        finalClients[invoice.clientId].billed += billableAmount
                    } else {
                        finalClients[invoice.clientId].notBilled += billableAmount
                    }
                    totalBillableAmount += billableAmount;
                    totalBillableHours += hours;
                })
            });

            const recentInvoices = invoices.slice(0, Math.min(invoices.length, 5)).map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    invoicedDates: item.invoicedFrom && item.invoicedTo ? item.invoicedFrom?.toDateString() + " - " + item.invoicedTo?.toDateString() : "-",
                    total: totalBillableAmount + item.currency
                }
            });


            const uninvoicedTime = totalBillableHours - totalHoursBilled;

            const response: DashboardReport = {
                month: toMonthName(today.getMonth()),
                year: today.getFullYear(),
                totalHoursBilled: String(totalHoursBilled),
                totalHoursBilledChange: 20,
                totalBillableHours: String(totalBillableHours),
                totalBillableHoursChange: 0,
                uninvoicedTime: String(uninvoicedTime),
                recentInvoices: recentInvoices,
                clients: Object.keys(finalClients).map((clientId) => ({ ...finalClients[clientId], id: clientId })),
            }

            const dashboardDataStr = JSON.stringify(response);

            await ctx.prisma.dashboardIndex.upsert({
                where: {
                    organizationId: ctx.organizationId
                },
                update: {
                    reportJson: dashboardDataStr,
                },
                create: {
                    organizationId: ctx.organizationId,
                    reportJson: dashboardDataStr
                },
            })

        }
    });



function toMonthName(monthNumber: number) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    const lowercaseDate = date.toLocaleString([], {
        month: 'long',
    });

    return lowercaseDate.charAt(0).toUpperCase() + lowercaseDate.slice(1)
}