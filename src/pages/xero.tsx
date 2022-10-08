import { Box, Center, Container, Heading, Link, Stack, Text } from '@chakra-ui/react'
import { ResizeBox } from '@saas-ui/pro'
import { Card } from '@saas-ui/react'
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
              <Heading size="lg">Xero Integration</Heading>

              <Text>
                If you use
                <Link>
                  <a href="https://www.xero.com/">
                    Xero
                  </a>
                </Link>
                connect it with Billpilot to
                How Billpilot integrates with Xero?
                We'll automatically sync all your clients in Billpilot, let you assign projects to these clients,
                issue invoices and export these invoices back to Xero
                <Card>
                  <ResizeBox
                    width="280px"
                    minWidth="300px"
                    height="200px"
                    borderRightWidth="1px"
                    
                    padding="4"
                  >
                    <Text>
                      “Most of all, I discovered that in order to succeed with a product you must
                      truly get to know your customers and build something for them.”
                    </Text>
                    <Text size="sm" color="muted">
                      – Marc Benioff
                    </Text>
                  </ResizeBox>
                </Card>
              </Text>
            </Stack>
          </Stack>
          {/* </Center> */}
        </Container>
      </Box >
    </Box >
  )
}

export default XeroPage