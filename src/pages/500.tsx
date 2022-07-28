import { useRouter } from 'next/router'
import { Center } from '@chakra-ui/react'
import { ErrorPage } from '@saas-ui/pro'
import { Button } from '@saas-ui/react'
import { FiFrown } from 'react-icons/fi'

export default function Error500() {
  const router = useRouter()

  return (
    <Center h='100%'>
      <ErrorPage
        title="Oh dear, something isn't looking right"
        description="Where do you want to go?"
        icon={FiFrown}
        actions={
          <>
            <Button
              label="Go back"
              colorScheme="primary"
              onClick={() => router.back()}
            />
            <Button label="Dashboard" onClick={() => router.push('/dashboard')} />
          </>
        }
      />
    </Center>
  )
}
