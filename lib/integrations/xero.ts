import { Invoice as PrismaInvoice, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Version3Client } from 'jira.js';
import { Worklog } from 'jira.js/out/version3/models';
import { prisma } from "../../src/server/db/client";
import { logger } from '../logger';
import { Invoice, Invoices, LineItem, TokenSet, XeroClient } from 'xero-node';
import jwtDecode from 'jwt-decode';

export async function getXeroClient(organizationId?: string) {
    let xero = new XeroClient({
        clientId: process.env.XERO_CLIENT_ID,
        clientSecret: process.env.XERO_CLIENT_SECRET,
        redirectUris: [process.env.XERO_REDIRECT_URI],
        scopes: 'openid profile email accounting.settings accounting.reports.read accounting.journals.read accounting.contacts accounting.attachments accounting.transactions offline_access'.split(" "),
        httpTimeout: 3000 // ms (optional)
    });

    if (organizationId) {
        // If tokenset doesn't exist the client is returned, so that it can be used to get the tokenset
        // If tokenset doesn't exist, an error is throw.
        let tokenset: TokenSet;
        try {
            tokenset = await getXeroTokenset(organizationId);
        }
        catch (e) {
            return xero;
        }

        // Otherwise initialize sdk client and refresh access token and ready for api use
        await xero.initialize();

        await xero.setTokenSet(tokenset);

        if (tokenset.expired()) {
            const validTokenSet = await xero.refreshToken();
            // save the new tokenset
            saveTokenset(validTokenSet, organizationId);
        }
    }

    return xero;
}

export async function createInvoice(invoice: PrismaInvoice, organizationId: string) {
    let dbInvoice = await prisma.invoice.findUniqueOrThrow({
        where: {
            id: invoice.id
        },
        include: {
            timeItems: true,
            fixedPriceTimeItems: true,
            discounts: {
                select: {
                    name: true,
                    percent: true
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
            }
        }
    })

    let lineItems: LineItem[] = [];

    // Add all time items
    dbInvoice.timeItems.map(item => {
        let discount = dbInvoice.discounts.find(discount => discount.name === item.name);
        let fixedPriceDiscount = dbInvoice.fixedPriceDiscounts.find(discount => discount.name === item.name);
        let tax = dbInvoice.taxes.find(tax => tax.name === item.name);

        let lineAmount = item.time.toNumber() * item.hourlyWage.toNumber();

        return ({
            description: item.name,
            quantity: item.time,
            accountCode: "200",
            taxType: tax ? "OUTPUT" : "NONE",
            taxAmount: tax ? lineAmount + (lineAmount * tax.percent.toNumber()) : 0,
            lineAmount: lineAmount,
            discountRate: discount ? discount.percent.toNumber() : 0,
            discountAmount: fixedPriceDiscount ? fixedPriceDiscount?.amount : 0,
        })
    })

    // Add all fixed price items
    dbInvoice.fixedPriceTimeItems.map(item => {
        let discount = dbInvoice.discounts.find(discount => discount.name === item.name);
        let fixedPriceDiscount = dbInvoice.fixedPriceDiscounts.find(discount => discount.name === item.name);
        let tax = dbInvoice.taxes.find(tax => tax.name === item.name);

        let lineAmount = item.amount.toNumber();

        return ({
            description: item.name,
            quantity: 1,
            unitPrice: item.amount,
            accountCode: "200",
            taxType: tax ? "OUTPUT" : "NONE",
            taxAmount: tax ? lineAmount + (lineAmount * tax.percent.toNumber()) : 0,
            lineAmount: lineAmount,
            discountRate: discount ? discount.percent.toNumber() : 0,
            discountAmount: fixedPriceDiscount ? fixedPriceDiscount?.amount : 0,
        })
    })

    const invoices: Invoices = {
        invoices: [
            {
                type: Invoice.TypeEnum.ACCREC,
                lineItems: lineItems,
                date: invoice.issueDate.toISOString().slice(0, 10),
                dueDate: invoice.dueDate.toISOString().slice(0, 10), // yyyy-mm-dd
                reference: invoice.name, // TODO: whats this
                status: Invoice.StatusEnum.DRAFT // Get this
            }
        ]
    }

    let xero = await getXeroClient(organizationId);

    await xero.updateTenants();
    const activeTenantId = xero.tenants[0].tenantId;

    const createdInvoicesResponse = await xero.accountingApi.createInvoices(activeTenantId, invoices)

    return createdInvoicesResponse.body.invoices![0];
}

export async function getAccounts(organizationId: string) {
    let xero = await getXeroClient(organizationId);

    await xero.updateTenants();
    const activeTenantId = xero.tenants[0].tenantId;

    const accounts = await xero.accountingApi.getAccounts(activeTenantId);

    return accounts.body.accounts;
}

async function getXeroTokenset(organizationId: string) {
    let storedTokenset = await prisma.xeroAuthenticationKey.findUniqueOrThrow({
        where: {
            organizationId: organizationId
        }
    })

    return new TokenSet({
        id_token: storedTokenset.idToken,
        access_token: storedTokenset.accessToken,
        refresh_token: storedTokenset.refreshToken,
        expires_in: storedTokenset.expiresIn,
        scope: storedTokenset.scope
    });
}

export async function saveTokenset(tokenSet: TokenSet, organizationId: string) {
    await prisma.xeroAuthenticationKey.upsert({
        where: {
            organizationId: organizationId
        },
        update: {
            idToken: tokenSet.id_token!,
            accessToken: tokenSet.access_token!,
            expiresIn: tokenSet.expires_in!,
            tokenType: tokenSet.token_type!,
            refreshToken: tokenSet.refresh_token!,
            scope: tokenSet.scope!,
        },
        create: {
            organizationId: organizationId,
            idToken: tokenSet.id_token!,
            accessToken: tokenSet.access_token!,
            expiresIn: tokenSet.expires_in!,
            tokenType: tokenSet.token_type!,
            refreshToken: tokenSet.refresh_token!,
            scope: tokenSet.scope!,
        }
    })
}