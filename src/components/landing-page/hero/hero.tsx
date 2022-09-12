import { Container, Flex, FlexProps, Text, VStack } from '@chakra-ui/react'

interface HeroProps extends Omit<FlexProps, 'title'> {
  title1: string | React.ReactNode
  title2: string | React.ReactNode
  description?: string | React.ReactNode
}

export const Hero = ({ title1, title2, description, children, ...rest }: HeroProps) => {
  return (
    <Flex py="0" alignItems="center" {...rest}>
      <Container>
        <VStack spacing={[4, null, 8]} alignItems="left">
          <Flex flexDirection = 'column'>
            <Text as="h1" textStyle="h1" textAlign="center">
              {title1}
            </Text>
            <Text as="h1" textStyle="h1" textAlign="center">
              {title2}
            </Text>
          </Flex>
          <Text
            as="div"
            textStyle="subtitle"
            align="center"
            color="gray.500"
            _dark={{ color: 'gray.400' }}
          >
            {description}
          </Text>
        </VStack>
        {children}
      </Container>
    </Flex>
  )
}
