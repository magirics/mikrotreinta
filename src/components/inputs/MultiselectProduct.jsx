import { Box, Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react"
import { FieldArray } from "formik"
import { TransactionProduct } from "../../util"
import SelectedProductRow from "../tables/SelectedProductRow"
import ProductInput from "./ProductInput"

export default function MultiselectProduct(props) {

    return <FieldArray name='products'>
        {({ push, remove, form, ...props }) =>
            <Box padding='1rem' boxShadow='md'>
                <TableContainer minHeight='5rem' paddingBottom='1rem'>
                    <Table size='sm'>
                        <Thead>
                            <Tr>
                                <Th>Nombre</Th >
                                <Th isNumeric>P. Unit.</Th>
                                <Th isNumeric>Cant.</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                form.values.products.map((p, i) =>
                                    <SelectedProductRow
                                        key={i}
                                        product={new TransactionProduct(p, p.currency)}
                                        currency={form.values.currency}
                                        onRemove={() => remove(i)}
                                    />

                                )
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
                <ProductInput onAdd={push} currency={form.values.currency} />
            </Box>
        }
    </FieldArray>
}