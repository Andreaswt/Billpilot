import { AddIcon, CloseIcon, MinusIcon } from '@chakra-ui/icons'
import { Badge, Button, Select, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Icon, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Text, Wrap } from '@chakra-ui/react'
import { Currency, InvoiceTemplateFilterTypes } from '@prisma/client'
import { Card, CardBody, Divider, useFieldArray, useForm, useSnackbar, FormLayout } from '@saas-ui/react'
import { useRouter } from 'next/router'
import * as React from 'react'
import { FaFileInvoiceDollar } from 'react-icons/fa'
import { trpc } from '../../../../utils/trpc'
import { Filters } from './filters'

interface Props {
    changeTabs(index: number): void
    currency?: Currency
}

export interface InvoiceTemplateForm {
    title: string,
    active: string,
    fixedPriceTimeItems: {
        name: string,
        amount: number,
    }[],
}

export const CreateInvoiceTemplate: React.FC<Props> = (props) => {
    const [filters, setFilters] = React.useState<{ id: string, name: string, type: string, provider: InvoiceTemplateFilterTypes }[]>([])

    const router = useRouter()
    const snackbar = useSnackbar()

    const fixedPriceTimeItemsForm = useForm<InvoiceTemplateForm>({
        reValidateMode: "onSubmit",
        defaultValues: {
            title: "",
            active: "active",
            fixedPriceTimeItems: [{ name: '', amount: 0 }],
        },
    });

    const createInvoiceTemplate = trpc.useMutation('invoiceTemplates.create', {
        onSuccess() {
            props.changeTabs(1)
        }
    });

    const { register, control, handleSubmit, reset, formState, watch, setValue } = fixedPriceTimeItemsForm

    const {
        fields,
        append,
        remove,
        update
    } = useFieldArray({
        rules: { maxLength: 5 },
        control,
        name: "fixedPriceTimeItems"
    });

    const { errors } = formState;

    async function onSubmit(data: InvoiceTemplateForm) {
        const active = data.active === "active" ? true : false

        const clientId = router.query?.id as string
        if (!clientId) {
            snackbar({
                title: 'Invoice template could not be created',
                description: 'Client id was not found',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })

            return
        }

        createInvoiceTemplate.mutate({ ...data, clientId: clientId, active: active, filters: filters })
    }

    const removeFilter = (id: string) => {
        setFilters(prev => prev.filter(x => x.id !== id))
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={4}>
                    <Flex justifyContent="space-between">
                        <FormLayout>
                            <Stack>
                                <Heading color="primary" size="md">Title</Heading>
                                <FormControl isInvalid={!!errors.title}>
                                    <Flex flexDirection="column">
                                        <Input
                                            width="md"
                                            id='title'
                                            placeholder="Enter title"
                                            variant="filled"
                                            {...register(`title`, {
                                                required: 'Title is required',
                                            })}
                                        />
                                        <FormErrorMessage>
                                            {errors.title?.message}
                                        </FormErrorMessage>
                                    </Flex>
                                </FormControl>
                            </Stack>
                        </FormLayout>


                        <Flex justifyContent="space-between" gap={4}>
                            <Select
                                id="active"
                                {...register(`active`)}>
                                <option key="Active" value="active">Active</option>
                                <option key="Inactive" value="inactive">Inactive</option>
                            </ Select>
                            <Button type='submit' colorScheme="primary">Save</Button>
                        </Flex>
                    </Flex>

                    <Stack gap={6}>
                        <Stack>
                            <Flex justifyContent="start">
                                <Heading color="primary" size="md">Time items</Heading>
                            </Flex>
                            <Card>
                                <CardBody>
                                    <Stack gap={2}>
                                        {filters.length > 0
                                            ? <>
                                                <Divider orientation="horizontal" label="Filters" />
                                                <Flex justifyContent="start">
                                                    <Wrap>
                                                        {
                                                            filters.map(filter => {
                                                                let color = "green"
                                                                switch (filter.type) {
                                                                    case "Project":
                                                                        color = "green"
                                                                        break;
                                                                    case "Employee":
                                                                        color = "red"
                                                                        break;
                                                                }

                                                                return (
                                                                    <Card key={filter.id}>
                                                                        <CardBody p={2}>
                                                                            <HStack>
                                                                                <Badge colorScheme={color}>{filter.type}</Badge>
                                                                                <Text fontSize='xs'>{filter.name}</Text>
                                                                                <IconButton onClick={() => removeFilter(filter.id)} ml={4} aria-label='Remove' size={"xs"} icon={<CloseIcon />} />
                                                                            </HStack>
                                                                        </CardBody>
                                                                    </Card>
                                                                )
                                                            })
                                                        }
                                                    </Wrap>
                                                </Flex>
                                            </>
                                            : null}
                                        <Filters filters={filters} setFilters={setFilters} />
                                    </Stack>
                                </CardBody>
                            </Card>
                        </Stack>

                        <Stack>
                            <Flex justifyContent="start">
                                <Heading color="primary" size="md">Fixed price time items</Heading>
                            </Flex>
                            <Card>
                                <CardBody>
                                    <Stack gap={2}>
                                        {fields.map((item, index) => {
                                            return (
                                                <React.Fragment key={item.id}>
                                                    <Stack gap={2}>
                                                        <Flex justifyContent="space-between" gap={4}>
                                                            <FormControl isInvalid={!!errors.fixedPriceTimeItems?.[index]?.name}>
                                                                <Flex alignItems="end" gap={4}>
                                                                    <IconButton mb={0.5} aria-label='Remove Fixed Price Time Item' icon={<MinusIcon />} onClick={() => remove(index)} />
                                                                    <Icon mb={2} h={6} w={6} as={FaFileInvoiceDollar} />
                                                                    <Stack>
                                                                        <FormLabel fontSize="sm" htmlFor={`fixedPriceTimeItems.${index}.name`}>Name</FormLabel>
                                                                        <Input
                                                                            width="xs"
                                                                            id='name'
                                                                            placeholder="Monthly retainer"
                                                                            variant="filled"
                                                                            {...register(`fixedPriceTimeItems.${index}.name`, {
                                                                                required: 'Name is required',
                                                                                minLength: { value: 0, message: 'Name must be defined' },
                                                                            })}
                                                                        />
                                                                    </Stack>
                                                                    <FormErrorMessage>
                                                                        {errors.fixedPriceTimeItems?.[index]?.name?.message}
                                                                    </FormErrorMessage>
                                                                </Flex>
                                                            </FormControl>

                                                            <Flex alignItems="end" gap={4}>
                                                                <FormControl isInvalid={!!errors.fixedPriceTimeItems?.[index]?.amount}>
                                                                    <FormLabel fontSize="sm" htmlFor={`timeItems.${index}.amount`}>Amount</FormLabel>
                                                                    <Flex flexDirection="column">
                                                                        <InputGroup>
                                                                            <InputLeftAddon>{props.currency}</InputLeftAddon>
                                                                            <NumberInput
                                                                                id='amount'
                                                                                placeholder="Enter Amount"
                                                                                variant="filled">
                                                                                <NumberInputField
                                                                                    {...register(`fixedPriceTimeItems.${index}.amount`, {
                                                                                        valueAsNumber: true,
                                                                                        required: 'Time is required',
                                                                                        min: { value: 0, message: "Time must be larger than 0" },
                                                                                    })} />
                                                                                <NumberInputStepper>
                                                                                    <NumberIncrementStepper />
                                                                                    <NumberDecrementStepper />
                                                                                </NumberInputStepper>
                                                                            </NumberInput>
                                                                        </InputGroup>
                                                                        <FormErrorMessage>
                                                                            {errors.fixedPriceTimeItems?.[index]?.amount?.message}
                                                                        </FormErrorMessage>
                                                                    </Flex>
                                                                </FormControl>
                                                            </Flex>
                                                        </Flex>
                                                    </Stack>
                                                    {fields.length > 0 && index !== 4 ? <Divider /> : <></>}
                                                </React.Fragment>
                                            );
                                        })}
                                        {
                                            fields.length < 5
                                                ? <>
                                                    <Flex justifyContent="start">
                                                        <Button onClick={() => append({ name: '', amount: 0 })} leftIcon={<AddIcon />} colorScheme='primary'>
                                                            Add item
                                                        </Button>
                                                    </Flex>
                                                </>
                                                : null
                                        }
                                    </Stack>
                                </CardBody>
                            </Card>
                        </Stack>
                    </Stack>
                </Stack>
            </form>
        </>
    )
}
