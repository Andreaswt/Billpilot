import { AddIcon, CloseIcon, MinusIcon } from '@chakra-ui/icons'
import { Badge, Button, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Icon, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Text, Wrap } from '@chakra-ui/react'
import { Card, CardBody, Divider, Select, useFieldArray, useForm } from '@saas-ui/react'
import * as React from 'react'
import { FaFileInvoiceDollar } from 'react-icons/fa'
import { HiReceiptTax } from "react-icons/hi"
import { trpc } from '../../../../utils/trpc'
import { Filters } from './filters'

interface Props {

}

export interface InvoiceTemplateForm {
    applyTaxToItems: boolean,
    taxName: string,
    taxAmount: number,
    fixedPriceTimeItems: {
        name: string,
        amount: number,
        applyTax: boolean
    }[],
}

export const CreateInvoiceTemplate: React.FC<Props> = (props) => {
    const [activated, setActivated] = React.useState(false)
    const [showTax1, setShowTax1] = React.useState(false)
    const [filters, setFilters] = React.useState<{ id: string, name: string, type: string }[]>([])

    const fixedPriceTimeItemsForm = useForm<InvoiceTemplateForm>({
        reValidateMode: "onSubmit",
        defaultValues: {
            applyTaxToItems: false,
            taxName: "",
            taxAmount: 0,
            fixedPriceTimeItems: [{ name: '', amount: 0, applyTax: false }],
        },
    });

    const createInvoiceTemplate = trpc.useMutation('invoiceTemplates.create', {
        onSuccess() {

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
        createInvoiceTemplate.mutate({ ...data, filters: filters })
    }

    const removeFilter = (id: string) => {
        setFilters(prev => prev.filter(x => x.id !== id))
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={4}>
                    <Flex justifyContent="end">
                        <Flex justifyContent="space-between" gap={4}>
                            <Select
                                value={activated ? "Activated" : "Inactive"}
                                onChange={(value: string | string[]) => setActivated(value === "Activated" ? true : false)}
                                name="activated"
                                placeholder="Activated"
                                options={[
                                    { label: 'Active', value: 'active' },
                                    { label: 'Inactive', value: 'inactive' },
                                ]} />
                            <Button type='submit' colorScheme="primary" h="full">Save</Button>
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
                                                <Flex justifyContent="space-between">
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
                                                    <Stack>
                                                        <FormLabel whiteSpace="nowrap" m={0} fontSize="sm" htmlFor={`applyTaxToItems`}>Apply tax</FormLabel>
                                                        <Flex h="full" gap={4} alignItems="center">
                                                            <Checkbox
                                                                id='applyTaxToItems'
                                                                type="checkbox"
                                                                variant="filled"
                                                                {...register(`applyTaxToItems`)}
                                                            />
                                                            <Icon h={7} w={7} as={HiReceiptTax} />
                                                        </Flex>
                                                    </Stack>
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
                                                                            <InputLeftAddon>USD</InputLeftAddon>
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
                                                                <Stack>
                                                                    <FormLabel whiteSpace="nowrap" m={0} fontSize="sm" htmlFor={`exportToEconomic`}>Apply tax</FormLabel>
                                                                    <Flex h="full" gap={4} alignItems="center">
                                                                        <Checkbox
                                                                            id='applyTax'
                                                                            type="checkbox"
                                                                            variant="filled"
                                                                            {...register(`fixedPriceTimeItems.${index}.applyTax`)}
                                                                        />
                                                                        <Icon h={7} w={7} as={HiReceiptTax} />
                                                                    </Flex>
                                                                </Stack>
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
                                                        <Button onClick={() => append({ name: '', amount: 0, applyTax: false })} leftIcon={<AddIcon />} colorScheme='primary'>
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

                        <Stack>
                            <Flex justifyContent="start">
                                <Heading color="primary" size="md">Taxes</Heading>
                            </Flex>
                            <Card>
                                <CardBody>
                                    <Stack gap={2}>
                                        {
                                            showTax1
                                                ? <Flex gap={4} justifyContent="space-between">
                                                    <FormControl isInvalid={!!errors.taxAmount}>
                                                        <Flex alignItems="end" gap={4}>
                                                            <IconButton mb={0.5} aria-label='Remove VAT' icon={<MinusIcon />} onClick={() => setShowTax1(false)} />
                                                            <Icon mb={2} h={6} w={6} as={HiReceiptTax} />
                                                            <Stack>
                                                                <FormLabel m={0} fontSize="sm" htmlFor={`taxName`}>Tax</FormLabel>
                                                                <Input
                                                                    width="xs"
                                                                    id='tax'
                                                                    placeholder="VAT"
                                                                    variant="filled"
                                                                    {...register(`taxName`, {
                                                                        required: 'Tax name is required',
                                                                        disabled: !showTax1
                                                                    })}
                                                                />
                                                            </Stack>
                                                            <FormErrorMessage>
                                                                {errors?.taxName?.message}
                                                            </FormErrorMessage>
                                                        </Flex>
                                                    </FormControl>
                                                    <Flex>
                                                        <FormControl>
                                                            <FormLabel fontSize="sm" htmlFor={`taxAmount`}>Amount</FormLabel>
                                                            <Flex flexDirection="column">
                                                                <InputGroup>
                                                                    <NumberInput
                                                                        id='amount'
                                                                        placeholder="Enter Amount"
                                                                        variant="filled">
                                                                        <NumberInputField {...register(`taxAmount`, {
                                                                            valueAsNumber: true,
                                                                            disabled: !showTax1,
                                                                            required: 'Tax amount is required',
                                                                            min: { value: 0, message: "Amount must be larger than 0" },
                                                                        })} />
                                                                        <NumberInputStepper>
                                                                            <NumberIncrementStepper />
                                                                            <NumberDecrementStepper />
                                                                        </NumberInputStepper>
                                                                    </NumberInput>
                                                                    <InputRightAddon>%</InputRightAddon>
                                                                </InputGroup>
                                                                <FormErrorMessage>
                                                                    {errors.taxAmount?.message}
                                                                </FormErrorMessage>
                                                            </Flex>
                                                        </FormControl>
                                                    </Flex>
                                                </Flex>
                                                : null
                                        }
                                        {
                                            showTax1 === false
                                                ? <>
                                                    <Flex justifyContent="start">
                                                        <Button onClick={() => setShowTax1(true)} leftIcon={<AddIcon />} colorScheme='primary'>
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
