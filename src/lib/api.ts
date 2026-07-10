// All paths go through Next.js rewrite → Spring Boot (configured in next.config.js).
// No absolute URL needed — this works in both dev and prod builds.
const BASE = '/api'

export interface MoneyEntry {
  id: number
  price: number
  note: string
  date: string        // "YYYY-MM-DD"
  createdAt: string
}

export interface MoneyEntryRequest {
  price: number
  note: string
  date: string
}

export interface Summary {
  period: string
  startDate: string
  endDate: string
  totalAmount: number
  entryCount: number
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `HTTP ${res.status}`)
  }
  // 204 No Content has no body
  if (res.status === 204) return undefined as T
  return res.json()
}

export type Urgency = 'LOW' | 'MEDIUM' | 'HIGH'
export type ItemStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED'

export interface ShoppingItem {
  id: number
  name: string
  urgency: Urgency
  status: ItemStatus
  createdAt: string
}

export interface ShoppingItemRequest {
  name: string
  urgency: Urgency
  status?: ItemStatus
}

export const moneyApi = {
  getAll: () =>
    request<MoneyEntry[]>(`${BASE}/money`),

  create: (data: MoneyEntryRequest) =>
    request<MoneyEntry>(`${BASE}/money`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  update: (id: number, data: MoneyEntryRequest) =>
    request<MoneyEntry>(`${BASE}/money/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`${BASE}/money/${id}`, { method: 'DELETE' }),

  getSummary: (period: 'daily' | 'weekly' | 'monthly') =>
    request<Summary>(`${BASE}/money/summary/${period}`),
}

export const shoppingApi = {
  getAll: () =>
    request<ShoppingItem[]>(`${BASE}/shopping`),

  create: (data: ShoppingItemRequest) =>
    request<ShoppingItem>(`${BASE}/shopping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  update: (id: number, data: ShoppingItemRequest) =>
    request<ShoppingItem>(`${BASE}/shopping/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`${BASE}/shopping/${id}`, { method: 'DELETE' }),
}