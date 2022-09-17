import { chakra, Center, Flex, Text, Box, useColorMode, SimpleGrid, Stack, VStack, Container } from '@chakra-ui/react'
import { Section, SectionProps } from '@saas-ui/pro'
import { Form, Field, FormLayout, SubmitButton, Divider } from '@saas-ui/react'
import { SectionTitle } from './section/section-title'
import { Em } from './typography'


export const BeforeBillpilot: React.FC = (props) => {
    const { toggleColorMode, colorMode } = useColorMode()
    return (
        <Center id="backendshowcase" py={{ base: '50', md: '50', sm: '50' }}>
            <Flex maxWidth="container.xl" flexDirection = {{md: 'row', base: 'column'}} py={{ base: '0', md: '0', sm: '0'}} px={{ base: 10, lg: 8 }} id="backendshowcase" w="100%" justifyContent="space-evenly">
                    <Flex px={{md: '20', base: '10'}} justifyContent="start" w={{ base: "100%", md: '50%'}}>
                        <SectionTitle
                            title={'Before Billpilot'}
                            description={<><Em>Manually</Em> create every invoice. Copy-paste time from project management software into the invoice format. <Em>Manually export time reports </Em>and attach them to the invoice. </>}
                            align={'left'}
                        />
                    </Flex>
                    <Flex borderLeft={{md: '1px', base: '0px'}} borderTop={{md: '0px', base: '1px'}} py={{ base: "30pt", md: '0pt'}}  px={{md: '20', base: '10'}} w={{ base: "100%", md: '50%'}} justifyContent="end">
                        <SectionTitle
                            title={'With Billpilot'}
                            description={<><Em>Instantly</Em> create invoiced based on worklogs. Time and cost <Em>reports</Em> are <Em>automatically attached to invoices</Em>. <Em>Track</Em> your <Em>uninvoiced hours</Em> effortlessly.</>}
                            align={'left'}
                        />
                    </Flex>
            </Flex>
        </Center>
    )
}
