import { Card } from '@saas-ui/react'
import { DataGrid, ColumnDef, DataGridCell } from '@saas-ui/pro'
import { Sparklines } from '@saas-ui/charts'
import { Progress, Text, useBreakpointValue, useColorMode } from '@chakra-ui/react'

// @todo get this from graphql
interface Data {
  id: string
  company: string
  paid: number
  invoiced: number
  due: number
}

const getPercentage = (value1: number, value2: number) => {
  return Math.round((100 / value2) * value1)
}

const getRemaining = (value1: number, value2: number) => {
  return (value1 - value2)
}

const data: Data[] = [
  {
    id: '',
    company: 'Digital Designer APS',
    paid: 188630,
    invoiced: 195785,
    due: 7155,
  },
  {
    id: '',
    company: 'Marketing Specialists LTD',
    paid: 100767,
    invoiced: 129154,
    due: 28387,
  },
  {
    id: '',
    company: 'Specialists Agency',
    paid: 104814,
    invoiced: 120773,
    due: 15959,
  },
  {
    id: '',
    company: 'Outsourcing Co',
    paid: 109643,
    invoiced: 179768,
    due: 70125,
  },
]

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
      value={getPercentage(cell.row.getValue('paid'), cell.row.getValue('invoiced'))}
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
    id: 'invoiced',
    header: 'Invoiced',
    meta: {
      isNumeric: true,
    },
    
  },
  {
    id: 'paid',
    header: 'Paid',
    meta: {
      isNumeric: true,
    },
  },

  {
    id: 'due',
    header: 'Due',
    meta: {
      isNumeric: true,
    },
  },
]

export const SalesByCountry = () => {

  const dataGridWidth = useBreakpointValue({
    xs: 'auto',
    md: '100%'
  })

  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Card title="Clients" boxShadow='md' borderColor={colorMode === 'dark' ? 'white.50' : 'gray.300'}>
      <DataGrid<Data> sx={{width: dataGridWidth}} columnResizeMode='onEnd'  columns={columns} data={data} isSortable />
    </Card>
  )
}
