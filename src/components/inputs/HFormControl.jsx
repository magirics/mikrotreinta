import { FormControl, FormLabel, HStack } from "@chakra-ui/react";

export default function HFormControl({ label, children, ...props }) {
    return <FormControl {...props}>
        <HStack width='100%' justifyContent='space-between'>
            <FormLabel>{label}</FormLabel>
            {children}
        </HStack>
    </FormControl>
}