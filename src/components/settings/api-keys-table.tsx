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
    Button,
    Heading,
    Input,
    Text,
    Spinner
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { trpc } from '../../utils/trpc';

interface IUpdateApiTokens {
    [key: string]: boolean;
}

const ApiKeyTable = () => {

    const [apiTokens, setApiTokens] = useState([
        "App Secret Token",
        "Agreement Grant Token"
    ]);

    const [updateApiTokens, setUpdateApiTokens] = useState<IUpdateApiTokens>({
        "App Secret Token": false,
        "Agreement Grant Token": false
    });

    const { data, isLoading } = trpc.useQuery([
        "apiKeys.getAllKeysAndValues"
    ]);

    if (isLoading) {
        return (<><Spinner color='brand.800' /></>);
    }

    if (data?.length === 0) {
        return (<><Text>No API Keys</Text></>);
    }

    return (
        <>
            <Heading size='lg' pb={4}>E-conomic</Heading>
            <Box borderWidth={'1px'} py={'2'} rounded='lg'>
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
                            <>
                            {data?.map((apiKey, index) => {
                                <Tr>
                                    <Td>{apiKey.key}</Td>
                                    {/* <Td>
                                        {updateApiTokens ?
                                            <Input placeholder='Key here' /> :
                                            <Text>hej</Text>}
                                        {false ? <Text color={'red.600'}>Not set</Text> : <>
                                            {data?.find(x => x.key === apiKey)}
                                        </>}
                                    </Td>
                                    <Td textAlign={'right'}>
                                        <Button onClick={() => setUpdateAppSecretToken(!updateAppSecretToken)} bg={'brand.button-bg'} textColor={'brand.button-text'}>
                                            Update
                                        </Button>
                                    </Td> */}
                                </Tr>
                            })}
                            </>
                            {/* <Tr>
                                <Td>App Secret Token</Td>
                                <Td>
                                    {updateAppSecretToken ? 
                                    <Input placeholder='Key here' /> :
                                    <Text>hej</Text>}
                                    { false ? <Text color={'red.600'}>Not set</Text> : <>
                                    {data?.find(x => x.key === 'AppSecretToken')?.value}
                                    </>}
                                </Td>
                                <Td textAlign={'right'}>
                                    <Button onClick={() => setUpdateAppSecretToken(!updateAppSecretToken)} bg={'brand.button-bg'} textColor={'brand.button-text'}>
                                        Update
                                    </Button>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td>Agreement Grant Token</Td>
                                <Td >
                                    {updateAgreementGrantToken ? <Input placeholder='Key here' /> : <Text color={'red.600'}>Not set</Text>}
                                </Td>
                                <Td textAlign={'right'}>
                                    <Button onClick={() => setUpdateAgreementGrantToken(!updateAgreementGrantToken)} bg={'brand.button-bg'} textColor={'brand.button-text'}>
                                        Update
                                    </Button>
                                </Td>
                            </Tr> */}
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th>Api Key</Th>
                                <Th>Value</Th>
                                <Th></Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

export default ApiKeyTable;