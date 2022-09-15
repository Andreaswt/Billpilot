import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Textarea, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

import { Card, CardBody, Divider, FormLayout } from "@saas-ui/react";

import moment from 'moment';
import { useForm } from 'react-hook-form';
import useCreateInvoiceStore from '../../../../store/invoice';

interface IProps {
    setStep: Dispatch<SetStateAction<number>>
}

const EconomicOptions = (props: IProps) => {
    const { setStep } = props
    const store = useCreateInvoiceStore();

    const invoiceInformationForm = useForm({
        reValidateMode: "onSubmit",
        defaultValues: {
            invoiceInformation: {
                title: store.title,
                status: store.status,
                invoiceNumber: store.invoiceNumber,
                currency: store.currency,
                invoicedDatesFrom: moment(store.invoicedDatesFrom).format("YYYY-MM-DD"),
                invoicedDatesTo: moment(store.invoicedDatesTo).format("YYYY-MM-DD"),
                issueDate: moment(store.issueDate).format("YYYY-MM-DD"),
                dueDate: moment(store.dueDate).format("YYYY-MM-DD"),
                roundingScheme: store.roundingScheme,
                client: store.client,
                invoiceLayout: store.invoiceLayout,
                notesForClient: store.notesForClient
            },
            economicOptions: {
                text1: store.text1,
                ourReference: store.ourReference,
                customerContact: store.customerContact
            }
        },
    });

    const { register, control, handleSubmit, reset, formState, watch, setValue } = invoiceInformationForm
    const { errors } = formState;

    function onSubmit(data: FormInvoiceState) {
        const dateFields = {
            invoicedDatesFrom: new Date(data.invoiceInformation.invoicedDatesFrom),
            invoicedDatesTo: new Date(data.invoiceInformation.invoicedDatesTo),
            issueDate: new Date(data.invoiceInformation.issueDate),
            dueDate: new Date(data.invoiceInformation.dueDate),

        }
        store.setInvoice({ ...data.invoiceInformation, ...dateFields })
        setStep((step) => step + 1)
    }

    interface FormInvoiceState {
        invoiceInformation: {
            title: string,
            status: string,
            invoiceNumber: string,
            currency: string,
            invoicedDatesFrom: string,
            invoicedDatesTo: string,
            issueDate: string,
            dueDate: string,
            roundingScheme: string,
            client: string,
            invoiceLayout: string,
            notesForClient: string,
        },

        economicOptions: {
            text1: string
            ourReference: string
            customerContact: string
        }
    }

    return (
        <Card title={
            <Flex>
                <Heading>Create Invoice</Heading>
            </Flex>}>
            <CardBody>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                            <FormControl isInvalid={!!errors.invoiceInformation?.status}>
                                <FormLabel htmlFor={`invoiceInformation.status`}>Status</FormLabel>
                                <Flex flexDirection="column">
                                    <Select
                                        id='status'
                                        variant="filled"
                                        placeholder="Select option"
                                        {...register(`invoiceInformation.status`)}>
                                        <option value="Scheme 1">Scheme 1</option>
                                        <option value="Scheme 2">Scheme 2</option>
                                    </Select>
                                    <FormErrorMessage>
                                        {errors.invoiceInformation?.status?.message}
                                    </FormErrorMessage>
                                </Flex>
                            </FormControl>
                            <FormControl isInvalid={!!errors.invoiceInformation?.invoiceNumber}>
                                <FormLabel htmlFor={`invoiceInformation.invoiceNumber`}>Invoice Number</FormLabel>
                                <Flex flexDirection="column">
                                    <Input
                                        id='invoiceNumber'
                                        variant="filled"
                                        {...register(`invoiceInformation.invoiceNumber`)}
                                    />
                                    <FormErrorMessage>
                                        {errors.invoiceInformation?.invoiceNumber?.message}
                                    </FormErrorMessage>
                                </Flex>
                            </FormControl>
                            <FormControl isInvalid={!!errors.invoiceInformation?.currency}>
                                <FormLabel htmlFor={`invoiceInformation.currency`}>Currency</FormLabel>
                                <Flex flexDirection="column">
                                    <Select
                                        id='currency'
                                        variant="filled"
                                        placeholder="Select option"
                                        {...register(`invoiceInformation.currency`)}>
                                        <option value="Scheme 1">Scheme 1</option>
                                        <option value="Scheme 2">Scheme 2</option>
                                    </Select>
                                    <FormErrorMessage>
                                        {errors.invoiceInformation?.currency?.message}
                                    </FormErrorMessage>
                                </Flex>
                            </FormControl>
                        </FormLayout>
                        <FormLayout columns={3}>
                            <FormLayout columns={2}>
                                <FormControl isInvalid={!!errors.invoiceInformation?.invoicedDatesFrom}>
                                    <FormLabel htmlFor={`invoiceInformation.invoicedDatesFrom`}>Invoice from</FormLabel>
                                    <Flex flexDirection="column">
                                        <Input
                                            id='invoicedDatesFrom'
                                            type="date"
                                            variant="filled"
                                            {...register(`invoiceInformation.invoicedDatesFrom`)}
                                        />
                                        <FormErrorMessage>
                                            {errors.invoiceInformation?.invoicedDatesFrom?.message}
                                        </FormErrorMessage>
                                    </Flex>
                                </FormControl>
                                <FormControl isInvalid={!!errors.invoiceInformation?.invoicedDatesTo}>
                                    <FormLabel htmlFor={`invoiceInformation.invoicedDatesTo`}>Invoice to</FormLabel>
                                    <Flex flexDirection="column">
                                        <Input
                                            id='invoicedDatesTo'
                                            type="date"
                                            variant="filled"
                                            {...register(`invoiceInformation.invoicedDatesTo`)}
                                        />
                                        <FormErrorMessage>
                                            {errors.invoiceInformation?.invoicedDatesTo?.message}
                                        </FormErrorMessage>
                                    </Flex>
                                </FormControl>
                            </FormLayout>
                            <FormControl isInvalid={!!errors.invoiceInformation?.issueDate}>
                                <FormLabel htmlFor={`invoiceInformation.issueDate`}>Issue Date</FormLabel>
                                <Flex flexDirection="column">
                                    <Input
                                        id='issueDate'
                                        type="date"
                                        variant="filled"
                                        {...register(`invoiceInformation.issueDate`)}
                                    />
                                    <FormErrorMessage>
                                        {errors.invoiceInformation?.issueDate?.message}
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
                        </FormLayout>
                        <FormLayout columns={3}>
                            <FormControl isInvalid={!!errors.invoiceInformation?.roundingScheme}>
                                <FormLabel htmlFor={`invoiceInformation.roundingScheme`}>Rounding scheme</FormLabel>
                                <Flex flexDirection="column">
                                    <Select
                                        id='roundingScheme'
                                        variant="filled"
                                        placeholder="Select option"
                                        {...register(`invoiceInformation.roundingScheme`)}>
                                        <option value="Scheme 1">Scheme 1</option>
                                        <option value="Scheme 2">Scheme 2</option>
                                    </Select>
                                    <FormErrorMessage>
                                        {errors.invoiceInformation?.roundingScheme?.message}
                                    </FormErrorMessage>
                                </Flex>
                            </FormControl>

                            <FormControl isInvalid={!!errors.invoiceInformation?.client}>
                                <FormLabel htmlFor={`invoiceInformation.client`}>Client</FormLabel>
                                <Flex flexDirection="column">
                                    <Select
                                        id='client'
                                        variant="filled"
                                        placeholder="Select option"
                                        {...register(`invoiceInformation.client`)}>
                                        <option value="Client 1">Client 1</option>
                                        <option value="Client 2">Client 2</option>
                                    </Select>
                                    <FormErrorMessage>
                                        {errors.invoiceInformation?.client?.message}
                                    </FormErrorMessage>
                                </Flex>
                            </FormControl>
                            <FormControl isInvalid={!!errors.invoiceInformation?.invoiceLayout}>
                                <FormLabel htmlFor={`invoiceInformation.invoiceLayout`}>Invoice Layout</FormLabel>
                                <Flex flexDirection="column">
                                    <Select
                                        id='invoiceLayout'
                                        variant="filled"
                                        placeholder="Select option"
                                        {...register(`invoiceInformation.invoiceLayout`)}>
                                        <option value="Layout 1">Layout 1</option>
                                        <option value="Layout 2">Layout 2</option>
                                    </Select>
                                    <FormErrorMessage>
                                        {errors.invoiceInformation?.invoiceLayout?.message}
                                    </FormErrorMessage>
                                </Flex>
                            </FormControl>
                        </FormLayout>
                        <FormLayout>
                            <FormControl isInvalid={!!errors.invoiceInformation?.notesForClient}>
                                <FormLabel htmlFor={`invoiceInformation.notesForClient`}>Notes for Client</FormLabel>
                                <Flex flexDirection="column">
                                    <Textarea
                                        id='notesForClient'
                                        variant="filled"
                                        {...register(`invoiceInformation.notesForClient`)}
                                    />
                                    <FormErrorMessage>
                                        {errors.invoiceInformation?.notesForClient?.message}
                                    </FormErrorMessage>
                                </Flex>
                            </FormControl>
                        </FormLayout>
                    </FormLayout>
                    <Divider mt={4} label='E-conomic options' />
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
                                            <option value="Scheme 1">Scheme 1</option>
                                            <option value="Scheme 2">Scheme 2</option>
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
                                            <option value="Scheme 1">Scheme 1</option>
                                            <option value="Scheme 2">Scheme 2</option>
                                        </Select>
                                        <FormErrorMessage>
                                            {errors.economicOptions?.customerContact?.message}
                                        </FormErrorMessage>
                                    </Flex>
                                </FormControl>
                            </FormLayout>
                        </FormLayout>
                    </FormLayout>
                    <Flex justifyContent="space-between">
                        <Button mt={6} colorScheme="primary" onClick={() => setStep((step) => step - 1)}>Previous</Button>
                        <Button mt={6} colorScheme="primary" type="submit">Next</Button>
                    </Flex>
                </form>
            </CardBody>
        </Card>
    )
}

export default EconomicOptions;