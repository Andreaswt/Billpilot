import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack } from '@chakra-ui/react';
import { NextPage } from "next";
import React from 'react';

import { WarningIcon } from '@chakra-ui/icons';
import {
    Page, PageBody, Section
} from '@saas-ui/pro';
import { Card, CardBody, Divider, EmptyStateBody, EmptyStateContainer, EmptyStateDescription, EmptyStateIcon, EmptyStateTitle, FormLayout } from '@saas-ui/react';
import { requireAuth } from '../../common/requireAuth';
import Client from '../../components/dashboard/stat-report/client';
import { trpc } from '../../utils/trpc';
import moment from 'moment';

export const getServerSideProps = requireAuth(async (ctx) => {
    return { props: {} };
});

const Workbooks: NextPage = () => {
    const [step, setStep] = React.useState(0);

    var date = new Date();
    var firstDayInMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDayInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const [invoicedDatesFrom, setInvoicedDatesFrom] = React.useState(moment(firstDayInMonth).format("YYYY-MM-DD"));
    const [invoicedDatesTo, setInvoicedDatesTo] = React.useState(moment(lastDayInMonth).format("YYYY-MM-DD"));

    const { data, isLoading, mutateAsync } = trpc.useMutation(["workbooks.test"])

    return (
        <Page title={"Workbooks"}>
            <PageBody pt="8">
                <Stack p="4" width="100%" gap="4">
                    <Stack gap={10}>
                        <Card>
                            <CardBody>
                                <Section
                                    title="Report Dates"
                                    description="The report will include data between the chosen dates."
                                    variant="annotated">
                                    <Card>
                                        <CardBody>
                                            <FormLayout columns={2}>
                                                <FormControl isInvalid={false}>
                                                    <FormLabel htmlFor={`invoicedDatesFrom`}>Invoiced Dates From and Including</FormLabel>
                                                    <Flex flexDirection="column">
                                                        <Input
                                                            id='invoicedDatesFrom'
                                                            type="date"
                                                            variant="filled"
                                                            value={invoicedDatesFrom}
                                                            onChange={(e) => setInvoicedDatesFrom(e.target.value)}
                                                        />
                                                        <FormErrorMessage>
                                                            Hej
                                                        </FormErrorMessage>
                                                    </Flex>
                                                </FormControl>
                                                <FormControl isInvalid={false}>
                                                    <FormLabel htmlFor={`invoicedDatesTo`}>Invoiced Dates To and Including</FormLabel>
                                                    <Flex flexDirection="column">
                                                        <Input
                                                            id='invoicedDatesTo'
                                                            type="date"
                                                            variant="filled"
                                                            value={invoicedDatesTo}
                                                            onChange={(e) => setInvoicedDatesTo(e.target.value)}
                                                        />
                                                        <FormErrorMessage>
                                                            Hej
                                                        </FormErrorMessage>
                                                    </Flex>
                                                </FormControl>
                                            </FormLayout>
                                        </CardBody>
                                    </Card>
                                </Section>
                            </CardBody>
                        </Card>

                        <Stack gap={4}>
                            <Flex justifyContent="space-between">
                                <Heading>Report</Heading>
                                <Button isLoading={isLoading} onClick={async () => await mutateAsync({ invoicedDatesFrom: new Date(invoicedDatesFrom), invoicedDatesTo: new Date(invoicedDatesTo) })} colorScheme="primary">Generate report</Button>
                            </Flex>
                            <Divider />
                        </Stack>

                        {
                            !data
                                ? <EmptyStateContainer colorScheme="primary">
                                    <EmptyStateBody>
                                        <EmptyStateIcon as={WarningIcon} />
                                        <EmptyStateTitle>No report generated.</EmptyStateTitle>
                                        <EmptyStateDescription>Do you want to create one now?</EmptyStateDescription>
                                    </EmptyStateBody>
                                </EmptyStateContainer>
                                : <Stack gap={4}>
                                    <Heading size="md">Clients</Heading>
                                    {
                                        data?.clients.map((client, index) => {
                                            return (<Client key={index} {...client} />)
                                        })
                                    }
                                </Stack>
                        }

                    </Stack>
                </Stack>
            </PageBody>
        </Page >
    )
}

export default Workbooks;