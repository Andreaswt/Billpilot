import { Flex, Link, SimpleGrid, Spinner, Text } from '@chakra-ui/react'
import { Loading, useSnackbar } from '@saas-ui/react'
import React, { useEffect } from 'react'
import { IconType } from 'react-icons'
import { trpc } from '../../utils/trpc'
import { Metric } from './new-metric'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

interface Props {
  lastUpdated?: Date,
  data: {
    label: string,
    icon: IconType,
    value: string,
    change?: number
  }[]
}

export const Today: React.FunctionComponent<Props> = (props) => {
  TimeAgo.addDefaultLocale(en)

  const { data, lastUpdated } = props

  const utils = trpc.useContext()
  const snackbar = useSnackbar()

  const now = new Date()

  const rebuildReport = trpc.useMutation('dashboard.rebuildReport', {
    onSuccess() {
      utils.invalidateQueries(['dashboard.getDashboard', {year: now.getFullYear(), month: now.getMonth()}]);
      snackbar({
        title: "Report rebuilt successfully",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }
  });

  const handleRebuildReport = () => {
    rebuildReport.mutateAsync();
  }


  return (
    <>
      <SimpleGrid columns={{ md: 4, base: 2 }} gap={4}>
        {
          data.map((metric, index) => (
            <React.Fragment key={index}>
              <Metric {...metric} color="primary" />
            </React.Fragment>
          ))
        }
        <Flex flexDir="column" alignItems="end" justifyContent="start" gap={1}>
          {rebuildReport.isLoading ? (
            <Spinner color='brand.800' />
          ) : (
            <>
              {
                lastUpdated
                  ? <Text fontSize="sm">This report was built <ReactTimeAgo date={lastUpdated} />.</Text>
                  : <Loading />
              }
              <Link color='blue.400' fontSize="sm" onClick={handleRebuildReport}>Rebuild Report</Link>
            </>
          )}
        </Flex>
      </SimpleGrid>
    </>
  )
}

