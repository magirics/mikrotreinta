import {
    Button, Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverHeader,
    PopoverBody,
    HStack,
} from "@chakra-ui/react"

export default function DeleteButton({ onDelete, header, children }) {
    return <Popover>
        <PopoverTrigger>
            <Button bgColor='red.400'>{children}</Button>
        </PopoverTrigger>
        <PopoverContent width='14rem'>
            <PopoverArrow />
            <PopoverHeader>{header}</PopoverHeader>
            <PopoverBody>
                <HStack justifyContent='space-around'>
                    <Button onClick={onDelete}>Sí</Button>
                    <Button>No</Button>
                </HStack>
            </PopoverBody>
        </PopoverContent>
    </Popover>
}
