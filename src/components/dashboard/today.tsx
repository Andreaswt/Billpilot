import { SimpleGrid } from '@chakra-ui/react'
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
      </SimpleGrid>
    </>
  )
}

