import {
    Box,
    Center,
    Flex,
    Heading,
    HStack,
    Icon,
    SimpleGrid,
    Container,
    StackProps,
    Text,
    useColorMode,
    VStack,
    Button,
    Spinner,
    StackDivider,
    ButtonGroup,
} from '@chakra-ui/react'
import { ButtonLink, ButtonLinkProps } from './button-link/button-link'
import { BackgroundGradient } from './gradients/background-gradient'
import { Section, SectionProps } from '@saas-ui/pro'
import { SectionTitle } from './section/section-title'
import React from 'react'
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi'
import { Em } from './typography'
import { Card, CardBody } from '@saas-ui/react'
import router from 'next/router'
import { trpc } from '../../utils/trpc'

// enum ProjectManagementIntegration {
//     JIRA,
//     ASANA
// }

// enum AccountingIntegration {
//     ECONOMIC,
//     XERO,
//     QUICKBOOKS
// }

export const Demo: React.FC = (props) => {
    const { toggleColorMode, colorMode } = useColorMode()
    const { data, isLoading, isRefetching, refetch } = trpc.useQuery(["integrations.getActiveIntegrations"], {
        refetchOnWindowFocus: false

    })

    const { mutateAsync } = trpc.useMutation(["integrations.signout"], {
        onSuccess: () => {
            refetch()
        }
    });

    return (

        <Container height="full" px='10' py={{ base: '50', md: '50', sm: '50' }} id="demo" pos="relative" maxW='1700'>

            {/* <Box zIndex="2" pos="relative" w='100%' px='0'> */}
            <SectionTitle title="Try it out!" description="Instead of telling you about it, we'd rather show you"></SectionTitle>

            <SimpleGrid columns={[1, null, 3]} spacing={0} px='0'>
                <VStack
                    p="2"
                    flex="1 0"
                    alignItems="stretch"
                    height="800"

                >
                    <Heading as="h3" size="md" fontWeight="bold" fontSize="lg" mb="2">
                        Project Management Software
                    </Heading>
                    <VStack zIndex="2"
                        bg="whiteAlpha.600"
                        borderRadius="md"
                        p="1"
                        flex="1 0"
                        alignItems="stretch"
                        border="1px solid"
                        borderColor='primary.500'
                        height="600"
                        _dark={{
                            bg: 'blackAlpha.300',
                            borderColor: 'primary.500',
                        }}>
                        <Card title={
                            <Flex>
                                <Heading>Project Management Integrations</Heading>
                            </Flex>}>
                            <CardBody justifyContent='right'>
                                <VStack divider={<StackDivider />} align="stretch" spacing={8} pb="0">
                                    <Section
                                        title="Jira"
                                        description="Connect to Jira by clicking the button and logging in."
                                        variant="annotated">
                                        <Card w='48'>
                                            <CardBody >
                                                {
                                                    (5 == 4)
                                                        ?
                                                        <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                            <Text as="i">Your account is integrated with Jira.</Text>
                                                            <Button onClick={() => mutateAsync({ provider: "JIRA" })} colorScheme="red">
                                                                Log out of Jira
                                                            </Button>
                                                        </Flex>
                                                        : <Flex justifyContent="center">
                                                            <Button onClick={() => router.push("/hejsa")} colorScheme="primary">
                                                                Log in with Jira
                                                            </Button>
                                                        </Flex>
                                                }
                                            </CardBody>
                                        </Card>
                                    </Section>
                                    <Section
                                        title="Asana"
                                        description="Connect to Asana by clicking the button and logging in."
                                        variant="annotated">
                                        <Card w='48'>
                                            <CardBody>
                                                {
                                                    (5 == 4)
                                                        ?
                                                        <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                            <Text fontSize="sm" as="i">Your account is integrated with Asana.</Text>
                                                            <Button onClick={() => mutateAsync({ provider: "ASANA" })} colorScheme="red">
                                                                Log out of Asana
                                                            </Button>
                                                        </Flex>
                                                        : <Flex justifyContent="center">
                                                            <Button onClick={() => router.push("/hejsa")} colorScheme="primary">
                                                                Log in with Asana
                                                            </Button>
                                                        </Flex>
                                                }
                                            </CardBody>
                                        </Card>
                                    </Section>
                                </VStack>
                            </CardBody>
                        </Card>
                    </VStack>
                </VStack>
                <VStack
                    p="2"
                    flex="1 0"
                    alignItems="stretch"
                    height="800"

                >
                    <Heading as="h3" size="md" fontWeight="bold" fontSize="lg" mb="2">
                        Billpilot
                    </Heading>
                    <VStack zIndex="2"
                        bg="whiteAlpha.600"
                        borderRadius="md"
                        boxShadow="3"
                        p="1"
                        flex="1 0"
                        alignItems="stretch"
                        border="1px solid"
                        borderColor='primary.500'
                        height="600"
                        _dark={{
                            bg: 'blackAlpha.300',
                            borderColor: 'primary.500',
                        }}>
                        <Card title={
                            <Flex>
                                <Heading>Title</Heading>
                            </Flex>}>
                            <CardBody>

                            </CardBody>
                        </Card>
                    </VStack>
                </VStack>

                <VStack
                    p="2"
                    flex="1 0"
                    alignItems="stretch"
                    height="800"

                >
                    <Heading as="h3" size="md" fontWeight="bold" fontSize="lg" mb="2">
                        Accounting Software
                    </Heading>
                    <VStack zIndex="2"
                        bg="whiteAlpha.600"
                        borderRadius="md"
                        p="1"
                        flex="1 0"
                        alignItems="stretch"
                        border="1px solid"
                        borderColor='primary.500'
                        height="600"
                        _dark={{
                            bg: 'blackAlpha.300',
                            borderColor: 'primary.500',
                        }}>
                        <Card title={
                            <Flex>
                                <Heading>Accounting Integrations</Heading>
                            </Flex>}>
                            <CardBody>
                                <VStack divider={<StackDivider />} align="stretch" spacing={8} pb="0">
                                    <Section
                                        title="E-conomic"
                                        description="Connect to E-conomic by clicking the button and logging in."
                                        variant="annotated">
                                        <Card w='48'>
                                            <CardBody >
                                                {
                                                    (5 == 4)
                                                        ?
                                                        <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                            <Text fontSize="sm" as="i">Your account is integrated with E-conomic.</Text>
                                                            <Button onClick={() => mutateAsync({ provider: "ECONOMIC" })} colorScheme="red">
                                                                Log out of E-conomic
                                                            </Button>
                                                        </Flex>
                                                        : <Flex justifyContent="center">
                                                            <Button onClick={() => router.push("/api/economic/redirect")} colorScheme="primary">
                                                                Log in with E-conomic
                                                            </Button>
                                                        </Flex>
                                                }
                                            </CardBody>
                                        </Card>
                                    </Section>
                                    <Section
                                        title="Xero"
                                        variant="annotated"
                                        description="Connect to Xero by clicking the button and logging in.">
                                        <Card w='48'>
                                            <CardBody>
                                                {
                                                    (5 == 4)
                                                        ?
                                                        <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                            <Text fontSize="sm" as="i"> Your account is integrated with Xero.</Text>
                                                            <Button onClick={() => mutateAsync({ provider: "XERO" })} colorScheme="red">
                                                                Log out of Xero
                                                            </Button>
                                                        </Flex>
                                                        : <Flex justifyContent="center">
                                                            <Button onClick={() => router.push("/hejsa")} colorScheme="primary">
                                                                Log in with Xero
                                                            </Button>
                                                        </Flex>
                                                }
                                            </CardBody>
                                        </Card>
                                    </Section>
                                    <Section
                                        title="Quickbooks"
                                        description="Connect to Quickbooks by clicking the button and logging in."
                                        variant="annotated">
                                        <Card w='48'>
                                            <CardBody>
                                                {
                                                    (5 == 4) ?
                                                        <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                            <Text fontSize="sm" as="i">Your account is integrated with Quickbooks.</Text>
                                                            <Button onClick={() => mutateAsync({ provider: "QUICKBOOKS" })} colorScheme="red">
                                                                Log out of Quickbooks
                                                            </Button>
                                                        </Flex>
                                                        : <Flex justifyContent="center">
                                                            <Button onClick={() => router.push("/hejsa")} colorScheme="primary">
                                                                Log in with Quickbooks
                                                            </Button>
                                                        </Flex>
                                                }
                                            </CardBody>
                                        </Card>
                                    </Section>
                                </VStack>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <ButtonGroup  >
                                    <Flex justifyContent="center" gap='5'>
                                        <ButtonLink
                                            size="lg"
                                            href="https://demo.saas-ui.dev"
                                            variant="outline"
                                            justifyContent='center'
                                            rightIcon={
                                                <Icon
                                                    as={FiArrowLeft}
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
                                        </ButtonLink>
                                        <ButtonLink
                                            size="lg"
                                            href="https://demo.saas-ui.dev"
                                            variant="outline"
                                            justifyContent='center'
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
                                        </ButtonLink>
                                    </Flex>
                                </ButtonGroup>
                            </CardBody>
                        </Card>
                    </VStack>
                </VStack>

            </SimpleGrid>

            {/* </Box> */}
        </Container>
    )
}
function mutateAsync(arg0: { provider: string }): void {
    throw new Error('Function not implemented.')
}

