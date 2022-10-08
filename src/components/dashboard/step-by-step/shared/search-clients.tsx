import { Box, Button, Center, Flex, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { trpc } from '../../../../utils/trpc';

import { Divider, SearchInput } from "@saas-ui/react";

interface Props {
    selectClient(client: string): void
}

export const SearchClient: React.FC<Props> = (props) => {
    const [search, setSearch] = React.useState('')

    const { data: clients, isLoading: clientsIsLoading, refetch } = trpc.useQuery(["clients.searchClients",
        {
            search: search,
            amount: 3
        }], {
        refetchOnWindowFocus: false,
    });

    React.useEffect(() => {
        refetch()
    }, [search])

    const { isOpen, onClose, onOpen } = useDisclosure()

    return (
        <Flex fontSize="md" alignItems="center" gap={4}>
            <Text>Import client settings from </Text>
            <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
                <PopoverTrigger>
                    <Button>Import</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>
                        Import settings from client
                    </PopoverHeader>
                    <PopoverBody>
                        <Flex gap={2} flexDirection="column">
                            <Box>
                                <SearchInput

                                    placeholder="Search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onReset={() => setSearch('')} />
                            </Box>
                            <Divider />
                            {
                                clients
                                    ? clients.map(client => {
                                        return (
                                            <Flex key={client.id} alignItems="center" justifyContent="space-between">
                                                <Text>{client.name}</Text>
                                                <Button onClick={() => {
                                                    props.selectClient(client.id)
                                                    onClose()
                                                }}>Import</Button>
                                            </Flex>
                                        )
                                    })
                                    : <Center>
                                        <Spinner />
                                    </Center>
                            }
                        </Flex>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Flex>
    )
}