import { Button, Card, CardBody, useCollapse } from '@saas-ui/react'
import { DataGrid, ColumnDef, DataGridPagination } from '@saas-ui/pro'
import { Badge, ButtonGroup, Collapse, Text, Stack, Wrap, Flex, HStack, VStack, StackDivider, Spinner, Center } from '@chakra-ui/react'
import { SearchInput } from '@saas-ui/react'
import React, { useCallback, useRef } from 'react'
import { CloseIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import RemoveableJiraItem from './removeable-jira-item'
import { trpc } from '../../../utils/trpc'
import { useRowSelect } from 'react-table'
import { useEffect } from 'react'
import { Project } from 'jira.js/out/agile'
import { CheckedTimeItems } from '../../../../store/jiraItems'
import { useFormikContext } from 'formik';

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
    return data.filter(item => !checkedItemsKey.includes(item.key))
}

interface IPagination {
    amount: number
    total: number
}

interface ITimeItemsTableProps {
    timeItemIndex: number
    updateTime: (index: number, value: any) => void
}

export const TimeItemsTable = (props: ITimeItemsTableProps) => {
    const { timeItemIndex, updateTime } = props

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

    function getCheckedProjects() {
        return checkedItems.project.map(item => item.key)
    }

    function getCheckedIssues() {
        return checkedItems.issue.map(item => item.key)
    }

    function getCheckedEmployees() {
        return checkedItems.employee.map(item => item.key)
    }

    let [pagination, setPagination] = React.useState<IPagination>({ amount: 0, total: 0 })

    const itemsForShow = React.useMemo(() => computeItemsForShow(checkedItems), [checkedItems]);

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
                updateTime(timeItemIndex, { name: "Imported Jira Time", time: importJiraTimeData, rate: 100 })
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

    function checkItem(type: string, id: string, displayName: string) {
        switch (type) {
            case 'Project':
                if (!getCheckedProjects().includes(id)) {
                    setCheckedItems({
                        ...checkedItems,
                        project: [...checkedItems.project, { key: id, displayName: displayName }]
                    })
                }
                break;
            case 'Issue':
                if (!getCheckedIssues().includes(id)) {
                    setCheckedItems({
                        ...checkedItems,
                        issue: [...checkedItems.issue, { key: id, displayName: displayName }]
                    })
                }
                break;
            case 'Employee':
                if (!getCheckedEmployees().includes(id)) {
                    setCheckedItems({
                        ...checkedItems,
                        employee: [...checkedItems.employee, { key: id, displayName: displayName }]
                    })
                }
                break;
        }
    }

    // e.g. "type: project, id: test-1"
    function removeCheckedItem(type: string, id: string) {
        switch (type) {
            case "project":
                setCheckedItems({
                    ...checkedItems,
                    project: checkedItems.project.filter(item => item.key !== id)
                })
                searchProjectsRefetch()
                break;
            case "issue":
                setCheckedItems({
                    ...checkedItems,
                    issue: checkedItems.issue.filter(item => item.key !== id)
                })
                searchIssuesRefetch()
                break;
            case "employee":
                setCheckedItems({
                    ...checkedItems,
                    employee: checkedItems.employee.filter(item => item.key !== id)
                })
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
                <Button isLoading={importJiraTimeRefetching || importJiraTimeLoading} colorScheme="purple" onClick={() => {
                    if (!isOpen) {
                        searchProjectsRefetch()
                        onToggle()
                    }
                    else {
                        importJiraTimeRefetch()
                        onToggle()
                    }
                }}>{isOpen ? "Import from Jira" : "Add Jira Items"}</Button>
                {isOpen ? <Button onClick={() => onToggle()}>Cancel</Button> : <></>}
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
