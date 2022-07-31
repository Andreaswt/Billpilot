import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Box
} from '@chakra-ui/react'
import ApiKeyTable from './api-keys-table';

const ApiKeyTab = () => {

    return (
        <>
            <Box pt='4'>
                <ApiKeyTable />
            </Box>
        </>
    )
}

export default ApiKeyTab;