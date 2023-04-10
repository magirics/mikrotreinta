import { Box, HStack, Input, Select, Text } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { GlobalDataContext } from "../../App"
import AddProductButton from "../buttons/AddProductButton"
import AddTransactionButton from "../buttons/AddTransactionButton"
import NavBar from "./NavBar"

export default function HeaderBar() {
    const path = useLocation().pathname
    let MainButton = null

    if (path.includes('balance')) {
        MainButton = <AddTransactionButton />
    } else if (path.includes('inventory')) {
        MainButton = <AddProductButton />
    }

    return <HStack padding='0.5rem' bgColor='white' boxShadow='md'>
        <NavBar />
        <Box flexGrow='1' />
        <RateInput></RateInput>
        <CurrencySelect />
        {MainButton}
    </ HStack >
}

function CurrencySelect(props) {
    const { currency, setCurrency } = useContext(GlobalDataContext)

    return <Select width='10rem' value={currency} onChange={event => setCurrency(event.target.value)}>
        <option value='default'>Por defecto</option>
        <option value='PEN'>Soles</option>
        <option value='USD'>Dolares</option>
    </Select>
}

function RateInput(props) {
    const { opsRates, setOpsRates } = useContext(GlobalDataContext)
    const [value, setValue] = useState(opsRates.rates['USD']['PEN'])

    useEffect(() => {
        setValue(opsRates.rates['USD']['PEN'])
    }, [opsRates])

    const onBlur = (event) => {
        const USDtoPEN = Number.parseFloat(event.target.value)
        const PENtoUSD = 1 / USDtoPEN
        const newRates = {
            'USD': { 'PEN': USDtoPEN.toString(), 'USD': '1' },
            'PEN': { 'USD': PENtoUSD.toString(), 'PEN': '1' },
        }
        const newOpsRates = {
            endpoint: new Promise(resolve => resolve(newRates)),
            propertyPath: '{{from}}.{{to}}',
            rates: newRates,
        }
        setOpsRates(newOpsRates)
    }

    return <Input
        width='10rem'
        value={value}
        onChange={event => setValue(event.target.value)}
        onBlur={onBlur}
    />
}