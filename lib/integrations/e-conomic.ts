import { logger } from "../logger";
import { prisma } from "../../src/server/db/client";
import { connect } from "http2";
import { Contact, CreateInvoice, Customer, Layout, Line, PaymentTerms, Product, SalesPerson, Unit, VatZone } from "../../types/integrations/economic";
import { Invoice, Invoices, LineItem } from "xero-node";
import { custom } from "zod";
import { SuperFundProducts } from "xero-node/dist/gen/model/payroll-au/superFundProducts";
import { ApplicationRoles } from "jira.js/out/version2";
import { calculateDiscountPercentage, getInvoiceForExportToIntegration, ICreateIssueInvoice } from "../invoice";
import { ApiKeyName, ApiKeyProvider } from "@prisma/client";

enum httpMethod {
    get = 'GET',
    post = 'POST',
    put = 'PUT',
    delete = 'DELETE',
}

var baseApiPath = "https://restapi.e-conomic.com";

async function getAgreemenGrantToken(organizationId: string) {
    let agreemenGrantToken = await prisma.apiKey.findUniqueOrThrow({
        where: {
            organizationsApiKey: {
                organizationId: organizationId,
                provider: ApiKeyProvider.ECONOMIC,
                key: ApiKeyName.ECONOMICAGREEMENTGRANTTOKEN
            }
        },
        select: {
            value: true
        }
    })

    return agreemenGrantToken.value;
}

