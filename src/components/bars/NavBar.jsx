import {
    Box,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    Icon,
    IconButton, Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react"
import { signOut } from "firebase/auth"
import React, { useContext, useRef } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { GlobalDataContext } from "../../App"
import { fireauth } from "../../firebase"

import NavButton from '../buttons/NavButton'
import ContactsDrawer from "../drawers/ContactsDrawer"
import NavIcon from '../icons/NavIcon'
import {
    boxPath,
    morePath,
    outPath,
    paperPath, statsPath
} from '../paths'

const BalanceIcon = <NavIcon>{paperPath}</NavIcon>
const InventoryIcon = <NavIcon viewBox='0 0 80 80'>{boxPath}</NavIcon>
const StatisticsIcon = <NavIcon>{statsPath}</NavIcon>
const LogoutIcon = <NavIcon>{outPath}</NavIcon>

const NavBarIcon = <Icon viewBox='0 0 16 16'>{morePath}</Icon>

export default function NavBar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()

    return <>
        <IconButton ref={btnRef} icon={NavBarIcon} onClick={onOpen} />
        <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerBody>
                    <Bar />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    </>
}

const Bar = function () {
    const { setAccount } = useContext(GlobalDataContext)
    const navigate = useNavigate()

    const logout = async () => {
        await signOut(fireauth)
        setAccount()
        localStorage.removeItem('account')
        navigate('/login')
    }

    return <VStack width='100%' height='100%' alignItems='start'>
        <Icon width='10rem' height='5rem' viewBox='0 0 98 36'></Icon>

        <NavButton as={NavLink} to='/inventory' leftIcon={InventoryIcon}>Inventario</NavButton>
        <NavButton as={NavLink} to='/balance' leftIcon={BalanceIcon}>Balance</NavButton>
        <NavButton as={NavLink} to='/statistics' leftIcon={StatisticsIcon}>Estadisticas</NavButton>

        <Text fontSize='2xs'>OTROS</Text>
        <ContactsDrawer />

        <Box flexGrow='1' />
        <Divider />
        <NavButton leftIcon={LogoutIcon} onClick={logout} color='red.500'>Cerrar sesión</NavButton>
    </VStack>
}