import { Button, Center, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Spinner, StackDivider, Text, Textarea, useColorMode, VStack } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Card, CardBody, FormLayout } from "@saas-ui/react";

import { Section } from '@saas-ui/pro';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import useInvoiceIssuesStore from '../../../../store/invoiceIssues';
import { trpc } from '../../../utils/trpc';
import { Currency } from '@prisma/client';

interface IProps {
    setStep: Dispatch<SetStateAction<number>>
}

export interface FormInvoiceState {
    invoiceInformation: {
        title: string,
        currency: string,
        dueDate: string,
        roundingScheme: string,
        pricePerHour: number
    },

    economicOptions: {
        exportToEconomic: boolean
        customer: string
        text1: string
        ourReference: string
        customerContact: string
    }
}

const EconomicOptions = (props: IProps) => {
    const { setStep } = props
    const store = useInvoiceIssuesStore()

    const [invoiceOptionsData, setInvoiceOptionsData] = useState({
        statuses: [''],
        currencies: ['USD', 'DKK', 'EUR'],
        clients: [''],
        defaultCurrency: Currency.DKK,
        invoiceLayouts: [''],
        roundingScheme: ['1 Dec.', '2 Dec.', '3 Dec.'],
        economicCustomers: [
            {
                customerNumber: 10,
                name: 'Real Estate Gurus LLC',
            },
            {
                customerNumber: 10,
                name: 'Digital Marketing Specialists APS',
            },
            {
                customerNumber: 10,
                name: 'Jacob Advertising APS',
            },
            {
                customerNumber: 10,
                name: 'Collective Co',
            }
        ],
        activeIntegrations: {
        }
    });
    const [invoiceOptionsIsLoading, setInvoiceOptionsIsLoading] = useState(false);
    const [invoiceOptionsIsRefetching, setInvoiceOptionsIsRefetching] = useState(false);

    const [economicData, setEconomicData] = useState({
        ourReferences: [
            {
                employeeNumber: 1,
                name: 'Harry Burgess',
            },
            {
                employeeNumber: 2,
                name: 'Jack Wyatt',
            },
            {
                employeeNumber: 3,
                name: 'Mauri Franco',
            },
            {
                employeeNumber: 4,
                name: 'Reed Neulight',
            }
        ],
        customerContacts: [{
            customerContactNumber: 15,
            name: 'Joseph'
        }]

    });


    const [economicIsLoading, setEconomicIsLoading] = useState(false);
    const [economicIsRefetching, setEconomicIsRefetching] = useState(false);

    const invoiceInformationForm = useForm<FormInvoiceState>({
        reValidateMode: "onSubmit",
        defaultValues: {
            invoiceInformation: {
                title: store.title,
                currency: store.currency,
                dueDate: moment(store.dueDate).format("YYYY-MM-DD"),
                roundingScheme: store.roundingScheme,
                pricePerHour: store.pricePerHour,
            },
            economicOptions: {
                exportToEconomic: store.economicOptions.exportToEconomic,
                customer: store.economicOptions.customer,
                text1: store.economicOptions.text1,
                ourReference: store.economicOptions.ourReference,
                customerContact: store.economicOptions.customerContact
            }
        },
    });

    const exportToEconomicField = invoiceInformationForm.watch("economicOptions.exportToEconomic")
    const economicCustomer = invoiceInformationForm.watch("economicOptions.customer")

    const { register, control, handleSubmit, reset, formState, watch, setValue } = invoiceInformationForm
    const { errors } = formState;

    function onSubmit(data: FormInvoiceState) {
        const dateFields = {
            dueDate: new Date(data.invoiceInformation.dueDate),
        }

        // We can't show customernumber, referencenumber etc in confirmation step, so the actual names are stores as well
        const customerName = invoiceOptionsData?.economicCustomers.find(x => x.customerNumber === parseInt(data.economicOptions.customer))?.name ?? ""
        const ourReferenceName = economicData?.ourReferences.find(x => x.employeeNumber === parseInt(data.economicOptions.ourReference))?.name ?? ""
        const ourContactName = economicData?.customerContacts.find(x => x.customerContactNumber === parseInt(data.economicOptions.customerContact))?.name ?? ""

        store.setInvoiceInformation({
            ...data.invoiceInformation,
            ...dateFields,
            economicOptions: {
                ...data.economicOptions,
                customerName: customerName,
                ourReferenceName: ourReferenceName,
                customerContactName: ourContactName
            }
        })

        setStep((step) => step + 1)
    }

    // const { data: invoiceOptionsData, isLoading: invoiceOptionsIsLoading, isRefetching: invoiceOptionsIsRefetching } = trpc.useQuery(["invoices.getInvoiceOptions"], {
    //     refetchOnWindowFocus: false
    // });

    // const { data: economicData, isLoading: economicIsLoading, isRefetching: economicIsRefetching, refetch: economicRefetch } = trpc.useQuery([
    //     "invoices.getEconomicOptions",
    //     { customerNumber: parseInt(economicCustomer) }],
    //     {
    //         enabled: false,
    //     });

    // useEffect(() => {
    //     if (!isNaN(parseInt(economicCustomer))) {
    //         economicRefetch()
    //     }
    // }, [economicCustomer, economicRefetch])
    const { toggleColorMode, colorMode } = useColorMode()
    return (
        <Card title={
            <Flex width = '92em'>
                <Heading>Create Invoice</Heading>
            </Flex>}>
            <CardBody>
                {
                    invoiceOptionsIsLoading || invoiceOptionsIsRefetching || !invoiceOptionsData
                        ? <Center><Spinner /></Center>
                        : <form onSubmit={handleSubmit(onSubmit)}>
                            <VStack divider={<StackDivider />}  align="stretch" spacing={8} pb="16">
                                <Section
                                    title="Invoice"
                                    description="Information about invoice stored in our systems."
                                    variant="annotated"
                                >
                                    <Card>
                                        <CardBody>
                                            <FormLayout>
                                                <FormLayout>
                                                    <FormControl isInvalid={!!errors.invoiceInformation?.title}>
                                                        <FormLabel htmlFor={`invoiceInformation.title`}>
                                                            <Flex gap={1}>
                                                                Title
                                                                <Text color="red" size="sm">*</Text>
                                                            </Flex>
                                                        </FormLabel>
                                                        <Flex flexDirection="column">
                                                            <Input
                                                                id='title'
                                                                placeholder="Enter title"
                                                                variant="filled"
                                                                {...register(`invoiceInformation.title`, {
                                                                    required: 'Title is required',
                                                                })}
                                                            />
                                                            <FormErrorMessage>
                                                                {errors.invoiceInformation?.title?.message}
                                                            </FormErrorMessage>
                                                        </Flex>
                                                    </FormControl>
                                                </FormLayout>
                                                <FormLayout columns={3}>
                                                    <FormControl isInvalid={!!errors.invoiceInformation?.currency}>
                                                        <FormLabel htmlFor={`invoiceInformation.currency`}>Currency</FormLabel>
                                                        <Flex flexDirection="column">
                                                            <Select
                                                                id='currency'
                                                                variant="filled"
                                                                placeholder="Select option"
                                                                {...register(`invoiceInformation.currency`)}>
                                                                {invoiceOptionsData.currencies.map(item => {
                                                                    return (
                                                                        <option key={item} value={item}>{item}</option>
                                                                    )
                                                                })}
                                                            </Select>
                                                            <FormErrorMessage>
                                                                {errors.invoiceInformation?.currency?.message}
                                                            </FormErrorMessage>
                                                        </Flex>
                                                    </FormControl>
                                                    <FormControl isInvalid={!!errors.invoiceInformation?.dueDate}>
                                                        <FormLabel htmlFor={`invoiceInformation.dueDate`}>Due Date</FormLabel>
                                                        <Flex flexDirection="column">
                                                            <Input
                                                                id='dueDate'
                                                                type="date"
                                                                variant="filled"
                                                                {...register(`invoiceInformation.dueDate`)}
                                                            />
                                                            <FormErrorMessage>
                                                                {errors.invoiceInformation?.dueDate?.message}
                                                            </FormErrorMessage>
                                                        </Flex>
                                                    </FormControl>
                                                    <FormControl isInvalid={!!errors.invoiceInformation?.roundingScheme}>
                                                        <FormLabel htmlFor={`invoiceInformation.roundingScheme`}>Rounding scheme</FormLabel>
                                                        <Flex flexDirection="column">
                                                            <Select
                                                                value='1 Dec.'
                                                                id='roundingScheme'
                                                                variant="filled"
                                                                placeholder="Select option"
                                                                {...register(`invoiceInformation.roundingScheme`)}>
                                                                {invoiceOptionsData.roundingScheme.map(item => {
                                                                    return (
                                                                        <option key={item} value={item}>{item}</option>
                                                                    )
                                                                })}
                                                            </Select>
                                                            <FormErrorMessage>
                                                                {errors.invoiceInformation?.roundingScheme?.message}
                                                            </FormErrorMessage>
                                                        </Flex>
                                                    </FormControl>
                                                </FormLayout>
                                            </FormLayout>
                                        </CardBody>
                                    </Card>
                                </Section>
                                <Section
                                    title="E-conomic"
                                    description={
                                        <Flex flexDirection="column">
                                            <p>Options when invoice is exported to Visma E-conomic.</p>
                                            <Flex mt={2} gap={2}>
                                                <Checkbox
                                                    id='exportToEconomic'
                                                    type="checkbox"
                                                    variant="filled"
                                                    {...register(`economicOptions.exportToEconomic`)}
                                                />
                                                <Text textColor={colorMode === 'dark' ? 'white' : "black"}>Export to E-conomic?</Text>
                                            </Flex>
                                        </Flex>}
                                    variant="annotated">
                                    <Card>
                                        <CardBody>
                                            <FormLayout>
                                                <FormLayout>
                                                    <FormControl isInvalid={!!errors.economicOptions?.customer}>
                                                        <FormLabel htmlFor={`economicOptions.customer`}>Pick E-conomic Customer</FormLabel>
                                                        <Flex flexDirection="column">
                                                            <Select
                                                                id='customer'
                                                                variant="filled"
                                                                isDisabled={!exportToEconomicField}
                                                                placeholder="Select Customer"
                                                                {...register(`economicOptions.customer`)}>
                                                                {
                                                                    invoiceOptionsData?.economicCustomers.map((item, index) => {
                                                                        return (<option key={index} value={item.customerNumber}>{item.name}</option>)
                                                                    })
                                                                }
                                                            </Select>
                                                            <FormErrorMessage>
                                                                {errors.economicOptions?.customer?.message}
                                                            </FormErrorMessage>
                                                        </Flex>
                                                    </FormControl>
                                                </FormLayout>

                                                {economicCustomer
                                                    ? <FormLayout>
                                                        <FormControl isInvalid={!!errors.invoiceInformation?.pricePerHour}>
                                                            <FormLabel htmlFor={`invoiceInformation.pricePerHour`}>Price per Hour</FormLabel>
                                                            <Flex flexDirection="column">
                                                                <Input
                                                                    id='pricePerHour'
                                                                    type="number"
                                                                    isDisabled={!exportToEconomicField}
                                                                    placeholder="Enter Price per Hour"
                                                                    variant="filled"
                                                                    {...register(`invoiceInformation.pricePerHour`, {
                                                                        valueAsNumber: true
                                                                    })}
                                                                />
                                                                <FormErrorMessage>
                                                                    {errors.invoiceInformation?.pricePerHour?.message}
                                                                </FormErrorMessage>
                                                            </Flex>
                                                        </FormControl>
                                                    </FormLayout>
                                                    : null}

                                                {economicCustomer ? <>
                                                    <FormLayout>
                                                        <FormLayout>
                                                            <FormControl isInvalid={!!errors.economicOptions?.text1}>
                                                                <FormLabel htmlFor={`economicOptions.text1`}>Text 1</FormLabel>
                                                                <Flex flexDirection="column">
                                                                    <Textarea
                                                                        id='text1'
                                                                        isDisabled={!exportToEconomicField}
                                                                        placeholder="Enter Text 1"
                                                                        variant="filled"
                                                                        {...register(`economicOptions.text1`)}
                                                                    />
                                                                    <FormErrorMessage>
                                                                        {errors.economicOptions?.text1?.message}
                                                                    </FormErrorMessage>
                                                                </Flex>
                                                            </FormControl>
                                                        </FormLayout>
                                                        <FormLayout columns={2}>
                                                            <FormLayout>
                                                                <FormControl isInvalid={!!errors.economicOptions?.ourReference}>
                                                                    <FormLabel htmlFor={`economicOptions.ourReference`}>Our Reference</FormLabel>
                                                                    <Flex flexDirection="column">
                                                                        <Select
                                                                            id='status'
                                                                            isDisabled={!exportToEconomicField}
                                                                            variant="filled"
                                                                            placeholder="Select Our Reference"
                                                                            {...register(`economicOptions.ourReference`)}>
                                                                            {
                                                                                !economicIsRefetching || economicIsLoading || !economicData
                                                                                    ? economicData?.ourReferences.map(item => {
                                                                                        return (<option key={item.employeeNumber} value={item.employeeNumber}>{item.name}</option>)
                                                                                    })
                                                                                    : null
                                                                            }
                                                                        </Select>
                                                                        <FormErrorMessage>
                                                                            {errors.economicOptions?.ourReference?.message}
                                                                        </FormErrorMessage>
                                                                    </Flex>
                                                                </FormControl>
                                                            </FormLayout>
                                                            <FormLayout>
                                                                <FormControl isInvalid={!!errors.economicOptions?.customerContact}>
                                                                    <FormLabel htmlFor={`economicOptions.customerContact`}>Customer Contact</FormLabel>
                                                                    <Flex flexDirection="column">
                                                                        <Select
                                                                            id='status'
                                                                            isDisabled={!exportToEconomicField}
                                                                            variant="filled"
                                                                            placeholder="Select Customer Contact"
                                                                            {...register(`economicOptions.customerContact`)}>
                                                                            {
                                                                                !economicIsRefetching || economicIsLoading || !economicData
                                                                                    ? economicData?.customerContacts.map(item => {
                                                                                        return (<option key={item.customerContactNumber} value={item.customerContactNumber}>{item.name}</option>)
                                                                                    })
                                                                                    : null
                                                                            }
                                                                        </Select>
                                                                        <FormErrorMessage>
                                                                            {errors.economicOptions?.customerContact?.message}
                                                                        </FormErrorMessage>
                                                                    </Flex>
                                                                </FormControl>
                                                            </FormLayout>
                                                        </FormLayout>
                                                    </FormLayout>
                                                </>
                                                    : <></>}
                                            </FormLayout>
                                        </CardBody>
                                    </Card>
                                </Section>
                            </VStack>
                            <Flex justifyContent="space-between">
                                <Button mt={6} colorScheme="primary" onClick={() => setStep((step) => step - 1)}>Previous</Button>
                                <Button mt={6} colorScheme="primary" type="submit">Next</Button>
                            </Flex>
                        </form>
                }
            </CardBody>
        </Card>
    )
}

export default EconomicOptions;