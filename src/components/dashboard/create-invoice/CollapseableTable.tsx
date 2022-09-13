import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import { ButtonGroup, Center, Collapse, Flex, HStack, Spinner, Stack, Text, Wrap } from '@chakra-ui/react'
import { ColumnDef, DataGrid, DataGridPagination } from '@saas-ui/pro'
import { Button, SearchInput, useCollapse } from '@saas-ui/react'
import React, { useCallback, useEffect } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import useJiraTableStore from '../../../../store/jiraTable'
import { trpc } from '../../../utils/trpc'
import RemoveableJiraItem from './removeable-jira-item'

interface Data {
    type: string
    issueType?: string
    importTimeId: string
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
    project: { key: string, displayName: string }[]
    issue: { key: string, displayName: string }[]
    employee: { key: string, displayName: string }[]
}

function computeItemsForShow(checkedItems: ICheckedItems) {
    const items: { type: string, name: string, displayName: string }[] = []

    // Combine all checked items from the different categories into a single list
    for (let i = 0; i < checkedItems.project.length; i++) {
        items.push({
            type: 'project',
            name: checkedItems.project[i].key,
            displayName: checkedItems.project[i].displayName,
        })
    }

    for (let i = 0; i < checkedItems.issue.length; i++) {
        items.push({
            type: 'issue',
            name: checkedItems.issue[i].key,
            displayName: checkedItems.issue[i].displayName,
        })
    }

    for (let i = 0; i < checkedItems.employee.length; i++) {
        items.push({
            type: 'employee',
            name: checkedItems.employee[i].key,
            displayName: checkedItems.employee[i].displayName,
        })
    }

    return items
}

function tableDataWithoutCheckedItems(checkedItemsKey: string[], data: Data[]) {
    return data.filter(item => !checkedItemsKey.includes(item.key) )
}

interface IPagination {
    amount: number
    total: number
}

interface ITimeItemsTableProps {
    timeItemIndex: number
    updateTime: UseFormSetValue<{
        timeItems: {
            name: string;
            time: number;
            rate: number;
            tax: number;
            discount: number;
        }[]
    }>
    rowId: string
}

