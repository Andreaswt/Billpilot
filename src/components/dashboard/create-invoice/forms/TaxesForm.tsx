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

const TaxesForm = () => {
    // const jiraItemsStore = useJiraItemsStore();

    const TaxSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        percentage: Yup.number().min(0).max(100).required('Required'),
    })

    const TaxesSchema = Yup.object().shape({
        fixedPriceTimeItems: Yup.array().of(TaxSchema),
    })

    const initialValues = {
        taxes: [
            {
                name: '',
                percentage: 0,
            },
        ],
    }

    return (
        <>
            <Formik
                validateOnChange={false}
                initialValues={initialValues}
                validationSchema={TaxesSchema}
                onSubmit={(values) => console.log(values)}>
                {({ values, errors, touched }) => (
                    <Form onChange={() => console.log("hs")}>
                        <FieldArray
                            name="taxes"
                            render={arrayHelpers => (
                                <div>
                                    {values.taxes.map((timeItem, index) => (
                                        <React.Fragment key={index}>
                                            <Stack gap={2}>
                                                <Flex alignItems="end" gap={4}>
                                                    <IconButton mb={0.5} aria-label='Create Time Item' icon={<MinusIcon />} onClick={() => arrayHelpers.remove(index)} />
                                                    <FormControl>
                                                        <FormLabel htmlFor="taxes[${index}].name">Name</FormLabel>
                                                        <Field as={Input} placeholder="Time Item Name" variant="filled" name={`taxes[${index}].name`} />
                                                    </FormControl>

                                                    <FormControl>
                                                        <FormLabel htmlFor="taxes[${index}].percentage">Percentage</FormLabel>
                                                        <InputGroup>
                                                            <Field as={Input} type="number" placeholder="0 USD" variant="filled" name={`taxes[${index}].percentage`} />
                                                            <InputRightAddon children='%' />
                                                        </InputGroup>
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
                                            <IconButton aria-label='Create tax' icon={<AddIcon />} onClick={() => arrayHelpers.push({ name: "", percentage: 0 })} />
                                        </Flex>
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

export default TaxesForm;