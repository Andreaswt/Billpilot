import { AddIcon, CloseIcon, MinusIcon } from '@chakra-ui/icons'
import { Button, Checkbox, Flex, FormControl, Text, FormErrorMessage, FormLabel, Heading, Icon, Input, Stack, Wrap, HStack, Badge, IconButton, InputGroup, InputLeftAddon, InputRightAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from '@chakra-ui/react'
import { Card, CardBody, Divider, Select, useFieldArray, useForm } from '@saas-ui/react'
import * as React from 'react'
import { BsClockFill } from 'react-icons/bs'
import { FaFileInvoiceDollar } from 'react-icons/fa'
import { HiReceiptTax } from "react-icons/hi";

interface Props {

}

export const CreateInvoiceTemplate: React.FC<Props> = (props) => {
    const [activated, setActivated] = React.useState(false)
    const [showTax1, setShowTax1] = React.useState(false)

    const fixedPriceTimeItemsForm = useForm({
        reValidateMode: "onSubmit",
        defaultValues: {
            fixedPriceTimeItems: [{ name: '', amount: 0 }],
        },
    });

    // const methods = useFormContext();

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

    return (
        <>
            <Stack gap={4}>
                <Flex justifyContent="end">
                    <Flex justifyContent="space-between" gap={4}>
                        <Select
                            value={activated ? "Activated" : "Inactive"}
                            onChange={(value: string | string[]) => setActivated(value === "Activated" ? true : false)}
                            // onChange={(e: string | string[]) => console.log("hej")}
                            name="activated"
                            placeholder="Activated"
                            options={[
                                { label: 'Active', value: 'active' },
                                { label: 'Inactive', value: 'inactive' },
                            ]} />
                        <Button colorScheme="primary" h="full">Save</Button>
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
                                    <Flex justifyContent="space-between">
                                        <FormControl isInvalid={false}>
                                            <Flex alignItems="end" gap={4}>
                                                <Icon mb={2} h={6} w={6} as={BsClockFill} />
                                                <Stack>
                                                    <FormLabel m={0} fontSize="sm" htmlFor={`title`}>Title</FormLabel>
                                                    <Input
                                                        width="sm"
                                                        id='title'
                                                        placeholder="Enter title"
                                                        variant="filled"
                                                    />
                                                </Stack>
                                                <FormErrorMessage>
                                                    {/* {errors.clientInformation?.name?.message} */}
                                                </FormErrorMessage>
                                            </Flex>
                                        </FormControl>
                                        <Stack>
                                            <FormLabel whiteSpace="nowrap" m={0} fontSize="sm" htmlFor={`exportToEconomic`}>Apply tax</FormLabel>
                                            <Flex h="full" gap={4} alignItems="center">
                                                <Checkbox
                                                    id='exportToEconomic'
                                                    type="checkbox"
                                                    variant="filled"
                                                />
                                                <Icon h={7} w={7} as={HiReceiptTax} />
                                            </Flex>
                                        </Stack>
                                    </Flex>

                                    <Divider orientation="horizontal" label="Filters" />
                                    <Wrap>
                                        <Card>
                                            <CardBody p={2}>
                                                <HStack>
                                                    <Badge colorScheme='green'>{"Project"}</Badge>
                                                    <Text fontSize='xs'>{"Bankly Desktop App (BDA)"}</Text>
                                                    <IconButton onClick={() => console.log("delete")} ml={4} aria-label='Remove' size={"xs"} icon={<CloseIcon />} />
                                                </HStack>
                                            </CardBody>
                                        </Card>
                                        <Card>
                                            <CardBody p={2}>
                                                <HStack>
                                                    <Badge colorScheme='red'>{"Employee"}</Badge>
                                                    <Text fontSize='xs'>{"Carl Larsen (CLA)"}</Text>
                                                    <IconButton onClick={() => console.log("delete")} ml={4} aria-label='Remove' size={"xs"} icon={<CloseIcon />} />
                                                </HStack>
                                            </CardBody>
                                        </Card>
                                    </Wrap>

                                    <Flex justifyContent="start">
                                        <Button leftIcon={<AddIcon />} colorScheme='primary'>
                                            Add filter
                                        </Button>
                                    </Flex>
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
                                    <form onSubmit={() => console.log("he")}>
                                        <Stack gap={6}>
                                            {fields.map((item, index) => {
                                                return (
                                                    <React.Fragment key={item.id}>
                                                        <Stack gap={2}>
                                                            <Flex justifyContent="space-between" gap={4}>
                                                                <FormControl isInvalid={false}>
                                                                    <Flex alignItems="end" gap={4}>
                                                                        <IconButton mb={0.5} aria-label='Create Fixes Price Time Item' icon={<MinusIcon />} onClick={() => remove(index)} />
                                                                        <Icon mb={2} h={6} w={6} as={FaFileInvoiceDollar} />
                                                                        <Stack>
                                                                            <FormLabel fontSize="sm" htmlFor={`fixedPriceTimeItems.${index}.name`}>Name</FormLabel>
                                                                            <Input
                                                                                width="sm"
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
                                                                            {/* {errors.clientInformation?.name?.message} */}
                                                                        </FormErrorMessage>
                                                                    </Flex>
                                                                </FormControl>

                                                                <Flex gap={4}>
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
                                                                                id='exportToEconomic'
                                                                                type="checkbox"
                                                                                variant="filled"
                                                                            />
                                                                            <Icon h={7} w={7} as={HiReceiptTax} />
                                                                        </Flex>
                                                                    </Stack>
                                                                </Flex>
                                                            </Flex>
                                                        </Stack>
                                                        {fields.length > 0 && index !== fields.length - 1 ? <Divider /> : <></>}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </Stack>

                                        {fields.length > 0
                                            ? <Flex mt={6} gap={10} alignItems="end" justifyContent="end">
                                                {/* <FormProvider {...fixedPriceTimeItemsForm}>
                                    <FixedPriceTimeItemsStats />
                                </FormProvider> */}
                                            </Flex>
                                            : null}

                                    </form>

                                    {
                                        fields.length < 5
                                            ? <>
                                                <Divider />

                                                <Flex justifyContent="start">
                                                    <Button onClick={() => append({ name: '', amount: 0 })} leftIcon={<AddIcon />} colorScheme='primary'>
                                                        Add item
                                                    </Button>
                                                </Flex>
                                            </>
                                            : <></>
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
                                            ? <><Flex gap={4} justifyContent="space-between">
                                                <FormControl isInvalid={false}>
                                                    <Flex alignItems="end" gap={4}>
                                                        <IconButton mb={0.5} aria-label='Remove VAT' icon={<MinusIcon />} onClick={() => setShowTax1(false)} />
                                                        <Icon mb={2} h={6} w={6} as={HiReceiptTax} />
                                                        <Stack>
                                                            <FormLabel m={0} fontSize="sm" htmlFor={`taxes`}>Taxes</FormLabel>
                                                            <Input
                                                                width="sm"
                                                                id='taxes'
                                                                placeholder="VAT"
                                                                variant="filled"
                                                            />
                                                        </Stack>
                                                        <FormErrorMessage>
                                                            {/* {errors.clientInformation?.name?.message} */}
                                                        </FormErrorMessage>
                                                    </Flex>
                                                </FormControl>
                                                <Flex>
                                                    <FormControl>
                                                        <FormLabel fontSize="sm" htmlFor={`title`}>Amount</FormLabel>
                                                        <Flex flexDirection="column">
                                                            <InputGroup>

                                                                <NumberInput
                                                                    id='amount'
                                                                    placeholder="Enter Amount"
                                                                    variant="filled">
                                                                    <NumberInputField />
                                                                    <NumberInputStepper>
                                                                        <NumberIncrementStepper />
                                                                        <NumberDecrementStepper />
                                                                    </NumberInputStepper>
                                                                </NumberInput>
                                                                <InputRightAddon>%</InputRightAddon>
                                                            </InputGroup>
                                                            <FormErrorMessage>

                                                            </FormErrorMessage>
                                                        </Flex>
                                                    </FormControl>
                                                </Flex>
                                            </Flex>
                                                <Divider orientation="horizontal" />
                                            </>
                                            : null
                                    }

                                    <Flex justifyContent="start">
                                        <Button onClick={() => setShowTax1(true)} leftIcon={<AddIcon />} colorScheme='primary'>
                                            Add item
                                        </Button>
                                    </Flex>
                                </Stack>
                            </CardBody>
                        </Card>
                    </Stack>
                </Stack>
            </Stack>
        </>
    )
}
