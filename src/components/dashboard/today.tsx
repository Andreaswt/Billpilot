import { Box, Grid, GridItem, Heading, SimpleGrid, Stat, StatArrow, StatHelpText, StatNumber, Text } from '@chakra-ui/react'
import { Card, CardBody, CardHeader } from '@saas-ui/react'
import { Metric } from './new-metric'

import { IoIosPaper, IoMdCalendar } from 'react-icons/io'
import { MdPayment } from 'react-icons/md'

const data = [
  {
    label: 'Total Hours Billed',
    icon: IoIosPaper,
    value: '19.473',
    change: 23,
  },
  {
    label: 'Total Billable Hours',
    icon: MdPayment,
    value: '130',
    change: 29,
  },
  {
    label: 'Total Hours Due',
    icon: IoMdCalendar,
    value: '5',
    change: -10,
  },
  {
    label: 'Total Due',
    icon: IoMdCalendar,
    value: '10',
    change: 60,
  },
]

export const Today = () => {
  return (
    <>
      {/* <Grid templateRows='repeat(2, 1fr)' templateColumns='repeat(3, 1fr)' gap="4"> */}
        {/* <GridItem rowSpan={2} colSpan={2}> */}
          <SimpleGrid columns={{md: 4, base: 1}} gap={4}>
            {data.map((metric, index) => (
              <Metric key={index} {...metric} color="primary" />
            ))}
          </SimpleGrid>
        {/* </GridItem> */}
        {/* <GridItem colSpan={1}>
          <Card borderRadius="8px" border="1px solid #e0dede" boxShadow='md' title="Recent invoices">
            <CardBody>
              SaaS UI datagrid here
            </CardBody>
          </Card>
        </GridItem> */}
      {/* </Grid> */}
    </>
  )
}

