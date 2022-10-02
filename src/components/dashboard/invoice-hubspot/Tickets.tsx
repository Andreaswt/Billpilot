import { Button, Center, Flex, Heading, Input, InputGroup, InputRightElement, Spinner, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { ColumnDef, DataGrid, DataGridPagination } from '@saas-ui/pro';
import { Card, CardBody, SearchInput } from "@saas-ui/react";
import { TbPercentage } from "react-icons/tb";
import useInvoiceHubspotTicketsStore, { PickedTicket } from '../../../../store/invoiceHubspotTickets';
import { trpc } from '../../../utils/trpc';
import { TableTooltip } from './table-tooltip';


interface IProps {
    setStep: Dispatch<SetStateAction<number>>
}

interface TableRow {
    id: string
    subject: string
    content: string
    lastModified: string
}

interface IPagination {
    amount: number
    total: number
}

const Tickets = (props: IProps) => {
    const { setStep } = props
    const store = useInvoiceHubspotTicketsStore();
    const [selected, setSelected] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [pagination, setPagination] = useState<IPagination>({ amount: 0, total: 0 })
    const [tickets, setTickets] = useState<TableRow[]>([])
    const [pickAtLeastOneTicket, setPickAtLeastOneTicket] = useState(false)

    const [updatedHoursSpent, setUpdatedHoursSpent] = useState<{ [ticketId: string]: { updatedTimeSpent: number } }>(() => {
        let updatedHoursSpent: { [ticketId: string]: { updatedTimeSpent: number } } = {}

        store.pickedTickets.forEach(ticket => {
            if (!ticket.id || !ticket.updatedHoursSpent) return
            updatedHoursSpent[ticket.id] = { updatedTimeSpent: ticket.updatedHoursSpent }
        })

        return updatedHoursSpent
    })

    const [discountPercentage, setDiscountPercentage] = useState<{ [ticketId: string]: { discountPercentage: number } }>(() => {
        let discountPercentage: { [ticketId: string]: { discountPercentage: number } } = {}

        store.pickedTickets.forEach(ticket => {
            if (!ticket.id || !ticket.discountPercentage) return
            discountPercentage[ticket.id] = { discountPercentage: ticket.discountPercentage }
        })

        return discountPercentage
    })
    let isInitialized = false;

    const { data, isLoading, isRefetching } = trpc.useQuery(["hubspot.searchTickets", { searchTerm: searchTerm, companyId: store.pickedCompany }], {
        onSuccess(data) {
            setPagination({ amount: data.amount, total: data.total })
            setTickets(data.tickets)

            // Selected tickets from zustand are used to restore state in selected
            let storeSelected: string[] = []
            store.pickedTickets.forEach(ticket => {
                const ticketIndex = data.tickets.findIndex(x => x.id === ticket.id)
                if (!ticketIndex && ticketIndex != 0) return

                storeSelected.push(ticketIndex.toString())
            })

            setSelected(storeSelected)
        },
        refetchOnWindowFocus: false
    });

    function pickTickets() {
        let selectedData: PickedTicket[] = []

        if (selected.length === 0) {
            setPickAtLeastOneTicket(true)
            return
        }

        selected.forEach((item) => {
            const rowTicket = tickets[parseInt(item)]
            const updatedHoursSpentForTicket = updatedHoursSpent[rowTicket.id]?.updatedTimeSpent
            const discountPercentageForTicket = discountPercentage[rowTicket.id]?.discountPercentage

            const ticketWithEdits = { ...rowTicket, updatedHoursSpent: updatedHoursSpentForTicket ?? null, discountPercentage: discountPercentageForTicket ?? null }
            selectedData.push(ticketWithEdits)
        })

        store.pickTickets(selectedData)

        setStep((state) => state + 1)
    }

    const selectedRowIds: Record<string, boolean> = useMemo(() => {
        const selected: Record<string, boolean> = {}

        store.pickedTickets.forEach((ticket) => {
            // Get index of checked item in list of items
            if (!data) return

            const index = data.tickets.findIndex(x => x.id == ticket.id)

            // Add the index to the record such that it is checked
            if (index != -1) {
                selected[index.toString()] = true
            }
        })

        return selected
    }, [data, store.pickedTickets])

    const columns: ColumnDef<TableRow>[] = [
        {
            id: 'subject',
            header: 'Subject',
            cell: (data) => (<TableTooltip text={data.row.original.subject} />)
        },
        {
            id: 'content',
            header: 'Content',
            cell: (data) => (<TableTooltip text={data.row.original.content} />)
        },
        {
            id: 'lastModified',
            header: 'Last Modified',
            cell: (data) => (<TableTooltip text={data.row.original.lastModified} />)
        },
        {
            id: 'id',
            header: 'Id',
        },
        {
            id: 'updatedHoursSpent',
            header: 'Updated hours spent',
            cell: (data) => (
                <>
                    <InputGroup size='sm'>
                        <Input defaultValue={store.pickedTickets.find(x => x.id === data.row.original.id)?.updatedHoursSpent ?? 0} onChange={(e: any) => {
                            setUpdatedHoursSpent(prevState => {
                                const newState = prevState;
                                newState[data.row.original.id.toString()] = { updatedTimeSpent: parseInt(e.target.value) }
                                return newState
                            })
                        }} min={0} type="number"></Input>
                        <InputRightElement pointerEvents='none'>
                            <Text mr={6} color='gray.300'>Hours</Text>
                        </InputRightElement>
                    </InputGroup>
                </>
            )
        },
        {
            id: 'percentageDiscount',
            header: 'Percentage discount',
            cell: (data) => (
                <>
                    <InputGroup size='sm'>
                        <Input defaultValue={store.pickedTickets.find(x => x.id === data.row.original.id)?.discountPercentage ?? 0} onChange={(e: any) => {
                            setDiscountPercentage(prevState => {
                                const newState = prevState;
                                newState[data.row.original.id.toString()] = { discountPercentage: parseInt(e.target.value) }
                                return newState
                            })
                        }} min={0} max={100} type="number"></Input>
                        <InputRightElement pointerEvents='none'>
                            <TbPercentage color='gray.300' />
                        </InputRightElement>
                    </InputGroup>
                </>
            )
        },
    ]

    const totalTime = useMemo(() => {
        let total = 0

        selected.forEach(item => {
            const rowTicket = tickets[parseInt(item)]
            const updatedHoursSpentForTicket = updatedHoursSpent[rowTicket.id]?.updatedTimeSpent

            let rowTotal = 0 // rowTicket.hoursSpent TODO: field not created yet
            if (updatedHoursSpentForTicket && updatedHoursSpentForTicket > 0) {
                rowTotal = updatedHoursSpentForTicket
            }

            total += rowTotal
        })

        return total
    }, [selected, tickets, updatedHoursSpent])

    const handleSelectedRows = (indexes: string[]) => {
        if (indexes.length === selected.length) {
            isInitialized = true;
        }

        if (isInitialized === true && indexes.length !== selected.length) {
            setSelected(indexes)
        }
    }

    return (
        <Card title={
            <Flex justifyContent="space-between">
                <Heading>Pick Tickets for Invoicing</Heading>
                <Text>Total: {totalTime} Hours</Text>
            </Flex>}>
            <CardBody>

                <Flex gap={4} flexDir="column">
                    <SearchInput
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e: any) => setSearchTerm(e.target.value)}
                        onReset={() => setSearchTerm('')}
                    />
                    {
                        isLoading || isRefetching
                            ? <Center><Spinner /></Center>
                            : <DataGrid
                                columns={columns}
                                data={tickets}
                                initialState={{ rowSelection: selectedRowIds }}
                                onSelectedRowsChange={(indexes) => handleSelectedRows(indexes)}
                                isSortable
                                isSelectable
                                isHoverable>
                                <DataGridPagination mt={2} pl={0} />
                                <Text fontSize='xs' as='i'>Loaded {pagination.amount} of {pagination.total} results total. Search to narrow results.</Text>
                            </DataGrid>
                    }
                    <Flex justifyContent="space-between">
                        <Button mt={6} colorScheme="primary" onClick={() => setStep((step) => step - 1)}>Previous</Button>
                        <Flex gap={2} flexDirection="column">
                            <Button mt={6} colorScheme="primary" onClick={() => pickTickets()}>Confirm selected</Button>
                            {
                                pickAtLeastOneTicket
                                    ? <Text color="red.400">Pick at least 1 ticket.</Text>
                                    : <></>
                            }
                        </Flex>
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
    )
}

export default Tickets;