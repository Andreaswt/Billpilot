import { Stack, Text, Heading, Wrap, Flex } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Divider, useArrayFieldContext } from '@saas-ui/react';
import { NextPage } from "next";
import { requireAuth } from "../../common/requireAuth";
import React, { useRef } from 'react'

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

// Time items
const timeItemSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    time: Yup.number().required().min(0).label('Time'),
    rate: Yup.number().required().min(0).label('Rate'),
})

const timeItemsSchema = Yup.object().shape({
    timeItems: Yup.array().min(1).of(timeItemSchema),
})

// Time items
const fixedPriceTimeItemSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    amount: Yup.number().required().min(0).label('Amount'),
})

const fixedPriceTimeItemsSchema = Yup.object().shape({
    fixedPriceTimeItems: Yup.array().of(fixedPriceTimeItemSchema),
})

// Taxes
const taxItemSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    percentage: Yup.number().required().min(0).label('Percentage'),
})

const taxesSchema = Yup.object().shape({
    taxItems: Yup.array().of(taxItemSchema),
})

// Percent discounts
const discountItemSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    percentage: Yup.number().required().min(0).label('Percentage'),
})

const discountsSchema = Yup.object().shape({
    discountItems: Yup.array().of(discountItemSchema),
})

// Fixed discounts
const fixedDiscountItemSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    percentage: Yup.number().required().min(0).label('Amount'),
})

const fixedDiscountsSchema = Yup.object().shape({
    fixedDiscountItems: Yup.array().of(fixedDiscountItemSchema),
})


interface ICheckedItems {
    project: string[]
    issue: string[]
    employee: string[]
}

const CreateInvoice: NextPage = () => {
    const ref: any = React.useRef(null)
    const [disabledTimeItemIndexes, setDisabledTimeItemIndexes] = React.useState(new Set<number>())

    function jiraTimeImported(timeItemIndex: number, hours: number) {
        if (ref.current) {
            // TODO: why doesn't update work?
            let field = ref.current.fields[timeItemIndex]
            ref.current.update(0, {name: "hej", time: 5, rate: 5})

            if (hours > 0) {
                setDisabledTimeItemIndexes(prev => new Set(prev.add(timeItemIndex)))
            }
        }
    }

    return (
        <Page title={"Create invoice"}>
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
                                    ref={ref}
                                    name="timeItems"
                                    defaultValue={{}}
                                    keyName="key">
                                    <ArrayFieldRows>
                                        {(fields) => (
                                            <>
                                                {fields.map((field, i) => {
                                                    return (
                                                        <>
                                                        <ArrayFieldRowContainer key={field.id} index={i}>
                                                            <ArrayFieldRowFields columns={3} spacing={10}>
                                                                <Field label="Name" name="name" placeholder="Enter Time Item Name" />
                                                                <Field isDisabled={disabledTimeItemIndexes.has(i)} label="Time" type="number" name="time" />
                                                                <Field label="Rate" type="number" name="rate" />
                                                            </ArrayFieldRowFields>
                                                            <ArrayFieldRemoveButton />
                                                        </ArrayFieldRowContainer>
                                                        <TimeItemsTable timeItemIndex={i} jiraTimeImported={jiraTimeImported} />
                                                        <Divider my={4} />
                                                        </>
                                                    )
                                                })}
                                            </>
                                        )}
                                    </ArrayFieldRows>
                                    <ArrayFieldAddButton />
                                </ArrayFieldContainer>
{/* 
                                <Divider label="Or add time from Jira" />
                                <TimeItemsTable /> */}
                                <SubmitButton label="Save" />
                            </Form>
                            <Flex mt={6} gap={10} justifyContent="end">
                            <Heading size="sm">Subtotal</Heading>
                            <Heading size="sm">10 Hours</Heading>
                            <Heading size="sm">350 USD</Heading>
                            </Flex>
                        </CardBody>
                    </Card>

                    <Card title="Fixed Price">
                        <CardBody>
                        <Form
                                resolver={yupResolver(fixedPriceTimeItemsSchema)}
                                onSubmit={() => Promise.resolve()}>
                                <ArrayFieldContainer
                                    ref={ref}
                                    name="fixedPriceTimeItems"
                                    defaultValue={{}}
                                    keyName="key">
                                    <ArrayFieldRows>
                                        {(fields) => (
                                            <>
                                                {fields.map((field, i) => {
                                                    return (
                                                        <>
                                                        <ArrayFieldRowContainer key={field.id} index={i}>
                                                            <ArrayFieldRowFields columns={2} spacing={10}>
                                                                <Field label="Name" name="name" placeholder="Enter Fixed Price Time Item Name" />
                                                                <Field label="Amount" type="number" name="amount" />
                                                            </ArrayFieldRowFields>
                                                            <ArrayFieldRemoveButton />
                                                        </ArrayFieldRowContainer>
                                                        <Divider mt={8} mb={4} />
                                                        </>
                                                    )
                                                })}
                                            </>
                                        )}
                                    </ArrayFieldRows>
                                    <ArrayFieldAddButton />
                                </ArrayFieldContainer>
                                <SubmitButton label="Save" />
                            </Form>
                        </CardBody>
                    </Card>

                    <Card title="Taxes">
                        <CardBody>
                        <Form
                                resolver={yupResolver(taxesSchema)}
                                onSubmit={() => Promise.resolve()}>
                                <ArrayFieldContainer
                                    ref={ref}
                                    name="taxItems"
                                    defaultValue={{}}
                                    keyName="key">
                                    <ArrayFieldRows>
                                        {(fields) => (
                                            <>
                                                {fields.map((field, i) => {
                                                    return (
                                                        <>
                                                        <ArrayFieldRowContainer key={field.id} index={i}>
                                                            <ArrayFieldRowFields columns={3} spacing={10}>
                                                                <Field label="Name" name="name" placeholder="Enter Tax Name" />
                                                                <Field label="Percentage" type="number" defaultValue={0} name="percentage" />
                                                                <Field label="Amount" isDisabled={true} defaultValue="0 USD" type="text" name="amount" />
                                                            </ArrayFieldRowFields>
                                                            <ArrayFieldRemoveButton />
                                                        </ArrayFieldRowContainer>
                                                        <Wrap spacing={4} mb={6}>
                                                            <Heading size='sm'>
                                                                Apply to Time Items
                                                            </Heading>
                                                            <Field
                                                                type="switch"
                                                                name="applies"
                                                                // label="Time Item 1"
                                                                help={"Monthly billing"}
                                                            />
                                                        </Wrap>
                                                        <Wrap spacing={4} mb={6}>
                                                            <Heading size='sm'>
                                                                Apply to Fixed Price Time Items
                                                            </Heading>
                                                            <Field
                                                                type="switch"
                                                                name="applies"
                                                                // label="Time Item 1"
                                                                help={"Monthly billing"}
                                                            />
                                                        </Wrap>
                                                        <Divider mt={8} mb={4} />
                                                        </>
                                                    )
                                                })}
                                            </>
                                        )}
                                    </ArrayFieldRows>
                                    <ArrayFieldAddButton />
                                </ArrayFieldContainer>
                                <SubmitButton label="Save" />
                            </Form>
                        </CardBody>
                    </Card>

                    <EconomicOptions />
                </Stack>
            </PageBody>
        </Page >
    )
}

export default CreateInvoice;