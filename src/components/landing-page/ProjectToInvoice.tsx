import { chakra, Center, Divider, Flex, Text, Box, useColorMode, SimpleGrid, Stack, VStack, Container } from '@chakra-ui/react'
import { Section, SectionProps } from '@saas-ui/pro'
import { Form, Field, FormLayout, SubmitButton } from '@saas-ui/react'
import { SectionTitle } from './section/section-title'



export const ProjectToInvoice: React.FC = (props) => {
    const { toggleColorMode, colorMode } = useColorMode()
    return (
        <Center>
            <Section  maxWidth="container.xl" py={{ base: '120', md: '50', sm: '50' }} px="5" id="projecttoinvoice" >
                    <Stack  direction="row" height="full" align="flex-start" >
                        <VStack  flex="1" spacing={[4, null, 8]} alignItems="stretch" >
                            <SimpleGrid columns={1} spacing='10'>
                                <Box >
                                    <Flex flexDirection={'column'}>
                                        <picture>
                                            {/* eslint-disable @next/next/no-img-element */}
                                            <img
                                                src="static/screenshots/list.png"
                                                alt='xero logo'
                                            />
                                        </picture>
                                        <Text px='10' width = '100%'>
                                            Bruh
                                        </Text>
                                    </Flex>
                                </Box>
                                <Box >
                                    <Flex flexDirection={'column'}>
                                        <picture>
                                            {/* eslint-disable @next/next/no-img-element */}
                                            <img
                                                src="static/screenshots/list.png"
                                                alt='xero logo'
                                            />
                                        </picture>
                                        <Text px='10'>
                                            Bruh
                                        </Text>
                                    </Flex>
                                </Box>
                                <Box>
                                    <Flex flexDirection={'column'}>
                                        <picture>
                                            {/* eslint-disable @next/next/no-img-element */}
                                            <img
                                                src="static/screenshots/list.png"
                                                alt='xero logo'
                                            />
                                        </picture>
                                        <Text px='10'>
                                            Bruh
                                        </Text>
                                    </Flex>
                                </Box>
                            </SimpleGrid>

                        </VStack>


                    </Stack>
           
            </Section>
        </Center>
    )
}
