import { Box, Text, Wrap } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import { dateFormat } from "../../util";

export default function DateRangeFilter({ startDate, endDate, onChange }) {
    const [start, setStart] = useState(startDate)
    const [end, setEnd] = useState(endDate)

    return <Wrap>
        <input
            type='date'
            onChange={ev => {
                setStart(ev.target.value)
                onChange({
                    start: ev.target.value,
                    end
                })
            }}
            defaultValue={start}
        ></input>
        <input
            type='date'
            onChange={ev => {
                setEnd(ev.target.value)
                onChange({
                    start,
                    end: ev.target.value,
                })
            }}
            defaultValue={end}
        ></input>
    </Wrap>
}

{/* <Box width='1rem' overflow='hidden' position='relative'>
    <Box position='absolute' left='-750%'>
        <input
            type='date'
            onChange={el => { setEnd(el.value); onChange({ start, end: el.value }) }}
            value={getLastMonthsRange().end}
        ></input>
    </Box>
</Box> */}