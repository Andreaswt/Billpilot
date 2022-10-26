import { HStack, Icon, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure } from '@chakra-ui/react';
import { Page } from '@saas-ui/pro';
import { ErrorBoundary } from '@saas-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ClientSidebar } from '../../../../components/dashboard/clients/view/client-sidebar';
import { Breadcrumbs } from '../../../../components/dashboard/shared/breadcrumbs';
import { usePath } from '../../../../hooks/landing-page/use-path';
import { trpc } from '../../../../utils/trpc';
import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import { CreateInvoiceTemplate } from '../../../../components/dashboard/clients/view/create-invoice-template';
import { useState } from 'react';
import { InvoiceTemplates } from '../../../../components/dashboard/clients/view/invoice-templates';

const View: NextPage = () => {
    const router = useRouter()
    const clientId = router.query?.id as string
    if (!clientId) router.push("/404")

    const { data, isLoading } = trpc.useQuery(["clients.getReadableClient", { id: clientId }], {
        refetchOnWindowFocus: false,
    });
    
      const sidebar = useDisclosure({
        defaultIsOpen: true,
      })
    
      const breadcrumbs = (
        <Breadcrumbs
          items={[
            { href: usePath('/dashboard/clients'), title: 'Clients' },
            { title: data?.name },
          ]}
        />
      )

      const [tabIndex, setTabIndex] = useState(0)
      const handleTabsChange = (index: number) => {
        setTabIndex(index)
      }
    
      return (
        <Page title={breadcrumbs} isLoading={isLoading} fullWidth>
          <HStack alignItems="stretch" height="100%" overflowX="hidden" spacing="0">
            <Tabs
              index={tabIndex} onChange={handleTabsChange}
              colorScheme="primary"
              isLazy
              flex="1"
              minH="0"
              display="flex"
              flexDirection="column"
            >
              <TabList borderBottomWidth="1px" height="12">
                <Tab>Invoices</Tab>
                <Tab>Invoice templates</Tab>
                <Tab gap={2}>
                  <Icon h={3} w={3} as={AddIcon} /> Create new invoice template
                  </Tab>
              </TabList>
              <TabPanels
                py="8"
                px="20"
                overflowY="auto"
                maxW="container.xl"
                margin="0 auto"
                flex="1"
              >
                <TabPanel>
                  <ErrorBoundary>
                    Invoices
                  </ErrorBoundary>
                </TabPanel>
                <TabPanel>
                  <ErrorBoundary>
                    <InvoiceTemplates currency={data?.currency} clientId={clientId} />
                  </ErrorBoundary>
                </TabPanel>
                <TabPanel>
                  <ErrorBoundary>
                  <CreateInvoiceTemplate currency={data?.currency} changeTabs={handleTabsChange} />
                  </ErrorBoundary>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <ClientSidebar client={data} economicOptions={data?.economicOptions ? data.economicOptions : undefined} isOpen={sidebar.isOpen} />
          </HStack>
        </Page>
      )
}

export default View;
