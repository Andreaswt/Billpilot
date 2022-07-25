import { logger } from "../logger";
import { prisma } from "../../src/server/db/client";
import { connect } from "http2";
import { CreateInvoice, Customer, Layout, Line, PaymentTerms, Product, Unit, VatZone } from "../../types/integrations/economic/create-invoice";
import { Invoice, Invoices, LineItem } from "xero-node";
import { custom } from "zod";
import { SuperFundProducts } from "xero-node/dist/gen/model/payroll-au/superFundProducts";

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
                provider: "E-conomic",
                key: "Agreement Grant Token"
            }
        },
        select: {
            key: true,
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

    // TODO: create picker for user to select layout, customer, paymentterms, vatzones, products
    // TODO: when new invoice is created, use the values from the latest invoice, so customer won't have to select again
    let layouts = await request<{ collection: Layout[] }>("layouts", httpMethod.get, organizationId);
    let customers = await request<{ collection: Customer[] }>("customers", httpMethod.get, organizationId);
    let paymentTerms = await request<{ collection: PaymentTerms[] }>("payment-terms", httpMethod.get, organizationId);
    let vatZones = await request<{ collection: VatZone[] }>("vat-zones", httpMethod.get, organizationId);
    let products = await request<{ collection: Product[] }>("products", httpMethod.get, organizationId);
    let units = await request<{ collection: Unit[] }>("units", httpMethod.get, organizationId);

    // Add all time items
    let timeItems: Line[] = invoiceDb.timeItems.map(item => {
        let lineAmount = item.time * item.hourlyWage;

        return ({
            unit: units.collection[0]!,
            quantity: item.time,
            unitNetPrice: lineAmount,
            discountPercentage: 6,
            totalNetAmount: lineAmount,
            description: item.name,
            product: products.collection[0]!
        })
    })

    // Add all fixed price items
    let fixedPriceItems: Line[] = invoiceDb.fixedPriceTimeItems.map(item => {
        let lineAmount = item.amount;

        return ({
            unit: units.collection[0]!,
            quantity: 1,
            unitNetPrice: item.amount,
            discountPercentage: 0,
            totalNetAmount: lineAmount,
            description: item.name,
            product: products.collection[0]!

        })
    })

    let createInvoice: CreateInvoice = {
        date: invoiceDb.issueDate.toISOString().slice(0, 10),
        dueDate: invoiceDb.dueDate.toISOString().slice(0, 10),
        currency: invoiceDb.currency?.abbrevation ?? "USD", // Default to USD
        paymentTerms: paymentTerms.collection[0]!,
        customer: customers.collection[0]!,
        recipient: {
            name: customers.collection[0]!.name,
            vatZone: vatZones.collection[0]!,
        },
        layout: layouts.collection[0]!,
        lines: [...timeItems, ...fixedPriceItems],
    }

    let result = await request<any>("invoices/drafts", httpMethod.post, organizationId, createInvoice);
    return result;
    // return "result";
}

export async function createInvoice(invoiceId: string, organizationId: string) {
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
                    percent: true
                    // Select the appliesToTimeItems and appliesToFixedPriceItems fields, and apply discounts to both
                }
            },
            fixedPriceDiscounts: {
                select: {
                    name: true,
                    amount: true
                }
            },
            taxes: {
                select: {
                    name: true,
                    percent: true
                }
            },
            currency: {
                select: {
                    abbreviation: true
                }
            }
        }
    })

    // TODO: create picker for user to select layout, customer, paymentterms, vatzones, products
    // TODO: when new invoice is created, use the values from the latest invoice, so customer won't have to select again
    let layouts = await request<{collection: Layout[]}>("layouts", httpMethod.get, organizationId);
    let customers = await request<{collection: Customer[]}>("customers", httpMethod.get, organizationId);
    let paymentTerms = await request<{collection: PaymentTerms[]}>("payment-terms", httpMethod.get, organizationId);
    let vatZones = await request<{collection: VatZone[]}>("vat-zones", httpMethod.get, organizationId);
    let products = await request<{collection: Product[]}>("products", httpMethod.get, organizationId);
    let units = await request<{ collection: Unit[] }>("units", httpMethod.get, organizationId);

    // Add all time items
    let timeItems: Line[] = invoiceDb.timeItems.map(item => {
        let discount = invoiceDb.discounts.find(discount => discount.name === item.name);
        let fixedPriceDiscount = invoiceDb.fixedPriceDiscounts.find(discount => discount.name === item.name);
        let tax = invoiceDb.taxes.find(tax => tax.name === item.name);
        // TODO: apply fixed price discount
        // TODO: apply tax

        let lineAmount = item.time.toNumber() * item.hourlyWage.toNumber();

        return ({
            unit: units.collection[0]!,
            quantity: item.time.toNumber(),
            unitNetPrice: lineAmount,
            discountPercentage: discount && discount?.percent.toNumber() != 0 ? discount.percent.toNumber() : 0,
            totalNetAmount: lineAmount,
            description: item.name,
            product: products.collection[0]!
        })
    })

    // Add all fixed price items
    let fixedPriceItems: Line[] = invoiceDb.fixedPriceTimeItems.map(item => {
        let discount = invoiceDb.discounts.find(discount => discount.name === item.name);
        let fixedPriceDiscount = invoiceDb.fixedPriceDiscounts.find(discount => discount.name === item.name);
        let tax = invoiceDb.taxes.find(tax => tax.name === item.name);
        // TODO: apply fixed price discount
        // TODO: apply tax

        let lineAmount = item.amount.toNumber();

        return ({
            unit: units.collection[0]!,
            quantity: 1,
            unitNetPrice: item.amount.toNumber(),
            discountPercentage: discount && discount?.percent.toNumber() != 0 ? discount.percent.toNumber() : 0,
            totalNetAmount: lineAmount,
            description: item.name,
            product: products.collection[0]!
        })
    })

    // let createInvoice: CreateInvoice = {
    //     date: invoiceDb.issueDate.toISOString().slice(0, 10),
    //     dueDate: invoiceDb.dueDate.toISOString().slice(0, 10),
    //     currency: invoiceDb.currency?.abbreviation ?? "USD", // Default to USD
    //     lines: [...timeItems, ...fixedPriceItems],
    // }

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


