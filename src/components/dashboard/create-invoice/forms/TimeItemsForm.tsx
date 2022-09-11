import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Text, Tooltip } from "@chakra-ui/react";
import { Card, CardBody, Divider } from "@saas-ui/react";
import React, { useEffect } from "react";
import { FormProvider, useFieldArray, useForm, UseFormReturn, useWatch } from "react-hook-form";
import { TbAd2, TbPercentage, TbReceipt } from "react-icons/tb";
import useTaxDiscountStore from "../../../../../store/taxDiscount";
import { TimeItemsTable } from "../collapseable-table";
import TimeItemsStats from "./TimeItemsStats";

const TimeItemsFormHook = () => {

    const timeItemsForm = useForm({
        reValidateMode: "onSubmit",
        defaultValues: {
            timeItems: [{ name: '', time: 0, rate: 0, tax: 0, discount: 0 }],
        },
    });

    const { register, control, handleSubmit, reset, formState, watch, setValue } = timeItemsForm

    const {
        fields,
        append,
        remove,
        update
    } = useFieldArray({
        control,
        name: "timeItems"
    });

    const { errors } = formState;

    function onSubmit(data: any) {
        // display form data on success
        alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
    }

    return (
        <>
            <Card title={
                <Heading>Time Items</Heading>}>
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {fields.map((item, index) => {
                            return (
                                <React.Fragment key={item.id}>
                                    <Stack gap={2}>
                                        <Flex gap={4}>
                                            <IconButton mt={8} aria-label='Create Time Item' icon={<MinusIcon />} onClick={() => remove(index)} />
                                            <FormControl isInvalid={!!errors.timeItems?.[index]?.name}>
                                                <FormLabel htmlFor={`timeItems.${index}.name`}>Name</FormLabel>
                                                <Flex flexDirection="column">
                                                    <Input
                                                        id='name'
                                                        placeholder="Time Item Name"
                                                        variant="filled"
                                                        {...register(`timeItems.${index}.name`, {
                                                            required: 'Name is required',
                                                            minLength: { value: 0, message: 'Name must be defined' },
                                                        })}
                                                    />
                                                    <FormErrorMessage>
                                                        {errors.timeItems?.[index]?.name?.message}
                                                    </FormErrorMessage>
                                                </Flex>

                                            </FormControl>
                                            <FormControl isInvalid={!!errors.timeItems?.[index]?.time}>
                                                <FormLabel htmlFor={`timeItems.${index}.time`}>Time</FormLabel>
                                                <Flex flexDirection="column">
                                                    <InputGroup>
                                                        <InputLeftAddon children='Hours' />
                                                        <NumberInput
                                                            id='time'
                                                            placeholder="Enter Time"
                                                            variant="filled">
                                                            <NumberInputField
                                                                {...register(`timeItems.${index}.time`, {
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
                                                        {errors.timeItems?.[index]?.time?.message}
                                                    </FormErrorMessage>
                                                </Flex>
                                            </FormControl>
                                            <FormControl isInvalid={!!errors.timeItems?.[index]?.rate}>
                                                <FormLabel htmlFor={`timeItems.${index}.rate`}>Rate</FormLabel>
                                                <Flex flexDirection="column">
                                                    <InputGroup>
                                                        <InputLeftAddon children='USD' />
                                                        <NumberInput
                                                            id='rate'
                                                            placeholder="Enter Rate"
                                                            variant="filled">
                                                            <NumberInputField
                                                                {...register(`timeItems.${index}.rate`, {
                                                                    valueAsNumber: true,
                                                                    required: 'Rate is required',
                                                                    min: { value: 0, message: "Rate must be larger than 0" },
                                                                })} />
                                                            <NumberInputStepper>
                                                                <NumberIncrementStepper />
                                                                <NumberDecrementStepper />
                                                            </NumberInputStepper>
                                                        </NumberInput>
                                                    </InputGroup>
                                                    <FormErrorMessage>
                                                        {errors.timeItems?.[index]?.rate?.message}
                                                    </FormErrorMessage>
                                                </Flex>
                                            </FormControl>
                                            <FormControl isInvalid={!!errors.timeItems?.[index]?.discount}>
                                                <FormLabel htmlFor={`timeItems.${index}.discount`}>Discount</FormLabel>
                                                <Flex flexDirection="column">
                                                    <InputGroup>
                                                        <InputLeftAddon children='%' />
                                                        <NumberInput
                                                            id='discount'
                                                            placeholder="Time Item Name"
                                                            variant="filled">
                                                            <NumberInputField
                                                                {...register(`timeItems.${index}.discount`, {
                                                                    valueAsNumber: true,
                                                                    min: { value: 0, message: "Rate must be larger than 0%" },
                                                                    max: { value: 100, message: "Rate can't be larger than 100%" },
                                                                })} />
                                                            <NumberInputStepper>
                                                                <NumberIncrementStepper />
                                                                <NumberDecrementStepper />
                                                            </NumberInputStepper>
                                                        </NumberInput>
                                                    </InputGroup>
                                                    <FormErrorMessage>
                                                        {errors.timeItems?.[index]?.discount?.message}
                                                    </FormErrorMessage>
                                                </Flex>
                                            </FormControl>
                                            <FormControl isInvalid={!!errors.timeItems?.[index]?.tax}>
                                                <FormLabel htmlFor={`timeItems.${index}.tax`}>Tax</FormLabel>
                                                <Flex flexDirection="column">
                                                    <InputGroup>
                                                        <InputLeftAddon children='%' />
                                                        <NumberInput
                                                            id='tax'
                                                            placeholder="Time Item Name"
                                                            variant="filled">
                                                            <NumberInputField
                                                                {...register(`timeItems.${index}.tax`, {
                                                                    valueAsNumber: true,
                                                                    min: { value: 0, message: "Tax must be larger than 0%" },
                                                                    max: { value: 100, message: "Tax can't be larger than 100%" },
                                                                })} />
                                                            <NumberInputStepper>
                                                                <NumberIncrementStepper />
                                                                <NumberDecrementStepper />
                                                            </NumberInputStepper>
                                                        </NumberInput>
                                                    </InputGroup>
                                                    <FormErrorMessage>
                                                        {errors.timeItems?.[index]?.tax?.message}
                                                    </FormErrorMessage>
                                                </Flex>
                                            </FormControl>
                                        </Flex>
                                        <p>{item.id}</p>
                                        <TimeItemsTable rowId={item.id} timeItemIndex={index} updateTime={setValue} />
                                    </Stack>
                                    <Divider my={4} />
                                </React.Fragment>
                            );
                        })}

                        <Flex gap={4} justifyContent="space-between">
                            <Button colorScheme="purple" type="submit">Save</Button>
                            <Flex align="center" gap={4}>
                                <Text as="i" fontWeight="bold" fontSize="xs">New Item</Text>
                                <IconButton aria-label='Create Time Item' icon={<AddIcon />} onClick={() => append({ name: '', time: 0, rate: 0, tax: 0, discount: 0 })} />
                            </Flex>
                        </Flex>

                        {fields.length > 0
                            ? <Flex mt={6} gap={10} alignItems="end" justifyContent="end">
                                {/* <TimeItemsStats /> */}
                            </Flex>
                            : null}

                    </form>
                </CardBody>
            </Card>
        </>
    )
}

export default TimeItemsFormHook;