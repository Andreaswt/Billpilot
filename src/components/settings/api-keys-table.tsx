import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableContainer,
    Box,
    Heading,
    Text,
    Spinner,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react';
import React from 'react';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import ApiKeyModal from './new-api-key-modal';

interface IUpdateApiTokens {
    [key: string]: boolean;
}

const ApiKeyTable = () => {
    // Whether to show asterisk or not
    const [asterikAppSecretToken, setAsterikAppSecretToken] = useState(false);
    const [asterikAgreementGrantToken, setAsterikAgreementGrantToken] = useState(false);

    const { data: session, status } = useSession();

    const apiKeys: { provider: string, keys: string[] }[] = [
        { provider: "E-conomic", keys: ["App Secret Token", "Agreement Grant Token"] },
        { provider: "Jira", keys: ["Your Jira Website Link", "Username", "Password"] },
    ];

    const { data, isLoading } = trpc.useQuery([
        "apiKeys.getAllKeysAndValues"
    ]);

    if (isLoading) {
        return (<><Spinner color='brand.800' /></>);
    }

    return (
        apiKeys.map((providerAndKeys) => {
            return (
                <React.Fragment key={providerAndKeys.provider}>
                    <Heading size='lg' pb={4}>{providerAndKeys.provider}</Heading>
                    <Box mb={8} borderWidth={'1px'} py={'2'} rounded='lg'>
                        <TableContainer>
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th>Api Key</Th>
                                        <Th>Value</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>

                                    {providerAndKeys.keys.map((apiKey) => {
                                        let apiKeyValue = data?.find(x => x.key === apiKey)?.value;

                                        return (<Tr key={apiKey}>
                                            <Td>
                                                {apiKey}
                                            </Td>
                                            {!apiKeyValue
                                                ?
                                                <Td>
                                                    <Text color={'red.600'}>Not set</Text>
                                                </Td>
                                                :
                                                <Td>
                                                    <Text>{apiKeyValue}</Text>
                                                </Td>
                                            }
                                            <Td textAlign={'right'}>
                                                <ApiKeyModal provider={providerAndKeys.provider} apiKey={apiKey} apiValue={apiKeyValue} />
                                            </Td>
                                        </Tr>)
                                    })}
                                </Tbody>
                                <Tfoot>
                                    <Tr>
                                        <Th>Api Key</Th>
                                        <Th>Click to reveal</Th>
                                        <Th></Th>
                                    </Tr>
                                </Tfoot>
                            </Table>
                        </TableContainer>
                    </Box>
                </React.Fragment>
            )
        })
    )
}

export default ApiKeyTable;