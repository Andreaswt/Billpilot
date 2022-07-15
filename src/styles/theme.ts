import { extendTheme } from "@chakra-ui/react"

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
    fonts: {
        heading: `'Open Sans', sans-serif`,
        body: `'Raleway', sans-serif`,
    },
    //   colors: {
    //     brand: {
    //       100: "#f7fafc",
    //       // ...
    //       900: "#1a202c",
    //     },
    //   },
})

export default theme;