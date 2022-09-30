import { Button, Center, Spinner, Stack } from '@chakra-ui/react';
import { Card, CardBody, EmptyStateActions, EmptyStateBody, EmptyStateContainer, EmptyStateDescription, EmptyStateIcon, EmptyStateTitle, Stepper, StepperStep } from '@saas-ui/react';
import { GetServerSideProps, NextPage } from "next";
import React from 'react';
import useCreateInvoiceStore from '../../../store/invoice';
import { requireAuth } from "../../common/requireAuth";

import { WarningIcon } from '@chakra-ui/icons';
import {
    Page, PageBody
} from '@saas-ui/pro';
import router from 'next/router';
import { trpc } from '../../utils/trpc';
import ConfirmInvoiceIssues from '../../components/dashboard/invoice-jira-issues/Confirm';
import EconomicOptions from '../../components/dashboard/invoice-jira-issues/InvoiceOptions';
import Projects from '../../components/dashboard/invoice-jira-issues/Projects';
import Issues from '../../components/dashboard/invoice-jira-issues/Issues';

const InvoiceIssues: NextPage = () => {
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
                                                    <StepperStep title="Pick Project" />
                                                    <StepperStep title="Pick Issues" />
                                                    <StepperStep title="Invoice Information" />
                                                    <StepperStep title="Confirm" />
                                                </Stepper>
                                            </CardBody>
                                        </Card>
                                        {step == 0 ? <Projects setStep={setStep} /> : null}
                                        {step == 1 ? <Issues setStep={setStep} /> : null}
                                        {step == 2 ? <EconomicOptions setStep={setStep} /> : null}
                                        {step == 3 ? <ConfirmInvoiceIssues setStep={setStep} /> : null}
                                    </>
                            )
                    }
                </Stack>
            </PageBody>
        </Page >
    )
}

export default InvoiceIssues;