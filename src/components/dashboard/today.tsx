import { Flex, Link, SimpleGrid, Stack, Text, useColorMode } from '@chakra-ui/react'
import { Metric } from './new-metric'

import React from 'react'
import { IconType } from 'react-icons'
interface Props {
  data: {
    label: string,
    icon: IconType,
    value: string,
    change?: number
  }[]
}

export const Today: React.FunctionComponent<Props> = (props) => {
  const { data } = props;

  return (
    <>
      <SimpleGrid columns={{ md: 4, base: 2 }} gap={4}>
        {data.map((metric, index) => (
          <React.Fragment key={index}>
            <Metric {...metric} color="primary" />
          </React.Fragment>
        ))}
        <Flex flexDir="column" alignItems="end" justifyContent="start" gap={1}>
            <Text fontSize="sm">This report was built 5 minutes ago.</Text>
            <Link color='blue.400' fontSize="sm" onClick={() => console.log("rebuilding")}>Rebuild Report</Link>
        </Flex>
      </SimpleGrid>
    </>
  )
}

