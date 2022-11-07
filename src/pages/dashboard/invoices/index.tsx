import * as React from 'react'

import {
    BulkActionsSelections, DataGridCell, MenuProperty, ToggleButton, ToggleButtonGroup, Toolbar,
    ToolbarButton, useColumns
} from '@saas-ui/pro'
import { useDataGridFilter as getDataGridFilter } from '@saas-ui/pro'
import {
    Button, EmptyState, Menu,
    MenuButton,
    MenuItem,
    MenuList,
    OverflowMenu,
    useLocalStorage
} from '@saas-ui/react'
import { FiSliders, FiUser } from 'react-icons/fi'

import { Box, Portal, Spacer, Tag, useBreakpointValue } from '@chakra-ui/react'
import { format } from 'date-fns'
import { NextPage } from 'next'
import router, { useRouter } from 'next/router'
import { InlineSearch } from '../../../components/dashboard/list-page/inline-search'
import { ListPage } from '../../../components/dashboard/list-page/list-page'
import { trpc } from '../../../utils/trpc'
import { AddFilterButton, filters } from '../../../components/dashboard/invoices/invoice-filters'

interface Invoice {
    id: string
    title: string
    pricePerHour: number
    clientName: string
    currency: string
    invoicedFrom: Date
    invoicedTo: Date
    issueDate: Date
}

const DateCell: DataGridCell<Invoice> = ({ cell }) => {
    return <>{format(new Date(cell.getValue<string>()), 'PP')}</>
}

const ActionCell: DataGridCell<Invoice> = (invoice) => {
    const utils = trpc.useContext()

    const mutation = trpc.useMutation(["invoices.deleteInvoice"], {
        onSuccess() {
            utils.invalidateQueries(['invoices.getInvoices'])
        }
    });

    return (
        <Box onClick={(e) => e.stopPropagation()}>
            <OverflowMenu size="xs">
                <MenuItem onClick={async () => await mutation.mutateAsync({ invoiceId: invoice.row.original.id })}>Delete</MenuItem>
                <MenuItem onClick={() => router.push(`/dashboard/invoices/update/${invoice.row.original.id}`)}>Edit</MenuItem>
            </OverflowMenu>
        </Box>
    )
}

const InvoicesListPage: NextPage = () => {
    const [searchQuery, setSearchQuery] = React.useState('')
    const isMobile = useBreakpointValue({ base: true, lg: false })
    const params = useRouter()
    const { data, isLoading } = trpc.useQuery(["invoices.getInvoices"]);

    const columns = useColumns<Invoice>(
        () => [
            {
                id: 'title',
                accessorKey: 'title',
                header: 'Title',
                size: 300,
                meta: {
                    href: ({ id }) => `/dashboard/invoices/view/${id}`,
                },
            },
            {
                id: 'pricePerHour',
                accessorKey: 'pricePerHour',
                header: 'Price per hour',
                meta: {
                    isNumeric: true,
                },
            },
            {
                id: 'clientName',
                accessorKey: 'clientName',
                header: 'Client name',
                size: 300,
            },
            {
                id: 'currency',
                accessorKey: 'currency',
                header: 'Currency',
            },
            {
                id: 'invoicedFrom',
                header: 'Invoiced from',
                cell: DateCell,
                filterFn: getDataGridFilter('date'),
                enableGlobalFilter: false,
            },
            {
                id: 'invoicedTo',
                header: 'Invoiced to',
                cell: DateCell,
                filterFn: getDataGridFilter('date'),
                enableGlobalFilter: false,
            },
            {
                id: 'issueDate',
                header: 'Issue date',
                cell: DateCell,
                filterFn: getDataGridFilter('date'),
                enableGlobalFilter: false,
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
        'invoices.columns',
        ['title', 'pricePerHour', 'clientName', 'currency', 'invoicedFrom', 'invoicedTo', 'issueDate'],
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
            label="Add invoice"
            variant="solid"
            colorScheme="primary"
            onClick={() => router.push("/dashboard/generator")}
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
            title="No invoices added yet"
            description="Add an invoice to get started."
            colorScheme="primary"
            icon={FiUser}
            actions={
                <>
                    <Button colorScheme="primary" variant="solid" onClick={() => router.push("/dashboard/generator")}>
                        Create invoice
                    </Button>
                </>
            }
        />
    )

    return (
        <>
            <ListPage<Invoice>
                title="Invoices"
                toolbar={toolbar}
                tabbar={tabbar}
                bulkActions={bulkActions}
                filters={filters}
                searchQuery={searchQuery}
                emptyState={emptyState}
                columns={columns}
                visibleColumns={visibleColumns}
                viewLink="/dashboard/invoices/view"
                data={data as Invoice[]}
                isLoading={isLoading}
            />
        </>

    )
}

export default InvoicesListPage;