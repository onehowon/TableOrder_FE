// src/api.ts
import axios from 'axios'

/**── 공통 타입 ───────────────────────────────────────────**/
export type CommonResp<T> = { data: T; message: string }

/**── DTO 타입 정의 ───────────────────────────────────────**/
export interface MenuDTO {
  id: number
  name: string
  description: string
  price: number
  isAvailable: boolean
  imageUrl?: string | null
}

export interface CustomerRequestDTO {
  id: number
  tableNumber: number
  createdAt: string
}

export interface RequestDTO {
  tableNumber: number
}

export type OrderStatus = 'WAITING' | 'DELETED' | 'SERVED'

export interface OrderItemDTO {
  name: string
  quantity: number
}

export interface OrderRequestDTO {
  tableNumber: number
  items: { menuId: number; quantity: number }[]
}
export interface OrderAlertDTO {
  tableNumber: number
  items: { menuName: string; quantity: number }[]
  createdAt: string
}

export interface OrderDetailDTO {
  orderId: number
  tableNumber: number
  items: OrderItemDTO[]
  status: OrderStatus
  createdAt: string
  estimatedTime?: number
}

export interface TableSummaryResponse {
  tableNumber: number
  totalOrders: number
  totalAmount: number
  items: {
    name: string
    quantity: number
    totalPrice: number
  }[]
}

export interface SalesStatsDTO {
  totalCustomers: number
  totalOrders: number
  totalRevenue: number
  salesByHour: { hour: number; revenue: number }[]
}

/**── 환경 변수에서 API 베이스 URL 하나만 읽습니다 ───────────────────**/
const API_BASE = import.meta.env.VITE_API_BASE_URL as string

/**── 관리자용 axios 인스턴스 (/admin/**) ─────────────────────────**/
const adminApi = axios.create({
  baseURL: `${API_BASE}/admin`,
  headers: { 'Content-Type': 'application/json' }
})

/**── 고객용 axios 인스턴스 (그 외 /customer, /menus 등) ─────────────────**/
export const customerApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

/**── 관리자 API ───────────────────────────────────────────**/
// 메뉴 관리
export const createMenu = (fd: FormData) =>
  adminApi.post<CommonResp<MenuDTO>>(
    '/menus', fd,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
export const updateMenu = (id: number, fd: FormData) =>
  adminApi.put<CommonResp<MenuDTO>>(
    `/menus/${id}`, fd,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
export const deleteMenu = (id: number) =>
  adminApi.delete<CommonResp<null>>(`/menus/${id}`)
export const activateMenu = (id: number) =>
  adminApi.put<CommonResp<null>>(`/menus/${id}/activate`)
export const deactivateMenu = (id: number) =>
  adminApi.put<CommonResp<null>>(`/menus/${id}/deactivate`)
export const listAdminMenus = () =>
  adminApi.get<CommonResp<MenuDTO[]>>('/menus')

// 주문 관리
export const listOrdersAdmin = () =>
  adminApi.get<CommonResp<OrderDetailDTO[]>>('/orders')

export const listRequestsAdmin = () =>
  adminApi.get<CommonResp<CustomerRequestDTO[]>>('/requests');

export interface StatusUpdateReq {
  status: 'WAITING' | 'SERVED' | 'DELETED'
  estimatedTime?: number
}

export const deleteRequest     = (id: number) =>
  adminApi.delete<CommonResp<null>>(`/requests/${id}`);


export const updateOrderStatus = (
  orderId: number,
  body: StatusUpdateReq
) => adminApi.put<CommonResp<OrderDetailDTO>>(
  `/orders/${orderId}/status`, body
)

// 알림
export const getAlertsAdmin = () =>
  adminApi.get<CommonResp<OrderAlertDTO[]>>('/alerts')

// 테이블 요약
export const getAllTablesSummaryAdmin = () =>
  adminApi.get<CommonResp<TableSummaryResponse[]>>('/tables/summary-all')
export const getTableSummaryAdmin = (tableNumber: number) =>
  adminApi.get<CommonResp<TableSummaryResponse>>(
    `/tables/${tableNumber}/summary`
)

// 테이블 리셋
export const resetTableAdmin = (tableNumber: number) =>
  adminApi.delete<CommonResp<null>>(`/tables/${tableNumber}/reset`)

// 매출 통계
export const getSalesStatsAdmin = () =>
  adminApi.get<CommonResp<SalesStatsDTO>>('/sales')

/**── 고객용 API ───────────────────────────────────────────**/
// 메뉴 조회
export const listMenus = () =>
  customerApi.get<CommonResp<MenuDTO[]>>('/customer/menus')

export const postOrder = (body: OrderRequestDTO) =>
  customerApi.post<CommonResp<OrderDetailDTO>>('/customer/orders', body)

// 주문/요청 전송
export const postRequest = (body: RequestDTO) =>
  customerApi.post<CommonResp<null>>('/customer/requests', body)

// 테이블별 주문 현황 조회
export const getTableOrders = (tableNumber: number) =>
  customerApi.get<CommonResp<OrderDetailDTO>>(
    `/customer/orders/table/${tableNumber}`
)

// 개별 주문 상태 조회
export const getOrderStatusCustomer = (orderId: number) =>
  customerApi.get<CommonResp<OrderDetailDTO>>(
    `/customer/orders/${orderId}`
  )

// 테이블 요약 (고객)
export const getTableSummary = (tableNumber: number) =>
  customerApi.get<CommonResp<TableSummaryResponse>>(
    `/customer/tables/${tableNumber}/summary`
)

// 전체 테이블 요약 (고객)
export const getAllTablesSummaryCustomer = () =>
  customerApi.get<CommonResp<TableSummaryResponse[]>>(
    `/customer/tables/summary-all`
  )

// 당일 테이블 매출 요약 (고객)
export const getTodaySummary = () =>
  customerApi.get<CommonResp<any>>('/customer/orders/today-summary')

// 고객 매출 통계
export const getCustomerSalesStats = () =>
  customerApi.get<CommonResp<SalesStatsDTO>>('/customer/sales')

/**── Admin 페이지 호환용 alias & default export ───────────────────**/
export default adminApi
export const listOrders = listOrdersAdmin
export const getAlerts = getAlertsAdmin
export const resetTable = resetTableAdmin
export const getAllTablesSummary = getAllTablesSummaryAdmin
export const getSalesStats = getSalesStatsAdmin
