import { NextPage } from "next";
import { requireAuth } from "../../common/requireAuth";

import { Button, Checkbox, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import {
  Page, PageBody, Section
} from '@saas-ui/pro';
import { Card, CardBody, Form, FormLayout, useForm, useSnackbar } from "@saas-ui/react";
import moment from 'moment';
import React, { useMemo } from "react";
import { trpc } from "../../utils/trpc";
import useInvoiceTemplatesStore from "../../../store/invoice-templates";
import ClientCheckbox from "../../components/dashboard/create-invoice/invoice-generator/ClientCheckbox";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const Generator: NextPage = () => {
  const store = useInvoiceTemplatesStore()
  const snackbar = useSnackbar()

  var date = new Date();
  var firstDayInMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDayInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  interface IForm {
    invoicedDatesFrom: string
    invoicedDatesTo: string
  }

  const form = useForm<IForm>({
    defaultValues: {
      invoicedDatesFrom: moment(firstDayInMonth).format("YYYY-MM-DD"),
      invoicedDatesTo: moment(lastDayInMonth).format("YYYY-MM-DD"),
    }
  })

  const { register, control, resetField, handleSubmit, reset, formState, watch, setValue } = form
  const { errors } = formState;

  const { data, isLoading } = trpc.useQuery(["invoiceTemplates.getAll"], {
    refetchOnWindowFocus: false,
    onSuccess(loadedData) {
      let clients: {
        [clientId: string]: {
          checkAllTemplates: boolean,
          checkedTemplates: {
            [templateId: string]: boolean
          }
        }
      } = {}

      loadedData.forEach(client => {
        let checkedTemplates: { [templateId: string]: boolean } = {}
        client.invoiceTemplates.forEach(template => {
          checkedTemplates[template.id] = false
        })

        clients[client.id] = {
          checkAllTemplates: false,
          checkedTemplates: checkedTemplates
        }
      })

      store.setStore({
        clients: clients,
        checkAll: false
      })
    }
  });

  const generateInvoicesMutation = trpc.useMutation('invoiceTemplates.generateInvoices', {
    onSuccess() {
      snackbar({
        title: "Invoices generated successfully.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
    onError(error) {
      snackbar({
        title: "Error during invoice generation.",
        description: "Error trace: " + error.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    }
  });

  function onSubmit(fields: IForm) {
    let invoiceTemplateIds: string[] = []

    if (store.checkAll) {
      data?.forEach(client => {
        client.invoiceTemplates.forEach(template => {
          invoiceTemplateIds.push(template.id)
        })
      })
    }
    else {
      Object.keys(store.clients).forEach(clientId => {
        Object.keys(store.clients[clientId]?.checkedTemplates ?? []).forEach(templateId => {
          if (store.clients[clientId].checkedTemplates[templateId] || store.clients[clientId].checkAllTemplates) {
            invoiceTemplateIds.push(templateId)
          }
        })
      })
    }

    generateInvoicesMutation.mutate({
      dateFrom: new Date(fields.invoicedDatesFrom),
      dateTo: new Date(fields.invoicedDatesTo),
      invoiceTemplateIds: invoiceTemplateIds
    })
  }

  const selectedTemplatesAmount = useMemo(() => {
    if (store.checkAll) {
      let amount = 0
      data?.forEach(c => {
        c.invoiceTemplates.forEach(i => {
          amount += 1
        })
      })

      return amount
    }

    let amount = 0
    Object.keys(store.clients).forEach(clientId => {
      Object.keys(store.clients[clientId]?.checkedTemplates ?? []).forEach(templateId => {
        if (store.clients[clientId].checkedTemplates[templateId] || store.clients[clientId].checkAllTemplates) {
          amount += 1
        }
      })
    })

    return amount
  }, [store, data])

  return (
    <Page title={"Invoice Generator"} description="Use the invoice generator to generate all your invoices from invoice templates." isLoading={isLoading}>
      <PageBody pt="8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack p={4} gap={14}>

            <Card>
              <CardBody>
                <Section
                  title="Invoiced Dates"
                  description="Invoced templates will import time for the chosen dates."
                  variant="annotated">
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
                  isChecked={store.checkAll}
                  onChange={e => store.setCheckAll(e.target.checked)}
                />
                <Text>
                  Select all
                </Text>
              </Flex>
              <Divider />

              <Stack gap={2}>
                {
                  data?.map((client, index) => {
                    return (
                      <React.Fragment key={client.id}>
                        <ClientCheckbox templates={client.invoiceTemplates} clientId={client.id} clientName={client.name} />
                        {
                          data?.length !== 0 && index !== data?.length - 1
                            ? <Divider py={2} />
                            : null
                        }
                      </React.Fragment>
                    )
                  })
                }
              </Stack>

            </Stack>
            <Flex justifyContent="end">
              <Button type="submit" colorScheme="primary" isLoading={generateInvoicesMutation.isLoading}>Generate {selectedTemplatesAmount} invoices</Button>
            </Flex>
          </Stack>
        </form>
      </PageBody>
    </Page>
  )
}

export default Generator;