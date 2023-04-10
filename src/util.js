import dayjs from "dayjs"
import Dinero from "dinero.js"
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore"
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { firestorage, firestore } from "./firebase"

export const dateFormat = 'YYYY-MM-DD'
export const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Agosto', 'Noviembre', 'Diciembre']

export function number_to_money(number) {
    if (typeof number !== 'number') throw new TypeError(`Expected a number, but got a ${typeof number} with value ${number}`)
    if (!Number.isSafeInteger(number)) throw new Error(`Expected a safe integer, but got a ${number}`)
    if (number < 0) throw new Error(`Expected a number bigger than or equal to 0, but got ${number}`)

    const text = number.toString()
    if (number >= 100) {
        const decimals = text.slice(-2)
        const integers = text.slice(0, -2)
        return integers + '.' + decimals
    } else {
        const decimals = text
        const integers = '0'
        return integers + '.' + decimals
    }
}

export function money_to_number(money) {
    if (typeof money !== 'string') throw new TypeError(`Expected a string, but got a ${typeof money} with value ${money}`)
    if (!money.match(/^\d+\.\d\d$/g)) throw new Error(`Expected a right formated string, but got ${money}`)

    return Number.parseInt(money.replace('.', ''), 10)
}

export class Product {
    id = null
    currency = null
    name = null
    _photos = null
    barcode = null
    _quantity = null
    _unitCost = null
    _unitPrice = null
    description = null

    constructor(product, id) {
        this.id = id
        this.currency = product.currency
        this.name = product.name
        this.photos = product.photos
        this.barcode = product.barcode
        this.quantity = product.quantity
        this.unitCost = product.unitCost
        this.unitPrice = product.unitPrice
        this.description = product.description
    }

    set photos(value) {
        this._photos = value.map(p => {
            if (typeof p === 'string' || p instanceof File) return p
            else throw new TypeError(`Expected a File or a string, but got a ${typeof p} with value ${p}`)
        })
    }
    get photos() { return this._photos }

    set quantity(value) {
        if (typeof value === 'string') this._quantity = Number.parseInt(value, 10)
        else if (typeof value === 'number') this._quantity = value
        else throw new TypeError(`Expected a number or a string, but got a ${typeof value} with value ${value}`)
    }
    get quantity() { return this._quantity }

    set unitCost(value) {
        if (value.getAmount) this._unitCost = value
        else if (typeof value === 'number') this._unitCost = Dinero({ amount: value, currency: this.currency })
        else if (typeof value === 'string') this._unitCost = Dinero({ amount: money_to_number(value), currency: this.currency })
        else throw new TypeError(`Expected a number, string or Dinero, but got a ${typeof value} with value ${value}`)
    }
    get unitCost() { return this._unitCost }

    set unitPrice(value) {
        if (value.getAmount) this._unitPrice = value
        else if (typeof value === 'number') this._unitPrice = Dinero({ amount: value, currency: this.currency })
        else if (typeof value === 'string') this._unitPrice = Dinero({ amount: money_to_number(value), currency: this.currency })
        else throw new TypeError(`Expected a number, string or Dinero, but got a ${typeof value} with value ${value}`)
    }
    get unitPrice() { return this._unitPrice }

    async upload() {
        let newProductData = {
            currency: this.currency,
            name: this.name,
            photos: [],
            barcode: this.barcode,
            quantity: this.quantity,
            unitCost: this.unitCost.getAmount(),
            unitPrice: this.unitPrice.getAmount(),
            description: this.description,
        }

        let newDocRef = null
        if (this.id) await setDoc(doc(collection(firestore, "inventory"), this.id), newProductData)
        else newDocRef = await addDoc(collection(firestore, "inventory"), newProductData)
        const currentId = newDocRef?.id || this.id

        for (const photo of this.photos) {
            if (photo instanceof File) newProductData.photos.push(await uploadPhoto(photo, currentId))
            else if (typeof photo === 'string') newProductData.photos.push(photo)
            else throw new TypeError(`Expected a File or a string, but got a ${typeof photo} with value ${photo}`)
        }

        await setDoc(doc(collection(firestore, "inventory"), currentId), newProductData)
    }

    async delete() {
        await deleteDoc(doc(collection(firestore, 'inventory'), this.id))

        const result = await listAll(ref(ref(firestorage, 'inventory'), this.id))
        for (const photoRef of result.items) await deleteObject(photoRef)
    }
}

