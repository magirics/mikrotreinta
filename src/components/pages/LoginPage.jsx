import { Button, Center, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text, useConst, VStack } from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Field, Form, Formik } from "formik";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalDataContext } from "../../App";
import { fireauth } from "../../firebase";

export default function LoginPage({ history }) {
    const { setAccount } = useContext(GlobalDataContext)

    const initialValues = {
        email: '',
        password: '',
    }
    const navigate = useNavigate()

    const onSubmit = async (values) => {
        try {
            const credentials = await signInWithEmailAndPassword(fireauth, values.email, values.password)
            setAccount(credentials.user.email)
            localStorage.setItem('account', credentials.user.email)

            navigate('/inventory')
        } catch (exception) {
            console.log(exception)
        }
    }

    const validate = (values) => {
        let errors = {}

        if (values.password && values.password.length < 6) errors.password = 'Debe tener mas de 6 caracteres'

        return errors
    }

    return <Center height='100vh'>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate}>
            {({ errors }) =>
                <Form id='login' noValidate>
                    <VStack bgColor='white' padding='1rem'>
                        <Text fontSize='2xl'>Iniciar sesión</Text>
                        <FormControl>
                            <FormLabel>Correo</FormLabel>
                            <Field name='email' as={Input} autoComplete="on"/>
                        </FormControl>
                        <FormControl isInvalid={errors.password}>
                            <FormLabel>Contraseña</FormLabel>
                            <Field name='password' component={PasswordInput} />
                        </FormControl>
                        <Button width='100%' type='submit' form="login">Iniciar sesión</Button>
                    </VStack>
                </Form>
            }
        </Formik>
    </Center>
}

function PasswordInput({ field, form }) {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    return <InputGroup size='md'>
        <Input
            value={field.value}
            onChange={event => form.setFieldValue(field.name, event.target.value)}
            pr='4.5rem'
            type={show ? 'text' : 'password'}
            placeholder='Enter password'
            autoComplete='off'
        />
        <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show ? 'Mostrar' : 'Ocultar'}
            </Button>
        </InputRightElement>
    </InputGroup>
}