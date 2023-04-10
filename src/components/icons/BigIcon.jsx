import { Center, Icon } from "@chakra-ui/react";

export default ({ children, ...props }) =>
    <Center width='56px' height='56px' bgColor={props.color + '.100'} borderRadius='md' {...props}>
        <Icon width='30px' height='30px' fill={props.color + '.600'} {...props}>
            {children}
        </Icon>
    </Center>