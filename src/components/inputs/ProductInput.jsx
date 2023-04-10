import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel, HStack, Textarea, VStack, Wrap
} from "@chakra-ui/react"
import { Field, Formik, useField, useFormik } from "formik"
import { cloneElement, useContext, useEffect, useState } from "react"
import { GlobalDataContext } from "../../App"
import { money_to_number, number_to_money } from "../../util"
import AutocompleteInput from "./AutocompleteInput"
import IntegerInput from "./IntegerInput"
import MoneyInput from "./MoneyInput"

export default function ProductInput({ onAdd, currency }) {
    const { inventory } = useContext(GlobalDataContext)

    const initialValues = {
        name: '',
        unitPrice: '',
        quantity: '1',
        description: '',
    }

    const validate = (values) => {
        let errors = {}

        const prod = inventory.find(p => p.name === values.name)
        if (values.type === 'sale' && prod) {
            const quant = Number.parseInt(values.quantity, 10)
            if (quant > prod.quantity) {
                errors.quantity = `Solo hay ${prod.quantity} disponibles`
            }
        }

        return errors
    }

    const onSubmit = (values, actions) => {
        onAdd({ ...values, currency })
        actions.resetForm()
    }

    return <Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate} validateOnBlur={false} validateOnChange={false}>
        {({ errors, values, ...formik }) =>
            <VStack spacing='4px'>
                <FormControl>
                    <Wrap>
                        <FormLabel fontSize='sm'>Nombre</FormLabel><Box flexGrow='1' />
                        <Field name='name'
                            currency={currency}
                            size='sm'
                            width='12rem'
                            component={NameInput}
                        />
                    </Wrap>
                </FormControl>
                <FormControl>
                    <Wrap>
                        <FormLabel fontSize='sm'>Precio u.</FormLabel><Box flexGrow='1' />
                        <Field name='unitPrice'>
                            {({ field, form }) =>
                                <MoneyInput
                                    onChange={value => form.setFieldValue(field.name, value)}
                                    value={field.value}
                                    currency={currency}
                                    size='sm'
                                    width='12rem'
                                />
                            }
                        </Field>
                    </Wrap>
                </FormControl>
                <FormControl isInvalid={errors.quantity}>
                    <HStack>
                        <FormLabel fontSize='sm'>Cantidad</FormLabel><Box flexGrow='1' />
                        <VStack alignItems='start'>
                            <Field name='quantity'>
                                {({ field, form }) =>
                                    <IntegerInput
                                        onChange={value => form.setFieldValue(field.name, value)}
                                        value={field.value}
                                        size='sm'
                                        width='12rem'
                                    />
                                }
                            </Field>
                            {errors.quantity &&
                                <FormErrorMessage>{errors.quantity}</FormErrorMessage>
                            }
                        </VStack>
                    </HStack>
                </FormControl>
                <FormControl>
                    <Wrap>
                        <FormLabel fontSize='sm'>Descripción</FormLabel><Box flexGrow='1' />
                        <Field name='description'>
                            {({ field, form }) =>
                                <Textarea
                                    onChange={event => form.setFieldValue(event.target.value)}
                                    value={field.value}
                                    size='sm'
                                    width='12rem'
                                />
                            }
                        </Field>
                    </Wrap>
                </FormControl>

                <Button onClick={formik.handleSubmit} alignSelf='end' size='sm' marginTop='10px'>Añadir producto</Button>
            </VStack>
        }
    </Formik>
}

function NameInput({ form, currency, field, ...props }) {
    const { inventory, opsRates } = useContext(GlobalDataContext)
    const productNames = inventory.map(p => p.name)

    useEffect(() => {

        form.resetForm()

    }, [currency, opsRates])

    const onChange = async (value) => {
        form.setFieldValue('name', value)

        const prod = inventory.find(p => p.name === value)
        if (prod) {
            const unitPrice = (await prod.unitPrice.convert(currency, opsRates)).getAmount()
            form.setFieldValue('unitPrice', number_to_money(unitPrice))
            form.setFieldValue('description', prod.description)
            form.setFieldValue('quantity', '1')
        }
    }

    return <AutocompleteInput value={field.value} options={productNames} onChange={onChange} {...props} />
}
