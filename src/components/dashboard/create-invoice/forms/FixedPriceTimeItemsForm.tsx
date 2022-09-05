import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, Flex, FormControl, FormLabel, Heading, IconButton, Input, InputGroup, InputRightAddon, Stack, Text, Tooltip } from "@chakra-ui/react";
import { Card, CardBody, Divider } from "@saas-ui/react";
import { Field, FieldArray, Form, Formik, useFormikContext } from "formik";
import React, { Fragment } from "react";
import { TbDiscount, TbReceipt } from "react-icons/tb";
import * as Yup from 'yup';
import useJiraItemsStore, { CheckedTimeItems } from "../../../../../store/jiraItems";
import { TimeItemsTable } from "../collapseable-table";
import ErrorMessage from "./ErrorMessage";
import FixedPriceTimeItemsStats from "./FixedPriceTimeItemsStats";

const FixedPriceTimeItemsForm = () => {
    const jiraItemsStore = useJiraItemsStore();

    const FixedPriceTimeItemsSchema = Yup.object().shape({
        fixedPriceTimeItems: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Required'),
                amount: Yup.number().min(0).required('Required'),
            })
        )
    })

    const initialValues = {
        fixedPriceTimeItems: [
            {
                name: '',
                amount: 0,
            },
        ],
    }

    return (
        <>
            <Formik
                validateOnChange={false}
                initialValues={initialValues}
                validationSchema={FixedPriceTimeItemsSchema}
                onSubmit={(values) => console.log(values)}>
                {({ values, errors, touched }) => (
                    <Form onChange={() => console.log("hs")}>
                        <FieldArray
                            name="fixedPriceTimeItems"
                            render={arrayHelpers => (
                                <div>
                                    {values.fixedPriceTimeItems.map((timeItem, index) => (
                                        <React.Fragment key={index}>
                                            <Stack gap={2}>
                                                <Flex gap={4}>
                                                    <IconButton mt={8} aria-label='Create Time Item' icon={<MinusIcon />} onClick={() => arrayHelpers.remove(index)} />
                                                    <FormControl isInvalid={errors.fixedPriceTimeItems != null && touched.fixedPriceTimeItems != null}>
                                                        <FormLabel htmlFor={`fixedPriceTimeItems[${index}].name`}>Name</FormLabel>
                                                        <Flex flexDirection="column">
                                                            <Field as={Input} placeholder="Time Item Name" variant="filled" name={`fixedPriceTimeItems[${index}].name`} />
                                                            <ErrorMessage name={`fixedPriceTimeItems[${index}].name`} />
                                                        </Flex>
                                                    </FormControl>

                                                    <FormControl isInvalid={errors.fixedPriceTimeItems != null && touched.fixedPriceTimeItems != null}>
                                                        <FormLabel htmlFor={`fixedPriceTimeItems[${index}].amount`}>Amount</FormLabel>
                                                        <Flex flexDirection="column">
                                                            <InputGroup>
                                                                <Field as={Input} type="number" placeholder="0 USD" variant="filled" name={`fixedPriceTimeItems[${index}].amount`} />
                                                                <InputRightAddon>USD</InputRightAddon>
                                                            </InputGroup>
                                                            <ErrorMessage name={`fixedPriceTimeItems[${index}].amount`} />
                                                        </Flex>
                                                    </FormControl>

                                                    <Flex flexShrink="0" gap={3} direction="column">
                                                        <Heading fontWeight="normal" size="sm">Apply Taxes & Discounts</Heading>
                                                        <Flex mb={0.5} gap={4}>
                                                            <Tooltip label='Tax 1' fontSize='sm'>
                                                                <IconButton variant={true ? 'solid' : 'outline'} aria-label='Tax' icon={<TbReceipt />} />
                                                            </Tooltip>
                                                            <IconButton variant='outline' aria-label='Discount' icon={<TbDiscount />} onClick={() => arrayHelpers.insert(index, { name: "", amount: 0 })} />
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                            </Stack>
                                            <Divider my={4} />
                                        </React.Fragment>
                                    ))}
                                    <Flex gap={4} justifyContent="end">
                                        <Flex align="center" gap={4}>
                                            <Text as="i" fontWeight="bold" fontSize="xs">New Item</Text>
                                            <IconButton aria-label='Create Time Item' icon={<AddIcon />} onClick={() => arrayHelpers.push({ name: "", amount: 0 })} />
                                        </Flex>
                                    </Flex>

                                    {values.fixedPriceTimeItems && values.fixedPriceTimeItems.length > 0 ?
                                        <Flex mt={6} gap={10} alignItems="end" justifyContent="space-between">
                                            <Button colorScheme="purple" type="submit">Save</Button>
                                            <FixedPriceTimeItemsStats />
                                        </Flex>
                                        : null}

                                </div>
                            )}
                        />
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default FixedPriceTimeItemsForm;