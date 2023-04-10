import {
    Button, Divider, Drawer,
    DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader,
    DrawerOverlay, Editable, EditableInput, EditablePreview, FormControl,
    FormLabel, HStack, Icon, IconButton, Input, useDisclosure,
    VStack
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import { useContext, useRef } from 'react'
import { GlobalDataContext } from '../../App'
import { Contact } from '../../util'
import NavButton from '../buttons/NavButton'
import NavIcon from '../icons/NavIcon'
import { trashPath, truckPath } from '../paths'

const ContactsIcon = <NavIcon viewBox='0 0 16 16'>{truckPath}</NavIcon>

export default function ContactsDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()

    return <>
        <NavButton ref={btnRef} leftIcon={ContactsIcon} onClick={onOpen}>Contactos</NavButton>
        <Drawer isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef} size='sm'>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Contactos</DrawerHeader>
                <DrawerBody>
                    <ContactDrawerContent />
                </DrawerBody>
                <DrawerFooter>
                    <ContactForm />
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </>
}

function ContactForm() {
    const { contacts } = useContext(GlobalDataContext)
    const initialValues = { name: '', ruc: '' }

    const onSubmit = async (values, actions) => {
        await new Contact(values).upload()
        actions.resetForm()
    }

    const validate = (values) => {
        let errors = {}

        if (values.name && contacts.find(c => c.name === values.name)) {
            errors.name = 'Nombre ya existente'
        }
        if (values.ruc && contacts.find(c => c.ruc === values.ruc)) {
            errors.ruc = 'RUC/DNI ya existente'
        }

        return errors
    }

    return <Formik onSubmit={onSubmit} initialValues={initialValues} validate={validate} validateOnChange={false} validateOnBlur={false}>
        {({ errors }) =>
            <Form id='contactForm' noValidate style={{ width: '100%' }}>
                <HStack>
                    <VStack>
                        <FormControl display='flex' flexDirection='row' isInvalid={errors.name}>
                            <FormLabel width='6rem'>Nombre</FormLabel>
                            <Field as={Input} name='name' size='sm' />
                        </FormControl>
                        <FormControl display='flex' flexDirection='row' isInvalid={errors.ruc}>
                            <FormLabel width='6rem'>RUC</FormLabel>
                            <Field as={Input} name='ruc' size='sm' />
                        </FormControl>
                    </VStack>
                    <Button type='submit' form='contactForm' bgColor='mikro.strong'>Agregar</Button>
                </HStack>
            </Form>
        }
    </Formik>
}

function ContactDrawerContent() {
    const { contacts } = useContext(GlobalDataContext)

    return <VStack>
        <Divider />
        {
            contacts.map(c => <ContactEditable key={c.id} contact={c} />)
        }
    </VStack>
}

function ContactEditable({ contact }) {
    const onSave = (values) => {
        new Contact({ name: contact.name, ruc: contact.ruc, ...values }, contact.id).upload()
    }

    const onDelete = () => {
        contact.delete()
    }

    return <>
        <HStack width='100%'>
            <VStack width='100%' alignItems='stretch'>
                <Editable defaultValue={contact.name} onSubmit={value => onSave({ name: value })}>
                    <EditablePreview />
                    <EditableInput />
                </Editable>
                <Editable defaultValue={contact.ruc} onSubmit={value => onSave({ ruc: value })}>
                    <EditablePreview />
                    <EditableInput />
                </Editable>
            </VStack>

            <IconButton icon={<Icon>{trashPath}</Icon>} onClick={onDelete} />
        </HStack>
        <Divider />
    </>
}