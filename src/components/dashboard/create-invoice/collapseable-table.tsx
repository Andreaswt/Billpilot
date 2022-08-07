import { Button, Card, CardBody, useCollapse } from '@saas-ui/react'
import { DataGrid, ColumnDef, DataGridPagination } from '@saas-ui/pro'
import { Badge, ButtonGroup, Collapse, Text, Stack, Wrap, Flex, HStack, VStack, StackDivider, Spinner, Center } from '@chakra-ui/react'
import { SearchInput } from '@saas-ui/react'
import React, { useRef } from 'react'
import { CloseIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import RemoveableJiraItem from './removeable-jira-item'
import { trpc } from '../../../utils/trpc'
import { useRowSelect } from 'react-table'
import { useEffect } from 'react'

interface Data {
    type: string
    issueType?: string
    key: string
    name: string
}

let tableData: Data[] = []

const columns: ColumnDef<Data>[] = [
    {
        id: 'type',
        header: 'Type',
    },
    {
        id: 'issueType',
        header: 'Issue Type',
    },
    {
        id: 'name',
        header: 'Name',
    },
    {
        id: 'key',
        header: 'Key',
    },
    {
        id: 'action',
        header: '',
        cell: () => (
            <>
                <Button colorScheme={"purple"} size="sm">Add Item</Button>
            </>
        )
    },
]

interface ICheckedItems {
    project: string[]
    issue: string[]
    employee: string[]
}

function computeItemsForShow(checkedItems: ICheckedItems) {
    const items: { type: string, name: string }[] = []

    // Combine all checked items from the different categories into a single list
    for (const [key, value] of Object.entries(checkedItems)) {
        for (const item of value) {
            items.push({
                type: key,
                name: item
            })
        }
    }

    return items
}

function tableDataWithoutCheckedItems(checkedItemsKey: string[], data: Data[]) {
    return data.filter(item => !checkedItemsKey.includes(item.key))
}

interface IPagination {
    amount: number
    total: number
}

export const TimeItemsTable = () => {
    const { onToggle, isOpen, getCollapseProps } = useCollapse()
    const [searchTerm, setSearchTerm] = React.useState('')
    const [currentType, setCurrentType] = React.useState('Project')
    const [checkedItems, setCheckedItems] = React.useState<ICheckedItems>(
        {
            project: [],
            issue: [],
            employee: [],
        }
    );
    let [pagination, setPagination] = React.useState<IPagination>({ amount: 0, total: 0 })

    const itemsForShow = React.useMemo(() => computeItemsForShow(checkedItems), [checkedItems]);

    const { data: searchProjectsData, isLoading: searchProjectsLoading, isRefetching: searchProjectsRefetching, refetch: searchProjectsRefetch } = trpc.useQuery([
        "jira.searchProjects",
        { searchTerm: searchTerm }],
        {
            enabled: false,
            onSuccess(searchProjectsData) {
                setPagination({ amount: searchProjectsData.amount, total: searchProjectsData.total })
                tableData = tableDataWithoutCheckedItems(checkedItems.project, searchProjectsData.tableFormatProjects);
                setCurrentType('Project');
            }
        });

    const { data: getEmployeesData, isLoading: getEmployeesLoading, isRefetching: getEmployeesRefetching, refetch: getEmployeesRefetch } = trpc.useQuery(
        ["jira.getEmployees",
            { searchTerm: searchTerm }],
        {
            enabled: false,
            onSuccess(getEmployeesData) {
                setPagination({ amount: getEmployeesData.amount, total: getEmployeesData.total })
                tableData = tableDataWithoutCheckedItems(checkedItems.employee, getEmployeesData.tableFormatEmployees);
                setCurrentType('Employee');
            }
        });

    const { data: searchIssuesData, isLoading: searchIssuesLoading, isRefetching: searchIssuesRefetching, refetch: searchIssuesRefetch } = trpc.useQuery([
        "jira.searchIssues",
        { searchTerm: searchTerm }],
        {
            enabled: false,
            onSuccess(searchIssuesData) {
                setPagination({ amount: searchIssuesData.amount, total: searchIssuesData.total })
                tableData = tableDataWithoutCheckedItems(checkedItems.issue, searchIssuesData.tableFormatIssues);
                setCurrentType('Issue');
            }
        });

    const { data: searchEpicsData, isLoading: searchEpicsLoading, isRefetching: searchEpicsRefetching, refetch: searchEpicsRefetch } = trpc.useQuery([
        "jira.searchEpics",
        { searchTerm: searchTerm }],
        {
            enabled: false,
            onSuccess(searchEpicsData) {
                setPagination({ amount: searchEpicsData.amount, total: searchEpicsData.total })
                tableData = tableDataWithoutCheckedItems(checkedItems.issue, searchEpicsData.tableFormatIssues);
                setCurrentType('Epic');
            }
        });

    useEffect(() => {
        switch (currentType) {
            case 'Project':
                searchProjectsRefetch()
                break;
            case 'Issue':
                searchIssuesRefetch()
                break;
            case 'Employee':
                getEmployeesRefetch()
                break;
            case 'Epic':
                searchEpicsRefetch()
                break;
        }
    }, [searchTerm])

    // If any of the queries are loading, show the loading indicator
    const isTableLoading =
        searchProjectsLoading || getEmployeesLoading || searchIssuesLoading || searchEpicsLoading
        || searchProjectsRefetching || getEmployeesRefetching || searchIssuesRefetching || searchEpicsRefetching;

    function checkItem(type: string, id: string) {
        switch (type) {
            case 'Project':
                if (!checkedItems.project.includes(id)) {
                    setCheckedItems({
                        ...checkedItems,
                        project: [...checkedItems.project, id]
                    })
                }
                break;
            case 'Issue':
                if (!checkedItems.issue.includes(id)) {
                    setCheckedItems({
                        ...checkedItems,
                        issue: [...checkedItems.issue, id]
                    })
                }
                break;
            case 'Employee':
                if (!checkedItems.employee.includes(id)) {
                    setCheckedItems({
                        ...checkedItems,
                        employee: [...checkedItems.employee, id]
                    })
                }
                break;

        }
    }

    // e.g. "type: project, id: test-1"
    function removeCheckedItem(type: string, id: string) {
        // TODO: optimize in future
        switch (type) {
            case "project":
                setCheckedItems({
                    ...checkedItems,
                    project: checkedItems.project.filter(item => item !== id)
                })
                break;
            case "issue":
                setCheckedItems({
                    ...checkedItems,
                    issue: checkedItems.issue.filter(item => item !== id)
                })
                break;
            case "employee":
                setCheckedItems({
                    ...checkedItems,
                    employee: checkedItems.employee.filter(item => item !== id)
                })
                break;
            default:
                break;
        }
    }

    function importTimeFromJira() {
        console.log("importing checked items");
    }

    return (
        <>
            <Wrap>
                {itemsForShow.map((item, i) => (
                    <RemoveableJiraItem key={i} handleDelete={() => removeCheckedItem(item.type, item.name)} type={item.type} name={item.name} />
                ))}
            </Wrap>
            <Button my={4} onClick={() => {
                if (!isOpen) {
                    searchProjectsRefetch()
                    onToggle()
                }
                else {
                    importTimeFromJira()
                    onToggle()
                }
            }}>{isOpen ? "Import from Jira" : "Add Jira Items"}</Button>
            <Collapse {...getCollapseProps()}>
                <Stack mb={4}>
                    <HStack my={4} spacing={4}>
                        <Text>Filter by</Text>
                        <ButtonGroup isAttached variant="outline">
                            <Button onClick={() => searchProjectsRefetch()}>Projects</Button>
                            <Button onClick={() => getEmployeesRefetch()}>Employees</Button>
                            <Button onClick={() => searchIssuesRefetch()}>Issues</Button>
                            <Button onClick={() => searchEpicsRefetch()}>Epics</Button>
                        </ButtonGroup>
                    </HStack>
                    <SearchInput
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e: any) => setSearchTerm(e.target.value)}
                        onReset={() => setSearchTerm('')}
                    />
                </Stack>
                {
                    isTableLoading ?
                        <Center><Spinner /></Center> :
                        (tableData.length === 0 ?
                            <Center><Text>No Results</Text></Center> :
                            <DataGrid<Data> onRowClick={row => {
                                checkItem(row.original.type, row.original.key);
                                tableData = tableData.filter(item => item.key !== row.original.key)
                            }} columns={columns} data={tableData} isSortable isHoverable>
                                <DataGridPagination mt={2} pl={0} />
                                <Text fontSize='xs' as='i'>Loaded {pagination.amount} of {pagination.total} results total. Search to narrow results.</Text>
                            </DataGrid>)
                }
            </Collapse>
        </>
    )
}
