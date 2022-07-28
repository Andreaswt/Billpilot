import { Stack, Text, Progress } from '@chakra-ui/react'
// import { Has } from '@saas-ui/features'

import differenceInDays from 'date-fns/differenceInDays'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'

import { Button } from './button'

export const BillingStatus = () => {
  let isTrialing = false;
  let trialEndsAt = new Date();
  let currentPlan = { trialDays: 10 };

  if (!isTrialing || !currentPlan || !trialEndsAt) {
    return null
  }

  let progress
  if (currentPlan.trialDays) {
    progress =
      100 -
      (100 / currentPlan.trialDays) * differenceInDays(trialEndsAt, new Date())
  }

  return (
    <Stack spacing="4" borderTopWidth="1px" pt="4">
      <Stack direction="row" px="4" alignItems="center">
        <Text flex="1">
          Trial ends in{' '}
          <strong>{formatDistanceStrict(new Date(), trialEndsAt)}</strong>
        </Text>
        {/* <Has feature="billing">
          <Button href={"/settings/plans"} variant="solid" colorScheme="green">
            Upgrade
          </Button>
        </Has> */}
      </Stack>
      {progress !== undefined && (
        <Progress
          colorScheme="green"
          bg="sidebar-on-muted"
          size="xs"
          borderRadius="0"
          value={progress}
        />
      )}
    </Stack>
  )
}
