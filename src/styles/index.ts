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
      initialColorMode: 'light',
      useSystemColorMode: false,
    },
    colors: {
      primary: {
        "50": "#E9F2FB",
        "100": "#C2DAF5",
        "200": "#9AC1EE",
        "300": "#73A9E8",
        "400": "#4C91E1",
        "500": "#2479DB",
        "600": "#1D61AF",
        "700": "#164983",
        "800": "#0F3058",
        "900": "#07182C"
      },
      secondary: {
        400: '#ff0000'
      },
      hero: {
        'left': Colors.goldengate,
        'right': Colors.primaryblue,
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