import {
    FormControl, FormLabel, Input, Textarea, VStack
} from '@chakra-ui/react'
import { Field, FieldArray, Form, Formik } from "formik"
import React, { useContext } from 'react'
import { GlobalDataContext } from '../../App'
import { number_to_money } from '../../util'
import BarcodeScanner from '../inputs/BarcodeScanner'
import CurrencyRadio from '../inputs/CurrencyRadio'
import HFormControl from '../inputs/HFormControl'
import IntegerInput from '../inputs/IntegerInput'
import MoneyInput from '../inputs/MoneyInput'
import PhotosInput from '../inputs/PhotosInput'

export default function ProductForm({ product, onSubmit }) {
    const { currency, inventory } = useContext(GlobalDataContext)

    let initialValues = {
        currency: product?.currency || (currency !== 'default' ? currency : 'USD'),
        name: product?.name || '',
        photos: product?.photos || [],
        barcode: product?.barcode || '',
        quantity: product?.quantity.toString() || '',
        unitCost: product ? number_to_money(product.unitCost.getAmount()) : '',
        unitPrice: product ? number_to_money(product.unitPrice.getAmount()) : '',
        description: product?.description || '',
    }

    const validate = (values) => {
        let errors = {}

        if (!values.name) errors.name = 'Requerido'
        if (!values.quantity) errors.quantity = 'Requerido'
        if (!values.unitCost) errors.unitCost = 'Requerido'
        if (!values.unitPrice) errors.unitPrice = 'Requerido'

        if (!product && values.name) {
            if (inventory.find(p => p.name === values.name)) {
                errors.name = 'Nombre ya existente'
            }
        }

        return errors
    }

    return <Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate} validateOnChange={false} validateOnBlur={false}>
        {({ errors, values }) =>
            <Form id='productForm' noValidate>
                <VStack>
                    <FormControl isInvalid={errors.name} isRequired>
                        <FormLabel >Nombre</FormLabel>
                        <Field name="name" as={Input} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Código de barras</FormLabel>
                        <BarcodeScanner name="barcode" />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Fotos</FormLabel>
                        <FieldArray name='photos' component={PhotosInput} />
                    </FormControl>
                    <HFormControl label='Cantidad' isInvalid={errors.quantity} isRequired>
                        <Field name='quantity'>
                            {
                                ({ field, form }) => <IntegerInput
                                    value={field.value}
                                    onChange={value => form.setFieldValue(field.name, value)}
                                    width='10rem'
                                />
                            }
                        </Field>
                    </HFormControl>
                    <HFormControl label='Moneda' isRequired>
                        <CurrencyRadio name='currency' />
                    </HFormControl>
                    <HFormControl label='Costo unitario' isInvalid={errors.unitCost} isRequired>
                        <Field name='unitCost'>
                            {
                                ({ field, form }) => <MoneyInput
                                    value={field.value}
                                    onChange={value => form.setFieldValue(field.name, value)}
                                    currency={values.currency}
                                    width='10rem'
                                />
                            }
                        </Field>
                    </HFormControl>
                    <HFormControl label='Precio unitario' isInvalid={errors.unitPrice} isRequired>
                        <Field name='unitPrice'>
                            {
                                ({ field, form }) => <MoneyInput
                                    value={field.value}
                                    onChange={value => form.setFieldValue(field.name, value)}
                                    currency={values.currency}
                                    width='10rem'
                                />
                            }
                        </Field>
                    </HFormControl>
                    <FormControl>
                        <FormLabel>Descripción</FormLabel>
                        <Field name='description' as={Textarea} />
                    </FormControl>
                </VStack>
            </Form>
        }
    </Formik >
}