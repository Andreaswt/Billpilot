import { NextPage } from "next";
import { requireAuth } from "../../common/requireAuth";

import { Button, Center, Checkbox, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import {
  Page, PageBody, Section
} from '@saas-ui/pro';
import { Card, CardBody, EmptyStateActions, EmptyStateBody, EmptyStateContainer, EmptyStateDescription, EmptyStateIcon, EmptyStateTitle, Form, FormLayout, Loader, useForm, useModals, useSnackbar } from "@saas-ui/react";
import moment from 'moment';
import React, { useEffect, useMemo } from "react";
import { trpc } from "../../utils/trpc";
import useInvoiceTemplatesStore from "../../../store/invoice-templates";
import ClientCheckbox from "../../components/dashboard/create-invoice/invoice-generator/ClientCheckbox";
import { WarningIcon } from "@chakra-ui/icons";
import router from "next/router";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const Generator: NextPage = () => {
  const store = useInvoiceTemplatesStore()
  const snackbar = useSnackbar()
  const modals = useModals()

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
          checkedTemplates[template.id] = template.active
        })

        clients[client.id] = {
          checkAllTemplates: false,
          checkedTemplates: checkedTemplates
        }
      })

      store.setStore({
        clients: clients,
        generatedTemplatesInfo: {},
        checkAll: false
      })
    }
  });

  const generateInvoicesMutation = trpc.useMutation('invoiceTemplates.generateInvoices', {
    onSuccess(mutationData) {
      store.setGeneratedTemplatesInfo(mutationData.templateTime)

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

  const validateTimeSetForTicketsMutation = trpc.useMutation('hubspot.validateTimeSetForTickets', {
    onSuccess(ticketsData) {
      if (Object.keys(ticketsData).length > 0) {
        modals.confirm({
          title: "Time not defined for the following hubspot tickets that will be imported.",
          body: (<>
            {Object.keys(ticketsData).map(key => {
              const ticket = ticketsData[key]
              return (<Text key={key}> Subject: {ticket.subject} - Id: {key}</Text>)
            })}
          </>),
          type: "custom",
          confirmProps: {
              colorScheme: 'red',
              label: 'Accept',
            },
          onConfirm: () => {
  
            snackbar({
              title: "Submitting form.",
              status: 'success',
              duration: 5000,
              isClosable: true,
            })
  
            submitData()
          },
        })
      }
      else {
        submitData()
      }
    },
  });

  function getInvoiceTemplateIds() {
    let invoiceTemplateIds: { clientId: string, invoiceTemplateId: string }[] = []

    if (store.checkAll) {
      data?.forEach(client => {
        client.invoiceTemplates.forEach(template => {
          invoiceTemplateIds.push({ clientId: client.id, invoiceTemplateId: template.id })
        })
      })
    }
    else {
      Object.keys(store.clients).forEach(clientId => {
        Object.keys(store.clients[clientId]?.checkedTemplates ?? []).forEach(templateId => {
          if (store.clients[clientId].checkedTemplates[templateId] || store.clients[clientId].checkAllTemplates) {
            invoiceTemplateIds.push({ clientId: clientId, invoiceTemplateId: templateId })
          }
        })
      })
    }

    return invoiceTemplateIds
  }

  function submitData() {
    const invoicedDatesFrom = form.watch("invoicedDatesFrom")
    const invoicedDatesTo = form.watch("invoicedDatesTo")

    generateInvoicesMutation.mutate({
      dateFrom: new Date(invoicedDatesFrom),
      dateTo: new Date(invoicedDatesTo),
      invoiceTemplateIds: getInvoiceTemplateIds()
    })
  }

  function onSubmit(fields: IForm) {
    if (selectedTemplatesAmount === 0) {
      snackbar({
        title: "Select templates to use invoice generator.",
        status: 'error',
        duration: 8000,
        isClosable: true,
      })

      return
    }

    const invoiceTemplateIds = getInvoiceTemplateIds()

    if (activeIntegrationsData && "HUBSPOT" in activeIntegrationsData) {
      validateTimeSetForTicketsMutation.mutate({
        invoiceTemplateIds: invoiceTemplateIds.map(x => x.invoiceTemplateId)
      })

      return
    }

    submitData()
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


  const { data: activeIntegrationsData } = trpc.useQuery(["integrations.getActiveIntegrations"], {
    refetchOnWindowFocus: false
  })

  return (
    <Page title={"Invoice Generator"} description="Use the invoice generator to generate all your invoices from invoice templates." isLoading={isLoading}>
      <PageBody pt="8">
        {
          !activeIntegrationsData
            ? <Center>
              <Loader />
            </Center>
            : (
              !activeIntegrationsData["JIRA"] && !activeIntegrationsData["HUBSPOT"]
                ? <EmptyStateContainer colorScheme="primary">
                  <EmptyStateBody>
                    <EmptyStateIcon as={WarningIcon} />
                    <EmptyStateTitle>Invoice generator only supports the jira and hubspot integrations for now</EmptyStateTitle>
                    <EmptyStateDescription>Do you want to set it up now?</EmptyStateDescription>
                    <EmptyStateActions>
                      <Button onClick={() => router.push("/dashboard/integrations")} colorScheme="primary">Set up</Button>
                      <Button onClick={() => router.back()} variant="outline">Back</Button>
                    </EmptyStateActions>
                  </EmptyStateBody>
                </EmptyStateContainer>
                : <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack p={4} gap={14}>

                    <Card>
                      <CardBody>
                        <Section
                          title="Invoiced Dates"
                          description="Invoiced templates will import time for the chosen dates."
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
                      <Button type="submit" colorScheme="primary" isLoading={generateInvoicesMutation.isLoading || validateTimeSetForTicketsMutation.isLoading}>Generate {selectedTemplatesAmount} invoices</Button>
                    </Flex>
                  </Stack>
                </form>
            )
        }
      </PageBody>
    </Page>
  )
}

export default Generator;