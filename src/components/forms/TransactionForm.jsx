import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    Radio,
    RadioGroup,
    Switch,
    VStack
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { Field, Form, Formik, useField, useFormikContext, withFormik } from "formik"
import jsPDF from 'jspdf'
import React, { useContext, useEffect } from 'react'
import { GlobalDataContext } from '../../App'
import T2W from '../../numbers2words'
import autoTable from 'jspdf-autotable'
import { dateFormat, number_to_money, Transaction, TransactionProduct } from '../../util'
import AutocompleteInput from '../inputs/AutocompleteInput'
import CurrencyRadio from '../inputs/CurrencyRadio'
import HFormControl from '../inputs/HFormControl'
import Dinero from 'dinero.js'
import MultiselectProduct from '../inputs/MultiselectProduct'
import mikrotelLogo from './mikrotel.png';
import bcpLogo from './bcp.png';
import interbankLogo from './interbank.png';
import IntegerInput from '../inputs/IntegerInput'


const translator = new T2W("ES_ES")

export default function TransactionForm({ transaction, onSubmit }) {
    const { currency, opsRates } = useContext(GlobalDataContext)

    let initialValues = {
        currency: transaction?.currency || (currency === 'default' ? 'USD' : currency),
        type: transaction?.type || 'proforma',
        number: transaction?.number || '1',
        inventoryDiscount: false,
        date: transaction?.date.format(dateFormat) || dayjs().format(dateFormat),
        contact: transaction?.contact || { name: '', ruc: '' },
        products: transaction?.products.map(p => (
            {
                name: p.name,
                currency: transaction.currency,
                unitPrice: number_to_money(p.unitPrice.getAmount()),
                quantity: p.quantity.toString(),
                description: p.description,
            }
        )) || [],
    }

    const validate = (values) => {
        let errors = {}

        if (!values.date) errors.date = 'Requerido'
        if (!values.contact.name || !values.contact.ruc) errors.contact = 'Requerido'
        if (values.products.length === 0) errors.products = 'Se requiere almenos 1 producto'

        return errors
    }

    return <Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate} validateOnChange={false} validateOnBlur={false}>
        {({ errors, values }) =>
            <Form id="transactionForm" noValidate>
                <VStack>
                    <HFormControl label='Tipo'>
                        <TypeRadio name='type' />
                    </HFormControl>
                    <HFormControl label='Fecha' isInvalid={errors.date} isRequired>
                        <Field width='10rem' name="date" as={Input} type="date" />
                    </HFormControl>
                    <FormControl isInvalid={errors.contact} isRequired>
                        <FormLabel>Contacto</FormLabel>
                        <ContactInput />
                    </FormControl>
                    {!transaction &&
                        <HFormControl label='Descontar del inventario'>
                            <InventoryDiscountSwitch name='inventoryDiscount' />
                        </HFormControl>
                    }
                    <HFormControl label='Moneda'>
                        <CurrencyRadio name='currency' />
                    </HFormControl>
                    <HFormControl label='Proforma N°'>
                        <NumberProformaInput transaction={transaction}></NumberProformaInput>
                    </HFormControl>
                    <FormControl isInvalid={errors.products} isRequired>
                        <HStack>
                            <FormLabel>Productos</FormLabel>
                            <Box flexGrow='1'></Box>
                            <Button size='sm' variant='outline' onClick={() => generatePDF(values, opsRates)}>Ver proforma</Button>
                        </HStack>
                        <MultiselectProduct></MultiselectProduct>
                        {errors.products &&
                            <FormErrorMessage>{errors.products}</FormErrorMessage>
                        }
                    </FormControl>
                </VStack>
            </Form>
        }
    </Formik>
}

function NumberProformaInput({ transaction }) {
    const { values, ...formik } = useFormikContext()
    const { transactions } = useContext(GlobalDataContext)

    useEffect(() => {

        if (transaction) return;
        const repeated = transactions.filter(t =>
            t.date.format(dateFormat) === values.date &&
            t.contact.name === values.contact.name &&
            t.contact.ruc === values.contact.ruc
        )
        const max = Math.max(...repeated.map(r => r.number), 0)
        
        formik.setFieldValue('number', (max + 1).toString())

    }, [values['date'], values['contact']])

    return <Field name='number'>
        {
            ({ field, form }) =>
                <IntegerInput
                    value={field.value}
                    onChange={value => form.setFieldValue(field.name, value)}
                    width='10rem'
                />
        }
    </Field>
}

function TypeRadio(props) {
    const [field, meta, helpers] = useField(props)

    return <RadioGroup value={field.value} onChange={helpers.setValue}>
        <HStack>
            <Radio colorScheme='gray' value='proforma'>Proforma</Radio>
            <Radio colorScheme='green' value='sale'>Venta</Radio>
            <Radio colorScheme='red' value='purchase'>Compra</Radio>
        </HStack>
    </RadioGroup>
}

function ContactInput() {
    const [nameField, nameMeta, nameHelpers] = useField({ name: 'contact.name' })
    const [rucField, rucMeta, rucHelpers] = useField({ name: 'contact.ruc' })

    const { contacts } = useContext(GlobalDataContext)

    return <>
        <AutocompleteInput
            value={nameField.value}
            placeholder='Nombre'
            onChange={value => {
                nameHelpers.setValue(value)
                rucHelpers.setValue(contacts.find(c => c.name === value)?.ruc || rucField.value)
            }}
            options={contacts.map(c => c.name)}
            width='sm'
        />
        <Input marginY='0.5rem' placeholder='RUC/DNI' value={rucField.value} onChange={event => rucHelpers.setValue(event.target.value)} />
    </>
}



