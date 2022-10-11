import { HStack, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure } from '@chakra-ui/react';
import { Page } from '@saas-ui/pro';
import { ErrorBoundary } from '@saas-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ClientSidebar } from '../../../../components/dashboard/clients/view/client-sidebar';
import { Breadcrumbs } from '../../../../components/dashboard/shared/breadcrumbs';
import { usePath } from '../../../../hooks/landing-page/use-path';
import { trpc } from '../../../../utils/trpc';

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
    
      return (
        <Page title={breadcrumbs} isLoading={isLoading} fullWidth>
          <HStack alignItems="stretch" height="100%" overflowX="hidden" spacing="0">
            <Tabs
              colorScheme="primary"
              isLazy
              flex="1"
              minH="0"
              display="flex"
              flexDirection="column"
            >
              <TabList borderBottomWidth="1px" height="12">
                <Tab>Invoices</Tab>
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
                    {/* <ActivitiesPanel contactId={id} /> */}
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


// const ActivitiesPanel: React.FC<{ contactId: string }> = ({ contactId }) => {
//     const currentUser = useCurrentUser()
  
//     const { data, isLoading } = useGetContactActivitiesQuery({
//       id: contactId,
//     })
  
//     const queryClient = useQueryClient()
  
//     const addMutation = useAddCommentMutation({
//       onSettled: () => {
//         queryClient.invalidateQueries(['GetContactActivities', { id: contactId }])
//       },
//     })
  
//     const deleteMutation = useDeleteCommentMutation({
//       onSettled: () => {
//         queryClient.invalidateQueries(['GetContactActivities', { id: contactId }])
//       },
//     })
  
//     return (
//       <>
//         {!currentUser || isLoading ? (
//           <Loader />
//         ) : (
//           <>
//             <Heading size="md" mb="8">
//               Activity
//             </Heading>
//             <ActivityTimeline
//               activities={(data?.activities || []) as Activities}
//               currentUser={currentUser}
//               onAddComment={async (data) => {
//                 return addMutation.mutate({
//                   contactId,
//                   comment: data.comment,
//                 })
//               }}
//               onDeleteComment={async (id) => {
//                 return deleteMutation.mutate({
//                   id: id as string,
//                 })
//               }}
//             />
//           </>
//         )}
//       </>
//     )
//   }


