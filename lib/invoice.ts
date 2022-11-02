export interface ICreateIssueInvoice {
    title: string,
    currency: string,
    dueDate: Date,
    roundingScheme: string,
    exportToEconomic: Boolean,
    economicCustomer: string,
    economicPricePerHour: number,
    economicText1: string,
    economicOurReference: string,
    economicCustomerContact: string

    issueTimeItems: {
        jiraId: string,
        jiraKey: string,
        name: string,
        hours: number
        updatedHoursSpent: number,
        discountPercentage: number
    }[]
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