export const TimeItemsTable = (props: ITimeItemsTableProps) => {
    const { timeItemIndex, updateTime, rowId } = props
    const store = useJiraTableStore()

    const { onToggle, isOpen, getCollapseProps } = useCollapse()
    const [searchTerm, setSearchTerm] = React.useState('')
    const [currentType, setCurrentType] = React.useState('Project')

    function getCheckedProjects() {
        return store.project.filter(x => x.id === rowId).map(item => item.key)
    }

    function getCheckedIssues() {
        return store.issue.filter(x => x.id === rowId).map(item => item.key)
    }

    function getCheckedEmployees() {
        return store.employee.filter(x => x.id === rowId).map(item => item.key)
    }

    let [pagination, setPagination] = React.useState<IPagination>({ amount: 0, total: 0 })

    const itemsForShow = React.useMemo(() => computeItemsForShow(
        { 
            project: store.project.filter(x => x.id === rowId), 
            issue: store.issue.filter(x => x.id === rowId), 
            employee: store.employee.filter(x => x.id === rowId)
        }
        ), [store.project, store.issue, store.employee, rowId]);

    const { data: searchProjectsData, isLoading: searchProjectsLoading, isRefetching: searchProjectsRefetching, refetch: searchProjectsRefetch } = trpc.useQuery([
        "jira.searchProjects",
        { searchTerm: searchTerm }],
        {
            enabled: false,
            onSuccess(searchProjectsData) {
                setPagination({ amount: searchProjectsData.amount, total: searchProjectsData.total })
                tableData = tableDataWithoutCheckedItems(getCheckedProjects(), searchProjectsData.tableFormatProjects);
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
                tableData = tableDataWithoutCheckedItems(getCheckedEmployees(), getEmployeesData.tableFormatEmployees);
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
                tableData = tableDataWithoutCheckedItems(getCheckedIssues(), searchIssuesData.tableFormatIssues);
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
                tableData = tableDataWithoutCheckedItems(getCheckedIssues(), searchEpicsData.tableFormatIssues);
                setCurrentType('Epic');
            }
        });

    const { data: importJiraTimeData, isLoading: importJiraTimeLoading, isRefetching: importJiraTimeRefetching, refetch: importJiraTimeRefetch } = trpc.useQuery([
        "jira.importJiraTime",
        {
            accountIds: getCheckedEmployees(),
            issueIds: getCheckedIssues(),
            projectKeys: getCheckedProjects(),
        }],
        {
            enabled: false,
            onSuccess(importJiraTimeData) {
                updateTime(`timeItems.${timeItemIndex}`, { name: "Imported Jira Time", time: importJiraTimeData, rate: 100, tax: 0, discount: 0 })
            }
        });

    const refetchSelected = useCallback(() => {
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
    }, [currentType, searchProjectsRefetch, searchIssuesRefetch, getEmployeesRefetch, searchEpicsRefetch])

    useEffect(() => {
        refetchSelected()
    }, [searchTerm, refetchSelected])

    // If any of the queries are loading, show the loading indicator
    const isTableLoading =
        searchProjectsLoading || getEmployeesLoading || searchIssuesLoading || searchEpicsLoading
        || searchProjectsRefetching || getEmployeesRefetching || searchIssuesRefetching || searchEpicsRefetching;

    function checkItem(type: string, key: string, displayName: string) {
        switch (type) {
            case 'Project':
                if (!store.project.filter(x => x.id === rowId).find(x => x.key === key)) {
                    store.checkProject({ id: rowId, key: key, displayName: displayName })
                }
                break;
            case 'Issue':
                if (!store.issue.filter(x => x.id === rowId).find(x => x.key === key)) {
                    store.checkIssue({ id: rowId, key: key, displayName: displayName })
                }
                break;
            case 'Employee':
                if (!store.employee.filter(x => x.id === rowId).find(x => x.key === key)) {
                    store.checkEmployee({ id: rowId, key: key, displayName: displayName })
                }
                break;
        }
    }

    // e.g. "type: project, id: test-1"
    function removeCheckedItem(type: string, key: string) {
        switch (type) {
            case "project":
                if (store.project.filter(x => x.id === rowId).find(x => x.key === key)) {
                    store.uncheckProject({ id: rowId, key: key })
                }
                searchProjectsRefetch()
                break;
            case "issue":
                if (store.issue.filter(x => x.id === rowId).find(x => x.key === key)) {
                    store.uncheckIssue({ id: rowId, key: key })
                }
                searchIssuesRefetch()
                break;
            case "employee":
                if (store.employee.filter(x => x.id === rowId).find(x => x.key === key)) {
                    store.uncheckEmployee({ id: rowId, key: key })
                }
                getEmployeesRefetch()
                break;
            default:
                break;
        }
    }

    return (
        <Flex flexDirection="column">
            <Wrap mb={itemsForShow.length > 0 ? 4 : 0}>
                {itemsForShow.map((item, i) => (
                    <RemoveableJiraItem key={i} handleDelete={() => { removeCheckedItem(item.type, item.name) }} type={item.type} name={item.name} displayName={item.displayName} />
                ))}
            </Wrap>
            <Flex gap={4}>
                <Button isLoading={importJiraTimeRefetching || importJiraTimeLoading} colorScheme={isOpen ? "purple" : "gray"} size="xs" rightIcon={<AddIcon />} variant='outline' onClick={() => {
                    if (!isOpen) {
                        searchProjectsRefetch()
                        onToggle()
                    }
                    else {
                        importJiraTimeRefetch()
                        onToggle()
                    }
                }}>{isOpen ? "Import Selected" : "Import from Jira"}</Button>
                {isOpen ? <Button size="xs" rightIcon={<CloseIcon />} variant='outline' onClick={() => onToggle()}>Cancel</Button> : <></>}
            </Flex>
            <Collapse {...getCollapseProps()}>
                <Stack mb={4}>
                    <HStack my={4} spacing={4}>
                        <Text>Filter by</Text>
                        <ButtonGroup isAttached variant="outline">
                            <Button onClick={() => setCurrentType('Project')}>Projects</Button>
                            <Button onClick={() => setCurrentType('Employee')}>Employees</Button>
                            <Button onClick={() => setCurrentType('Issue')}>Issues</Button>
                            <Button onClick={() => setCurrentType('Epic')}>Epics</Button>
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
                                checkItem(row.original.type, row.original.importTimeId, row.original.name);
                                tableData = tableData.filter(item => item.key !== row.original.key)
                            }} columns={columns} data={tableData} isSortable isHoverable>
                                <DataGridPagination mt={2} pl={0} />
                                <Text fontSize='xs' as='i'>Loaded {pagination.amount} of {pagination.total} results total. Search to narrow results.</Text>
                            </DataGrid>)
                }
            </Collapse>
        </Flex>
    )
}
