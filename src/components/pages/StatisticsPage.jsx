import { Box, Text, VStack, Wrap } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useContext, useEffect, useState } from 'react'
import {
    Bar, BarChart, CartesianGrid, LabelList, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis,
    YAxis
} from 'recharts'
import { GlobalDataContext } from '../../App'
import { contactsStats, productsStats, transactionsStats } from '../../stats'
import { dateFormat } from '../../util'
import DateRangeFilter from '../filters/DateRangeFilter'

export default function StatisticsPage() {
    const [salesData, setSalesData] = useState()
    const [productsData, setProductData] = useState()
    const [clientsData, setClientsData] = useState()

    const { dateRange, setDateRange } = useContext(GlobalDataContext)
    const { transactions, currency, opsRates } = useContext(GlobalDataContext)

    useEffect(() => {
        (async () => {

            const data = transactions.filter(t => t.type === 'sale')
            setSalesData(await transactionsStats(data, currency === 'default' ? 'USD' : currency, opsRates))
            setProductData(await productsStats(data, currency === 'default' ? 'USD' : currency, opsRates))
            setClientsData(await contactsStats(data, currency === 'default' ? 'USD' : currency, opsRates))

        })()
    }, [dateRange, transactions, currency, opsRates])

    return <VStack alignItems='stretch' padding='1rem'>
        <DateRangeFilter
            startDate={dateRange.start.format(dateFormat)}
            endDate={dateRange.end.format(dateFormat)}
            onChange={({ start, end }) => setDateRange({
                start: dayjs(start, dateFormat),
                end: dayjs(end, dateFormat)
            })}
        />

        <MyLineChart data={salesData} />
        <Wrap>
            <MyPieChart data={productsData} label='Productos' />
            <MyPieChart data={clientsData} label='Clientes' />
        </Wrap>
    </VStack>
}

function MyLineChart({ data }) {
    return <Box bgColor='white' maxWidth='40rem' padding='0.5rem'>
        <Text fontSize='lg'>Ventas</Text>
        <ResponsiveContainer width='100%' height={250}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="-y" fill="#F56565" />
                <Bar dataKey="y" fill="#48BB78" />
            </BarChart>
        </ResponsiveContainer>
    </Box>
}

function MyPieChart({ data, label }) {
    return <Box bgColor='white' padding='0.5rem'>
        <Text fontSize='lg'>{label}</Text>
        <PieChart width={250} height={250}>
            <Pie data={data} dataKey="y" nameKey="x" fill="#9F7AEA">
                <LabelList dataKey='x' />
            </Pie>
            <Tooltip />
        </PieChart>
    </Box>
}