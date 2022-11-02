import { Flex, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef, DataGrid, DataGridPagination, Section } from '@saas-ui/pro';
import { Card, CardBody, PropertyList, Property } from '@saas-ui/react';
import useInvoiceStore from '../../../../../store/invoiceStore';
import { TableTooltip } from '../shared/table-tooltip';

interface TableRow {
    id: string
    subject: string
    content: string
    lastModified: string
    updatedHoursSpent: number | null
    discountPercentage: number | null
}

const columns: ColumnDef<TableRow>[] = [
    {
        id: 'subject',
        header: 'Subject',
        cell: (data) => (<TableTooltip text={data.row.original.subject} />)
    },
    {
        id: 'content',
        header: 'Content',
        cell: (data) => (<TableTooltip text={data.row.original.content} />)
    },
    {
        id: 'lastModified',
        header: 'Last Modified',
        cell: (data) => (<TableTooltip text={data.row.original.lastModified} />)
    },
    {
        id: 'updatedHoursSpent',
        header: 'Updated Hours Spent',
        cell: (data) => (<p>{data.row.original.updatedHoursSpent ?? "-"}</p>)
    },
    {
        id: 'discountPercentage',
        header: 'Percentage Discount',
        cell: (data) => (<p>{data.row.original.discountPercentage ?? "-"}</p>)
    },
    {
        id: 'id',
        header: 'Id',
    },
]

export const PickedHubspotItems: React.FC = () => {
    const store = useInvoiceStore();
    return (
        <Section
            title="Tickets"
            description="Confirm your picked tickets."
            variant="annotated">
            <Card>
                <CardBody>
                    <DataGrid<TableRow> columns={columns} data={store.pickedTickets} isSortable isHoverable>
                        <Text fontSize='xs' as='i'>Scroll right to view all columns.</Text>
                        <DataGridPagination mt={2} pl={0} />
                    </DataGrid>
                </CardBody>
            </Card>
        </Section>
    )
}