import { FormControl, FormLabel, Input, Wrap } from "@chakra-ui/react";
import { Field } from "formik";

export default function MyDateInput({ label, name, ...props }) {
    return <FormControl>
        <FormLabel>{label}</FormLabel>
        <Field as={Input} name={name} {...props} type="date"></Field>
    </FormControl>
}