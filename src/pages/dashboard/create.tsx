import { Button, Collapse, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, Select, Spacer, Stack, Text, Textarea } from '@chakra-ui/react';
import { Stepper, StepperStep, useCollapse } from '@saas-ui/react';
import { NextPage } from "next";
import React from 'react';
import * as Yup from 'yup';
import useCreateInvoiceStore, { FixedPriceTimeItemsState, InvoiceState, TaxesState, TimeItemsState } from '../../../store/invoice';
import { requireAuth } from "../../common/requireAuth";


import {
    Page, PageBody
} from '@saas-ui/pro';
import { Card, CardBody, FormLayout } from "@saas-ui/react";
import { Field, Form, Formik } from "formik";

import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import useJiraItemsStore, { CheckedTimeItems } from '../../../store/jiraItems';
import FixedPriceTimeItemsForm from '../../components/dashboard/create-invoice/forms/FixedPriceTimeItemsForm';
import TaxesForm from '../../components/dashboard/create-invoice/forms/TaxesForm';
import TimeItemsForm from '../../components/dashboard/create-invoice/forms/TimeItemsForm';
import moment from 'moment';
import DiscountsForm from '../../components/dashboard/create-invoice/forms/DiscountsForm';

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
    const { isOpen: discountsOpen, onToggle: discountsToggle, getCollapseProps: discountsCollapseProps } = useCollapse()
    const { isOpen: economicOpen, onToggle: economicToggle, getCollapseProps: economicCollapseProps } = useCollapse()

    // Keep track of which forms are changed
    const [invoiceChanged, setInvoiceChanged] = React.useState(false);
    const [timeItemsChanged, setTimeItemsChanged] = React.useState(false);
    const [fixedPriceTimeItemsChanged, setFixedPriceTimeItemsChanged] = React.useState(false);
    const [taxesChanged, setTaxesChanged] = React.useState(false);
    const [discountsChanged, setDiscountsChanged] = React.useState(false);

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

    const InvoiceSchema = Yup.object().shape({
        title: Yup.string().required().label('Title'),
        status: Yup.string().required().label('Status'),
        invoiceNumber: Yup.string().required().label('Invoice Number'),
        currency: Yup.string().required().label('Currency'),
        invoicedDatesFrom: Yup.date().required().label('Invoiced from'),
        invoicedDatesTo: Yup.date().required().label('Invoiced to'),
        issueDate: Yup.date().required().label('Issue Date'),
        dueDate: Yup.date().required().label('Due Date'),
        roundingScheme: Yup.string().required().label('Rounding Scheme'),
        client: Yup.string().required().label('Client'),
        invoiceLayout: Yup.string().required().label('Invoice Layout for Clients'),
        notesForClient: Yup.string().required().label('Notes for Client'),
    })

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
                                <Formik
                                    validateOnChange={false}
                                    initialValues={{ title: store.title, status: store.status, invoiceNumber: store.invoiceNumber, currency: store.currency, invoicedDatesFrom: moment(store.invoicedDatesFrom).format("YYYY-MM-DD"), invoicedDatesTo: moment(store.invoicedDatesTo).format("YYYY-MM-DD"), issueDate:  moment(store.issueDate).format("YYYY-MM-DD"), dueDate: moment(store.dueDate).format("YYYY-MM-DD"), roundingScheme: store.roundingScheme, client: store.client, invoiceLayout: store.invoiceLayout, notesForClient: store.notesForClient }}
                                    validationSchema={InvoiceSchema}
                                    onSubmit={(values) => console.log(values)}>
                                    {({ values, errors, touched }) => (
                                        <Form onChange={() => console.log("hs")}>
                                            <FormLayout>
                                                <FormLayout>
                                                    <FormControl isInvalid={errors.title != null && touched.title != null}>
                                                        <FormLabel htmlFor="title">Title</FormLabel>
                                                        <Field as={Input} placeholder="Title" variant="filled" name={`title`} />
                                                        {errors.title && touched.title ? <FormErrorMessage>{errors.title}</FormErrorMessage>: null}
                                                    </FormControl>
                                                </FormLayout>
                                                <FormLayout columns={3}>
                                                    <FormControl isInvalid={errors.status != null && touched.status != null}>
                                                        <FormLabel htmlFor="status">Status</FormLabel>
                                                        <Field as={Select} variant="filled" placeholder="Select option" name="status">
                                                            <option value="Draft">Draft</option>
                                                            <option value="No Charge">No Charge</option>
                                                        </Field>
                                                        {errors.status && touched.status ? <FormErrorMessage>{errors.status}</FormErrorMessage>: null}
                                                    </FormControl>
                                                    <FormControl isInvalid={errors.invoiceNumber != null && touched.invoiceNumber != null}>
                                                        <FormLabel htmlFor="invoiceNumber">Invoice Number</FormLabel>
                                                        <Field as={Input} placeholder="Invoice Number" variant="filled" name={`invoiceNumber`} />
                                                        {errors.invoiceNumber && touched.invoiceNumber ? <FormErrorMessage>{errors.invoiceNumber}</FormErrorMessage>: null}
                                                    </FormControl>
                                                    <FormControl isInvalid={errors.currency != null && touched.currency != null}>
                                                        <FormLabel htmlFor="status">Currency</FormLabel>
                                                        <Field as={Select} placeholder="Select option" variant="filled" name="currency">
                                                            <option value="usd">USD</option>
                                                            <option value="eur">EUR</option>
                                                            <option value="dkk">DKK</option>
                                                        </Field>
                                                        {errors.currency && touched.currency ? <FormErrorMessage>{errors.currency}</FormErrorMessage>: null}
                                                    </FormControl>
                                                </FormLayout>
                                                <FormLayout columns={3}>
                                                    <FormLayout columns={2}>
                                                    <FormControl isInvalid={errors.invoicedDatesFrom != null && touched.invoicedDatesFrom != null}>
                                                        <FormLabel htmlFor="invoicedDatesFrom">Invoiced from</FormLabel>
                                                        <Field as={Input} type="date" placeholder="Invoiced from" variant="filled" name={`invoicedDatesFrom`} />
                                                        {errors.invoicedDatesFrom && touched.invoicedDatesFrom ? <FormErrorMessage>Invoiced from must be set</FormErrorMessage>: null}
                                                    </FormControl>
                                                    <FormControl isInvalid={errors.invoicedDatesTo != null && touched.invoicedDatesTo != null}>
                                                        <FormLabel htmlFor="invoicedDatesTo">Invoiced to</FormLabel>
                                                        <Field as={Input} type="date" placeholder="Invoiced to" variant="filled" name={`invoicedDatesTo`} />
                                                        {errors.invoicedDatesTo && touched.invoicedDatesTo ? <FormErrorMessage>Invoiced to must be set</FormErrorMessage>: null}
                                                    </FormControl>
                                                    </FormLayout>
                                                    <FormControl isInvalid={errors.issueDate != null && touched.issueDate != null}>
                                                        <FormLabel htmlFor="issueDate">Issue Date</FormLabel>
                                                        <Field as={Input} type="date" placeholder="Issue Date" variant="filled" name={`issueDate`} />
                                                        {errors.issueDate && touched.issueDate ? <FormErrorMessage>Issue Date must be set</FormErrorMessage>: null}
                                                    </FormControl>
                                                    <FormControl isInvalid={errors.dueDate != null && touched.dueDate != null}>
                                                        <FormLabel htmlFor="dueDate">Due Date</FormLabel>
                                                        <Field as={Input} type="date" placeholder="Due Date" variant="filled" name={`dueDate`} />
                                                        {errors.dueDate && touched.dueDate ? <FormErrorMessage>Due Date must be set</FormErrorMessage>: null}
                                                    </FormControl>
                                                </FormLayout>
                                                <FormLayout columns={3}>
                                                    <FormControl isInvalid={errors.roundingScheme != null && touched.roundingScheme != null}>
                                                        <FormLabel htmlFor="roundingScheme">Rounding Scheme</FormLabel>
                                                        <Field as={Select} variant="filled" placeholder="Select option" name={`roundingScheme`}>
                                                            <option value="Værdi 1">Værdi 1</option>
                                                            <option value="Værdi 2">Værdi 2</option>
                                                        </Field>
                                                        {errors.roundingScheme && touched.roundingScheme ? <FormErrorMessage>{errors.roundingScheme}</FormErrorMessage>: null}
                                                    </FormControl>
                                                        <FormControl isInvalid={errors.client != null && touched?.client != null}>
                                                        <FormLabel htmlFor="client">Client</FormLabel>
                                                        <Field as={Select} variant="filled" placeholder="Select option" name={`client`}>
                                                            <option value="Client 1">Client 1</option>
                                                            <option value="Client 2">Client 2</option>
                                                        </Field>
                                                        {errors.client && touched.client ? <FormErrorMessage>{errors.client}</FormErrorMessage>: null}
                                                    </FormControl>
                                                        <FormControl isInvalid={errors.invoiceLayout != null && touched.invoiceLayout != null}>
                                                        <FormLabel htmlFor="invoiceLayout">Invoice Layout for Clients</FormLabel>
                                                        <Field as={Select} variant="filled" placeholder="Select option" name={`invoiceLayout`}>
                                                            <option value="Layout 1">Layout 1</option>
                                                            <option value="Layout 2">Layout 2</option>
                                                        </Field>
                                                        {errors.invoiceLayout && touched.invoiceLayout ? <FormErrorMessage>{errors.invoiceLayout}</FormErrorMessage>: null}
                                                    </FormControl>
                                                </FormLayout>
                                                <FormLayout>
                                                    <FormControl isInvalid={errors.notesForClient != null && touched.notesForClient != null}>
                                                        <FormLabel htmlFor="notesForClient">Notes for Client</FormLabel>
                                                        <Field as={Textarea} placeholder="Notes for Client" variant="filled" name={`notesForClient`} />
                                                        {errors.notesForClient && touched.notesForClient ? <FormErrorMessage>{errors.notesForClient}</FormErrorMessage>: null}
                                                    </FormControl>
                                                </FormLayout>
                                            </FormLayout>
                                            <Button mt={6} colorScheme="purple" type="submit">Save</Button>
                                        </Form>
                                    )}
                                </Formik>
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
                                <TimeItemsForm />
                            </Collapse>
                        </CardBody>
                    </Card>

                    <Card title={
                        <Flex>
                            <Heading>Fixed Price Time Items</Heading>
                            <Spacer />
                            <Flex gap={4} alignItems="center">
                                {timeItemsChanged ? <Text as="i" fontSize="xs">Unsaved Changes</Text> : <></>}
                                <IconButton aria-label='Open' onClick={() => fixedPriceTimeItemsToggle()} icon={fixedPriceTimeItemsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} />
                            </Flex>
                        </Flex>}>
                        <CardBody py={fixedPriceTimeItemsOpen ? 4 : 0}>
                            <Collapse {...fixedPriceTimeItemsCollapseProps()}>
                                <FixedPriceTimeItemsForm />
                            </Collapse>
                        </CardBody>
                    </Card>

                    <Card title={
                        <Flex>
                            <Heading>Taxes</Heading>
                            <Spacer />
                            <Flex gap={4} alignItems="center">
                                {taxesChanged ? <Text as="i" fontSize="xs">Unsaved Changes</Text> : <></>}
                                <IconButton aria-label='Open' onClick={() => taxesToggle()} icon={taxesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} />
                            </Flex>
                        </Flex>}>
                        <CardBody py={taxesOpen ? 4 : 0}>
                            <Collapse {...taxesCollapseProps()}>
                                <TaxesForm />
                            </Collapse>
                        </CardBody>
                    </Card>

                    <Card title={
                        <Flex>
                            <Heading>Discounts</Heading>
                            <Spacer />
                            <Flex gap={4} alignItems="center">
                                {discountsChanged ? <Text as="i" fontSize="xs">Unsaved Changes</Text> : <></>}
                                <IconButton aria-label='Open' onClick={() => discountsToggle()} icon={discountsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} />
                            </Flex>
                        </Flex>}>
                        <CardBody py={discountsOpen ? 4 : 0}>
                            <Collapse {...discountsCollapseProps()}>
                                <DiscountsForm />
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