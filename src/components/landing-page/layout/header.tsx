import * as React from 'react'

import {
  Box,
  BoxProps,
  Container,
  Flex,
  Heading,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import Navigation from './navigation'
import { Logo } from './logo'
import { useViewportScroll } from 'framer-motion'
import NextLink from 'next/link'

export interface HeaderProps extends Omit<BoxProps, 'children'> { }

export const Header = (props: HeaderProps) => {
  const ref = React.useRef<HTMLHeadingElement>(null)
  const [y, setY] = React.useState(0)
  const { height = 0 } = ref.current?.getBoundingClientRect() ?? {}

  const { scrollY } = useViewportScroll()
  React.useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()))
  }, [scrollY])

  const bg = useColorModeValue('whiteAlpha.700', 'rgba(29, 32, 37, 0.7)')
  const { toggleColorMode, colorMode } = useColorMode()
  return (
    <Box
      ref={ref}
      as="header"
      top="0"
      w="full"
      position="fixed"
      backdropFilter="blur(40px)"
      zIndex="sticky"
      borderColor="whiteAlpha.100"
      transitionProperty="common"
      transitionDuration="normal"
      bg={y > height ? bg : ''}
      boxShadow={y > height ? 'md' : ''}
      borderBottomWidth={y > height ? '1px' : ''}
      {...props}
    >
      <Container maxW="container.2xl" px="8" py="4">
        <Flex width="full" align="center" justify="space-between">
          <Logo
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault()

                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }
            }}
          />
          {/* style = {colorMode === 'dark' ? {color = '#2479DB'} : {color = '#FFFFFF'} */}
          <NextLink passHref href='/'>
            <Text letterSpacing='2px' textColor={colorMode === 'dark' ? '#FFFFFF' : '#2479DB'} as='em'>
              Billpilot
            </Text>
          </NextLink>
          <Navigation />
        </Flex>
      </Container>
    </Box>
  )
}
