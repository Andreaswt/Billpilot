import * as React from 'react'
import * as Yup from 'yup'

import {
    BulkActionsSelections, DataGridCell, MenuProperty, ToggleButton, ToggleButtonGroup, Toolbar,
    ToolbarButton, useColumns
} from '@saas-ui/pro'
import {useDataGridFilter as getDataGridFilter} from '@saas-ui/pro'
import {
    Button, EmptyState, Menu,
    MenuButton,
    MenuItem,
    MenuList,
    OverflowMenu,
    useLocalStorage, useModals
} from '@saas-ui/react'
import { FiSliders, FiUser } from 'react-icons/fi'

import { Box, Portal, Spacer, Tag, useBreakpointValue } from '@chakra-ui/react'
import { format } from 'date-fns'
import { NextPage } from 'next'
import router, { useRouter } from 'next/router'
import { AddFilterButton, filters } from '../../../components/dashboard/clients/client-filters'
import { ClientStatuses } from '../../../components/dashboard/clients/client-statuses'
import { InlineSearch } from '../../../components/dashboard/clients/inline-search'
import { ListPage } from '../../../components/dashboard/clients/list-page'
import { trpc } from '../../../utils/trpc'

interface Client {
    name: string
    invoiced: string
    createdAt: Date
    latestBill: Date
    status: string
}

const billedStatus: Record<string, { label: string; color: string }> = {
    billed: {
        label: 'Billed',
        color: 'green',
    },
    notBilled: {
        label: 'Not billed',
        color: 'orange',
    },
}

const StatusCell: DataGridCell<Client> = (cell) => {
    const status = billedStatus[cell.getValue<string>()] || billedStatus.notBilled
    return (
        <Tag colorScheme={status.color} size="sm">
            {status.label}
        </Tag>
    )
}

const DateCell: DataGridCell<Client> = ({ cell }) => {
    return <>{format(new Date(cell.getValue<string>()), 'PP')}</>
}

const ActionCell: DataGridCell<Client> = () => {
    return (
        <Box onClick={(e) => e.stopPropagation()}>
            <OverflowMenu size="xs">
                <MenuItem>Delete</MenuItem>
            </OverflowMenu>
        </Box>
    )
}

const ClientsListPage: NextPage = () => {
    const modals = useModals()
    const [searchQuery, setSearchQuery] = React.useState('')
    const isMobile = useBreakpointValue({ base: true, lg: false })
    const params = useRouter()
    const { data, isLoading } = trpc.useQuery(["clients.getClient", { status: params?.query?.type as string ?? "" }]);

    const columns = useColumns<Client>(
        () => [
            {
                id: 'name',
                accessorKey: 'name',
                header: 'Name',
                size: 300,
                meta: {
                    href: ({ id }) => `/dashboard/clients/${id}`,
                },
            },
            {
                id: 'invoiced',
                header: 'Invoiced',
                filterFn: getDataGridFilter('number'),
                size: 300
            },
            {
                id: 'createdAt',
                header: 'Created at',
                cell: DateCell,
                filterFn: getDataGridFilter('date'),
                enableGlobalFilter: false,
            },
            {
                id: 'latestBill',
                header: 'Latest bill',
                cell: DateCell,
                filterFn: getDataGridFilter('date'),
                enableGlobalFilter: false,
            },
            {
                id: 'status',
                header: 'Status',
                cell: StatusCell,
                filterFn: getDataGridFilter('string'),
                enableGlobalFilter: false,
                meta: {
                    isNumeric: true,
                },
            },
            {
                id: 'action',
                header: '',
                cell: ActionCell,
                size: 100,
                enableGlobalFilter: false,
                enableHiding: false,
            },
        ],
        [],
    )

    const [visibleColumns, setVisibleColumns] = useLocalStorage(
        'clients.columns',
        ['name', 'invoiced', 'createdAt', 'latestBill', 'status'],
    )

    const displayProperties = (
        <ToggleButtonGroup
            type="checkbox"
            isAttached={false}
            size="xs"
            spacing="0"
            flexWrap="wrap"
            value={visibleColumns}
            onChange={setVisibleColumns}
        >
            {columns.map(({ id, enableHiding }) =>
                id && enableHiding !== false ? (
                    <ToggleButton
                        key={id}
                        value={id}
                        mb="1"
                        me="1"
                        color="muted"
                        _checked={{ color: 'app-text', bg: 'whiteAlpha.200' }}
                    >
                        {id.charAt(0).toUpperCase() + id.slice(1)}
                    </ToggleButton>
                ) : null,
            )}
        </ToggleButtonGroup>
    )

    const primaryAction = (
        <ToolbarButton
            label="Add client"
            variant="solid"
            colorScheme="primary"
            onClick={() => router.push("/dashboard/clients/create")}
        />
    )

    const toolbarItems = (
        <>
            <ClientStatuses />
            <AddFilterButton />
            <Spacer />
            <InlineSearch
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onReset={() => setSearchQuery('')}
            />
            <Menu>
                <MenuButton
                    as={ToolbarButton}
                    variant="outline"
                    leftIcon={<FiSliders />}
                    label="View"
                />
                <Portal>
                    <MenuList maxW="260px">
                        <MenuProperty
                            label="Display properties"
                            value={displayProperties}
                            orientation="vertical"
                        />
                    </MenuList>
                </Portal>
            </Menu>
        </>
    )

    const toolbar = (
        <Toolbar>
            {!isMobile && toolbarItems} {primaryAction}
        </Toolbar>
    )

    const tabbar = isMobile && <Toolbar>{toolbarItems}</Toolbar>

    const bulkActions = ({
        selections,
    }: {
        selections: BulkActionsSelections
    }) => (
        <>
            <Button>Add to segment</Button>
            <Button>Add tags</Button>
        </>
    )

    const emptyState = (
        <EmptyState
            title="No clients added yet"
            description="Add a client to get started."
            colorScheme="primary"
            icon={FiUser}
            actions={
                <>
                    <Button colorScheme="primary" variant="solid" onClick={() => router.push("/dashboard/clients/create")}>
                        Add a client
                    </Button>
                </>
            }
        />
    )

    return (
        <>
            <ListPage<Client>
                title="Clients"
                toolbar={toolbar}
                tabbar={tabbar}
                bulkActions={bulkActions}
                filters={filters}
                searchQuery={searchQuery}
                emptyState={emptyState}
                columns={columns}
                visibleColumns={visibleColumns}
                data={data as Client[]}
                isLoading={isLoading}
            />
        </>

    )
}

export default ClientsListPage;