import { Invoice } from "@prisma/client";
import { prisma } from "../src/server/db/client";

interface ICreateInvoiceInput {
        name: string,
        status: string
        invoiceNumber: number
        currencyName: string
        invoicedFrom: Date
        invoicedTo: Date
        issueDate: Date
        dueDate: Date
        clientName: string
        notesForClient: string
        // TODO: add invoice lines aswell
        organizationId: string
}

export async function createInvoice(invoice: ICreateInvoiceInput, organizationId: string) {
    // TODO: implement
    throw new Error("Not implemented");
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