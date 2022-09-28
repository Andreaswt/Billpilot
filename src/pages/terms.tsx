import { Box, Center, Container, Heading, Stack, Text } from '@chakra-ui/react'
import { NextPage } from 'next'
import { BackgroundGradient } from '../components/landing-page/gradients/background-gradient'
import { SEO } from '../components/landing-page/seo/seo'

const TermsOfService: NextPage = () => {

  return (
    <Box>
      <SEO
        title="Billpilot Landingspage"
        description="Free SaaS landingspage starter kit"
      />
      <Box position="relative" overflow="hidden">
        <Container maxW="container.md" pt={{ base: 20, lg: 40 }} pb={{ md: 0 }}>
          <Center>
            <Stack flex="1" direction="row">
              <Stack
                flex="1"
                alignItems="center"
                justify="center"
                direction="column"
                spacing="8"
              >
                
                <Heading size="lg">Terms of service</Heading>
                <Text>Last updated 26th of September, 2022
                  By accessing our website, you are agreeing to be bound by these terms of service, and agree that you are responsible for compliance with any applicable local laws.
                </Text>
                <Heading size="md">1. AGREEMENT TO TERMS</Heading>
                <Heading size="md">2. INTELLECTUAL PROPERTY RIGHTS</Heading>
                <Heading size="md">3. USER REPRESENTATIONS</Heading>
              </Stack>
            </Stack>
          </Center>
        </Container>
      </Box>
    </Box>
  )
}

export default TermsOfService