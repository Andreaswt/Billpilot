import { ButtonGroup, Flex, Link, useColorMode, Center } from '@chakra-ui/react';
import { Button, Card, CardBody, Column, DataTable, EmptyState } from '@saas-ui/react';
import dynamic from 'next/dynamic';
import NextLink from "next/link";
import router from 'next/router';
import * as React from 'react';
import { IoDocumentsSharp } from 'react-icons/io5'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

enum TimeCategory {
  YEAR,
  MONTH,
  WEEK
}



interface RecentInvoices {
  id: string
  title: string
  invoicedDates: string
  total: string
}

const categoryWeek = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
]

const categoryDay = [
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
  'SUN',
]

const yearlyPaid = [
  400, 2093, 2764, 1842, 2094, 1432, 3234, 3232, 4922, 4620, 3843, 4000,
]

const yearlyDue = [
  0, 120, 0, 0, 300, 0, 0, 150, 199, 0, 400, 500,
]

const weeklyPaid = [
  400, 2093, 2764, 1842, 2094, 1432, 3234,
]

const weeklyDue = [
  0, 120, 0, 0, 300, 0, 170,
]

interface Props {
  recentInvoices: RecentInvoices[]
}

const RevenueChart: React.FunctionComponent<Props> = (props) => {
  const { colorMode, toggleColorMode } = useColorMode()

  const [timeCategory, setTimeCategory] = React.useState(TimeCategory.YEAR);

  const chartData = {
    options: {
      chart: {
        toolbar: {
          show: false
        },
      },
      grid: {
        show: false
      },
      yaxis: {
        axisBorder: {
          show: true,
          color: colorMode === 'dark' ? '#ffffff' : '#78909C',
        },
        axisTicks: {
          show: true,
          borderType: 'solid',
          color: colorMode === 'dark' ? '#ffffff' : '#78909C',
        },
        labels: {
          style: {
            colors: colorMode === 'dark' ? '#ffffff' : '#78909C',
          },
        },


      },

      xaxis: {
        axisBorder: {
          show: true,
          color: colorMode === 'dark' ? '#ffffff' : '#78909C',
          width: '100%',
          offsetX: -3,
        },
        axisTicks: {
          show: true,
          borderType: 'solid',
          color: colorMode === 'dark' ? '#ffffff' : '#78909C',
        },
        labels: {
          style: {
            colors: colorMode === 'dark' ? '#ffffff' : '#78909C',
          },
        },
        categories: (timeCategory === TimeCategory.YEAR) ? categoryWeek : categoryDay
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0]
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        colors: '[#4C91E1, #73A9E8]',
        labels: {
          colors: colorMode === 'dark' ? '#ffffff' : '#78909C',
        }
      }
    },
    series: [
      {
        name: "Paid",
        type: 'line',
        data: (timeCategory === TimeCategory.YEAR) ? yearlyPaid : weeklyPaid,
        color: '#73A9E8'
      },
      {
        name: 'Due',
        type: 'column',
        data: (timeCategory === TimeCategory.YEAR) ? yearlyDue : weeklyDue,
        color: '#4C91E1'
      },
    ],

  };


  const columns: Column<RecentInvoices>[] = [
    {
      accessor: 'title',
      Header: 'Title',
      Cell: ({ value, column, row }) => {
        return (
          <NextLink href={`/dashboard/invoices/view/${row.original.id}`} passHref>
            <Link>{value}</Link>
          </NextLink>)
      }
    },
    {
      accessor: 'invoicedDates',
      Header: 'Invoiced Dates',
    },
    {
      accessor: 'total',
      Header: 'Total',
    },
  ]

  return (
    <>
      <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>

        <Card title="Most Recent Invoices" width={{ base: "100%", md: "33%" }} borderColor={colorMode === 'dark' ? 'white.50' : 'gray.300'} overflow='hidden' boxShadow='md' minWidth={330}>
          {
            props.recentInvoices.length === 0
              ? <Center py={4}>
                <EmptyState
                  colorScheme="primary"
                  icon={IoDocumentsSharp}
                  title="No invoices yet"
                  description="Create your first invoice now."
                  actions={
                    <>
                      <Button onClick={() => router.push("/dashboard/invoices")} label="Create invoice" colorScheme="primary" />
                    </>
                  }
                />
              </Center>
              : <DataTable columns={columns} data={props.recentInvoices} />
          }
        </Card>
        <Card title="Monthly Invoiced Hours" boxShadow='md' minH={625} width={{ base: "100%", md: "66%" }} borderColor={colorMode === 'dark' ? 'white.50' : 'gray.300'}>
          <ButtonGroup px='15px' isAttached variant="outline">
            <Button onClick={() => setTimeCategory(TimeCategory.YEAR)}>Year</Button>
            <Button onClick={() => setTimeCategory(TimeCategory.WEEK)}>Week</Button>
          </ButtonGroup>
          <CardBody>
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="line"
            />
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}

export default RevenueChart;