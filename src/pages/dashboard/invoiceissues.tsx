import { Stack } from '@chakra-ui/react';
import { Stepper, StepperStep } from '@saas-ui/react';
import { NextPage } from "next";
import React from 'react';
import useCreateInvoiceStore from '../../../store/invoice';
import { requireAuth } from "../../common/requireAuth";

import {
    Page, PageBody
} from '@saas-ui/pro';
import { Card, CardBody } from "@saas-ui/react";
import InvoiceInformation from '../../components/dashboard/invoice-issues/InvoiceInformation';
import Projects from '../../components/dashboard/invoice-issues/Projects';
import Issues from '../../components/dashboard/invoice-issues/Issues';
import EconomicOptions from '../../components/dashboard/invoice-issues/EconomicOptions';
import ConfirmInvoiceIssues from '../../components/dashboard/invoice-issues/Confirm';

export const getServerSideProps = requireAuth(async (ctx) => {
    return { props: {} };
});

const InvoiceIssues: NextPage = () => {
    const store = useCreateInvoiceStore();
    const [step, setStep] = React.useState(0);

    return (
        <Page title={"Create invoice"}>
            <PageBody pt="8">
                <Stack p="4" width="100%" gap="4">
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
                </Stack>
            </PageBody>
        </Page >
    )
}

export default InvoiceIssues;