export async function request<T>(endpoint: string, method: httpMethod, organizationId: string, body: any = {}): Promise<T> {
    let agreementGrantToken = await getAgreemenGrantToken(organizationId);

    let options: any = {
        method: method,
        headers: {
            'X-AppSecretToken': process.env.ECONOMIC_APP_SECRET_TOKEN,
            'X-AgreementGrantToken': agreementGrantToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    if (method === httpMethod.get) {
        delete options.body;
    }

    return fetch(baseApiPath + "/" + endpoint, options)
        .then(async response => {
            if (!response.ok) {
                let errorMsg = await response.json();
                logger.error(errorMsg);
                throw new Error(response.statusText)
            }

            return response.json() as Promise<T>
        })
        .then(data => {
            return data
        })
}

export async function saveAgreementGrantToken(agreementGrantToken: string, organizationId: string) {
    await prisma.apiKey.upsert({
        where: {
            organizationsApiKey: {
                provider: ApiKeyProvider.ECONOMIC,
                key: ApiKeyName.ECONOMICAGREEMENTGRANTTOKEN,
                organizationId: organizationId
            }
        },
        update: {
            value: agreementGrantToken
        },
        create: {
            provider: ApiKeyProvider.ECONOMIC,
            key: ApiKeyName.ECONOMICAGREEMENTGRANTTOKEN,
            value: agreementGrantToken,
            organizationId: organizationId
        }
    })
}

export async function createInvoice(invoiceId: string, organizationId: string) {
    let { invoiceDb,
        discountAppliesToTimeItems,
        discountAppliesToFixedPriceTimeItems,
        fixedDiscountAppliesToTimeItems,
        fixedDiscountAppliesToFixedPriceTimeItems,
        taxAppliesToTimeItems,
        taxAppliesToFixedPriceTimeItems } = await getInvoiceForExportToIntegration(invoiceId, organizationId);

    // TODO: create picker for user to select layout, customer, paymentterms, vatzones, products
    // TODO: when new invoice is created, use the values from the latest invoice, so customer won't have to select again
    let layouts = await getAllLayouts(organizationId);
    let customers = await getAllCustomers(organizationId);
    let paymentTerms = await getAllPaymentTerms(organizationId);
    let vatZones = await getAllVatZones(organizationId);
    let products = await getAllProducts(organizationId);
    let units = await getAllUnits(organizationId);
    let employees = await getAllEmployees(organizationId);

    // All lines must have a linenumber
    let lineNumber = 1;

    // Add all time items
    let timeItems: Line[] = invoiceDb.timeItems.map(item => {
        let discount = discountAppliesToTimeItems[item.id];
        let fixedPriceDiscount = fixedDiscountAppliesToTimeItems[item.id];
        let tax = taxAppliesToTimeItems[item.id];

        let lineAmount = item.time.toNumber() * item.hourlyWage.toNumber();

        return ({
            lineNumber: lineNumber++,
            unit: units.collection[0]!,
            quantity: item.time.toNumber(),
            unitNetPrice: lineAmount,
            discountPercentage: calculateDiscountPercentage(fixedPriceDiscount?.amount, discount?.percent, lineAmount),
            totalNetAmount: lineAmount,
            description: item.name,
            product: products.collection[0]!
        })
    })

    // Add all fixed price items
    let fixedPriceItems: Line[] = invoiceDb.fixedPriceTimeItems.map(item => {
        let discount = discountAppliesToFixedPriceTimeItems[item.id];
        let fixedPriceDiscount = fixedDiscountAppliesToFixedPriceTimeItems[item.id];
        let tax = taxAppliesToFixedPriceTimeItems[item.id];

        // TODO: apply tax

        let lineAmount = item.amount.toNumber();

        return ({
            lineNumber: lineNumber++,
            unit: units.collection[0]!,
            quantity: 1,
            unitNetPrice: item.amount.toNumber(),
            discountPercentage: calculateDiscountPercentage(fixedPriceDiscount?.amount, discount?.percent, lineAmount),
            totalNetAmount: lineAmount,
            description: item.name,
            product: products.collection[0]!
        })
    })

    let createInvoice: CreateInvoice = {
        date: invoiceDb.issueDate.toISOString().slice(0, 10),
        dueDate: invoiceDb.dueDate.toISOString().slice(0, 10),
        currency: invoiceDb.currency ?? "USD", // Default to USD
        paymentTerms: paymentTerms.collection[0]!,
        customer: customers.collection[0]!,
        recipient: {
            name: "", // TODO: use real one
            vatZone: vatZones.collection[0]!,
        },
        layout: layouts.collection[0]!,
        lines: [...timeItems, ...fixedPriceItems],
        notes: {
            heading: invoiceDb.name,
            textLine1: invoiceDb.name
        },
        references: {
            salesPerson: {
                employeeNumber: employees.collection[0]!.employeeNumber,
            },
            customerContact: {
                customerContactNumber: 0 // TODO: doesnt work
            }
        }
    }

    let result = await request<any>("invoices/drafts", httpMethod.post, organizationId, createInvoice);
    return result;
}

export async function createInvoiceDraft(generalInvoiceId: string, organizationId: string) {
    const invoice = await prisma.generalInvoice.findUniqueOrThrow({
        where: {
            id: generalInvoiceId
        },
        select: {
            title: true,
            description: true,
            currency: true,
            roundingScheme: true,
            invoiceLines: true,
            invoicedFrom: true,
            invoicedTo: true,
            issueDate: true,
            dueDate: true,
            economicOptions: true,
        }
    })

    if (!invoice.economicOptions) throw new Error("Economic options not defined for invoice during e-conomic invoice export")


    let layouts = await getAllLayouts(organizationId)
    // let customers = await getAllCustomers(organizationId)
    let paymentTerms = await getAllPaymentTerms(organizationId)
    let vatZones = await getAllVatZones(organizationId)
    let products = await getAllProducts(organizationId)
    let units = await getAllUnits(organizationId)
    // let employees = await getAllEmployees(organizationId)

    // All lines must have a linenumber
    let lineNumber = 1;

    // Add all time items
    let timeItems: Line[] = invoice.invoiceLines.map(item => {
        if (!invoice.economicOptions) throw new Error("Economic options not defined for invoice during e-conomic invoice export")

        let hours = item.hours.toNumber()

        if (item.updatedHoursSpent && item.updatedHoursSpent.toNumber() > 0) {
            hours = item.updatedHoursSpent.toNumber()
        }

        let lineAmount = hours * invoice.economicOptions.customerPrice.toNumber();

        // Apply discount
        if (item.discountPercentage && item.discountPercentage.toNumber() > 0) {
            lineAmount *= ((100 - item.discountPercentage.toNumber()) / 100)
        }

        return ({
            lineNumber: lineNumber++,
            unit: units.collection[0]!,
            quantity: hours,
            unitNetPrice: invoice.economicOptions.customerPrice.toNumber(),
            discountPercentage: item.discountPercentage.toNumber(),
            totalNetAmount: lineAmount,
            description: item.title,
            product: products.collection[0]!
        })
    })

    let createInvoice: CreateInvoice = {
        date: (new Date()).toISOString().slice(0, 10),
        dueDate: invoice.dueDate.toISOString().slice(0, 10),
        currency: invoice.currency,
        paymentTerms: paymentTerms.collection[0]!,
        customer: {
            customerNumber: parseInt(invoice.economicOptions.customer),
        },
        recipient: {
            name: invoice.economicOptions.customer,
            vatZone: vatZones.collection[0]!,
        },
        layout: layouts.collection[0]!,
        lines: [ ...timeItems ],
        notes: {
            heading: invoice.title,
            textLine1: invoice.economicOptions.text1
        },
        references: {
            salesPerson: {
                employeeNumber: parseInt(invoice.economicOptions.ourReference)
            },
            customerContact: {
                customerContactNumber: parseInt(invoice.economicOptions.customerContact)
            }
        }
    }

    let result = await request<any>("invoices/drafts", httpMethod.post, organizationId, createInvoice);
    return result;
}

export async function getAllLayouts(organizationId: string) {
    return await request<{ collection: Layout[] }>("layouts", httpMethod.get, organizationId);
}

export async function getAllCustomers(organizationId: string) {
    return await request<{ collection: Customer[] }>("customers", httpMethod.get, organizationId);
}

export async function getAllPaymentTerms(organizationId: string) {
    return await request<{ collection: PaymentTerms[] }>("payment-terms", httpMethod.get, organizationId);
}

export async function getAllVatZones(organizationId: string) {
    return await request<{ collection: VatZone[] }>("vat-zones", httpMethod.get, organizationId);
}

export async function getAllProducts(organizationId: string) {
    return await request<{ collection: Product[] }>("products", httpMethod.get, organizationId);
}

export async function getAllUnits(organizationId: string) {
    return await request<{ collection: Unit[] }>("units", httpMethod.get, organizationId);
}

export async function getAllEmployees(organizationId: string) {
    return await request<{ collection: SalesPerson[] }>("employees", httpMethod.get, organizationId);
}

export async function getCustomerContacts(organizationId: string, customerNumber: number) {
    return await request<{ collection: Contact[] }>("customers/" + customerNumber + "/contacts", httpMethod.get, organizationId);
}