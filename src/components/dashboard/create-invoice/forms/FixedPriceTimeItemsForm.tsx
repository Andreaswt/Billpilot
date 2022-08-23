import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, Flex, FormControl, FormLabel, Heading, IconButton, Input, InputGroup, InputRightAddon, Stack, Text, Tooltip } from "@chakra-ui/react";
import { Card, CardBody, Divider } from "@saas-ui/react";
import { Field, FieldArray, Form, Formik, useFormikContext } from "formik";
import React, { Fragment } from "react";
import { TbDiscount, TbReceipt } from "react-icons/tb";
import * as Yup from 'yup';
import useJiraItemsStore, { CheckedTimeItems } from "../../../../../store/jiraItems";
import { TimeItemsTable } from "../collapseable-table";
import FixedPriceTimeItemsStats from "./FixedPriceTimeItemsStats";

const FixedPriceTimeItemsForm = () => {
    const jiraItemsStore = useJiraItemsStore();

    const FixedPriceTimeItemSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        amount: Yup.number().min(0).required('Required'),
    })

    const FixedPriceTimeItemsSchema = Yup.object().shape({
        fixedPriceTimeItems: Yup.array().of(FixedPriceTimeItemSchema),
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
                                    {values.fixedPriceTimeItems && values.fixedPriceTimeItems.length > 0 ? (
                                        values.fixedPriceTimeItems.map((timeItem, index) => (
                                            <React.Fragment key={index}>
                                                <Stack gap={2}>
                                                    <Flex alignItems="end" gap={4}>
                                                        <IconButton mb={0.5} aria-label='Create Time Item' icon={<MinusIcon />} onClick={() => arrayHelpers.remove(index)} />
                                                        <FormControl>
                                                            <FormLabel htmlFor="fixedPriceTimeItems[${index}].name">Name</FormLabel>
                                                            <Field as={Input} placeholder="Time Item Name" variant="filled" name={`fixedPriceTimeItems[${index}].name`} />
                                                        </FormControl>

                                                        <FormControl>
                                                            <FormLabel htmlFor="fixedPriceTimeItems[${index}].amount">Amount</FormLabel>
                                                            <InputGroup>
                                                                <Field as={Input} type="number" placeholder="0 USD" variant="filled" name={`fixedPriceTimeItems[${index}].amount`} />
                                                                <InputRightAddon children='USD' />
                                                            </InputGroup>
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
                                        ))
                                    ) : (
                                        <button type="button" onClick={() => arrayHelpers.push({ name: "", amount: 0 })}>
                                            Add a Time Item
                                        </button>
                                    )}
                                    <Flex mt={6} gap={10} justifyContent="space-between">
                                        <Flex gap={4} flexDirection="row">
                                            <IconButton aria-label='Create Time Item' icon={<AddIcon />} onClick={() => arrayHelpers.push({ name: "", amount: 0 })} />
                                            <Button colorScheme="purple" type="submit">Save</Button>
                                        </Flex>

                                        <FixedPriceTimeItemsStats />
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

export default FixedPriceTimeItemsForm;