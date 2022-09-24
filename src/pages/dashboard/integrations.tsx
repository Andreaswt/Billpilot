import { Center, Flex, Heading, Spinner, Stack, StackDivider, Text, VStack } from '@chakra-ui/react';
import { Button, useSnackbar } from '@saas-ui/react';
import { NextPage } from "next";
import { requireAuth } from "../../common/requireAuth";

import {
    Page, PageBody, Section
} from '@saas-ui/pro';
import { Card, CardBody } from "@saas-ui/react";
import router, { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import { useEffect, useState } from 'react';
import { EmployeeStatus } from 'xero-node/dist/gen/model/payroll-au/employeeStatus';

export const getServerSideProps = requireAuth(async (ctx) => {
    return { props: {} };
});

const Integrations: NextPage = () => {
    const { data, isLoading, isRefetching, refetch } = trpc.useQuery(["integrations.getActiveIntegrations"])

    const { mutateAsync } = trpc.useMutation(["integrations.signout"], {
        onSuccess: () => {
            refetch()
        }
    });

    const router = useRouter()
    const snackbar = useSnackbar()

    useEffect(() => {
        const isError = Boolean(router.query["error"])
        const isSuccess = Boolean(router.query["success"])

        // No messages? Don't show anything
        if (!isError && !isSuccess) return

        // Show message
        const message = router.query["message"]
        if (!message) return

        let status: 'info' | 'success' | 'error' = 'info'
        if (isSuccess) status = 'success'
        if (isError) status = 'error'

        let title: string = 'Info'
        if (isSuccess) title = 'Integration setup success.'
        if (isError) title = 'Integration setup error.'

        snackbar({
            title: title,
            description: message,
            status: status,
            duration: 4000,
            isClosable: true,
        })

    }, [router.query, snackbar])

    return (
        <Page title={"Integrations"}>
            <PageBody pt="8">
                <Stack p="4" width="100%" gap="4">
                    <Card title={
                        <Flex>
                            <Heading>Integrations</Heading>
                        </Flex>}>
                        <CardBody>
                            {!isLoading && !isRefetching && data
                                ? <VStack divider={<StackDivider />} align="stretch" spacing={8} pb="16">
                                    <Section
                                        title="Jira"
                                        description="Connect to Jira by clicking the button and logging in."
                                        variant="annotated">
                                        <Card>
                                            <CardBody>
                                                {
                                                    data["JIRA"]
                                                        ?
                                                        <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                            <Text fontSize="sm" as="i">Your account is integrated with Jira.</Text>
                                                            <Button onClick={() => mutateAsync({ provider: "JIRA" })} colorScheme="red">
                                                                Log out of Jira
                                                            </Button>
                                                        </Flex>
                                                        : <Flex justifyContent="start">
                                                            <Button onClick={() => router.push("/api/jira/redirect")} colorScheme="primary">
                                                                Log in with Jira
                                                            </Button>
                                                        </Flex>
                                                }
                                            </CardBody>
                                        </Card>
                                    </Section>
                                    <Section
                                        title="E-conomic"
                                        description="Connect to E-conomic by clicking the button and logging in."
                                        variant="annotated">
                                        <Card>
                                            <CardBody>
                                                {
                                                    data["ECONOMIC"]
                                                        ?
                                                        <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                            <Text fontSize="sm" as="i">Your account is integrated with E-conomic.</Text>
                                                            <Button onClick={() => mutateAsync({ provider: "ECONOMIC" })} colorScheme="red">
                                                                Log out of E-conomic
                                                            </Button>
                                                        </Flex>
                                                        : <Flex justifyContent="start">
                                                            <Button onClick={() => router.push("/api/economic/redirect")} colorScheme="primary">
                                                                Log in with E-conomic
                                                            </Button>
                                                        </Flex>
                                                }
                                            </CardBody>
                                        </Card>
                                    </Section>
                                    <Section
                                        title="Xero"
                                        description="Connect to Xero by clicking the button and logging in."
                                        variant="annotated">
                                        <Card>
                                            <CardBody>
                                                {
                                                    data["XERO"]
                                                        ?
                                                        <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                            <Text fontSize="sm" as="i">Your account is integrated with Xero.</Text>
                                                            <Button onClick={() => mutateAsync({ provider: "XERO" })} colorScheme="red">
                                                                Log out of Xero
                                                            </Button>
                                                        </Flex>
                                                        : <Flex justifyContent="start">
                                                            <Button onClick={() => router.push("/hejsa")} colorScheme="primary">
                                                                Log in with Xero
                                                            </Button>
                                                        </Flex>
                                                }
                                            </CardBody>
                                        </Card>
                                    </Section>
                                    <Section
                                        title="Asana"
                                        description="Connect to Asana by clicking the button and logging in."
                                        variant="annotated">
                                        <Card>
                                            <CardBody>
                                                {
                                                    data["ASANA"]
                                                        ?
                                                        <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                            <Text fontSize="sm" as="i">Your account is integrated with Asana.</Text>
                                                            <Button onClick={() => mutateAsync({ provider: "ASANA" })} colorScheme="red">
                                                                Log out of Asana
                                                            </Button>
                                                        </Flex>
                                                        : <Flex justifyContent="start">
                                                            <Button onClick={() => router.push("/hejsa")} colorScheme="primary">
                                                                Log in with Asana
                                                            </Button>
                                                        </Flex>
                                                }
                                            </CardBody>
                                        </Card>
                                    </Section>
                                    <Section
                                        title="Quickbooks"
                                        description="Connect to Quickbooks by clicking the button and logging in."
                                        variant="annotated">
                                        <Card>
                                            <CardBody>
                                                {
                                                    data["QUICKBOOKS"]
                                                        ?
                                                        <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                            <Text fontSize="sm" as="i">Your account is integrated with Quickbooks.</Text>
                                                            <Button onClick={() => mutateAsync({ provider: "QUICKBOOKS" })} colorScheme="red">
                                                                Log out of Quickbooks
                                                            </Button>
                                                        </Flex>
                                                        : <Flex justifyContent="start">
                                                            <Button onClick={() => router.push("/hejsa")} colorScheme="primary">
                                                                Log in with Quickbooks
                                                            </Button>
                                                        </Flex>
                                                }
                                            </CardBody>
                                        </Card>
                                    </Section>
                                </VStack>
                                : <Center><Spinner /></Center>
                            }
                        </CardBody>
                    </Card>
                </Stack>
            </PageBody>
        </Page >
    )
}

export default Integrations;