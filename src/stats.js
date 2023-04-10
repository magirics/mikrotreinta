import Dinero from "dinero.js"
import { months } from "./util"

export async function transactionsStats(transactions, currency, ops) {
    const zero = Dinero({ amount: 0, currency })
    let transactionsStats = {}
    for (const t of transactions) {
        const money = await transactionsStats[t.date.month()]
        const total = await t.total.convert(currency, ops)
        transactionsStats[t.date.month()] = total.add(money || zero)
    }

    let data = []
    for (const key in transactionsStats) {
        const money = await transactionsStats[key].convert(currency, ops)
        data.push({
            'x': months[Number.parseInt(key, 10)],
            'y': money.toRoundedUnit(0),
        })
    }

    return data
}

export async function productsStats(transactions, currency, ops) {
    const zero = Dinero({ amount: 0, currency })
    const products = transactions.flatMap(t => t.products)

    let productsData = {}
    for (const p of products) {
        const money = await productsData[p.name]
        const total = await p.total.convert(currency, ops)
        productsData[p.name] = total.add(money || zero)
    }

    let data = []
    for (const key in productsData) {
        const money = await productsData[key].convert(currency, ops)
        data.push({
            'x': key,
            'y': money.toRoundedUnit(0),
        })
    }

    return data
}

export async function contactsStats(transactions, currency, ops) {
    const zero = Dinero({ amount: 0, currency })
    let clientsData = {}
    for (const t of transactions) {
        const money = await clientsData[t.contact.name]
        const total = await t.total.convert(currency, ops)
        clientsData[t.contact.name] = total.add(money || zero)
    }

    let data = []
    for (const key in clientsData) {
        const money = await clientsData[key].convert(currency, ops)
        data.push({
            'x': key,
            'y': money.toRoundedUnit(0),
        })
    }

    return data
}