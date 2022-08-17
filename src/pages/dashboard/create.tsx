import { Collapse, Flex, Heading, IconButton, Spacer, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Divider, Stepper, StepperStep, useCollapse } from '@saas-ui/react';
import { NextPage } from "next";
import React, { useEffect, useCallback, useState } from 'react';
import useCreateInvoiceStore, { FixedPriceTimeItemsState, InvoiceState, TaxesState, TimeItemsState } from '../../../store/invoice';
import { requireAuth } from "../../common/requireAuth";
import { fixedPriceTimeItemsSchema, invoiceSchema, taxesSchema, timeItemsSchema } from '../../common/validation/createInvoice';

import {
    ArrayFieldAddButton, ArrayFieldContainer, ArrayFieldRemoveButton, ArrayFieldRowContainer,
    ArrayFieldRowFields, ArrayFieldRows, SubmitButton
} from '@saas-ui/react';

import {
    Page, PageBody
} from '@saas-ui/pro';
import { Card, CardBody, Field, Form, FormLayout } from "@saas-ui/react";
import { TimeItemsTable } from '../../components/dashboard/create-invoice/collapseable-table';

import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import useJiraItemsStore, { CheckedTimeItems } from '../../../store/jiraItems';

export const getServerSideProps = requireAuth(async (ctx) => {
    return { props: {} };
});

