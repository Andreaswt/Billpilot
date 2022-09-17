import { Button, Center, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Spinner, StackDivider, Text, Textarea, VStack } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect } from 'react';

import { Card, CardBody, FormLayout } from "@saas-ui/react";

import { Section } from '@saas-ui/pro';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import useInvoiceIssuesStore from '../../../../store/invoiceIssues';
import { trpc } from '../../../utils/trpc';

interface IProps {
    setStep: Dispatch<SetStateAction<number>>
}

const EconomicOptions = (props: IProps) => {
    const { setStep } = props
    const store = useInvoiceIssuesStore();

    const invoiceInformationForm = useForm({
        reValidateMode: "onSubmit",
        defaultValues: {
            invoiceInformation: {
                title: store.title,
                currency: store.currency,
                dueDate: moment(store.dueDate).format("YYYY-MM-DD"),
                roundingScheme: store.roundingScheme,
            },
            economicOptions: {
                customer: store.economicOptions.customer,
                customerName: store.economicOptions.customer,
                customerPrice: store.economicOptions.customerPrice,
                text1: store.economicOptions.text1,
                ourReference: store.economicOptions.ourReference,
                ourReferenceName: store.economicOptions.ourReferenceName,
                customerContact: store.economicOptions.customerContact,
                customerContactName: store.economicOptions.customerContactName
            }
        },
    });

    const economicCustomer = invoiceInformationForm.watch("economicOptions.customer")
    const economicCustomerPrice = invoiceInformationForm.watch("economicOptions.customerPrice")

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

    interface FormInvoiceState {
        invoiceInformation: {
            title: string,
            currency: string,
            dueDate: string,
            roundingScheme: string,
        },

        economicOptions: {
            customer: string
            customerPrice: number
            text1: string
            ourReference: string
            customerContact: string
        }
    }

    const { data: invoiceOptionsData, isLoading: invoiceOptionsIsLoading, isRefetching: invoiceOptionsIsRefetching } = trpc.useQuery(["invoices.getInvoiceOptions"], {
        refetchOnWindowFocus: false
    });

    const { data: economicData, isLoading: economicIsLoading, isRefetching: economicIsRefetching, refetch: economicRefetch } = trpc.useQuery([
        "invoices.getEconomicOptions",
        { customerNumber: parseInt(economicCustomer) }],
        {
            enabled: false,
        });

    useEffect(() => {
        if (!isNaN(parseInt(economicCustomer))) {
            economicRefetch()
        }
    }, [economicCustomer])

    return (
        <Card title={
            <Flex>
                <Heading>Create Invoice</Heading>
            </Flex>}>
            <CardBody>
                {
                    invoiceOptionsIsLoading || invoiceOptionsIsRefetching || !invoiceOptionsData
                        ? <Center><Spinner /></Center>
                        : <form onSubmit={handleSubmit(onSubmit)}>
                            <VStack divider={<StackDivider />} align="stretch" spacing={8} pb="16">
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
                                                                Name
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
                                    description="Options when invoice is exported to Visma E-conomic."
                                    variant="annotated"
                                >
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
                                                                placeholder="Select Customer"
                                                                {...register(`economicOptions.customer`)}>
                                                                {
                                                                    invoiceOptionsData?.economicCustomers.map(item => {
                                                                        return (<option key={item.customerNumber} value={item.customerNumber}>{item.name}</option>)
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
                                                        <FormControl isInvalid={!!errors.economicOptions?.customerPrice}>
                                                            <FormLabel htmlFor={`economicOptions.customerPrice`}>Pick E-conomic Customer Price</FormLabel>
                                                            <Flex flexDirection="column">
                                                                <Input
                                                                    id='customerPrice'
                                                                    type="number"
                                                                    placeholder="Enter Customer Price"
                                                                    variant="filled"
                                                                    {...register(`economicOptions.customerPrice`)}
                                                                />
                                                                <FormErrorMessage>
                                                                    {errors.economicOptions?.customerPrice?.message}
                                                                </FormErrorMessage>
                                                            </Flex>
                                                        </FormControl>
                                                    </FormLayout>
                                                    : null}

                                                {economicCustomer && economicCustomerPrice ? <>
                                                    <FormLayout>
                                                        <FormLayout>
                                                            <FormControl isInvalid={!!errors.economicOptions?.text1}>
                                                                <FormLabel htmlFor={`economicOptions.text1`}>Text 1</FormLabel>
                                                                <Flex flexDirection="column">
                                                                    <Textarea
                                                                        id='text1'
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