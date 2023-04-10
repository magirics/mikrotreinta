import { HStack, Text, VStack } from "@chakra-ui/react";
import BigIcon from "../icons/BigIcon";

export default function InfoCard({ color, path, label, value, ...props }) {
    return <HStack width='300px' boxShadow='md' borderRadius='md' spacing='0' bgColor='white'>
        <BigIcon color={color} margin='4' {...props}>{path}</BigIcon>
        <VStack spacing='0' alignItems='start'>
            <Text color='gray.500' fontSize='sm' fontWeight='semibold'>{label}</Text>
            <Text color={color} fontSize='xl' fontWeight='semibold'>{value}</Text>
        </VStack>
    </HStack>
}