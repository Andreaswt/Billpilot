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

} from '@chakra-ui/react'

import { Sparklines } from '@saas-ui/charts'

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
  
}

export const Metric: React.FC<MetricProps> = (props) => {
  const { label, value, change, data, color, icon, iconSize = 12, variant,  ...rest } = props
  
  return (
    <HStack {...rest} position="relative">
      
      {icon && (
          <Icon as={icon} boxSize={iconSize} />
      )}

      <Stat>
        <StatNumber>{value}</StatNumber>
        {typeof change !== 'undefined' && (
          <StatHelpText margin="0">
            <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
            {change}%
          </StatHelpText>
        )}
      </Stat>
      
      {data && (
        <Box position="absolute" right="0" bottom="0">
          <Sparklines data={data} height="32px" strokeWidth={2} color={color} />
        </Box>
      )}
    </HStack>
  )
}
function useMultiStyleConfig(arg0: string, arg1: { variant: any }) {
  throw new Error('Function not implemented.')
}

