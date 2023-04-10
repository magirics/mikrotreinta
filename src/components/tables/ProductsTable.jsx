import { Table, Tbody, Th, Thead, Tr } from "@chakra-ui/react";

export default function ProductsTable() {
    return <Table>
        <Thead>
            <Tr>
                <Th>Nombre</Th>
                <Th>Descripcion</Th>
                <Th>Cantidad</Th>
                <Th>Precio unitario</Th>
                <Th>Costo unitario</Th>
                <Th>Codigo de barras</Th>
            </Tr>
        </Thead>
        <Tbody>
        </Tbody>
    </Table>
}