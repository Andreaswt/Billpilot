import { chakra, Center, Flex, Text, Box, useColorMode, SimpleGrid, Stack, VStack, Container } from '@chakra-ui/react'
import { Section, SectionProps } from '@saas-ui/pro'
import { Form, Field, FormLayout, SubmitButton } from '@saas-ui/react'
import { SectionTitle } from './section/section-title'


export const Slack: React.FC = (props) => {
    const { toggleColorMode, colorMode } = useColorMode()
    return (
            <Section>
                <Center>
                <Text>
                    Join our journey on
                </Text>
                <Box mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
                      <picture>
                        {/* eslint-disable @next/next/no-img-element */}
                        <a href="https://join.slack.com/t/billpilot/shared_invite/zt-1g7ywroqp-1WX7hk8Wq6fYrXzAdY6AtA">
                        <img
                          src="static/images/slack.png"
                          style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                          alt='slack logo'
                        />
                        </a>
                      </picture>
                    </Box>
                </Center>
            </Section>
    )
}
