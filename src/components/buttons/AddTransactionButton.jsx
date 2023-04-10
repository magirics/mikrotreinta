import { Button, useDisclosure, useToast } from "@chakra-ui/react"
import { useContext, useRef } from "react"
import { GlobalDataContext } from "../../App"
import { Contact, money_to_number, Product, Transaction, TransactionProduct } from "../../util"
import OnlyDrawer from "../drawers/OnlyDrawer"
import TransactionForm from "../forms/TransactionForm"
import Dinero from "dinero.js"

export default function AddTransactionButton() {
    const { inventory, opsRates, contacts } = useContext(GlobalDataContext)

    const disclosure = useDisclosure()
    const btnRef = useRef()

    const toast = useToast()

    const onAddTransaction = async (values, actions) => {
        try {
            let transaction = new Transaction(values)

            let prods = []
            for (const p of values.products) {
                const unitPrice = Dinero({ amount: money_to_number(p.unitPrice), currency: p.currency })
                prods.push(new TransactionProduct({
                    name: p.name,
                    currency: transaction.currency,
                    unitPrice: await unitPrice.convert(values.currency, opsRates),
                    quantity: p.quantity,
                    description: p.description,
                }))
            }
            transaction.products = prods

            if (values.inventoryDiscount) await discountFromInventory(transaction.products, inventory, values.type)
            await transaction.upload()

            toast({
                title: 'Transacción agregada',
                status: 'success',
                position: 'bottom-right',
                duration: 2000,
                isClosable: true,
            })

            if (!contacts.find(c => c.name === values.contact.name) && !contacts.find(c => c.ruc === values.contact.ruc)) {
                new Contact(values.contact).upload()
            }
        } catch (exception) {
            console.log(exception)
            toast({
                title: 'Error al agregar la transacción',
                status: 'error',
                position: 'bottom-right',
                duration: 2000,
                isClosable: true,
            })
        }

        actions.resetForm()
    }

    return <>
        <Button ref={btnRef} onClick={disclosure.onOpen} bgColor='mikro.strong'>Agregar transacción</Button>
        <OnlyDrawer
            disclosure={disclosure}
            header='Agregar transacción'
            body={<TransactionForm onSubmit={onAddTransaction} />}
            footer={<Button type="submit" form="transactionForm" bgColor='mikro.strong'>Agregar</Button>}
        />
    </>
}

async function discountFromInventory(products, inventory, type) {
    let productData = {}
    for (const p of products) {
        productData[p.name] = (productData[p.name] || 0) + p.quantity
    }

    for (const key in productData) {
        const oldProduct = inventory.find(p => p.name === key)
        if (oldProduct) {
            const newProduct = new Product(oldProduct, oldProduct.id)
            if (type === 'sale') newProduct.quantity = oldProduct.quantity - productData[key]
            else newProduct.quantity = productData[key] + oldProduct.quantity
            await newProduct.upload()
        }
    }
}
