import { Button, Center, cookieStorageManager, Flex, Heading, Input, InputGroup, InputRightElement, Spinner, Text, Tooltip } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import { ColumnDef, DataGrid, DataGridPagination } from '@saas-ui/pro';
import { Card, CardBody, SearchInput } from "@saas-ui/react";
import { TbPercentage } from "react-icons/tb";
import useCreateInvoiceStore, { PickedIssue } from '../../../../store/invoice';
import { trpc } from '../../../utils/trpc';


interface IProps {
    setStep: Dispatch<SetStateAction<number>>
}

interface TableIssue {
    key: string
    id: string
    name: string
    hoursSpent: number
}

interface IPagination {
    amount: number
    total: number
}

const Issues = (props: IProps) => {
    const { setStep } = props
    const store = useCreateInvoiceStore();
    const [selected, setSelected] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [pagination, setPagination] = useState<IPagination>({ amount: 0, total: 0 })
    const [issues, setIssues] = useState<TableIssue[]>([])

    const [updatedHoursSpent, setUpdatedHoursSpent] = useState<{ [issueKey: string]: { updatedTimeSpent: number } }>(() => {
        let updatedHoursSpent: { [issueKey: string]: { updatedTimeSpent: number } } = {}

        store.pickedIssues.forEach(issue => {
            if (!issue.key || !issue.updatedHoursSpent) return
            updatedHoursSpent[issue.key] = { updatedTimeSpent: issue.updatedHoursSpent }
        })

        return updatedHoursSpent
    })

    const [discountPercentage, setDiscountPercentage] = useState<{ [issueKey: string]: { discountPercentage: number } }>(() => {
        let discountPercentage: { [issueKey: string]: { discountPercentage: number } } = {}

        store.pickedIssues.forEach(issue => {
            if (!issue.key || !issue.discountPercentage) return
            discountPercentage[issue.key] = { discountPercentage: issue.discountPercentage }
        })

        return discountPercentage
    })
    let isInitialized = false;

    const { data, isLoading, isRefetching } = trpc.useQuery(["jira.searchIssuesForIssueInvoicing", { searchTerm: searchTerm, projectKey: store.pickedProject }], {
        onSuccess(data) {
            setPagination({ amount: data.amount, total: data.total })
            setIssues(data.issues)

            // Selected issues from zustand are used to restore state in selected
            let storeSelected: string[] = []
            store.pickedIssues.forEach(item => {
                const issueIndex = data.issues.findIndex(x => x.key === item.key && x.id === item.id)
                if (!issueIndex && issueIndex != 0) return

                storeSelected.push(issueIndex.toString())
            })
            
            setSelected(storeSelected)
        },
        refetchOnWindowFocus: false
    });

    function pickIssues() {
        let selectedData: PickedIssue[] = []

        selected.forEach((item) => {
            const rowIssue = issues[parseInt(item)]
            const updatedHoursSpentForIssue = updatedHoursSpent[rowIssue.key]?.updatedTimeSpent
            const discountPercentageForIssue = discountPercentage[rowIssue.key]?.discountPercentage

            const issueWithEdits = { ...rowIssue, updatedHoursSpent: updatedHoursSpentForIssue ?? null, discountPercentage: discountPercentageForIssue ?? null }
            selectedData.push(issueWithEdits)
        })

        store.pickIssues(selectedData)

        setStep((state) => state + 1)
    }

    const selectedRowIds: Record<string, boolean> = useMemo(() => {
        const selected: Record<string, boolean> = {}

        store.pickedIssues.forEach((item) => {
            // Get index of checked item in list of items
            if (!data) return

            const index = data.issues.findIndex(x => x.key == item.key && x.id == item.id)

            // Add the index to the record such that it is checked
            if (index != -1) {
                selected[index.toString()] = true
            }
        })

        return selected
    }, [data])

    const columns: ColumnDef<TableIssue>[] = [
        {
            id: 'key',
            header: 'Key',
        },
        {
            id: 'id',
            header: 'Id',
        },
        {
            id: 'name',
            header: 'Name',
            cell: (data) => (
                <Flex>
                    <Tooltip label={data.row.original.name}>
                        <Text>{data.row.original.name}</Text>
                    </Tooltip>
                </Flex>
            )
        },
        {
            id: 'hoursSpent',
            header: 'Hours Spent',
        },
        {
            id: 'updatedHoursSpent',
            header: 'Updated hours spent',
            cell: (data) => (
                <>
                    <InputGroup size='sm'>
                        <Input defaultValue={store.pickedIssues.find(x => x.key === data.row.original.key)?.updatedHoursSpent ?? 0} onChange={(e: any) => {
                            setUpdatedHoursSpent(prevState => {
                                const newState = prevState;
                                newState[data.row.original.key.toString()] = { updatedTimeSpent: parseInt(e.target.value) }
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
                        <Input defaultValue={store.pickedIssues.find(x => x.key === data.row.original.key)?.discountPercentage ?? 0} onChange={(e: any) => {
                            setDiscountPercentage(prevState => {
                                const newState = prevState;
                                newState[data.row.original.key.toString()] = { discountPercentage: parseInt(e.target.value) }
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
            const rowIssue = issues[parseInt(item)]
            const updatedHoursSpentForIssue = updatedHoursSpent[rowIssue.key]?.updatedTimeSpent

            let rowTotal = rowIssue.hoursSpent
            if (updatedHoursSpentForIssue && updatedHoursSpentForIssue > 0) {
                rowTotal = updatedHoursSpentForIssue
            }

            total += rowTotal
        })

        return total
    }, [selected, issues, updatedHoursSpent, discountPercentage])

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
                <Heading>Pick Issues for Invoicing</Heading>
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
                                data={issues}
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
                        <Button mt={6} colorScheme="primary" onClick={() => pickIssues()}>Confirm selected</Button>
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
    )
}

export default Issues;