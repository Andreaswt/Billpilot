import { ApiKeyName, ApiKeyProvider } from "@prisma/client";
import { Employee } from "xero-node";
import { prisma } from "../../src/server/db/client";
import { Contact, Customer, Layout, PaymentTerms, Product, SalesPerson, Unit, VatZone } from "../../types/integrations/economic";
import { roundHours } from "../helpers/invoices";
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

async function request<T>(endpoint: string, method: httpMethod, organizationId: string, body: any = {}): Promise<T> {
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

    const response = await fetch(baseApiPath + "/" + endpoint, options)

    if (!response.ok) {
        let errorMsg = await response.json();
        logger.error(JSON.stringify(errorMsg));
        throw new Error(JSON.stringify(errorMsg))
    }

    return await response.json() as Promise<T>
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
            pricePerHour: true,
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

        let hours = item.quantity

        if (item.updatedHoursSpent && item.updatedHoursSpent > 0) {
            hours = item.updatedHoursSpent
        }

        if (item.quantity === 0 && item.updatedHoursSpent === 0) {
            throw new Error("e-conomic.ts: quantity and updatedHoursSpent are both 0")
        }

        let lineAmount = hours * item.unitPrice;

        // Apply discount
        if (item.discountPercentage && item.discountPercentage > 0) {
            lineAmount *= ((100 - item.discountPercentage) / 100)
        }

        if (hours === 0) {
            throw new Error("Hours spent on invoice line is 0." + JSON.stringify(invoice))
        }

        return ({
            lineNumber: lineNumber++,
            unit: {
                unitNumber: Number(invoice.economicOptions.unit)
            },
            quantity: roundHours(hours, invoice.roundingScheme),
            unitNetPrice: item.unitPrice,
            discountPercentage: item.discountPercentage,
            totalNetAmount: lineAmount,
            description: item.title,
            product: {
                productNumber: invoice.economicOptions.product
            }
        })
    })

    let createInvoice = {
        date: (new Date()).toISOString().slice(0, 10),
        ...(invoice?.dueDate ? { dueDate: invoice.dueDate.toISOString().slice(0, 10) } : {}),
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
        lines: [...timeItems],
        notes: {
            heading: invoice.title,
            textLine1: invoice.economicOptions.text1
        },
        references: {
            ...(invoice.economicOptions.ourReference ? { salesPerson: { employeeNumber: Number(invoice.economicOptions.ourReference) } } : {}
            ),
            ...(invoice.economicOptions.customerContact ? { customerContact: { customerContactNumber: Number(invoice.economicOptions.customerContact) } } : {}
            )
        }
    }

    let result = await request<any>("invoices/drafts", httpMethod.post, organizationId, createInvoice);
    return result;
}

export async function getAllLayouts(organizationId: string) {
    return (await request<{ collection: Layout[] }>("layouts", httpMethod.get, organizationId)).collection;
}

export async function getLayout(organizationId: string, layoutNumber: string) {
    return await request<Layout>(`layouts/${layoutNumber}`, httpMethod.get, organizationId);
}

export async function getAllCustomers(organizationId: string) {
    return (await request<{ collection: Customer[] }>("customers", httpMethod.get, organizationId)).collection;
}

export async function getCustomer(organizationId: string, customerNumber: string) {
    return await request<Customer>(`customers/${customerNumber}`, httpMethod.get, organizationId);
}

export async function getAllPaymentTerms(organizationId: string) {
    return (await request<{ collection: PaymentTerms[] }>("payment-terms", httpMethod.get, organizationId)).collection;
}

export async function getPaymentTerm(organizationId: string, paymentTermNumber: string) {
    return await request<PaymentTerms>(`payment-terms/${paymentTermNumber}`, httpMethod.get, organizationId);
}

export async function getAllVatZones(organizationId: string) {
    return (await request<{ collection: VatZone[] }>("vat-zones", httpMethod.get, organizationId)).collection;
}

export async function getVatZone(organizationId: string, vatZoneNumber: string) {
    return await request<VatZone>(`vat-zones/${vatZoneNumber}`, httpMethod.get, organizationId);
}

export async function getAllProducts(organizationId: string) {
    return (await request<{ collection: Product[] }>("products", httpMethod.get, organizationId)).collection;
}

export async function getProduct(organizationId: string, productNumber: string) {
    return await request<Product>(`products/${productNumber}`, httpMethod.get, organizationId);
}

export async function getAllUnits(organizationId: string) {
    return (await request<{ collection: Unit[] }>("units", httpMethod.get, organizationId)).collection;
}

export async function getUnit(organizationId: string, unitNumber: string) {
    return await request<Unit>(`units/${unitNumber}`, httpMethod.get, organizationId);
}

export async function getAllEmployees(organizationId: string) {
    return (await request<{ collection: SalesPerson[] }>("employees", httpMethod.get, organizationId)).collection;
}

export async function getEmployee(organizationId: string, employeeNumber: string) {
    return await request<SalesPerson>(`employees/${employeeNumber}`, httpMethod.get, organizationId);
}

export async function getCustomerContacts(organizationId: string, customerNumber: number) {
    return (await request<{ collection: Contact[] }>("customers/" + customerNumber + "/contacts", httpMethod.get, organizationId)).collection;
}

export async function getCustomerContact(organizationId: string, customerNumber: string, customerContactNumber: string) {
    return await request<Contact>("customers/" + customerNumber + "/contacts/" + customerContactNumber, httpMethod.get, organizationId);
}