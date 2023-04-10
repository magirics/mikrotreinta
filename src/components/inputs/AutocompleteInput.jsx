import { Container, Input, Popover, PopoverAnchor, PopoverBody, PopoverContent, Text, useBoolean } from "@chakra-ui/react"
import { useState } from "react"

export default function AutocompleteInput({ value, options, onChange, ...props }) {
    const [suggestions, setSuggestions] = useState(options)
    const [visible, setVisible] = useBoolean(false)
    const [index, setIndex] = useState(0)

    function hide() {
        setIndex(0)
        setVisible.off()
    }

    function select(suggestion) {
        onChange(suggestion)
        hide()
    }

    const onClickSuggestion = (event) => {
        if (visible) {
            const selected = event.target.textContent
            select(selected)
        }
    }

    const onKeyDown = (event) => {
        if (visible) {
            const key = event.key
            if (key === "ArrowUp") {
                setIndex(loopByOne(index - 1, suggestions))
                event.preventDefault()
            }
            else if (key === "ArrowDown") {
                setIndex(loopByOne(index + 1, suggestions))
                event.preventDefault()
            }
            else if (key === "Enter") {
                const selected = suggestions[index]
                select(selected)
                event.preventDefault()
            }
            else if (key === "Escape") {
                hide()
                event.preventDefault()
            }
        }
    }

    const onChangeInput = (event) => {
        const value = event.target.value
        const suggs = options.filter(str => str.toLowerCase().includes(value.toLowerCase()))
        setSuggestions(suggs)

        if (value === '' || suggs.length === 0) hide()
        else setVisible.on()

        onChange(value)
    }

    return <Popover isOpen={visible} onOpen={setVisible.on} onClose={hide} autoFocus={false}>
        <PopoverAnchor>
            <Input onKeyDown={onKeyDown} onChange={onChangeInput} value={value} onBlur={hide} {...props} />
        </PopoverAnchor>
        <PopoverContent width={props.width}>
            <PopoverBody>
                {
                    suggestions.map((el, i) =>
                        <Container
                            key={i}
                            _hover={{ bgColor: 'yellow.100' }}
                            bgColor={index === i ? "yellow.200" : "white"}
                            onMouseDown={onClickSuggestion}

                        >
                            <Text>{el}</Text>
                        </Container>
                    )
                }
            </PopoverBody>
        </PopoverContent>
    </Popover>
}

function loopByOne(index, array) {
    const last = array.length - 1
    let i = index
    if (index < 0) i = last
    else if (last < index) i = 0

    return i
}