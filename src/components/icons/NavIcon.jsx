import { Icon } from "@chakra-ui/react";

export default ({ children, ...props }) =>
        <Icon width='16px' height='16px' {...props}>
            {children}
        </Icon>