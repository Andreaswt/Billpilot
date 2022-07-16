import { extendTheme } from "@chakra-ui/react"

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
    fonts: {
        heading: `'Open Sans', sans-serif`,
        body: `'Raleway', sans-serif`,
    },
      colors: {
        brand: {
          100: "#BEE3F8",
          500: "#3182CE",
          800: "#2A4365",
          900: "#1A365D",
        },
      },
})

export default theme;