// src/api.ts
import axios from 'axios'

/** 1) DTO 타입 정의 *****************************************/

export interface MenuDTO {
  id: number
  name: string
  description: string
  price: number
  isAvailable: boolean
  imageUrl?: string | null
}

export interface OrderItemDTO {
  menuName: string
  quantity: number
}

export interface OrderAlertDTO {
  tableNumber: number
  items: OrderItemDTO[]
  createdAt: string   // ISO timestamp
}

export interface OrderDetailDTO {
  orderId: number
  tableNumber: number
  items: OrderItemDTO[]
  status: string
  estimatedTime?: number
  createdAt: string
}

export interface SalesSummaryDTO {
  totalCustomers: number
  totalOrders: number
  totalSalesAmount: number
  hourlySales: { hour: number; amount: number }[]
}

export interface TableSummaryResponse {
  tableNumber: number
  ordersCount: number
  totalAmount: number
}

export interface SalesStatsDTO {
  totalCustomers: number
  totalOrders: number
  totalSales: number
  salesByHour: Record<string, number>
}

type CommonResp<T> = { data: T; message: string }

/** 2) Axios 인스턴스 ****************************************/

// 환경변수에서 베이스 URL 읽어오기 (VITE_ 접두사 필수)
const API_BASE = import.meta.env.VITE_API_BASE_URL as string

const api = axios.create({
  baseURL: `${API_BASE}/admin`,          // 👉 https://api.ebiztable.shop/admin/…
  headers: { 'Content-Type': 'application/json' }
})

/** 3) API 함수 모음 *****************************************/

// ─── 메뉴 관리 ────────────────────────────────────────────────
export const createMenu = (fd: FormData) =>
  api.post<CommonResp<MenuDTO>>('/menus', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const updateMenu = (id: number, fd: FormData) =>
  api.put<CommonResp<MenuDTO>>(`/menus/${id}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const deleteMenu = (id: number) =>
  api.delete<CommonResp<null>>(`/menus/${id}`)

export const activateMenu = (id: number) =>
  api.put<CommonResp<null>>(`/menus/${id}/activate`)

export const deactivateMenu = (id: number) =>
  api.put<CommonResp<null>>(`/menus/${id}/deactivate`)

export const listMenus = () =>
  api.get<CommonResp<MenuDTO[]>>('/menus')

// ─── 주문 관리 ────────────────────────────────────────────────
export const listOrders = () =>
  api.get<CommonResp<OrderDetailDTO[]>>('/orders')

export interface StatusUpdateReq {
  status: string
  estimatedTime?: number
}
export const updateOrderStatus = (orderId: number, body: StatusUpdateReq) =>
  api.put<CommonResp<OrderDetailDTO>>(`/orders/${orderId}/status`, body)

// ─── 오늘 매출 요약 ─────────────────────────────────────────────
export const getTodaySummary = () =>
  api.get<CommonResp<SalesSummaryDTO>>('/orders/today-summary')

// ─── 테이블 요약 ────────────────────────────────────────────────
export const getTableSummary = (tableNumber: number) =>
  api.get<CommonResp<TableSummaryResponse>>(`/tables/${tableNumber}/summary`)

export const getAllTablesSummary = () =>
  api.get<CommonResp<TableSummaryResponse[]>>('/tables/summary-all')

// ─── 임시: 고객 요청 전송 ────────────────────────────────────────
export interface RequestDTO {
  tableNumber: number
  items: { menuId: number; quantity: number }[]
}
export const postRequest = (body: RequestDTO) =>
  api.post<CommonResp<null>>('/requests', body)

// ─── 알림(새 주문) ─────────────────────────────────────────────
export const getAlerts = () =>
  api.get<CommonResp<OrderAlertDTO[]>>('/alerts')

// ─── 매출 통계 ─────────────────────────────────────────────────
export const getSalesStats = () =>
  api.get<CommonResp<SalesStatsDTO>>('/sales')

export default api
