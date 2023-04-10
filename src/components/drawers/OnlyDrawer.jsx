import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    HStack,
} from "@chakra-ui/react";
import { forwardRef } from "react"

const OnlyDrawer = forwardRef(({ disclosure, header, body, footer }, ref) => {
    return <Drawer
        size='sm'
        isOpen={disclosure.isOpen}
        onClose={disclosure.onClose}
        finalFocusRef={ref}
    >
        <DrawerOverlay />
        <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>{header}</DrawerHeader>
            <DrawerBody>{body}</DrawerBody>
            <DrawerFooter>
                <HStack>
                    {footer}
                </HStack>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
})

export default OnlyDrawer