import { Button, Flex, Heading, StackDivider, VStack } from '@chakra-ui/react';
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
                duration: 2000,
                isClosable: true,
            })
        }
    });
    const snackbar = useSnackbar()

    function submitInvoice() {
        const pickedTickets = store.pickedTickets.map(item => ({
            id: item.id,
            subject: item.subject,
            content: item.content,
            lastModified: item.lastModified,
            updatedHoursSpent: item.updatedHoursSpent ?? 0,
            discountPercentage: item.discountPercentage ?? 0
        }))

        createTicketInvoice.mutate({
            invoiceInformation: {
                currency: store.currency,
                roundingScheme: store.roundingScheme,
                title: store.title,
                description: store.description,
                dueDate: store.dueDate.toString()
            },
            pickedTickets: pickedTickets,
            economicOptions: { ...store.economicOptions }
        })
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
                                            <Property label="Customer Price" value={store.economicOptions.customerPrice} />
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