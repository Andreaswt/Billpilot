import { Flex, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef, DataGrid, DataGridPagination, Section } from '@saas-ui/pro';
import { Card, CardBody, PropertyList, Property } from '@saas-ui/react';
import useInvoiceStore, { PickedJiraIssue } from '../../../../../store/invoiceStore';

const columns: ColumnDef<PickedJiraIssue>[] = [
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
        cell: (data) => (<p>{data.row.original.hoursSpent ?? "-"}</p>)
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
]

export const PickedJiraItems: React.FC = () => {
    const store = useInvoiceStore();
    return (
        <Section
            title="Issues"
            description="Confirm your picked issues."
            variant="annotated">
            <Card>
                <CardBody>
                    <DataGrid<PickedJiraIssue> columns={columns} data={store.pickedIssues} isSortable isHoverable>
                        <Text fontSize='xs' as='i'>Scroll right to view all columns.</Text>
                        <DataGridPagination mt={2} pl={0} />
                    </DataGrid>
                </CardBody>
            </Card>
        </Section>
    )
}