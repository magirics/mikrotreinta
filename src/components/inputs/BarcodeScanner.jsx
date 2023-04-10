import React, { useEffect, useState } from 'react'
import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    InputGroup,
    Input,
    InputRightElement,
    IconButton,
    Icon,
    FormControl,
    FormLabel,
    Center,
} from '@chakra-ui/react'
import { Field } from "formik"
import Quagga from 'quagga'
import { cameraPath } from '../paths'

export default function BarcodeScanner({ name }) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return <>
        <Field name={name}>
            {
                ({ form }) => <>
                    <BarcodeScannerInput
                        value={form.values[name]}
                        name={name}
                        onOpen={onOpen}
                        onChange={ev => form.setFieldValue(name, ev.target.value)}
                    />

                    <Modal onClose={onClose} size='full' isOpen={isOpen}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalCloseButton zIndex={1} />
                            <ModalBody padding='0' height='100vh' width='100vw'>
                                <Center width='100vw' height='100vh'>
                                    <BarcodeScannerVideo
                                        onDetect={value => form.setFieldValue(name, value)}
                                        onClose={onClose}
                                    ></BarcodeScannerVideo>
                                </Center>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </>
            }
        </Field>
    </>
}

function BarcodeScannerInput({ onOpen, onChange, value }) {

    return <InputGroup>
        <Input value={value} onChange={onChange}>
        </Input>
        <InputRightElement>
            <IconButton onClick={onOpen} icon={<Icon>{cameraPath}</Icon>}></IconButton>
        </InputRightElement>
    </InputGroup>
}

function BarcodeScannerVideo({ onDetect, onClose }) {
    useEffect(() => {

        Quagga.init(
            {
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector('#camera')
                },
                decoder: {
                    readers: ["code_128_reader"]
                },
            },
            (err) => {
                if (err) {
                    console.log(err)
                    return
                }

                console.log("Initialization finished. Ready to start")
                Quagga.start()
            })

        Quagga.onDetected((data) => {
            console.log(data)
            if (data.codeResult.code) {
                Quagga.stop()
                Quagga.offProcessed()
                onDetect(data.codeResult.code)
                onClose()
            }
        })

    }, [])

    return <div
        id="camera"
        className="viewport"
        style={{ display: 'inline-block' }}
    >
        <video
            className="videoCamera"
            preload="auto"
            style={{
                width: '100vw',
                height: '100vh',
                objectFit: 'scale-down',
            }}
            src=""
            muted
            autoPlay
            playsInline
        ></video>
        <canvas className="drawingBuffer" style={{ display: 'none' }}></canvas>
    </div>
}