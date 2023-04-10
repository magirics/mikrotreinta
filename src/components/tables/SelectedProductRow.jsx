import { CloseIcon } from "@chakra-ui/icons"
import {
    IconButton, Td, Tr, useConst
} from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { GlobalDataContext } from "../../App"

export default function SelectedProductRow({ product, onRemove, currency }) {
    const {opsRates} = useContext(GlobalDataContext)
    const [unitPrice, setUnitPrice] = useState('')

    useEffect(() => {
        (async () => {

            setUnitPrice((await product.unitPrice.convert(currency, opsRates)).toFormat())

        })()
    }, [currency, opsRates])

    return <Tr>
        <Td>{product.name}</Td>
        <Td isNumeric>{unitPrice}</Td>
        <Td isNumeric>{product.quantity}</Td>
        <Td>
            <IconButton
                size='xs'
                icon={<CloseIcon />}
                onClick={onRemove}
            ></IconButton>
        </Td>
    </Tr>
}