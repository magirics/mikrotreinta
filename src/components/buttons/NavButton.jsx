import { Button } from "@chakra-ui/react";
import { forwardRef } from "react";
import { NavLink } from "react-router-dom";

export default forwardRef(
    ({ children, ...props }, ref) =>
        <Button
            ref={ref}
            justifyContent='start'
            borderRadius='md'
            width='100%'
            variant='ghost'
            iconSpacing='4'
            fontWeight='normal'
            fill={props.color}
            {...props}
            _activeLink={{
                bgColor: 'yellow.200',
                fontWeight: 'semibold',
                _before: {
                    content: `''`,
                    width: '4px',
                    height: '100%',
                    bgColor: 'yellow.400',
                    position: 'absolute',
                    left: '-12px'
                }
            }}
        >
            {children}
        </Button >
)