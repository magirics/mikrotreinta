import { Divider, Input, Text, Wrap, WrapItem } from "@chakra-ui/react"
import dayjs from "dayjs"
import { Form, Formik } from "formik"
import { useContext, useState } from "react"
import { GlobalDataContext } from "../../App"
import { dateFormat } from "../../util"
import DateRangeFilter from "./DateRangeFilter"


export default function TransactionsFilter({ onChange }) {
    const { dateRange, setDateRange } = useContext(GlobalDataContext)

    return <Wrap margin='0.5rem 0 0 0' padding='0.5rem' align='center' bgColor='white'>
        <WrapItem>
            <Input type="search" placeholder='Concepto' onChange={onChange}></Input>
        </WrapItem>
        <Divider orientation='vertical' padding='1rem 0'></Divider>
        <WrapItem>
            <DateRangeFilter
                startDate={dateRange.start.format(dateFormat)}
                endDate={dateRange.end.format(dateFormat)}
                onChange={range => setDateRange(
                    {
                        start: dayjs(range.start, dateFormat),
                        end: dayjs(range.end, dateFormat),
                    }
                )}
            ></DateRangeFilter>
        </WrapItem>
    </Wrap >
}

