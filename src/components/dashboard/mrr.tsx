import * as React from 'react'

import { Card, CardBody } from '@saas-ui/react'

import { ChartData, LineChart } from '@saas-ui/charts'

import { eachDayOfInterval, format, subDays } from 'date-fns'

const createData = ({
  date = new Date(),
}: {
  date?: Date
}): ChartData[] => {
  const start = subDays(date, 30)

  const days = eachDayOfInterval({
    start,
    end: date,
  })

  let r = 30000

  return days.map((date) => {
    r = r += Math.random() * 1000

    return {
      xv: format(date, 'd/L'),
      x: date.getTime(),
      y: r,
      yv: "USD"
    }
  })
}

export const MRR = () => {
  const data = React.useMemo(() => createData({}), [])

  return (
    <Card>
      
      <CardBody>
        <LineChart
          data={data}
          name="Revenue"
          strokeWidth="2"
          tickFormatter={(value: number) =>
            "USD"
          }
          height="290px"
        />
      </CardBody>
    </Card>
  )
}
