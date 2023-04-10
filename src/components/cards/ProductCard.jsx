import { Image, Text, VStack } from "@chakra-ui/react";
import { forwardRef, useContext, useEffect, useState } from "react";
import { GlobalDataContext } from "../../App";
import Dinero from "dinero.js";

export default forwardRef(
    function ProductCard({ product, src, onClick }, ref) {
        const { currency, opsRates } = useContext(GlobalDataContext)
        const [price, setPrice] = useState('')

        useEffect(() => {
            (async () => {

                const p = currency === 'default' ?
                    await product.unitPrice :
                    await product.unitPrice.convert(currency, opsRates)
                setPrice(p.toFormat())

            })()
        }, [currency, opsRates])

        return <VStack
            padding='0.5rem'
            width='10rem'
            height='12rem'
            borderWidth='1px'
            borderColor='gray.300'
            borderRadius='lg'
            spacing='0'
            bgColor='white'

            ref={ref}
            onClick={(ev) => onClick(product)}
        >
            <Image src={src} objectFit='contain' width='6rem' height='5rem' marginBottom='1rem' />
            <Text>{price}</Text>
            <Text fontWeight='semibold'>{product.name}</Text>
            <Text fontSize='sm' color='gray'>{product.quantity + ' disponibles'}</Text>
        </VStack>
    }
)