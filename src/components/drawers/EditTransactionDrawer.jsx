import {
    Button, useToast
} from "@chakra-ui/react"
import { forwardRef } from "react"
import { Transaction } from "../../util"
import DeleteButton from "../buttons/DeleteButton"
import TransactionForm from "../forms/TransactionForm"
import OnlyDrawer from "./OnlyDrawer"

const EditTransactionDrawer = forwardRef(({ disclosure, transaction }, ref) => {
    const toast = useToast()

    const onSave = async (values) => {
        try {
            await new Transaction(values, transaction.id).upload()
            toast({
                title: 'Transacción guardada',
                status: 'success',
                position: 'bottom-right',
                duration: 2000,
                isClosable: true,
            })
        } catch (exception) {
            console.log(exception)
            toast({
                title: 'Error al guardar la transacción',
                status: 'error',
                position: 'bottom-right',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    const onDelete = async () => {
        try {
            await transaction.delete()
            toast({
                title: 'Transacción eliminada',
                status: 'success',
                position: 'bottom-right',
                duration: 2000,
                isClosable: true,
            })
        } catch (exception) {
            console.log(exception)
            toast({
                title: 'Error al eliminar la transacción',
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
        header='Transacción'
        body={<TransactionForm transaction={transaction} onSubmit={(values) => onSave(values)} />}
        footer={<>
            <DeleteButton
                onDelete={onDelete}
                header="¿Estas seguro que quieres borrar esta transacción?"
            >Eliminar</DeleteButton>
            <Button type="submit" form="transactionForm" bgColor='mikro.strong'>Guardar</Button>
        </>}
    />
})

export default EditTransactionDrawer