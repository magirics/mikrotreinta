import { VStack } from "@chakra-ui/react"
import { useState } from "react"
import TransactionsFilter from "../filters/TransactionsFilter"
import TransactionsTable from "../tables/TransactionsTable"

export default function BalancePage() {
    const [query, setQuery] = useState('')

    return <VStack width='100%' align='stretch'>
            <TransactionsFilter onChange={ev => setQuery(ev.target.value)}></TransactionsFilter>
            <TransactionsTable query={query}></TransactionsTable>
    </VStack>
}