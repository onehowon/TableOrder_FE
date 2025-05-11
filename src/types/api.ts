// src/api.ts
import axios from 'axios'

/**── Axios 인스턴스 ────────────────────────────────────**/
const API_BASE = import.meta.env.VITE_API_BASE_URL
const api = axios.create({
  baseURL: `${API_BASE}/admin`,
  headers: { 'Content-Type': 'application/json' },
})

/**── DTO 정의 ───────────────────────────────────────────**/
// 주문 알림
export interface OrderAlertDTO {
  tableNumber: number
  items: { menuName: string; quantity: number }[]
  createdAt: string
}

// 주문 상세
export interface OrderDetailDTO {
  orderId:     number
  tableNumber: number
  items:       { menuName: string; quantity: number }[]
  status:      'WAITING'|'PREPARING'|'DONE'
  createdAt:   string
}

// 테이블 요약
export interface TableSummaryDTO {
  tableNumber: number
  totalOrders: number
  totalSpent:  number
  lastOrderAt: string
}

// 매출 통계
export interface SalesStatsDTO {
  totalCustomers: number
  totalOrders:    number
  totalRevenue:   number
  salesByHour:    Record<string, number>
}

/**── API 함수 ───────────────────────────────────────────**/
export const listOrders = () =>
  api.get<{ data: OrderDetailDTO[] }>('/orders')

export interface StatusUpdateReq {
  status: 'PREPARING' | 'DONE'
}
export const updateOrderStatus = (orderId: number, body: StatusUpdateReq) =>
  api.put<{ data: OrderDetailDTO }>(`/orders/${orderId}/status`, body)

export const getAlerts = () =>
  api.get<{ data: OrderAlertDTO[] }>('/alerts')

export const getTableSummary = (tableNumber: number) =>
  api.get<{ data: TableSummaryDTO }>(`/tables/${tableNumber}/summary`)

export const getSalesStats = () =>
  api.get<{ data: SalesStatsDTO }>('/sales')

export default api