async function uploadPhoto(file, folderName) {
    const photoRef = ref(ref(ref(firestorage, 'inventory'), folderName), file.name)
    const { metadata } = await uploadBytes(photoRef, file)
    const link = await getDownloadURL(ref(firestorage, metadata.fullPath))

    return link
}

export class Transaction {
    id = null
    currency = null
    type = null
    _number = null
    _date = null
    contact = null
    products = null

    constructor(transaction, id) {
        this.id = id
        this.currency = transaction.currency
        this.type = transaction.type
        this.date = transaction.date
        this.contact = transaction.contact
        this.number = transaction.number
        this.products = transaction.products.map(p => new TransactionProduct(p, transaction.currency))
    }


    get number() { return this._number }
    set number(value) {
        if (typeof value === 'string') this._number = Number.parseInt(value, 10)
        else if (typeof value === 'number') this._number = value
        else throw new TypeError(`Expected a number or a string, but got a ${typeof value} with value ${value}`)
    }

    set date(value) {
        if (typeof value === 'string') this._date = dayjs(value, dateFormat)
        else if (value instanceof Date) this._date = dayjs(value)
        else if (value.toDate) this._date = dayjs(value.toDate())
        else throw new TypeError(`Expected a string, a Date or a Firebase Date, but got a ${typeof value} with value ${value}`)
    }
    get date() { return this._date }

    get concept() {
        let productCount = {}
        for (const p of this.products) {
            productCount[p.name] = (productCount[p.name] || 0) + p.quantity
        }

        let newConcept = []
        for (const product in productCount) {
            const quantity = productCount[product] > 1 ? productCount[product] : ''
            newConcept.push(quantity + ' ' + product)
        }

        return newConcept.join(', ')
    }

    get total() {
        return this.products.reduce((acc, p) => acc.add(p.total), Dinero({ amount: 0, currency: this.currency }))
    }

    async upload() {
        const newTrasactionData = {
            currency: this.currency,
            type: this.type,
            date: this.date.toDate(),
            contact: this.contact,
            number: this.number,
            products: this.products.map((p) => (
                {
                    name: p.name,
                    unitPrice: p.unitPrice.getAmount(),
                    quantity: p.quantity,
                    description: p.description,
                }
            )),
        }

        if (this.id) await setDoc(doc(collection(firestore, "transactions"), this.id), newTrasactionData)
        else await addDoc(collection(firestore, "transactions"), newTrasactionData)
    }

    async delete() {
        await deleteDoc(doc(collection(firestore, "transactions"), this.id))
    }
}

export class TransactionProduct {
    currency = null
    name = null
    _unitPrice = null
    _quantity = null
    description = null

    constructor(transactionProduct, currency) {
        this.currency = currency
        this.name = transactionProduct.name
        this.unitPrice = transactionProduct.unitPrice
        this.quantity = transactionProduct.quantity
        this.description = transactionProduct.description
    }

    get total() {
        return this.unitPrice.multiply(this.quantity)
    }

    set unitPrice(value) {
        if (value.getAmount) this._unitPrice = value
        else if (typeof value === 'number') this._unitPrice = Dinero({ amount: value, currency: this.currency })
        else if (typeof value === 'string') this._unitPrice = Dinero({ amount: money_to_number(value), currency: this.currency })
        else throw new TypeError(`Expected a number, string or Dinero, but got a ${typeof value} with value ${value}`)
    }
    get unitPrice() { return this._unitPrice }

    set quantity(value) {
        if (typeof value === 'string') this._quantity = Number.parseInt(value, 10)
        else if (typeof value === 'number') this._quantity = value
        else throw new TypeError(`Expected a number or a string, but got a ${typeof value} with value ${value}`)
    }
    get quantity() { return this._quantity }
}

export class Contact {
    id = null
    name = null
    ruc = null

    constructor(contact, id) {
        this.id = id
        this.name = contact.name
        this.ruc = contact.ruc
    }

    async upload() {
        const newContactData = {
            name: this.name,
            ruc: this.ruc,
        }

        if (this.id) await setDoc(doc(collection(firestore, "contacts"), this.id), newContactData)
        else await addDoc(collection(firestore, "contacts"), newContactData)
    }

    async delete() {
        await deleteDoc(doc(collection(firestore, 'contacts'), this.id))
    }
}