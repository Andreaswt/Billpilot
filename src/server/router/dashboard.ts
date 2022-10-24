import { ApiKeyProvider, Currency } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";
import { z } from "zod";
import { transformDocument } from "@prisma/client/runtime";
import { TbCurrencyRupee, TbTemperatureMinus } from "react-icons/tb";
import { ClientSidebar } from "../../components/dashboard/clients/view/client-sidebar";

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
            const apiKeys = await ctx.prisma.apiKey.findMany({
                where: {
                    organizationId: ctx.organizationId,
                },
                select: {
                    provider: true,
                    key: true
                }
            })

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

            const recentInvoices = invoices.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    invoicedDates: item.invoicedFrom && item.invoicedTo ? item.invoicedFrom?.toDateString() + " - " + item.invoicedTo?.toDateString() : "-",
                    total: "100 " + item.currency
                }
            });

            let totalHoursBilled = 0;
            let totalBillableHours = 0;

            interface IFinalClients {
                [id: string]: {
                    name: string
                    currency: Currency
                    billed: number
                    notBilled: number
                }
            }

            const finalClients : IFinalClients = {};
            clients.forEach((client) => {
                finalClients[client.id] = {
                    ...client,
                    billed: 0,
                    notBilled: 0
                }
            })

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
                    totalBillableHours += hours;
                })
            });

            const uninvoicedTime = totalBillableHours - totalHoursBilled;

            const response = {
                month: toMonthName(today.getMonth()),
                year: today.getFullYear(),
                totalHoursBilled: String(totalHoursBilled),
                totalHoursBilledChange: 20,
                totalBillableHours: String(totalBillableHours),
                totalBillableHoursChange: 0,
                uninvoicedTime: String(uninvoicedTime),
                recentInvoices: recentInvoices,
                clients: Object.keys(finalClients).map((clientId) => (finalClients[clientId])),
            }

            return response;

            // let thisMonth = await ctx.prisma.generalInvoice.findMany({
            //     // where: {
            //     //     // TODO: fetch invoices from this month only
            //     //     issueDate: {
            //     //         lte: new Date(),
            //     //         gte: new Date(),
            //     //     }
            //     // },
            //     select: {
            //         invoiceLines: {
            //             select: {
            //                 hours: true,
            //                 pricePerHour: true,
            //                 updatedHoursSpent: true,
            //                 discountPercentage: true,
            //             }
            //         }
            //     },
            // })

            // let totalHoursBilled = 0
            // thisMonth.forEach(i => {
            //     i.invoiceLines.forEach(j => {
            //         let hoursBilled = j.updatedHoursSpent.toNumber() !== 0 ? j.updatedHoursSpent.toNumber() : j.hours.toNumber()

            //         if (j.discountPercentage.toNumber() !== 0) {
            //             hoursBilled *= (100 - j.discountPercentage.toNumber()) / 100
            //         }

            //         totalHoursBilled += hoursBilled
            //     })
            // })

            // const clients = [
            //     {
            //         id: '',
            //         company: 'Digital Designer APS',
            //         billed: 108630,
            //         notBilled: 148630,
            //         latestBill: "12/12/2022",
            //     },
            //     {
            //         id: '',
            //         company: 'Marketing Specialists LTD',
            //         billed: 108630,
            //         notBilled: 195785,
            //         latestBill: "12/12/2022",
            //     },
            //     {
            //         id: '',
            //         company: 'Specialists Agency',
            //         billed: 188630,
            //         notBilled: 295785,
            //         latestBill: "12/12/2022",
            //     },
            //     {
            //         id: '',
            //         company: 'Outsourcing Co',
            //         billed: 12785,
            //         notBilled: 15785,
            //         latestBill: "12/12/2022",
            //     },
            // ]

            // const response = {
            //     month: toMonthName(today.getMonth()),
            //     year: today.getFullYear(),
            //     totalHoursBilled: String(totalHoursBilled),
            //     totalHoursBilledChange: 20,
            //     totalBillableHours: String(0),
            //     totalBillableHoursChange: 0,
            //     uninvoicedTime: String(0),
            //     recentInvoices: recentInvoices,
            //     clients: clients,
            // }

            // return response;
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