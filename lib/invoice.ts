import { FixedPriceTimeItem, InvoiceStatus, TimeItem } from "@prisma/client";
import { prisma } from "../src/server/db/client";
import { getAllCustomers, getAllLayouts, getAllPaymentTerms, getAllProducts, getAllUnits, getAllVatZones } from "./integrations/e-conomic";

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

export async function getInvoiceForExportToIntegration(invoiceId: string, organizationId: string) {
    let invoiceDb = await prisma.invoice.findUniqueOrThrow({
        where: {
            id: invoiceId
        },
        include: {
            timeItems: true,
            fixedPriceTimeItems: true,
            discounts: {
                select: {
                    name: true,
                    percent: true,
                    appliesToTimeItems: {
                        select: {
                            id: true // Time Items id's are selected
                        }
                    },
                    appliesToFixedPriceTimeItems: {
                        select: {
                            id: true // Fixed Price Time Items id's are selected
                        }
                    },
                }
            },
            fixedPriceDiscounts: {
                select: {
                    name: true,
                    amount: true,
                    appliesToTimeItems: {
                        select: {
                            id: true
                        }
                    },
                    appliesToFixedPriceTimeItems: {
                        select: {
                            id: true
                        }
                    },
                }
            },
            taxes: {
                select: {
                    name: true,
                    percent: true,
                    appliesToTimeItems: {
                        select: {
                            id: true
                        }
                    },
                    appliesToFixedPriceTimeItems: {
                        select: {
                            id: true
                        }
                    },
                }
            },
            currency: {
                select: {
                    abbreviation: true
                }
            }
        }
    })

    ////////
    // WHICH DISCOUNTS AND TAXES ARE APPLIED TO WHICH TIME ITEMS?
    // Every discount and tax ind the database has a property (e.g. "appliedToTimeItem"), which is an array of the time items it applies to
    // In the database fetch, we can select the it's of all time items, and then we can use the array to find the time items that are affected
    // First we build arrays of time items that are affected by each discount and tax
    // When we loop through each line, if the lines time item is in the array, we apply the discount or tax
    // These are the options: 
    // percent discount/time item, percent discount/fixed price time item, fixed discount/time item, fixed discount/fixed price time item, tax/time item, tax/fixed price time item
    ////////

    // percent discount/time item
    let discountAppliesToTimeItems: { [timeItemId: string]: { name: string, percent: number } } = {};

    invoiceDb.discounts.forEach(discount => {
        discount.appliesToTimeItems.forEach(timeItem => {
            discountAppliesToTimeItems[timeItem.id] = {
                name: discount.name,
                percent: discount.percent.toNumber()
            }
        })
    })

    // percent discount/fixed price time item
    let discountAppliesToFixedPriceTimeItems: { [fixedPriceTimeItemId: string]: { name: string, percent: number } } = {};

    invoiceDb.discounts.forEach(discount => {
        discount.appliesToFixedPriceTimeItems.forEach(fixedPriceTimeItem => {
            discountAppliesToFixedPriceTimeItems[fixedPriceTimeItem.id] = {
                name: discount.name,
                percent: discount.percent.toNumber()
            }
        })
    })

    // fixed discount/time item
    let fixedDiscountAppliesToTimeItems: { [timeItemId: string]: { name: string, amount: number } } = {};

    invoiceDb.fixedPriceDiscounts.forEach(fixedPriceDiscount => {
        fixedPriceDiscount.appliesToFixedPriceTimeItems.forEach(timeItem => {
            fixedDiscountAppliesToTimeItems[timeItem.id] = {
                name: fixedPriceDiscount.name,
                amount: fixedPriceDiscount.amount.toNumber()
            }
        })
    })

    // fixed discount/fixed price time item
    let fixedDiscountAppliesToFixedPriceTimeItems: { [fixedPriceTimeItem: string]: { name: string, amount: number } } = {};

    invoiceDb.fixedPriceDiscounts.forEach(fixedPriceDiscount => {
        fixedPriceDiscount.appliesToFixedPriceTimeItems.forEach(fixedPriceTimeItem => {
            fixedDiscountAppliesToFixedPriceTimeItems[fixedPriceTimeItem.id] = {
                name: fixedPriceDiscount.name,
                amount: fixedPriceDiscount.amount.toNumber()
            }
        })
    })

    // tax/time item
    let taxAppliesToTimeItems: { [timeItemId: string]: { name: string, percent: number } } = {};

    invoiceDb.discounts.forEach(tax => {
        tax.appliesToTimeItems.forEach(timeItem => {
            taxAppliesToTimeItems[timeItem.id] = {
                name: tax.name,
                percent: tax.percent.toNumber()
            }
        })
    })

    // tax/fixed price time item
    let taxAppliesToFixedPriceTimeItems: { [fixedPriceTimeItemId: string]: { name: string, percent: number } } = {};

    invoiceDb.discounts.forEach(tax => {
        tax.appliesToFixedPriceTimeItems.forEach(fixedPriceTimeItem => {
            taxAppliesToFixedPriceTimeItems[fixedPriceTimeItem.id] = {
                name: tax.name,
                percent: tax.percent.toNumber()
            }
        })
    })

    // Return the invoice, along with all discounts, so the invoice and discounts logic can be reused across multiple integration
    return {
        invoiceDb,
        discountAppliesToTimeItems,
        discountAppliesToFixedPriceTimeItems,
        fixedDiscountAppliesToTimeItems,
        fixedDiscountAppliesToFixedPriceTimeItems,
        taxAppliesToTimeItems,
        taxAppliesToFixedPriceTimeItems
    };
}

export function calculateDiscountPercentage(fixedPriceDiscount: number | undefined, percentageDiscount: number | undefined, lineAmount: number): number {
    ////////
    // DISCOUNT CALCULATIONS
    // Fixed discount and percentage discount can't be simultaneously applied
    // Therefore we check if a fixed discount is being applied, and if so, we ignore the percentage discount and convert the fixed amount to a percentage discount
    // Then we check if the percentage tax is applied, and if so, we ignore the fixed discount
    // Finally if none of the above exists, we do nothing
    // A single variable stores the discount whether it's one or the other, or nothing (0)
    ////////
    let calculatedDiscountPercentage = 0;

    if (fixedPriceDiscount && fixedPriceDiscount > 0) {
        calculatedDiscountPercentage = fixedPriceDiscount / lineAmount * 100;
    }
    else if (percentageDiscount && percentageDiscount > 0) {
        calculatedDiscountPercentage = percentageDiscount;
    }

    return calculatedDiscountPercentage;
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