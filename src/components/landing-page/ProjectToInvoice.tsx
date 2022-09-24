import { chakra, Center, Divider, Flex, Text, Box, useColorMode, SimpleGrid, Stack, VStack, Container, } from '@chakra-ui/react'
import { Section, SectionProps,} from '@saas-ui/pro'
import { Card, CardBody, Stepper, StepperStep} from '@saas-ui/react'
import React from 'react';
import { Form, Field, FormLayout, SubmitButton } from '@saas-ui/react'
import { SectionTitle } from './section/section-title'
import ConfirmInvoiceIssues from '../../components/landing-page/ikea/Confirm';
import EconomicOptions from '../../components/landing-page/ikea/InvoiceOptions';
import Projects from '../../components/landing-page/ikea/Projects';
import Issues from '../../components/landing-page/ikea/Issues';


export const ProjectToInvoice: React.FC = (props) => {
    const { toggleColorMode, colorMode } = useColorMode()
    const [step, setStep] = React.useState(0);

    return (
        <Center>
            <Section  maxWidth="container.xl" py={{ base: '120', md: '50', sm: '50' }} px="5" id="projecttoinvoice" >
                <SectionTitle title="Try it out!" description="Instead of telling you about it, we'd rather show you"></SectionTitle>
                    <Stack  direction="row" height="full" align="flex-start" >
                        <VStack  flex="1" spacing={[4, null, 8]} alignItems="stretch" >
                            <SimpleGrid columns={1} spacing='10'>
                                        <Card>
                                            <CardBody>
                                                <Stepper step={step}>
                                                    <StepperStep title="Pick Project" />
                                                    <StepperStep title="Pick Issues" />
                                                    <StepperStep title="Invoice Information" />
                                                    <StepperStep title="Confirm" />
                                                </Stepper>
                                            </CardBody>
                                        </Card>
                                        {step == 0 ? <Projects setStep={setStep} /> : null}
                                        {step == 1 ? <Issues setStep={setStep} /> : null}
                                        {step == 2 ? <EconomicOptions setStep={setStep} /> : null}
                                        {step == 3 ? <ConfirmInvoiceIssues setStep={setStep} /> : null}

                            </SimpleGrid>

                        </VStack>


                    </Stack>
           
            </Section>
        </Center>
    )
}
