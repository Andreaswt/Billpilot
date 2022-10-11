import { chakra, Center, Flex, Text, Box, useColorMode, SimpleGrid, Stack, VStack, Container } from '@chakra-ui/react'
import { Section, SectionProps } from '@saas-ui/pro'
import { Form, Field, FormLayout, SubmitButton } from '@saas-ui/react'
import { SectionTitle } from './section/section-title'
import Image from 'next/image'
import Link from 'next/link'

interface IProps {
  sectionId: string
}

export const Slack: React.FC<IProps> = (props) => {
  const { sectionId } = props
  const { toggleColorMode, colorMode } = useColorMode()

  return (
    <Section id={sectionId} py={{ base: '20', md: '30' }}>
      <Center>
        <Text>
          Join our journey on
        </Text>
        <Box mx={{ base: '0', lg: '1rem' }} my={{ base: '1rem', lg: '0' }}>
          <Link passHref href="https://join.slack.com/t/billpilot/shared_invite/zt-1g7ywroqp-1WX7hk8Wq6fYrXzAdY6AtA">
            <a>
              <Image
                src="static/images/slack.png"
                style={colorMode === 'dark' ? { filter: 'brightness(0) invert(1)', maxWidth: '150px' } : { filter: 'brightness(0)', maxWidth: '150px' }}
                alt='slack logo'
                width={150}
                height={61}
              />
            </a>
          </Link>
        </Box>
      </Center>
    </Section>
  )
}
