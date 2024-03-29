import { WarningIcon } from '@chakra-ui/icons';
import { Badge, Box, Button, Flex, HStack, Stack, Text, Wrap } from '@chakra-ui/react';
import { Currency, InvoiceTemplateFilterTypes } from '@prisma/client';
import { Card, CardBody, EmptyStateActions, EmptyStateBody, EmptyStateContainer, EmptyStateDescription, EmptyStateIcon, EmptyStateTitle, Loader, Property, PropertyList } from '@saas-ui/react';
import router from 'next/router';
import * as React from 'react';
import { formatCurrency } from '../../../../../lib/helpers/currency';
import { trpc } from '../../../../utils/trpc';

interface Props {
    clientId: string
    currency?: Currency
    changeTabs(index: number): void
}

export const InvoiceTemplates: React.FC<Props> = (props) => {
    const { clientId, currency, changeTabs } = props

    const utils = trpc.useContext();
    const { data, isLoading } = trpc.useQuery(["invoiceTemplates.getInvoiceTemplates", { clientId: clientId }], {
        refetchOnWindowFocus: false,
    });
    const activationMutation = trpc.useMutation('invoiceTemplates.changeActiveStatus', {
        onSuccess() {
            utils.invalidateQueries(['invoiceTemplates.getInvoiceTemplates'])
        }
    });
    const deletionMutation = trpc.useMutation('invoiceTemplates.delete', {
        onSuccess() {
            utils.invalidateQueries(['invoiceTemplates.getInvoiceTemplates'])
        }
    });

    if (isLoading || !data || !currency) {
        return (<Loader />)
    }

    return (
        <Stack gap={4}>
            {
                data.length === 0
                    ? <EmptyStateContainer colorScheme="primary">
                        <EmptyStateBody>
                            <EmptyStateIcon as={WarningIcon} />
                            <EmptyStateTitle>No invoice templates created yet.</EmptyStateTitle>
                            <EmptyStateDescription>Do you want to create one now?</EmptyStateDescription>
                            <EmptyStateActions>
                                <Button onClick={() => changeTabs(2)} colorScheme="primary">Create</Button>
                            </EmptyStateActions>
                        </EmptyStateBody>
                    </EmptyStateContainer>
                    : (data.map(x => {
                        return (
                            <Card
                                key={x.id}
                                title={x.title}
                                action={
                                    <Flex gap={4}>
                                        <Button onClick={() => activationMutation.mutate({ invoiceTemplateId: x.id, active: x.active })} colorScheme={x.active ? "red" : "green"} variant="solid">
                                            {x.active ? "Deactivate" : "Activate"}
                                        </Button>
                                        <Button onClick={() => deletionMutation.mutate({ invoiceTemplateId: x.id })} colorScheme="red" variant="solid">
                                            Delete
                                        </Button>
                                    </Flex>
                                }>
                                <CardBody>
                                    <PropertyList>
                                        <Property
                                            label="Filters"
                                            value={
                                                <Box flex="1">
                                                    {
                                                        x.filters.length === 0
                                                            ? "-"
                                                            : <Wrap>
                                                                {
                                                                    x.filters.map(filter => {
                                                                        let color = "green"
                                                                        switch (filter.type) {
                                                                            case InvoiceTemplateFilterTypes.JIRAPROJECT:
                                                                                color = "green"
                                                                                break;
                                                                            case InvoiceTemplateFilterTypes.JIRAEMPLOYEE:
                                                                                color = "red"
                                                                                break;
                                                                        }

                                                                        return (
                                                                            <Card key={filter.id}>
                                                                                <CardBody p={2}>
                                                                                    <HStack>
                                                                                        <Badge colorScheme={color}>{filter.type}</Badge>
                                                                                        <Text fontSize='xs'>{filter.name}</Text>
                                                                                    </HStack>
                                                                                </CardBody>
                                                                            </Card>
                                                                        )
                                                                    })
                                                                }
                                                            </Wrap>
                                                    }
                                                </Box>
                                            }
                                        />
                                        <Property label="Fixed price time items" value={
                                            <Stack my={x.invoiceTemplateFixedPriceTimeItems.length > 1 ? 4 : 0}>
                                                {
                                                    x.invoiceTemplateFixedPriceTimeItems.map(item => {
                                                        return (
                                                            <Flex key={item.id} gap={4} justifyContent="space-between">
                                                                <Text>{item.name}:</Text><Text>{formatCurrency(Number(item.amount), currency)}</Text>
                                                            </Flex>
                                                        )
                                                    })
                                                }
                                            </Stack>
                                        } />
                                        <Property label="Created at" value={x.createdAt.toUTCString()} />
                                    </PropertyList>
                                </CardBody>
                            </Card>
                        )
                    }))
            }
        </Stack >
    )
}
