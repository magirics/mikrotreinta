import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

export default function MoneyInput({ value, currency, onChange, ...props }) {
    let symbol = ''
    if (currency === 'PEN') symbol = 'S/ '
    else if (currency === 'USD') symbol = 'USD '

    const onBlur = (value) => {
        let newValue = value

        if (!value.match(/^\d+\.\d\d$/g)) {

            if (value.match(/^\d+$/g)) newValue += '.00'
            else if (value.match(/^\d+\.$/g)) newValue += '00'
            else if (value.match(/^\d+\.\d$/g)) newValue += '0'

            if (newValue.match(/^\d+\.\d\d$/g)) {
                onChange(newValue)
            }
        }
    }

    return <InputGroup {...props}>
        <InputLeftElement color='gray' children={symbol}></InputLeftElement>
        <Input
            type='number'
            value={value}
            onBlur={event => onBlur(event.target.value)}
            onChange={event => onChange(event.target.value)}
        />
    </InputGroup>
}