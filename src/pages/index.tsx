import {
  Box, ButtonGroup, Center, Container, Flex, Heading, HStack, Icon, Stack, Tag, Text, useColorMode, VStack, Wrap
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import Image from 'next/image'
import * as React from 'react'
import { SEO } from '../components/landing-page/seo/seo'

import { Br } from '@saas-ui/react'
import {
  FiArrowRight,
  FiBox, FiCode, FiFlag,
  FiGrid,
  FiLock,
  FiSearch,
  FiSliders,
  FiSmile, FiThumbsUp, FiUserPlus
} from 'react-icons/fi'
import { Faq } from '../components/landing-page/faq/faq'
import { Features } from '../components/landing-page/features/features'
import { BackgroundGradient } from '../components/landing-page/gradients/background-gradient'
import { Hero } from '../components/landing-page/hero/hero'
import { FallInPlace } from '../components/landing-page/motion/fall-in-place'
import { Pricing } from '../components/landing-page/pricing/pricing'
import { Em } from '../components/landing-page/typography'

import { ButtonLink } from '../components/landing-page/button-link/button-link'
import { Testimonial } from '../components/landing-page/testimonials/testimonial'
import { Testimonials } from '../components/landing-page/testimonials/testimonials'

import faq from '../data/faq'
import pricing from '../data/pricing'
import testimonials from '../data/testimonials'

import { Highlights, HighlightsItem } from '../components/landing-page/highlights/highlights'
import Colors from '../styles/colors'
import { ContactForm } from '../components/landing-page/ContactForm'



const Home: NextPage = () => {

  return (
    <Box>
      <SEO
        title="Billpilot Landingspage"
        description="Free SaaS landingspage starter kit"
      />
      <Box>
        <HeroSection />

        <HighlightsSection />

        <FeaturesSection />

        {/* <TestimonialsSection /> */}

        <PricingSection />

        <FaqSection />

        <ContactFormSection />

      </Box>
    </Box>
  )
}


const HeroSection: React.FC = () => {
  const { toggleColorMode, colorMode } = useColorMode()
  return (
    <Box position="relative">
      <BackgroundGradient height="100%" />
      <Container pt={{ base: 40, lg: 60 }} pb="20" maxWidth='90w' alignItems="center">
        <Center>
          <Stack direction={{ base: 'column', lg: 'row' }} alignItems="center" maxWidth='90vw'>
            <Hero
              id="home"
              justifyContent="center"
              px="0"
              maxWidth='90vw'
              title1={
                <FallInPlace
                  bgGradient={colorMode === 'dark' ? 'linear(to-l, #68affb, #FFFFFF)' : 'linear(to-l, #68affb, #000)'}
                  bgClip='text'
                  letterSpacing='2px'
                  fontSize={{ base: '48px', lg: '8xl' }}
                  fontWeight='400'>
                  Bill your clients.
                </FallInPlace>
              }
              title2={
                <FallInPlace
                  bgGradient={colorMode === 'dark' ? 'linear(to-l, #68affb, #FFFFFF)' : 'linear(to-l, #68affb, #000)'}
                  bgClip='text'
                  letterSpacing='2px'
                  fontSize={{ base: '48px', lg: '8xl' }}
                  fontWeight='400'
                >
                  <Text as='i'>
                    At scale.
                  </Text>

                </FallInPlace>
              }
              description={
                <FallInPlace delay={0.4} fontWeight="400" fontSize={{ base: '1xl', lg: '2xl' }}>
                  Billpilot imports <Em>project mangement data</Em>,
                  <Br /> creates invoices from time reports and <Br />
                  sends them to your accounting app in minutes.
                </FallInPlace>

              }
            >
              <FallInPlace delay={0.8} >
                <HStack pt={{ base: '4', lg: '4' }} pb={{ base: '4', lg: '12' }} spacing="5">
                </HStack>
                <ButtonGroup w='100%'>
                  <Flex w='100%' justifyContent="center" gap={4} flexDir='column'  >
                    <Center alignItems='center' flexDir={{ base: 'column', lg: 'row' }}>
                      <Box width={{ base: '30%', lg: '20%' }} mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
                        <img
                          src="static/images/integrationlogos/asana.png"
                          style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                        />
                      </Box>
                      <Box width={{ base: '30%', lg: '20%' }} mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
                        <img
                          src="static/images/integrationlogos/economic.png"
                          style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                        />
                      </Box>
                      <Box width={{ base: '30%', lg: '20%' }} mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
                        <img
                          src="static/images/integrationlogos/jira.png"
                          style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                        />
                      </Box>
                      <Box width={{ base: '30%', lg: '20%' }} mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
                        <img
                          src="static/images/integrationlogos/quickbooks.png"
                          style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                        />
                      </Box>
                      <Box width={{ base: '30%', lg: '20%' }} mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
                        <img
                          src="static/images/integrationlogos/xero.png"
                          style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                        />
                      </Box>
                    </Center>

                    <Flex justifyContent="center" gap='5'>
                      <ButtonLink colorScheme="primary" color= 'white' size="lg" href="/signup">
                        Sign Up
                      </ButtonLink>
                      <ButtonLink
                        size="lg"
                        href="https://demo.saas-ui.dev"
                        variant="outline"
                        rightIcon={
                          <Icon
                            as={FiArrowRight}
                            sx={{
                              transitionProperty: 'common',
                              transitionDuration: 'normal',
                              '.chakra-button:hover &': {
                                transform: 'translate(5px)',
                              },
                            }}
                          />
                        }
                      >
                        Schedule Demo
                      </ButtonLink>
                    </Flex>

                  </Flex>
                </ButtonGroup>

              </FallInPlace>
            </Hero>
          </Stack>
        </Center>
      </Container>
      <Flex justifyContent='center'>
        <Image
          src="static/screenshots/list.png"
          alt="Picture of the author"
          width={1200}
          height={800}
        />
      </Flex>
      <Features
        id="benefits"
        columns={[1, 2, 4]}
        iconSize={4}
        innerWidth="container.xl"
        pt="20"
        features={[
          {
            title: 'Modular',
            icon: FiSmile,
            description: "We take pride in our ever evolving integrations and we're not scared of adding more",
            iconPosition: 'left',
            delay: 0.6,
          },
          {
            title: 'Composable',
            icon: FiGrid,
            description:
              'Compose invoice items to fit your needs and mix them together to create fully customizable bills.',
            iconPosition: 'left',
            delay: 1,
          },
          {
            title: 'Productive',
            icon: FiThumbsUp,
            description:
              "Designed to save time, servicing your customers is your top priority we'll take care of the billing.",
            iconPosition: 'left',
            delay: 1.1,
          },
          {
            title: 'Flexible',
            icon: FiSliders,
            description:
              'Fully customize all components to your brand with theme support and style props.',
            iconPosition: 'left',
            delay: 0.8,
          },

        ]}
        reveal={FallInPlace}
      />
    </Box>
  )
}

const HighlightsSection = () => {


  return (
    <Highlights>
      <HighlightsItem colSpan={[1, null, 2]} title="A Quality Product that Speaks for Itself ">
        <VStack alignItems="flex-start" spacing="8">
          <Text color="muted" fontSize="xl">
            Get started for <Em> free </Em> with any of our integrations.
            Including authentication screens with Clerk, Supabase and Magic.
            Fully functional forms with React Hook Form. Data tables with React
            Table.
          </Text>
        </VStack>
      </HighlightsItem>
      <HighlightsItem title="Seamless Setup">
        <Text color="muted" fontSize="lg">
          Connect BillPilot with your project mangement platform and start billing projects and hours right away. No manual project setup required.
        </Text>
      </HighlightsItem>
      <HighlightsItem title="Solid foundations">
        <Text color="muted" fontSize="lg">
          We don&apos;t like to re-invent the wheel, neither should you. We
          selected the most productive and established tools in the scene and
          built Billpilot on top of it.
        </Text>
      </HighlightsItem>
      <HighlightsItem
        colSpan={[1, null, 2]}
        title="Our Continually Expanding List of Integrations"
      >
        <Text color="muted" fontSize="lg">
          We took care of all the integrations, so all you need to do is start billing your clients.
        </Text>
        <Wrap mt="8">
          {[
            'Jira',
            'Economic',
            'Xero',
            'Asana',
            'Trello (Coming Soon)',
            'Click Up (Coming Soon)',
            'Monday (Coming Soon)',
            'Notion (Coming Soon)',
          ].map((value) => (
            <Tag
              key={value}
              variant="subtle"
              colorScheme="primary"
              rounded="full"
              px="3"
            >
              {value}
            </Tag>
          ))}
        </Wrap>
      </HighlightsItem>
    </Highlights>
  )
}

// const IntegrationsSection = () => {
//   return (

//   ) 
// }

const FeaturesSection = () => {
  return (
    <Features
      id="features"
      title={
        <Heading
          lineHeight="short"
          fontSize={['2xl', null, '4xl']}
          textAlign="left"
          as="p"
        >
          Features
          <Br />
        </Heading>
      }
      description={
        <>
          We love hearing from our clients.
          <Br />
          Let us know if you think we're missing something.
        </>
      }
      align="left"
      columns={[1, 2, 3]}
      iconSize={4}
      features={[
        {
          title: 'Flexible Time Filters.',
          icon: FiBox,
          description:
            'Filter imported invoice time from Jira by employee, project, issue type and other parameters',
          variant: 'inline',
        },
        {
          title: 'JQL Time Filters.',
          icon: FiLock,
          description:
            'Filter invoice time by JQL that may have any filtration logic and can operate any Jira issue field',
          variant: 'inline',
        },
        {
          title: 'Taxing.',
          icon: FiSearch,
          description:
            'Apply multiple taxes to invoices. Enable or disable taxes for any invoice item individually',
          variant: 'inline',
        },
        {
          title: 'Discounting.',
          icon: FiUserPlus,
          description:
            'Add discount to invoices. Easily enable or disable discount for any invoice item individually',
          variant: 'inline',
        },
        {
          title: 'Fixed Price.',
          icon: FiFlag,
          description:
            "Charge clients using fixed price model or add fixed price expenses to time and materials invoices",
          variant: 'inline',
        },
        {
          title: 'Retainers.',
          icon: FiCode,
          description: (
            <>
              Just add fixed price item with negative amount to take into account a retainer from a client
            </>
          ),
          variant: 'inline',
        },
      ]}
    />
  )
}

const TestimonialsSection = () => {
  const columns = React.useMemo(() => {
    return testimonials.items.reduce<Array<typeof testimonials.items>>(
      (columns, t, i) => {
        columns[i % 3].push(t)

        return columns
      },
      [[], [], []]
    )
  }, [])

  return (
    <Testimonials
      title={testimonials.title}
      columns={[1, 2, 3]}
      innerWidth="container.xl"
    >
      <>
        {columns.map((column, i) => (
          <Stack key={i} spacing="8">
            {column.map((t, i) => (
              <Testimonial key={i} {...t} />
            ))}
          </Stack>
        ))}
      </>
    </Testimonials>
  )
}

const PricingSection = () => {
  return (
    <Pricing {...pricing}>
      <Text p="8" textAlign="center" color="muted">
        VAT may be applicable depending on your location.
      </Text>
    </Pricing>
  )
}

const FaqSection = () => {
  return <Faq {...faq} />
}

const ContactFormSection = () => {
  return <ContactForm/>
}

export default Home

export async function getStaticProps() {
  return {
    props: {
      announcement: {
        title: 'Get 50% off Billpilot Pro while in beta.',
        href: 'https://appulse.gumroad.com/l/saas-ui-pro-pre-order',
      },
    },
  }
}
