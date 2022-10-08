import { Box, Center, Container, Heading, Stack, Text } from '@chakra-ui/react'
import { NextPage } from 'next'
import { BackgroundGradient } from '../components/landing-page/gradients/background-gradient'
import { SEO } from '../components/landing-page/seo/seo'

const XeroPage: NextPage = () => {

  return (
    <Box>
      <SEO
        title="Billpilot - E-conomic Integration"
        description="Import hour logs from your project
        mangement software, create customizable invoices,
        and send them to E-conomic in minutes."
      />
      <Box position="relative" overflow="hidden">
        <Container maxW="container.md" pt={{ base: 20, lg: 40 }} pb={{ md: 0 }}>
          {/* <Center> */}
            <Stack flex="1" direction="column">
              <Stack
                flex="1"
                alignItems="center"
                direction="column"
                spacing="8"
              >
                <Heading size="lg">Xero</Heading>
                




              </Stack>
            </Stack>
          {/* </Center> */}
        </Container>
      </Box >
    </Box >
  )
}

export default XeroPage