const CreateInvoice: NextPage = () => {
    const store = useCreateInvoiceStore();
    const jiraItemsStore = useJiraItemsStore();
    const [step, setStep] = React.useState(0);
    const [invoiceSaved, setInvoiceSaved] = React.useState(false);
    const [timeItemsSaved, setTimeItemsSaved] = React.useState(false);
    const [fixedTimeItemsSaved, setFixedTimeItemsSaved] = React.useState(false);
    const [taxesSaved, setTaxesSaved] = React.useState(false);
    const [economicSaved, setEconomicSaved] = React.useState(false);

    const timeItemsRef: any = React.useRef(null)
    const [disabledTimeItemIndexes, setDisabledTimeItemIndexes] = React.useState(new Set<number>())

    function jiraTimeImported(timeItemIndex: number, importedHoursTotal: number, checkedItems: CheckedTimeItems) {
        // Add checked items to store
        jiraItemsStore.setJiraTable(timeItemIndex, checkedItems, importedHoursTotal);

        if (timeItemsRef.current) {
            // TODO: why doesn't update work?
            let field = timeItemsRef.current.fields[timeItemIndex]
            timeItemsRef.current.update(0, { name: "hej", time: 5, rate: 5 })

            if (importedHoursTotal > 0) {
                setDisabledTimeItemIndexes(prev => new Set(prev.add(timeItemIndex)))
            }
        }
    }

    // Total time in time items
    const [totalTimeItemsTime, setTotalTimeItemsTime] = React.useState(0);
    const [totalFixedPriceTimeItemsTime, setTotalFixedPriceTimeItemsTime] = React.useState(0);

    function updateTotal() {
        console.log(timeItemsRef.current)
    }


    // Collapseable cards
    const { isOpen: invoiceOpen, onToggle: invoiceToggle, getCollapseProps: invoiceCollapseProps } = useCollapse({ defaultIsOpen: true })
    const { isOpen: timeItemsOpen, onToggle: timeItemsToggle, getCollapseProps: timeItemsCollapseProps } = useCollapse()
    const { isOpen: fixedPriceTimeItemsOpen, onToggle: fixedPriceTimeItemsToggle, getCollapseProps: fixedPriceTimeItemsCollapseProps } = useCollapse()
    const { isOpen: taxesOpen, onToggle: taxesToggle, getCollapseProps: taxesCollapseProps } = useCollapse()
    const { isOpen: economicOpen, onToggle: economicToggle, getCollapseProps: economicCollapseProps } = useCollapse()

    // Keep track of which forms are changed
    const [invoiceChanged, setInvoiceChanged] = React.useState(false);
    const [timeItemsChanged, setTimeItemsChanged] = React.useState(false);
    const [fixedPriceTimeItemsChanged, setFixedPriceTimeItemsChanged] = React.useState(false);
    const [taxesChanged, setTaxesChanged] = React.useState(false);

    // Submit to store
    // Some forms like InvoiceState from the store is identical to the form, so is can be used directly
    function submitInvoice(fields: InvoiceState) {
        store.setInvoice({ ...fields })
        setInvoiceSaved(true)
        invoiceToggle()
        setInvoiceChanged(false)
    }

    type TimeItemsForm = {
        timeItems: {
            name: string,
            time: number,
            rate: number,
        }[],
    }

    function submitTimeItems(fields: TimeItemsForm) {
        // TimeItemsState also contains imported projects, issues and employees from Jira, which is stored in state, and not submitted via the form
        const timeItemsState: TimeItemsState = { timeItems: [] };

        fields.timeItems.map((timeItem, i) => {
            timeItemsState.timeItems.push({
                name: timeItem.name,
                time: timeItem.time,
                rate: timeItem.rate,

                // Since the the jira items is stored according to the index, the items are assumed to belong to the index if the current iteation as well
                jiraProjects: jiraItemsStore.jiraTables[i].timeItems.project,
                jiraIssues: jiraItemsStore.jiraTables[i].timeItems.issue,
                jiraEmployees: jiraItemsStore.jiraTables[i].timeItems.employee
            })
        })

        store.setTimeItems({ ...timeItemsState })
        setTimeItemsSaved(true)
        timeItemsToggle()
    }

    type FixedPriceTimeItemsForm = {
        timeItems: {
            name: string,
            amount: number,
        }[],
    }

    function submitFixedPriceTimeItems(fields: FixedPriceTimeItemsForm) {
        const fixePriceTimeItemsState: FixedPriceTimeItemsState = { fixedPriceTimeItems: [] };

        fields.timeItems.map(timeItem => {
            fixePriceTimeItemsState.fixedPriceTimeItems.push({
                name: timeItem.name,
                amount: timeItem.amount,
            })
        })

        store.setFixedPriceTimeItems({ ...fixePriceTimeItemsState })
        setFixedTimeItemsSaved(true)
        fixedPriceTimeItemsToggle()
    }

    function submitTaxes(fields: TaxesState) {
        store.setTaxes({ ...fields })
        setTaxesSaved(true)
        taxesToggle()
    }

    // TODO: ide: Lav hvert kort collapsable, og lav en saveknap på hvert kort. Når man har gemt et kort lukker kortet, og scroller ned til næste kort
    // Det er en step progress viser ude i siden der viser progress
    // Hvis man ændrer en form kommer der en tekst frem, hvor der står "unsaved changes"
    // Når man submitter en form bliver der sendt til zustand.
    // Evt en side til at se alt data igennem inden man vælger at lave invoicen

    return (
        <Page title={"Create invoice"}>
            <PageBody pt="8">
                <Stack p="4" width="100%" gap="4">
                    <Card>
                        <CardBody>
                            <Stepper step={0}>
                                <StepperStep title="Invoice Information" />
                                <StepperStep title="Time Items" />
                                <StepperStep title="Fixed Price Time Items" />
                                <StepperStep title="Discounts & Taxes" />
                            </Stepper>
                        </CardBody>
                    </Card>


                    <Card title={
                        <Flex>
                            <Heading>Create Invoice</Heading>
                            <Spacer />
                            <Flex gap={4} alignItems="center">
                                {invoiceChanged ? <Text as="i" fontSize="xs">Unsaved Changes</Text> : <></>}
                                <IconButton aria-label='Search database' onClick={invoiceToggle} icon={invoiceOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} />
                            </Flex>
                        </Flex>}>
                        <CardBody py={invoiceOpen ? 4 : 0}>
                            <Collapse {...invoiceCollapseProps()}>
                                <Form<InvoiceState>
                                    onChange={() => setInvoiceChanged(true)}
                                    defaultValues={{ title: store.title, status: store.status, invoiceNumber: store.invoiceNumber, currency: store.currency, invoicedDatesFrom: store.invoicedDatesFrom, invoicedDatesTo: store.invoicedDatesTo, issueDate: store.issueDate, dueDate: store.dueDate, roundingScheme: store.roundingScheme, client: store.client, invoiceLayout: store.invoiceLayout, notesForClient: store.notesForClient }}
                                    resolver={yupResolver(invoiceSchema)}
                                    onSubmit={submitInvoice}>
                                    <FormLayout>
                                        <FormLayout>
                                            <Field name="title" label="Title" />
                                        </FormLayout>
                                        <FormLayout columns={3}>
                                            <Field name="status"
                                                options={[{ value: 'Draft' }, { value: 'No Charge' }]}
                                                type="select"
                                                label="Status"
                                                defaultValue="Draft" />
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
                            </Collapse>
                        </CardBody>
                    </Card>

                    <Card title={
                        <Flex>
                            <Heading>Time Items</Heading>
                            <Spacer />
                            <Flex gap={4} alignItems="center">
                                {timeItemsChanged ? <Text as="i" fontSize="xs">Unsaved Changes</Text> : <></>}
                                <IconButton aria-label='Search database' onClick={() => timeItemsToggle()} icon={timeItemsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} />
                            </Flex>
                        </Flex>}>
                        <CardBody py={timeItemsOpen ? 4 : 0}>
                            <Collapse {...timeItemsCollapseProps()}>
                                <Form<TimeItemsForm>
                                    onChange={() => setTimeItemsChanged(true)}
                                    defaultValues={{
                                        timeItems: [
                                            {
                                            },
                                        ],
                                    }}
                                    resolver={yupResolver(timeItemsSchema)}
                                    onSubmit={(fields) => submitTimeItems(fields)}>
                                    <ArrayFieldContainer
                                        ref={timeItemsRef}
                                        name="timeItems"
                                        defaultValue={{}}
                                        keyName="key">
                                        <ArrayFieldRows>
                                            {(fields) => (
                                                <>
                                                    {fields.map((field, i) => {
                                                        return (
                                                            <React.Fragment key={i}>
                                                                <ArrayFieldRowContainer key={field.id} index={i}>
                                                                    <ArrayFieldRowFields columns={3} spacing={10}>
                                                                        <Field label="Name" name="name" placeholder="Enter Time Item Name" />
                                                                        <Field onChange={updateTotal()} isDisabled={disabledTimeItemIndexes.has(i)} label="Time" type="number" name="time" />
                                                                        <Field onChange={updateTotal()} label="Rate" type="number" name="rate" />
                                                                    </ArrayFieldRowFields>
                                                                    <ArrayFieldRemoveButton onClickCapture={() => jiraItemsStore.removeJiraTable(i)} />
                                                                </ArrayFieldRowContainer>
                                                                <TimeItemsTable timeItemIndex={i} jiraTimeImported={jiraTimeImported} />
                                                                <Divider my={4} />
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </>
                                            )}
                                        </ArrayFieldRows>
                                        <Flex gap={4} justifyContent="space-between">
                                            <SubmitButton label="Save" />
                                            <Flex align="center" gap={4}>
                                                <Text as="i" fontWeight="bold" fontSize="xs">New Item</Text>
                                                <ArrayFieldAddButton />
                                            </Flex>
                                        </Flex>
                                    </ArrayFieldContainer>
                                </Form>
                                <Flex mt={6} gap={10} justifyContent="end">
                                    <Card >
                                        <CardBody>
                                            <Flex gap={10} flexDirection="row">
                                                <Flex flexDirection="column">
                                                    <Heading size="sm">Time</Heading>
                                                    <Text fontSize="sm">10 Hours</Text>
                                                </Flex>
                                                {/* <Divider /> */}
                                                <Flex flexDirection="column">
                                                    <Heading size="sm">{jiraItemsStore.getAllJiraTableHours()} Hours</Heading>
                                                    <Text fontSize="sm"> USD</Text>
                                                </Flex>
                                            </Flex>
                                        </CardBody>
                                    </Card>
                                </Flex>
                            </Collapse>
                        </CardBody>
                    </Card>

                    <Card title={
                        <Flex>
                            <Heading>Fixed Price</Heading>
                            <Spacer />
                            <Flex gap={4} alignItems="center">
                                {fixedPriceTimeItemsChanged ? <Text as="i" fontSize="xs">Unsaved Changes</Text> : <></>}
                                <IconButton aria-label='Search database' onClick={() => fixedPriceTimeItemsToggle()} icon={fixedPriceTimeItemsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} />
                            </Flex>
                        </Flex>}>
                        <CardBody py={fixedPriceTimeItemsOpen ? 4 : 0}>
                            <Collapse {...fixedPriceTimeItemsCollapseProps()}>
                                <Form<FixedPriceTimeItemsForm>
                                    onChange={() => setFixedPriceTimeItemsChanged(true)}
                                    resolver={yupResolver(fixedPriceTimeItemsSchema)}
                                    onSubmit={(fields) => submitFixedPriceTimeItems(fields)}>
                                    <ArrayFieldContainer
                                        name="fixedPriceTimeItems"
                                        defaultValue={{}}
                                        keyName="key">
                                        <ArrayFieldRows>
                                            {(fields) => (
                                                <>
                                                    {fields.map((field, i) => {
                                                        return (
                                                            <React.Fragment key={i}>
                                                                <ArrayFieldRowContainer key={field.id} index={i}>
                                                                    <ArrayFieldRowFields columns={2} spacing={10}>
                                                                        <Field label="Name" name="name" placeholder="Enter Fixed Price Time Item Name" />
                                                                        <Field label="Amount" type="number" name="amount" />
                                                                    </ArrayFieldRowFields>
                                                                    <ArrayFieldRemoveButton />
                                                                </ArrayFieldRowContainer>
                                                                <Divider mt={8} mb={4} />
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </>
                                            )}
                                        </ArrayFieldRows>
                                        <Flex gap={4} justifyContent="space-between">
                                            <SubmitButton label="Save" />
                                            <Flex align="center" gap={4}>
                                                <Text as="i" fontWeight="bold" fontSize="xs">New Item</Text>
                                                <ArrayFieldAddButton />
                                            </Flex>
                                        </Flex>
                                    </ArrayFieldContainer>
                                </Form>
                            </Collapse>
                        </CardBody>
                    </Card>
                    <Card title={
                        <Flex>
                            <Heading>Taxes</Heading>
                            <Spacer />
                            <Flex gap={4} alignItems="center">
                                {taxesChanged ? <Text as="i" fontSize="xs">Unsaved Changes</Text> : <></>}
                                <IconButton aria-label='Search database' onClick={() => taxesToggle()} icon={taxesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} />
                            </Flex>
                        </Flex>}>
                        <CardBody py={taxesOpen ? 4 : 0}>
                            <Collapse {...taxesCollapseProps()}>
                                <Form<TaxesState>
                                    onChange={() => setTaxesChanged(true)}
                                    resolver={yupResolver(taxesSchema)}
                                    onSubmit={(fields) => submitTaxes(fields)}>
                                    <ArrayFieldContainer
                                        name="taxItems"
                                        defaultValue={{}}
                                        keyName="key">
                                        <ArrayFieldRows>
                                            {(fields) => (
                                                <>
                                                    {fields.map((field, i) => {
                                                        return (
                                                            <React.Fragment key={i}>
                                                                <ArrayFieldRowContainer key={field.id} index={i}>
                                                                    <ArrayFieldRowFields columns={2} spacing={10}>
                                                                        <Field label="Name" name="name" placeholder="Enter Tax Name" />
                                                                        <Field label="Percentage" type="number" defaultValue={0} name="percentage" />
                                                                        {/* <Field label="Amount" isDisabled={true} defaultValue="0 USD" type="text" name="amount" /> */}
                                                                    </ArrayFieldRowFields>
                                                                    <ArrayFieldRemoveButton />
                                                                </ArrayFieldRowContainer>
                                                                <Flex flexDirection="column" gap={4}>
                                                                    <Heading size='sm'>
                                                                        Apply to Time Items
                                                                    </Heading>
                                                                    <Wrap w="100%" spacing={4} mb={6}>
                                                                        {store.timeItems.map((item) => {
                                                                            return (
                                                                                <WrapItem>

                                                                                    <Field
                                                                                        type="switch"
                                                                                        name="applies"
                                                                                        help={item.name}
                                                                                    />
                                                                                </WrapItem>
                                                                            )
                                                                        })}
                                                                    </Wrap>
                                                                </Flex>
                                                                <Flex flexDirection="column" gap={4}>
                                                                    <Heading size='sm'>
                                                                        Apply to Fixed Price Time Items
                                                                    </Heading>
                                                                    <Wrap w="100%" spacing={4} mb={6}>
                                                                        {store.fixedPriceTimeItems.map((item) => {
                                                                            return (
                                                                                <WrapItem>

                                                                                    <Field
                                                                                        type="switch"
                                                                                        name="applies"
                                                                                        help={item.name}
                                                                                    />
                                                                                </WrapItem>
                                                                            )
                                                                        })}
                                                                    </Wrap>
                                                                </Flex>
                                                                <Divider mt={8} mb={4} />
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </>
                                            )}
                                        </ArrayFieldRows>
                                        <Flex gap={4} justifyContent="space-between">
                                            <SubmitButton label="Save" />
                                            <Flex align="center" gap={4}>
                                                <Text as="i" fontWeight="bold" fontSize="xs">New Tax</Text>
                                                <ArrayFieldAddButton />
                                            </Flex>
                                        </Flex>

                                    </ArrayFieldContainer>

                                </Form>
                            </Collapse>
                        </CardBody>
                    </Card>

                    <Card title={
                        <Flex>
                            <Heading>E-conomic</Heading>
                            <Spacer />
                            <Flex gap={4} alignItems="center">
                                <Text as="i" fontSize="xs">Unsaved Changes</Text>
                                <IconButton aria-label='Search database' onClick={() => economicToggle()} icon={economicOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} />
                            </Flex>
                        </Flex>}>
                        <CardBody py={economicOpen ? 4 : 0}>
                            <Collapse {...economicCollapseProps()}>
                                <Text>E-conomic options</Text>
                            </Collapse>
                        </CardBody>
                    </Card>
                </Stack>
            </PageBody>
        </Page >
    )
}

export default CreateInvoice;