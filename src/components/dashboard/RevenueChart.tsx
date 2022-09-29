import * as React from 'react';
import { Button, Card, CardBody, Column, DataTable } from '@saas-ui/react'
import { Box, ButtonGroup, Flex, HStack, SimpleGrid } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

enum TimeCategory {
  YEAR,
  MONTH
}

interface ExampleData {
  invoice: string
  duedate: string
  email: string
}

const categoryMonth = [
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
  0, 120, 0, 0, 300, 0, 0, 0, 0, 0, 0, 500,
]

const weeklyPaid = [
  400, 2093, 2764, 1842, 2094, 1432, 3234,
]

const weeklyDue = [
  0, 120, 0, 0, 300, 0, 0,
]

const RevenueChart = () => {

  const [timeCategory, setTimeCategory] = React.useState(TimeCategory.YEAR);
  
  const chartData = {
    options: {
      // colors: ['#2479DB'],
      plotOptions: {
        bar: {
          columnWidth: '50%',
          borderRadius: 2,
        }
      },
      fill: {
        colors: ['#2479DB', '#0ea371'],
        opacity: 0.95,
      },
      chart: {
        stacked: true,
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: (timeCategory === TimeCategory.YEAR) ? categoryMonth : categoryDay
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        markers: {
          fillColors: ['#2479DB', '#0ea371']
        }
      }
    },
    series: [
      {
        name: "Paid",
        data: (timeCategory === TimeCategory.YEAR) ? yearlyPaid : weeklyPaid,
      },
      {
        name: 'Due',
        data: (timeCategory === TimeCategory.YEAR) ? yearlyDue : weeklyDue,
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
      {/* <SimpleGrid columns={[2, 1, 3]} gap={4}> */}
      <Flex gap={4}>
        
        <Card title="Most Recent Invoices" width="33%" border="1px solid #e0dede" boxShadow='md'>
            <DataTable columns={columns} data={data} />
        </Card>
        <Card title="Monthly Recurring Revenue" border="1px solid #e0dede" boxShadow='md' width="66%">
          <ButtonGroup px='15px' isAttached variant="outline">
            <Button onClick={() => setTimeCategory(TimeCategory.YEAR)}>Year</Button>
            <Button onClick={() => setTimeCategory(TimeCategory.MONTH)}>Month</Button>
          </ButtonGroup>
          <CardBody>
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              width="100%"
              height="300"
            />
          </CardBody>
        </Card>
        {/* </SimpleGrid> */}
      </Flex>
    </>
  );
}

export default RevenueChart;