function InventoryDiscountSwitch(props) {
    const [field, meta, helpers] = useField(props)

    return <Switch isChecked={field.value} onChange={event => helpers.setValue(event.target.checked)} />
}

async function generatePDF(values, ops) {

    const products = values.products.map(p => new TransactionProduct(p, p.currency))

    const doc = new jsPDF()
    const margin = 25.4

    let line = null
    doc.addImage(mikrotelLogo, 'PNG', pad(0), pad(-0.5), 23, 15)
    doc.setFontSize(20)
    doc.text('Multiservicios Mikrotel Perú S.A.C', pad(3), pad(0))
    doc.text('RUC: 20487739155', pad(3), pad(1))

    doc.setFontSize(16)
    doc.text(`Proforma Nº ${values.number}`, pad(3), pad(2))

    doc.setFontSize(11)
    doc.text('Cliente : ' + values.contact.name.toUpperCase(), pad(0), pad(3))
    doc.text('Dirección : ' + 'LIMA', pad(0), pad(4))

    doc.text('RUC/DNI : ' + values.contact.ruc, pad(10), pad(3))
    doc.text('Fecha : ' + values.date, pad(10), pad(4))

    const head = [['Item', 'Cant.', 'U.M', 'Descripción', 'P. Unit.', 'P. Total']]

    let body = []
    let i = 1
    for (let i = 0; i < products.length; i++) {
        const p = products[i]
        body.push([
            (i + 1).toString(),
            p.quantity.toString(),
            'Unid.',
            doc.splitTextToSize(p.description, 70).join('\n'),
            (await p.unitPrice.convert(values.currency, ops)).toFormat(),
            (await p.total.convert(values.currency, ops)).toFormat(),
        ])
    }

    const foot = [[
        '',
        '',
        '',
        spellMoney((await getTotal(products, values.currency, ops)).getAmount(), doc, values.currency),
        '',
        (await getTotal(products, values.currency, ops)).toFormat(),
    ]]

    let tableHeight = 0
    doc.autoTable({
        didDrawPage: data => tableHeight = data.cursor.y,
        startY: pad(5),
        margin: margin,
        head,
        body,
        foot,
    })

    let padY = n => cm(n) + tableHeight

    doc.text('*Proforma válida por 10 días', margin, padY(1))
    doc.text('*Precio del equipo incluido IGV', margin, padY(1.5))
    doc.text('*1 año de garantía', margin, padY(2))

    doc.setFontSize(10)

    line = Liner(padY(3.1), 5)
    doc.roundedRect(pad(0), padY(3), 70, 50, 6, 6)
    doc.text('Multiservisios Mikrotel Perú S.A.C', pad(0.5), line())
    line()
    doc.text('BCP Soles', pad(0.5), line())
    doc.text('191-2517-9110-43', pad(0.5), line())
    doc.text('CCI 002-191-0025-1791-1043-59', pad(0.5), line())
    line()
    doc.text('BCP Dólares', pad(0.5), line())
    doc.text('191-2011627-1-73', pad(0.5), line())
    doc.text('CCI 002-191-0020-1162-7173-53', pad(0.5), line())
    doc.addImage(bcpLogo, 'PNG', pad(2.5), line(), 16, 4)

    line = Liner(padY(3.1), 5)
    doc.roundedRect(pad(8), padY(3), 70, 50, 6, 6)
    doc.text('Multiservisios Mikrotel Perú S.A.C', pad(8.5), line())
    line()
    doc.text('Interbank Soles', pad(8.5), line())
    doc.text('200-3004-5223-95', pad(8.5), line())
    doc.text('CCI 003-200-0030-0452-2395-32', pad(8.5), line())
    line()
    doc.text('Interbank Dólares', pad(8.5), line())
    doc.text('200-3004-5224-08', pad(8.5), line())
    doc.text('CCI 003-200-0030-0452-2408-33', pad(8.5), line())
    doc.addImage(interbankLogo, 'PNG', pad(10), line(), 30, 5)

    doc.text('Dirección: Pasaje Felipe Santiago Salaverry 180 – El Retablo – Comas - Lima', pad(0), pad(25))

    doc.save(`Mikrotel, Proforma ${values.number}, Cliente ${values.contact.name}`)
}

async function getTotal(products, currency, ops) {
    let total = Dinero({ amount: 0, currency })
    for (const p of products) {
        total = total.add(await p.total.convert(currency, ops))
    }
    return total
}

function spellMoney(number, doc, currency) {
    let [int, dec] = number_to_money(number).split('.')

    int = translator.toWords(Number.parseInt(int, 10))
    dec = translator.toWords(Number.parseInt(dec, 10))

    const unit = currency === 'PEN' ? 'soles' : 'dólares'
    let txt = capitalize(int + ` ${unit} con ` + dec + ' céntimos')
    txt = doc.splitTextToSize(txt, 70).join('\n')
    return txt
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function cm(n) { return n * 10 }

function pad(n) {
    const margin = 2.54
    return cm(n + margin)
}

function Liner(initialY = 0, lineHeight = 10) {
    let y = initialY
    return function (space = lineHeight) {
        y += space
        return y
    }
}