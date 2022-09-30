import {
  Box,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Circle,
  Icon,
  Flex,
  Text

} from '@chakra-ui/react'

import { Sparklines } from '@saas-ui/charts'
import { Card, CardBody } from '@saas-ui/react'

export interface MetricProps {
  label: string
  value: string
  icon?: any
  iconPosition?: 'left' | 'top'
  iconSize?: number
  change?: number
  data?: number[]
  variant?: string
  color?: string
  key: number

}

export const Metric: React.FC<MetricProps> = (props) => {
  const { label, value, change, data, color, icon, iconSize = 12, variant, key, ...rest } = props

  return (
    <Card {...rest} borderRadius="8px" border="1px solid #e0dede" boxShadow='md' key={key}>
      <CardBody>
        <HStack>
          {icon && (
            <Icon as={icon} boxSize={iconSize} />
          )}

          <Flex p="1rem" flexDirection="column">
            <Text><b>Total Invoiced</b></Text>
            <Flex mt="2rem" flexDir="column">
              <Flex ml="0.5rem" flexDir="column">
                <Text fontSize="6xl"><b><sup>$</sup>{value}</b></Text>
                  <Stat>
                    {/* <StatNumber>{value}</StatNumber> */}
                    {typeof change !== 'undefined' && (
                      <StatHelpText fontSize="xl" margin="0">
                        <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
                        {change}%
                      </StatHelpText>
                    )}
                  </Stat>
              </Flex>
            </Flex>

            {data && (
              <Box position="absolute" right="0" bottom="0">
                <Sparklines data={data} height="32px" strokeWidth={2} color={color} />
              </Box>
            )}

          </Flex>
        </HStack>
      </CardBody>
    </Card>
  )
}
function useMultiStyleConfig(arg0: string, arg1: { variant: any }) {
  throw new Error('Function not implemented.')
}

