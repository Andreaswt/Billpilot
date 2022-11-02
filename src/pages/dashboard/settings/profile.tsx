import { Center, Flex, Stack, StackDivider, useDisclosure, VStack } from '@chakra-ui/react';
import { NextPage } from "next";

import {
    Page, PageBody, Section
} from '@saas-ui/pro';
import { Button, Card, CardBody, Loading, Property, PropertyList } from "@saas-ui/react";
import { ConfirmProfileDeletion } from '../../../components/dashboard/settings/profile/confirm-profile-deletion';
import { trpc } from '../../../utils/trpc';

const Profile: NextPage = () => {
    const getUser = trpc.useQuery(["account.getUser"], {
        refetchOnWindowFocus: false
    });

    return (
        <Page title={"Profile"}>
            <PageBody>
                <Stack p="4" width="100%" gap="4">
                    <Card>
                        <CardBody>
                            <VStack divider={<StackDivider />} align="stretch" spacing={8} pb="16">
                                <Section
                                    title="Your profile"
                                    description="Information about your account."
                                    variant="annotated">
                                    {
                                        !getUser.isFetching && !getUser.isLoading && getUser.data
                                            ? <Center>
                                                <Card width="full">
                                                    <CardBody>
                                                        <PropertyList>
                                                            <Property label="Name" value={getUser.data.name} />
                                                            <Property label="Email" value={getUser.data.email} />
                                                            <Property label="Created At" value={getUser.data.createdAt.toUTCString()} />
                                                        </PropertyList>
                                                    </CardBody>
                                                </Card>
                                            </Center>
                                            : <Loading />
                                    }
                                </Section>
                                <Section
                                    title="Organization"
                                    description="Critical actions regarding your organization."
                                    variant="annotated"
                                >
                                    <Card width="full">
                                        <CardBody>
                                            <PropertyList>
                                                <Flex alignItems="center" justifyContent="space-between">
                                                    <Property labelWidth="max" label="Delete your organization and account" />
                                                    <ConfirmProfileDeletion />
                                                </Flex>
                                            </PropertyList>
                                        </CardBody>
                                    </Card>
                                </Section>
                            </VStack>
                        </CardBody>
                    </Card>
                </Stack>
            </PageBody>
        </Page >
    )
}

export default Profile;