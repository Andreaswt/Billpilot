import { prisma } from "../../src/server/db/client";
import { Invoice, Invoices, LineItem, TokenSet, XeroClient } from 'xero-node';
import { getInvoiceForExportToIntegration } from "../invoice";

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

export async function createInvoice(invoiceId: string, organizationId: string) {
    let { invoiceDb,
        discountAppliesToTimeItems,
        discountAppliesToFixedPriceTimeItems,
        fixedDiscountAppliesToTimeItems,
        fixedDiscountAppliesToFixedPriceTimeItems,
        taxAppliesToTimeItems,
        taxAppliesToFixedPriceTimeItems } = await getInvoiceForExportToIntegration(invoiceId, organizationId);

    let lineItems: LineItem[] = [];

    // Add all time items
    invoiceDb.timeItems.map(item => {
        let discount = discountAppliesToTimeItems[item.id];
        let fixedPriceDiscount = fixedDiscountAppliesToTimeItems[item.id];
        let tax = taxAppliesToTimeItems[item.id];

        let lineAmount = item.time.toNumber() * item.hourlyWage.toNumber();

        return ({
            description: item.name,
            quantity: item.time,
            accountCode: "200",
            taxType: tax ? "OUTPUT" : "NONE",
            taxAmount: tax ? lineAmount + (lineAmount * tax.percent) : 0,
            lineAmount: lineAmount,
            discountRate: discount ? discount.percent : 0,
            discountAmount: fixedPriceDiscount ? fixedPriceDiscount?.amount : 0,
        })
    })

    // Add all fixed price items
    invoiceDb.fixedPriceTimeItems.map(item => {
        let discount = discountAppliesToFixedPriceTimeItems[item.id];
        let fixedPriceDiscount = fixedDiscountAppliesToFixedPriceTimeItems[item.id];
        let tax = taxAppliesToFixedPriceTimeItems[item.id];

        let lineAmount = item.amount.toNumber();

        return ({
            description: item.name,
            quantity: 1,
            unitPrice: item.amount,
            accountCode: "200",
            taxType: tax ? "OUTPUT" : "NONE",
            taxAmount: tax ? lineAmount + (lineAmount * tax.percent) : 0,
            lineAmount: lineAmount,
            discountRate: discount ? discount.percent : 0,
            discountAmount: fixedPriceDiscount ? fixedPriceDiscount?.amount : 0,
        })
    })

    // Add invoiced dates as first element in the line items
    lineItems.unshift({
        description: "Invoices dates: " + invoiceDb.invoicedFrom.toISOString() + " - " + invoiceDb.invoicedTo.toISOString(),
    })

    // Add customer notes as last element in the line items
    lineItems.push({
        description: invoiceDb.notesForClient,
    })

    const invoices: Invoices = {
        invoices: [
            {
                type: Invoice.TypeEnum.ACCREC,
                lineItems: lineItems,
                date: invoiceDb.issueDate.toISOString().slice(0, 10),
                dueDate: invoiceDb.dueDate.toISOString().slice(0, 10), // yyyy-mm-dd
                reference: invoiceDb.name,
                status: Invoice.StatusEnum.DRAFT
            }
        ]
    }

    let xero = await getXeroClient(organizationId);

    const createdInvoicesResponse = await xero.accountingApi.createInvoices(await getActiveTenantId(), invoices)

    return createdInvoicesResponse.body.invoices![0];
}

export async function getAccounts(organizationId: string) {
    let xero = await getXeroClient(organizationId);

    const accounts = await xero.accountingApi.getAccounts(await getActiveTenantId());

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

async function getActiveTenantId() {
    let xero = await getXeroClient();

    await xero.updateTenants();
    const activeTenantId = xero.tenants[0].tenantId;

    return activeTenantId;
}