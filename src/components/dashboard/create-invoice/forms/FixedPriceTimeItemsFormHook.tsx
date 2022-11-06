import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, InputGroup, InputLeftAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Text } from "@chakra-ui/react";
import { Card, CardBody, Divider } from "@saas-ui/react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";

const TimeItemsFormHook = () => {

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
        control,
        name: "fixedPriceTimeItems"
    });

    const { errors } = formState;

    function onSubmit(data: any) {
        // display form data on success
        alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
    }

    return (
        <>
            <Card title={
                <Heading>Fixed Price Time Items</Heading>}>
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {fields.map((item, index) => {
                            return (
                                <React.Fragment key={item.id}>
                                    <Stack gap={2}>
                                        <Flex gap={4}>
                                            <IconButton mt={8} aria-label='Create Fixes Price Time Item' icon={<MinusIcon />} onClick={() => remove(index)} />
                                            <FormControl isInvalid={!!errors.fixedPriceTimeItems?.[index]?.name}>
                                                <FormLabel htmlFor={`fixedPriceTimeItems.${index}.name`}>Name</FormLabel>
                                                <Flex flexDirection="column">
                                                    <Input
                                                        id='name'
                                                        placeholder="Time Item Name"
                                                        variant="filled"
                                                        {...register(`fixedPriceTimeItems.${index}.name`, {
                                                            required: 'Name is required',
                                                            minLength: { value: 0, message: 'Name must be defined' },
                                                        })}
                                                    />
                                                    <FormErrorMessage>
                                                        {errors.fixedPriceTimeItems?.[index]?.name?.message}
                                                    </FormErrorMessage>
                                                </Flex>

                                            </FormControl>
                                            <FormControl isInvalid={!!errors.fixedPriceTimeItems?.[index]?.amount}>
                                                <FormLabel htmlFor={`timeItems.${index}.amount`}>Amount</FormLabel>
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
                                        </Flex>
                                    </Stack>
                                    <Divider my={4} />
                                </React.Fragment>
                            );
                        })}

                        <Flex gap={4} justifyContent="space-between">
                            <Button colorScheme="primary" type="submit">Save</Button>
                            <Flex align="center" gap={4}>
                                <Text as="i" fontWeight="bold" fontSize="xs">New Item</Text>
                                <IconButton aria-label='Create Time Item' icon={<AddIcon />} onClick={() => append({ name: '', amount: 0})} />
                            </Flex>
                        </Flex>

                        {fields.length > 0
                            ? <Flex mt={6} gap={10} alignItems="end" justifyContent="end">
                                {/* <FormProvider {...fixedPriceTimeItemsForm}>
                                    <FixedPriceTimeItemsStats />
                                </FormProvider> */}
                            </Flex>
                            : null}

                    </form>
                </CardBody>
            </Card>
        </>
    )
}

export default TimeItemsFormHook;