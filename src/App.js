import { ChakraProvider, useForceUpdate } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { collection, doc, onSnapshot, query, where } from "firebase/firestore"
import React, { createContext, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HeaderBar from './components/bars/HeaderBar'
import BalancePage from './components/pages/BalancePage'
import InventoryPage from './components/pages/InventoryPage'
import LoginPage from './components/pages/LoginPage'
import StatisticsPage from './components/pages/StatisticsPage'
import theme from './components/theme'
import { firestore } from "./firebase"
import { Contact, Product, Transaction } from './util'
import Dinero from 'dinero.js'

Dinero.globalFormat = '$0.00'
Dinero.globalLocale = 'es-PE'

const initialRates = {
  'USD': { 'PEN': '0', 'USD': '0' },
  'PEN': { 'USD': '0', 'PEN': '0' },
}

const initialOpsRates = {
  endpoint: new Promise(resolve => resolve(initialRates)),
  propertyPath: '{{from}}.{{to}}',
  rates: initialRates,
}

const initialDateRange = {
  start: dayjs().subtract(12, 'month').date(1),
  end: dayjs().add(1, 'month'),
}

export const GlobalDataContext = createContext()

export default function () {
  const [inventory, setInventory] = useState([])
  const [transactions, setTransactions] = useState([])
  const [contacts, setContacts] = useState([])
  const [currency, setCurrency] = useState('default')
  const [opsRates, setOpsRates] = useState(initialOpsRates)
  const [dateRange, setDateRange] = useState(initialDateRange)
  const [account, setAccount] = useState(localStorage.getItem('account'))

  const globalData = {
    inventory, transactions, contacts,
    currency, setCurrency,
    opsRates, setOpsRates,
    dateRange, setDateRange,
    account, setAccount,
  }

  useEffect(() => {

    const ref = doc(collection(firestore, "currency"), 'rates')
    const unsuscribe = onSnapshot(ref, (snapshot => {
      const data = snapshot.data()
      const newOpsRates = {
        endpoint: new Promise(resolve => resolve(data)),
        propertyPath: '{{from}}.{{to}}',
        rates: data,
      }
      setOpsRates(newOpsRates)
    }))

  }, [])

  useEffect(() => {

    const ref = collection(firestore, "inventory")
    const unsuscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map(p => new Product(p.data(), p.id))
      setInventory(data)
    })

  }, [])

  useEffect(() => {

    const ref = collection(firestore, "transactions")
    const que = query(ref,
      where('date', '>=', dateRange.start.toDate()),
      where('date', '<=', dateRange.end.toDate()),
    )
    const unsuscribe = onSnapshot(que, (snapshot) => {
      const data = snapshot.docs.map(t => new Transaction(t.data(), t.id))
      setTransactions(data)
    })

  }, [dateRange])

  useEffect(() => {

    const ref = collection(firestore, "contacts")
    const unsuscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map(c => new Contact(c.data(), c.id))
      setContacts(data)
    })

  }, [])

  return <ChakraProvider theme={theme}>
    <GlobalDataContext.Provider value={globalData}>
      <BrowserRouter>

        {account && <HeaderBar />}
        <Routes>
          {!account && <Route path="/login" element={<LoginPage />}></Route>}
          {account &&
            <>
              <Route path="/inventory" element={<InventoryPage />}></Route>
              <Route path="/balance" element={<BalancePage />}></Route>
              <Route path="/statistics" element={<StatisticsPage />}></Route>
            </>
          }
        </Routes>

      </BrowserRouter>
    </GlobalDataContext.Provider>
  </ChakraProvider>
}

// {/* <NavBar></NavBar> */}
// {/*bgColor='gray.50'> width='calc(100% - 225px)' */}