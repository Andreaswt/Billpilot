import { useRouter } from 'next/router'
import { FiFrown } from 'react-icons/fi'
import { Button } from '@saas-ui/react'
import { ErrorPage } from '@saas-ui/pro'
import { Box, Container } from '@chakra-ui/react'
import { BackgroundGradient } from '../components/landing-page/gradients/background-gradient'

export default function Error500() {
  const router = useRouter()

  return (
    <Box position="relative" overflow="hidden">
    <BackgroundGradient height="100%" />
    <Container maxW="container.xl" pt={{ base: 20, lg: 40 }} pb={{ md: 0 }}>
      <ErrorPage
        title="Oh dear, something went wrong"
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
      </Container>
    </Box>
  )
}
