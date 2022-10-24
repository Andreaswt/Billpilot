import { Center, Link, Progress, Text, useBreakpointValue, useColorMode } from '@chakra-ui/react'
import { ColumnDef, DataGrid, DataGridCell } from '@saas-ui/pro'
import { Button, Card, EmptyState } from '@saas-ui/react'
import router from 'next/router'
import { BsPlugFill, BsFillPeopleFill } from 'react-icons/bs'
import NextLink from "next/link";

interface Data {
  id: string
  name: string
  billed: number
  notBilled: number
  latestBill: string
}

const getPercentage = (value1: number, value2: number) => {
  return Math.round((100 / value2) * value1)
}

const getRemaining = (value1: number, value2: number) => {
  return (value1 - value2)
}


const NameCell: DataGridCell<Data> = (cell) => {
  return (
    <NextLink href={`/dashboard/invoices/view/${cell.row.original.id}`} passHref>
      <Link flexGrow={1}>{cell.row.getValue('name')}</Link>
    </NextLink>
  )
}

const ProgressCell: DataGridCell<Data> = (cell) => {
  return (
    <Progress
      value={getPercentage(cell.row.getValue('billed'), cell.row.getValue('notBilled'))}
      size="sm"
      colorScheme="primary"
    />
  )
}

const columns: ColumnDef<Data>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: NameCell,
  },
  {
    id: 'statusbar',
    header: 'Status',
    cell: ProgressCell,
  },
  {
    id: 'billed',
    header: 'Billed',
    meta: {
      isNumeric: true,
    },

  },
  {
    id: 'notBilled',
    header: 'Not Billed',
    meta: {
      isNumeric: true,
    },
  },

  {
    id: 'latestBill',
    header: 'Latest Bill',
  },
]

interface Props {
  clients: Data[]
}

export const Clients: React.FunctionComponent<Props> = (props) => {

  const dataGridWidth = useBreakpointValue({
    xs: 'auto',
    md: '100%'
  })

  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Card title="Clients" boxShadow='md' borderColor={colorMode === 'dark' ? 'white.50' : 'gray.300'}>
      {
        props.clients.length === 0
          ? <Center py={4}>
            <EmptyState
              colorScheme="primary"
              icon={BsFillPeopleFill}
              title="No clients yet"
              description="Create your first client now."
              actions={
                <>
                  {/* <Button onClick={() => router.push("/dashboard/clients/create")} label="Create client" colorScheme="primary" /> */}
                  <Button onClick={() => router.push("/dashboard/clients/create")} label="Create client" colorScheme="primary" />
                </>
              }
            />
          </Center>
          : <DataGrid<Data> sx={{ width: dataGridWidth }} columnResizeMode='onEnd' columns={columns} data={props.clients} isSortable />
      }

    </Card>
  )
}
