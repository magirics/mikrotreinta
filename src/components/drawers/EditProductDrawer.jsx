import {
    Button, useToast
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { Product } from "../../util";
import DeleteButton from "../buttons/DeleteButton";
import ProductForm from "../forms/ProductForm";
import OnlyDrawer from "./OnlyDrawer";

const EditProductDrawer = forwardRef(({ disclosure, product }, ref) => {
    const toast = useToast()

    const onSave = async (values) => {
        try {
            await new Product(values, product.id).upload()
            toast({
                title: 'Producto guardado',
                status: 'success', position: 'bottom-right',
                duration: 2000,
                isClosable: true,
            })
        } catch (exception) {
            console.log(exception)
            toast({
                title: 'Error al guardar el producto',
                status: 'error', position: 'bottom-right',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    const onDelete = async () => {
        try {
            await product.delete()
            toast({
                title: 'Producto eliminado',
                status: 'success',
                position: 'bottom-right',
                duration: 2000,
                isClosable: true,
            })
        } catch (exception) {
            console.log(exception)
            toast({
                title: 'Error al eliminar el producto',
                status: 'error',
                position: 'bottom-right',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    return <OnlyDrawer
        ref={ref}
        disclosure={disclosure}
        header="Producto"
        body={<ProductForm product={product} onSubmit={onSave} />}
        footer={<>
            <DeleteButton
                onDelete={onDelete}
                header="¿Estas seguro que quieres borrar este producto?"
            >Eliminar</DeleteButton>
            <Button type="submit" form="productForm" bgColor='mikro.strong'>Guardar</Button>
        </>}
    />
})

export default EditProductDrawer