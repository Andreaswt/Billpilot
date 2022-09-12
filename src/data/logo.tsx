import { chakra, HTMLChakraProps, useColorModeValue } from '@chakra-ui/react'
import Image from 'next/image'

export const Logo: React.FC<HTMLChakraProps<'svg'>> = (props) => {
  const color = useColorModeValue('#231f20', '#fff')
  return (
    <Image
      src="/static/images/avatar3.jpg"
      alt="Picture of the author"
      width={30}
      height={30}
    />
  )
}
