import { extendTheme } from '@chakra-ui/react'
import { theme } from '@saas-ui/pro'
import Colors from './colors'

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
    colors: {
      primary: {
        400: Colors.indigodye,
      },
      secondary: {
        400: '#ff0000'
      },
      hero: {
        'left': Colors.goldengate,
        'right': Colors.indigodye,
      },
      button: Colors.mintcream,
    },
    styles,
    fontSizes,
    components,
  },
  theme
)

export default landingPageTheme;