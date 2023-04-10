import { Divider, Input, Select, Wrap, WrapItem } from "@chakra-ui/react"


export default function ProductFilter({ onChangeQuery, onChangeSortType, onChangeViewType }) {

    return <Wrap margin='0.5rem 0 0 0' padding='0.5rem' align='center' bgColor='white'>
        <WrapItem>
            <Input type="search" placeholder='Buscar' width='20rem' onChange={event => onChangeQuery(event.target.value)}></Input>
        </WrapItem>

        <Divider orientation='vertical' padding='1rem 0'></Divider>
        <WrapItem>
            <Select onChange={event => onChangeSortType(event.target.value)}>
                <option value='descending price'>Precio descendente</option>
                <option value='ascending price'>Precio ascendente</option>
            </Select>
        </WrapItem>
        <WrapItem>
            <Select onChange={event => onChangeViewType(event.target.value)}>
                <option value='tiles'>Bloques</option>
                <option value='table'>Tabla</option>
            </Select>
        </WrapItem>
    </Wrap >
}

