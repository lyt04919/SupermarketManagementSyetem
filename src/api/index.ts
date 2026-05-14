export interface Product {
  id?: number
  code: string
  name: string
  supplierId: string
  price: number
  stock: number
  status: string
}

export interface Bill {
  id?: number
  orderNo: string
  customerName: string
  productName: string
  quantity: number
  totalAmount: number
  status: string
}

export interface Supplier {
  id?: number
  supplierId: string
  supplierName: string
  contact: string
  phone: string
  address: string
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://127.0.0.1:3001'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`
  const method = init?.method ?? 'GET'

  console.log('[api request]', method, url)

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  })

  console.log('[api response]', method, url, response.status)

  if (!response.ok) {
    throw new Error(`请求失败：${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const listProducts = () => request<Product[]>('/products')
export const listBills = () => request<Bill[]>('/bills')
export const listSuppliers = () => request<Supplier[]>('/suppliers')

export const createProduct = (product: Product) =>
  request<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(product)
  })

export const updateProduct = (id: number, product: Product) =>
  request<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product)
  })

export const deleteProduct = (id: number) =>
  request<void>(`/products/${id}`, {
    method: 'DELETE'
  })

export const createBill = (bill: Bill) =>
  request<Bill>('/bills', {
    method: 'POST',
    body: JSON.stringify(bill)
  })

export const updateBill = (id: number, bill: Bill) =>
  request<Bill>(`/bills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bill)
  })

export const deleteBill = (id: number) =>
  request<void>(`/bills/${id}`, {
    method: 'DELETE'
  })

export const createSupplier = (supplier: Supplier) =>
  request<Supplier>('/suppliers', {
    method: 'POST',
    body: JSON.stringify(supplier)
  })

export const updateSupplier = (id: number, supplier: Supplier) =>
  request<Supplier>(`/suppliers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(supplier)
  })

export const deleteSupplier = (id: number) =>
  request<void>(`/suppliers/${id}`, {
    method: 'DELETE'
  })
