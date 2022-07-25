import { FixedPriceTimeItem, InvoiceStatus, TimeItem } from "@prisma/client";
import { prisma } from "../src/server/db/client";

interface ICreateInvoiceInput {
    invoice: {
        name: string
        status: InvoiceStatus
        invoiceNumber: number
        currencyName: string
        invoicedFrom: Date
        invoicedTo: Date
        issueDate: Date
        dueDate: Date
        clientName: string
        notesForClient: string
        timeItems: {
            name: string
            time: number
            hourlyWage: number
            discountsAppliedByName: string[]
            fixedPriceDiscountsAppliedByName: string[]
            taxesAppliedByName: string[]
        }[]
        fixedPriceTimeItems: {
            name: string
            amount: number
            discountsAppliedByName: string[]
            fixedPriceDiscountsAppliedByName: string[]
            taxesAppliedByName: string[]
        }[]

        // Discounts etc are appliable to multiple time items, so are referenced by name in time items
        discounts: {
            name: string
            percent: number
        }[]
        fixedPriceDiscounts: {
            name: string
            amount: number
        }[]
        taxes: {
            name: string
            percent: number
        }[]
    }
}

export async function createInvoice(invoice: ICreateInvoiceInput, organizationId: string) {
    // Insert into invoice
    await prisma.invoice.create({
        data: {
            ...invoice.invoice,
            organizationId: organizationId,

        },
    })

    // Insert into time items

    // Insert into fixed price time items

    // Insert into discounts

    // Insert into fixed price discounts

    // Insert into taxes
}

export async function getInvoice(invoiceId: string, organizationId: string) {
    // TODO: implement
    throw new Error("Not implemented");
}

export async function getTotalInvoiced(organizationId: String) {
    // TODO: implement
    throw new Error("Not implemented");

    // Find all invoices for the organization, where status is "Paid" or "Sent"
    // Sum the total amount of all invoices
}

export async function getTotalPaid(organizationId: String) {
    // TODO: implement
    throw new Error("Not implemented");

    // Find all invoices for the organization, where status is "Paid"
    // Sum the total amount of all invoices
}

export async function getTotalDue(organizationId: String) {
    // TODO: implement
    throw new Error("Not implemented");

    // Find all invoices for the organization, where status is "Sent"
    // Sum the total amount of all invoices
}

export async function getTotalDrafts(organizationId: String) {
    // TODO: implement
    throw new Error("Not implemented");

    // Find all invoices for the organization, where status is "Draft"
    // Sum the total amount of all invoices
}