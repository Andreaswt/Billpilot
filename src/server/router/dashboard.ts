import { Currency } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";
import * as z from 'zod'
import { formatCurrency } from "../../../lib/helpers/currency";

interface DashboardReport {
    monthlyStatistics: {
        [year: number]: {
            [month: number]: {
                totalHoursBilled: number
                totalHoursBilledChange: number
                totalBillableHours: number
                totalBillableHoursChange: number
                uninvoicedTime: number
            }
        }
    }
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
        input: z.object({
            year: z.number(),
            month: z.number()
        }),
        async resolve({ ctx, input }) {
            const dashboardReport = await ctx.prisma.dashboardIndex.findUnique({
                where: {
                    organizationId: ctx.organizationId
                }
            })

            if (dashboardReport === null) {
                return null
            }

            const dataReport = JSON.parse(dashboardReport.reportJson);

            const dataReportSchema = z.object({
                monthlyStatistics: z.record(
                    z.record(
                        z.object({
                            totalHoursBilled: z.number(),
                            totalHoursBilledChange: z.number(),
                            totalBillableHours: z.number(),
                            totalBillableHoursChange: z.number(),
                            uninvoicedTime: z.number()
                        }))),
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
                return null
            }

            if (!dataReportParsed.data.monthlyStatistics[input.year] || !dataReportParsed.data.monthlyStatistics[input.year][input.month]) {
                return null
            }

            const lastMonth = input.month - 1 < 0 ? 11 : input.month - 1
            const lastMonthsYear = lastMonth < 0 ? input.year - 1 : input.year
            const lastMonthExists = lastMonthsYear in dataReportParsed.data.monthlyStatistics && lastMonth in dataReportParsed.data.monthlyStatistics[lastMonthsYear]

            const nextMonth = input.month + 1 > 11 ? 0 : input.month + 1
            const nextMonthsYear = nextMonth > 11 ? input.year + 1 : input.year
            const nextMonthExists = nextMonthsYear in dataReportParsed.data.monthlyStatistics && nextMonthsYear in dataReportParsed.data.monthlyStatistics[nextMonthsYear]

            const response = {
                ...dataReportParsed.data.monthlyStatistics[input.year][input.month],
                uninvoicedTime: dataReportParsed.data.monthlyStatistics[input.year][input.month].uninvoicedTime.toString(),
                totalBillableHours: dataReportParsed.data.monthlyStatistics[input.year][input.month].totalBillableHours.toString(),
                totalHoursBilled: dataReportParsed.data.monthlyStatistics[input.year][input.month].totalHoursBilled.toString(),
                recentInvoices: dataReportParsed.data.recentInvoices,
                clients: dataReportParsed.data.clients,
                updatedAt: dashboardReport.updatedAt,
                lastMonth: lastMonthExists,
                nextMonth: nextMonthExists,
                month: toMonthName(input.month),
                year: input.year
            }

            return response;
        },
    })
    .mutation("rebuildReport", {
        async resolve({ ctx }) {
            const invoices = await ctx.prisma.generalInvoice.findMany({
                where: {
                    organizationId: ctx.organizationId,
                    client: {
                        isNot: null
                    }
                },
                select: {
                    id: true,
                    title: true,
                    issueDate: true,
                    invoicedFrom: true,
                    invoicedTo: true,
                    currency: true,
                    billed: true,
                    pricePerHour: true,
                    clientId: true,
                    invoiceLines: {
                        select: {
                            quantity: true,
                            unitPrice: true,
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

            // Sort all invoices by their corresponding months and years
            let monthlyStatistics: {
                [year: number]: {
                    [month: number]: {
                        totalHoursBilled: number
                        totalHoursBilledChange: number
                        totalBillableHours: number
                        totalBillableHoursChange: number
                        uninvoicedTime: number
                    }
                }
            } = {}

            for (let i = 0; i < invoices.length; i++) {
                const invoice = invoices[i]
            
                const year = invoice.issueDate.getFullYear()
                const month = invoice.issueDate.getMonth()

                if (!monthlyStatistics[year]) {
                    monthlyStatistics[year] = {}

                    if (!monthlyStatistics[year][month]) {
                        monthlyStatistics[year][month] = {
                            totalHoursBilled: 0,
                            totalHoursBilledChange: 0,
                            totalBillableHours: 0,
                            totalBillableHoursChange: 0,
                            uninvoicedTime: 0,
                        }
                    }
                }

                let totalHoursBilled = 0;
                let totalBillableHours = 0;
                let totalBillableAmount = 0;

                for (let j = 0; j < invoice.invoiceLines.length; j++) {
                    const line = invoice.invoiceLines[j]
            
                    const hours = line.quantity;
                    const pricePerHour = line.unitPrice;
                    const billableAmount = hours * pricePerHour;

                    if (invoice.billed && invoice.clientId) {
                        totalHoursBilled += hours;
                        finalClients[invoice.clientId].billed += billableAmount
                    } else if (invoice.clientId) {
                        finalClients[invoice.clientId].notBilled += billableAmount
                    }

                    totalBillableAmount += billableAmount;
                    totalBillableHours += hours;
                }

                let totalHoursBilledChange = 0
                let totalBillableHoursChange = 0

                const lastMonthNo = month - 1 < 0 ? 11 : month - 1
                const yearNoForStats = lastMonthNo < 0 ? year - 1 : year
                if (monthlyStatistics[year] && monthlyStatistics[year][yearNoForStats]) {
                    totalHoursBilledChange = (monthlyStatistics[year][month].totalBillableHours / monthlyStatistics[year][month].totalBillableHours) * 100
                    totalBillableHoursChange = (monthlyStatistics[year][month].totalBillableHoursChange / monthlyStatistics[year][month].totalBillableHoursChange) * 100
                }

                monthlyStatistics[year][month] = {
                    totalHoursBilled: totalHoursBilled,
                    totalHoursBilledChange: totalHoursBilledChange,
                    totalBillableHours: totalBillableHours,
                    totalBillableHoursChange: totalBillableHoursChange,
                    uninvoicedTime: totalBillableHours - totalHoursBilled,
                }
            }

            // If no invoices has been generated yet, create empty statistics
            if (Object.keys(monthlyStatistics).length === 0) {
                const now = new Date()

                monthlyStatistics[now.getFullYear()] = {}
                monthlyStatistics[now.getFullYear()][now.getMonth()] = {
                    totalHoursBilled: 0,
                    totalHoursBilledChange: 0,
                    totalBillableHours: 0,
                    totalBillableHoursChange: 0,
                    uninvoicedTime: 0,
                }
            }

            const recentInvoices = invoices.slice(0, Math.min(invoices.length, 5)).map(item => {
                let invoiceTotal = 0

                item.invoiceLines.forEach(x => {
                    invoiceTotal = x.quantity * x.unitPrice
                })

                return {
                    id: item.id,
                    title: item.title,
                    invoicedDates: item.invoicedFrom && item.invoicedTo ? item.invoicedFrom?.toDateString() + " - " + item.invoicedTo?.toDateString() : "-",
                    total: formatCurrency(invoiceTotal, item.currency)
                }
            });

            const response: DashboardReport = {
                monthlyStatistics: monthlyStatistics,
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