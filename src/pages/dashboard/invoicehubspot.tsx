import { Button, Center, Spinner, Stack } from '@chakra-ui/react';
import { Card, CardBody, EmptyStateActions, EmptyStateBody, EmptyStateContainer, EmptyStateDescription, EmptyStateIcon, EmptyStateTitle, Stepper, StepperStep } from '@saas-ui/react';
import { NextPage } from "next";
import React from 'react';

import { WarningIcon } from '@chakra-ui/icons';
import {
    Page, PageBody
} from '@saas-ui/pro';
import router from 'next/router';
import { trpc } from '../../utils/trpc';
import Companies from '../../components/dashboard/step-by-step/hubspot/companies';
import Tickets from '../../components/dashboard/step-by-step/hubspot/tickets';
import ConfirmInvoice from '../../components/dashboard/step-by-step/shared/confirm';
import InvoiceInformation from '../../components/dashboard/step-by-step/shared/invoice-information';
import { requireAuth } from '../../common/requireAuth';

export const getServerSideProps = requireAuth(async (ctx) => {
    return { props: {} };
});

const InvoiceHubspot: NextPage = () => {
    const [step, setStep] = React.useState(0);

    const { data, isLoading, isRefetching, refetch } = trpc.useQuery(["integrations.getActiveIntegrations"], {
        refetchOnWindowFocus: false
    })

    return (
        <Page title={"Create invoice"}>
            <PageBody pt="8">
                <Stack p="4" width="100%" gap="4">
                    {
                        isLoading || isRefetching || !data
                            ? <Center>
                                <Spinner />
                            </Center>
                            : (
                                !data["HUBSPOT"]
                                    ? <EmptyStateContainer colorScheme="primary">
                                        <EmptyStateBody>
                                            <EmptyStateIcon as={WarningIcon} />

                                            <EmptyStateTitle>Hubspot integration not yet completed</EmptyStateTitle>
                                            <EmptyStateDescription>Do you want to set it up now?</EmptyStateDescription>
                                            <EmptyStateActions>
                                                <Button onClick={() => router.push("/dashboard/integrations")} colorScheme="primary">Set up</Button>
                                                <Button onClick={() => router.back()} variant="outline">Back</Button>
                                            </EmptyStateActions>
                                        </EmptyStateBody>
                                    </EmptyStateContainer>
                                    : <>
                                        <Card>
                                            <CardBody>
                                                <Stepper step={step}>
                                                    <StepperStep title="Pick Company" />
                                                    <StepperStep title="Pick Tickets" />
                                                    <StepperStep title="Invoice Information" />
                                                    <StepperStep title="Confirm" />
                                                </Stepper>
                                            </CardBody>
                                        </Card>
                                        {step == 0 ? <Companies setStep={setStep} /> : null}
                                        {step == 1 ? <Tickets setStep={setStep} /> : null}
                                        {step == 2 ? <InvoiceInformation setStep={setStep} /> : null}
                                        {step == 3 ? <ConfirmInvoice invoiceType='HUBSPOT' setStep={setStep} /> : null}
                                    </>
                            )
                    }
                </Stack>
            </PageBody>
        </Page >
    )
}

export default InvoiceHubspot;