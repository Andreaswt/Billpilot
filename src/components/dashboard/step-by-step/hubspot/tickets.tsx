import { Button, Center, Flex, Heading, Input, InputGroup, InputRightElement, Spinner, Stack, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { ColumnDef, DataGrid, DataGridPagination } from '@saas-ui/pro';
import { Card, CardBody, SearchInput } from "@saas-ui/react";
import { TbPercentage } from "react-icons/tb";
import useInvoiceStore, { PickedHubspotTicket } from '../../../../../store/invoiceStore';
import { trpc } from '../../../../utils/trpc';
import { TableTooltip } from '../shared/table-tooltip';


interface IProps {
    setStep: Dispatch<SetStateAction<number>>
}

interface TableRow {
    id: string
    subject: string
    hoursSpent: number | null
    lastModified: string
}

interface IPagination {
    amount: number
    total: number
}

const Tickets = (props: IProps) => {
    const { setStep } = props
    const store = useInvoiceStore();
    const [selected, setSelected] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [pagination, setPagination] = useState<IPagination>({ amount: 0, total: 0 })
    const [tickets, setTickets] = useState<TableRow[]>([])
    const [pickAtLeastOneTicket, setPickAtLeastOneTicket] = useState(false)
    const [hoursNotDefined, setHoursNotDefined] = useState(false)

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
        let selectedData: PickedHubspotTicket[] = []

        if (selected.length === 0) {
            setPickAtLeastOneTicket(true)
            return
        }

        let hasHoursNotDefined = false
        selected.forEach(index => {
            const ticket = tickets[parseInt(index)]
            if (!ticket.hoursSpent && (!updatedHoursSpent[ticket.id]?.updatedTimeSpent || updatedHoursSpent[ticket.id].updatedTimeSpent === 0)) {
                hasHoursNotDefined = true
            }
        })

        if (hasHoursNotDefined) {
            setHoursNotDefined(true)
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
            id: 'hoursSpent',
            header: 'Hours Spent',
            cell: (data) => (<TableTooltip text={data.row.original.hoursSpent ? data.row.original.hoursSpent.toString() + " hours" : " Not set in hubspot"} />)
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
                                const updatedTimeSpent = parseInt(e.target.value)
                                newState[data.row.original.id.toString()] = { updatedTimeSpent: isNaN(updatedTimeSpent) ? 0 : updatedTimeSpent }
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
                                const discountPercentage = parseInt(e.target.value)
                                newState[data.row.original.id.toString()] = { discountPercentage: isNaN(discountPercentage) ? 0 : discountPercentage }
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

            let rowTotal = 0
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
                    <Stack gap={2} alignItems="end">
                        {
                            hoursNotDefined
                                ? <Text color="red.400">Selected tickets must have hours defined in hubspot, or updated hours spent defined instead.</Text>
                                : <></>
                        }
                        {
                            pickAtLeastOneTicket
                                ? <Text color="red.400">Pick at least 1 ticket.</Text>
                                : <></>
                        }
                    </Stack>
                    <Flex justifyContent="space-between">
                        <Button mt={6} colorScheme="primary" onClick={() => setStep((step) => step - 1)}>Previous</Button>
                        <Button mt={6} colorScheme="primary" onClick={() => pickTickets()}>Confirm selected</Button>
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
    )
}

export default Tickets;