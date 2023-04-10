import { Button, useDisclosure, useToast } from "@chakra-ui/react"
import { useRef } from "react"
import { Product } from "../../util"
import OnlyDrawer from "../drawers/OnlyDrawer"
import ProductForm from "../forms/ProductForm"

export default function AddProductButton() {
    const disclosure = useDisclosure()
    const btnRef = useRef()

    const toast = useToast()

    const onAdd = async (values, actions) => {
        try {
            await new Product(values).upload()
            toast({
                title: 'Producto agregado',
                status: 'success',
                position: 'bottom-right',
                duration: 2000,
                isClosable: true,
            })
        } catch (exception) {
            toast({
                title: 'Error al agregar el producto',
                status: 'error',
                position: 'bottom-right',
                duration: 2000,
                isClosable: true,
            })
            console.log(exception)
        }
        
        actions.resetForm()
    }

    return <>
        <Button ref={btnRef} onClick={disclosure.onOpen} bgColor='mikro.strong'>
            Agregar producto
        </Button>
        <OnlyDrawer
            disclosure={disclosure}
            header='Agregar producto'
            body={<ProductForm onSubmit={onAdd}></ProductForm>}
            footer={<Button type="submit" form="productForm" bgColor='mikro.strong'>Agregar</Button>}
        />
    </>
}