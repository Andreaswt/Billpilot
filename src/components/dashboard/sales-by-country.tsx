import { Card } from '@saas-ui/react'
import { DataGrid, Column, DataGridCell } from '@saas-ui/pro'
import { Sparklines } from '@saas-ui/charts'
import { Progress } from '@chakra-ui/react'

// @todo get this from graphql
interface Data {
  id: string
  country: string
  customers: number
  revenue: number
}

const total = 43400

const getPercentage = (value: number) => {
  return Math.round((100 / total) * value)
}

const data: Data[] = [
  {
    id: 'us',
    country: 'US',
    customers: 70,
    revenue: 21700,
  },
  {
    id: 'ca',
    country: 'Canada',
    customers: 40,
    revenue: 13020,
  },
  {
    id: 'nl',
    country: 'Netherlands',
    customers: 15,
    revenue: 4990,
  },
  {
    id: 'Germany',
    country: 'Germany',
    customers: 5,
    revenue: 1500,
  },
]

const MetricsCell: DataGridCell<Data> = ({ value }) => {
  return <Sparklines data={value} height="20px" width="100px" color="primary" />
}

const ProgressCell: DataGridCell<Data> = ({ row }) => {
  return (
    <Progress
      value={getPercentage(row.values.revenue)}
      size="sm"
      colorScheme="primary"
    />
  )
}

const CurrencyCell: DataGridCell<Data> = ({ value }) => {
  return (
    <>
      {"USD"}
    </>
  )
}

const columns: Column<Data>[] = [
  {
    id: 'country',
    Header: 'Country',
  },
  {
    id: 'bar',
    Header: '',
    Cell: ProgressCell,
  },
  {
    id: 'customers',
    Header: 'Customers',
    isNumeric: true,
  },
  {
    id: 'revenue',
    Header: 'Revenue',
    isNumeric: true,
    Cell: CurrencyCell,
  },
]

export const SalesByCountry = () => {
  return (
    <Card title="By country" overflowX="auto">
      <DataGrid<Data> columns={columns} data={data} isSortable />
    </Card>
  )
}