// export async function createInvoicexero(invoiceId: string, organizationId: string) {
//     let invoice = await prisma.invoice.findUniqueOrThrow({
//         where: {
//             id: invoiceId
//         },
//         include: {
//             timeItems: true,
//             fixedPriceTimeItems: true,
//             discounts: {
//                 select: {
//                     name: true,
//                     percent: true
//                 }
//             },
//             fixedPriceDiscounts: {
//                 select: {
//                     name: true,
//                     amount: true
//                 }
//             },
//             taxes: {
//                 select: {
//                     name: true,
//                     percent: true
//                 }
//             }
//         }
//     })

//     let lineItems: LineItem[] = [];

//     // Add all time items
//     invoice.timeItems.map(item => {
//         let discount = invoice.discounts.find(discount => discount.name === item.name);
//         let fixedPriceDiscount = invoice.fixedPriceDiscounts.find(discount => discount.name === item.name);
//         let tax = invoice.taxes.find(tax => tax.name === item.name);

//         let lineAmount = item.time.toNumber() * item.hourlyWage.toNumber();

//         return ({
//             description: item.name,
//             quantity: item.time,
//             accountCode: "200",
//             taxType: tax ? "OUTPUT" : "NONE",
//             taxAmount: tax ? lineAmount + (lineAmount * tax.percent.toNumber()) : 0,
//             lineAmount: lineAmount,
//             discountRate: discount ? discount.percent.toNumber() : 0,
//             discountAmount: fixedPriceDiscount ? fixedPriceDiscount?.amount : 0,
//         })
//     })

//     // Add all fixed price items
//     invoice.fixedPriceTimeItems.map(item => {
//         let discount = invoice.discounts.find(discount => discount.name === item.name);
//         let fixedPriceDiscount = invoice.fixedPriceDiscounts.find(discount => discount.name === item.name);
//         let tax = invoice.taxes.find(tax => tax.name === item.name);

//         let lineAmount = item.amount.toNumber();

//         return ({
//             description: item.name,
//             quantity: 1,
//             unitPrice: item.amount,
//             accountCode: "200",
//             taxType: tax ? "OUTPUT" : "NONE",
//             taxAmount: tax ? lineAmount + (lineAmount * tax.percent.toNumber()) : 0,
//             lineAmount: lineAmount,
//             discountRate: discount ? discount.percent.toNumber() : 0,
//             discountAmount: fixedPriceDiscount ? fixedPriceDiscount?.amount : 0,
//         })
//     })

//     // Add invoiced dates as first element in the line items
//     lineItems.unshift({
//         description: "Invoices dates: " + invoice.invoicedFrom.toISOString() + " - " + invoice.invoicedTo.toISOString(),
//     })

//     // Add customer notes as last element in the line items
//     lineItems.push({
//         description: invoice.notesForClient,
//     })

//     const invoices: Invoices = {
//         invoices: [
//             {
//                 type: Invoice.TypeEnum.ACCREC,
//                 lineItems: lineItems,
//                 date: invoice.issueDate.toISOString().slice(0, 10),
//                 dueDate: invoice.dueDate.toISOString().slice(0, 10), // yyyy-mm-dd
//                 reference: invoice.name,
//                 status: Invoice.StatusEnum.DRAFT
//             }
//         ]
//     }

//     let xero = await getXeroClient(organizationId);

//     const createdInvoicesResponse = await xero.accountingApi.createInvoices(await getActiveTenantId(), invoices)

//     return createdInvoicesResponse.body.invoices![0];
// }