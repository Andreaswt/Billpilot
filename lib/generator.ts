import { ApiKeyProvider, InvoiceTemplateFilterTypes } from "@prisma/client";
import { prisma } from "../src/server/db/client";
import { createInvoiceDraft } from "./integrations/e-conomic";
import { importFilteredJiraTime } from "./integrations/jira";

export async function generateInvoices(dateFrom: Date, dateTo: Date, invoiceIds: string[], organizationId: string) {
    // Find active integrations for organization, so the invoice can be created for the integrations
    const organization = await prisma.organization.findUniqueOrThrow({
        where: {
            id: organizationId
        },
        include: {
            apiKeys: {
                select: {
                    provider: true,
                }
            }
        }
    })

    const jiraIsActive = organization.apiKeys.find(x => x.provider === ApiKeyProvider.JIRA) ? true : false
    const economicIsActive = organization.apiKeys.find(x => x.provider === ApiKeyProvider.ECONOMIC) ? true : false
    const hubspotIsActive = organization.apiKeys.find(x => x.provider === ApiKeyProvider.HUBSPOT) ? true : false

    // Create and bill all invoice templates

    // Templates without time shoulsd not be billed. User is informed about this
    let templatesWithNoTime: string[] = []
    let templateTime: { [templateId: string]: number } = {}

    for (let i = 0; i < invoiceIds.length; i++) {
        const id = invoiceIds[i]

        const template = await prisma.invoiceTemplate.findUniqueOrThrow({
            where: {
                id: id
            },
            include: {
                client: {
                    include: {
                        economicOptions: true
                    }
                },
                filters: true,
                invoiceTemplateFixedPriceTimeItems: true
            }
        })

        // Import time from time filter
        let importedTime = 0

        if (jiraIsActive) {
            const projectFilters = template.filters
                .filter(x => x.type === InvoiceTemplateFilterTypes.JIRAPROJECT)
                .map(x => x.filterId)

            importedTime = await importFilteredJiraTime(projectFilters, dateFrom, dateTo, organizationId)

            if (importedTime === 0) {
                templatesWithNoTime.push(template.id)
                continue
            }
        }

        if (hubspotIsActive) {
            // TODO: import from hubspot
        }

        // Create general invoice from template
        const invoice = await prisma.generalInvoice.create({
            data: {
                title: template.title,
                description: "Created from invoice template: " + template.title,
                currency: template.client.currency,
                roundingScheme: template.client.roundingScheme,
                pricePerHour: template.client.pricePerHour,
                organizationId: organizationId,

                // Add E-conomic options if enabled
                ...(economicIsActive && template.client.economicOptions ? {
                    economicOptions: {
                        create: {
                            customer: template.client.economicOptions?.customer,
                            text1: template.client.economicOptions?.text1,
                            ourReference: template.client.economicOptions?.ourReference,
                            customerContact: template.client.economicOptions?.customerContact,
                            unit: template.client.economicOptions?.unit,
                            layout: template.client.economicOptions?.layout,
                            vatZone: template.client.economicOptions?.vatZone,
                            paymentTerms: template.client.economicOptions?.paymentTerms,
                            product: template.client.economicOptions?.product,
                            organizationId: organizationId,
                        }
                    }
                } : {}),

                invoiceLines: {
                    create: [
                        {
                            title: template.title,
                            hours: importedTime,
                            pricePerHour: template.client.pricePerHour,
                            updatedHoursSpent: 0,
                            discountPercentage: 0,
                            organizationId: organizationId
                        }
                    ]
                }
            }
        })

        // Export to relevant integration
        createInvoiceDraft(invoice.id, organizationId)
    }

    return {
        templatesWithNoTime: templatesWithNoTime,
        templateTime: templateTime
    }
}