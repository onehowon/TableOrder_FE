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

// 백엔드 enum 그대로
export type OrderStatus = 'WAITING' | 'COOKING' | 'SERVED'

export interface OrderItemDTO {
  name: string
  quantity: number
}

export interface OrderAlertDTO {
  tableNumber: number
  items: { menuName: string; quantity: number }[]
  createdAt: string
}

export interface OrderDetailDTO {
  orderId:     number
  tableNumber: number
  items:       OrderItemDTO[]
  status:      OrderStatus
  createdAt:   string
  estimatedTime?: number
}

// ── DTO 타입 정의 ───────────────────────────────────────
export interface TableSummaryResponse {
  tableNumber: number

  // 백엔드에서 실제 내려주는 필드는 totalAmount 입니다
  totalOrders: number
  totalAmount: number

  // (summary-all 응답에 포함되는) 메뉴별 집계
  items: {
    name: string
    quantity: number
    totalPrice: number
  }[]
}


export interface HourlySales {
  hour:   number
  amount: number
}

export interface SalesStatsDTO {
  totalCustomers: number
  totalOrders:    number
  totalRevenue:   number
  salesByHour:    HourlySales[]
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

/**── 메뉴 관리 ───────────────────────────────────────────**/
export const createMenu     = (fd: FormData) => api.post<CommonResp<MenuDTO>>('/menus', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateMenu     = (id: number, fd: FormData) => api.put<CommonResp<MenuDTO>>(`/menus/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteMenu     = (id: number) => api.delete<CommonResp<null>>(`/menus/${id}`)
export const activateMenu   = (id: number) => api.put<CommonResp<null>>(`/menus/${id}/activate`)
export const deactivateMenu = (id: number) => api.put<CommonResp<null>>(`/menus/${id}/deactivate`)
export const listMenus      = () => api.get<CommonResp<MenuDTO[]>>('/menus')

/**── 주문 관리 ───────────────────────────────────────────**/
export const listOrders = () =>
  api.get<CommonResp<OrderDetailDTO[]>>('/orders')

// 상태 변경 요청 DTO: COOKING or SERVED + optional ETA
export interface StatusUpdateReq {
  status: 'COOKING' | 'SERVED'
  estimatedTime?: number
}
export const updateOrderStatus = (orderId: number, body: StatusUpdateReq) =>
  api.put<CommonResp<OrderDetailDTO>>(`/orders/${orderId}/status`, body)

/**── 알림 ─────────────────────────────────────────────────**/
export const getAlerts = () =>
  api.get<CommonResp<OrderAlertDTO[]>>('/alerts')

// ── 테이블 요약 ──────────────────────────────────────────
export const getTableSummary     = (tableNumber: number) =>
  api.get<CommonResp<TableSummaryResponse>>(`/tables/${tableNumber}/summary`)
export const getAllTablesSummary = () =>
  api.get<CommonResp<TableSummaryResponse[]>>('/tables/summary-all')

// ── 테이블 초기화 ────────────────────────────────────────
export const resetTable = (tableNumber: number) =>
  api.delete<CommonResp<null>>(`/tables/${tableNumber}/reset`)

/**── 고객 요청 전송 ───────────────────────────────────────**/
export const postRequest   = (body: RequestDTO) =>
  api.post<CommonResp<null>>('/requests', body)

/**── 매출 통계 ───────────────────────────────────────────**/
export const getTodaySummary = () =>
  api.get<CommonResp<any>>('/orders/today-summary')
export const getSalesStats   = () =>
  api.get<CommonResp<SalesStatsDTO>>('/sales')



export default api
