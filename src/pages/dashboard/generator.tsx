import { NextPage } from "next";
import { requireAuth } from "../../common/requireAuth";

import { Flex, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import {
  Page, PageBody, Section
} from '@saas-ui/pro';
import { Card, CardBody, Form, FormLayout, useForm } from "@saas-ui/react";
import moment from 'moment';

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const Generator: NextPage = () => {
  let isLoading = false;

  var date = new Date();
  var firstDayInMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDayInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const form = useForm<{ invoicedDatesFrom: string, invoicedDatesTo: string }>({
    defaultValues: {
      invoicedDatesFrom: moment(firstDayInMonth).format("YYYY-MM-DD"),
      invoicedDatesTo: moment(lastDayInMonth).format("YYYY-MM-DD")
    }
  })

  const { register, control, handleSubmit, reset, formState, watch, setValue } = form
  const { errors } = formState;

  return (
    <Page title={"Invoice Generator"} description="Use the invoice generator to generate all your invoices from invoice templates." isLoading={isLoading}>
      <PageBody pt="8">
        <Card>
          <CardBody>
            <Section
              title="Invoiced Dates"
              description="Invoced templates will import time for the chosen dates."
              variant="annotated"
            >
              <Card>
                <CardBody>
                  <Form onSubmit={() => console.log("Hej")}>
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
                  </Form>
                </CardBody>
              </Card>
            </Section>
          </CardBody>
        </Card>
      </PageBody>
    </Page>
  )
}

export default Generator;