import { Button, Center, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState } from 'react';

import { ColumnDef, DataGrid, DataGridPagination } from '@saas-ui/pro';
import { Card, CardBody, SearchInput } from "@saas-ui/react";
import useInvoiceHubspotTicketsStore from '../../../../store/invoiceHubspotTickets';
import { trpc } from '../../../utils/trpc';

interface IProps {
    setStep: Dispatch<SetStateAction<number>>
}

interface TableRow {
    id: string
    name: string
    domain: string
    city: string
}

interface IPagination {
    amount: number
    total: number
}

const Companies = (props: IProps) => {
    const { setStep } = props
    const store = useInvoiceHubspotTicketsStore();

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [pagination, setPagination] = useState<IPagination>({ amount: 0, total: 0 })
    const [companies, setCompanies] = useState<TableRow[]>([])

    const { isLoading, isRefetching } = trpc.useQuery(["hubspot.searchCompanies", { searchTerm: searchTerm }], {
        onSuccess(data) {
            setPagination({ amount: data.amount, total: data.total })
            setCompanies(data.companies)
        },
        refetchOnWindowFocus: false
    });

    function pickCompany(id: string) {
        store.pickCompany(id)
        setStep((step) => step + 1)
    }

    const columns: ColumnDef<TableRow>[] = [
        {
            id: 'name',
            header: 'Name',
        },
        {
            id: 'domain',
            header: 'Domain',
        },
        {
            id: 'city',
            header: 'City',
        },
        {
            id: 'id',
            header: 'Id',
        },
        {
            id: 'select',
            header: '',
            cell: (data) => (
                <>
                    <Flex justifyContent="end">
                        <Button colorScheme="primary" onClick={() => pickCompany(data.row.original.id)} size="sm">Select</Button>
                    </Flex>
                </>
            )
        },
    ]

    return (
        <Card title={
            <Flex>
                <Heading>Pick Company</Heading>
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
                                data={companies}
                                isSortable>
                                <DataGridPagination mt={2} pl={0} />
                                <Text fontSize='xs' as='i'>Loaded {pagination.amount} of {pagination.total} results total. Search to narrow results.</Text>
                            </DataGrid>
                    }
                </Flex>
            </CardBody>
        </Card>
    )
}

export default Companies;