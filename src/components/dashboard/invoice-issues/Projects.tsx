import { Button, Flex, Heading } from '@chakra-ui/react';
import React from 'react';

import { Card, CardBody } from "@saas-ui/react";

import { DataGrid, DataGridPagination } from '@saas-ui/pro';

const Projects = () => {
    // const columns = React.useMemo(() => {
    //     return [
    //         {
    //             accessor: 'name',
    //             Header: 'Name',
    //             width: '200px',
    //         },
    //         {
    //             accessor: 'email',
    //             Header: 'Email',
    //         },
    //         {
    //             accessor: 'company',
    //             Header: 'Company',
    //         },
    //         {
    //             accessor: 'country',
    //             Header: 'Country',
    //         },
    //         {
    //             accessor: 'employees',
    //             Header: 'Employees',
    //             isNumeric: true,
    //         },
    //         {
    //             id: 'action',
    //             disableSortBy: true,
    //             disableGlobaFilter: true,
    //             Header: '',
    //             Cell: () => (
    //                 <>
    //                     <Button size="xs">Edit</Button>
    //                 </>
    //             ),
    //             width: '100px',
    //         },
    //     ]
    // }, [])

    return (
        <Card title={
            <Flex>
                <Heading>Create Invoice</Heading>
            </Flex>}>
             <CardBody>
                {/*<DataGrid
                    columns={columns}
                    data={dataTable.data}
                    isSortable
                    isSelectable
                    isHoverable
                >
                    <DataGridPagination />
                </DataGrid> */}
            </CardBody>
        </Card>
    )
}

export default Projects;