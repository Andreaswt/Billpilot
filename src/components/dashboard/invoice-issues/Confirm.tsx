import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Textarea, Text, Box, Progress, SimpleGrid } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

import { Card, CardBody, Column, DataTable, Divider, FormLayout, Property, PropertyList } from "@saas-ui/react";

import moment from 'moment';
import { useForm } from 'react-hook-form';
import useCreateInvoiceStore from '../../../../store/invoice';
import { PickedIssue } from '../../../../store/invoice';
import { trpc } from '../../../utils/trpc';

interface IProps {
    setStep: Dispatch<SetStateAction<number>>
}

interface TableIssue {
    key: string
    id: string
    name: string
    hoursSpent: number
    updatedHoursSpent: number
    percentageDiscount: number
}

const columns: Column<PickedIssue>[] = [
    {
        accessor: 'key',
        Header: 'Key',
    },
    {
        accessor: 'id',
        Header: 'Id',
    },
    {
        accessor: 'name',
        Header: 'Name',
    },
    {
        accessor: 'hoursSpent',
        Header: 'Time Spent',
    },
    {
        accessor: 'updatedHoursSpent',
        Header: 'Updated Hours Spent',
    },
    {
        accessor: 'discountPercentage',
        Header: 'Percentage Discount',
    },
]

const ConfirmInvoiceIssues = (props: IProps) => {
    const { setStep } = props
    const store = useCreateInvoiceStore();

    const utils = trpc.useContext();
    const createIssueInvoice = trpc.useMutation('invoices.createIssueInvoice', {
    });

    function submitInvoice() {

    }

    return (
        <Card title={
            <Flex>
                <Heading>Confirm Selections</Heading>
            </Flex>}>
            <CardBody>
                <Flex gap={6} flexDirection="column">
                    <Flex gap={4} flexDir="column">
                        <Heading textColor="primary.100" size="md">Invoice Information</Heading>
                        <SimpleGrid spacing={5}>
                            <SimpleGrid columns={4}>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Title</Text>
                                    <Text>{store.title == "" ? <Text as="i">Not set</Text> : store.title}</Text>
                                </Flex>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Status</Text>
                                    <Text>{store.status == "" ? <Text as="i">Not set</Text> : store.status}</Text>
                                </Flex>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Invoice Number</Text>
                                    <Text>{store.invoiceNumber == "" ? <Text as="i">Not set</Text> : store.invoiceNumber}</Text>
                                </Flex>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Currency</Text>
                                    <Text>{store.currency == "" ? <Text as="i">Not set</Text> : store.currency}</Text>
                                </Flex>
                            </SimpleGrid>
                            <SimpleGrid columns={4}>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Invoice From</Text>
                                    <Text>{moment(store.invoicedDatesFrom).format("YYYY-MM-DD")}</Text>
                                </Flex>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Invoice To</Text>
                                    <Text>{moment(store.invoicedDatesTo).format("YYYY-MM-DD")}</Text>
                                </Flex>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Issue Date</Text>
                                    <Text>{moment(store.issueDate).format("YYYY-MM-DD")}</Text>
                                </Flex>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Due Date</Text>
                                    <Text>{moment(store.dueDate).format("YYYY-MM-DD")}</Text>
                                </Flex>
                            </SimpleGrid>
                            <SimpleGrid columns={4}>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Rounding Scheme</Text>
                                    <Text>{store.roundingScheme == "" ? <Text as="i">Not set</Text> : store.roundingScheme}</Text>
                                </Flex>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Client</Text>
                                    <Text>{store.client == "" ? <Text as="i">Not set</Text> : store.client}</Text>
                                </Flex>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Invoice Layout</Text>
                                    <Text>{store.invoiceLayout == "" ? <Text as="i">Not set</Text> : store.invoiceLayout}</Text>
                                </Flex>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Notes for Client</Text>
                                    <Text>{store.notesForClient == "" ? <Text as="i">Not set</Text> : store.notesForClient}</Text>
                                </Flex>
                            </SimpleGrid>
                        </SimpleGrid>
                    </Flex>
                    <Divider />
                    <Flex gap={4} flexDir="column">
                        <Heading textColor="primary.100" size="md">E-conomic</Heading>
                        <SimpleGrid spacing={5}>
                            <SimpleGrid columns={4}>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Text 1</Text>
                                    <Text>{store.text1 === "" ? <Text as="i">Not set</Text> : store.text1}</Text>
                                </Flex>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Our Reference</Text>
                                    <Text>{store.ourReference === "" ? <Text as="i">Not set</Text> : store.ourReference}</Text>
                                </Flex>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Customer Contact</Text>
                                    <Text>{store.customerContact === "" ? <Text as="i">Not set</Text> : store.customerContact}</Text>
                                </Flex>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Customer</Text>
                                    <Text>{store.customer === "" ? <Text as="i">Not set</Text> : store.customer}</Text>
                                </Flex>
                            </SimpleGrid>
                            <SimpleGrid columns={4}>
                                <Flex flexDirection="column">
                                    <Text fontSize="md" as="b">Customer Price</Text>
                                    <Text>{!store.customerPrice ? <Text as="i">Not set</Text> : store.customerPrice}</Text>
                                </Flex>
                            </SimpleGrid>
                        </SimpleGrid>
                    </Flex>
                    <Divider />
                    <Flex flexDir="column">
                        <Heading textColor="primary.100" size="md">Picked Issues</Heading>
                        <Box overflowX="auto">
                            <DataTable columns={columns} data={store.pickedIssues} />
                        </Box>
                    </Flex>
                </Flex>
                <Flex gap={4} justifyContent="space-between">
                    <Button mt={6} colorScheme="primary" onClick={() => setStep((step) => step - 1)}>Previous</Button>
                    <Button mt={6} colorScheme="primary" onClick={submitInvoice}>Submit Invoice</Button>
                </Flex>
            </CardBody>
        </Card >
    )
}

export default ConfirmInvoiceIssues;