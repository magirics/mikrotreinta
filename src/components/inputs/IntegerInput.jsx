import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react";

export default function IntegerInput({ value, onChange, ...props }) {
    return <NumberInput
        value={value}
        onChange={onChange}
        min='0'
        precision='0'
        {...props}
    >
        <NumberInputField />
        <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
        </NumberInputStepper>
    </NumberInput>
}