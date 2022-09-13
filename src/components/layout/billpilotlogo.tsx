import { useColorMode } from '@chakra-ui/react'
import Image from 'next/image'



export const BillPilotLogo = () => {
  const { toggleColorMode, colorMode } = useColorMode()
  return (
    <img
      style={colorMode === 'dark' ? { filter: 'brightness(0) invert(75%)'} : { filter: 'brightness(0)'}}
      src="../../../public/static/images/billpilotlogo.svg"
    />
  )
}