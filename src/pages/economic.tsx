import { Box, Button, Center, Container, Flex, Heading, Link, List, ListIcon, ListItem, SimpleGrid, Stack, Tag, Text, useColorMode, VStack, Wrap } from '@chakra-ui/react'
import { ResizeBox, Section, SectionTitle } from '@saas-ui/pro'
import { Br, Card, CardBody } from '@saas-ui/react'
import { NextPage } from 'next'
import Image from 'next/image'
import { BackgroundGradient } from '../components/landing-page/gradients/background-gradient'
import { Highlights, HighlightsItem } from '../components/landing-page/highlights/highlights'
import { SEO } from '../components/landing-page/seo/seo'
import { Em } from '../components/landing-page/typography'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from "swiper";
import { FiArrowRight } from 'react-icons/fi'

// Import Swiper styles
import 'swiper/css';
import { Logo } from '../components/landing-page/layout/logo'
import siteConfig from '../data/config'
import { MdCheckCircle } from 'react-icons/md'
import { IoCheckmarkCircle } from 'react-icons/io5'
import router from 'next/router'
import EconomicOptions from '../components/landing-page/ikea/InvoiceOptions'
import { SetStateAction } from 'react'
import { FallInPlace } from '../components/landing-page/motion/fall-in-place'

const EconomicPage: NextPage = () => {
  const { toggleColorMode, colorMode } = useColorMode()

  return (
    <Box>
      <SEO
        title="Billpilot - E-conomic Integration"
        description="Import hour logs from your project
        mangement software, create customizable invoices,
        and send them to E-conomic in minutes."
      />
      <Box position="relative" overflow="hidden">
        <Container maxW="container.xl" pt={{ base: 20, lg: 40 }} pb={{ md: 0 }}>
          {/* <Center> */}


          <Stack flex="1" direction="column" >
            <Stack
              flex="1"
              alignItems="center"
              direction="column"
              spacing="100"
            >
              <FallInPlace>
                <Heading pb='0px' size='xl' fontWeight='400' >
                  Streamline Accounting with
                </Heading>
                <Box alignItems="center" justifyContent="center" pt='0px' bgGradient={colorMode === 'dark' ? 'linear(to-l, #68affb, #FFFFFF)' : 'linear(to-l, #68affb, #000)'} bgClip='text' h='max'>

                  <Heading size='xl' fontWeight='400'>
                    Billpilot&apos;s E-conomic Plugin
                  </Heading>
                </Box>
              </FallInPlace>

              <Highlights p='0'>
                <HighlightsItem colSpan={[1, null, 2]} title="Billpilot Integrations for E-conomic">
                  <Text>
                    If you use {' '}
                    <Link color='blue.500' href="https://www.e-conomic.com/">
                      E-conomic
                    </Link>
                    {' '} connect it with Billpilot to streamline your invoicing process.
                    How Billpilot integrates with E-Conomic?
                    We&apos;ll automatically sync all your clients in Billpilot, help you assign projects to these clients,
                    issue invoices, and export these invoices back to E-Conomic.
                  </Text>
                </HighlightsItem>
                <HighlightsItem colSpan={[1, null, 2]} title="E-conomic Features">
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={IoCheckmarkCircle} color='primary.400' />
                      Auto generate Billpilot templates from previous invoices in E-conomic
                    </ListItem>
                    <ListItem>
                      <ListIcon as={IoCheckmarkCircle} color='primary.400' />
                      One click export all or selected invoices to E-conomic
                    </ListItem>
                    <ListItem>
                      <ListIcon as={IoCheckmarkCircle} color='primary.400' />
                      Sync invoices and clients from E-conomic
                    </ListItem>
                    <ListItem>
                      <ListIcon as={IoCheckmarkCircle} color='primary.400' />
                      One click set up
                    </ListItem>
                  </List>
                </HighlightsItem>
                <HighlightsItem colSpan={[1, null, 2]} title="Billpilot Integrations for E-conomic">
                  <Flex w='100%' justifyContent="center" gap={4} flexDir='row' alignItems="center" >

                    <Box width='26%'>
                      <Swiper
                        // spaceBetween={30}
                        centeredSlides={true}
                        autoplay={{
                          delay: 2000,
                          disableOnInteraction: false,
                        }}
                        pagination={{
                          clickable: true,
                        }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                      >
                        <SwiperSlide >
                          <Image
                            src="static/images/integrationlogos/asana.png"
                            style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : {}}
                            alt='asana logo'
                            width={200}
                            height={40}
                          />
                        </SwiperSlide>
                        <SwiperSlide>

                          <Image
                            src="static/images/integrationlogos/hubspot.png"
                            style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : {}}
                            alt='hubspot logo'
                            width={150}
                            height={40}
                          />

                        </SwiperSlide>
                        <SwiperSlide>

                          <Image
                            src="static/images/integrationlogos/jira.png"
                            style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : {}}
                            alt='jira logo'
                            width={300}
                            height={40}
                          />

                        </SwiperSlide>
                      </Swiper>
                    </Box>

                    <Box >
                      <FiArrowRight size='' />
                    </Box>
                    <Flex align='center' justifyContent='center'>
                      <Flex flexDir='row' width="full" align='center'>
                        <Box as={siteConfig.logo} />
                        <Text letterSpacing='2px' fontSize='3xl' textColor={colorMode === 'dark' ? '#FFFFFF' : '#2479DB'} as='em'>
                          Billpilot
                        </Text>
                      </Flex>
                    </Flex>
                    <Box>
                      <FiArrowRight size='' />
                    </Box>
                    <Flex align='center' justifyContent='center'>
                      <Image
                        src="static/images/integrationlogos/economic.png"
                        style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : {}}
                        alt='economic logo'
                        width={150}
                        height={33}
                      />
                    </Flex>
                  </Flex>
                </HighlightsItem>
                <HighlightsItem title="One Click Setup">
                  <Text color="muted" fontSize="lg">
                    Integrate Billpilot and E-conomic with a simple one click login process. Sync afterwards to start Invoicing.
                  </Text>
                </HighlightsItem>
              </Highlights>


              <Highlights p='0'>

              </Highlights>



            </Stack>

          </Stack>
          {/* </Center> */}

        </Container>
      </Box >
    </Box >
  )
}

export default EconomicPage