import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, Stack, Text } from "@chakra-ui/react";
import { Card, CardBody, Divider } from "@saas-ui/react";
import React, { useEffect } from "react";
import { FormProvider, useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import useJiraItemsStore from "../../../../../store/jiraItems";
import useTaxDiscountStore from "../../../../../store/taxDiscount";
import { subscribeWithSelector } from 'zustand/middleware'

interface IProps {
    methods: UseFormReturn<{ taxes: { name: string, percentage: number }[] }>
}

const TimeItemsFormHook = (props: IProps) => {
    const { methods } = props
    const store = useTaxDiscountStore();

    const { register, control, handleSubmit, reset, formState, watch } = methods

    React.useEffect(() => {
        const subscription = watch((value) => {
            let values: { name: string, percentage: number }[] = [] 
            if (!value.taxes) return;

            value.taxes.forEach((item, index) => {
                if (!item) return;
                if (store.taxes.find(x => x.name == item.name! && x.percentage == item.percentage!)) return;
                values.push({ name: item.name!, percentage: item.percentage! })
            })

            store.setTaxes(values)
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const {
        fields,
        append,
        prepend,
        remove,
        swap,
        move,
        insert,
        replace
    } = useFieldArray({
        control,
        name: "taxes"
    });

    const { errors } = formState;

    function onSubmit(data: any) {
        // display form data on success
        alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
    }

    return (
        <>
            <FormProvider {...methods}>
                <Card title={
                    <Heading>Taxes</Heading>}>
                    <CardBody>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {fields.map((item, index) => {
                                return (
                                    <React.Fragment key={item.id}>
                                        <Stack gap={2}>
                                            <Flex gap={4}>
                                                <IconButton mt={8} aria-label='Create Time Item' icon={<MinusIcon />} onClick={() => remove(index)} />
                                                <FormControl isInvalid={!!errors.taxes?.[index]?.name}>
                                                    <FormLabel htmlFor={`taxes.${index}.name`}>Name</FormLabel>
                                                    <Flex flexDirection="column">
                                                        <Input
                                                            id='name'
                                                            placeholder="Time Item Name"
                                                            variant="filled"
                                                            {...register(`taxes.${index}.name`, {
                                                                required: 'This is required',
                                                                minLength: { value: 0, message: 'Name must be defined' },
                                                            })}
                                                        />
                                                        <FormErrorMessage>
                                                            {errors.taxes?.[index]?.name?.message}
                                                        </FormErrorMessage>
                                                    </Flex>

                                                </FormControl>
                                                <FormControl isInvalid={!!errors.taxes?.[index]?.percentage}>
                                                    <FormLabel htmlFor={`taxes.${index}.time`}>Time</FormLabel>
                                                    <Flex flexDirection="column">
                                                        <Input
                                                            type="number"
                                                            id='time'
                                                            placeholder="Time Item Name"
                                                            variant="filled"
                                                            {...register(`taxes.${index}.percentage`, {
                                                                valueAsNumber: true,
                                                                required: 'This is required',
                                                                min: { value: 0, message: "Time must be larger than 0" },
                                                            })}
                                                        />
                                                        <FormErrorMessage>
                                                            {errors.taxes?.[index]?.percentage?.message}
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
                                <Button colorScheme="purple" onClick={() => console.log(store.taxes)}>Save</Button>
                                <Flex align="center" gap={4}>
                                    <Text as="i" fontWeight="bold" fontSize="xs">New Item</Text>
                                    <IconButton aria-label='Create Time Item' icon={<AddIcon />} onClick={() => append({ name: '', percentage: 0 })} />
                                </Flex>
                            </Flex>
                        </form>
                    </CardBody>
                </Card>

                {/* <Card title={
                    <Heading>Taxes</Heading>}>
                    <CardBody>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {fields.map((item, index) => {
                                return (
                                    <React.Fragment key={item.id}>
                                        <Stack gap={2}>
                                            <Flex gap={4}>
                                                <IconButton mt={8} aria-label='Create Time Item' icon={<MinusIcon />} onClick={() => remove(index)} />
                                                <FormControl isInvalid={!!errors.taxes?.[index]?.name}>
                                                    <FormLabel htmlFor={`taxes.${index}.name`}>Name</FormLabel>
                                                    <Flex flexDirection="column">
                                                        <Input
                                                            id='name'
                                                            placeholder="Time Item Name"
                                                            variant="filled"
                                                            {...register(`taxes.${index}.name`, {
                                                                required: 'This is required',
                                                                minLength: { value: 0, message: 'Name must be defined' },
                                                            })}
                                                        />
                                                        <FormErrorMessage>
                                                            {errors.taxes?.[index]?.name?.message}
                                                        </FormErrorMessage>
                                                    </Flex>

                                                </FormControl>
                                                <FormControl isInvalid={!!errors.taxes?.[index]?.percentage}>
                                                    <FormLabel htmlFor={`taxes.${index}.percentage`}>Percentage</FormLabel>
                                                    <Flex flexDirection="column">
                                                        <Input
                                                            type="number"
                                                            id='time'
                                                            placeholder="Time Item Name"
                                                            variant="filled"
                                                            {...register(`taxes.${index}.percentage`, {
                                                                valueAsNumber: true,
                                                                required: 'This is required',
                                                                min: { value: 0, message: "Time must be larger than 0" },
                                                            })}
                                                        />
                                                        <FormErrorMessage>
                                                            {errors.taxes?.[index]?.percentage?.message}
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
                                <Button colorScheme="purple" type="submit">Save</Button>
                                <Flex align="center" gap={4}>
                                    <Text as="i" fontWeight="bold" fontSize="xs">New Item</Text>
                                    <IconButton aria-label='Create Time Item' icon={<AddIcon />} onClick={() => append({ name: '', percentage: 0 )} />
                                </Flex>
                            </Flex>
                        </form>
                    </CardBody>
                </Card> */}
            </FormProvider>
        </>
    )
}

export default TimeItemsFormHook;