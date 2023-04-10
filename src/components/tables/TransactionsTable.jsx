import {
    Tbody,
    Td,
    Th,
    TableContainer,
    Tfoot,
    Table,
    Thead, Tr,
    useDisclosure
} from "@chakra-ui/react";
import { GlobalDataContext } from "../../App";
import { useContext, useRef, useState } from "react";
import TransactionRow from "../tables/TransactionRow";
import EditTransactionDrawer from "../drawers/EditTransactionDrawer";
import { number_to_money } from "../../util";


export default function TransactionsTable({ query }) {
    const { transactions } = useContext(GlobalDataContext)

    let filtered = transactions
    if (query !== '') {
        const filters = query.toLowerCase().split(',')
        for (const filter of filters) {
            filtered = filtered.filter(t =>
                t.concept.toLowerCase().includes(filter) ||
                t.contact.name.toLowerCase().includes(filter) ||
                number_to_money(t.total.getAmount()).includes(filter)
            )
        }
    }

    const [transaction, setTransaction] = useState()
    const disclosure = useDisclosure()
    const ref = useRef()
    const onClick = (transaction) => {
        disclosure.onOpen()
        setTransaction(transaction)
    }


    return <TableContainer ref={ref}>
        <Table bgColor="white">
            <Thead>
                <Tr>
                    <Th>Concepto</Th>
                    <Th isNumeric>Valor</Th>
                    <Th>Contacto</Th>
                    <Th>Fecha y hora</Th>
                </Tr>
            </Thead>
            <Tbody>
                {
                    filtered.map(t =>
                        <TransactionRow key={t.id} transaction={t} onClick={onClick}></TransactionRow>
                    )
                }
            </Tbody>
            <Tfoot>
                <Tr hidden>
                    <Td>
                        <EditTransactionDrawer
                            ref={ref}
                            disclosure={disclosure}
                            transaction={transaction}
                        />
                    </Td>
                </Tr>
            </Tfoot>
        </Table>
    </TableContainer>
}

