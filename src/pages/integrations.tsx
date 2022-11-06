import { Box, Center, Container, Heading, Wrap, WrapItem, Stack, Text, useColorMode, SimpleGrid, GridItem, chakra, Grid, Flex, Link, Icon } from '@chakra-ui/react'
import { Card } from '@saas-ui/card';
import { CardBody } from '@saas-ui/react'
import { NextPage } from 'next'
import { ReactElement } from 'react';
import Image from 'next/image'
import { FiArrowRightCircle } from 'react-icons/fi';
import { BackgroundGradient } from '../components/landing-page/gradients/background-gradient'
import { SEO } from '../components/landing-page/seo/seo'
import { IoIosArrowForward } from 'react-icons/io';
import NextLink from 'next/link'


interface FeatureProps {
  title: string
  text: string
  link: string
  svg: React.ReactNode
}

// const { toggleColorMode, colorMode } = useColorMode()

const Feature: React.FunctionComponent<FeatureProps> = (props) => {
  return (
    <GridItem>
      <Card borderRadius="8px" boxShadow='md' height='100%'>
        <Link>
          <NextLink passHref href={props.link}>
            <CardBody>
              <Stack>
                <Flex
                  align={'center'}
                  justify={'center'}
                  color={'white'}
                  rounded={'full'}
                  bg={'gray.100'}
                  mb={1}
                >
                </Flex>

                {props.svg}

                <Text fontWeight={600}>{props.title}</Text>
                <Text>{props.text}</Text>

                <Icon as={IoIosArrowForward} w={7} h={7} />

              </Stack>
            </CardBody>
          </NextLink>
        </Link>
      </Card>
    </GridItem>
  );
};

