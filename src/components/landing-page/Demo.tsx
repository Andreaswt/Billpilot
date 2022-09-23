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
} from '@chakra-ui/react'
import { ButtonLink, ButtonLinkProps } from './button-link/button-link'
import { BackgroundGradient } from './gradients/background-gradient'
import { Section, SectionProps } from './section/section'
import { SectionTitle } from './section/section-title'
import React from 'react'
import { FiCheck } from 'react-icons/fi'
import { Em } from './typography'

export const Demo: React.FC = (props) => {
  const { toggleColorMode, colorMode } = useColorMode()
  return (
    
    <Container height="full" px='10' py={{ base: '50', md: '50', sm: '50' }} id="demo" pos="relative" maxW ='1700'>
      
      {/* <Box zIndex="2" pos="relative" w='100%' px='0'> */}
      <SectionTitle title="Try it out!" description="Instead of telling you about it, we'd rather show you"></SectionTitle>

      <SimpleGrid columns={[1, null, 3]} spacing={50} px='0'>
        <VStack
          zIndex="2"
          bg="whiteAlpha.600"
          borderRadius="md"
          p="8"
          flex="1 0"
          alignItems="stretch"
          border="1px solid"
          borderColor='primary.500'
          height="600"
          _dark={{
            bg: 'blackAlpha.300',
            borderColor: 'primary.500',
          }}

        >
          <Heading as="h3" size="md" fontWeight="bold" fontSize="lg" mb="2">
            Project Management Software
          </Heading>
        </VStack>
        <VStack
          zIndex="2"
          bg="whiteAlpha.600"
          borderRadius="md"
          p="8"
          flex="1 0"
          alignItems="stretch"
          border="1px solid"
          borderColor='primary.500'
          _dark={{
            bg: 'blackAlpha.300',
            borderColor: 'primary.500',
          }}
        >
          <Heading as="h3" size="md" fontWeight="bold" fontSize="lg" mb="2">
            Billpilot
          </Heading>
          
        </VStack>

        <VStack
          zIndex="2"
          bg="whiteAlpha.600"
          borderRadius="md"
          p="8"
          flex="1 0"
          alignItems="stretch"
          border="1px solid"
          borderColor='primary.500'
          _dark={{
            bg: 'blackAlpha.300',
            borderColor: 'primary.500',
          }}
        >
          <Heading as="h3" size="md" fontWeight="bold" fontSize="lg" mb="2">
            Accounting Software
          </Heading>
        </VStack>

      </SimpleGrid>

      {/* </Box> */}
    </Container>
  )
}
