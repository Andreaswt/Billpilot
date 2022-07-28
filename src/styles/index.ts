import { extendTheme } from '@chakra-ui/react'
import { theme } from '@saas-ui/pro'

import components from './components'
import { fontSizes } from './foundations/typography'

const styles = {
  global: (props: any) => ({
    body: {
      color: 'gray.900',
      bg: 'white',
      fontSize: 'lg',
      _dark: {
        color: 'white',
        bg: 'gray.900',
      },
    },
  }),
}

const landingPageTheme = extendTheme(
  {
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false,
    },
    styles,
    fontSizes,
    components,
  },
  theme
)

export default landingPageTheme;