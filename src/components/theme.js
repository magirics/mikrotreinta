import { extendTheme, theme } from "@chakra-ui/react";

const treintaTheme = {
    colors: {
        mikro: {
            strong: 'rgb(254, 215, 77)',
        }
    },

    styles: {
        global: {
            body: {
                minWidth: '100vw',
                minHeight: '100vh',
                bg: 'gray.50',
            }
        }
    }
}

export default extendTheme(treintaTheme)