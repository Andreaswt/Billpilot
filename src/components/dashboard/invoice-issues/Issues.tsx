import { Button, Center, Flex, Heading, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightAddon, InputRightElement, Spinner, Text, Tooltip, Wrap } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, useMemo, useRef, useState } from 'react';

import { ColumnDef, DataGrid, DataGridPagination } from '@saas-ui/pro';
import { Card, CardBody, SearchInput } from "@saas-ui/react";
import useCreateInvoiceStore, { PickedIssue } from '../../../../store/invoice';
import { trpc } from '../../../utils/trpc';
import { TbAd2, TbPercentage, TbReceipt } from "react-icons/tb";
import { ImSortNumbericDesc } from "react-icons/im";


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
    const [updatedHoursSpent, setUpdatedHoursSpent] = useState<{ [issueKey: string]: { updatedTimeSpent: number } }>({})
    const [discountPercentage, setDiscountPercentage] = useState<{ [issueKey: string]: { discountPercentage: number } }>({})
    let isInitialized = false;

    console.log("hehessas")

    const { data, isLoading, isRefetching } = trpc.useQuery(["jira.searchIssuesForIssueInvoicing", { searchTerm: searchTerm, projectKey: store.pickedProject }], {
        onSuccess(data) {
            setPagination({ amount: data.amount, total: data.total })
            setIssues(data.issues)
        }
    });

    function pickIssues() {
        let selectedData: PickedIssue[] = []

        selected.forEach((item) => {
            const rowIssue = issues[parseInt(item)]
            const updatedHoursSpentForIssue = updatedHoursSpent[rowIssue.key]?.updatedTimeSpent
            const discountPercentageForIssue = discountPercentage[rowIssue.key]?.discountPercentage

            const issueWithEdits = {...rowIssue, updatedHoursSpent: updatedHoursSpentForIssue ?? null, discountPercentage: discountPercentageForIssue ?? null }
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
                            // Update state by creating a copy and assigning it again
                            let copy = updatedHoursSpent
                            copy[data.row.original.key.toString()] = { updatedTimeSpent: parseInt(e.target.value) }
                            setUpdatedHoursSpent(copy)
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
                            let copy = discountPercentage
                            copy[data.row.original.key.toString()] = { discountPercentage: parseInt(e.target.value) }
                            setDiscountPercentage(copy)
                        }} min={0} max={100} type="number"></Input>
                        <InputRightElement pointerEvents='none'>
                            <TbPercentage color='gray.300' />
                        </InputRightElement>
                    </InputGroup>
                </>
            )
        },
    ]

    const totalTime: number = useMemo(() => {
        let total = 0

        console.log(selected)
        selected.forEach(item => {
            const issue = issues.find(x => x.key === item)
            if (!issue) return
            total += issue.hoursSpent
        })

        return total
    }, [selected, issues])

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
                <Text>Total: {totalTime}</Text>
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
                        <Button mt={6} colorScheme="purple" onClick={() => setStep((step) => step - 1)}>Previous</Button>
                        <Button mt={6} colorScheme="purple" onClick={() => pickIssues()}>Confirm selected</Button>
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
    )
}

export default Issues;