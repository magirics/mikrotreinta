import { HStack, Td, Text, Tr } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { GlobalDataContext } from "../../App";
import { dateFormat } from "../../util";
import BigIcon from "../icons/BigIcon";
import { billPath } from "../paths";

export default function TransactionRow({ transaction, onClick }) {
    const { currency, opsRates } = useContext(GlobalDataContext)
    const [total, setTotal] = useState('')

    useEffect(() => {
        (async () => {

            setTotal(
                currency === 'default' ?
                    transaction.total.toFormat() :
                    (await transaction.total.convert(currency, opsRates)).toFormat()
            )

        })()
    }, [currency, opsRates])

    let color = 'green'
    if (transaction.type === 'sale') color = 'red'
    else if (transaction.type === 'proforma') color = 'gray'

    return <Tr onClick={() => onClick(transaction)}>
        <Td>
            <HStack >
                <BigIcon
                    color={color}
                    viewBox="-8 -8 40 40"
                    boxSize="8"
                    borderRadius="3"
                >
                    {billPath}
                </BigIcon>
                <Text>{transaction.concept}</Text>
            </HStack>
        </Td>
        <Td isNumeric>{total}</Td>
        <Td>{transaction.contact.name}</Td>
        <Td>{transaction.date.format(dateFormat)}</Td>
    </Tr>
}