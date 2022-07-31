import { Button, Card, useCollapse } from '@saas-ui/react'
import { DataGrid, ColumnDef, DataGridCell, DataGridPagination } from '@saas-ui/pro'
import { Sparklines } from '@saas-ui/charts'
import { Box, Collapse, Flex, Progress, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'

// @todo get this from graphql
interface Data {
    type: string
    key: string
    name: string
}

const total = 43400

const getPercentage = (value: number) => {
    return Math.round((100 / total) * value)
}

const data: Data[] = [
    {
        type: 'Project',
        key: "TEST-1",
        name: "Projectnavn",
    },
    {
        type: 'Project',
        key: "TEST-1",
        name: "Projectnavn",
    },
    {
        type: 'Project',
        key: "TEST-1",
        name: "Projectnavn",
    },
    {
        type: 'Project',
        key: "TEST-1",
        name: "Projectnavn",
    },
]

const columns: ColumnDef<Data>[] = [
    {
        id: 'type',
        header: 'Type',
    },
    {
        id: 'name',
        header: 'Name',
    },
    {
        id: 'key',
        header: 'Key',
    },
]

export const TimeItemsTable = () => {
    const { onToggle, getCollapseProps } = useCollapse()

    return (
        <>
            <Button onClick={() => onToggle()}>Add Jira Items</Button>
            <Collapse {...getCollapseProps()}>

                <DataGrid<Data> columns={columns} data={data} isSortable isSelectable isHoverable>
                    <DataGridPagination />
                </DataGrid>
            </Collapse>
        </>
    )
}
