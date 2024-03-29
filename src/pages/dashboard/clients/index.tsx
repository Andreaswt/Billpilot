import * as React from 'react'

import {
    BulkActionsSelections, DataGridCell, MenuProperty, ToggleButton, ToggleButtonGroup, Toolbar,
    ToolbarButton, useColumns, useDataGridFilter as getDataGridFilter
} from '@saas-ui/pro'
import {
    Button, EmptyState, Menu,
    MenuButton,
    MenuItem,
    MenuList,
    OverflowMenu,
    useLocalStorage
} from '@saas-ui/react'
import { FiSliders, FiUser } from 'react-icons/fi'

import { Box, Portal, Spacer, useBreakpointValue } from '@chakra-ui/react'
import { format } from 'date-fns'
import { NextPage } from 'next'
import router from 'next/router'
import { AddFilterButton, filters } from '../../../components/dashboard/clients/client-filters'
import { InlineSearch } from '../../../components/dashboard/list-page/inline-search'
import { ListPage } from '../../../components/dashboard/list-page/list-page'
import { trpc } from '../../../utils/trpc'

interface Client {
    id: string
    name: string
    pricePerHour: number
    currency: string
    createdAt: Date
}

const DateCell: DataGridCell<Client> = ({ cell }) => {
    return <>{format(new Date(cell.getValue<string>()), 'PP')}</>
}

const ActionCell: DataGridCell<Client> = (client) => {
    const utils = trpc.useContext()
    
    const mutation = trpc.useMutation(["clients.deleteClient"], {
        onSuccess() {
            utils.invalidateQueries(['clients.getClients'])
        }
    });

    return (
        <Box onClick={(e) => e.stopPropagation()}>
            <OverflowMenu size="xs">
                <MenuItem onClick={async () => await mutation.mutateAsync({id: client.row.original.id})}>Delete</MenuItem>
                <MenuItem onClick={() => router.push(`/dashboard/clients/update/${client.row.original.id}`)}>Edit</MenuItem>
            </OverflowMenu>
        </Box>
    )
}

const ClientsListPage: NextPage = () => {
    const [searchQuery, setSearchQuery] = React.useState('')
    const isMobile = useBreakpointValue({ base: true, lg: false })
    const { data, isLoading } = trpc.useQuery(["clients.getClients"]);

    const columns = useColumns<Client>(
        () => [
            {
                id: 'name',
                accessorKey: 'name',
                header: 'Name',
                size: 300,
                meta: {
                    href: ({ id }) => `/dashboard/clients/view/${id}`,
                },
            },
            {
                id: 'createdAt',
                header: 'Created at',
                cell: DateCell,
                filterFn: getDataGridFilter('date'),
            },
            {
                id: 'pricePerHour',
                header: 'Price Per Hour',
                // filterFn: getDataGridFilter('number'),
                // meta: {
                //     isNumeric: true,
                // },
            },
            {
                id: 'currency',
                header: 'Currency',
                filterFn: getDataGridFilter('number'),
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
        ['name', 'createdAt', 'pricePerHour', 'currency'],
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
            {/* <Button>Add to segment</Button>
            <Button>Add tags</Button> */}
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
                viewLink="/dashboard/clients/view"
                data={data as Client[]}
                isLoading={isLoading}
            />
        </>

    )
}

export default ClientsListPage;