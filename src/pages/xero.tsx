import { Box, Center, Container, Flex, Heading, Link, List, ListIcon, ListItem, Stack, Tag, Text, useColorMode, VStack, Wrap } from '@chakra-ui/react'
import { ResizeBox } from '@saas-ui/pro'
import { Br, Card } from '@saas-ui/react'
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

const XeroPage: NextPage = () => {
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

          <Stack flex="1" direction="column">
            <Stack
              flex="1"
              alignItems="center"
              direction="column"
              spacing="8"
            >
              <Heading size="lg">Xero Integration</Heading>

              <Text>
                If you use {' '}
                <Link color='blue.500' href="https://www.xero.com/">
                  Xero
                </Link>
                {' '} connect it with Billpilot to
                How Billpilot integrates with Xero?
                We'll automatically sync all your clients in Billpilot, let you assign projects to these clients,
                issue invoices and export these invoices back to Xero
              </Text>

              <Highlights p='0'>

                <HighlightsItem colSpan={[1, null, 2]} title="Work Flow">
                  <Flex w='100%' justifyContent="center" gap={4} flexDir='row'  >
                    <Box width='26%'>
                      <Swiper
                        spaceBetween={30}
                        centeredSlides={true}
                        autoplay={{
                          delay: 2500,
                          disableOnInteraction: false,
                        }}
                        pagination={{
                          clickable: true,
                        }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                      >
                        <SwiperSlide>
                          <Box mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
                            <Image
                              src="static/images/integrationlogos/asana.png"
                              style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                              alt='asana logo'
                              width={150}
                              height={30}
                            />
                          </Box>
                        </SwiperSlide>
                        <SwiperSlide>
                          <Box mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
                            <Image
                              src="static/images/integrationlogos/hubspot.png"
                              style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                              alt='hubspot logo'
                              width={150}
                              height={40}
                            />
                          </Box>
                        </SwiperSlide>
                        <SwiperSlide>
                          <Box mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
                            <Image
                              src="static/images/integrationlogos/jira.png"
                              style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                              alt='jira logo'
                              width={150}
                              height={20}
                            />
                          </Box>
                        </SwiperSlide>
                      </Swiper>
                    </Box>
                    <Box >
                      <FiArrowRight size='' />
                    </Box>
                    <Box width='26%'>
                      <Flex flexDir='row' width="full" align='center'>
                        <Box as={siteConfig.logo} />
                        <Text letterSpacing='2px' fontSize='3xl' textColor={colorMode === 'dark' ? '#FFFFFF' : '#2479DB'} as='em'>
                          Billpilot
                        </Text>
                      </Flex>
                    </Box>
                    <Box>
                      <FiArrowRight size='' />
                    </Box>
                    <Box width='26%' align='center'>
                      <Image
                        src="static/images/integrationlogos/xero.png"
                        style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                        alt='xero logo'
                        width={150}
                        height={45}
                      />
                    </Box>
                  </Flex>
                </HighlightsItem>
                <HighlightsItem title="Seamless Setup">
                  <Text color="muted" fontSize="lg">
                    Integrate Billpilot with your project mangement and invocing software one click per integration.
                  </Text>
                </HighlightsItem>
              </Highlights>
              

              
              <HighlightsItem title="Xero Features">
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={IoCheckmarkCircle} color='primary.400' />
                    Sync Xero invoices and clients
                  </ListItem>
                  <ListItem>
                    <ListIcon as={IoCheckmarkCircle} color='primary.400' />
                    One click set up
                  </ListItem>
                  <ListItem>
                    <ListIcon as={IoCheckmarkCircle} color='primary.400' />
                    Quidem, ipsam illum qu
                  </ListItem>
                  {/* You can also use custom icons from react-icons */}
                  <ListItem>
                    <ListIcon as={IoCheckmarkCircle} color='primary.400' />
                    Quidem, ipsam illum quis se
                  </ListItem>
                </List>
              </HighlightsItem>
             

            </Stack>
          </Stack>
          {/* </Center> */}

        </Container>
      </Box >
    </Box >
  )
}

export default XeroPage