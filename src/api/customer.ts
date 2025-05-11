// src/api/customer.ts
import axios from 'axios'

export interface MenuDTO {
  id: number
  name: string
  description: string
  price: number
  isAvailable: boolean
  imageUrl?: string | null
}

export interface OrderItemDTO {
  menuId: number
  quantity: number
}

export interface OrderResponseDTO {
  orderId: number
  tableNumber: number
  items: { menuName: string; quantity: number; price: number }[]
  status: string
  estimatedAt?: string
}

export interface TableOrderResponseDTO {
  tableNumber: number
  items: { menuName: string; quantity: number; price: number }[]
  totalAmount: number
}

export interface TableSummaryResponseDTO {
  tableNumber: number
  totalOrders: number
  totalSpent: number
  lastOrderAt: string
}

type CommonResp<T> = { data: T; message: string }

const API_BASE = import.meta.env.VITE_API_BASE_URL as string

const customerApi = axios.create({
  baseURL: `${API_BASE}/customer`,    // ← /customer 대신 전체 백엔드 URL + /customer
  headers: { 'Content-Type': 'application/json' }
})

// 1) 메뉴 조회
export const fetchCustomerMenus = () =>
  customerApi.get<CommonResp<MenuDTO[]>>('/menus')

// 2) 주문 생성
export const postCustomerOrder = (tableNumber: number, items: OrderItemDTO[]) =>
  customerApi.post<CommonResp<OrderResponseDTO>>('/orders', { tableNumber, items })

// 3) 해당 테이블 오늘 주문 조회
export const fetchTableOrders = (tableNumber: number) =>
  customerApi.get<CommonResp<TableOrderResponseDTO>>(`/orders/table/${tableNumber}`)

// 4) 주문 상세(status) 조회
export const fetchOrderStatus = (orderId: number) =>
  customerApi.get<CommonResp<OrderResponseDTO>>(`/orders/${orderId}`)

// 5) 테이블 요약
export const fetchCustomerTableSummary = (tableNumber: number) =>
  customerApi.get<CommonResp<TableSummaryResponseDTO>>(`/tables/${tableNumber}/summary`)

// 6) 요청(벨) 보내기
export const postCustomerRequest = (tableNumber: number, note: string) =>
  customerApi.post<CommonResp<null>>('/requests', { tableNumber, note })

export default customerApi
