import { Center, Flex, Heading, Spinner, Stack, StackDivider, Text, VStack } from '@chakra-ui/react';
import { Button, useSnackbar } from '@saas-ui/react';
import { NextPage } from "next";
import { requireAuth } from "../../common/requireAuth";

import {
    Page, PageBody, Section
} from '@saas-ui/pro';
import { Card, CardBody } from "@saas-ui/react";
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';

export const getServerSideProps = requireAuth(async (ctx) => {
    return { props: {} };
});

const Clients: NextPage = () => {
    const { data, isLoading, isRefetching, refetch } = trpc.useQuery(["integrations.getActiveIntegrations"])


    const router = useRouter()
    const snackbar = useSnackbar()


    return (
        <Page title={"Clients"}>
            <PageBody pt="8">
                <Stack p="4" width="100%" gap="4">
                    <Card title={
                        <Flex>
                            <Heading>Clients</Heading>
                        </Flex>}>
                        <CardBody>

                        </CardBody>
                    </Card>
                </Stack>
            </PageBody>
        </Page >
    )
}

export default Clients;