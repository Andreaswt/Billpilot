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
import { BackendShowcase } from '../components/landing-page/BackendShowcase'
import { BeforeBillpilot } from '../components/landing-page/BeforeBillpilot'
import { ProjectToInvoice } from '../components/landing-page/ProjectToInvoice'
import { Slack } from '../components/landing-page/Slack'

const Home: NextPage = () => {

  return (
    <Box>
      <SEO
        title="Billpilot Landingspage"
        description="Free SaaS landingspage starter kit"
      />
      <Box>
        <HeroSection />

        <ProjectToInvoiceSection />

        <BackendShowcaseSection />

        <BeforeBillpilotSection />



        <HighlightsSection />

        <FeaturesSection />

        {/* <TestimonialsSection /> */}

        <PricingSection />

        <FaqSection />

        <SlackSection />

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
                  Billpilot imports data from your <Em>project<Br /> mangement software</Em>,
                  helps you create invoices, <Br />
                  and sends them to your accounting app in minutes.
                </FallInPlace>
              }
            >
              <FallInPlace delay={0.8} >
                <HStack pt={{ base: '4', lg: '4' }} pb={{ base: '4', lg: '12' }} spacing="5">
                </HStack>
                <Flex w='100%' justifyContent="center" gap={4} flexDir='column'  >
                  <Center alignItems='center' flexDir={{ base: 'column', lg: 'row' }}>
                    <Box mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
                    <Image
                          src="static/images/integrationlogos/asana.png"
                          style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                          alt='asana logo'
                          width={150}
                          height={30}
                        />
                    </Box>
                    <Box mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
                    <Image
                          src="static/images/integrationlogos/economic.png"
                          style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                          alt='e-conomic logo'
                          width={150}
                          height={33}
                        />
                    </Box>
                    <Box mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
                    <Image
                          src="static/images/integrationlogos/jira.png"
                          style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                          alt='jira logo'
                          width={150}
                          height={20}
                        />
                    </Box>
                    <Box mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
                      <Image
                          src="static/images/integrationlogos/quickbooks.png"
                          style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                          alt='quickbooks logo'
                          width={150}
                          height={29}
                        />
                    </Box>
                    <Box mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
                      <Image
                        src="static/images/integrationlogos/xero.png"
                        style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                        alt='xero logo'
                        width={150}
                        height={45}
                      />
                    </Box>

                  </Center>
                  <Flex justifyContent="center">
                    <ButtonGroup>
                      <Flex justifyContent="center" gap='5'>
                        <ButtonLink colorScheme="primary" color='white' size="lg" href="/signup">
                          Sign Up
                        </ButtonLink>
                        <ButtonLink
                          size="lg"
                          href="/#contact"
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
                    </ButtonGroup>
                  </Flex>
                </Flex>


              </FallInPlace>
            </Hero>
          </Stack>
        </Center>
      </Container>
      <Flex justifyContent='center'>
        <Box style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <Image
            src="static/screenshots/showcase.png"
            alt="Picture of the author"
            width={1607}
            height={1021}
          />
        </Box>
      </Flex>
      <Features
        id="benefits"
        columns={[1, 2, 4]}
        iconSize={4}
        innerWidth="container.xl"
        pt="20"
        features={[
          {
            title: "Invoice Overview",
            icon: FiSmile,
            description: 'Track billed time with a dashboard overview of total invoiced, total paid and total due',
            iconPosition: 'left',
            delay: 0.6,
          },
          {
            title: 'Flexible Invoicing',
            icon: FiGrid,
            description:
              'Bill individual tasks, projects or even employees time from your project management software',
            iconPosition: 'left',
            delay: 1,
          },
          {
            title: 'Create Templates',
            icon: FiThumbsUp,
            description:
              "Create invoice templates containg your usual settings to speed up generating invoices with BillPilot",
            iconPosition: 'left',
            delay: 1.1,
          },
          {
            title: 'Linked Invoices',
            icon: FiSliders,
            description:
              "Generate custom links to give clients direct access to invoices from Billpilot, or email them directly",
            iconPosition: 'left',
            delay: 0.8,
          },

        ]}
        reveal={FallInPlace}
      />
    </Box >

  )
}

const BackendShowcaseSection = () => {
  // return <BackendShowcase id="backendshowcase" />
  return <BackendShowcase sectionId="backendshowcase" />
}

const BeforeBillpilotSection = () => {
  return <BeforeBillpilot />
}

const ProjectToInvoiceSection = () => {
  return <ProjectToInvoice />
}

const HighlightsSection = () => {

  return (
    <Highlights >
      <HighlightsItem colSpan={[1, null, 2]} title="Try It Free">
        <VStack alignItems="flex-start" spacing="8">
          <Text color="muted" fontSize="xl">
            Get started for <Em> free </Em> with any of our integrations. Test it out, see if it can help you and your company. If after 14 days you&apos;d like to continue using Billpilot to automatically generate invoices sign up for a business account.
          </Text>
        </VStack>
      </HighlightsItem>
      <HighlightsItem title="Seamless Setup">
        <Text color="muted" fontSize="lg">
          Integrate Billpilot with your project mangement and invocing software one click per integration.
        </Text>
      </HighlightsItem>
      <HighlightsItem title="Save Time">
        <Text color="muted" fontSize="lg">
          Use Billpilot to automate away boring tasks, to save valueable time in the end. Invoice time items imported manually, or generate invoices based on previous templates generated.
        </Text>
      </HighlightsItem>
      <HighlightsItem
        colSpan={[1, null, 2]}
        title="Our Continually Expanding List of Integrations"
      >
        <Text color="muted" fontSize="lg">
          Let us take care of the integrations, so all you need to do is start billing your clients.
          <Br />
          Contact us if an integration is missing and you would like to see it active.
        </Text>
        <Wrap mt="8">
          {[
            'Jira',
            'Economic',
            'Xero (Coming Soon)',
            'Asana (Coming Soon)',
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
          Let us know if you think we&apos;re missing something.
        </>
      }
      align="left"
      columns={[1, 2, 3]}
      iconSize={4}
      features={[
        {
          title: 'Time Filters.',
          icon: FiBox,
          description:
            'Breakdown invoiced time by project, employee, issue type and other parameters',
          variant: 'inline',
        },
        {
          title: 'Update Hours Spent.',
          icon: FiLock,
          description:
            "Override hours spent for imported time items, in cases where registered time shouldn't be the billed time",
          variant: 'inline',
        },
        {
          title: 'Overview.',
          icon: FiSearch,
          description:
            'Keep track of invoiced items, to prevent you from invoicing the same time items multiple times',
          variant: 'inline',
        },
        {
          title: 'Discounts.',
          icon: FiUserPlus,
          description:
            'Add discounts to your selected invoice items which will apply on the final invoice',
          variant: 'inline',
        },
        {
          title: 'Integrations.',
          icon: FiFlag,
          description:
            "Export generated invoice to multiple integrations, and apply integration specific options to the exported version",
          variant: 'inline',
        },
        {
          title: 'More Features On The Way.',
          icon: FiCode,
          description:
            "Contact us if you want specific features, and we will prioritize the development of that feature",
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
  return <Faq id="resources" {...faq} />
}

const SlackSection = () => {
  return <Slack sectionId="slack" />
}

const ContactFormSection = () => {
  return <ContactForm sectionId="contact" />
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
