import { NextPage } from "next";
import { requireAuth } from "../../common/requireAuth";

import { Button, Checkbox, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import {
  Page, PageBody, Section
} from '@saas-ui/pro';
import { Card, CardBody, Form, FormLayout, useForm } from "@saas-ui/react";
import moment from 'moment';
import React from "react";
import { trpc } from "../../utils/trpc";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const Generator: NextPage = () => {
  var date = new Date();
  var firstDayInMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDayInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const form = useForm<{ invoicedDatesFrom: string, invoicedDatesTo: string, checkAll: boolean, templates: boolean[], clients: boolean[] }>({
    defaultValues: {
      invoicedDatesFrom: moment(firstDayInMonth).format("YYYY-MM-DD"),
      invoicedDatesTo: moment(lastDayInMonth).format("YYYY-MM-DD"),
      checkAll: false,
      clients: [],
      templates: [],
    }
  })

  const { register, control, resetField, handleSubmit, reset, formState, watch, setValue } = form
  const { errors } = formState;

  // const checkAll = form.watch("checkAll")
  // const clients = form.watch("clients")

  const { data, isLoading } = trpc.useQuery(["invoiceTemplates.getAll"], {
    refetchOnWindowFocus: false,
  });

  const generateInvoicesMutation = trpc.useMutation('invoiceTemplates.generateInvoices', {
    onSuccess() {

    }
  });

  function generateInvoices() {
    console.log("generating invoices")
  }

  return (
    <Page title={"Invoice Generator"} description="Use the invoice generator to generate all your invoices from invoice templates." isLoading={isLoading}>
      <PageBody pt="8">
        <Form onSubmit={() => console.log("Hej")}>
          <Stack gap={14}>
            <Card>
              <CardBody>
                <Section
                  title="Invoiced Dates"
                  description="Invoced templates will import time for the chosen dates."
                  variant="annotated"
                >
                  <Card>
                    <CardBody>
                      <FormLayout columns={2}>
                        <FormControl isInvalid={!!errors?.invoicedDatesFrom}>
                          <FormLabel htmlFor={`invoicedDatesFrom`}>Invoiced Dates From</FormLabel>
                          <Flex flexDirection="column">
                            <Input
                              id='invoicedDatesFrom'
                              type="date"
                              variant="filled"
                              {...register(`invoicedDatesFrom`)}
                            />
                            <FormErrorMessage>
                              {errors.invoicedDatesFrom?.message}
                            </FormErrorMessage>
                          </Flex>
                        </FormControl>
                        <FormControl isInvalid={!!errors?.invoicedDatesTo}>
                          <FormLabel htmlFor={`invoicedDatesTo`}>Invoiced Dates To</FormLabel>
                          <Flex flexDirection="column">
                            <Input
                              id='invoicedDatesTo'
                              type="date"
                              variant="filled"
                              {...register(`invoicedDatesTo`)}
                            />
                            <FormErrorMessage>
                              {errors.invoicedDatesTo?.message}
                            </FormErrorMessage>
                          </Flex>
                        </FormControl>
                      </FormLayout>
                    </CardBody>
                  </Card>
                </Section>
              </CardBody>
            </Card>

            <Stack gap={6}>
              <Flex gap={2}>
                <Checkbox
                  ml={4}
                  id='checkAll'
                  type="checkbox"
                  variant="filled"
                  {...register(`checkAll`)}
                />
                <Text>
                  Select all
                </Text>
              </Flex>
              <Divider />

              {
                data?.map((client, clientIndex) => {
                  return (
                    <Stack key={client.id} gap={2}>
                      <Flex gap={2}>
                        <Checkbox
                          ml={4}
                          id='exportToEconomic'
                          type="checkbox"
                          variant="filled"
                          {...register(`clients.${clientIndex}`)}
                        />
                        <Heading size="md">
                          {client.name}
                        </Heading>
                      </Flex>
                      {
                        client.invoiceTemplates.map((template, templateIndex) => {
                          return (
                            <React.Fragment key={template.id}>
                              <HStack px={4} justifyContent="space-between">
                                <Text >Title</Text>

                                <Flex w="40%" justifyContent="space-between">
                                  <Text>Generated Invoice</Text>
                                  <Text>Time</Text>
                                  <Text>Amount</Text>
                                </Flex>
                              </HStack>
                              <Card>
                                <CardBody>
                                  <Flex alignItems="center" justifyContent="space-between">
                                    <Flex gap={4}>
                                      <Checkbox
                                        id={`templates.${templateIndex}`}
                                        type="checkbox"
                                        variant="filled"
                                        {...register(`templates.${templateIndex}`)}
                                      />
                                      <Heading size="md">{template.title}</Heading>
                                    </Flex>
                                    <Text>Not generated for selected dates</Text>
                                  </Flex>
                                </CardBody>
                              </Card>
                            </React.Fragment>
                          )
                        })
                      }
                      {
                        data?.length !== 0 && clientIndex !== data?.length - 1
                          ? <Divider py={2} />
                          : null
                      }
                    </Stack>
                  )
                })
              }
            </Stack>
            <Flex justifyContent="end">
              <Button onClick={generateInvoices} colorScheme="primary" isLoading={generateInvoicesMutation.isLoading}>Generate 4 invoices</Button>
            </Flex>
          </Stack>
        </Form>
      </PageBody>
    </Page>
  )
}

export default Generator;