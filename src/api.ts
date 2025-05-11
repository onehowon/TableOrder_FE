import axios from 'axios'

/**── 공통 타입 ───────────────────────────────────────────**/
type CommonResp<T> = { data: T; message: string }

/**── DTO 타입 정의 ───────────────────────────────────────**/  
export interface MenuDTO {
  id: number
  name: string
  description: string
  price: number
  isAvailable: boolean
  imageUrl?: string | null
}

export type OrderStatus = 'WAITING' | 'COOKING' | 'SERVED'


export interface OrderItemDTO {
  name: string
  quantity: number
}

export interface OrderAlertDTO {
  tableNumber: number
  items: OrderItemDTO[]
  createdAt: string   // ISO timestamp
}

export interface StatusUpdateReq {
  status: 'PREPARING' | 'DONE'   // ← 서버가 실제로 기대하는 값
  estimatedTime?: number
}
export interface OrderDetailDTO {
  orderId:     number
  tableNumber: number
  items:       { name: string; quantity: number }[]
  status:      'WAITING' | 'PREPARING' | 'DONE'    // ← COOKING/SERVED 가 아니라 PREPARING/DONE
  createdAt:   string
}

export interface SalesSummaryDTO {
  totalCustomers: number
  totalOrders: number
  totalSalesAmount: number
  hourlySales: { hour: number; amount: number }[]
}

export interface TableSummaryResponse {
  tableNumber: number
  totalOrders: number    // 백엔드: totalOrders
  totalSpent: number     // 백엔드: totalSpent
  lastOrderAt: string    // 백엔드가 내려주는 lastOrderAt
}

export interface HourlySales {
  hour: number
  amount: number
}

export interface SalesStatsDTO {
  totalCustomers: number
  totalOrders: number
  totalRevenue: number
  /** 백엔드가 0~23시를 채워서 내려주는 배열 */
  salesByHour: HourlySales[]
}

export interface RequestDTO {
  tableNumber: number
  items: { menuId: number; quantity: number }[]
}

/**── Axios 인스턴스 ────────────────────────────────────**/
const API_BASE = import.meta.env.VITE_API_BASE_URL as string
const api = axios.create({
  baseURL: `${API_BASE}/admin`,
  headers: { 'Content-Type': 'application/json' }
})

/**── API 함수 모음 ───────────────────────────────────────**/
// 메뉴 관리
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

// 주문 관리
export const listOrders = () =>
  api.get<CommonResp<OrderDetailDTO[]>>('/orders')


export interface StatusUpdateReq {
  status: 'PREPARING' | 'DONE'   // ← 서버가 실제로 기대하는 값
  estimatedTime?: number
}
export const updateOrderStatus = (orderId: number, body: StatusUpdateReq) =>
  api.put<CommonResp<OrderDetailDTO>>(`/orders/${orderId}/status`, body)

// 알림
export const getAlerts = () =>
  api.get<CommonResp<OrderAlertDTO[]>>('/alerts')

// 테이블 요약
export const getTableSummary = (tableNumber: number) =>
  api.get<CommonResp<TableSummaryResponse>>(`/tables/${tableNumber}/summary`)
export const getAllTablesSummary = () =>
  api.get<CommonResp<TableSummaryResponse[]>>('/tables/summary-all')

// 고객 요청 전송
export const postRequest = (body: RequestDTO) =>
  api.post<CommonResp<null>>('/requests', body)

// 오늘 매출 요약
export const getTodaySummary = () =>
  api.get<CommonResp<SalesSummaryDTO>>('/orders/today-summary')

// 매출 통계
export const getSalesStats = () =>
  api.get<CommonResp<SalesStatsDTO>>('/sales')

export default api