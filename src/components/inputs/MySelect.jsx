import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { Field } from "formik";

export default function MySelect({ name, label, options }) {
    return <FormControl>
        <FormLabel>{label}</FormLabel>
        <Field as={Select} name={name}>
            {
                options.map(el => <option key={el.id}>{el.name}</option>)
            }
        </Field>
    </FormControl>
}