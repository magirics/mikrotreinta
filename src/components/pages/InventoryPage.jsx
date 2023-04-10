import { useDisclosure, VStack, Wrap } from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import InfoCard from "../cards/InfoCard";
import { billPath, boxPath } from "../paths";

import Dinero from "dinero.js";
import { GlobalDataContext } from "../../App";
import { number_to_money } from "../../util";
import ProductCard from "../cards/ProductCard";
import EditProductDrawer from "../drawers/EditProductDrawer";
import ProductFilter from "../filters/ProductFilter";

export default () => {
    const { inventory, currency, opsRates } = useContext(GlobalDataContext)
    const [totalValue, setTotalValue] = useState('')
    const [totalCost, setTotalCost] = useState('')
    const disclosure = useDisclosure()
    const ref = useRef()

    const [product, setProduct] = useState()
    const onClick = (product) => {
        disclosure.onOpen()
        setProduct(product)
    }

    const [query, setQuery] = useState('')
    const [sortType, setSortType] = useState('ascending price')
    const [viewType, setViewTiype] = useState('tiles')

    let filtered = inventory
    if (query !== '') {
        const filters = query.toLowerCase().split(',')
        for (const filter of filters) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(filter) ||
                p.description.toLowerCase().includes(filter) ||
                number_to_money(p.unitPrice.getAmount()).includes(filter)
            )
        }
    }
    switch (sortType) {
        case 'ascending price':
            filtered.sort((p0, p1) => p0.unitPrice - p1.unitPrice)
            break;

        case 'descending price':
            filtered.sort((p0, p1) => p1.unitPrice - p0.unitPrice)
            break;
    }

    switch (viewType) {
        case 'tiles':
            break;

        case 'table':
            break;
    }

    useEffect(() => {
        (async () => {
            const moneyCurr = currency === 'default' ? 'USD' : currency

            const zero = Dinero({ amount: 0, currency: moneyCurr })
            let inv = []
            for (const p of inventory) {
                inv.push({
                    unitPrice: await p.unitPrice.convert(moneyCurr, opsRates),
                    unitCost: await p.unitCost.convert(moneyCurr, opsRates),
                    quantity: p.quantity,
                })
            }

            const tv = inv.reduce((acc, p) => p.unitPrice.multiply(p.quantity).add(acc), zero)
            const tc = inv.reduce((acc, p) => p.unitCost.multiply(p.quantity).add(acc), zero)

            setTotalValue((await tv.convert(moneyCurr, opsRates)).toFormat())
            setTotalCost((await tc.convert(moneyCurr, opsRates)).toFormat())

        })()
    }, [inventory, currency, opsRates])

    return <VStack alignItems='stretch' padding='1rem' ref={ref}>
        <Wrap padding='5px 0 5px 0'>
            <InfoCard path={boxPath} viewBox='0 0 80 80' color='gray'
                label='Total de productos'
                value={
                    inventory.reduce((acc, p) => acc + p.quantity, 0)
                }
            ></InfoCard>
            <InfoCard path={billPath} color='green'
                label='Valor total'
                value={totalValue}
            ></InfoCard>
            <InfoCard path={billPath} color='red'
                label='Costo total'
                value={totalCost}
            ></InfoCard>
        </Wrap>
        <ProductFilter onChangeQuery={setQuery} onChangeSortType={setSortType} onChangeViewType={setViewTiype} />
        <Wrap>
            {
                filtered.map(el => <ProductCard
                    key={el.id}
                    src={
                        el.photos.length > 0 ?
                            (typeof el.photos[0] === 'string' ? el.photos[0] : URL.createObjectURL(el.photos[0])) :
                            'img_placeholder.png'
                    }
                    product={el}
                    onClick={onClick}
                />)
            }
        </Wrap>
        <EditProductDrawer
            ref={ref}
            disclosure={disclosure}
            product={product}
        />
    </VStack>
}