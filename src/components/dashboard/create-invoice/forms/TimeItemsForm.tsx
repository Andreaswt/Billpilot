import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, Flex, FormControl, FormLabel, Heading, IconButton, Input, InputGroup, InputRightAddon, Stack, Text, Tooltip, FormErrorMessage } from "@chakra-ui/react";
import { Card, CardBody, Divider } from "@saas-ui/react";
import { Field, FieldArray, Form, Formik, getIn, useFormikContext } from "formik";
import React, { Fragment } from "react";
import { TbDiscount, TbReceipt } from "react-icons/tb";
import * as Yup from 'yup';
import useJiraItemsStore, { CheckedTimeItems } from "../../../../../store/jiraItems";
import { TimeItemsTable } from "../collapseable-table";
import ErrorMessage from "./ErrorMessage";
import TimeItemsStats from "./TimeItemsStats"

const TimeItemsForm = () => {
    const jiraItemsStore = useJiraItemsStore();

    const TimeItemsSchema = Yup.object().shape({
        timeItems: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Required'),
                time: Yup.number().min(0).required('Required'),
                rate: Yup.number().min(0).required('Required'),
            })
        )
    })

    const initialValues = {
        timeItems: [
            {
                name: '',
                time: 0,
                rate: 0,
            },
        ],
    };

    interface ITimeItems {
        name: string,
        time: number,
        rate: number
    }

    return (
        <>
            <Formik
                validateOnChange={false}
                initialValues={initialValues}
                validationSchema={TimeItemsSchema}
                onSubmit={(values) => console.log(values)}>
                {({ values, errors, touched }) => (
                    <Form onChange={() => console.log("hs")}>
                        <FieldArray
                            name="timeItems"
                            render={arrayHelpers => (
                                <div>
                                    {values.timeItems && values.timeItems.length > 0 ? (
                                        values.timeItems.map((timeItem, index) => (
                                            <React.Fragment key={index}>
                                                <Stack gap={2}>
                                                    <Flex gap={4}>
                                                        <IconButton mt={8} aria-label='Create Time Item' icon={<MinusIcon />} onClick={() => arrayHelpers.remove(index)} />
                                                        <FormControl isInvalid={errors.timeItems != null && touched.timeItems != null}>
                                                            <FormLabel htmlFor="timeItems[${index}].name">Name</FormLabel>
                                                            <Flex flexDirection="column">
                                                                <Field as={Input} placeholder="Time Item Name" variant="filled" name={`timeItems[${index}].name`} />
                                                                <ErrorMessage name={`timeItems[${index}].name`} />
                                                            </Flex>
                                                        </FormControl>

                                                        <FormControl isInvalid={errors.timeItems != null && touched.timeItems != null}>
                                                            <FormLabel htmlFor="timeItems[${index}].time">Time</FormLabel>
                                                            <InputGroup>
                                                                <Field as={Input} type="number" placeholder="0 Hours" variant="filled" name={`timeItems[${index}].time`} />
                                                                <InputRightAddon children='Hours' />
                                                                <ErrorMessage name={`timeItems[${index}].time`} />
                                                            </InputGroup>
                                                        </FormControl>

                                                        <FormControl isInvalid={errors.timeItems != null && touched.timeItems != null}>
                                                            <FormLabel htmlFor="timeItems[${index}].rate">Rate</FormLabel>
                                                            <InputGroup>
                                                                <Field as={Input} type="number" placeholder="USD 0" variant="filled" name={`timeItems[${index}].rate`} />
                                                                <InputRightAddon children='USD' />
                                                                <ErrorMessage name={`timeItems[${index}].rate`} />
                                                            </InputGroup>
                                                        </FormControl>

                                                        <Flex flexShrink="0" gap={3} direction="column">
                                                            <Heading fontWeight="normal" size="sm">Apply Taxes & Discounts</Heading>
                                                            <Flex mb={0.5} gap={4}>
                                                                <Tooltip label='Tax 1' fontSize='sm'>
                                                                    <IconButton variant={true ? 'solid' : 'outline'} aria-label='Tax' icon={<TbReceipt />} />
                                                                </Tooltip>
                                                                <IconButton variant='outline' aria-label='Discount' icon={<TbDiscount />} onClick={() => arrayHelpers.insert(index, { name: "", time: 0, rate: 0 })} />
                                                            </Flex>
                                                        </Flex>
                                                    </Flex>
                                                    <TimeItemsTable timeItemIndex={index} updateTime={arrayHelpers.replace} />
                                                </Stack>
                                                <Divider my={4} />
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <button type="button" onClick={() => arrayHelpers.push({ name: "", time: 0, rate: 0 })}>
                                            Add a Time Item
                                        </button>
                                    )}

                                    {/* {typeof errors.timeItems === 'string' ? <div>{errors.timeItems}</div>: null} */}

                                    <Flex gap={4} justifyContent="space-between">
                                        <Button colorScheme="purple" type="submit">Save</Button>
                                        <Flex align="center" gap={4}>
                                            <Text as="i" fontWeight="bold" fontSize="xs">New Item</Text>
                                            <IconButton aria-label='Create Time Item' icon={<AddIcon />} onClick={() => arrayHelpers.push({ name: "", time: 0, rate: 0 })} />
                                        </Flex>
                                    </Flex>

                                    <Flex mt={6} gap={10} justifyContent="end">
                                        <TimeItemsStats />
                                    </Flex>
                                </div>
                            )}
                        />
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default TimeItemsForm;