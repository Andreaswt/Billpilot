import { ApiKeyName, ApiKeyProvider } from "@prisma/client";
import { prisma } from "../../src/server/db/client";
import { Contact, Customer, Layout, PaymentTerms, Product, SalesPerson, Unit, VatZone } from "../../types/integrations/economic";
import { logger } from "../logger";

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

    // All lines must have a linenumber
    let lineNumber = 1;

    // Add all time items
    let timeItems = invoice.invoiceLines.map(item => {
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
            unit: {
                unitNumber: Number(invoice.economicOptions.unit)
            },
            quantity: hours,
            unitNetPrice: invoice.economicOptions.customerPrice.toNumber(),
            discountPercentage: item.discountPercentage.toNumber(),
            totalNetAmount: lineAmount,
            description: item.title,
            product: {
                productNumber: invoice.economicOptions.product
            }
        })
    })

    let createInvoice = {
        date: (new Date()).toISOString().slice(0, 10),
        dueDate: invoice.dueDate.toISOString().slice(0, 10),
        currency: invoice.currency,
        paymentTerms: {
            paymentTermsNumber: Number(invoice.economicOptions.paymentTerms)
        },
        customer: {
            customerNumber: Number(invoice.economicOptions.customer),
        },
        recipient: {
            name: invoice.economicOptions.customer,
            vatZone: {
                vatZoneNumber: Number(invoice.economicOptions.vatZone)
            },
        },
        layout: {
            layoutNumber: Number(invoice.economicOptions.layout)
        },
        lines: [ ...timeItems ],
        notes: {
            heading: invoice.title,
            textLine1: invoice.economicOptions.text1
        },
        references: {
            salesPerson: {
                employeeNumber: Number(invoice.economicOptions.ourReference)
            },
            customerContact: {
                customerContactNumber: Number(invoice.economicOptions.customerContact)
            }
        }
    }

    let result = await request<any>("invoices/drafts", httpMethod.post, organizationId, createInvoice);
    return result;
}

export async function getAllLayouts(organizationId: string) {
    return await (await request<{ collection: Layout[] }>("layouts", httpMethod.get, organizationId)).collection;
}

export async function getAllCustomers(organizationId: string) {
    return await (await request<{ collection: Customer[] }>("customers", httpMethod.get, organizationId)).collection;
}

export async function getAllPaymentTerms(organizationId: string) {
    return await (await request<{ collection: PaymentTerms[] }>("payment-terms", httpMethod.get, organizationId)).collection;
}

export async function getAllVatZones(organizationId: string) {
    return await (await request<{ collection: VatZone[] }>("vat-zones", httpMethod.get, organizationId)).collection;
}

export async function getAllProducts(organizationId: string) {
    return await (await request<{ collection: Product[] }>("products", httpMethod.get, organizationId)).collection;
}

export async function getAllUnits(organizationId: string) {
    return await (await request<{ collection: Unit[] }>("units", httpMethod.get, organizationId)).collection;
}

export async function getAllEmployees(organizationId: string) {
    return await (await request<{ collection: SalesPerson[] }>("employees", httpMethod.get, organizationId)).collection;
}

export async function getCustomerContacts(organizationId: string, customerNumber: number) {
    return await (await request<{ collection: Contact[] }>("customers/" + customerNumber + "/contacts", httpMethod.get, organizationId)).collection;
}
