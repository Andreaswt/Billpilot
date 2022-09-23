import { SimpleGrid } from '@chakra-ui/react'
import { Card, CardBody } from '@saas-ui/react'

import { Metric } from './metric'
import { FiGrid} from 'react-icons/fi'

import {IoIosPaper, IoMdCalendar} from 'react-icons/io'
import {MdPayment} from 'react-icons/md'


const data = [
  {
    label: 'Total Invoiced',
    icon:  IoIosPaper,
    value: '$ 43.400',
    change: 23,
  },
  {
    label: 'Total Paid',
    icon: MdPayment,
    value: '$ 130',
    change: 29,
  },
  {
    label: 'Total Due',
    icon: IoMdCalendar,
    value: '$ 5',
    change: -10,
  },
]

export const Today = () => {
  return (
    <SimpleGrid columns={[1, 2, 3]} gap="4">
      {data.map((metric) => (
        <Card title ={metric.label}>
          <CardBody>
            <Metric {...metric} color="primary" />
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  )
}
