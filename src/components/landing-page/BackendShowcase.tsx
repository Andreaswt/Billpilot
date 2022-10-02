import { chakra, Center, Flex, Text, Box, useColorMode, SimpleGrid, Stack, VStack, Container } from '@chakra-ui/react'
import { Section, SectionProps } from '@saas-ui/pro'
import { Form, Field, FormLayout, SubmitButton } from '@saas-ui/react'
import { SectionTitle } from './section/section-title'
import Image from 'next/image'

interface IProps {
    sectionId: string
}

export const BackendShowcase: React.FC<IProps> = (props) => {
    const { sectionId } = props
    const { toggleColorMode, colorMode } = useColorMode()
    return (
        <Center>
            <Section itemID={sectionId} maxWidth="container.xl" py={{ base: '120', md: '50', sm: '50' }} px="5" id="backendshowcase">
                <Center>
                    <Stack direction="row" height="full" align="flex-start">
                        <VStack flex="1" spacing={[4, null, 8]} alignItems="stretch">
                            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing='10'>
                                <Box >
                                    <Flex flexDirection={'column'}>
                                        <Image
                                            src="static/screenshots/list.png"
                                            alt='invoice by project'
                                            width={600}
                                            height={381}
                                        />
                                        <Text px='10'>
                                            Invoice by project
                                        </Text>
                                    </Flex>
                                </Box>
                                <Box >
                                    <Flex flexDirection={'column'}>
                                        <Image
                                            src="static/screenshots/list.png"
                                            alt='invoice by project'
                                            width={600}
                                            height={381}
                                        />
                                        <Text px='10'>
                                            Invoice by issue
                                        </Text>
                                    </Flex>
                                </Box>
                                <Box>
                                    <Flex flexDirection={'column'}>
                                        <Image
                                            src="static/screenshots/list.png"
                                            alt='invoice by project'
                                            width={600}
                                            height={381}
                                        />
                                        <Text px='10'>
                                            Label invoices
                                        </Text>
                                    </Flex>
                                </Box>
                                <Box>
                                    <Flex flexDirection={'column'}>
                                        <Image
                                            src="static/screenshots/list.png"
                                            alt='invoice by project'
                                            width={600}
                                            height={381}
                                        />
                                        <Text px='10'>
                                            Keep track of invoices
                                        </Text>
                                    </Flex>
                                </Box>
                            </SimpleGrid>

                        </VStack>


                    </Stack>
                </Center>
            </Section>
        </Center>
    )
}
