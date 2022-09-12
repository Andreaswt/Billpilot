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
                                <StepperStep title="Invoice Information" />
                                <StepperStep title="Time Items" />
                                <StepperStep title="Fixed Price Time Items" />
                                <StepperStep title="Discounts & Taxes" />
                            </Stepper>
                        </CardBody>
                    </Card>
                    {step == 0 ? <InvoiceInformation /> : null}
                    {step == 1 ? <InvoiceInformation /> : null}
                    {step == 2 ? <InvoiceInformation /> : null}
                    {step == 3 ? <InvoiceInformation /> : null}
                </Stack>
            </PageBody>
        </Page >
    )
}

export default InvoiceIssues;