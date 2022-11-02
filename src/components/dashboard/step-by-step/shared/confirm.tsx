import { Button, Flex, Heading, StackDivider, VStack, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

import { Card, CardBody, Property, PropertyList, useSnackbar } from "@saas-ui/react";

import { Section } from '@saas-ui/pro';
import moment from 'moment';
import router from 'next/router';
import useInvoiceStore from '../../../../../store/invoiceStore';
import { trpc } from '../../../../utils/trpc';
import { PickedJiraItems } from '../jira-issues/picked-jira-items';
import { PickedHubspotItems } from '../hubspot/picked-hubspot-items';

interface IProps {
    setStep: Dispatch<SetStateAction<number>>
    invoiceType: "HUBSPOT" | "JIRA"
}

const ConfirmInvoice = (props: IProps) => {
    const { setStep, invoiceType } = props
    const store = useInvoiceStore();
    const createTicketInvoice = trpc.useMutation('invoices.createHubspotTicketInvoice', {
        onSuccess: () => {
            router.push("/dashboard")
        },
        onError: () => {
            snackbar({
                title: 'Invoice could not be created',
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }
    });

    const createIssueInvoice = trpc.useMutation('invoices.createIssueInvoice', {
        onSuccess: () => {
            router.push("/dashboard")
        },
        onError: () => {
            snackbar({
                title: 'Invoice could not be created',
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }
    });

    const snackbar = useSnackbar()

    function submitInvoice() {
        const invoiceInformation = {
            invoiceInformation: {
                currency: store.currency,
                roundingScheme: store.roundingScheme,
                pricePerHour: store.pricePerHour,
                title: store.title,
                description: store.description,
                dueDate: store.dueDate.toString()
            },
        }

        if (invoiceType === "HUBSPOT") {
            const pickedTickets = store.pickedTickets.map(item => ({
                id: item.id,
                subject: item.subject,
                content: item.content,
                lastModified: item.lastModified,
                updatedHoursSpent: item.updatedHoursSpent ?? 0,
                discountPercentage: item.discountPercentage ?? 0
            }))
            createTicketInvoice.mutate({
                ...invoiceInformation,
                pickedTickets: pickedTickets,
                economicOptions: { ...store.economicOptions }
            })
        }
        else if (invoiceType === "JIRA") {
            const pickedIssues = store.pickedIssues.map(item => ({
                jiraKey: item.key,
                jiraId: item.id,
                name: item.name,
                hoursSpent: item.hoursSpent,
                updatedHoursSpent: item.updatedHoursSpent ?? 0,
                discountPercentage: item.discountPercentage ?? 0
            }))
    
            createIssueInvoice.mutate({
                ...invoiceInformation,
                pickedIssues: pickedIssues,
                economicOptions: { ...store.economicOptions }
            })
        }
    }

    const { data } = trpc.useQuery(["invoices.getInvoiceOptions"], {
        refetchOnWindowFocus: false
    });

    return (
        <Card title={
            <Flex>
                <Heading>Confirm Selections</Heading>
            </Flex>}>
            <CardBody>
                <VStack divider={<StackDivider />} align="stretch" spacing={8} pb="16">
                    <Section
                        title="Invoice"
                        description="Confirm your selections regarding the general invoice."
                        variant="annotated">
                        <Card>
                            <CardBody>
                                <PropertyList>
                                    <Property label="Title" value={store.title} />
                                    <Property label="Description">
                                        <Text width="50%" overflowWrap="break-word">{store.description}</Text>
                                    </Property>
                                    <Property label="Currency" value={store.currency} />
                                    <Property label="Due Date" value={moment(store.dueDate).format("YYYY-MM-DD")} />
                                    <Property label="Rounding Scheme" value={store.roundingScheme} />
                                </PropertyList>
                            </CardBody>
                        </Card>
                    </Section>
                    {
                        data?.activeIntegrations["ECONOMIC"] && store.economicOptions.exportToEconomic
                            ? <Section
                                title="E-conomic"
                                description="Confirm your selections regarding export to e-conomic."
                                variant="annotated">
                                <Card>
                                    <CardBody>
                                        <PropertyList>
                                            <Property label="Customer" value={store.economicOptions.customerName} />
                                            <Property label="Customer Price" value={store.pricePerHour} />
                                            <Property label="Text 1" value={store.economicOptions.text1} />
                                            <Property label="Our Reference" value={store.economicOptions.ourReferenceName} />
                                            <Property label="Customer Contact" value={store.economicOptions.customerContactName} />
                                            <Property label="Unit" value={store.economicOptions.unitName} />
                                            <Property label="Layout" value={store.economicOptions.layoutName} />
                                            <Property label="Vat Zone" value={store.economicOptions.vatZoneName} />
                                            <Property label="Payment Terms" value={store.economicOptions.paymentTermsName} />
                                            <Property label="Product" value={store.economicOptions.productName} />
                                        </PropertyList>
                                    </CardBody>
                                </Card>
                            </Section>
                            : null
                    }
                    {invoiceType === "JIRA" ? <PickedJiraItems /> : null}
                    {invoiceType === "HUBSPOT" ? <PickedHubspotItems /> : null}
                </VStack>
                <Flex justifyContent="space-between">
                    <Button mt={6} colorScheme="primary" onClick={() => setStep((step) => step - 1)}>Previous</Button>
                    <Button isLoading={createTicketInvoice.isLoading} mt={6} colorScheme="primary" onClick={submitInvoice}>Submit Invoice</Button>
                </Flex>
            </CardBody>
        </Card >
    )
}

export default ConfirmInvoice;