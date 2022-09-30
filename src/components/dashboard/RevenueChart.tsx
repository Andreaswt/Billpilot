import * as React from 'react';
import { Button, Card, CardBody, Column, DataTable } from '@saas-ui/react'
import { Box, ButtonGroup, color, Flex, HStack, SimpleGrid, useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

enum TimeCategory {
  YEAR,
  MONTH,
  WEEK
}



interface ExampleData {
  invoice: string
  duedate: string
  email: string
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

const RevenueChart = () => {

  const { colorMode, toggleColorMode } = useColorMode()

  const [timeCategory, setTimeCategory] = React.useState(TimeCategory.YEAR);

  const chartData = {
    options: {
      plotOptions: {
      },
      chart: {
        type: 'line',
        toolbar: {
          show: false
        },
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


  const columns: Column<ExampleData>[] = [
    {
      accessor: 'invoice',
      Header: 'Invoice',
    },
    {
      accessor: 'duedate',
      Header: 'Due Date',
    },
    {
      accessor: 'status',
      Header: 'Status',
    },
  ]

  const data: ExampleData[] = [
    {
      invoice: 1392,
      duedate: '24/12/2021',
      status: 'Due',
    },
    {
      invoice: 1391,
      duedate: '11/12/2021',
      status: 'Paid',
    },
    {
      invoice: 1390,
      duedate: '07/12/2021',
      status: 'Unpaid',
    },
    {
      invoice: 1389,
      duedate: '08/12/2021',
      status: 'Paid',
    },
    {
      invoice: 1388,
      duedate: '08/12/2021',
      status: 'Paid',
    },
    {
      invoice: 1387,
      duedate: '12/11/2021',
      status: 'Paid'
    },

  ]


  return (
    <>
      <Flex gap={4} flexDirection={{ base: "column", md: "row"}}>

        <Card title="Most Recent Invoices" width="33%" border="1px solid #e0dede" boxShadow='md' minWidth ={330}>
          <DataTable columns={columns} data={data} />
        </Card>
        <Card title="Monthly Invoiced Hours" border="1px solid #e0dede" boxShadow='md' width="66%">
          <ButtonGroup px='15px' isAttached variant="outline">
            <Button onClick={() => setTimeCategory(TimeCategory.YEAR)}>Year</Button>
            {/* <Button onClick={() => setTimeCategory(TimeCategory.MONTH)}>Month</Button> */}
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