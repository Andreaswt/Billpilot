import { Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Divider } from '@saas-ui/react';
import { NextPage } from "next";
import { requireAuth } from "../../common/requireAuth";

import {
    ArrayFieldAddButton, ArrayFieldContainer, ArrayFieldRemoveButton, ArrayFieldRowContainer,
    ArrayFieldRowFields, ArrayFieldRows, SubmitButton
} from '@saas-ui/react';
import * as Yup from 'yup';

import {
    Page, PageBody
} from '@saas-ui/pro';
import { Card, CardBody, Field, Form, FormLayout } from "@saas-ui/react";
import EconomicOptions from "../../components/dashboard/create-invoice/economic-options";
import JiraTimeFilter from "../../components/dashboard/create-invoice/jira-time-filter";
import { TimeItemsTable } from '../../components/dashboard/create-invoice/collapseable-table';

export const getServerSideProps = requireAuth(async (ctx) => {
    return { props: {} };
});

const timeItemSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    time: Yup.number().required().min(0).label('Time'),
    rate: Yup.number().required().min(0).label('Rate'),
})

const timeItemsSchema = Yup.object().shape({
    timeItems: Yup.array().min(1).of(timeItemSchema),
})

const CreateInvoice: NextPage = () => {
    const organization = "Dashboard";
    let isLoading = false;

    return (
        <Page title={"Create invoice"} isLoading={isLoading}>
            <PageBody pt="8">
                <Stack p="4" width="100%" gap="4">
                    <Card title="Create Invoice">
                        <CardBody>
                            <Form onSubmit={function (data) {
                                console.log(data)
                            }}>
                                <FormLayout>
                                    <FormLayout>
                                        <Field name="title" label="Title" />
                                    </FormLayout>
                                    <FormLayout columns={3}>
                                        <Field name="status"
                                            options={[{ value: 'Draft' }, { value: 'No Charge' }]}
                                            type="select"
                                            label="Status" />
                                        <Field name="invoiceNumber" label="Invoice Number" />
                                        <Field name="currency"
                                            options={[{ value: 'USD' }, { value: 'EUR' }, { value: 'DKK' }]}
                                            type="select"
                                            label="Currency" />
                                    </FormLayout>
                                    <FormLayout columns={3}>
                                        <FormLayout columns={2}>
                                            <Field type="datetime-local" name="invoicedDatesFrom" label="Invoiced from" />
                                            <Field type="datetime-local" name="invoicedDatesTo" label="Invoiced to" />
                                        </FormLayout>
                                        <Field type="datetime-local" name="issueDate" label="Issue Date" />
                                        <Field type="datetime-local" name="dueDate" label="Due Date" />
                                    </FormLayout>
                                    <FormLayout columns={3}>
                                        <Field name="roundingScheme"
                                            options={[{ value: 'Værdi 1' }, { value: 'Værdi 2' }]}
                                            type="select"
                                            label="Rounding Scheme" />
                                        <Field name="client"
                                            options={[{ value: 'Client 1' }, { value: 'Client 2' }]}
                                            type="select"
                                            label="Client" />
                                        <Field name="invoiceLayout"
                                            options={[{ value: 'Layout 1' }, { value: 'Layout 2' }]}
                                            type="select"
                                            label="Invoice Layout for Clients" />
                                    </FormLayout>
                                    <FormLayout>
                                        <Field type="textarea" name="notesForClient" label="Notes for Client" />
                                    </FormLayout>
                                </FormLayout>
                                <SubmitButton mt={6} label="Save" />
                            </Form>
                        </CardBody>
                    </Card>

                    <Card title="Time">
                        <CardBody>
                            <Form
                                defaultValues={{
                                    timeItems: [
                                        {
                                        },
                                    ],
                                }}
                                resolver={yupResolver(timeItemsSchema)}
                                onSubmit={() => Promise.resolve()}>
                                <ArrayFieldContainer
                                    name="timeItems"
                                    // label="Time Items"
                                    defaultValue={{}}
                                    keyName="key">
                                    <ArrayFieldRows>
                                        {(fields) => (
                                            <>
                                                {fields.map((field, i) => {
                                                    return (
                                                        <ArrayFieldRowContainer key={field.id} index={i}>
                                                            <ArrayFieldRowFields columns={3} spacing={1}>
                                                                <Field label="Name" name="name" placeholder="Enter Time Item Name" />
                                                                <Field label="Time" type="number" name="time" />
                                                                <Field label="Rate" type="number" name="rate" />
                                                            </ArrayFieldRowFields>
                                                            <ArrayFieldRemoveButton />
                                                        </ArrayFieldRowContainer>
                                                    )
                                                })}
                                            </>
                                        )}
                                    </ArrayFieldRows>
                                    <ArrayFieldAddButton />
                                </ArrayFieldContainer>

                                <Divider mb={6} label="Add time from Jira" />
                                <SubmitButton mr={4} label="Save" />
                                <TimeItemsTable />
                            </Form>
                        </CardBody>
                    </Card>

                    <Card title="Fixed Price">
                        <CardBody>

                        </CardBody>
                    </Card>

                    <Card title="Taxes and Discount">
                        <CardBody>

                        </CardBody>
                    </Card>

                    <EconomicOptions />
                </Stack>
            </PageBody>
        </Page >
    )
}

export default CreateInvoice;