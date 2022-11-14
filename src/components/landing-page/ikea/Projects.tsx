import { Button, Center, Flex, Heading, Input, Spinner, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';

import { ColumnDef, DataGrid, DataGridPagination } from '@saas-ui/pro';
import { Card, CardBody, SearchInput } from "@saas-ui/react";
import useCreateInvoiceStore from '../../../../store/invoice';
import { trpc } from '../../../utils/trpc';
import useInvoiceIssuesStore from '../../../../store/invoiceIssues';

interface IProps {
    setStep: Dispatch<SetStateAction<number>>
}

interface TableProject {
    name: string
    type: string
    key: string
    id: string
}

interface IPagination {
    amount: number
    total: number
}

const Projects = (props: IProps) => {
    const { setStep } = props
    const store = useInvoiceIssuesStore();

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [pagination, setPagination] = useState<IPagination>({ amount: 0, total: 0 })
    const [isLoading, setIsLoading] = useState<Boolean>(true)
    const [isRefetching, setIsRefetching] = useState<Boolean>(false)
    const [projects, setProjects] = useState<TableProject[]>(() => {
        return [
            {
                name: 'Group 3.1',
                type: 'A.P. Møller Maersk',
                key: 'G31',
                id: '1',
            },
            {
                name: 'Sprint 4.2',
                type: 'Vodafone',
                key: 'TES',
                id: '2',
            },
            {
                name: 'Sprint 7.7',
                type: 'Kingfisher plc',
                key: 'F73',
                id: '3',
            },
            {
                name: 'Meet 8.2',
                type: 'Vestas Wind Systems',
                key: 'F13',
                id: '4',
            },
        ]
    })

    useEffect(() => { 
        setTimeout(()=> {
            setIsLoading(false)
        }, 500)
    }, []) 

    // const { isLoading, isRefetching } = trpc.useQuery(["jira.searchProjectsForIssueInvoicing", { searchTerm: searchTerm }], {
    //     onSuccess(data) {
    //         setPagination({ amount: data.amount, total: data.total })
    //         setProjects(data.projects)
    //     },
    //     refetchOnWindowFocus: false
    // });

    function pickProject(key: string) {
        store.pickProject(key)
        setStep((step) => step + 1)
    }

    const columns: ColumnDef<TableProject>[] = [
        {
            id: 'name',
            header: 'Name',
        },
        {
            id: 'type',
            header: 'Type',
        },
        {
            id: 'key',
            header: 'Key',
        },
        {
            id: 'select',
            header: '',
            cell: (data) => (
                <>
                    <Flex justifyContent="end">
                        <Button colorScheme="primary" onClick={() => pickProject(data.row.original.name)} size="sm">Select</Button>
                    </Flex>
                </>
            )
        },
    ]

    return (
        <Card title={
            <Flex>
                <Heading>Pick Project</Heading>
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
                                data={projects}
                                isSortable>
                                <DataGridPagination mt={2} pl={0} />
                                <Text fontSize='xs' as='i'>Loaded 4 of 4 results total. Search to narrow results.</Text>
                            </DataGrid>
                    }
                </Flex>
            </CardBody>
        </Card>
    )
}

export default Projects;