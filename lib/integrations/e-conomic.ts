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
                key: ApiKeyName.AGREEMENTGRANTTOKEN
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
                key: ApiKeyName.AGREEMENTGRANTTOKEN,
                organizationId: organizationId
            }
        },
        update: {
            value: agreementGrantToken
        },
        create: {
            provider: ApiKeyProvider.ECONOMIC,
            key: ApiKeyName.AGREEMENTGRANTTOKEN,
            value: agreementGrantToken,
            organizationId: organizationId
        }
    })
}

export async function test(organizationId: string) {
    let invoiceDb = {
        timeItems: [
            {
                name: "item 1",
                hourlyWage: 100,
                time: 5
            },
            {
                name: "item 2",
                hourlyWage: 300,
                time: 30
            }
        ],
        fixedPriceTimeItems: [
            {
                name: "fixed item 1",
                amount: 600,
            },
            {
                name: "fixed item 2",
                amount: 1200,
            }
        ],
        discounts: [
            {
                name: "discount 1",
                percent: 10
            }
        ],
        fixedPriceDiscounts: [
            {
                name: "fixed discount 1",
                amount: 100
            }
        ],
        taxes: [
            {
                name: "fixed discount 1",
                percent: 15
            }
        ],
        date: new Date(),
        currency: {
            abbrevation: 'DKK',
        },
        dueDate: new Date(),
        issueDate: new Date(),
    }
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

export async function createJiraIssueInvoice(invoice: ICreateIssueInvoice, organizationId: string) {
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
    let timeItems: Line[] = invoice.issueTimeItems.map(item => {
        let hours = item.hours

        if (item.updatedHoursSpent && item.updatedHoursSpent > 0) {
            hours = item.updatedHoursSpent
        }

        let lineAmount = hours * invoice.economicCustomerPrice;

        // Apply discount
        if (item.discountPercentage && item.discountPercentage > 0) {
            lineAmount *= ((100 - item.discountPercentage) / 100)
        }

        return ({
            lineNumber: lineNumber++,
            unit: units.collection[0]!,
            quantity: hours,
            unitNetPrice: invoice.economicCustomerPrice,
            discountPercentage: item.discountPercentage,
            totalNetAmount: lineAmount,
            description: item.name,
            product: products.collection[0]!
        })
    })

    let createInvoice: CreateInvoice = {
        date: (new Date()).toISOString().slice(0, 10),
        dueDate: invoice.dueDate.toISOString().slice(0, 10),
        currency: invoice.currency,
        paymentTerms: paymentTerms.collection[0]!,
        customer: {
            customerNumber: parseInt(invoice.economicCustomer),
        },
        recipient: {
            name: invoice.economicCustomer,
            vatZone: vatZones.collection[0]!,
        },
        layout: layouts.collection[0]!,
        lines: [ ...timeItems ],
        notes: {
            heading: invoice.title,
            textLine1: invoice.economicText1
        },
        references: {
            salesPerson: {
                employeeNumber: parseInt(invoice.economicOurReference)
            },
            customerContact: {
                customerContactNumber: parseInt(invoice.economicCustomerContact)
            }
        }
    }

    let result = await request<any>("invoices/drafts", httpMethod.post, organizationId, createInvoice);
    return result;
}

var hej = {
    draftInvoiceNumber: 30066,
    soap: { currentInvoiceHandle: { id: 30 } },
    templates: {
        bookingInstructions: 'https://restapi.e-conomic.com/invoices/drafts/30066/templates/booking-instructions',
        self: 'https://restapi.e-conomic.com/invoices/drafts/30066/templates'
    },
    lines: [
        {
            lineNumber: 2,
            sortKey: 1,
            description: 'Timer samlet',
            product: [Object],
            quantity: 1,
            unitNetPrice: 5000,
            discountPercentage: 20,
            unitCostPrice: 0,
            totalNetAmount: 4000,
            marginInBaseCurrency: 4000,
            marginPercentage: 100
        },
        {
            lineNumber: 3,
            sortKey: 2,
            description: 'Materialer',
            product: [Object],
            quantity: 1,
            unitNetPrice: 5000,
            discountPercentage: 50,
            unitCostPrice: 0,
            totalNetAmount: 2500,
            marginInBaseCurrency: 2500,
            marginPercentage: 100
        }
    ],
    date: '2017-10-30',
    currency: 'DKK',
    exchangeRate: 100,
    netAmount: 6500,
    netAmountInBaseCurrency: 6500,
    grossAmount: 8125,
    grossAmountInBaseCurrency: 8125,
    marginInBaseCurrency: 6500,
    marginPercentage: 100,
    vatAmount: 1625,
    roundingAmount: 0,
    costPriceInBaseCurrency: 0,
    dueDate: '2017-11-29',
    paymentTerms: {
        paymentTermsNumber: 5,
        daysOfCredit: 30,
        name: 'Netto 30 dage',
        paymentTermsType: 'net',
        self: 'https://restapi.e-conomic.com/payment-terms/5'
    },
    customer: {
        customerNumber: 1007,
        self: 'https://restapi.e-conomic.com/customers/1007'
    },
    recipient: {
        name: 'Andersens Eftf. A/S',
        address: 'Wildersgade 10B',
        zip: '1408',
        city: 'København K',
        vatZone: {
            name: 'Domestic',
            vatZoneNumber: 1,
            enabledForCustomer: true,
            enabledForSupplier: true,
            self: 'https://restapi.e-conomic.com/vat-zones/1'
        },
        nemHandelType: 'ean'
    },
    layout: {
        layoutNumber: 19,
        self: 'https://restapi.e-conomic.com/layouts/19'
    },
    pdf: {
        download: 'https://restapi.e-conomic.com/invoices/drafts/30066/pdf'
    },
    self: 'https://restapi.e-conomic.com/invoices/drafts/30066'
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