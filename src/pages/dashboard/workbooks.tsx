import { Stack } from '@chakra-ui/react';
import { NextPage } from "next";
import React from 'react';

import {
    Page, PageBody
} from '@saas-ui/pro';
import { requireAuth } from '../../common/requireAuth';
import { trpc } from '../../utils/trpc';

export const getServerSideProps = requireAuth(async (ctx) => {
    return { props: {} };
});

const Workbooks: NextPage = () => {
    const [step, setStep] = React.useState(0);

    const { data, isLoading, isRefetching, refetch } = trpc.useQuery(["workbooks.test"], {
        refetchOnWindowFocus: false
    })

    return (
        <Page title={"Workbooks"}>
            <PageBody pt="8">
                <Stack p="4" width="100%" gap="4">
                    Workbooks testing
                </Stack>
            </PageBody>
        </Page >
    )
}

export default Workbooks;