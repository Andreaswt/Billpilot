import { Progress, Text, useBreakpointValue, useColorMode } from '@chakra-ui/react'
import { ColumnDef, DataGrid, DataGridCell } from '@saas-ui/pro'
import { Card } from '@saas-ui/react'

interface Data {
  id: string
  company: string
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


const CompanyCell: DataGridCell<Data> = (cell) => {
  return (
    <Text flexGrow={1}>
      {cell.row.getValue('company')}
    </Text>
  )
}

const ProgressCell: DataGridCell<Data> = (cell) => {
  return (
    <Progress
      value={getPercentage(cell.row.getValue('billed'), cell.row.getValue('notBilled'))}
      size="sm"
      colorScheme="primary"
      // width= '100px'
    />
  )
}

const columns: ColumnDef<Data>[] = [
  {
    id: 'company',
    header: 'Company',
    cell: CompanyCell,
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
      <DataGrid<Data> sx={{width: dataGridWidth}} columnResizeMode='onEnd'  columns={columns} data={props.clients} isSortable />
    </Card>
  )
}
