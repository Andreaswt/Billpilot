import * as React from 'react';
import { Button, Card, CardBody } from '@saas-ui/react'
import { ButtonGroup } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

enum TimeCategory {
  YEAR,
  MONTH
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
          borderRadius: 5,
        }
      },
      fill: {
        colors: ['#2479DB', '#13315C'],
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
          fillColors: ['#2479DB', '#13315C']
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

  return (
    <Card title="Monthly Recurring Revenue" border="1px solid #C0C0C0" boxShadow='lg'>
      <ButtonGroup px = '15px' isAttached variant="outline">
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
  );
}

export default RevenueChart;