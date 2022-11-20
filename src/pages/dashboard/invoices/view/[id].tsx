import { Box, Flex, Stack, StackDivider, Text, VStack } from '@chakra-ui/react';
import { Page, PageBody, Section } from '@saas-ui/pro';
import {
  PropertyList,
  Property,
  Card,
  CardBody,
} from '@saas-ui/react'
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { formatCurrency } from '../../../../../lib/helpers/currency';
import { Breadcrumbs } from '../../../../components/dashboard/shared/breadcrumbs';
import { trpc } from '../../../../utils/trpc';

const View: NextPage = () => {
  const router = useRouter()
  const invoiceId = router.query?.id as string

  const { data, isLoading } = trpc.useQuery(["invoices.getInvoice", { invoiceId: invoiceId }], {
    refetchOnWindowFocus: false,
  });

  const breadcrumbs = (
    <Breadcrumbs
      items={[
        { href: '/dashboard/invoices', title: 'Invoices' },
        { title: data?.title },
      ]}
    />
  )

  return (
    <Page title={breadcrumbs} isLoading={isLoading} fullWidth>
      <PageBody pt="8">
        <Stack p="4" width="100%" gap="4">
          <Card>
            <CardBody>
              <VStack divider={<StackDivider />} align="stretch" spacing={8} pb="16">
                <Section
                  title="Invoice options"
                  description="General invoice options."
                  variant="annotated"
                >
                  <Card>
                    <CardBody>
                      <PropertyList>
                        <Property hidden={!data?.title} label="Title" value={data?.title} />
                        <Property hidden={!data?.description} label="Description" value={data?.description} />
                        <Property hidden={!data?.pricePerHour} label="Price per hour" value={data?.pricePerHour} />
                        <Property hidden={!data?.currency} label="Currency" value={data?.currency} />
                        <Property hidden={!data?.roundingScheme} label="Rounding scheme" value={data?.roundingScheme} />
                        <Property hidden={!data?.invoicedFrom} label="Invoiced from" value={data?.invoicedFrom?.toUTCString()} />
                        <Property hidden={!data?.invoicedTo} label="Invoiced to" value={data?.invoicedTo?.toUTCString()} />
                        <Property hidden={!data?.issueDate} label="Issue date" value={data?.issueDate.toUTCString()} />
                        <Property hidden={!data?.dueDate} label="Due date" value={data?.dueDate?.toUTCString()} />

                      </PropertyList>
                    </CardBody>
                  </Card>
                </Section>
                {
                  data?.economicOptions
                    ? <Section
                      title="E-conomic options"
                      description="Settings for when invoice is exported to e-conomic."
                      variant="annotated"
                    >
                      <Card>
                        <CardBody>
                          <Property hidden={!data?.economicOptions.customer} label="Customer" value={data?.economicOptions.customer} />
                          <Property hidden={!data?.economicOptions.text1} label="Text 1" value={data?.economicOptions.text1} />
                          <Property hidden={!data?.economicOptions.ourReference} label="Our Reference" value={data?.economicOptions.ourReference} />
                          <Property hidden={!data?.economicOptions.customerContact} label="Customer Contact" value={data?.economicOptions.customerContact} />
                          <Property hidden={!data?.economicOptions.unit} label="Unit" value={data?.economicOptions.unit} />
                          <Property hidden={!data?.economicOptions.layout} label="Layout" value={data?.economicOptions.layout} />
                          <Property hidden={!data?.economicOptions.vatZone} label="Vat Zone" value={data?.economicOptions.vatZone} />
                          <Property hidden={!data?.economicOptions.paymentTerms} label="Payment Terms" value={data?.economicOptions.paymentTerms} />
                          <Property hidden={!data?.economicOptions.product} label="Product" value={data?.economicOptions.product} />
                        </CardBody>
                      </Card>
                    </Section>
                    : null
                }
              </VStack>
            </CardBody>
          </Card>

          <Card title="Invoice lines">
            <CardBody>
              <Stack>
                <Flex fontWeight="bold" justifyContent="space-between">
                  <Flex w="20%">
                    Title
                  </Flex>
                  <Flex w="20%">
                    Quantity
                  </Flex>
                  <Flex w="20%">
                    Unit Price
                  </Flex>
                  <Flex w="20%">
                    Updated Hours Spent
                  </Flex>
                  <Flex w="20%">
                    Discount Percentage
                  </Flex>
                </Flex>
                {
                  data?.invoiceLines.map(x => {
                    return (
                    <Flex key={x.id} justifyContent="space-between">
                      <Flex w="20%">
                        {x.title}
                      </Flex>
                      <Flex w="20%">
                        {x.quantity} hours
                      </Flex>
                      <Flex w="20%">
                        {formatCurrency(x.unitPrice, data?.currency)}
                      </Flex>
                      <Flex w="20%">
                        {x.updatedHoursSpent}
                      </Flex>
                      <Flex w="20%">
                        {x.discountPercentage} %
                      </Flex>
                    </Flex>)
                  })
                }
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      </PageBody>
    </Page>
  )
}

export default View;
