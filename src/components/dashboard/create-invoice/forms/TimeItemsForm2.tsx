import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, Flex, FormControl, FormLabel, Heading, IconButton, Input, InputGroup, InputRightAddon, Stack, Text, Tooltip } from "@chakra-ui/react";
import { Card, CardBody, Divider } from "@saas-ui/react";
import { FastField, Field, FieldArray, Form, Formik } from "formik";
import React from "react";
import { TbReceipt } from "react-icons/tb";
import * as Yup from 'yup';
import { TimeItemsTable } from "../collapseable-table";
import ErrorMessage from "./ErrorMessage";
import TimeItemsStats from "./TimeItemsStats";

const TimeItemsForm = () => {
    // const jiraItemsStore = useJiraItemsStore();

    const TimeItemsSchema = Yup.object().shape({
        timeItems: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Required'),
                time: Yup.number().min(0).required('Required'),
                rate: Yup.number().min(0).required('Required'),
            })
        ),
        taxes: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Required'),
                percentage: Yup.number().min(0).max(100).required('Required'),
            })
        ),
    })

    const initialValues = {
        timeItems: [
            {
                name: '',
                time: 0,
                rate: 0,
            },
        ],
        taxes: [
            {
                name: '',
                percentage: 0,
            },
        ],
    };

    return (
        <>
            <Formik
                validateOnChange={false}
                initialValues={initialValues}
                validationSchema={TimeItemsSchema}
                onSubmit={(values) => console.log(values)}>
                {({ values, errors, touched }) => (
                    <Form onChange={() => console.log("hs")}>

                        <Flex flexDirection="column" gap={6}>
                            <Card title={
                                <Heading>Time Items</Heading>}>
                                <CardBody>
                                    <FieldArray
                                        name="timeItems"
                                        render={arrayHelpers => (
                                            <div>
                                                {values.timeItems.map((timeItem, index) => (
                                                    <React.Fragment key={index}>
                                                        <Stack gap={2}>
                                                            <Flex gap={4}>
                                                                <IconButton mt={8} aria-label='Create Time Item' icon={<MinusIcon />} onClick={() => arrayHelpers.remove(index)} />
                                                                <FormControl isInvalid={errors.timeItems != null && touched.timeItems != null}>
                                                                    <FormLabel htmlFor={`timeItems[${index}].name`}>Name</FormLabel>
                                                                    <Flex flexDirection="column">
                                                                        <FastField as={Input} placeholder="Time Item Name" variant="filled" name={`timeItems[${index}].name`} />
                                                                        <ErrorMessage name={`timeItems[${index}].name`} />
                                                                    </Flex>
                                                                </FormControl>

                                                                <FormControl isInvalid={errors.timeItems != null && touched.timeItems != null}>
                                                                    <FormLabel htmlFor={`timeItems[${index}].time`}>Time</FormLabel>
                                                                    <Flex flexDirection="column">
                                                                        <InputGroup>
                                                                            <FastField as={Input} type="number" placeholder="0 Hours" variant="filled" name={`timeItems[${index}].time`} />
                                                                            <InputRightAddon>Hours</InputRightAddon>
                                                                        </InputGroup>
                                                                        <ErrorMessage name={`timeItems[${index}].time`} />
                                                                    </Flex>
                                                                </FormControl>

                                                                <FormControl isInvalid={errors.timeItems != null && touched.timeItems != null}>
                                                                    <FormLabel htmlFor={`timeItems[${index}].rate`}>Rate</FormLabel>
                                                                    <Flex flexDirection="column">
                                                                        <InputGroup>
                                                                            <FastField as={Input} type="number" placeholder="USD 0" variant="filled" name={`timeItems[${index}].rate`} />
                                                                            <InputRightAddon>USD</InputRightAddon>
                                                                        </InputGroup>
                                                                        <ErrorMessage name={`timeItems[${index}].rate`} />
                                                                    </Flex>
                                                                </FormControl>

                                                                <Flex flexShrink="0" gap={3} direction="column">
                                                                    <Heading fontWeight="normal" size="sm">Apply Taxes & Discounts</Heading>
                                                                    <Flex mb={0.5} gap={4}>
                                                                        {/* {values.taxes.map((tax, index) => (
                                                                            <Tooltip key={index} label={tax.name} fontSize='sm'>
                                                                                <IconButton variant={true ? 'solid' : 'outline'} aria-label='Tax' icon={<TbReceipt />} />
                                                                            </Tooltip>
                                                                        ))} */}
                                                                    </Flex>
                                                                </Flex>
                                                            </Flex>
                                                            {/* <TimeItemsTable timeItemIndex={index} updateTime={arrayHelpers.replace} /> */}
                                                        </Stack>
                                                        <Divider my={4} />
                                                    </React.Fragment>
                                                ))}

                                                <Flex gap={4} justifyContent="end">
                                                    <Flex align="center" gap={4}>
                                                        <Text as="i" fontWeight="bold" fontSize="xs">New Item</Text>
                                                        <IconButton aria-label='Create Time Item' icon={<AddIcon />} onClick={() => arrayHelpers.push({ name: "", time: 0, rate: 0 })} />
                                                    </Flex>
                                                </Flex>

                                                {values.timeItems && values.timeItems.length > 0
                                                    ? <Flex mt={6} gap={10} alignItems="end" justifyContent="end">
                                                        {/* <TimeItemsStats /> */}
                                                    </Flex>
                                                    : null}
                                            </div>
                                        )}
                                    />
                                </CardBody>
                            </Card>


                            {/* <Card title={
                                <Heading>Taxes</Heading>}>
                                <CardBody>

                                    <FieldArray
                                        name="taxes"
                                        render={arrayHelpers => (
                                            <div>
                                                {values.taxes.map((tax, index) => (
                                                    <React.Fragment key={index}>
                                                        <Stack gap={2}>
                                                            <Flex gap={4}>
                                                                <IconButton mt={8} mb={0.5} aria-label='Create Tax' icon={<MinusIcon />} onClick={() => arrayHelpers.remove(index)} />
                                                                <FormControl isInvalid={errors.taxes != null && touched.taxes != null}>
                                                                    <FormLabel htmlFor={`taxes[${index}].name`}>Name</FormLabel>
                                                                    <Flex flexDirection="column">
                                                                        <FastField as={Input} placeholder="Enter Tax Name" variant="filled" name={`taxes[${index}].name`} />
                                                                        <ErrorMessage name={`taxes[${index}].name`} />
                                                                    </Flex>
                                                                </FormControl>

                                                                <FormControl isInvalid={errors.taxes != null && touched.taxes != null}>
                                                                    <FormLabel htmlFor={`taxes[${index}].percentage`}>Percentage</FormLabel>
                                                                    <Flex flexDirection="column">
                                                                        <InputGroup>
                                                                            <FastField as={Input} type="number" placeholder="0 USD" variant="filled" name={`taxes[${index}].percentage`} />
                                                                            <InputRightAddon>%</InputRightAddon>
                                                                        </InputGroup>
                                                                        <ErrorMessage name={`taxes[${index}].percentage`} />
                                                                    </Flex>
                                                                </FormControl>
                                                            </Flex>
                                                        </Stack>
                                                        <Divider my={4} />
                                                    </React.Fragment>
                                                ))}
                                                <Flex gap={4} justifyContent="space-between">
                                                    <Button colorScheme="purple" type="submit">Save</Button>
                                                    <Flex align="center" gap={4}>
                                                        <Text as="i" fontWeight="bold" fontSize="xs">New Tax</Text>
                                                        <IconButton aria-label='Create tax' icon={<AddIcon />} onClick={() => {
                                                            arrayHelpers.push({ name: "", percentage: 0 })
                                                            // store.addTax({ name: "", percentage: 0 }, arrayHelpers.form)
                                                        }} />
                                                    </Flex>
                                                </Flex>
                                            </div>
                                        )}
                                    />
                                </CardBody>
                            </Card> */}

                        </Flex>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default TimeItemsForm;