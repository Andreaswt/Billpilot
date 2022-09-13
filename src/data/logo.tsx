import { chakra, HTMLChakraProps, useColorModeValue } from '@chakra-ui/react'
import Image from 'next/image'
import { useColorMode } from '@chakra-ui/react'

export const Logo: React.FC<HTMLChakraProps<'svg'>> = (props) => {
  const color = useColorModeValue('#231f20', '#fff')
  const { toggleColorMode, colorMode } = useColorMode()
  return (
    <img
    style={colorMode === 'dark' ? { filter: 'brightness(0) invert(75%)'} : {}}
      src="/static/images/billpilotlogo.svg"
      width={30}
      height={30}
    />
  )
}
