import { Button, Center, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Spinner, StackDivider, Text, Textarea, useColorMode, VStack } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect } from 'react';

import { Card, CardBody, FormLayout } from "@saas-ui/react";
import { Section } from '@saas-ui/pro';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { trpc } from '../../../../utils/trpc';
import useInvoiceStore, { InvoiceInformationState, PickedHubspotTicket } from '../../../../../store/invoiceStore';

interface IProps {
    setStep: Dispatch<SetStateAction<number>>
}

export interface FormInvoiceState {
    invoiceInformation: {
        title: string,
        description: string,
        currency: string,
        dueDate: string,
        roundingScheme: string,
    },

    economicOptions: {
        exportToEconomic: boolean
        customer: string
        customerPrice: number
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

const InvoiceInformation = (props: IProps) => {
    const { setStep } = props
    const store = useInvoiceStore()

    const invoiceInformationForm = useForm<FormInvoiceState>({
        reValidateMode: "onSubmit",
        defaultValues: {
            invoiceInformation: {
                title: store.title,
                description: store.description,
                currency: store.currency,
                dueDate: moment(store.dueDate).format("YYYY-MM-DD"),
                roundingScheme: store.roundingScheme,
            },
            economicOptions: {
                exportToEconomic: store.economicOptions.exportToEconomic,
                customer: store.economicOptions.customer,
                customerPrice: store.economicOptions.customerPrice,
                text1: store.economicOptions.text1,
                ourReference: store.economicOptions.ourReference,
                customerContact: store.economicOptions.customerContact,
                unit: store.economicOptions.unit,
                layout: store.economicOptions.layout,
                vatZone: store.economicOptions.vatZone,
                paymentTerms: store.economicOptions.paymentTerms,
                product: store.economicOptions.product,
            }
        },
    });

    const exportToEconomicField = invoiceInformationForm.watch("economicOptions.exportToEconomic")
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
        const unitName = economicData?.units.find(x => x.unitNumber === parseInt(data.economicOptions.unit))?.name ?? ""
        const layoutName = economicData?.layouts.find(x => x.layoutNumber === parseInt(data.economicOptions.layout))?.name ?? ""
        const vatZoneName = economicData?.vatZones.find(x => x.vatZoneNumber === parseInt(data.economicOptions.vatZone))?.name ?? ""
        const paymentTermsName = economicData?.paymentTerms.find(x => x.paymentTermNumber === parseInt(data.economicOptions.paymentTerms))?.name ?? ""
        const productName = economicData?.products.find(x => x.productNumber.toString() === data.economicOptions.product)?.name ?? ""

        store.setInvoiceInformation({
            ...data.invoiceInformation,
            ...dateFields,
            economicOptions: {
                ...data.economicOptions,
                customerName: customerName,
                ourReferenceName: ourReferenceName,
                customerContactName: ourContactName,
                unitName: unitName,
                layoutName: layoutName,
                vatZoneName: vatZoneName,
                paymentTermsName: paymentTermsName,
                productName: productName
            }
        })

        setStep((step) => step + 1)
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
    }, [economicCustomer, economicRefetch])
    const { toggleColorMode, colorMode } = useColorMode()
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
                                                <FormLayout>
                                                    <FormControl isInvalid={!!errors.invoiceInformation?.description}>
                                                        <FormLabel htmlFor={`invoiceInformation.description`}>Description</FormLabel>
                                                        <Flex flexDirection="column">
                                                            <Textarea
                                                                id='description'
                                                                placeholder="Enter description"
                                                                variant="filled"
                                                                {...register(`invoiceInformation.description`)}
                                                            />
                                                            <FormErrorMessage>
                                                                {errors.invoiceInformation?.description?.message}
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
                                {
                                    invoiceOptionsData.activeIntegrations["ECONOMIC"]
                                        ? <Section
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
                                                                        {...register(`economicOptions.customer`, {
                                                                            required: 'Customer is required',
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

                                                        {exportToEconomicField && economicCustomer
                                                            ? <FormLayout>
                                                                <FormControl isInvalid={!!errors.economicOptions?.customerPrice}>
                                                                    <FormLabel htmlFor={`economicOptions.customerPrice`}>Pick E-conomic Customer Price</FormLabel>
                                                                    <Flex flexDirection="column">
                                                                        <Input
                                                                            id='customerPrice'
                                                                            type="number"
                                                                            isDisabled={!exportToEconomicField}
                                                                            placeholder="Enter Customer Price"
                                                                            variant="filled"
                                                                            {...register(`economicOptions.customerPrice`, {
                                                                                valueAsNumber: true,
                                                                                required: 'Customer price is required'
                                                                            })}
                                                                        />
                                                                        <FormErrorMessage>
                                                                            {errors.economicOptions?.customerPrice?.message}
                                                                        </FormErrorMessage>
                                                                    </Flex>
                                                                </FormControl>
                                                            </FormLayout>
                                                            : null}

                                                        {exportToEconomicField && economicCustomer && economicCustomerPrice ? <>
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
                                                                                    id='ourReference'
                                                                                    isDisabled={!exportToEconomicField}
                                                                                    variant="filled"
                                                                                    placeholder="Select Our Reference"
                                                                                    {...register(`economicOptions.ourReference`, {
                                                                                        required: 'Our reference is required',
                                                                                    })}>
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
                                                                                    id='customerContact'
                                                                                    isDisabled={!exportToEconomicField}
                                                                                    variant="filled"
                                                                                    placeholder="Select Customer Contact"
                                                                                    {...register(`economicOptions.customerContact`, {
                                                                                        required: 'Customer Contact is required',
                                                                                    })}>
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
                                                                <FormLayout columns={2}>
                                                                    <FormLayout>
                                                                        <FormControl isInvalid={!!errors.economicOptions?.unit}>
                                                                            <FormLabel htmlFor={`economicOptions.unit`}>Unit</FormLabel>
                                                                            <Flex flexDirection="column">
                                                                                <Select
                                                                                    id='status'
                                                                                    isDisabled={!exportToEconomicField}
                                                                                    variant="filled"
                                                                                    placeholder="Select Unit"
                                                                                    {...register(`economicOptions.unit`, {
                                                                                        required: 'Unit is required',
                                                                                    })}>
                                                                                    {
                                                                                        !economicIsRefetching || economicIsLoading || !economicData
                                                                                            ? economicData?.units.map(item => {
                                                                                                return (<option key={item.unitNumber} value={item.unitNumber}>{item.name}</option>)
                                                                                            })
                                                                                            : null
                                                                                    }
                                                                                </Select>
                                                                                <FormErrorMessage>
                                                                                    {errors.economicOptions?.unit?.message}
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
                                                                                    isDisabled={!exportToEconomicField}
                                                                                    variant="filled"
                                                                                    placeholder="Select Layout"
                                                                                    {...register(`economicOptions.layout`, {
                                                                                        required: 'Layout is required',
                                                                                    })}>
                                                                                    {
                                                                                        !economicIsRefetching || economicIsLoading || !economicData
                                                                                            ? economicData?.layouts.map(item => {
                                                                                                return (<option key={item.layoutNumber} value={item.layoutNumber}>{item.name}</option>)
                                                                                            })
                                                                                            : null
                                                                                    }
                                                                                </Select>
                                                                                <FormErrorMessage>
                                                                                    {errors.economicOptions?.layout?.message}
                                                                                </FormErrorMessage>
                                                                            </Flex>
                                                                        </FormControl>
                                                                    </FormLayout>
                                                                </FormLayout>
                                                                <FormLayout columns={2}>
                                                                    <FormLayout>
                                                                        <FormControl isInvalid={!!errors.economicOptions?.vatZone}>
                                                                            <FormLabel htmlFor={`economicOptions.vatZone`}>Vat Zone</FormLabel>
                                                                            <Flex flexDirection="column">
                                                                                <Select
                                                                                    id='vatZone'
                                                                                    isDisabled={!exportToEconomicField}
                                                                                    variant="filled"
                                                                                    placeholder="Select Vat Zone"
                                                                                    {...register(`economicOptions.vatZone`, {
                                                                                        required: 'Vat Zone is required',
                                                                                    })}>
                                                                                    {
                                                                                        !economicIsRefetching || economicIsLoading || !economicData
                                                                                            ? economicData?.vatZones.map(item => {
                                                                                                return (<option key={item.vatZoneNumber} value={item.vatZoneNumber}>{item.name}</option>)
                                                                                            })
                                                                                            : null
                                                                                    }
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
                                                                                    isDisabled={!exportToEconomicField}
                                                                                    variant="filled"
                                                                                    placeholder="Select Payment Terms"
                                                                                    {...register(`economicOptions.paymentTerms`, {
                                                                                        required: 'Payment Terms is required',
                                                                                    })}>
                                                                                    {
                                                                                        !economicIsRefetching || economicIsLoading || !economicData
                                                                                            ? economicData?.paymentTerms.map(item => {
                                                                                                return (<option key={item.paymentTermNumber} value={item.paymentTermNumber}>{item.name}</option>)
                                                                                            })
                                                                                            : null
                                                                                    }
                                                                                </Select>
                                                                                <FormErrorMessage>
                                                                                    {errors.economicOptions?.layout?.message}
                                                                                </FormErrorMessage>
                                                                            </Flex>
                                                                        </FormControl>
                                                                    </FormLayout>
                                                                </FormLayout>
                                                                <FormLayout columns={2}>
                                                                    <FormLayout>
                                                                        <FormControl isInvalid={!!errors.economicOptions?.product}>
                                                                            <FormLabel htmlFor={`economicOptions.product`}>Product</FormLabel>
                                                                            <Flex flexDirection="column">
                                                                                <Select
                                                                                    id='product'
                                                                                    isDisabled={!exportToEconomicField}
                                                                                    variant="filled"
                                                                                    placeholder="Select Product"
                                                                                    {...register(`economicOptions.product`, {
                                                                                        required: 'Product is required',
                                                                                    })}>
                                                                                    {
                                                                                        !economicIsRefetching || economicIsLoading || !economicData
                                                                                            ? economicData?.products.map(item => {
                                                                                                return (<option key={item.productNumber} value={item.productNumber}>{item.name}</option>)
                                                                                            })
                                                                                            : null
                                                                                    }
                                                                                </Select>
                                                                                <FormErrorMessage>
                                                                                    {errors.economicOptions?.product?.message}
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
                                        : null
                                }
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

export default InvoiceInformation;