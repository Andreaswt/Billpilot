import { Box, SimpleGrid, Stat, StatArrow, StatHelpText, StatNumber, Text } from '@chakra-ui/react'
import { Card, CardBody } from '@saas-ui/react'
import { Metric } from './metric'

import { IoIosPaper, IoMdCalendar } from 'react-icons/io'
import { MdPayment } from 'react-icons/md'


const data = [
  {
    label: 'Total Invoiced',
    icon: IoIosPaper,
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
    <>
      <Box display="flex" flexDir="row" my="0rem">
        <Box width="32%" p="1rem" display="flex" flexDir="column" borderRadius="8px" border="1px solid #C0C0C0" boxShadow='lg'>
          <Text><b>Total Invoiced</b></Text>
          <Box display="flex" mt="2rem" flexDir="row">
            <Box display="flex" ml="0.5rem" flexDir="column">
              <Text fontSize="50px"><b><sup>$</sup>43,400</b></Text>
              <Box display="flex" flexDir="row">
                <Stat>
                  {typeof 23 !== 'undefined' && (
                    <StatHelpText margin="0">
                      <StatArrow type={23 > 0 ? 'increase' : 'decrease'} />
                      {23}%
                    </StatHelpText>
                  )}
                </Stat>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box width="2%" />
        <Box width="32%" p="1rem" display="flex" flexDir="column" borderRadius="8px" borderWidth="10px" border="1px solid #C0C0C0" boxShadow='lg'>
          <Text><b>Total Payout</b></Text>
          <Box display="flex" mt="2rem" flexDir="row">
          
            <Box display="flex" ml="0.5rem" flexDir="column">
              <Text fontSize="50px"><b><sup>$</sup>41,353</b></Text>
              <Box display="flex" flexDir="row">
                <Stat>
                  {typeof 23 !== 'undefined' && (
                    <StatHelpText margin="0">
                      <StatArrow type={23 > 0 ? 'increase' : 'decrease'} />
                      {23}%
                    </StatHelpText>
                  )}
                </Stat>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box width="2%" />
        <Box width="32%" p="1rem" display="flex" flexDir="column" borderRadius="8px" border="1px solid #C0C0C0" boxShadow='lg'>
          <Text><b>Total Due</b></Text>
          <Box display="flex" mt="2rem" flexDir="row">
          
            <Box display="flex" ml="0.5rem" flexDir="column">
              <Text fontSize="50px"><b><sup>$</sup>2,000</b></Text>
              <Box display="flex" flexDir="row">
                <Stat>
                  {typeof 23 !== 'undefined' && (
                    <StatHelpText margin="0">
                      <StatArrow type={0 > 23 ? 'increase' : 'decrease'} />
                      {23}%
                    </StatHelpText>
                  )}
                </Stat>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
