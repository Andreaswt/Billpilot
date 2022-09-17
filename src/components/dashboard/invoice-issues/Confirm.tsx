import { Button, Flex, Heading, StackDivider, Tooltip, VStack, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect } from 'react';

import { Card, CardBody, Column, Property, PropertyList, useSnackbar } from "@saas-ui/react";

import { ColumnDef, DataGrid, DataGridPagination, Section } from '@saas-ui/pro';
import moment from 'moment';
import { PickedIssue } from '../../../../store/invoice';
import useInvoiceIssuesStore from '../../../../store/invoiceIssues';
import { trpc } from '../../../utils/trpc';
import router from 'next/router';

interface IProps {
    setStep: Dispatch<SetStateAction<number>>
}

const columns: ColumnDef<PickedIssue>[] = [
    {
        id: 'key',
        header: 'Key',
    },
    {
        id: 'id',
        header: 'Id',
    },
    {
        id: 'name',
        header: 'Name',
        cell: (data) => (
            <Flex>
                <Tooltip label={data.row.original.name}>
                    <Text>{data.row.original.name}</Text>
                </Tooltip>
            </Flex>
        )
    },
    {
        id: 'hoursSpent',
        header: 'Hours Spent',
    },
    {
        id: 'updatedHoursSpent',
        header: 'Updated Hours Spent',
    },
    {
        id: 'discountPercentage',
        header: 'Percentage Discount',
    },
]

const ConfirmInvoiceIssues = (props: IProps) => {
    const { setStep } = props
    const store = useInvoiceIssuesStore();
    const createIssueInvoice = trpc.useMutation('invoices.createIssueInvoice', {
        onSuccess: () => {
            // router.push("/dashboard")
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
        const pickedIssues = store.pickedIssues.map(item =>  ({ 
            jiraKey: item.key, 
            jiraId: item.id, 
            name: item.name,
            hoursSpent: item.hoursSpent, 
            updatedHoursSpent: item.updatedHoursSpent ?? 0,
            discountPercentage: item.discountPercentage ?? 0 }))

        createIssueInvoice.mutate({
            invoiceInformation: {
                currency: store.currency,
                roundingScheme: store.roundingScheme,
                title: store.title,
                dueDate: store.dueDate.toString()
            },
            pickedIssues: pickedIssues,
            economicOptions: { ...store.economicOptions }
        })
    }
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
                                    <Property label="Price" value="€1250,-" />
                                </PropertyList>
                            </CardBody>
                        </Card>
                    </Section>
                    <Section
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
                                </PropertyList>
                            </CardBody>
                        </Card>
                    </Section>
                    <Section
                        title="Issues"
                        description="Confirm your picked issues."
                        variant="annotated">
                        <Card>
                            <CardBody>
                            <DataGrid<PickedIssue> columns={columns} data={store.pickedIssues} isSortable isHoverable>
                                <DataGridPagination mt={2} pl={0} />
                            </DataGrid>
                            </CardBody>
                        </Card>
                    </Section>
                </VStack>
                <Flex justifyContent="space-between">
                    <Button mt={6} colorScheme="primary" onClick={() => setStep((step) => step - 1)}>Previous</Button>
                    <Button isLoading={createIssueInvoice.isLoading} mt={6} colorScheme="primary" onClick={submitInvoice}>Submit Invoice</Button>
                </Flex>
            </CardBody>
        </Card >
    )
}

export default ConfirmInvoiceIssues;