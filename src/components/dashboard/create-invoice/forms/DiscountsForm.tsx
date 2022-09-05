import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, Flex, FormControl, FormLabel, IconButton, Input, InputGroup, InputRightAddon, Stack, Text } from "@chakra-ui/react";
import { Divider } from "@saas-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import React from "react";
import * as Yup from 'yup';
import ErrorMessage from "./ErrorMessage";

const DiscountsForm = () => {
    const DiscountsSchema = Yup.object().shape({
        discounts: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Required'),
                percentage: Yup.number().min(0).max(100).required('Required'),
                    })
        ),
    })

    const initialValues = {
        discounts: [
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
                validationSchema={DiscountsSchema}
                onSubmit={(values) => console.log(values)}>
                {({ values, errors, touched }) => (
                    <Form onChange={() => console.log("hs")}>
                        <FieldArray
                            name="discounts"
                            render={arrayHelpers => (
                                <div>
                                    {values.discounts.map((discount, index) => (
                                        <React.Fragment key={index}>
                                            <Stack gap={2}>
                                                <Flex gap={4}>
                                                    <IconButton mt={8} mb={0.5} aria-label='Create Discount' icon={<MinusIcon />} onClick={() => arrayHelpers.remove(index)} />
                                                    <FormControl isInvalid={errors.discounts != null && touched.discounts != null}>
                                                        <FormLabel htmlFor={`discounts[${index}].name`}>Name</FormLabel>
                                                        <Flex flexDirection="column">
                                                        <Field as={Input} placeholder="Enter Discount Name" variant="filled" name={`discounts[${index}].name`} />
                                                        <ErrorMessage name={`discounts[${index}].name`} />
                                                        </Flex>
                                                    </FormControl>

                                                    <FormControl isInvalid={errors.discounts != null && touched.discounts != null}>
                                                        <FormLabel htmlFor={`discounts[${index}].percentage`}>Percentage</FormLabel>
                                                        <Flex flexDirection="column">
                                                        <InputGroup>
                                                            <Field as={Input} type="number" placeholder="0 USD" variant="filled" name={`discounts[${index}].percentage`} />
                                                            <InputRightAddon>%</InputRightAddon>
                                                        </InputGroup>
                                                        <ErrorMessage name={`discounts[${index}].percentage`} />
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
                                            <Text as="i" fontWeight="bold" fontSize="xs">New Discount</Text>
                                            <IconButton aria-label='Create discount' icon={<AddIcon />} onClick={() => arrayHelpers.push({ name: "", percentage: 0 })} />
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

export default DiscountsForm;