const JiraPage: NextPage = () => {

  return (
    <Box>
      <SEO
        title="Integrations"
        description="Import hour logs from your project
        mangement software, create customizable invoices,
        and send them to your accounting app in minutes."
      />
      <Box position="relative" overflow="hidden">
        <Container maxW="container.xl" pt={{ base: 20, lg: 40 }} pb={{ md: 0 }}>

          <Stack
            flex="1"
            alignItems="center"
            direction="column"
            spacing="8"

          >
            <Heading size="lg">Popular Billpilot Integrations</Heading>

            <Center>

              <Grid
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                }}
                gap={{ base: '4', sm: '6', md: '8' }}>
                <Feature
                  svg={<svg height={'50px'} width={'50px'}><path d="m47.438 25.702-20.711 20.71-2.007 2.007L9.13 32.83 2 25.702a1.91 1.91 0 0 1 0-2.695L16.245 8.764 24.72.29l15.588 15.59.243.241 6.886 6.876a1.907 1.907 0 0 1 0 2.705zM24.72 17.238l-7.116 7.117 7.116 7.116 7.114-7.116-7.114-7.117z" fill="#2684FF"></path></svg>}
                  title={'Jira'}
                  text={'Sync issues and projects to integrate with your accounting app in perfect harmony'}
                  link={"/jira"}

                />
                <Feature
                  svg={<svg height="50px" viewBox="6.20856283 .64498824 244.26943717 251.24701176" width="50px" xmlns="http://www.w3.org/2000/svg"><path d="m191.385 85.694v-29.506a22.722 22.722 0 0 0 13.101-20.48v-.677c0-12.549-10.173-22.722-22.721-22.722h-.678c-12.549 0-22.722 10.173-22.722 22.722v.677a22.722 22.722 0 0 0 13.101 20.48v29.506a64.342 64.342 0 0 0 -30.594 13.47l-80.922-63.03c.577-2.083.878-4.225.912-6.375a25.6 25.6 0 1 0 -25.633 25.55 25.323 25.323 0 0 0 12.607-3.43l79.685 62.007c-14.65 22.131-14.258 50.974.987 72.7l-24.236 24.243c-1.96-.626-4-.959-6.057-.987-11.607.01-21.01 9.423-21.007 21.03.003 11.606 9.412 21.014 21.018 21.017 11.607.003 21.02-9.4 21.03-21.007a20.747 20.747 0 0 0 -.988-6.056l23.976-23.985c21.423 16.492 50.846 17.913 73.759 3.562 22.912-14.352 34.475-41.446 28.985-67.918-5.49-26.473-26.873-46.734-53.603-50.792m-9.938 97.044a33.17 33.17 0 1 1 0-66.316c17.85.625 32 15.272 32.01 33.134.008 17.86-14.127 32.522-31.977 33.165" fill="#ff7a59" /></svg>}
                  title={'Hubspot'}
                  text={'If you use Hubspot to track time, integrate and speed up your workflow'}
                  link={"/hubspot"}
                />
                <Feature
                  svg={<svg height={'50px'} width={'50px'}><path fillRule="evenodd" clipRule="evenodd" d="M19.045 10c9.08.89 19.04 5.482 24.752 12.15 7.322 8.445 4.833 16.891-5.566 18.816-10.399 2.075-24.752-3.258-32.075-11.705C.59 22.741.737 16.223 5.863 12.667L34.715 34.3 19.045 10z" fill="#C92043"></path></svg>}
                  title={'E-Conomic'}
                  text={'Export invoices from Billpilot into E-conomic automating your agencies billing process'}
                  link={"/economic"}
                />
                <Feature
                  svg={<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25 48c12.703 0 23-10.297 23-23S37.703 2 25 2 2 12.297 2 25s10.297 23 23 23z" fill="#1AB4D7"></path><path d="m13.01 24.933 3.925-3.935a.703.703 0 0 0-1-.988l-3.922 3.92-3.94-3.926a.703.703 0 1 0-.988 1l3.924 3.923-3.922 3.93a.701.701 0 0 0 .49 1.207.697.697 0 0 0 .496-.206l3.934-3.927 3.918 3.913a.702.702 0 1 0 1.008-.979l-3.923-3.932zm23.335-.002a1.28 1.28 0 0 0 1.278 1.278 1.28 1.28 0 0 0 0-2.556 1.28 1.28 0 0 0-1.278 1.278z" fill="#fff"></path><path d="M33.92 24.933a3.706 3.706 0 0 1 3.702-3.701c2.04 0 3.7 1.66 3.7 3.701 0 2.04-1.66 3.7-3.7 3.7a3.705 3.705 0 0 1-3.701-3.7zm-1.455 0a5.163 5.163 0 0 0 5.157 5.157 5.164 5.164 0 0 0 5.158-5.157 5.164 5.164 0 0 0-5.158-5.157 5.163 5.163 0 0 0-5.157 5.157zm-.366-5.069h-.217c-.65 0-1.276.204-1.799.608a.705.705 0 0 0-.687-.553.695.695 0 0 0-.697.697l.002 8.686a.704.704 0 0 0 1.407-.001v-5.34c0-1.78.163-2.5 1.687-2.69.141-.018.295-.015.295-.015.417-.014.714-.301.714-.689a.705.705 0 0 0-.705-.703zm-13.504 4.219.003-.06a3.726 3.726 0 0 1 7.235.06h-7.238zm8.678-.133c-.303-1.435-1.088-2.613-2.284-3.37a5.198 5.198 0 0 0-5.747.152 5.216 5.216 0 0 0-2.173 4.235c0 .414.05.832.154 1.244a5.198 5.198 0 0 0 4.377 3.852 4.922 4.922 0 0 0 1.855-.123 5.098 5.098 0 0 0 1.542-.658c.498-.32.915-.744 1.319-1.25l.024-.027c.28-.348.229-.842-.08-1.078-.259-.199-.695-.28-1.038.16a4.75 4.75 0 0 1-.246.321 4.035 4.035 0 0 1-1.017.82 3.7 3.7 0 0 1-1.728.436c-2.046-.022-3.14-1.45-3.53-2.47a3.706 3.706 0 0 1-.157-.59 1.364 1.364 0 0 1-.01-.109l7.341-.001c1.006-.021 1.548-.732 1.398-1.544z" fill="#fff"></path></svg>}
                  title={'Xero'}
                  text={'Streamline your teams processes by automatically creating invoices from Billpilot'}
                  link={"/xero"}
                />
                <Feature
                  svg={<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#29289fba-7bb6-4bb3-b131-193fc2a58d91)"><path d="M24.589 48.339h1.187c.065-.014.13-.035.196-.04.72-.064 1.44-.114 2.158-.19a19.098 19.098 0 0 0 2.672-.499 23.004 23.004 0 0 0 7.881-3.654 22.93 22.93 0 0 0 6.916-7.89 22.948 22.948 0 0 0 2.71-9.79 22.663 22.663 0 0 0-.222-4.527 23.251 23.251 0 0 0-.905-3.815 22.86 22.86 0 0 0-4.283-7.689c-2.953-3.493-6.624-5.908-10.996-7.255a21.214 21.214 0 0 0-4.143-.85c-.572-.056-1.144-.118-1.717-.132-.71-.018-1.421.003-2.131.024-.735.021-1.465.11-2.191.218a22.603 22.603 0 0 0-3.282.74 23.01 23.01 0 0 0-6.014 2.823 23.031 23.031 0 0 0-6.527 6.494 22.895 22.895 0 0 0-3.24 7.411c-.364 1.511-.596 3.04-.616 4.599-.002.146-.027.292-.042.439v.778c.011.073.029.144.031.217.01.284.006.568.025.851.071 1.08.212 2.15.43 3.209a22.925 22.925 0 0 0 2.851 7.292 23.016 23.016 0 0 0 8.114 8.017 22.83 22.83 0 0 0 5.647 2.373 20.05 20.05 0 0 0 2.88.584c.612.073 1.227.124 1.84.182.21.02.42.027.629.044.048.004.094.024.142.036zm1.876-7.992c-.044-.226-.035-24.068.01-24.221.066-.004.138-.012.21-.012 2.053-.001 4.105-.003 6.158 0 .7.001 1.393.072 2.075.23a8.944 8.944 0 0 1 3.974 2.052c2.389 2.127 3.53 5.295 2.861 8.536-.593 2.877-2.237 4.986-4.858 6.321-1.19.607-2.468.888-3.8.925-.426.012-.853.002-1.28.001-.065 0-.131-.007-.192-.011-.049-.199-.042-3.22.01-3.377.067 0 .14.002.212 0 .556-.01 1.112-.007 1.667-.037.572-.032 1.12-.192 1.642-.422 2.345-1.029 3.677-3.419 3.341-5.958a5.441 5.441 0 0 0-1.575-3.2c-1.093-1.099-2.429-1.648-3.976-1.67-.976-.015-1.953-.004-2.93-.003-.059 0-.118.006-.186.01v4.118c0 4.418 0 8.837-.002 13.256 0 .227-.004.46-.049.682-.278 1.379-1.1 2.273-2.445 2.68a2.603 2.603 0 0 1-.867.1zm-2.59-30.391c.01.026.02.043.02.06.003 7.99.004 15.98.004 23.971 0 .049-.008.098-.013.146 0 .006-.006.011-.01.015a.259.259 0 0 1-.037.031h-.233c-2.034 0-4.067.005-6.1-.003a10.238 10.238 0 0 1-1.239-.077 9.015 9.015 0 0 1-7.817-8.093 8.473 8.473 0 0 1 .197-2.853c.72-2.93 2.46-5.028 5.204-6.285a8.12 8.12 0 0 1 2.802-.712c.646-.047 1.297-.031 1.946-.042.041 0 .083.011.12.017.049.183.046 3.192-.006 3.369h-.195c-.352 0-.705-.009-1.057.003a7.85 7.85 0 0 0-.867.067 5.347 5.347 0 0 0-2.935 1.386c-1.443 1.339-2.047 3.008-1.804 4.95.209 1.662 1.047 2.975 2.432 3.925a5.303 5.303 0 0 0 2.9.952c1.05.028 2.1.007 3.151.007.053 0 .106-.009.177-.015v-1.517c0-5.24 0-10.48.004-15.72 0-.313.011-.636.083-.938.334-1.41 1.227-2.272 2.634-2.602a1.76 1.76 0 0 1 .64-.042z" fill="#24A205"></path></g><defs><clipPath id="29289fba-7bb6-4bb3-b131-193fc2a58d91"><path fill="#fff" transform="matrix(-1 0 0 1 48.338 2)" d="M0 0h46.338v46.338H0z"></path></clipPath></defs></svg>}
                  title={'Quickbooks'}
                  text={'Coming Soon'}
                  link={"/integrations"}
                />

                <Feature
                  svg={<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="781.361 0 944.893 873.377"><radialGradient id="a" cx="943.992" cy="1221.416" r=".663" gradientTransform="matrix(944.8934 0 0 -873.3772 -890717.875 1067234.75)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#ffb900"/><stop offset=".6" stopColor="#f95d8f"/><stop offset=".999" stopColor="#f95353"/></radialGradient><path fill="url(#a)" d="M1520.766 462.371c-113.508 0-205.508 92-205.508 205.488 0 113.499 92 205.518 205.508 205.518 113.489 0 205.488-92.019 205.488-205.518 0-113.488-91.999-205.488-205.488-205.488zm-533.907.01c-113.489.01-205.498 91.99-205.498 205.488 0 113.489 92.009 205.498 205.498 205.498 113.498 0 205.508-92.009 205.508-205.498 0-113.499-92.01-205.488-205.518-205.488h.01zm472.447-256.883c0 113.489-91.999 205.518-205.488 205.518-113.508 0-205.508-92.029-205.508-205.518S1140.31 0 1253.817 0c113.489 0 205.479 92.009 205.479 205.498h.01z"/></svg>}
                  title={'Asana'}
                  text={'Coming Soon'}
                  link={"/integrations"}
                />
              </Grid>
              
            </Center>

          </Stack>

        </Container>
      </Box >
    </Box >
  )
}

export default JiraPage