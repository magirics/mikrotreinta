import { HStack, Radio, RadioGroup } from "@chakra-ui/react"
import { useField } from "formik"

export default function CurrencyRadio(props) {
    const [field, meta, helpers] = useField(props)

    return <RadioGroup value={field.value} onChange={helpers.setValue}>
        <HStack>
            <Radio width='5rem' value='USD'>Dólares</Radio>
            <Radio width='5rem' value='PEN'>Soles</Radio>
        </HStack>
    </RadioGroup>
}