import { Box, Grid, GridItem, Heading, SimpleGrid, Stat, StatArrow, StatHelpText, StatNumber, Text } from '@chakra-ui/react'
import { Card, CardBody, CardHeader } from '@saas-ui/react'
import { Metric } from './new-metric'

import { IoIosPaper, IoMdCalendar } from 'react-icons/io'
import { MdPayment } from 'react-icons/md'

const data = [
  {
    label: 'Total Invoiced',
    icon: IoIosPaper,
    value: '43.400',
    change: 23,
  },
  {
    label: 'Total Paid',
    icon: MdPayment,
    value: '130',
    change: 29,
  },
  {
    label: 'Total Due',
    icon: IoMdCalendar,
    value: '5',
    change: -10,
  },
  {
    label: 'Total Du2',
    icon: IoMdCalendar,
    value: '10',
    change: 60,
  },
]

export const Today = () => {
  return (
    <>
      <Grid templateRows='repeat(2, 1fr)' templateColumns='repeat(3, 1fr)' gap="4">
        <GridItem rowSpan={2} colSpan={2}>
          <SimpleGrid columns={2} gap={4}>
            {data.map((metric, index) => (
              <Metric key={index} {...metric} color="primary" />
            ))}
          </SimpleGrid>
        </GridItem>
        <GridItem colSpan={1}>
          <Card borderRadius="8px" border="1px solid #e0dede" boxShadow='md' title="Recent invoices">
            <CardBody>
              SaaS UI datagrid here
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  )
}

// const data2 = [
//   {
//     label: 'Revenue',
//     value: '€43.400',
//     change: 23,
//     data: [10, 3, 7, 14, 6, 9, 12],
//   },
//   {
//     label: 'New customers',
//     value: '130',
//     change: 29,
//     data: [20, 14, 10, 18, 24, 10, 16],
//   },
//   {
//     label: 'Churned customers',
//     value: '5',
//     change: -10,
//     data: [2, 1, 4, 8, 4, 1, 6],
//   },
//   {
//     label: 'Active users',
//     value: '1337',
//     change: 103,
//     data: [11, 5, 8, 15, 20, 25, 20],
//   },
// ]

// const Today2 = () => {
//   return (
//     <SimpleGrid columns={[1, 3, 3]} gap="4">
//       {data.map((metric) => (
//         <Card key={metric.label}>
//           <CardBody>
//             <Metric {...metric} color="primary" />
//           </CardBody>
//         </Card>
//       ))}
//     </SimpleGrid>
//   )
// }
