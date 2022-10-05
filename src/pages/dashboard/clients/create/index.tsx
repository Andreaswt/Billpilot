import { Center, Flex, FormControl, FormErrorMessage, FormLabel, Input, Select, Spinner, Stack, StackDivider, Text, Textarea, VStack } from '@chakra-ui/react';
import { Page, PageBody, Section } from '@saas-ui/pro';
import { Button, Card, CardBody, FormLayout } from '@saas-ui/react';
import { NextPage } from 'next';
import router from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import RequiredFormField from '../../../../components/dashboard/forms/required-field';
import { trpc } from '../../../../utils/trpc';

export interface CreateClientForm {
    clientInformation: {
        name: string,
        currency: string,
        roundingScheme: string,
        pricePerHour: number
    },
    economicOptions: {
        customer: string
        text1: string
        ourReference: string
        customerContact: string
        unit: string
        layout: string
        vatZone: string
        paymentTerms: string
        product: string
    }
}

const Create: NextPage = () => {
    const { data: invoiceOptionsData, isLoading: invoiceOptionsIsLoading } = trpc.useQuery(["invoices.getInvoiceOptions"], {
        refetchOnWindowFocus: false
    });

    const mutation = trpc.useMutation('clients.createClient', {
        onSuccess() {
            router.push("/dashboard/clients")
        }
    });

    async function onSubmit(data: CreateClientForm) {
        await mutation.mutateAsync({ ...data })
    }

    const createClientForm = useForm<CreateClientForm>({
        reValidateMode: "onSubmit",
        defaultValues: {
            clientInformation: {
                name: "",
                currency: "",
                roundingScheme: "",
                pricePerHour: 0,
            },
            economicOptions: {
                customer: "",
                text1: "",
                ourReference: "",
                customerContact: "",
                unit: "",
                layout: "",
                vatZone: "",
                paymentTerms: "",
                product: "",
            }
        },
    });

    const { register, control, handleSubmit, reset, formState, watch, setValue } = createClientForm
    const { errors } = formState

    const economicCustomer = createClientForm.watch("economicOptions.customer")

    const { data: economicData, isLoading: economicIsLoading, refetch: economicRefetch } = trpc.useQuery([
        "invoices.getEconomicOptions",
        { customerNumber: parseInt(economicCustomer) }],
        {
            enabled: false,
        });

    useEffect(() => {
        if (!isNaN(parseInt(economicCustomer))) {
            economicRefetch()
        }
    }, [economicCustomer, economicRefetch])

    return (
        <Page title={"Add Client"}>
            <PageBody pt="8">
                <Stack p="4" width="100%" gap="4">
                    <Card>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardBody>
                                {
                                    invoiceOptionsIsLoading || !invoiceOptionsData
                                        ? <Center><Spinner /></Center>
                                        : <>
                                            <VStack divider={<StackDivider />} align="stretch" spacing={8} pb="16">
                                                <Section
                                                    title="Create client"
                                                    description="Clients contain info about your clients that can be used as templates for future invoices."
                                                    variant="annotated"
                                                >
                                                    <Card>
                                                        <CardBody>
                                                            <FormLayout>
                                                                <FormLayout>
                                                                    <FormControl isInvalid={!!errors.clientInformation?.name}>
                                                                        <FormLabel htmlFor={`clientInformation.name`}>Name</FormLabel>
                                                                        <Flex flexDirection="column">
                                                                            <Input
                                                                                id='name'
                                                                                placeholder="Enter name"
                                                                                variant="filled"
                                                                                {...register(`clientInformation.name`, {
                                                                                    required: 'Name is required',
                                                                                })}
                                                                            />
                                                                            <FormErrorMessage>
                                                                                {errors.clientInformation?.name?.message}
                                                                            </FormErrorMessage>
                                                                        </Flex>
                                                                    </FormControl>
                                                                </FormLayout>
                                                                <FormLayout columns={{ base: 1, lg: 2, xl: 2 }}>
                                                                    <FormControl isInvalid={!!errors.clientInformation?.currency}>
                                                                        <FormLabel htmlFor={`clientInformation.currency`}>Currency</FormLabel>
                                                                        <Flex flexDirection="column">
                                                                            <Select
                                                                                id='currency'
                                                                                variant="filled"
                                                                                placeholder="Select option"
                                                                                {...register(`clientInformation.currency`, {
                                                                                    required: 'Currency is required',
                                                                                })}>
                                                                                {invoiceOptionsData.currencies.map(item => {
                                                                                    return (
                                                                                        <option key={item} value={item}>{item}</option>
                                                                                    )
                                                                                })}
                                                                            </Select>
                                                                            <FormErrorMessage>
                                                                                {errors.clientInformation?.currency?.message}
                                                                            </FormErrorMessage>
                                                                        </Flex>
                                                                    </FormControl>
                                                                    <FormControl isInvalid={!!errors.clientInformation?.roundingScheme}>
                                                                        <FormLabel htmlFor={`clientInformation.roundingScheme`}>Rounding scheme</FormLabel>
                                                                        <Flex flexDirection="column">
                                                                            <Select
                                                                                id='roundingScheme'
                                                                                variant="filled"
                                                                                placeholder="Select option"
                                                                                {...register(`clientInformation.roundingScheme`, {
                                                                                    required: 'Rounding scheme is required',
                                                                                })}>
                                                                                {invoiceOptionsData.roundingScheme.map(item => {
                                                                                    return (
                                                                                        <option key={item} value={item}>{item}</option>
                                                                                    )
                                                                                })}
                                                                            </Select>
                                                                            <FormErrorMessage>
                                                                                {errors.clientInformation?.roundingScheme?.message}
                                                                            </FormErrorMessage>
                                                                        </Flex>
                                                                    </FormControl>
                                                                </FormLayout>
                                                            </FormLayout>
                                                        </CardBody>
                                                    </Card>
                                                </Section>
                                                {
                                                    invoiceOptionsData.activeIntegrations["ECONOMIC"]
                                                        ? <Section
                                                            title="E-conomic"
                                                            description="Decide which options are default when exporting an invoice to economic."
                                                            variant="annotated"
                                                        >
                                                            <Card>
                                                                <CardBody>
                                                                    <FormLayout>
                                                                        <FormLayout>
                                                                            <FormLayout>
                                                                                <FormControl isInvalid={!!errors.economicOptions?.customer}>
                                                                                    <FormLabel htmlFor={`economicOptions.customer`}>Pick E-conomic Customer</FormLabel>
                                                                                    <Flex flexDirection="column">
                                                                                        <Select
                                                                                            id='customer'
                                                                                            variant="filled"
                                                                                            placeholder="Select Customer"
                                                                                            {...register(`economicOptions.customer`, {
                                                                                                required: "Customer is required"
                                                                                            })}>
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
                                                                            {economicCustomer ?
                                                                                (
                                                                                    economicIsLoading || !economicData
                                                                                        ? <Center>
                                                                                            <Spinner></Spinner>
                                                                                        </Center>
                                                                                        : <>
                                                                                        <FormLayout>
                                                                                            <FormLayout templateColumns={{ base: "", lg: "auto 25% 25%", xl: "auto 25% 25%" }} columns={{ base: 1, lg: 4, xl: 4 }}>
                                                                                                <FormControl isInvalid={!!errors.economicOptions?.text1}>
                                                                                                    <FormLabel htmlFor={`economicOptions.text1`}>Text 1</FormLabel>
                                                                                                    <Flex flexDirection="column">
                                                                                                        <Textarea
                                                                                                            id='text1'
                                                                                                            placeholder="Enter Text 1"
                                                                                                            variant="filled"
                                                                                                            {...register(`economicOptions.text1`, {
                                                                                                                required: 'Text 1 is required',
                                                                                                            })}
                                                                                                        />
                                                                                                        <FormErrorMessage>
                                                                                                            {errors.economicOptions?.text1?.message}
                                                                                                        </FormErrorMessage>
                                                                                                    </Flex>
                                                                                                </FormControl>
                                                                                                <FormControl isInvalid={!!errors.clientInformation?.pricePerHour}>
                                                                                                    <FormLabel htmlFor={`clientInformation.pricePerHour`}>Price per hour</FormLabel>
                                                                                                    <Flex flexDirection="column">
                                                                                                        <Input
                                                                                                            id='pricePerHour'
                                                                                                            type="number"
                                                                                                            placeholder="Enter Price per Hour"
                                                                                                            variant="filled"
                                                                                                            {...register(`clientInformation.pricePerHour`, {
                                                                                                                valueAsNumber: true,
                                                                                                                min: { value: 0, message: "Price per hour must be larger than 0" },
                                                                                                                required: 'Price per hour is required'
                                                                                                            })}
                                                                                                        />
                                                                                                        <FormErrorMessage>
                                                                                                            {errors.clientInformation?.pricePerHour?.message}
                                                                                                        </FormErrorMessage>
                                                                                                    </Flex>
                                                                                                </FormControl>


                                                                                                <FormLayout>
                                                                                                    <FormControl isInvalid={!!errors.economicOptions?.unit}>
                                                                                                        <FormLabel htmlFor={`economicOptions.unit`}>Unit</FormLabel>
                                                                                                        <Flex flexDirection="column">
                                                                                                            <Select
                                                                                                                id='status'
                                                                                                                variant="filled"
                                                                                                                placeholder="Select Unit"
                                                                                                                {...register(`economicOptions.unit`, {
                                                                                                                    required: 'Unit is required',
                                                                                                                })}>
                                                                                                                {economicData.units.map(item => {
                                                                                                                    return (<option key={item.unitNumber} value={item.unitNumber}>{item.name}</option>)
                                                                                                                })}
                                                                                                            </Select>
                                                                                                            <FormErrorMessage>
                                                                                                                {errors.economicOptions?.unit?.message}
                                                                                                            </FormErrorMessage>
                                                                                                        </Flex>
                                                                                                    </FormControl>

                                                                                                </FormLayout>
                                                                                            </FormLayout>
                                                                                            <FormLayout columns={{ base: 1, lg: 3, xl: 3 }}>
                                                                                                <FormControl isInvalid={!!errors.economicOptions?.customerContact}>
                                                                                                    <FormLabel htmlFor={`economicOptions.customerContact`}>Customer Contact</FormLabel>
                                                                                                    <Flex flexDirection="column">
                                                                                                        <Select
                                                                                                            id='customerContact'
                                                                                                            variant="filled"
                                                                                                            placeholder="Select Customer Contact"
                                                                                                            {...register(`economicOptions.customerContact`, {
                                                                                                                required: 'Customer Contact is required',
                                                                                                            })}>
                                                                                                            {economicData.customerContacts.map(item => {
                                                                                                                return (<option key={item.customerContactNumber} value={item.customerContactNumber}>{item.name}</option>)
                                                                                                            })}
                                                                                                        </Select>
                                                                                                        <FormErrorMessage>
                                                                                                            {errors.economicOptions?.customerContact?.message}
                                                                                                        </FormErrorMessage>
                                                                                                    </Flex>
                                                                                                </FormControl>
                                                                                                <FormLayout>
                                                                                                    <FormControl isInvalid={!!errors.economicOptions?.ourReference}>
                                                                                                        <FormLabel htmlFor={`economicOptions.ourReference`}>Our Reference</FormLabel>
                                                                                                        <Flex flexDirection="column">
                                                                                                            <Select
                                                                                                                id='ourReference'
                                                                                                                variant="filled"
                                                                                                                placeholder="Select Our Reference"
                                                                                                                {...register(`economicOptions.ourReference`, {
                                                                                                                    required: 'Our reference is required',
                                                                                                                })}>
                                                                                                                {economicData.ourReferences.map(item => {
                                                                                                                    return (<option key={item.employeeNumber} value={item.employeeNumber}>{item.name}</option>)
                                                                                                                })}
                                                                                                            </Select>
                                                                                                            <FormErrorMessage>
                                                                                                                {errors.economicOptions?.ourReference?.message}
                                                                                                            </FormErrorMessage>
                                                                                                        </Flex>
                                                                                                    </FormControl>
                                                                                                </FormLayout>
                                                                                                <FormLayout>
                                                                                                    <FormControl isInvalid={!!errors.economicOptions?.layout}>
                                                                                                        <FormLabel htmlFor={`economicOptions.layout`}>Layout</FormLabel>
                                                                                                        <Flex flexDirection="column">
                                                                                                            <Select
                                                                                                                id='layout'
                                                                                                                variant="filled"
                                                                                                                placeholder="Select Layout"
                                                                                                                {...register(`economicOptions.layout`, {
                                                                                                                    required: 'Layout is required',
                                                                                                                })}>
                                                                                                                {economicData.layouts.map(item => {
                                                                                                                    return (<option key={item.layoutNumber} value={item.layoutNumber}>{item.name}</option>)
                                                                                                                })}
                                                                                                            </Select>
                                                                                                            <FormErrorMessage>
                                                                                                                {errors.economicOptions?.layout?.message}
                                                                                                            </FormErrorMessage>
                                                                                                        </Flex>
                                                                                                    </FormControl>
                                                                                                </FormLayout>
                                                                                            </FormLayout>
                                                                                            <FormLayout columns={3}>
                                                                                                <FormLayout>
                                                                                                    <FormControl isInvalid={!!errors.economicOptions?.vatZone}>
                                                                                                        <FormLabel htmlFor={`economicOptions.vatZone`}>Vat Zone</FormLabel>
                                                                                                        <Flex flexDirection="column">
                                                                                                            <Select
                                                                                                                id='vatZone'
                                                                                                                variant="filled"
                                                                                                                placeholder="Select Vat Zone"
                                                                                                                {...register(`economicOptions.vatZone`, {
                                                                                                                    required: 'Vat Zone is required',
                                                                                                                })}>
                                                                                                                {economicData.vatZones.map(item => {
                                                                                                                    return (<option key={item.vatZoneNumber} value={item.vatZoneNumber}>{item.name}</option>)
                                                                                                                })}
                                                                                                            </Select>
                                                                                                            <FormErrorMessage>
                                                                                                                {errors.economicOptions?.vatZone?.message}
                                                                                                            </FormErrorMessage>
                                                                                                        </Flex>
                                                                                                    </FormControl>
                                                                                                </FormLayout>
                                                                                                <FormLayout>
                                                                                                    <FormControl isInvalid={!!errors.economicOptions?.paymentTerms}>
                                                                                                        <FormLabel htmlFor={`economicOptions.paymentTerms`}>Payment Terms</FormLabel>
                                                                                                        <Flex flexDirection="column">
                                                                                                            <Select
                                                                                                                id='paymentTerms'
                                                                                                                variant="filled"
                                                                                                                placeholder="Select Payment Terms"
                                                                                                                {...register(`economicOptions.paymentTerms`, {
                                                                                                                    required: 'Payment Terms is required',
                                                                                                                })}>
                                                                                                                {economicData.paymentTerms.map(item => {
                                                                                                                    return (<option key={item.paymentTermNumber} value={item.paymentTermNumber}>{item.name}</option>)
                                                                                                                })}
                                                                                                            </Select>
                                                                                                            <FormErrorMessage>
                                                                                                                {errors.economicOptions?.layout?.message}
                                                                                                            </FormErrorMessage>
                                                                                                        </Flex>
                                                                                                    </FormControl>
                                                                                                </FormLayout>
                                                                                                <FormLayout>
                                                                                                    <FormControl isInvalid={!!errors.economicOptions?.product}>
                                                                                                        <FormLabel htmlFor={`economicOptions.product`}>Product</FormLabel>
                                                                                                        <Flex flexDirection="column">
                                                                                                            <Select
                                                                                                                id='product'
                                                                                                                variant="filled"
                                                                                                                placeholder="Select Product"
                                                                                                                {...register(`economicOptions.product`, {
                                                                                                                    required: 'Product is required',
                                                                                                                })}>
                                                                                                                {economicData.products.map(item => {
                                                                                                                    return (<option key={item.productNumber} value={item.productNumber}>{item.name}</option>)
                                                                                                                })}
                                                                                                            </Select>
                                                                                                            <FormErrorMessage>
                                                                                                                {errors.economicOptions?.product?.message}
                                                                                                            </FormErrorMessage>
                                                                                                        </Flex>
                                                                                                    </FormControl>
                                                                                                </FormLayout>
                                                                                            </FormLayout>
                                                                                            </FormLayout>
                                                                                        </>)
                                                                                : null}
                                                                        </FormLayout>
                                                                    </FormLayout>
                                                                </CardBody>
                                                            </Card>
                                                        </Section>
                                                        : null
                                                }
                                            </VStack>
                                            <Flex justifyContent="end">
                                                <Button isLoading={mutation.isLoading} colorScheme="primary" type="submit">Create client</Button>
                                            </Flex>
                                        </>
                                }
                            </CardBody>
                        </form>
                    </Card>
                </Stack>
            </PageBody>
        </Page>
    )
}

export default Create;